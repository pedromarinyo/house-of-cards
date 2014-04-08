//Global Variables
//_________________________________
var stage, navigation_layer, annotation_layer, annotationItem_layer, gesture_layer;
var annotation_pane, annotationItem_pane;
var user = 0;
var sw = 1280; //Screen width
var sh = 720; //Screen height
var message = document.getElementById('message');

//States
var menuState = "root";
var summary = false;
var summaryFollowing;

//Content
var friends, characters, scenes, annotations; 
var userTimeline;

//Gesture delay
var delayGesture = false; 
var isGrabbing = false;

//Video
var video = document.getElementById('video');
var currScene = -1; //Starting state
var currAnnotation = -1; //Starting state

//Audio annotations
var recorder;
var recording = false;
var audioFileName;
var popcorn; //for syncing with video

//Global Functions
//__________________________________
function init() {
	//Creating stage
	stage = new Kinetic.Stage({
		container: "stage",
		width: sw,
		height: sh
	});   

	//Creating layers
	navigation_layer = new Kinetic.Layer({ x: 0, y: 720, opacity: 0 });
	annotation_layer = new Kinetic.Layer({x:0, y: 0, opacity: 0});
	annotationItem_layer = new Kinetic.Layer({ x: 1200, y: 0 });
	timeline_layer = new Kinetic.Layer({ x:0, y: 360, opacity: 0});
    gesture_layer = new Kinetic.Layer({ x:0, y: 0});
    
    //Loading image assets
	loadImages();

    //Create...
    //Character objects
    characters = new Array(
        new Character("frank"),
        new Character("zoe"),
        new Character("peter"),
        new Character("claire")
    );

	//Scene objects
	scenes =  new Array(
        new Scene(new Array(characters[0]), 0, 29), 
        new Scene(new Array(characters[2], characters[1]), 30, 59),
        new Scene(new Array(characters[0]), 60, 100), 
        new Scene(new Array(characters[1]), 120, 130), 
        new Scene(new Array(characters[0]), 200, 210),
        new Scene(new Array(characters[1]), 250, 260),
        new Scene(new Array(characters[0]), 300, 310),
        new Scene(new Array(characters[3]), 350, 360),
        new Scene(new Array(characters[0], characters[2]), 400, 410),
        new Scene(new Array(characters[0], characters[2]), 450, 460),
        new Scene(new Array(characters[1]), 500, 510),
        new Scene(new Array(characters[2]), 600, 610),
        new Scene(new Array(characters[3]), 700, 710)
    );

    //Friend objects
	friends = new Array(
        new Friend("Clutch Cargo"), 
        new Friend("Johnny Quest"), 
        new Friend("Capt. Picard")
    );

    //Fetch annotations from database
    annotations = new Array();
    $.ajax({
        type: "POST",
        url: "./scripts/serverContact.php",
        data: {action: 'get'},  
        dataType: "JSON",      
        success: function(data) {    
            data.forEach(function(entry) {
                var annotation = new Annotation(
                    entry.type,
                    entry.scene,
                    entry.timecode,
                    entry.endTime,
                    entry.usr,
                    entry.file,
                    entry.id
                );
                annotations.push(annotation);

            });
            console.log(annotations);
            //Annotation Pane
            annotation_pane = new AnnotationPane();
            annotation_pane.init();
        }
    });

    //Video sync
    popcorn = Popcorn( "#video" );

	//Navitation
    navigation_pane = new NavigationPane();
	navigation_pane.init();
    
    //Timeline
    timeline_pane = new TimelinePane();
    timeline_pane.init();
    
    //Annotation Item Pane
	annotationItem_pane = new AnnotationItemPane();
	annotationItem_pane.init();
    
    //Gesture Pane
    gesture_pane = new GesturePane();
    gesture_pane.init();

}

function transVideo(to) {
    if (to == "rotate") {
        $('#video').transition({
            perspective: '1280px',
            rotateY: '-15deg',
            scale: .7,
            opacity: .6
        });
    } else {
        $('#video').transition({
            perspective: '1280px',
            rotateY: '0deg',
            scale: 1,
            opacity: 1
        });
    }
}

function loadImages() {
    images = new Array();
    var imageSources = {
        annotation: "./assets/annotation.png",
        mic: "./assets/mic.png",
        back: "./assets/back.png",
        watched: "./assets/watched.png",
        //Characters
        zoe: "./assets/zoe.png",
        claire: "./assets/claire.png",
        frank: "./assets/frank.png",
        peter: "./assets/peter.png",
        zoeBW: "./assets/zoeBW.png",
        claireBW: "./assets/claireBW.png",
        frankBW: "./assets/frankBW.png",
        peterBW: "./assets/peterBW.png"
    };

    for (var src in imageSources) {
        images[src] = new Image();
        images[src].src = imageSources[src];
    }

}    

//Input Functions
//__________________________________
$(document).ready(function () {

    //Keyboard input
    $(document).keyup(function (e) {
        //Down arrow 
        if (e.keyCode == 40) { down();}
        //Up arrow 
        if (e.keyCode == 38) { up(); }
        //Left arrow 
        if (e.keyCode == 37) { left(); }
        //Right arrow 
        if (e.keyCode == 39) { right(); }
        //Q
        if (e.keyCode == 81) { prevScene();}
        //W
        if (e.keyCode == 87) { nextScene(false);}
        //I
        if (e.keyCode == 73) { makeImageAnnotation();}
        //R
        if (e.keyCode == 82) { toggleRecording();}
	});

    //Leap Motion
	var events = {
        "onHandExit": onHandExit,
        "onFrame": onFrame
    }
	$().leap("setEvents",events);
});

//Menu navigation
function down() {
    if(delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);
    switch (menuState) {
        case "root":        
            annotation_pane.open(); 
            menuState = "annotate";
            if(!summary) {timeline_pane.open(); }
            gesture_pane.clearCircle();
            break;
        case "annotate":
            annotation_pane.selectorMove("down");            
            break;        
        case "navigate":
            navigation_pane.selectorMove("down");
            break;
    }
}

function up() {
    if(delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);
    switch (menuState) {
        case "root":
        case "summary":
            navigation_pane.open();
            menuState = "navigate";
            timeline_pane.open();
            gesture_pane.clearCircle();
            break;
        case "annotate":
            annotation_pane.selectorMove("up");
            break;
        case "navigate":
            navigation_pane.selectorMove("up");
            break;        
    }
}

function left(bypass) {
    if(!bypass && delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);
    switch (menuState) {
        case "root":
            break;
        case "annotate":
            annotation_pane.close();
            timeline_pane.close();
            menuState = "root";
            break;       
        case "navigate":
            navigation_pane.close();
            timeline_pane.close();
            menuState = "root";
            break;         
    }
}

function right() {
    if(delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);

    switch (menuState) {
        case "root":            
            console.log("Next Scene");
            break;
        case "annotate":
            if(summary) { summaryFollowing = annotation_pane.selectorPosition; nextAnnotation(); break; }
            annotation_pane.menuItems[annotation_pane.selectorPosition].toggle();
            break;
        case "navigate":
            navigation_pane.menuItems[navigation_pane.selectorPosition].toggle();            
            break;
    }

}

    
//Recording and video...
//Make audio annotation
// function toggleRecording() {
//     if(delayGesture) {return;}
//     delayGesture = true;
//     setTimeout(function(){delayGesture = false;}, 500);

//     if(recording) {annotationItem_pane.close();}
//     else {annotationItem_pane.open();}
// }

//Make image annotation
function makeImageAnnotation() {
    console.log("Image annotation");
}

//Previous scene
function prevScene(bypass) {

    if(!bypass && delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);

    if(currScene != -1) {scenes[currScene].removeCurrScene();}

    do { 
        if(currScene > 0) {currScene--; } 
        else {
            nextScene(true);
            // video.pause(); 
            // currScene = -1; 
            // video.currentTime = 0; 
            // $('#message').slideDown(); 
            return;
        }
    } 
    while (!scenes[currScene].isInTimeline);
    
    //Update timeline
    scenes[currScene].setCurrScene();

    //Play scene
    video.currentTime = scenes[currScene].startTime;
    video.play();

    console.log("Previous scene: " + currScene);
}

//Next scene
function nextScene(bypass) {
    if(!bypass && delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);

    if(currScene != -1) {scenes[currScene].removeCurrScene();}

    //Go to next scene in timeline
    do { 
        if(currScene < scenes.length - 1) {currScene++;} 
        else {
            video.pause(); 
            //currScene = -1; 
            video.currentTime = 0; 
            $('#messageText').html("<img src='./assets/up.png' height='70' width='70'> <br>Please select another character or watch a friend's summary.");
            $('#message').slideDown(); 
            summary = true; 
            summarizeAnnotations();
            left(true);
            return;
        }
    } 
    while (!scenes[currScene].isInTimeline);

    //Update timeline
    scenes[currScene].setCurrScene();

    //Play scene
    video.currentTime = scenes[currScene].startTime;
    video.play();
    console.log("Next scene: " + currScene);
    
}

//Summary, to be called upon end of timeline
//_________________________________________________
function summarizeAnnotations() {   
    
    //Turn off all annotations
    friends.forEach(function(entry){
        if(entry.isListening) {entry.toggle();}
    });

    annotation_pane.header.setText("Summary");

    for(var i=1;i< annotation_pane.menuItems.length;i++) {
        annotation_pane.menuItems[i].listeningIcon.hide();
    }
    annotation_layer.draw();   
    currAnnotation = 0; 
    summary = true;
}


function nextAnnotation() {
    console.log("Next annotation");
    //If select3ed all annotations
    if(summaryFollowing == 0) {currAnnotation++;}
    else {
        do {
            if(currAnnotation < currAnnotation.length - 1) {currAnnotation++;}
            else {
                video.pause();         
                video.currentTime = 0; 
                $('#messageText').html("<img src='./assets/up.png' height='70' width='70'><br> Please select another character or watch a friend's summary.");
                $('#message').slideDown(); 
                summary = true; 
                summarizeAnnotations();
                left(true);
                return;
            }
        }
        while (annotations[currAnnotation - 1].usr != summaryFollowing);  
    }
    

    //Set video time to 5 secs before annotations start time
    video.currentTime = annotations[currAnnotation].startTime - 5;
    video.play();
    //Create popcorn trigger event for annotation
    console.log("Summary...");
    var audio; //Holds the html audio element                        
    popcorn.code({
        id: entry.id,
        start: entry.timecode,
        end: entry.endTime,
        onStart: function() {
            audio = document.createElement("audio");
            audio.src = "./annotations/audio/" + entry.file;
            document.body.appendChild(audio);
            audio.play();
            console.log(entry);
        },
        onEnd: function() {
            audio.pause();
            audio.parentNode.removeChild(audio); 
            nextAnnotation();                                   
        }
    });

}

function prevAnnotation() {

}


//Global Variables
//_________________________________
var stage, navigation_layer, annotation_layer, annotationItem_layer;
var annotation_pane, annotationItem_pane;
var assets;
var sw = 1280; //Screen width
var sh = 720; //Screen height
var colors = new Array("#DF8800", "#CFECE7", "#853D25", "#009F85");
//States
var menuState = "root";
var recording = false;

var friends = new Array(new Friend("Pedro Silva"), new Friend("My Friend"), new Friend("My Other Friend"));
var characters = new Array(new Character("frank"),new Character("zoe"),new Character("peter"),new Character("claire"));
var scenes =  new Array(
    new Scene(new Array(characters[0]), 8), 
    new Scene(new Array(characters[2], characters[1]), 5),
    new Scene(new Array(characters[0]), 4), 
    new Scene(new Array(characters[3]), 5), 
    new Scene(new Array(characters[0]), 1),
    new Scene(new Array(characters[1]), 5),
    new Scene(new Array(characters[0]), 6),
    new Scene(new Array(characters[0]), 5),
    new Scene(new Array(characters[0]), 7),
    new Scene(new Array(characters[0]), 5),
    new Scene(new Array(characters[0]), 5),
    new Scene(new Array(characters[0]), 5),
    new Scene(new Array(characters[0]), 5),
    new Scene(new Array(characters[0]), 5)
);

//Gesture delay
var delayGesture = false; 
var isGrabbing = false;

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
    
    //Load assets
	loadImages();

    //Create...
	//Scene objects
	
	//Character objects
	
	//Timeline object
	
	//Navitation
    navigation_pane = new NavigationPane();
	navigation_pane.init();
    //Timeline
    timeline_pane = new TimelinePane();
    timeline_pane.init();
    //Annotation Pane
	annotation_pane = new AnnotationPane();
	annotation_pane.init();
    //Annotation Item Pane
	annotationItem_pane = new AnnotationItemPane();
	annotationItem_pane.init();
}

function transVideo(to) {
    if (to == "rotate") {
        $('#video').transition({
            perspective: '1280px',
            //rotateY: '-10deg',
            scale: .85,
            opacity: .6
        });
    } else {
        $('#video').transition({
            perspective: '1280px',
            //rotateY: '0deg',
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
        //Space 
        if (e.keyCode == 32) { }
	});

    //Leap Motion
	var events = {
        //"onHandExit": onHandExit,
        "onFrame": onFrame
    }
	$().leap("setEvents",events);
});

function down() {
    if(delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);
    switch (menuState) {
        case "root":
            annotation_pane.open();
            timeline_pane.open(); 
            break;
        case "annotate":
            //annotation_pane.selectorMove("down");            
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
            navigation_pane.open();
            timeline_pane.open();
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
            console.log("Previous Scene");
            break;
        case "annotate":
            annotation_pane.close();
            timeline_pane.close();
            break;       
        case "navigate":
            navigation_pane.close();
            timeline_pane.close();
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
            annotation_pane.menuItems[annotation_pane.selectorPosition].toggle();
            break;
        case "navigate":
            navigation_pane.menuItems[navigation_pane.selectorPosition].toggle();            
            break;
    }
}

function toggleRecording() {
    if(delayGesture) {return;}
    delayGesture = true;
    setTimeout(function(){delayGesture = false;}, 500);
    if(recording) {annotationItem_pane.close();}
    else {annotationItem_pane.open();}
}
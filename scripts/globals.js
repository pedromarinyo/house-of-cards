//Global Variables
//_________________________________
var stage, navigation_layer, annotation_layer, annotationItem_layer;
var annotation_pane, annotationItem_pane;
var assets;
var sw = 1280; //Screen width
var sh = 720; //Screen height
var menuState = "root";
var recording = false;
var friends = new Array(new Friend("Pedro Silva"), new Friend("My Friend"), new Friend("My Other Friend"));
var characters = new Array("Frank Underwood", "Zoe Reporter Lady", "Peter The Other Guy", "Clare Bear"); //Array of names, instantiated as character objects in navigation_pane.init()
//Menus
var menuAnnotate = new Array();
var menuNavigate = new Array();
//Gesture delay
var delayGesture = false; 
var grab = false;



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
	annotationItem_layer = new Kinetic.Layer({ x: 0, y: 0 });
	peek_layer = new Kinetic.Layer();
	
    //Load assets
	loadImages();
	//Create...
	//Scene objects
	
	//Character objects
	
	//Timeline object
	
	//Navitation
	
    //Annotation
	annotation_pane = new AnnotationPane();
	annotation_pane.init();
    //Annotation item
	annotationItem_pane = new AnnotationItemPane();
	annotationItem_pane.init();
    //Annotation item
	navigation_pane = new NavigationPane();
	navigation_pane.init();
    //Annotation item
	peek_pane = new PeekPane();
	peek_pane.init();
}

function transVideo(to) { //pane = annotate or navigate
    if (to == "rotate") {
        $('#video').transition({
            perspective: '1280px',
            rotateY: '-10deg',
            scale: .7,
            opacity: .5
        });
    } else if (to == "peek") {
        $('#video').transition({
            perspective: '1280px',
            scale: .8
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
        back: "./assets/back.png"
    };

    //Load assets
    for (var src in imageSources) {
        images[src] = new Image();
        images[src].src = imageSources[src];
    }
}

//Input
//__________________________________
$(document).ready(function () {
    $(document).keyup(function (e) {
        //Down arrow 
        if (e.keyCode == 40) {            
           
        }
        //Up arrow 
        if (e.keyCode == 38) {
            
        }
        //Left arrow 
        if (e.keyCode == 37) {
          
        }
        //Right arrow 
        if (e.keyCode == 39) {
            annotation();
        }
        //Space 
        if (e.keyCode == 32) {
         
        }
	});
	
	//Leap Motion
	//Put the functions into an array
	var events = {
		//"onHandEnter" : peek,
		//"onHandExit" : unPeek,
		"onFrame" : calculateZ,
		"onGrab" : grabSwitch(on)
	}
	//update any number of them at once
	$().leap("setEvents",events);
});

function grabSwitch(onOff) {
	if(onOff = "on") {
		grab = true;
	} else {
		grab = false;	
	}
}

function annotation() {
	if(delayGesture) {return;}
	delayGesture = true;
	setTimeout(function() {delayGesture = false}, 1000);
	switch (menuState) {
		case "root":
			break;
		case "peek":
			if (recording) { annotationItem_pane.close(); }
			annotation_pane.open();                    
			peek_pane.openListening();
			break;
	}
}

function selectItem() {
	if(delayGesture) {return;}
	delayGesture = true;
	setTimeout(function() {delayGesture = false}, 1000);
	switch (menuState) {
		case "annotate":
			var z = window.leapData.hands[0].palmVelocity[2];
			var y = window.leapData.hands[0].palmVelocity[1];
			var x = window.leapData.hands[0].palmVelocity[0]
			if(z > -200 && z < 200 && x > -200 && x < 200 && y > -200 && y < 200) {
				if (annotation_pane.selectorPosition == 0) { annotation_pane.toggleAll.toggle(); }
				else { annotation_pane.menuItems[annotation_pane.selectorPosition].toggleListening(); }
			}
			break;
	}
}

function peek() {
	if(delayGesture) {console.log("return"); return;}
	switch (menuState) {
		case "root":
			var z = window.leapData.hands[0].palmPosition[2];
			if(z > 400) { annotation();}
			peek_pane.peek();
			break;
	}
}
function unPeek() {
	//if(delayGesture) {console.log("return"); return;}
	switch (menuState) {
		case "peek":
			peek_pane.unPeek();
			break;
		case "annotate":
			if(annotation_pane.isOpen) {annotation_pane.close();}
			peek_pane.unPeek();
			break;
	}
}

function calculateZ() {
	if(window.leapData.numHands > 0) {
	switch (menuState) {
		case "peek":
			if(window.leapData.hands[0].palmPosition[1] > 400) {
				annotation();
			}
			else if (window.leapData.hands[0].palmPosition[1] < 100) {
				console.log("Navigation");
			}
			break;
		case "annotate":		
			var t = 500/annotation_pane.menuItems.length; //threshold
			var z = window.leapData.hands[0].palmPosition[1];				
			
			for(var i =0; i < annotation_pane.menuItems.length; i++) {
				(function(i) {
					if (z < (t * (i + 1)) && z > (t * i)){
						var pos = annotation_pane.menuItems.length - (i + 1);
						if(annotation_pane.selectorPosition != pos) { 
							annotation_pane.selectorPosition = pos;
							annotation_pane.selectorMove(annotation_pane.selectorPosition); 
							console.log(annotation_pane.selectorPosition); }
					}
				})(i);
			}
			break;
	}
	} else {
		unPeek();
	}
}
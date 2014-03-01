//Global Variables
//_________________________________
var stage, navigation_layer, annotation_layer, annotationItem_layer;
var annotation_pane, annotationItem_pane;
var assets;
var sw = 1280; //Screen width
var sh = 720; //Screen height
//States
var menuState = "root";
var recording = false;
var friends = new Array(new Friend("Pedro Silva"), new Friend("My Friend"), new Friend("My Other Friend"));
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
            rotateY: '-10deg',
            scale: .7,
            opacity: .5
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
	var events = {}
	$().leap("setEvents",events);
});

function down() {
    switch (menuState) {
        case "root":
            annotation_pane.open();
            break;
        case "annotate":
            annotation_pane.selectorMove("down");
            break;
    }
}

function up() {
    switch (menuState) {
        case "root":
            break;
        case "annotate":
            annotation_pane.selectorMove("up");
            break;
    }
}

function left() {
    switch (menuState) {
        case "root":
            break;
        case "annotate":
            annotation_pane.close();
            break;
    }
}

function right() {
    switch (menuState) {
        case "root":
            break;
        case "annotate":
            annotation_pane.menuItems[annotation_pane.selectorPosition].toggle();
            break;
    }
}
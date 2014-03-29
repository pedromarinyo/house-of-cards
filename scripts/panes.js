//Annotation Pane
//______________________________________
function AnnotationPane() {    
    this.x = 0;
    this.y = -300;
    this.w = sw;
    this.h = 300;
    this.padding = 35;
    this.back; this.header; this.headerImage;
	this.isOpen = false;
    this.selector;
    this.selectorPosition = 0; this.selectorOrigin = this.y + 70 + (this.padding * 3);
    this.menuItems = new Array();
    
    //Toggle all menu item
    this.toggleAll = new Object({ name: "Toggle All", toggleOn: false});
    this.toggleAll.toggle = function toggle() {
        if (this.toggleOn) {
            friends.forEach(function (entry) { if (!entry.isListening) { entry.toggle(); } });
            this.toggleOn = false;
        } else {
            friends.forEach(function (entry) { if (entry.isListening) { entry.toggle(); } });            
            this.toggleOn = true;
        }
    }
    //Adding menu items
    this.menuItems.push(this.toggleAll);
    for (var i = 0; i < friends.length ; i++) { this.menuItems.push(friends[i]);}

    this.init = function init() {

        //Background gradient
        var backgroundGradient = new Kinetic.Rect({
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h,
            fillLinearGradientStartPoint: { x: sw / 2, y: 0 },
            fillLinearGradientEndPoint: { x: sw / 2, y: 300 },
            fillLinearGradientColorStops: [0, "rgba(0, 0, 0, 255)", 1, "rgba(0,0,0,0)"],
        });
        annotation_layer.add(backgroundGradient);

        //Header
        this.header = new Kinetic.Text({
            x: this.x + (this.padding * 2),
            y: this.y + (this.padding * 4),
            text: "Annotations",
            fontSize: 24,
            fontFamily: 'Roboto',
            fill: "white"
        });
        annotation_layer.add(this.header);

        //Header icon
        this.headerImage = new Kinetic.Image({
            x: this.x + this.padding,
            y: this.y + (this.padding *4),
            image: images.annotation,
            width: 25,
            height: 25
        });
        annotation_layer.add(this.headerImage);

        //Selector highlight
        this.selector = new Kinetic.Rect({
            x: this.x + this.padding * 2,
            y: this.selectorOrigin,
            fill: "#333",
            width: (this.padding * 8),
            height: this.padding,
            opacity: .7
        });
        annotation_layer.add(this.selector);

        for (var i = 0; i < this.menuItems.length; i++) {
            //Text
            var textColor = (i != 0) ? "#aaa" : "white";
            var label = new Kinetic.Text({
                x: this.x + (this.padding * 3),
                y: this.y + 80 + (this.padding * (i + 3)),
                text: this.menuItems[i].name,
                fontSize: 16,
                fontFamily: 'Roboto',
                fill: textColor
            });
            annotation_layer.add(label);
            this.menuItems[i].label = label; 
            //Image
            if (i == 0) { continue;}
            var listeningIcon = new Kinetic.Image({
                x: this.x + (this.padding * 8),
                y: this.y + 87 + (this.padding * (i + 3)),
                image: images.mic,
                width: 30,
                height: 30,
                offsetY: 15                
            });
            annotation_layer.add(listeningIcon);
            this.menuItems[i].listeningIcon = listeningIcon;
        }
        stage.add(annotation_layer);
    }

    this.open = function open() {
        this.tween = new Kinetic.Tween({
            node: annotation_layer,
            y: 200,
            opacity: 1,
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });
        this.tween.play();
        menuState = "annotate";
		this.isOpen = true;
        transVideo("rotate");
    }
    this.close = function close() {
        var tween = new Kinetic.Tween({
            node: annotation_layer,
            y: 0,
            opacity: 0,
            easing: Kinetic.Easings.StrongEaseOut,
            duration: .5
        });
        tween.play();
        //setTimeout(function () { this.selectorMove(0); }, 500);
		this.isOpen = false;
        menuState = "root";
        transVideo("reset");
    }
    this.selectorMove = function selectorMove(to) {
        var to;
        if (to == "down") { to = (this.selectorPosition < this.menuItems.length - 1) ? this.selectorPosition + 1 : this.selectorPosition; }
        else if (to == "up") { to = (this.selectorPosition > 0) ? this.selectorPosition - 1 : this.selectorPosition; }

        this.selector.tween = new Kinetic.Tween({
            node: this.selector,
            y: this.selectorOrigin + (this.padding * to),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });        

        this.selector.tween.play();
        this.selectorPosition = to;
    }
}

//Annotation Item Pane
//______________________________________
function AnnotationItemPane() {
    this.mic;
    this.tween;
    this.annotation = new Image;
    this.x = 50;
    this.y = -50;

    this.init = function init() {
        //Mic icon
        this.mic = new Kinetic.Image({
            x: this.x,
            y: this.y,
            image: images.mic,
            width: 50,
            height: 50,
            offsetY: 25,
            offsetX: 25,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 0.5
        });
        annotationItem_layer.add(this.mic);
        stage.add(annotationItem_layer);
    }
    this.open = function open() {
        this.tween = new Kinetic.Tween({
            node: annotationItem_layer,
            y: 100,
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: 1
        });
        this.tween.play();
        recording = true;;
    }
    this.close = function close() {
        this.tween = new Kinetic.Tween({
            node: annotationItem_layer,
            y: -100,
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: 1
        });
        this.tween.play();
        recording = false;
    }
}

//Navigation Pane
//______________________________________
function NavigationPane() {    
    this.x = 0;
    this.y = sh/2;
    this.w = sw;
    this.h = sh/2;
    this.padding = 80;
    this.back; this.header; this.headerImage;
    this.isOpen = false;
    this.selector;
    this.selectorPosition = 0; 
    this.selectorOrigin =  this.y - 60 ;  
    this.menuItems = new Array();
    
    
    //Adding menu items
    for (var i = 0; i < characters.length ; i++) { this.menuItems.push(characters[i]);}

    this.init = function init() {

        //Background gradient
        var backgroundGradient = new Kinetic.Rect({
            x: this.x,
            y: 200,
            width: this.w,
            height: this.h + 100,
            fillLinearGradientStartPoint: { x: sw / 2, y: 0 },
            fillLinearGradientEndPoint: { x: sw / 2, y: 310},
            fillLinearGradientColorStops: [0, "rgba(0, 0, 0, 0)", 1, "rgba(0,0,0,255)"]
        });
        navigation_layer.add(backgroundGradient);

        //Header
        this.header = new Kinetic.Text({
            x: this.x + (35 * 2),
            y: this.y - 75,
            text: "Navigation",
            fontSize: 24,
            fontFamily: 'Roboto',
            fill: "white"
        });
        navigation_layer.add(this.header);

        //Header icon
        this.headerImage = new Kinetic.Image({
            x: this.x + (35),
            y: this.y - 75,
            image: images.annotation,
            width: 25,
            height: 25
        });
        navigation_layer.add(this.headerImage);
              
        //Selector highlight
        this.selector = new Kinetic.Circle({
            x: this.x + (35 * 4),
            y: this.selectorOrigin - 50,
            fill: "#fff",   
            opacity: .7,     
            radius: 40,
            offsetY: 20,
            offsetX: 0
        });
        navigation_layer.add(this.selector);

        for (var i = 0; i < this.menuItems.length; i++) {
            //Character images            
            var name = this.menuItems[i].name;
            if(i != 0) {name += "BW";}

            this.menuItems[i].portrait = new Kinetic.Image({
                image: images[name],
                x: this.x + (35 * 4),
                y: this.y - 50 -(this.padding * (i+1)),
                width: 70,
                height: 70,
                offsetY: 35,
                offsetX: 35,
                shadowColor: 'black',
                shadowBlur: 20,
                shadowOffset: { x: 3, y: 3 },
                shadowOpacity: 0.5  
            });             
            
            this.menuItems[i].followingIcon = new Kinetic.Circle({                
                x: this.x + (35 * 4),
                y: this.y - 50 - (this.padding * (i+1)),
                radius: 20,
                offsetY: 0,
                offsetX: 0,
                fill: "#0c7865"            
            });             
            navigation_layer.add(this.menuItems[i].followingIcon);
            navigation_layer.add(this.menuItems[i].portrait);
        }
        stage.add(navigation_layer);  
    }

    this.open = function open() {
        this.tween = new Kinetic.Tween({
            node: navigation_layer,
            y: sh/2,
            opacity: 1,
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });
        this.tween.play();
        menuState = "navigate";
        this.isOpen = true;
        transVideo("rotate");
    }
    this.close = function close() {
        var tween = new Kinetic.Tween({
            node: navigation_layer,
            y: sh,
            opacity: 0,
            easing: Kinetic.Easings.StrongEaseOut,
            duration: .5
        });
        tween.play();        
        this.isOpen = false;
        menuState = "root";
        transVideo("reset");
    }
    this.selectorMove = function selectorMove(to) {
        var to;
        if (to == "up") { to = (this.selectorPosition < this.menuItems.length - 1) ? this.selectorPosition + 1 : this.selectorPosition; }
        else if (to == "down") { to = (this.selectorPosition > 0) ? this.selectorPosition - 1 : this.selectorPosition; }

        this.selector.tween = new Kinetic.Tween({
            node: this.selector,
            y: this.selectorOrigin - 50 - (this.padding * to),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });        

        this.menuItems[this.selectorPosition].portrait.setImage(images[this.menuItems[this.selectorPosition].name + "BW"]);
        this.selector.tween.play();
        //this.back.tween.play();
        this.selectorPosition = to;
        this.menuItems[to].portrait.setImage(images[this.menuItems[to].name]);
        navigation_layer.draw();
        timeline_pane.timelineItems.forEach(function(entry){
            if(entry.characters.indexOf(navigation_pane.menuItems[to]) >=0) {entry.icon.setOpacity(.7);}
            else {entry.icon.setOpacity(.3);}
        });
        timeline_layer.draw();
    }
}

//Timeline Pane
//______________________________________
function TimelinePane() {    
    this.x = 250;
    this.y = sh/2;
    this.w = sw;
    this.h = sh/2;
    this.isOpen = false;
    this.paddingTotal = 0;
    this.padding = 0; 
    this.timelineItems = new Array();    
    this.selectedFilters = new Array();

    this.init = function init() {
        //Adding scenes to timeline
        for (var i = 0; i < scenes.length; i++) { this.timelineItems.push(scenes[i]);}

        for (var i = 0; i < this.timelineItems.length; i++) {            
            
            //Fill color
            var character = characters.indexOf(this.timelineItems[i].characters[0]);
            this.padding = 5 * (scenes[i].nComments + 1);
            this.paddingTotal += this.padding;

            this.timelineItems[i].icon = new Kinetic.Circle({                
                x: this.x + this.paddingTotal,
                y: this.y - 60,
                radius: this.padding,
                fill: "white",
                opacity: .3
            });             
            timeline_layer.add(this.timelineItems[i].icon);
            this.paddingTotal += this.padding;           
        }
        stage.add(timeline_layer);  

        this.filterOn = function filterOn(character) {
            this.timelineItems.forEach(function(entry){
                if(entry.characters.indexOf(character) >= 0) {
                    entry.addToTimeline();
                }
                
            });
        }
        this.filterOff = function filterOff() {
            for(var i = 0; i < this.timelineItems.length; i++) {                            
                var doesInclude = false;
                this.timelineItems[i].characters.forEach(function(entry){
                    if (entry.isFollowing) {doesInclude = true;}
                });
           
                if(doesInclude) {continue;}
                this.timelineItems[i].removeFromTimeline();                        
            }
        }
    }    
    this.open = function open() {
        var tween = new Kinetic.Tween({
            node: timeline_layer,
            opacity: 1,
            duration: .1
        });
        tween.play();
        this.isOpen = true;
    }   
    this.close = function close() {
        var tween = new Kinetic.Tween({
            node: timeline_layer,
            opacity: 0,
            duration: .1
        });
        tween.play();
        this.isOpen = false;
    }     
}

//Gesture Pane
//______________________________________
function GesturePane() { 
    this.isShowing = false;
    this.prevX; this.prevY;
    this.icon = new Kinetic.Circle({                
        x: sw/2,
        y: sh/2,
        radius: 50,
        fill: "grey",
        opacity: .4
    });   
    this.sceneIcon = new Kinetic.Circle({                
        x: sw/2,
        y: sh/2,
        radius: 70,
        fill: "white",
        opacity: .2
    });  

    this.init = function init() {
        gesture_layer.add(this.sceneIcon);
        stage.add(gesture_layer);
    }

    this.drawCircle = function drawCircle() {
        this.prevX = leapData.hands[0].palmPosition[0];
        this.prevY = leapData.hands[0].palmPosition[1];
        gesture_layer.add(this.icon);
        gesture_layer.draw();
        this.isShowing = true;
    }

    this.clearCircle = function clearCircle() {
        gesture_layer.removeChildren();
        gesture_layer.draw();
        this.icon.setX(sw/2);
        this.icon.setY(sh/2);
        this.isShowing = false;
    }

    this.update = function update() {
        //Calculate palm's movement from origin
        var currX = leapData.hands[0].palmPosition[0];
        var currY = leapData.hands[0].palmPosition[1];
        var deltaX = this.prevX - currX;
        var deltaY = this.prevY - currY;

        var newX = this.icon.attrs.x - (deltaX * 3);
        var newY = this.icon.attrs.y + (deltaY * 2);
        this.prevX = currX;
        this.prevY = currY;

        this.icon.setX(newX);
        this.icon.setY(newY);

        if(this.icon.attrs.x > sw - 100) {nextScene();}
        if(this.icon.attrs.x < 100) {prevScene();}
        if(this.icon.attrs.y < 100 && this.icon.attrs.x < 400) {down();}
        if(this.icon.attrs.y < 100 && this.icon.attrs.x > 600) {toggleRecording();}

        if(this.icon.attrs.y > sh - 100) {up();}
        

        gesture_layer.draw();
    }
}





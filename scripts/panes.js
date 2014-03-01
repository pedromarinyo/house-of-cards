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
            friends.forEach(function (entry) { if (!entry.isListening) { entry.toggleListening(); } });
            this.toggleOn = false;
        } else {
            friends.forEach(function (entry) { if (entry.isListening) { entry.toggleListening(); } });            
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

        //Friends list       
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

        //Back icon
        this.back = new Kinetic.Image({
            x: this.x + this.padding * 2,
            y: this.selectorOrigin,
            image: images.back,
            width: 25,
            height: 25,
            offsetY: -4,
            offsetX: 12.5
        });
        annotation_layer.add(this.back);

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
                offsetY: 15,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: { x: 0, y: 0 },
                shadowOpacity: 0.5
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
            duration: 1.5
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
            easing: Kinetic.Easings.Linear,
            duration: .25
        });
        tween.play();
        this.selectorPosition = 0;
        this.selectorMove(0);
		//peek_pane.unPeek();
		this.isOpen = false;
        menuState = "root";
        setTimeout(function() {transVideo("reset");}, 1000);
    }
    this.selectorMove = function selectorMove(to) {
        
        this.selector.tween = new Kinetic.Tween({
            node: this.selector,
            y: this.selectorOrigin + (this.padding * to),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });
        this.selector.tween.play();
        this.back.tween = new Kinetic.Tween({
            node: this.back,
            y: this.selectorOrigin + (this.padding * to),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });
        this.back.tween.play();


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
            easing: Kinetic.Easings.StrongEaseOut,
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
    this.y = 0;
    this.w = sw;
    this.h = 300;
    this.padding = 35;
    this.back;
    this.tween;
    //this.selector;
    //this.selectorPosition = 0; this.selectorOrigin = this.y - 70 - (this.padding * 3);
    //this.menuItems = new Array();

    this.init = function init() {
        //Background gradient
        var backgroundGradient = new Kinetic.Rect({
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h,
            fillLinearGradientStartPoint: { x: sw / 2, y: 0 },
            fillLinearGradientEndPoint: { x: sw / 2, y: 300 },
            fillLinearGradientColorStops: [0, "rgba(0, 0, 0, 0)", 1, "rgba(0,0,0,255)"],
        });
        navigation_layer.add(backgroundGradient);

        
        stage.add(navigation_layer);
    }
    this.open = function open() {
        this.tween = new Kinetic.Tween({
            node: navigation_layer,
            y: 520,
            opacity: 1,
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: 1.5
        });
        this.tween.play();
        console.log("open nav");
        //menuState = "navigate";
        //transVideo("rotate");
    }
}

//Peek Pane
function PeekPane() {
    this.listeningLabel = new Array();
    this.followingLabel = new Array();

    this.init = function init() {
        //Listening list
        this.listeningLabel.push(new Kinetic.Text({
            x: 600,
            y: 0,
            text: "Listening",
            fontSize: 22,
            fontFamily: 'Roboto',
            fill: 'white',
            opacity: 0
        }));
        this.listeningLabel.push(new Kinetic.Image({
            x: 565,
            y: 0,
            image: images.annotation,
            width: 25,
            height: 25,
            offsetY: 0,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 0.5,
            opacity:0
        }));        
        //Following list
        this.followingLabel.push(new Kinetic.Text({
            x: 600,
            y: 720,
            text: "Following",
            fontSize: 22,
            fontFamily: 'Roboto',
            fill: 'white',
            opacity: 0
        }));      
        this.followingLabel.push(new Kinetic.Image({
            x: 565,
            y: 720,
            image: images.annotation,
            width: 25,
            height: 25,
            offsetY: 0,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 0.5,
            opacity: 0
        }));
        
        this.followingLabel.forEach(function (entry) { peek_layer.add(entry); });
        this.listeningLabel.forEach(function (entry) { peek_layer.add(entry); });
        peek_layer.draw();
        stage.add(peek_layer);
    }
    this.peek = function peek() {
        this.listeningLabel.forEach(
            function (entry) {
                this.listeningTween = new Kinetic.Tween({
                    node: entry,
                    y: 50,
                    opacity: 1,
                    duration: .25
                }); this.listeningTween.play();
            }
        );
        this.followingLabel.forEach(
            function (entry) {
                this.followingTween = new Kinetic.Tween({
                    node: entry,
                    y: 640,
                    opacity: 1,
                    duration: .25
                }); this.followingTween.play();
            }
        );
        transVideo("peek");
		menuState = "peek";
    }
	this.unPeek = function unPeek() {
        this.listeningLabel.forEach(
            function (entry) {
                this.listeningTween = new Kinetic.Tween({
                    node: entry,
                    y: 0,
                    opacity: 0,
                    duration: .25
                }); this.listeningTween.play();
            }
        );
        this.followingLabel.forEach(
            function (entry) {
                this.followingTween = new Kinetic.Tween({
                    node: entry,
                    y: 720,
                    opacity: 0,
                    duration: .25
                }); this.followingTween.play();
            }
        );
        transVideo("return");
		menuState = "root";
    }
    this.openListening = function openListening() {
        this.listeningLabel.forEach(
            function (entry) {
                this.listeningTween = new Kinetic.Tween({
                    node: entry,
                    y: 35,                    
                    duration: .25
                }); this.listeningTween.play();
            }
        );
        this.followingLabel.forEach(
            function (entry) {
                this.followingTween = new Kinetic.Tween({
                    node: entry,
                    y: 720,
                    opacity: 0,
                    duration: .25
                }); this.followingTween.play();
            }
        );
    }
    this.openFollowing = function openListening() {
        this.listeningLabel.forEach(
            function (entry) {
                this.listeningTween = new Kinetic.Tween({
                    node: entry,
                    y: 35,
                    opacity: 1,
                    duration: .25
                }); this.listeningTween.play();
            }
        );
    }
    
}
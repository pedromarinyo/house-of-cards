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
        setTimeout(function () { this.selectorMove(0); }, 500);
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
        this.back.tween = new Kinetic.Tween({
            node: this.back,
            y: this.selectorOrigin + (this.padding * to),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });

        this.selector.tween.play();
        this.back.tween.play();
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
            easing: Kinetic.Easings.StrongEaseOut,
            duration: 1
        });
        this.tween.play();
        recording = false;
    }
}

//Navigation Pane
//______________________________________
//...
function NavigationPane() {    
    this.x = 0;
    this.y = 1020;
    this.w = sw;
    this.h = 600;
    this.padding = 35;
    this.back; this.header; this.headerImage;
    this.isOpen = false;
 //   this.selector;
   this.selectorPosition = 0; 
    this.selectorOrigin =  this.y - 800 ;
  
    this.menuItems = new Array();
    
    
    //Adding menu items
    for (var i = 0; i < characters.length ; i++) { this.menuItems.push(characters[i]);}

    this.init = function init() {

        //Background gradient
        var backgroundGradient = new Kinetic.Rect({
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h,
            fillLinearGradientStartPoint: { x: sw / 2, y: 320 },
            fillLinearGradientEndPoint: { x: sw / 2, y: 720 },
            fillLinearGradientColorStops: [0, "rgba(0, 0, 0, 255)", 1, "rgba(0,0,0,0)"],
        });
        navigation_layer.add(backgroundGradient);

        //Friends list       
        
        //Selector highlight
        this.selector = new Kinetic.Circle({
            x: this.x + 130,
            y: this.selectorOrigin + 25,
            stroke: "#00CCFF",
            strokeWidth: 3,
            width: 52,
            height: 52
        });
        navigation_layer.add(this.selector);
        

        //Back icon
        this.back = new Kinetic.Image({
            x: this.x + this.padding *2,
            y: this.selectorOrigin + 20,
            image: images.back,
            width: 25,
            height: 25,
            offsetY: -4,
            offsetX: 12.5
        });
        navigation_layer.add(this.back);


        for (var i = 0; i < this.menuItems.length; i++) {
            //Character images
            name = this.menuItems[i].name;

         
            var char_img = new Kinetic.Image({
                image: images[name],
                x: this.x + (this.padding * 3),
                y: this.selectorOrigin + (60 * i),
                width: 50,
                height:50      
            }); 
            console.log(char_img);
      
            navigation_layer.add(char_img);
            
          //  this.menuItems[i].i = label; 
        }
        stage.add(navigation_layer);
    }

    this.open = function open() {
        this.tween = new Kinetic.Tween({
            node: navigation_layer,
            y: 200,
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
            y: 0,
            opacity: 0,
            easing: Kinetic.Easings.StrongEaseOut,
            duration: .5
        });
        tween.play();
        setTimeout(function () { this.selectorMove(0); }, 500);
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
            y: this.selectorOrigin + 25 + (60 * this.selectorPosition),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });        
        this.back.tween = new Kinetic.Tween({
            node: this.back,
            y: this.selectorOrigin + 25 + (60 * this.selectorPosition),
            easing: Kinetic.Easings.ElasticEaseOut,
            duration: .5
        });

        this.selector.tween.play();
        this.back.tween.play();
        this.selectorPosition = to;
    }
}

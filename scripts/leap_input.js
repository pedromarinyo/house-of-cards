function onHandExit() {
	left(true);
	gesture_pane.clearCircle();
}

function onFrame() {
	var leapData = window.leapData;
	
	if(leapData.hands.length == 1) {
		//Is grabbing?
		if (leapData.hands[0].fingers.length < 3) {
			if(!isGrabbing) {isGrabbing = true;}
		} 
		else {
			if(isGrabbing){isGrabbing = false;}
		}

		//Direction?
		if(isGrabbing){

			switch (menuState) {
				case "root":
				case "timeline":
					//Show cursor
					if(!gesture_pane.isShowing) {gesture_pane.drawCircle();} 
					else {gesture_pane.update();}	
					break;
				case "annotate":
					//Select from annotation pane
					if(annotation_pane.selector.fill != "#777") {annotation_pane.selector.setFill("#777"); annotation_layer.draw();} 
					if(leapData.hands[0].palmVelocity[0] > 1300) {right();}	
					break;
				case "navigate":
					//Select from navigation pane
					if(leapData.hands[0].palmVelocity[0] > 1300) {right();}				
					break;	
			}
		} else if(!isGrabbing) {
			
			switch (menuState) {
				case "root":
					//Remove cursor
					if(gesture_pane.isShowing) {gesture_pane.clearCircle();}	
					break;
				case "annotate":
					if(annotation_pane.selector.fill != "#333") {annotation_pane.selector.setFill("#333"); annotation_layer.draw();}
					//Move selector according to hand height
					var selWindow = 500 / annotation_pane.menuItems.length;
					var handHeight = leapData.hands[0].palmPosition[1];
					if(leapData.hands[0].palmVelocity[1] > 1000) {left(false);}
					for (i = 0; i < annotation_pane.menuItems.length; i++) {
						if(handHeight > (i * selWindow) && handHeight < ((i+1) * selWindow)) {
							if(annotation_pane.selectorPosition != annotation_pane.menuItems.length - i - 1) {annotation_pane.selectorMove(annotation_pane.menuItems.length - i - 1);}
						}
					}
					break;
				case "navigate":
					//Move selector according to hand height
					var selWindow = 500 / navigation_pane.menuItems.length;
					var handHeight = leapData.hands[0].palmPosition[1];
					if(leapData.hands[0].palmVelocity[1] < -1000) {left(false);}
					for (i = 0; i < navigation_pane.menuItems.length; i++) {
						if(handHeight > (i * selWindow) && handHeight < ((i+1) * selWindow)) {
							if(navigation_pane.selectorPosition != i) {navigation_pane.selectorMove(i);}
						}
					}
					break;
				case "timeline":
					if(leapData.hands[0].palmVelocity[1] < -1000) {timeline_pane.close(); menuState = "root";}
					if(gesture_pane.isShowing) {gesture_pane.clearCircle();}
					break;
			}
		}
	} 
}
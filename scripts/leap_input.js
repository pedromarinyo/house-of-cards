function onHandExit() {
	left(true);
	gesture_pane.clearCircle();
}

function onFrame() {
	var leapData = window.leapData;
	
	if(leapData.hands.length == 1) {
		//Is grabbing?
		if (leapData.hands[0].fingers.length == 0) {
			if(!isGrabbing) { //if grabbing from open
				isGrabbing = true;
				
			}
		} 
		else {if(isGrabbing){isGrabbing = false;}}

		
		//Direction?
		if(isGrabbing){

			switch (menuState) {
				case "root":
					if(!gesture_pane.isShowing) {gesture_pane.drawCircle();}
					else {gesture_pane.update();}
					
					// if(leapData.hands[0].palmVelocity[1] > 1000) {up();}
					// if(leapData.hands[0].palmVelocity[1] < -1000) {down();}	
					break;
				case "annotate":
					if(annotation_pane.selector.fill != "#777") {annotation_pane.selector.setFill("#777"); annotation_layer.draw();}
					if(leapData.hands[0].palmVelocity[0] > 1000) {right();}					
					break;
				case "navigate":
					if(leapData.hands[0].palmVelocity[0] > 1000) {right();}
					
					break;
			}
		} else if(!isGrabbing) {
			switch (menuState) {
				case "root":
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
					var selWindow = 500 / navigation_pane.menuItems.length;
					var handHeight = leapData.hands[0].palmPosition[1];
					if(leapData.hands[0].palmVelocity[1] < -1000) {left(false);}
					for (i = 0; i < navigation_pane.menuItems.length; i++) {
						if(handHeight > (i * selWindow) && handHeight < ((i+1) * selWindow)) {
							if(navigation_pane.selectorPosition != i) {navigation_pane.selectorMove(i);}
						}
					}
					break;
			}
		}
	} 
}
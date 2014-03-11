function onHandExit() {
	//var hand = window.leapData.hands[0];
	//if(delayGesture) {return;}
	left(true);
}

function onFrame() {
	var leapData = window.leapData;
	
	if(leapData.hands.length == 1) {
		//Is grabbing?
		if (leapData.hands[0].fingers.length == 0) {if(!isGrabbing) {isGrabbing = true;}} 
		else {if(isGrabbing){isGrabbing = false;}}
		
		//Direction?
		if(isGrabbing){
			switch (menuState) {
				case "root":
					if(leapData.hands[0].palmVelocity[1] > 1000) {up();}
					if(leapData.hands[0].palmVelocity[1] < -1000) {down();}				
					break;
				case "annotate":
					if(leapData.hands[0].palmVelocity[0] > 1000) {right();}					
					if(leapData.hands[0].palmVelocity[1] > 1000) {left(false);}
					if(leapData.hands[0].palmVelocity[1] < -1000) {toggleRecording();}	
					break;
				case "navigate":
					if(leapData.hands[0].palmVelocity[0] > 1000) {right();}
					if(leapData.hands[0].palmVelocity[1] < -1000) {left(false);}
					break;
			}
		} else if(!isGrabbing) {
			switch (menuState) {
				case "root":

					break;
				case "annotate":
					var selWindow = 500 / annotation_pane.menuItems.length;
					var handHeight = leapData.hands[0].palmPosition[1];
					for (i = 0; i < annotation_pane.menuItems.length; i++) {
						if(handHeight > (i * selWindow) && handHeight < ((i+1) * selWindow)) {
							if(annotation_pane.selectorPosition != annotation_pane.menuItems.length - i - 1) {annotation_pane.selectorMove(annotation_pane.menuItems.length - i - 1);}
						}
					}
					break;
				case "navigate":
					var selWindow = 500 / navigation_pane.menuItems.length;
					var handHeight = leapData.hands[0].palmPosition[1];
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


//function annotation() {
//	if(delayGesture) {return;}
//	delayGesture = true;
//	setTimeout(function() {delayGesture = false}, 1000);
//	switch (menuState) {
//		case "root":
//			break;
//		case "peek":
//			if (recording) { annotationItem_pane.close(); }
//			annotation_pane.open();                    
//			peek_pane.openListening();
//			break;
//	}
//}
//function selectItem() {
//	if(delayGesture) {return;}
//	delayGesture = true;
//	setTimeout(function() {delayGesture = false}, 1000);
//	switch (menuState) {
//		case "annotate":
//			var z = window.leapData.hands[0].palmVelocity[2];
//			var y = window.leapData.hands[0].palmVelocity[1];
//			var x = window.leapData.hands[0].palmVelocity[0]
//			if(z > -200 && z < 200 && x > -200 && x < 200 && y > -200 && y < 200) {
//				if (annotation_pane.selectorPosition == 0) { annotation_pane.toggleAll.toggle(); }
//				else { annotation_pane.menuItems[annotation_pane.selectorPosition].toggleListening(); }
//			}
//			break;
//	}
//}
//function peek() {
//	if(delayGesture) {console.log("return"); return;}
//	switch (menuState) {
//		case "root":
//			var z = window.leapData.hands[0].palmPosition[2];
//			if(z > 400) { annotation();}
//			peek_pane.peek();
//			break;
//	}
//}
//function unPeek() {
//	//if(delayGesture) {console.log("return"); return;}
//	switch (menuState) {
//		case "peek":
//			peek_pane.unPeek();
//			break;
//		case "annotate":
//			if(annotation_pane.isOpen) {annotation_pane.close();}
//			peek_pane.unPeek();
//			break;
//	}
//}

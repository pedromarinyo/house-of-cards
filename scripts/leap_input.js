//function grabSwitch(onOff) {
//	if(onOff = "on") {
//		grab = true;
//	} else {
//		grab = false;	
//	}
//}
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
//function calculateZ() {
//	if(window.leapData.numHands > 0) {
//	switch (menuState) {
//		case "peek":
//			if(window.leapData.hands[0].palmPosition[1] > 400) {
//				annotation();
//			}
//			else if (window.leapData.hands[0].palmPosition[1] < 100) {
//				console.log("Navigation");
//			}
//			break;
//		case "annotate":		
//			var t = 500/annotation_pane.menuItems.length; //threshold
//			var z = window.leapData.hands[0].palmPosition[1];				

//			for(var i =0; i < annotation_pane.menuItems.length; i++) {
//				(function(i) {
//					if (z < (t * (i + 1)) && z > (t * i)){
//						var pos = annotation_pane.menuItems.length - (i + 1);
//						if(annotation_pane.selectorPosition != pos) { 
//							annotation_pane.selectorPosition = pos;
//							annotation_pane.selectorMove(annotation_pane.selectorPosition); 
//							console.log(annotation_pane.selectorPosition); }
//					}
//				})(i);
//			}
//			break;
//	}
//	} else {
//		unPeek();
//	}
//}
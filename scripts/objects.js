(function (window) {
    
    //Friend Class
    //___________________
    function Friend(name) {
        this.name = name;
        this.x; this.y;
        this.isListening = false;
        this.listeningIcon; 

        this.toggle = function toggle() {
            if (this.isListening) {
                this.listeningIcon.tween = new Kinetic.Tween({
                    node: this.listeningIcon,
                    opacity: 0,
                    offsetX: -30,
                    duration: .2,
                    easing: Kinetic.Easings.EaseOut,
                });
                this.listeningIcon.tween.play();
                this.isListening = false;

                //Removing all friend's annotations 
                (function(friend){              
                    annotations.forEach(function(entry){
                        if(entry.usr == friends.indexOf(this)) {
                            popcorn.removeTrackEvent(entry.id);
                        }
                    });
                })(this);

            } else {
                this.listeningIcon.tween = new Kinetic.Tween({
                    node: this.listeningIcon,
                    opacity: 1,
                    offsetX: 0,
                    duration: .2,
                    easing: Kinetic.Easings.EaseOut
                });
                this.listeningIcon.tween.play();
                this.isListening = true;

                //Adding all friend's annotations   
                (function(friend){
                    annotations.forEach(function(entry){                    
                        if(entry.usr == friends.indexOf(friend)) {
                            console.log(entry);
                            var audio; //Holds the html audio element                        
                            popcorn.code({
                                id: entry.id,
                                start: entry.timecode,
                                end: entry.endTime,
                                onStart: function() {
                                    audio = document.createElement("audio");
                                    audio.src = "./annotations/audio/" + entry.file;
                                    document.body.appendChild(audio);
                                    audio.play();
                                    console.log(entry);
                                },
                                onEnd: function() {
                                    audio.pause();
                                    audio.parentNode.removeChild(audio);                                    
                                }
                            });
                        }
                    });
                })(this);                  
                


                
            }
        }
    } 
    window.Friend = Friend;
    
    //Character Class
    //___________________
    function Character(name) {
        this.name = name;
        this.x; this.y;
        this.isFollowing = false;
        this.portrait;
        this.followingIcon;

        this.toggle = function toggle() {
            if (this.isFollowing) {
                this.followingIcon.tween = new Kinetic.Tween({
                    node: this.followingIcon,
                    duration: .2,
                    radius: 10,
                    easing: Kinetic.Easings.EaseOut,
                });
                this.followingIcon.tween.play();
                this.isFollowing = false;
                timeline_pane.filterOff();
            } else {
                this.followingIcon.tween = new Kinetic.Tween({
                    node: this.followingIcon,
                    radius: 40,
                    duration: 1.5,
                    easing: Kinetic.Easings.ElasticEaseOut,
                });
                this.followingIcon.tween.play();            
                this.isFollowing = true;
                timeline_pane.filterOn(this);
            }
        }
    }
    window.Character = Character;

    //Scene Class
    //___________________
    function Scene(characters,startTime,endTime) {

        
        this.startTime = startTime; 
        this.endTime = endTime;
        this.characters = characters;
        this.icon; 
        this.x;
        this.hasSeen = false;
        this.isInTimeline = false;

        this.addToTimeline = function addToTimeline() {                        
            this.tween = new Kinetic.Tween({
                node: this.icon,
                y: timeline_pane.y - 150,
                x: this.x,
                duration: .25,
                opacity: 1, 
                easing: Kinetic.Easings.EaseOut
            });
            this.tween.play();
            this.isInTimeline = true;

            //Adding event trigger for next scene
            popcorn.code({
                id: "scene" + startTime,
                start: this.endTime,
                onStart: function() {
                    nextScene(false);
                }
            });
        }

        this.removeFromTimeline = function removeFromTimeline() {
            this.tween = new Kinetic.Tween({
                node: this.icon,
                y: timeline_pane.y - 100,
                x: this.x,
                duration: .25,
                opacity: .5, 
                easing: Kinetic.Easings.EaseOut
            });
            this.tween.play();
            this.isInTimeline = false;

            //Removing event trigger for next scene
            popcorn.removeTrackEvent("scene" + this.startTime);            
        }

        this.setCurrScene = function setCurrScene() {
            //Change fill 
            this.icon.setFill("#0c7865");
            timeline_layer.draw();
        }

        this.removeCurrScene = function removeCurrScene() {
            //Change fill 
            this.icon.setFill("#fff");
            timeline_layer.draw();
        }
    }
    window.Scene = Scene;
    
    //Annotation Class
    //___________________
    function Annotation(type, scene, timecode, endTime, usr, file, id) {
        this.type = type; //image, voice, scene
        this.scene = scene; //from scene array
        this.timecode = timecode;
        this.endTime = endTime;
        this.file = file;
        this.usr = usr; //from friend array
        this.id = id; //unique id for popcorn.js
    }
    window.Annotation = Annotation;

}(window));
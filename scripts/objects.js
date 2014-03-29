(function (window) {
    
    //Friend Class
    //___________________
    function Friend(name) {
        this.name = name;
        this.x; this.y;
        this.isListening = true;
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
            } else {
                this.listeningIcon.tween = new Kinetic.Tween({
                    node: this.listeningIcon,
                    opacity: 1,
                    offsetX: 0,
                    duration: .2,
                    easing: Kinetic.Easings.EaseOut,
                });
                this.listeningIcon.tween.play();
                this.isListening = true;
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
    function Scene(characters, nComments, startTime) {
        this.name = name;
        this.startTime = startTime; 
        this.endTime;
        this.characters = characters;
        this.fillColor;
        this.icon;
        this.topic;
        this.nComments = nComments;

        this.addToTimeline = function addToTimeline() {            
            this.tween = new Kinetic.Tween({
                node: this.icon,
                y: timeline_pane.y - 125,
                duration: .25,
                easing: Kinetic.Easings.EaseOut
            });
            this.tween.play();
        }
        this.removeFromTimeline = function removeFromTimeline() {
            this.tween = new Kinetic.Tween({
                node: this.icon,
                y: timeline_pane.y - 60,
                duration: .25,
                easing: Kinetic.Easings.EaseOut
            });
            this.tween.play();
        }

    }
    window.Scene = Scene;

}(window));
(function (window) {
    /*
    Friend Class
    ___________________
    Variables: (
        name,
        x, y,
        icon, icon_x, icon_y,  
    )
    */
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
    } window.Friend = Friend;

    /*
    Friend Class
    ___________________
    Variables: (
        name,
        x, y,
        icon, icon_x, icon_y,  
    )
    */
    function Character(name, x, y, color) {
        this.name = name;
        this.x; this.y;
        this.isFollowing = false;
        this.portrait = new Kinetic.Circle({
            x: x,
            y: y,
            radius: 50,
            fill: color
        });



    }

}(window));
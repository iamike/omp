//app function
var app = {
    getCurrent:function(){


    },
    resize: function() {
        this._minisite = $('#minisite');
        $(window).resize(this.onResize);
        this.onResize();
    },
    onResize: function() {
        var domwidth = document.documentElement.clientWidth;
        var domheight = document.documentElement.clientHeight;

        var scale = Math.max(domwidth / 320, domheight / 504);
        var width = 320 * scale;
        var height = 504 * scale;
        app._minisite.css({
            scale: [scale, scale],
            left: -(width - domwidth) / 2,
            top: -(height - domheight) / 2
        });

    }

};



$(function() {

    //creatjs touch event
    createjs.Touch.enable(stage, true, false);

    //init the canvas animation when it ready.
    init();

    //make screen viewport center
    app.resize();
      $("#minisite").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          console.log("You swiped " + direction); 
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
      });

});

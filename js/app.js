//app function
var section = [{
    lableName: 'begin'
}, {
    lableName: 'section1', //志
    instanceName: 'instance_7'
}, {
    lableName: 'section2', //思
    instanceName: 'instance_6'
}, {
    lableName: 'section3', //慧
    instanceName: 'instance_5'
}, {
    lableName: 'section4', //念
    instanceName: 'instance_4'
}, {
    lableName: 'section5',
    instanceName: ''
}, {
    lableName: 'section6',
    instanceName: ''
}, {
    lableName: 'end',
    instanceName: ''
}];

var app = {
    lockedStory: false,
    currentStoryId: 0,
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
    },
    toSwipeMode: function() {
        $('.swipeMode').show();
        $('.tapMode').hide();
    },
    toTapMode: function() {
        $('.swipeMode').hide();
        $('.tapMode').show();
    }

};



//$(function() {

//creatjs touch event
createjs.Touch.enable(stage, true, false);

//init the canvas animation when it ready.
init();


//make screen viewport center
app.resize();

//add swpie event
$("#swipeLayer").swipe({
    //Generic swipe handler for all directions
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

        console.log(event, direction, distance, duration, fingerCount, fingerData);

        if (app.currentStoryId >= 0 && app.currentStoryId <= section.length) {

            if (direction == 'up') {

                if (app.lockedStory == true) {
                    var currentId = app.currentStoryId;
                    var currentLabelName = section[currentId]['lableName'];
                    var instanceName = _.result(_.findWhere(section, {
                        'lableName': currentLabelName
                    }), 'instanceName');

                    if (instanceName) {
                        exportRoot[instanceName].gotoAndPlay();
                    }
                } else {

                    //if story doesn't end.
                    if (app.currentStoryId < section.length) {

                        app.currentStoryId += 1;
                        exportRoot.gotoAndPlay();

                    }

                }
            }

            //if - _ - !!! 

            // if (direction == 'down') {
            //     app.currentStoryId -= 1;
            // }            
        }



    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold: 0
});


//add tap event
$("#tapLayer,#tapLayerMiddle").swipe({
    tap: function(event, target) {

        if (app.currentStoryId >= 0 && app.currentStoryId <= section.length) {

            if (app.lockedStory == true) {
                var currentId = app.currentStoryId;
                var currentLabelName = section[currentId]['lableName'];
                var instanceName = _.result(_.findWhere(section, {
                    'lableName': currentLabelName
                }), 'instanceName');

                if (instanceName) {
                    exportRoot[instanceName].gotoAndPlay();
                }
            } else {

                //if story doesn't end.
                if (app.currentStoryId < section.length) {

                    app.currentStoryId += 1;
                    exportRoot.gotoAndPlay();

                }

            }
        }
    }
});






//});

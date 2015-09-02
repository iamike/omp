//app function
var section = [{
    lableName: 'begin',
    instanceName: ''
}, {
    lableName: 'section1',//志
    instanceName: 'instance_7'
}, {
    lableName: 'section2',//思
    instanceName: 'instance_6'
}, {
    lableName: 'section3',
    instanceName: 'instance_5'
}, {
    lableName: 'section4',
    instanceName: 'instance_4'
}, {
    lableName: 'section5',
    instanceName: 'instance_7'
}, {
    lableName: 'section6',
    instanceName: 'instance_7'
}, {
    lableName: 'end',
    instanceName: 'instance_7'
}]
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
$("#minisite").swipe({
    //Generic swipe handler for all directions
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
        console.log("You swiped " + direction);
        //app.currentStoryId _.findIndex(exportRoot.getCurrentLabel());
        //app.currentStoryId = _.findLastIndex(section,{'lableName':app.currentStoryLabelName});
        //app.nextStoryLableName =  app.section[app.currentStoryId+1]['lableName'];
        //app.prevSotryLableName = app.section[app.currentStoryId-1]['lableName'];

        if (direction == 'up') {

            console.log(app.currentStoryId, app.lockedStory);

            if (app.lockedStory == true) {
                var instanceName =  _.result(_.findWhere(section, { 'lableName': section[app.currentStoryId]['lableName']}),'instanceName');
                exportRoot[instanceName].gotoAndPlay();
            } else {
                exportRoot.gotoAndPlay();
                app.currentStoryId += 1;

            }
        }


        if (direction == 'down') {
            app.currentStoryId -= 1;
        }

    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold: 0
});

//});

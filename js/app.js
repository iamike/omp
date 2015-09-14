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
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
    },
    toSwipeMode: function() {
        $('.swipeMode,.tapMode').hide();
        $('.swipeMode').show();
    },
    toTapMode: function() {
        $('.swipeMode,.tapMode').hide();
        $('#tapLayer').show();
    },
    toTapModeMiddle: function() {
        $('.swipeMode,.tapMode').hide();
        $('#tapLayerMiddle').show();
    },
    hideAllMode: function() {
        $('.swipeMode,.tapMode').hide();
    }

};


/*!
 * jQuery Double Tap Plugin.
 *
 * Copyright (c) 2010 Raul Sanchez (http://www.appcropolis.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($) {
    // Determine if we on iPhone or iPad
    var isiOS = false;
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
        isiOS = true;
    }

    $.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay) {
        var eventName, action;
        delay = delay == null ? 500 : delay;
        eventName = isiOS == true ? 'touchend' : 'click';

        $(this).bind(eventName, function(event) {
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */ ;
            var delta = now - lastTouch;
            clearTimeout(action);
            if (delta < 500 && delta > 0) {
                if (onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function') {
                    onDoubleTapCallback(event);
                }
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function(evt) {
                    if (onTapCallback != null && typeof onTapCallback == 'function') {
                        onTapCallback(evt);
                    }
                    clearTimeout(action); // clear the timeout
                }, delay, [event]);
            }
            $(this).data('lastTouch', now);
        });
    };
})(jQuery);

//$(function() {

//creatjs touch event
createjs.Touch.enable(stage, true, false);

//init the canvas animation when it ready.
init();


//make screen viewport center
app.resize();

$('body').addClass('stop-scrolling');

//$('body').bind('touchmove', function(e){e.stopPropagation();e.preventDefault()});
//$('body').bind('touchstart', function(e){e.stopPropagation();e.preventDefault()});
//$('canvas').bind('touchend', function(e){e.preventDefault()});
$('body,canvas').swipe({
    tap: function(event, target) {

        event.preventDefault();

    },
    swipe: function(event) {
        event.preventDefault();
    }
});
$('canvas').doubletap(function(evt) {
    event.preventDefault();
    //alert('double tap')
});

//add swpie event
$("#swipeLayer").swipe({
    //Generic swipe handler for all directions
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

       // console.log(event, direction, distance, duration, fingerCount, fingerData);

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
$(".tapMode").swipe({
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

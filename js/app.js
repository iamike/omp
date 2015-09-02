/**
 * this framework base on jq 1.6.2
 **/
try {
    console.log('log');
} catch (e) {
    var console = {
        log: function() {}
    };
}


/**
 *@namespace
 **/
var gb = gb = gb || {};



(function() {

    gb.classes = {};
    gb.fn = {};
    gb.browser = {};
    gb.window = {};
    gb.point = {};
    gb.net = {};

    //===========
    // Class
    //===========
    var initializing = false;
    var fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    this.Class = function() {};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var pty = new this();
        initializing = false;
        for (var name in prop) {
            pty[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn) {
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        function Class() {
            if (!initializing && this.ctor)
                this.ctor.apply(this, arguments);
        }

        Class.prototype = pty;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
    gb.classes.Class = Class;

    //新增事件类
    gb.events = {
        Click: '',
        TouchStart: '',
        TouchMove: '',
        TouchEnd: ''
    };
    //


    gb.fn.getAddressParam = function(key_) {
        var hrefstr, pos, parastr, para, tempstr;
        hrefstr = window.location.href;
        pos = hrefstr.indexOf("?");
        parastr = hrefstr.substring(pos + 1);
        para = parastr.split("&");
        tempstr = "";
        for (var i = 0; i < para.length; i++) {
            tempstr = para[i];
            pos = tempstr.indexOf("=");
            if (tempstr.substring(0, pos) == key_) {
                return tempstr.substring(pos + 1);
            }
        }
        return null;
    };

    //-----------------------------
    //  $ins.window
    //-----------------------------
    gb.window.getWidth = function() {
        return document.documentElement.clientWidth;
    };
    gb.window.getHeight = function() {
        return document.documentElement.clientHeight;
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt, from) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) from += len;
            for (; from < len; from++) {
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    };


    //-----------------------------
    //  browser
    //-----------------------------
    gb.browser.getVersion = function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPod: u.indexOf('iPod') > -1, //是否为iPod或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            isMac: u.indexOf('Mac') > -1, //是否是mac终端
            isLinux: u.indexOf('Linux') > -1, //是否是linux系统
            isWeiXin: navigator.userAgent.indexOf('MicroMessenger') > -1, //判断是不是微信浏览器
            isWindowsPhone: u.indexOf('Windows Phone') > -1 //是否是windows phone
        };
    };
    gb.browser.isPc = function() {
        return (!(gb.browser.getVersion().ios || gb.browser.getVersion().android || gb.browser.getVersion().isWindowsPhone));
    };
    gb.browser.language = (navigator.browserLanguage || navigator.language).toLowerCase();


    //-----------------------------
    // events
    //-----------------------------

    if (gb.browser.getVersion().iPhone || gb.browser.getVersion().iPod || gb.browser.getVersion().iPad || gb.browser.getVersion().android) {
        gb.events.Click = 'touchend';
        gb.events.TouchStart = 'touchstart';
        gb.events.TouchMove = 'touchmove';
        gb.events.TouchEnd = 'touchend';
    } else if (window.navigator.msPointerEnabled) {

        gb.events.Click = 'mouseup';
        gb.events.TouchStart = 'mousedown';
        gb.events.TouchMove = 'mousemove';
        gb.events.TouchEnd = 'mouseup';

        //        gb.events.Click = 'MSPointerUp';
        //        gb.events.TouchStart = 'MSPointerDown';
        //        gb.events.TouchMove = 'MSPointerMove';
        //        gb.events.TouchEnd = 'MSPointerUp';

    } else {
        gb.events.Click = 'mouseup';
        gb.events.TouchStart = 'mousedown';
        gb.events.TouchMove = 'mousemove';
        gb.events.TouchEnd = 'mouseup';
    }

    /**
     *
     * 添加事件侦听
     *
     * */
    gb.events.addHandler = function(element, type, handler) {
        if (element.addEventListener) {

            element.addEventListener(type, handler, false);

        } else if (element.attachEvent) {

            element.attachEvent("on" + type, handler);

        } else {

            element["on" + type] = handler;

        }
    };

    /**
     *
     * 删除事件侦听
     *
     * */
    gb.events.removeHandler = function(element, type, handler) {
        if (element.removeEventListener) {

            element.removeEventListener(type, handler, false);

        } else if (element.detachEvent) {

            element.detachEvent("on" + type, handler);

        } else {

            element["on" + type] = null;

        }
    };

    //-----------------------------
    // point
    //-----------------------------

    /**
     * 获取鼠标在页面上的位置
     * @param ev        触发的事件
     * @return          x:鼠标在页面上的横向位置, y:鼠标在页面上的纵向位置
     */
    gb.point.getMousePoint = function(ev) {
        // 定义鼠标在视窗中的位置
        var point = {
            x: 0,
            y: 0
        };

        // 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
        if (typeof window.pageYOffset != 'undefined') {
            point.x = window.pageXOffset;
            point.y = window.pageYOffset;
        }
        // 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
        // IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
        else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            point.x = document.documentElement.scrollLeft;
            point.y = document.documentElement.scrollTop;
        }
        // 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
        else if (typeof document.body != 'undefined') {
            point.x = document.body.scrollLeft;
            point.y = document.body.scrollTop;
        }

        if (gb.browser.getVersion().iPhone || gb.browser.getVersion().iPod || gb.browser.getVersion().iPad || gb.browser.getVersion().android) {
            point.x = ev.originalEvent.changedTouches[0].pageX;
            point.y = ev.originalEvent.changedTouches[0].pageY;
        } else if (gb.browser.getVersion().isWindowsPhone) {
            //            var html = '';
            //            for(var i in ev.originalEvent ){
            //                html += i+'---'+ev.originalEvent[i]+'<br />';
            //            }
            //            $('body').append(html);
            point.x = ev.originalEvent.pageX;
            point.y = ev.originalEvent.pageY;
            //            alert(ev.originalEvent);
        } else {
            // 加上鼠标在视窗中的位置
            point.x += ev.clientX;
            point.y += ev.clientY;
        }
        // 返回鼠标在视窗中的位置
        return point;
    };



    //===========
    // Signal
    //===========
    gb.classes.Signal = gb.classes.Class.extend({
        _callBackFunArr: [],
        _callBackSelfArr: [],

        ctor: function() {
            this._callBackFunArr = [];
            this._callBackSelfArr = [];
        },
        add: function(callBackFun_, this_) {
            var $have = false;
            for (var i = 0; i < this._callBackFunArr.length; i++) {
                if (this._callBackFunArr[i] == callBackFun_ && this._callBackSelfArr[i] == this_) {
                    $have = true;
                    break;
                }
            }
            if (!$have) {
                this._callBackFunArr.push(callBackFun_);
                this._callBackSelfArr.push(this_);
            }
        },
        remove: function(callBackFun_) {
            var index = this._callBackFunArr.indexOf(callBackFun_);
            if (index != -1) {
                this._callBackFunArr.splice(index, 1);
                this._callBackSelfArr.splice(index, 1);
            }
        },
        dispatch: function() {
            for (var i = 0; i < this._callBackFunArr.length; i++) {
                var $self = this._callBackSelfArr[i];
                var $fun = this._callBackFunArr[i];
                $fun.apply($self, arguments);
            }
        }
    });
    gb.fn.loop = function(fn_, delay_, parms_) {
        var $newFn = function() {
            fn_.call(window, parms_);
        };
        var $id = setInterval($newFn, delay_);
        return $id;
    };

    gb.fn.clearLoop = function(id_) {
        clearInterval(id_);
    };

    //===========
    // timer
    //===========
    gb.classes.Timer = gb.classes.Class.extend({
        _delay: null,
        _repeat: null,
        _interval: 0,
        _count: 0,
        _isStart: false,
        sgTimer: null,

        ctor: function(delay_, repeat_) {
            this._delay = delay_;
            this._repeat = repeat_;
            this.sgTimer = new gb.classes.Signal();
        },
        start: function() {
            if (this._isStart) return;
            gb.fn.clearLoop(this._interval);
            //            clearInterval(this._interval);
            this._interval = gb.fn.loop(this._onTimerRun, this._delay, {
                self: this,
                aa: 123
            });
            //            this._interval = setInterval(this._onTimerRun, this._delay, {self:this});
            this._isStart = true;
        },
        pause: function() {
            if (!this._isStart) return;
            gb.fn.clearLoop(this._interval);
            //            clearInterval(this._interval);
            this._isStart = false;
        },
        stop: function() {
            gb.fn.clearLoop(this._interval);
            //            clearInterval(this._interval);
            this._count = 0;
            this._isStart = false;
        },
        _onTimerRun: function(data_) {
            var $self = data_.self;
            $self._count++;
            if ($self._count == $self._repeat && $self._repeat != 0) $self.stop();
            $self.sgTimer.dispatch($self);
        }
    });

    //-----------------------------
    // net
    //-----------------------------
    gb.net.ImgsLoader = gb.classes.Class.extend({
        _urlList: null,
        _imgsList: null,
        _loadedNum: 0,

        //timer var
        _timer: null,
        _runTimerNum: 0,
        _testPro: 0,

        progress: 0,

        sgProgress: null,
        sgComplete: null,

        ctor: function(urlList_) {
            this._urlList = urlList_;
            this._imgsList = [];

            this._timer = new gb.classes.Timer(1000 / 10, 0);
            this._timer.sgTimer.add(this._onTimerEvt, this);

            this.sgProgress = new gb.classes.Signal();
            this.sgComplete = new gb.classes.Signal();
        },
        getImageById: function(id_) {
            return this._imgsList[id_];
        },
        load: function() {
            if (!this._urlList[this._loadedNum]) {
                return;
            }

            var $img = new Image();
            $img.self = this;
            $($img).bind('load', {
                self: this
            }, this._onImgLoaded);
            var $self = this;
            setTimeout(function() {
                $img.src = $self._urlList[$self._loadedNum];
            }, 50);

            this._imgsList[this._loadedNum] = $img;

            this._testPro = this._runTimerNum = 0;
            this._timer.start();
        },
        _onImgLoaded: function(e) {
            var $self = e.data.self;
            $self._loadedNum++;
            $self._timer.stop();
            $self._testPro = 0;
            $self.progress = $self._getProgress();

            if ($self._loadedNum < $self._urlList.length) {
                $self.sgProgress.dispatch({
                    target: $self
                });
                $self.load();
            } else {
                $self._getProgress();
                $self.sgProgress.dispatch({
                    target: $self
                });
                $self.sgComplete.dispatch({
                    target: $self
                });
            }
        },
        _onTimerEvt: function(timer_) {
            var $pro = 0;
            this._runTimerNum++;

            for (var i = 0; i < this._runTimerNum; i++) {
                $pro += (1 - $pro) * .1;
            }
            this._testPro = $pro;
            this.sgProgress.dispatch({
                target: this
            });
        },
        _getProgress: function() {
            this.progress = Math.floor((this._loadedNum / this._urlList.length) * 100 + this._testPro * 100) / 100;
            return this.progress;
        }
    });


})();
var _exisleft = true;
var SoundManage = {
    _isSoundPlay: false,
    _globalSound: null,
    init: function() {

        for (var i = 1; i <= 10; i++) {

            this['_sound' + i] = new Howl({

                urls: ['mp3/' + i + '.mp3'],
                onplay: function() {
                    console.log('onplay::');

                },
                onend: function() {

                    SoundManage._isSoundPlay = false;

                    _exisleft = true;
                    $('.explain1').css('display', 'block');
                    $('.explain2').css('display', 'none');

                    console.log('onend::');
                },
                onload: function() {
                    console.log('onload::');
                },
                onloaderror: function() {
                    console.log('onloaderror::');
                },
                onpause: function() {
                    console.log('onpause::');
                }

            });


        }

        SoundManage._globalSound = new Howl({

            urls: ['mp3/start.mp3'],
            onplay: function() {
                console.log('_globalSoundonplay::');

            },
            onend: function() {
                SoundManage._globalSound.play();
                console.log('_globalSoundonend::');
            },
            onload: function() {
                console.log('_globalSoundonload::');
            },
            onloaderror: function() {
                console.log('_globalSoundonloaderror::');
            },
            onpause: function() {
                console.log('_globalSoundonpause::');
            }

        });

        //console.log(isleft);
        //this['_sound6'].play();
        //console.log(SoundManage);

    },
    playSound: function() {
        if (app.currentId == 0) {
            return;
        }

        SoundManage.stopSound();
        SoundManage._isSoundPlay = true;

        SoundManage['_sound' + app.currentId].play();
        //SoundManage._globalSound.stop();
    },
    stopSound: function() {
        SoundManage._isSoundPlay = false;
        for (var i = 1; i <= 10; i++) {
            this['_sound' + i].stop();
        }
    }
};


var BaseClass = gb.classes.Class.extend({
    _callBack: null,
    _direction: null,
    view: null,
    ctor: function(view_) {
        var self = this;
        self.view = view_;

    },
    askToAdd: function(data_) {
        var self = this;
        self.toAdd();

        if (data_) {

            if (data_.type == 1) {
                self.startAnimOut();
            } else if (data_.type == 2) {
                self.startAnimIn();
            }
        }
        //console.log('askToAdd::',data_.type);

    },
    askToRemove: function(data_) {
        var self = this;

        if (data_) {

            self._callBack = data_.callBack;
            self._direction = data_.type;

            if (data_.type == 1) {
                self.overAnimOut();
            } else if (data_.type == 2) {
                self.overAnimIn();
            }


        }
        //console.log('askToRemove::',data_.type);
    },
    toAdd: function() {
        var self = this;
        //self.view.css('display', 'block');
    },
    toRemove: function() {
        var self = this;
        //self.view.css('display', 'none');
    },
    startAnimIn: function() {
        var self = this;
        //console.log('startAnimIn::',self.view.attr('id'));
    },
    startAnimOut: function() {
        var self = this;
        //console.log('startAnimOut::',self.view.attr('id'));
    },
    overAnimIn: function() {
        var self = this;
        //console.log('overAnimIn::',self.view.attr('id'));
        self.overComplete();
    },
    overAnimOut: function() {
        var self = this;
        //console.log('overAnimOut::',self.view.attr('id'));
        self.overComplete();
    },
    overComplete: function() {
        var self = this;
        self.toRemove();
        if (self._callBack) {
            self._callBack();
        }

    }
});

var PublicStage = gb.classes.Class.extend({
    _publicTip: null,
    _publicTip1: null,
    _publicTip2: null,
    _panelMeteor: null,
    _whiteBgBody: null,
    _soundBody: null,
    _blackSoundBody: null,
    _whiteSoundBody: null,
    _explainBody: null,
    _blackExplain: null,
    _whiteExplain: null,
    _currentPoint: null,
    _shareBody: null,
    isleftsoundbodybtn: true,
    ctor: function() {
        var self = this;
        self._currentPoint = {
            x: 0,
            y: 0
        };


        $(document).bind('touchstart', {
            self: self
        }, self.onTouchStartEvent);
        $(document).bind('touchmove', {
            self: self
        }, self.onTouchMoveEvent);
        $(document).bind('touchend', {
            self: self
        }, self.onTouchEndEvent);


        if (window.orientation == undefined) {


        } else {
            if (window.orientation == 0) {

                window.addEventListener('orientationchange', function(e) {

                    self.onOrientationChange();

                });
                self.onOrientationChange();
            } else {

                window.addEventListener('orientationchange', function(e) {

                    self.onOrientationChange();

                });
                self.onOrientationChange();
            }

            alert(2222);
        }




    },
    onExplainBodyBtn: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        self.onExplainBodyBtnEvent();
    },
    onExplainBodyBtnEvent: function() {

    },
    onSoundBodyBtn: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        self.onSoundBodyBtnEvent();
    },
    onSoundBodyBtnEvent: function() {


    },
    onOrientationChange: function() {
        var self = this;

    },
    shareBlock: function() {
        var self = this;
        self._shareBody.css('display', 'block');
    },
    shareNone: function() {
        var self = this;
        self._shareBody.css('display', 'none');
    },
    onTouchStartEvent: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        var point = gb.point.getMousePoint(e);
        self._currentPoint.x = point.x;
        self._currentPoint.y = point.y;
    },
    onTouchMoveEvent: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        var point = gb.point.getMousePoint(e);
    },
    onTouchEndEvent: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        var point = gb.point.getMousePoint(e);


        if (app._isMove) {
            return;
        }

        console.log('0');
        if (app._isStart) {

            console.log('0.1');

            if (point.x < self._currentPoint.x) {
                console.log('1');
                app.nextPage();
                //ga('send', 'event', 'home', 'home_turn_btn');
                app._isStart = false;
                app._isMove = true;
            }
        } else {
            console.log('0.2');


            if (Math.abs(self._currentPoint.y - point.y) > 100) {
                //if(self._currentPoint.y < point.y){
                //
                //    if(app.currentId == (app.totalNums-1)){
                //        app._isAuto = true;
                //        app.prevPage();
                //        $(document).unbind();
                //        console.log('最后倒放');
                //        return;
                //    }
                //    app.nextPage();
                //    console.log('向下移动');
                //}
                if (self._currentPoint.y > point.y) {


                    console.log('1');
                    if (app.currentId == (app.totalNums - 1)) {
                        app._isAuto = true;
                        $('.explain-body').css('display', 'none');
                        $('.explain-body-btn').css('display', 'none');

                        app.prevPage();
                        SoundManage.stopSound();
                        $(document).unbind();
                        console.log('最后倒放');
                        return;
                    }

                    if (SoundManage._isSoundPlay) {
                        SoundManage._isSoundPlay = false;
                        _exisleft = true;
                        $('.explain1').css('display', 'block');
                        $('.explain2').css('display', 'none');
                        SoundManage.stopSound();
                    }
                    app._isMove = true;
                    app.nextPage();
                    // ga('send', 'event', 'slide', 'vis_slide-up_action', app.currentId);
                    //console.log('向下移动');
                }




            }

        }

    },
    blockTip: function() {

    },
    noneTip: function() {


    },
    visibleTip: function() {

    },
    starTimer: function() {


    },
    stopTimer: function() {

    },
    onTimerEvent: function() {


    },
    bgMoveIn: function() {


    },
    bgMoveOut: function() {

    },
    bgBackMoveIn: function() {

    },
    bgBackMoveOut: function() {

    },
    blockSound: function() {

    },
    tabWhiteFun: function() {

    },
    tabBlackFun: function() {

    }
});

var IndexLoad = BaseClass.extend({
    _loadingTxt: null,
    _loadZhizhen: null,
    _circle: null,
    _loadWatchMain: null,
    _tlAnim: null,
    _loadTxt: null,
    _callback: null,
    ctor: function() {
        var self = this;


    },
    askToAdd: function() {
        var self = this;
    },
    askToRemove: function(data_) {
        var self = this;

    },
    onProgress: function(val_) {
        var self = this;

    },
    onComplete: function() {
        var self = app.getPanel['load'];
        self.toRemove();
        self._callback();
    }
});

var PanelStage1 = BaseClass.extend({
    _panel1TxtHeng1: null,
    _panel1TxtHeng2: null,
    _panel1Txt1: null,
    _panel1Watch: null,
    _panel1Txt2: null,
    _tlAnim: null,
    _panel1Tip: null,
    _orientation: null,
    ctor: function(view_) {

        exportRoot.gotoAndPlay(25);


    },
    askToAdd: function(data_) {
        var self = this;
        self._super(data_);


    },
    askToRemove: function(data_) {
        var self = this;
        self._super(data_);

    },
    startAnimIn: function() {
        var self = this;
       // console.log('startAnimIn::', self.view.attr('id'));


    },
    startAnimOut: function() {
        var self = this;
        self._orientation = 'sout';
        //console.log('startAnimOut::', self.view.attr('id'));
        // self._panel1Tip.css({
        //     opacity: 0,
        //     rotate: 100
        // });
        //self._tlAnim.play();
        app._isStart = true;
        app._isMove = false;
        console.log(app._isStart);


    },
    overAnimIn: function() {
        var self = this;
        //console.log('overAnimIn::', self.view.attr('id'));

        //self.overComplete();
    },
    overAnimOut: function() {
        var self = this;
        //console.log('overAnimOut::',self.view.attr('id'));
        //self.overComplete();

        self._orientation = 'oout';

    },
    anim1: function() {
        var self = this;
        TweenMax.to(self._panel1Tip, 1, {
            alpha: 1,
            delay: 1,
            onComplete: function() {
                self.anim2();
            }
        });
    },
    anim2: function() {
        var self = this;
        TweenMax.to(self._panel1Tip, 1, {
            rotation: -10,
            opacity: 0,
            onComplete: function() {
                self._panel1Tip.css({
                    opacity: 0,
                    rotate: 100
                });
                self.anim1();
            }
        });
    },
    onAnimComplete: function() {
        var self = app.getParameter['panel1'];
        app._isMove = false;
    }
});
var PanelStage2 = BaseClass.extend({
    _panel2Xie1: null,
    _panel2Xie2: null,
    _panel2Txt1: null,
    _panel2TxtHeng1: null,
    _panel2TxtHeng2: null,
    _panel2Txt2: null,
    _panel2Watch1: null,
    _panel2Watch2: null,
    _panel2Watch3: null,
    _panel2Watch4: null,
    _panel2Watch5: null,
    _panel2Watch6: null,
    _panel2Watch7: null,
    _panel2Watch8: null,
    _panel2Watch9: null,
    _panel2Watch10: null,
    _panel2Watch11: null,
    _panel2Watch12: null,
    _panel2WatchBody: null,
    _tlAnim: null,
    _tlAnim2: null,
    _startisleft: false,
    _panel12Txt: null,
    _panel12Heng1: null,
    _panel12Heng2: null,
    _panel12Watch: null,
    _shareBtn: null,
    ctor: function(view_) {
        var self = this;
        self._super($('#PanelStage2'));


        var publicpanel = app.getPanel['public'];

    },
    askToAdd: function(data_) {
        var self = this;

        var publicpanel = app.getPanel['public'];
        publicpanel.starTimer();
        self._startisleft = false;

        self._super(data_);

    },
    askToRemove: function(data_) {
        var self = this;
        self._super(data_);
        var publicpanel = app.getPanel['public'];
        publicpanel.stopTimer();
        publicpanel.noneTip();
        self._startisleft = true;
    },
    startAnimIn: function() {
        var self = this;

        self._tlAnim.play(0);
        //self.endAnim();
    },
    startAnimOut: function() {
        var self = this;

    },
    overAnimIn: function() {
        var self = this;

        self._tlAnim2.play(0);

        //self.overComplete();
    },
    overAnimOut: function() {
        var self = this;
        self._tlAnim.reverse();
        var publicpanel = app.getPanel['public'];
        publicpanel.noneTip();
        var timerssss = 3000;
        if (app._isAuto) {
            timerssss = 1500;
        }
        setTimeout(function() {
            self.overComplete();

        }, timerssss);
    },
    tlAnimComplete: function() {
        var self = app.getPanel['panel2'];
        var publicpanel = app.getPanel['public'];

    },
    tlAnimComplete2: function() {
        var self = app.getPanel['panel2'];
        var publicpanel = app.getPanel['public'];


    },
    endAnim: function() {
        var self = this;


        console.log('endAnim::');
    }
});

/**/
var app = {
    isLoad: false,
    isComplete: false,
    _minisite: null,
    getPanel: null,
    currentPage: '',
    //currentId:-1,
    currentId: -1,
    prevPageId: -1,
    totalNums: 0,
    pageArr: ['panel1', 'panel2', 'panel3', 'panel4', 'panel5', 'panel6', 'panel7', 'panel8', 'panel9', 'panel10', 'panel11'],
    panelFunArr: null,
    _direction: 0,
    _isStart: true,
    _isMove: false,
    _isAuto: false,
    _backId: 0,
    _backArr: [1, 2, 1],
    init: function() {

        // var isleft = gb.fn.getAddressParam('isleft');
        // if (!isleft) {
        //     SoundManage._globalSound.play();
        // }

        this.panelFunArr = [];
        this.panelFunArr['panel1'] = PanelStage1;
        this.panelFunArr['panel2'] = PanelStage2;
        // this.panelFunArr['panel3'] = PanelStage3;
        // this.panelFunArr['panel4'] = PanelStage4;
        // this.panelFunArr['panel5'] = PanelStage5;
        // this.panelFunArr['panel6'] = PanelStage6;
        // this.panelFunArr['panel7'] = PanelStage7;
        // this.panelFunArr['panel8'] = PanelStage8;
        // this.panelFunArr['panel9'] = PanelStage9;
        // this.panelFunArr['panel10'] = PanelStage10;
        // this.panelFunArr['panel11'] = PanelStage11;

        app.totalNums = app.pageArr.length;
        var public = new PublicStage();
        app.getPanel['public'] = public;



        //console.log('init::');
    },
    complete: function() {
        if (app.isLoad && app.isComplete) {
            app.init();
        }
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
    loadComplete: function() {
        app.nextPage();
        //console.log(1111);
    },
    nextPage: function() {
        console.log('test');

        app.prevPageId = app.currentId;
        app.currentId++;

        var len = app.pageArr.length;
        if (app.currentId >= len) {
            app.currentId = len - 1;
            return;
        }
        app.currentPage = app.pageArr[app.currentId];

        app._direction = 2;
        if (app.prevPageId != -1) {

            var prevPanel = app.getPanel[app.pageArr[app.prevPageId]];


            if (!prevPanel) {
                app.panelCallBack();
            } else {
                prevPanel.askToRemove({
                    type: 2,
                    callBack: app.panelCallBack
                });
            }
            //prevPanel.askToRemove({type:2,callBack:app.panelCallBack});

        } else if (app.prevPageId == -1) {
            app.panelCallBack();
        }

    },
    prevPage: function() {
        app.prevPageId = app.currentId;
        if (app._isAuto) {
            app.currentId = app._backArr[app._backId];
            app._backId++;

        } else {
            app.currentId--;
        }

        if (app.currentId == -1) {
            app.currentId = 0;
            return;
        }

        app.currentPage = app.pageArr[app.currentId];
        app._direction = 1;

        if (app.prevPageId != -1) {
            //app.site.removePanel(app.pageArr[app.prevPageId] , {type:1});

            var prevPanel = app.getPanel[app.pageArr[app.prevPageId]];
            prevPanel.askToRemove({
                type: 1,
                callBack: app.panelCallBack
            });
        }
    },
    panelCallBack: function() {

        var panel = app.getPanel[app.pageArr[app.currentId]];

        if (!panel) {
            panel = new app.panelFunArr[app.pageArr[app.currentId]];
            app.getPanel[app.pageArr[app.currentId]] = panel;

        }
        console.log('app._direction=>', app._direction, 'panel=>', panel, 'app.currentId=>', app.currentId, 'app.pageArr[app.currentId]=>', app.pageArr[app.currentId]);
        panel.askToAdd({
            type: app._direction
        });

    }
};

$(function() {

    //代码片段，能看懂就行
    createjs.Touch.enable(stage, true, false);
    //让createjs可以使用touch 

    //init the canvas animation when it ready.
    init();

    //app function
    app.getPanel = {};
    //var indexload = new IndexLoad();
    //app.getPanel['load'] = indexload;


    app.resize();
    gb.events.addHandler(window, 'load', initView);

    function initView() {
        gb.events.removeHandler(window, 'load', initView);
        //SoundManage.init();
        app.isLoad = true;
        app.complete();

        app.init();
    }



});

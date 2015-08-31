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
        self.view.css('display', 'block');
    },
    toRemove: function() {
        var self = this;
        self.view.css('display', 'none');
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
        //$('.next-btn').bind('click',function(){
        //    app.nextPage();
        //    console.log('next::');
        //});
        //$('.prev-btn').bind('click',function(){
        //    app.prevPage();
        //    console.log('prev::');
        //});

        self._publicTip = $('.public-tip');
        self._publicTip.css('opacity', 0);
        TweenMax.to(self._publicTip, 1, {
            repeat: -1,
            yoyo: true,
            css: {
                bottom: 10
            }
        });

        self._panelMeteor = $('.panel-meteor');
        self._panelMeteor.css({
            left: -93,
            top: -74
        });

        self._whiteBgBody = $('.white-bg-body');
        self._whiteBgBody.css({
            top: '130%'
        });
        //self._whiteBgBody.css({top:'-10%'});

        self._publicTip1 = $('.public-tip1');
        self._publicTip2 = $('.public-tip2');

        self._soundBody = $('.sound-body');
        self._blackSoundBody = $('.black-sound-body');
        self._whiteSoundBody = $('.white-sound-body');

        self._explainBody = $('.explain-body');
        //var _exisleft = true;
        self._blackExplain = $('.black-explain');
        self._whiteExplain = $('.white-explain');
        self._explainBody.bind('touchend', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (_exisleft) {
                SoundManage.playSound();
                _exisleft = false;
                $('.explain1').css('display', 'none');
                $('.explain2').css('display', 'block');
            } else {
                SoundManage.stopSound();
                _exisleft = true;
                $('.explain1').css('display', 'block');
                $('.explain2').css('display', 'none');
            }

        });

        $('.explain-body-btn').bind('touchend', {
            self: self
        }, self.onExplainBodyBtn);


        $(document).bind('touchstart', {
            self: self
        }, self.onTouchStartEvent);
        $(document).bind('touchmove', {
            self: self
        }, self.onTouchMoveEvent);
        $(document).bind('touchend', {
            self: self
        }, self.onTouchEndEvent);


        self._shareBody = $('.share-body');
        self._shareBody.bind('touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.shareNone();
        });

        //$('.sound-btn1').bind('touchend',function(e){
        //    e.stopPropagation();
        //    e.preventDefault();
        //    if(SoundManage._isSoundPlay) return;
        //    SoundManage._globalSound.play();
        //    $('.sound-btn1').css('display','none');
        //    $('.sound-btn2').css('display','block');
        //});
        //$('.sound-btn2').bind('touchend',function(e){
        //    e.stopPropagation();
        //    e.preventDefault();
        //    if(SoundManage._isSoundPlay) return;
        //    SoundManage._globalSound.stop();
        //    $('.sound-btn1').css('display','block');
        //    $('.sound-btn2').css('display','none');
        //});

        $('.sound-body-btn').bind('touchend', {
            self: self
        }, self.onSoundBodyBtn);

        $('.heng-img').bind('touchstart', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $('.heng-img').bind('touchmove', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $('.heng-img').bind('touchend', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });


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

            //            alert(2222);
        }




    },
    onExplainBodyBtn: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        self.onExplainBodyBtnEvent();
    },
    onExplainBodyBtnEvent: function() {
        if (_exisleft) {
            SoundManage.playSound();
            _exisleft = false;
            $('.explain1').css('display', 'none');
            $('.explain2').css('display', 'block');
        } else {
            SoundManage.stopSound();
            _exisleft = true;
            $('.explain1').css('display', 'block');
            $('.explain2').css('display', 'none');
        }
    },
    onSoundBodyBtn: function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = e.data.self;
        self.onSoundBodyBtnEvent();
    },
    onSoundBodyBtnEvent: function() {
        var self = this;
        if (self.isleftsoundbodybtn) {
            self.isleftsoundbodybtn = false;
            SoundManage._globalSound.stop();
            $('.sound-btn1').css('display', 'block');
            $('.sound-btn2').css('display', 'none');
        } else {
            self.isleftsoundbodybtn = true;
            SoundManage._globalSound.play();
            $('.sound-btn1').css('display', 'none');
            $('.sound-btn2').css('display', 'block');
        }

    },
    onOrientationChange: function() {
        var self = this;
        //        alert(11111);
        switch (window.orientation) {
            case 0:
                {
                    $('.heng-img').css({
                        display: 'none'
                    });
                    //alert(1111);
                    break;
                }
            case -90:
                {
                    $('.heng-img').css({
                        display: 'block'
                    });
                    //alert(-90);
                    break;
                }
            case 90:
                {
                    $('.heng-img').css({
                        display: 'block'
                    });
                    //alert(90);
                    break;
                }
            case 180: //仅iPad支持
                {
                    $('.heng-img').css({
                        display: 'none'
                    });
                    //alert(180);
                    break;
                }
        }
        $('body').scrollTop(0);
        $('body').scrollLeft(0);
        //        console.log(window.orientation);
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


        if (app._isStart) {
            if (point.x < self._currentPoint.x) {
                app.nextPage();
                //ga('send', 'event', 'home', 'home_turn_btn');
                app._isStart = false;
                app._isMove = true;
            }
        } else {
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
        var self = this;
        TweenMax.to(self._publicTip, 0.3, {
            alpha: 1
        });

    },
    noneTip: function() {
        var self = this;
        TweenMax.to(self._publicTip, 0.3, {
            alpha: 0
        });

    },
    visibleTip: function() {
        var self = this;
        self._publicTip.css('display', 'none');
    },
    starTimer: function() {
        var self = this;
        self._panelMeteor.css({
            left: -93,
            top: 0,
            opacity: 1
        });
        self._timer = setInterval(self.onTimerEvent, 7000);

    },
    stopTimer: function() {
        var self = this;
        clearInterval(self._timer);
        TweenMax.to(self._panelMeteor, 0.3, {
            opacity: 0
        });
    },
    onTimerEvent: function() {

        var publicpanel = app.getPanel['public'];
        //var randomleft = 320-Math.random()*93;
        //var randomtop = 504-Math.random()*74;

        TweenMax.to(publicpanel._panelMeteor, 5, {
            css: {
                left: 504,
                top: 320
            },
            ease: Linear.easeNone,
            onComplete: function() {
                publicpanel._panelMeteor.css({
                    left: -93,
                    top: 0
                });
            }
        });
        //TweenMax.to(publicpanel._panelMeteor,1,{
        //    css:{
        //        opacity:1
        //    }
        //});
        //TweenMax.to(publicpanel._panelMeteor,1,{
        //    css:{
        //        opacity:0
        //    },
        //    delay:2
        //});
    },
    bgMoveIn: function() {
        var self = this;
        if (!app._isAuto) {
            //self._whiteBgBody.css({left:-1085,top:-1085});
            TweenMax.to(self._whiteBgBody, 3, {
                top: '-10%',
                opacity: 1
            });
        }


    },
    bgMoveOut: function() {
        var self = this;
        if (!app._isAuto) {
            //TweenMax.to(self._whiteBgBody,2,{width:0,height:0,left:0,top:0,opacity:0});
            TweenMax.to(self._whiteBgBody, 3, {
                top: '130%',
                opacity: 1
            });
        }
    },
    bgBackMoveIn: function() {
        var self = this;
        if (!app._isAuto) {
            //TweenMax.to(self._whiteBgBody, 2, {left: -1085, top: -1085});
            TweenMax.to(self._whiteBgBody, 2, {
                width: 600,
                height: 600,
                left: -300,
                top: -300,
                opacity: 1
            });
        }
    },
    bgBackMoveOut: function() {
        var self = this;
        if (!app._isAuto) {
            //self._whiteBgBody.css({left: 320, top: 504});
            //TweenMax.to(self._whiteBgBody, 2, {left: -355, top: -357});
            TweenMax.to(self._whiteBgBody, 2, {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                opacity: 0
            });
        }
    },
    blockSound: function() {
        var self = this;
        self._soundBody.css('display', 'block');
        self._explainBody.css('display', 'block');
        $('.explain-body-btn').css('display', 'block');
        $('.sound-body-btn').css('display', 'block');
    },
    tabWhiteFun: function() {
        var self = this;
        self._publicTip1.css('display', 'none');
        self._publicTip2.css('display', 'block');

        self._blackSoundBody.css('display', 'none');
        self._whiteSoundBody.css('display', 'block');

        self._blackExplain.css('display', 'none');
        self._whiteExplain.css('display', 'block');

        $('.black-laba').css('display', 'none');
        $('.white-laba').css('display', 'block');

        $('.black-explain-rotation').css('display', 'none');
        $('.white-explain-rotation').css('display', 'block');

        $('.next-btn').css('color', '#000');
        $('.prev-btn').css('color', '#000');
    },
    tabBlackFun: function() {
        var self = this;
        self._publicTip1.css('display', 'block');
        self._publicTip2.css('display', 'none');

        self._blackSoundBody.css('display', 'block');
        self._whiteSoundBody.css('display', 'none');

        self._blackExplain.css('display', 'block');
        self._whiteExplain.css('display', 'none');

        $('.black-laba').css('display', 'block');
        $('.white-laba').css('display', 'none');

        $('.black-explain-rotation').css('display', 'block');
        $('.white-explain-rotation').css('display', 'none');

        $('.next-btn').css('color', '#fff');
        $('.prev-btn').css('color', '#fff');
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
        self._super($('#loadBody'));

        self._loadingTxt = self.view.find('.loading-txt');
        self._loadZhizhen = self.view.find('.load-zhizhen');
        //TweenMax.to(self._loadZhizhen,1,{rotation:360});

        //self._circle = $('#cricle').circleProgress({
        //    circleRightColor:'#000',
        //    circleLeftColor:'#000',
        //    baseColor:'#000',
        //    circleRadius:30,
        //    maskRadius:10,
        //    textSize:10,
        //    textColor:'#f00',
        //    backgroundImage:'images/load-yellow.png',
        //    backgroundSize:'60px 60px',
        //    max:100
        //});

        self._loadWatchMain = self.view.find('.load-watch-main');
        self._loadTxt = self.view.find('.load-txt');
        self._tlAnim = new TimelineLite({
            onComplete: self.onComplete
        });

        //self._tlAnim.to(self._loadWatchMain,0.6,{scaleX:1.3,scaleY:1.3,onComplete:function(){console.log(1111);}}).to(self._tlAnim,0.6,{scaleX:0.8,scaleY:0.8,alpha:0,onComplete:function(){console.log(22222);}});
        //self._tlAnim.append( TweenMax.to(self._loadWatchMain,0.6,{scaleX:1.1,scaleY:1.1 }) );
        //self._tlAnim.append( TweenMax.to(self._loadTxt,0.4,{alpha:0 }) );
        self._tlAnim.append(TweenMax.to([self._loadWatchMain, self._loadTxt], 0.6, {
            alpha: 0
        }));
        self._tlAnim.pause();

        //self._circle.play(5);
        //circle.rotate(50);

    },
    askToAdd: function() {
        var self = this;
        self._super();
    },
    askToRemove: function(data_) {
        var self = this;
        //self._super();
        self._callback = data_.callback;

        self._tlAnim.play();


    },
    onProgress: function(val_) {
        var self = this;
        self._loadingTxt.html(val_ + '%');
        self._loadZhizhen.css('rotate', val_ / 100 * 360);
        var len = $('.dian').length;
        for (var i = 0; i < len; i++) {
            if (i <= parseInt(val_ / 100 * 60)) {
                $('.dian').eq(i).css('display', 'block');
            } else {
                $('.dian').eq(i).css('display', 'none');
            }
        }
        //self._circle.rotate(val_);
        //console.log('onProgress::',val_,val_/100*360,val_/100*60);
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
        var self = this;
        self._super($('#PanelStage1'));
        exportRoot.gotoAndPlay(25);
        // self._panel1TxtHeng1 = self.view.find('.panel1-txt-heng1');
        // self._panel1TxtHeng1.css({
        //     top: 46,
        //     opacity: 0
        // });
        // self._panel1TxtHeng2 = self.view.find('.panel1-txt-heng2');
        // self._panel1TxtHeng2.css({
        //     top: 46,
        //     opacity: 0
        // });
        // self._panel1Txt1 = self.view.find('.panel1-txt1');
        // self._panel1Txt1.css({
        //     top: 50,
        //     height: 0
        // });
        // self._panel1Watch = self.view.find('.panel1-watch');
        // self._panel1Watch.css({
        //     scale: 0.8,
        //     opacity: 0
        // });
        // self._panel1Txt2 = self.view.find('.panel1-txt2');
        // self._panel1Txt2.css({
        //     opacity: 0,
        //     top: 199
        // });
        // self._panel1Tip = self.view.find('.panel1-tip');
        // self._panel1Tip.css({
        //     opacity: 0,
        //     rotate: 100
        // });

        // //self._tlAnim = new TimelineLite({onComplete:self.onAnimComplete});
        // //
        // //var tw1 = new TweenMax(self._panel1TxtHeng1,0.4,{css:{top:19}});
        // //var tw2 = new TweenMax(self._panel1TxtHeng2,0.4,{css:{top:88}});
        // //var tw3 = new TweenMax(self._panel1Txt1,0.4,{css:{top:34,height:41},delay:0.1});
        // //var tw4 = new TweenMax(self._panel1Watch,0.6,{scaleX:1,scaleY:1,alpha:1,delay:0.3,onComplete:function(){
        // //
        // //    self.anim1();
        // //
        // //
        // //}});
        // //var tw5 = new TweenMax(self._panel1Txt2,0.4,{css:{top:179,alpha:1},delay:0.8});
        // //self._tlAnim.insert(tw1);
        // //self._tlAnim.insert(tw2);
        // //self._tlAnim.insert(tw3);
        // //self._tlAnim.insert(tw4);
        // //self._tlAnim.insert(tw5);
        // //self._tlAnim.pause();

    },
    askToAdd: function(data_) {
        var self = this;
        self._super(data_);
        // var publicpanel = app.getPanel['public'];
        // publicpanel.starTimer();
        // publicpanel.blockSound();
        // $('.explain-body').css('display', 'none');
        // $('.explain-body-btn').css('display', 'none');

    },
    askToRemove: function(data_) {
        var self = this;
        self._super(data_);
        // var publicpanel = app.getPanel['public'];
        // publicpanel.stopTimer();
        // publicpanel.noneTip();
    },
    startAnimIn: function() {
        var self = this;
        console.log('startAnimIn::',self.view.attr('id'));


        // self._orientation = 'sin';
        // self._panel1Tip.css({
        //     opacity: 0,
        //     rotate: 100
        // });

        // //self._tlAnim.play();
        // //return;
        // TweenMax.to(self._panel1TxtHeng1, 1.4, {
        //     css: {
        //         top: 19,
        //         opacity: 1
        //     }
        // });
        // TweenMax.to(self._panel1TxtHeng2, 1.4, {
        //     css: {
        //         top: 88,
        //         opacity: 1
        //     }
        // });
        // TweenMax.to(self._panel1Txt1, 1.4, {
        //     css: {
        //         top: 34,
        //         height: 41
        //     },
        //     delay: 0.1
        // });
        // TweenMax.to(self._panel1Watch, 1.6, {
        //     scaleX: 1,
        //     scaleY: 1,
        //     alpha: 1,
        //     delay: 0.3,
        //     onComplete: function() {

        //         self.anim1();


        //     }
        // });
        // TweenMax.to(self._panel1Txt2, 1.4, {
        //     css: {
        //         top: 179,
        //         alpha: 1
        //     },
        //     delay: 0.8
        // });


    },
    startAnimOut: function() {
        var self = this;
        self._orientation = 'sout';
        console.log('startAnimOut::',self.view.attr('id'));
        // self._panel1Tip.css({
        //     opacity: 0,
        //     rotate: 100
        // });
        //self._tlAnim.play();
        app._isStart = true;
        app._isMove = false;
        console.log(app._isStart);
        // self._panel1Tip.css({
        //     opacity: 0,
        //     rotate: 100
        // });
        // TweenMax.to(self._panel1TxtHeng1, 1.4, {
        //     css: {
        //         top: 19,
        //         opacity: 1
        //     }
        // });
        // TweenMax.to(self._panel1TxtHeng2, 1.4, {
        //     css: {
        //         top: 88,
        //         opacity: 1
        //     }
        // });
        // TweenMax.to(self._panel1Txt1, 1.4, {
        //     css: {
        //         top: 34,
        //         height: 41
        //     },
        //     delay: 0.1
        // });
        // TweenMax.to(self._panel1Watch, 1.6, {
        //     scaleX: 1,
        //     scaleY: 1,
        //     alpha: 1,
        //     delay: 0.3,
        //     onComplete: function() {

        //         self.anim1();


        //     }
        // });
        // TweenMax.to(self._panel1Txt2, 0.4, {
        //     css: {
        //         top: 179,
        //         alpha: 1
        //     },
        //     delay: 0.8
        // });

    },
    overAnimIn: function() {
        var self = this;
        console.log('overAnimIn::',self.view.attr('id'));

        self._orientation = 'oin';
        TweenMax.killTweensOf(self._panel1Tip);
        //
        TweenMax.set($('.fenzhen'), {
            rotation: 0
        });
        TweenMax.to($('.fenzhen'), 1, {
            rotation: -360
        });
        TweenMax.to(self._panel1Tip, 1, {
            alpha: 0,
            onComplete: function() {


                TweenMax.to(self._panel1TxtHeng1, 1.4, {
                    css: {
                        top: 46,
                        opacity: 0
                    },
                    delay: 0.8
                });
                TweenMax.to(self._panel1TxtHeng2, 1.4, {
                    css: {
                        top: 46,
                        opacity: 0
                    },
                    delay: 0.8
                });
                TweenMax.to(self._panel1Txt1, 1.4, {
                    css: {
                        top: 50,
                        height: 0
                    },
                    delay: 0.3
                });
                TweenMax.to(self._panel1Watch, 1.6, {
                    scaleX: 0.8,
                    scaleY: 0.8,
                    alpha: 0,
                    delay: 1.1,
                    onComplete: function() {
                        self.overComplete();
                    }
                });
                TweenMax.to(self._panel1Txt2, 1.4, {
                    css: {
                        top: 199,
                        alpha: 0
                    }
                });

                //    self._tlAnim.reverse();
            }
        });




        //self.overComplete();
    },
    overAnimOut: function() {
        var self = this;
        //console.log('overAnimOut::',self.view.attr('id'));
        //self.overComplete();

        self._orientation = 'oout';

        TweenMax.killTweensOf(self._panel1Tip);



        //
        TweenMax.to(self._panel1Tip, 1, {
            alpha: 0,
            onComplete: function() {
                //
                //
                TweenMax.to(self._panel1TxtHeng1, 0.4, {
                    css: {
                        top: 46,
                        opacity: 0
                    },
                    delay: 0.8,
                    onComplete: function() {
                        self.overComplete();
                    }
                });
                TweenMax.to(self._panel1TxtHeng2, 0.4, {
                    css: {
                        top: 46,
                        opacity: 0
                    },
                    delay: 0.8
                });
                TweenMax.to(self._panel1Txt1, 0.4, {
                    css: {
                        top: 50,
                        height: 0
                    },
                    delay: 0.3
                });
                TweenMax.to(self._panel1Watch, 0.6, {
                    scaleX: 0.8,
                    scaleY: 0.8,
                    alpha: 0,
                    delay: 0.1
                });
                TweenMax.to(self._panel1Txt2, 0.4, {
                    css: {
                        top: 199,
                        alpha: 0
                    }
                });
                //
                //    self._tlAnim.reverse();
            }
        });

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
    pageArr: ['panel1', 'panel2', 'panel3', 'panel4', 'panel5', 'panel6', 'panel7', 'panel8', 'panel9', 'panel10', 'panel11' ],
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


        //setTimeout(function(){
        // var indexload = app.getPanel['load'];
        // indexload.askToRemove({
        //     callback: app.loadComplete
        // });

        //},1500);

        // var loaderlist = [];
        //for(var i = 0 ; i <= 107 ; i++){
        //    var name = '';
        //    if(i <= 9){
        //        name = 'images/fire/0_0000'+i+'.png';
        //    }else if(i >= 10 && i <= 99){
        //        name = 'images/fire/0_000'+i+'.png';
        //    }else{
        //        name = 'images/fire/0_00'+i+'.png';
        //    }
        //    loaderlist.push(name);
        //}

        //for(var i = 1 ; i <= 100 ; i++){
        //    var name = '';
        //    name = 'images/shaizi/'+i+'.png';
        //    loaderlist.push(name);
        //
        //}

        // for (var i = 1; i <= 109; i++) {
        //     var name = '';
        //     if (i >= 1 && i <= 9) {
        //         name = 'images/splash/1000' + i + '.png';
        //     } else if (i >= 10 && i <= 99) {
        //         name = 'images/splash/100' + i + '.png';
        //     } else if (i >= 100 && i <= 199) {
        //         name = 'images/splash/10' + i + '.png';
        //     }
        //     loaderlist.push(name);

        // }

        // var loader = new gb.net.ImgsLoader(loaderlist);
        // loader.sgProgress.add(function(pro_) {

        // });
        // loader.sgComplete.add(function(pro_) {

        // });
        // loader.load();





        //app.nextPage();

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



        //panel.askToAdd({type:2});

        //app.site.addPanel(app.pageArr[app.currentId] , {type:2});
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
        //var panel = app.getPanel[ app.pageArr[app.currentId] ];
        //if(!panel){
        //
        //    panel = app.panelFunArr[ app.pageArr[app.currentId] ];
        //    app.getPanel[ app.pageArr[app.currentId] ] = panel;
        //
        //}
        //
        //panel.askToAdd({type:1});

        //app.site.addPanel(app.pageArr[app.currentId] , {type:1});
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

    /*
    var loaderlist = [];
    for (var i = 0; i <= 17; i++) {
        var name = '';
        if (i <= 9) {
            name = 'images/fire2/01_0000' + i + '.png';
        } else if (i >= 10 && i <= 99) {
            name = 'images/fire2/01_000' + i + '.png';
        }
        loaderlist.push(name);
    }

    var loader = new gb.net.ImgsLoader(loaderlist);
    loader.sgProgress.add(function(pro_) {
        indexload.onProgress(parseInt(pro_.target.progress * 100));
        //console.log(parseInt(pro_.target.progress*50)+50);
    });
    loader.sgComplete.add(function(pro_) {
        app.isComplete = true;
        app.complete();
        //console.log('imgcomoplete::');
    });
    loader.load();
*/
    //var _len = $('img').length;
    //var _current = 0;
    //var _loadingPages = $('#loadingPages');
    //$('img').bind('load',function(e){
    //    _current++;
    //    indexload.onProgress(parseInt(_current/(_len-1)*50));
    //    if(_current == (_len-1)){
    //        $('img').unbind();
    //
    //        //app.isComplete = true;
    //        //app.complete();
    //
    //
    //        //console.log('allimgcomoplete::');
    //
    //
    //    }
    //    //console.log(_current);
    //});

});

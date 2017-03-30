// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'monospaced.elastic'])
.run(function ($ionicPlatform, $http, Push) {

    $ionicPlatform.ready(function () {
//        console.log('window.device');
//        console.log(window.device);

//        console.log('ionic.Platform.device()');
//        console.log(ionic.Platform.device());

        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        window.addEventListener('native.keyboardshow', function (e) {
            if (document.getElementById('barMessageInput') != null) {
                document.getElementById('barMessageInput').style.bottom = e.keyboardHeight + 'px';
            }

        });

        window.addEventListener('native.keyboardhide', function (e) {
            if (document.getElementById('barMessageInput') != null) {
                document.getElementById('barMessageInput').style.bottom = '0px';
            }
        });

        //jpush callback method
        var notificationCallback = function (data) {
            console.log('received data :' + data);
            var notification = angular.fromJson(data);
            //app 是否处于正在运行状态
            var isActive = notification.notification;

            // here add your code
            //ios
            if (ionic.Platform.isIOS()) {
                //window.alert(notification);
            } else {
                //非 ios(android)
            }
        };

        //初始化
        Push.init(notificationCallback);
        //设置别名
        //Push.setAlias("12345678");

        console.log('start to define addEventListener');
        var onOpenNotification = function (event) {
            try {
                if (window.plugins) {
                    console.log('打开通知消息');
                    window.plugins.jPushPlugin.setBadge(0);
                    window.plugins.jPushPlugin.resetBadge();
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                }
            }
            catch (exception) {
                console.log(exception)
            }
        };
        onOpenNotification(null);

        var onBackgroundNotification = function (event) {
            console.log("JPushPlugin:onBackgroundNotification is triggered");
        };
        var onReceiveNotification = function (event) {
            try {
                console.log('接收新的推送通知');
                var alert = event.aps.alert; //通知内容  
                window.plugins.jPushPlugin.setBadge(event.aps.badge);
                console.log("JPushPlugin:onReceiveNotification key aps.alert:" + alert);
            }
            catch (exeption) {
                console.log(exception)
            }
        };
        console.log('end to define addEventListener');
        console.log('start to add addEventListener');
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        document.addEventListener("jpush.backgroundNotification", onBackgroundNotification, false);
        console.log('end to add addEventListener');


        document.addEventListener("resume", onResume, false);
        function onResume() {
            // Handle the resume event  
            setTimeout(function () {
                // TODO: do your thing!  
                console.log('应用重新从后台恢复到前台');
                onOpenNotification(null);
            }, 0);
        }

        bll.logView(1, 'open', $http);

    });
});


app.factory('Push', function () {
    var push;
    return {
        setBadge: function (badge) {
            if (push) {
                console.log('jpush: set badge', badge);
                plugins.jPushPlugin.setBadge(badge);
            }
        },
        setAlias: function (alias) {
            if (push) {
                console.log('jpush: set alias', alias);
                plugins.jPushPlugin.setAlias(alias);
            }
        },
        check: function () {
            if (window.jpush && push) {
                plugins.jPushPlugin.receiveNotificationIniOSCallback(window.jpush);
                window.jpush = null;
            }
        },
        init: function (notificationCallback) {
            console.log('jpush: start init-----------------------');
            push = window.plugins && window.plugins.jPushPlugin;
            if (push) {
                plugins.jPushPlugin.receiveNotificationIniOSCallback = function () { console.log('jpush: init get get'); };
                console.log('jpush: init14');
                console.log(typeof (notificationCallback));
                console.log('jpush: init15');

                //启动极光推送服务  
                plugins.jPushPlugin.init();

                //调试模式，这样报错会在应用中弹出一个遮罩层显示错误信息
                plugins.jPushPlugin.setDebugMode(true);
                //plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
                //plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
            }
        }
    };
});



app.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('tabs.home', {
            url: "/home",
            views: {
                'home-tab': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeTabCtrl'
                }
            }
        })
        .state('tabs.line', {
            
            url: "/line",
            views: {
                'line-tab': {
                    templateUrl: "templates/line.html"
                }
            }
        })
        .state('tabs.line-add', {
            params: { "line_id": 0, "create_next":0 },
            url: "/line-add",
            views: {
                'line-tab': {
                    templateUrl: "templates/line-add.html"
                }
            }
        })
        .state('tabs.line-sel', {
            params: { "line_id": 0, "create_next": 0 },
            url: "/line-sel",
            views: {
                'line-tab': {
                    templateUrl: "templates/line-sel.html"
                }
            }
        })
        .state('tabs.line-detail', {
            params: { "line_id": 0},
            url: "/line-add",
            views: {
                'line-tab': {
                    templateUrl: "templates/line-detail.html"
                }
            }
        })
        .state('tabs.detail', {
            params: { "plat_id": 0 },
            url: '/detail',
            views: {
                'home-tab': {
                    
                    templateUrl: "templates/detail.html"
                }
            }
        })
        .state('tabs.detail-plat', {
            params: { "plat_id": 0 },
            url: '/detail-plat',
            views: {
                'plat-tab': {
                    templateUrl: "templates/detail.html"
                }
            }
        })
        .state('tabs.detail-card', {
            params: { "plat_id": 0 },
            url: '/detail-card',
            views: {
                'card-tab': {
                    templateUrl: "templates/detail.html"
                }
            }
        })
        .state('tabs.plat', {
            url: "/plat",
            views: {
                'plat-tab': {
                    templateUrl: "templates/plat.html"
                }
            }
        })
        .state('tabs.card', {
            url: "/card",
            views: {
                'card-tab': {
                    templateUrl: "templates/card.html"
                }
            }
        })
        .state('tabs.me', {
            url: "/set",
            views: {
                'me-tab': {
                    templateUrl: "templates/set.html"
                }
            }
        })
        .state('tabs.about', {
            url: "/about",
            views: {
                'me-tab': {
                    templateUrl: "templates/about.html"
                }
            }
        })
        .state('tabs.message-detail', {
            url: "/message-detail",
            views: {
                'me-tab': {
                    templateUrl: "templates/message-detail.html"
                }
            }
        })
        ;

        if(bll.title == '51贷款管家')
            $urlRouterProvider.otherwise("/tab/line");
        else
            $urlRouterProvider.otherwise("/tab/home");

    });




    app.controller('HomeTabCtrl', function ($scope, $http, $q, $rootScope, $state, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate, $ionicViewSwitcher, $ionicLoading) {

        if (bll.title != '51贷款管家') {

            $ionicModal.fromTemplateUrl('templates/login.modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.loginModal = modal;
            });

            $rootScope.showLoading = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner>',
                    noBackdrop: true
                });
            }

            $rootScope.hideLoading = function () {
                $ionicLoading.hide();
            }

            $rootScope.goLine = function () {
                $state.go('tabs.line');
            }
            $rootScope.appTitle = bll.title;
            $rootScope.alert = function (content) {
                $ionicPopup.alert({
                    title: '提示',
                    template: content,
                    okText: '确定'
                });
            }

            $rootScope.getUser = function () { return bll.getUser() };
            $rootScope.User = bll.getUser();



            $rootScope.isLogin = function () {
                return bll.isLogin();
            }

            $rootScope.isRegister = false;
            $scope.loginTitle = '登录';
            $scope.loginBtnTitle = '登录';
            $rootScope.showLogin = function () {
                $scope.loginModal.show();
            }
            $rootScope.hideLogin = function () {
                $rootScope.isRegister = false;
                $scope.loginTitle = '登录';
                $scope.loginBtnTitle = '登录';
                $scope.loginModal.hide();
            }
            $rootScope.goRegister = function () {
                $rootScope.isRegister = true;
                $scope.loginTitle = '注册';
                $scope.loginBtnTitle = '注册';
            }


            $rootScope.onTapLogin = function (m, p, cp) {
                var type = 1;
                if ($rootScope.isRegister) type = 2;
                var check = function (m, p, cp) {
                    if (!com.checkMobile(m))
                        return '手机号码不正确';
                    if (p.length < 6)
                        return '密码至少需要6位';

                    if (type == 2) {
                        if (p != cp)
                            return '确认密码不一致';
                    }

                    return '';
                }
                var c = check(m, p, cp);
                if (c.length > 0) {
                    com.alert(c);
                    return;
                }
                var fn = function (data) {
                    $rootScope.hideLoading();
                    if (data && data.code == 0) {
                        $rootScope.User = bll.getUser();
                        $rootScope.reloadLine = true;
                        $rootScope.hideLogin();
                    }
                    else {
                        com.alert(data.msg);
                    }
                }
                $rootScope.showLoading();
                bll.login(type, m, p, fn, $http);
            }

            $rootScope.resetHeight = function () {
                return screen.height;
            }
            $rootScope.resetWidth = function () {
                return screen.width;
            }
            $rootScope.cardWidth = function () {
                return screen.width / 2 - 20;
            }


            $scope.aryAd01 = [];
            var fn = function (data) {
                $rootScope.hideLoading();
                if (!data) return;
                if (data && data.code != 0) {
                    com.checkReload();
                    return;
                }
                //$scope.category = ['人气贷款', '大额贷款', '短期贷款', '线上贷款', '信用卡代还', '线下贷款', '贷款搜索'];
                $rootScope.records = data.Records;
                $rootScope.category = data.Category;

                var records = [];
                var aryAd01 = [];
                var aryAd02 = [];
                for (var i = 0; i < data.Records.length; i++) {

                    var item = data.Records[i];
                    records[item.auto_id] = item;

                    if (item.ad_position == 1 || item.ad_position == 3) {
                        aryAd01.push(item.auto_id);
                    }
                    if (item.ad_position == 2 || item.ad_position == 3) {
                        aryAd02.push(item.auto_id);
                    }
                }

                $scope.recordMap = records;
                $scope.aryAd01 = aryAd01;
                $scope.aryAd02 = aryAd02;

                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.loop(true);
            }


            $rootScope.getItem = function (id) {
                return $scope.recordMap[id];
            }

            var fnMaterial = function (data) {
                if (data && data.code == 0) {

                    var records = [];
                    for (var i = 0; i < data.Records.length; i++) {
                        records[data.Records[i].auto_id] = data.Records[i];
                    }
                    $scope.Materials = records;
                }
            }

            $rootScope.getMaterial = function (id) {
                return $scope.Materials[id].name;
            }

            var funcA = function () {
                console.log("funcA");
                return bll.getServeInfo(function (data) {  }, $http);
            }
            var funcB = function () {
                console.log("funcB");
                return bll.getLoanMaterial(fnMaterial, $http);
            }
            var funcC = function () {
                console.log("funcC");
                return bll.getLoanPlats(0, fn, $http);
            }

            $rootScope.showLoading();
            $q.all([funcA(), funcB(), funcC()])
        .then(function (ary) {
            $rootScope.hideLoading();
            //console.log('result123');
            console.log(ary);
            if (ary[1] === undefined && com.getItem("LoanMaterial") == null) {
                com.checkReload();
                return;
            }
            if (ary[2] === undefined && com.getItem("LoanPlats") == null) {
                com.checkReload();
                return;
            }

        });



        }
        //end if





        $scope.onTapPage = function () {
            var curIndex = $ionicSlideBoxDelegate.currentIndex() % $scope.aryAd01.length;
            $scope.onTapItem($scope.getItem($scope.aryAd01[curIndex]));
        }

        $scope.onTapPlat = function (x) {
            com.open(x.ad_url);
        }

        $scope.onTapItem = function (x) {
            //var ref = cordova.InAppBrowser.open(x.ad_url, '_blank', 'location=yes,closebuttoncaption=返回,toolbarposition=top');
            var params =
			{
			    "plat_id": x.auto_id
			};
            $state.go('tabs.detail', params);
        }

    });

    app.controller('LineCtrl', function ($scope, $rootScope, $http, $q, $ionicSlideBoxDelegate, $state, $ionicModal, $ionicActionSheet, $ionicLoading) {


        if (bll.title == '51贷款管家') {


            $ionicModal.fromTemplateUrl('templates/login.modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.loginModal = modal;
            });

            $rootScope.showLoading = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner>',
                    noBackdrop: true
                });
            }

            $rootScope.hideLoading = function () {
                $ionicLoading.hide();
            }

            $rootScope.goLine = function () {
                $state.go('tabs.line');
            }
            $rootScope.appTitle = bll.title;
            $rootScope.alert = function (content) {
                $ionicPopup.alert({
                    title: '提示',
                    template: content,
                    okText: '确定'
                });
            }

            $rootScope.getUser = function () { return bll.getUser() };
            $rootScope.User = bll.getUser();



            $rootScope.isLogin = function () {
                return bll.isLogin();
            }

            $rootScope.isRegister = false;
            $scope.loginTitle = '登录';
            $scope.loginBtnTitle = '登录';
            $rootScope.showLogin = function () {
                $scope.loginModal.show();
            }
            $rootScope.hideLogin = function () {
                $rootScope.isRegister = false;
                $scope.loginTitle = '登录';
                $scope.loginBtnTitle = '登录';
                $scope.loginModal.hide();
            }
            $rootScope.goRegister = function () {
                $rootScope.isRegister = true;
                $scope.loginTitle = '注册';
                $scope.loginBtnTitle = '注册';
            }


            $rootScope.onTapLogin = function (m, p, cp) {
                var type = 1;
                if ($rootScope.isRegister) type = 2;
                var check = function (m, p, cp) {
                    if (!com.checkMobile(m))
                        return '手机号码不正确';
                    if (p.length < 6)
                        return '密码至少需要6位';

                    if (type == 2) {
                        if (p != cp)
                            return '确认密码不一致';
                    }

                    return '';
                }
                var c = check(m, p, cp);
                if (c.length > 0) {
                    com.alert(c);
                    return;
                }
                var fn = function (data) {
                    $rootScope.hideLoading();
                    if (data && data.code == 0) {
                        $rootScope.User = bll.getUser();
                        $rootScope.reloadLine = true;
                        $rootScope.hideLogin();
                    }
                    else {
                        com.alert(data.msg);
                    }
                }
                $rootScope.showLoading();
                bll.login(type, m, p, fn, $http);
            }

            $rootScope.resetHeight = function () {
                return screen.height;
            }
            $rootScope.resetWidth = function () {
                return screen.width;
            }
            $rootScope.cardWidth = function () {
                return screen.width / 2 - 20;
            }


            $scope.aryAd01 = [];
            var fn = function (data) {
                $rootScope.hideLoading();
                if (!data) return;
                if (data && data.code != 0) {
                    com.checkReload();
                    return;
                }
                //$scope.category = ['人气贷款', '大额贷款', '短期贷款', '线上贷款', '信用卡代还', '线下贷款', '贷款搜索'];
                $rootScope.records = data.Records;
                $rootScope.category = data.Category;

                var records = [];
                var aryAd01 = [];
                var aryAd02 = [];
                for (var i = 0; i < data.Records.length; i++) {

                    var item = data.Records[i];
                    records[item.auto_id] = item;

                    if (item.ad_position == 1 || item.ad_position == 3) {
                        aryAd01.push(item.auto_id);
                    }
                    if (item.ad_position == 2 || item.ad_position == 3) {
                        aryAd02.push(item.auto_id);
                    }
                }

                $scope.recordMap = records;
                $scope.aryAd01 = aryAd01;
                $scope.aryAd02 = aryAd02;

                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.loop(true);
            }


            $rootScope.getItem = function (id) {
                return $scope.recordMap[id];
            }

            var fnMaterial = function (data) {
                if (data && data.code == 0) {

                    var records = [];
                    for (var i = 0; i < data.Records.length; i++) {
                        records[data.Records[i].auto_id] = data.Records[i];
                    }
                    $scope.Materials = records;
                }
            }

            $rootScope.getMaterial = function (id) {
                return $scope.Materials[id].name;
            }

            var funcA = function () {
                console.log("funcA");
                return bll.getServeInfo(function (data) { console.log(data); }, $http);
            }
            var funcB = function () {
                console.log("funcB");
                return bll.getLoanMaterial(fnMaterial, $http);
            }
            var funcC = function () {
                console.log("funcC");
                return bll.getLoanPlats(0, fn, $http);
            }

            $rootScope.showLoading();
            $q.all([funcA(), funcB(), funcC()])
        .then(function (ary) {
            $rootScope.hideLoading();
            //console.log('result123');
            console.log(ary);
            if (ary[1] === undefined && com.getItem("LoanMaterial") == null) {
                com.checkReload();
                return;
            }
            if (ary[2] === undefined && com.getItem("LoanPlats") == null) {
                com.checkReload();
                return;
            }

        });



        }
        //end if (bll.title == '51贷款管家') 


        $scope.temporaryRemark = com.getItem("TemporaryRemark") == null ? '' : com.getItem("TemporaryRemark");
        $ionicModal.fromTemplateUrl('templates/remark.modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.remarkModal = modal;
        });

        $scope.submitRemark = function (message) {
            if (typeof (message) == 'undefined')
                return;

            $rootScope.showLoading();
            com.setItem("TemporaryRemark", message);
            setTimeout(function () {
                $rootScope.hideLoading();
                $scope.remarkModal.hide();
            }, 400);
        }

        if (bll.title == '51贷款管家')
            $scope.title = '51贷款管家';
        else
            $scope.title = '我的贷款';

        $scope.showTalk = true;
        if (bll.isLogin()) {
            if ($rootScope.User.user_id != 3)
                $scope.showTalk = false;
        }

        $rootScope.showHide = 0;
        $rootScope.reloadLine = bll.isLogin();
        reload = function (newValue, oldValue, scope) {
            if (!bll.isLogin()) { $scope.Lines = []; $scope.Line = null; $rootScope.reloadLine = false; return };
            if (!$rootScope.reloadLine) return;
            $rootScope.reloadLine = false;
            var fnLine = function (data) {
                $rootScope.hideLoading();
                if (data && data.code == 0) {

                    var diffDays = com.dateDiff(com.convertToDateTime(data.time, 2), com.convertToDateTime(new Date(), 2));
                    if (diffDays > 0) {
                        $scope.diffDays = diffDays;
                    }

                    $scope.Lines = data.Records;
                    if (data.Records.length > 0) {
                        $scope.Line = data.Records[0];
                        $scope.Line.leave_amount = $scope.Line.local_amount - $scope.Line.repayed_amount;

                    }
                }
                else {
                    com.checkReload();
                }
            }
            $rootScope.showLoading();
            bll.getLoanLines($rootScope.showHide, fnLine, $http);
        }
        $scope.$watch('reloadLine', reload);

        $scope.onLineAdd = function () {
            if (!bll.isLogin()) {
                $rootScope.showLogin();
                return;
            }
            $state.go('tabs.line-add');
        }

        $scope.onLineSet = function (x) {
            var params =
			{
			    "line_id": x.auto_id
			};
            $state.go('tabs.line-detail', params);
        }

        $scope.goHome = function (x) {
            $state.go('tabs.home');
        }

        $scope.goPlat = function (x) {
            $state.go('tabs.plat');
        }

        $scope.goMessage = function () {
            $state.go('tabs.message-detail');
        }

        $scope.goSet = function (x) {
            $state.go('tabs.me');
        }



        $scope.more = function () {
            if (!bll.isLogin()) {
                $rootScope.showLogin();
                return;
            }
            var x = $scope.Line;
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '新增贷款'
                }, {
                    text: $rootScope.showHide == 1 ? '关闭隐藏贷款' : '查看隐藏贷款'
                }
                ],
                titleText: '选项',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            if (!bll.isLogin()) {
                                $rootScope.showLogin();
                                return;
                            }
                            $state.go('tabs.line-add');
                            break;
                        case 1:
                            if ($rootScope.showHide == 1)
                                $rootScope.showHide = 0;
                            else
                                $rootScope.showHide = 1;
                            $rootScope.reloadLine = true;
                            break;
                        default:
                            break;
                    }
                    return true;
                }
            });
        }


    });

    app.controller('LineAddCtrl', function ($scope, $rootScope, $http, $state, $stateParams, $ionicHistory) {
        var lineId = $stateParams.line_id;
        var createNext = $stateParams.create_next;

        $rootScope.selectedPlat =
        {
            plat_id: 0,
            loan_name: ''
        }

        if (lineId == 0) {

            $scope.title = '添加贷款';
            $scope.Line =
            {
                loan_name: '',
                attach_label: '',
                loan_amount: 0.00,
                local_amount: 0.00,
                repayment_date: com.convertToDateTime(new Date(), 2),
                repayment_cycle: '1',
                remind_days: '3',
                remind_time: '09:15',
                remark: ''
            }

            try {
                var str = com.getItem("AddLine");
                if (str != null && str.length > 0)
                    $scope.Line = JSON.parse(str);
            }
            catch (e) {
                console.log(e);
                com.removeItem("AddLine");
            }

            document.getElementById('repaymentDate').value = $scope.Line.repayment_date;
            document.getElementById('remindTime').value = $scope.Line.remind_time;
        }
        else {
            if (createNext == 1)
                $scope.title = '生成下期贷款';
            else
                $scope.title = '编辑贷款';

            var fnLine = function (data) {
                if (data && data.code == 0) {
                    $scope.Line =
                    {
                        auto_id: data.Line.auto_id,
                        last_line_id: data.Line.last_line_id,
                        plat_id: data.Line.plat_id,
                        loan_name: data.Line.loan_name,
                        attach_label: data.Line.attach_label,
                        loan_amount: data.Line.loan_amount,
                        local_amount: data.Line.local_amount,
                        repayment_date: data.Line.repayment_date,
                        repayment_cycle: data.Line.repayment_cycle,
                        remind_days: data.Line.remind_days,
                        remind_time: data.Line.remind_time,
                        remark: data.Line.remark
                    }

                    if (data.Line.plat_id > 0) {
                        $rootScope.selectedPlat =
                        {
                            plat_id: data.Line.plat_id,
                            loan_name: data.Line.loan_name
                        }
                    }


                    if (createNext == 1) {
                        $scope.Line.auto_id = 0;
                        $scope.Line.last_auto_id = data.Line.auto_id;
                        $scope.Line.last_line_id = data.Line.last_line_id;
                        var tmp = com.addMonth(data.Line.repayment_date, data.Line.repayment_cycle);
                        $scope.Line.repayment_date = tmp;
                    }

                    document.getElementById('repaymentDate').value = $scope.Line.repayment_date;
                    document.getElementById('remindTime').value = $scope.Line.remind_time;
                }
            }
            bll.getLoanLine(lineId, fnLine, $http);
        }


        $scope.onSel = function () {

            var params =
			{
			    "plat_id": 0
			};
            $state.go('tabs.line-sel', params);
            return;
        }


        $scope.onSafe = function () {

            $scope.Line.repayment_date = document.getElementById('repaymentDate').value;
            $scope.Line.remind_time = document.getElementById('remindTime').value;
            if ($scope.Line.plat_id > 0) {
                var item = $rootScope.getItem($scope.Line.plat_id);

                if (item == null)
                    $scope.Line.plat_id = 0;
                else
                    if (item.plat_name != $scope.Line.loan_name)
                        $scope.Line.plat_id = 0;

            }
            console.log($scope.Line);
            if ($scope.Line.loan_name.length == 0) {
                com.alert('请输入贷款名称', function () { }); return;
            }

            if ($scope.Line.loan_amount - 0==0) {
                com.alert('请输入贷款金额', function () { }); return;
            }

            if ($scope.Line.local_amount - 0==0) {
                com.alert('请输入还款金额', function () { }); return;
            }


            var fn = function (data) {
                $rootScope.hideLoading();
                if (data && data.code == 0) {
                    com.removeItem("AddLine");
                    $rootScope.reloadLine = true;
                    if (lineId > 0) {
                        $rootScope.reloadLineDetail = true;
                        if (createNext == 1)
                            $ionicHistory.goBack(-2);
                        else
                            $ionicHistory.goBack();
                    }
                    else
                        $ionicHistory.goBack();
                }
                else
                    com.alert(data.msg);
            }
            $rootScope.showLoading();
            com.setItem("AddLine", JSON.stringify($scope.Line));
            bll.saveLoanLine($scope.Line, fn, $http);
        }
        $scope.myUpdate = function () {
            if ($rootScope.selectedPlat.plat_id > 0) {
                $scope.Line.loan_name = $rootScope.selectedPlat.loan_name;
                $scope.Line.plat_id = $rootScope.selectedPlat.plat_id;
            }
        }
        $scope.$on('$stateChangeSuccess', $scope.myUpdate);



    });

    app.controller('LineDetailCtrl', function ($scope, $rootScope, $http, $state, $stateParams, $ionicPopup, $ionicActionSheet, $ionicHistory) {
        console.log('LineDetailCtrl');
        var lineId = $stateParams.line_id;
        $scope.repayedRecords = [];
        $scope.newRepayed = function () {
            // 自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '<input type="number" ng-model="Line.input_amount">',
                title: '输入本次还款金额',
                subTitle: '大于应还金额时自动设为已还',
                scope: $scope,
                buttons: [
                                       { text: '取消' },
                                       {
                                           text: '<b>保存</b>',
                                           type: 'button-positive',
                                           onTap: function (e) {
                                               var item =
                                               {
                                                   line_id: lineId,
                                                   type: 2,
                                                   amount: $scope.Line.input_amount
                                               };
                                               var fn = function (data) {
                                                   $rootScope.hideLoading();
                                                   if (data && data.code == 0) {
                                                       $rootScope.reloadLine = true;
                                                       $rootScope.reloadLineDetail = true;
                                                   }
                                                   else {
                                                       com.alert(data.msg);
                                                       e.preventDefault();
                                                   }
                                               }
                                               $rootScope.showLoading();
                                               bll.setLoanLine(item, fn, $http);


                                           }
                                       },
                                     ]
            });

        }

        $scope.del = function (x) {
            var item =
                {
                    line_id: lineId,
                    type: 3,
                    id: x.id
                };
            var fn = function (data) {
                $rootScope.hideLoading();
                if (data && data.code == 0) {
                    $rootScope.reloadLine = true;
                    $rootScope.reloadLineDetail = true;
                }
                else {
                    com.alert(data.msg);
                    e.preventDefault();
                }
            }
            $rootScope.showLoading();
            bll.setLoanLine(item, fn, $http);

        }

        $scope.edit = function () {

            var x = $scope.Line;
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '编辑'
                }, {
                    text: '生成下一期'
                }, {
                    text: x.state == 1 ? '取消隐藏' : '隐藏'
                }, {
                    text: '删除'
                }, {
                    text: '申请贷款'
                }
                ],
                titleText: '选项',
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    switch (index) {
                        //                        case 0://设置还款        
                        //                            var fnSetLine = function (data) {        
                        //                                if (data && data.code == 0) {        

                        //                                    reload();        
                        //                                }        
                        //                            }        
                        //                            var params =        
                        //                            {        
                        //                                line_id: x.auto_id,        
                        //                                repayed: x.repayed == 0 ? 1 : 0        
                        //                            }        
                        //                            bll.setLoanLine(params, fnSetLine, $http);        
                        //                            break;        
                        case 0: //编辑
                            var params =
			                {
			                    "line_id": x.auto_id
			                };
                            $state.go('tabs.line-add', params);
                            break;
                        case 1: //生成下一期
                            if (x.repayment_cycle == 0) {
                                com.alert('该贷款只有一期,不能生成下一期');
                                return;
                            }
                            if (x.leave_days >= 0) {
                                com.alert('还未到生成下一期时间');
                                return;
                            }
                            var params =
			                {
			                    "line_id": x.auto_id,
			                    "create_next": 1
			                };
                            $state.go('tabs.line-add', params);
                            break;
                        case 2: //隐藏
                            var fn = function (res) {
                                if (res != 1) return;
                                var fnSetLine = function (data) {
                                    $rootScope.hideLoading();
                                    if (data && data.code == 0) {
                                        if (x.state == 1)
                                            $rootScope.showHide = 0;
                                        $rootScope.reloadLine = true;
                                        $ionicHistory.goBack();
                                    }
                                    else
                                        com.alert(data.msg);
                                }
                                var params =
                                {
                                    line_id: x.auto_id,
                                    type: 5
                                }
                                $rootScope.showLoading();
                                bll.setLoanLine(params, fnSetLine, $http);
                            }
                            if (x.state == 1)
                                com.confirm('取消隐藏之后,将恢复在首页的排序显示', fn, '取消隐藏', ['确定', '取消']);
                            else
                                com.confirm('隐藏之后,将不在首页显示', fn, '隐藏', ['确定', '取消']);
                            break;
                        case 3: //删除
                            var fn = function (res) {
                                if (res != 1) return;
                                var fnSetLine = function (data) {
                                    $rootScope.hideLoading();
                                    if (data && data.code == 0) {
                                        $rootScope.reloadLine = true;
                                        $ionicHistory.goBack();
                                    }
                                    else
                                        com.alert(data.msg);
                                }
                                var params =
                                {
                                    line_id: x.auto_id,
                                    type: 4
                                }
                                $rootScope.showLoading();
                                bll.setLoanLine(params, fnSetLine, $http);
                            }
                            com.confirm('删除是不可恢复的,确定要删除吗?', fn, '删除', ['确定', '取消']);
                            break;
                        case 4: //申请贷款
                            if ($scope.Line.ad_url.length > 0) {
                                com.open($scope.Line.ad_url);
                            }
                            break;
                        default:
                            break;
                    }
                    return true;
                }
            });
        }


        $rootScope.reloadLineDetail = true;
        $scope.reload = function () {

            if (!$rootScope.reloadLineDetail) return;
            $rootScope.reloadLineDetail = false;
            var fnLine = function (data) {
                $rootScope.hideLoading();
                if (data && data.code == 0) {
                    $scope.Line = data.Line;
                    $scope.Line.leave_amount = data.Line.local_amount - data.Line.repayed_amount;
                    $scope.Line.input_amount = data.Line.local_amount - data.Line.repayed_amount;
                    if ($scope.Line.repayment_record.length > 0) {
                        $scope.repayedRecords = JSON.parse($scope.Line.repayment_record).L;
                    }
                }
            }
            $rootScope.showLoading();
            bll.getLoanLine(lineId, fnLine, $http);
        }
        $scope.$watch('reloadLineDetail', $scope.reload);

    });

    app.controller('LineSelCtrl', function ($scope, $rootScope, $http, $state, $ionicModal, $stateParams, $ionicHistory, $ionicScrollDelegate) {
        console.log('LineSelCtrl');
        var platId = $stateParams.plat_id;
        $scope.showPlat = true;
        $scope.category = $rootScope.category;
        $scope.records = $rootScope.records;
        $scope.onPlat = function () {
            $scope.showPlat = true;
            $ionicScrollDelegate.$getByHandle('lineSelScroll').scrollTop();
        }
        $scope.onCard = function () {
            $scope.showPlat = false;
            $ionicScrollDelegate.$getByHandle('lineSelScroll').scrollTop();
        }
        $scope.onTapItem = function (x) {

            $rootScope.selectedPlat =
                        {
                            plat_id: x.auto_id,
                            loan_name: x.plat_name
                        }
                        console.log($rootScope.selectedPlat);
            $ionicHistory.goBack();
        }
    });

    app.controller('PlatCtrl', function ($scope, $rootScope, $http, $state, $ionicModal, $ionicViewSwitcher, $ionicScrollDelegate) {
        console.log('PlatCtrl');

        $scope.showPlat = true;
        $scope.onPlat = function () {
            $scope.showPlat = true;
            $ionicScrollDelegate.$getByHandle('platScroll').scrollTop();
        }
        $scope.onCard = function () {
            $scope.showPlat = false;
            $ionicScrollDelegate.$getByHandle('platScroll').scrollTop();
        }

        $scope.category = $rootScope.category;
        $scope.records = $rootScope.records;
        $scope.onTapItem = function (x) {

            bll.logView(101, x.auto_id, $http);
            if (x.apply_users == 0) {
                com.open(x.ad_url);
                return;
            }
            var params =
			{
			    "plat_id": x.auto_id
			};
            $state.go('tabs.detail-plat', params);
        }
    });

    app.controller('CardCtrl', function ($scope, $rootScope, $http, $state) {
        console.log('CardCtrl');
        $scope.records = $rootScope.records;
        $scope.onTapItem = function (x) {
            if(x.category=='在线办卡')
            {
                com.open(x.ad_url);
                return;
            }
            var params =
			{
			    "plat_id": x.auto_id
			};
            $state.go('tabs.detail-card', params);
        }
    });

    app.controller('SetCtrl', function ($scope, $rootScope, $http, $ionicModal, $state, $ionicViewSwitcher) {
        console.log('SetCtrl');
        if (bll.getUser() == null)
            $scope.mobile = '';
        else
            $scope.mobile = bll.getUser().mobile;

        $scope.headImg = 'img/nohead.jpg';

        $ionicModal.fromTemplateUrl('templates/password.modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.onTapNewPass = function (oldpw, newpw, checkpw) {
            if (oldpw.length < 6) {
                com.alert('请输入原始密码'); return;
            }
            if (newpw.length < 6) {
                com.alert('密码至少需要6位'); return;
            }
            if (newpw != checkpw) {
                com.alert('确认密码不一致'); return;
            }

            var fn = function (data) {
                com.alert(data.msg);
                if (data && data.code == 0) {
                    bll.logout();
                    $scope.modal.hide();
                }
            }
            bll.newPass(oldpw, newpw, fn, $http)
        }

        $scope.goMessage = function () {
            $state.go('tabs.message-detail');
        }


        $scope.onTapLogout = function () {
            var fn = function () {
                $rootScope.User = bll.getUser();
                $rootScope.reloadLine = true;
            }
            bll.logout(fn);
        }

        $scope.modifyPass = function () {
            if (!bll.isLogin()) {
                $rootScope.showLogin();
                return;
            }
            $scope.modal.show();
        }

        $scope.goAppStore = function () {
            window.open('itms-apps://itunes.apple.com/us/app/51贷款管家/id1211230723?l=zh&ls=1&mt=8');
        }
    });

    app.controller('DetailCtrl', function ($scope, $rootScope, $http, $stateParams, $ionicModal) {
        console.log('DetailCtrl');
        $scope.hideTabs = true;
        var platId = $stateParams.plat_id;
        $scope.Item = $rootScope.getItem(platId);
        $scope.title = $scope.Item.plat_name;

        $ionicModal.fromTemplateUrl('templates/leave.modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.leaveModal = modal;
        });

        $scope.showLeave = function () {
            if (!bll.isLogin()) {
                $rootScope.showLogin();
                return;
            }
            $scope.leaveModal.show();
        }

        $scope.applyLoan = function () {
            com.open($scope.Item.ad_url);
        }

        $scope.submitLeave = function (message) {

            if (typeof(message)=='undefined'||message.length < 5) {
                com.alert('至少输入5个字符', function () { }); return;
            }
            var fn = function (data) {
                $rootScope.hideLoading();
                com.alert(data.msg);
                if (data && data.code == 0) {
                    $scope.leaveModal.hide();
                }

            };
            $rootScope.showLoading();
            bll.saveLeave(platId, message, fn, $http);
        }

        $scope.Conditions = [];
        $scope.records = [];
        var loadData = function () {

            var fnPlat = function (data) {
                if (data && data.code == 0) {
                    $rootScope.hideLoading();
                    var conditions = data.LoanPlat.conditions;
                    $scope.Conditions = JSON.parse(conditions);
                }
            }
            $rootScope.showLoading();
            bll.getLoanPlat(platId, fnPlat, $http);


            var fnLeave = function (data) {
                if (data && data.code == 0) {

                    $scope.records = data.Records;
                }
            }
            bll.getLeaves(platId, fnLeave, $http);
        }
        loadData();
    });


    app.controller('MessageDetailCtrl', function ($scope, $rootScope, $http, $state, $ionicScrollDelegate, $ionicHistory) {
        console.log('MessageDetailCtrl');
        console.log($ionicHistory.viewHistory().backView.stateId);


        $scope.$on('$ionicView.beforeEnter', function () { $scope.backViewStateId = $ionicHistory.viewHistory().backView.stateId; });

        var lastAutoId = 0;
        $scope.title = '对话';
        $scope.messageDetils = [];
        var newMsgMap = [];
        $scope.doRefresh = function () {
            newMsgMap = [];
            var fn = function (data) {
                if (data && data.code == 0) {
                    $scope.messageDetils = data.Records;
                }
                $ionicScrollDelegate.$getByHandle('messageDetailsScroll').scrollBottom();
            }
            bll.getMessages(lastAutoId, fn, $http);

        }
        $scope.doRefresh();

        $scope.sendMessage = function (msg) {
            var obj =
            {
                "auto_id": new Date().getTime(),
                "content_type": 1,
                "user_id": bll.getUserId(),
                "time": '',
                "re_user_id": 0,
                "content": msg
            }
            newMsgMap[obj.auto_id] = $scope.messageDetils.push(obj) - 1;
            $scope.send_content = '';
            var fn = function (data) {
                //console.log(data);
                if (data && data.code == 0) {
                    var localId = data.UserTalk.local_id;
                    $scope.messageDetils.splice(newMsgMap[localId], 1, data.UserTalk);
                }

            }
            bll.sendMessage(obj, fn, $http);

            $ionicScrollDelegate.$getByHandle('messageDetailsScroll').scrollBottom();
        }

        if (ionic.Platform.isIOS()) {
            if (typeof (cordova) != 'undefined')
                cordova.plugins.Keyboard.disableScroll(true);
        }

    });

    app.directive('hideTabs', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                scope.$on('$ionicView.beforeEnter', function () {
                    scope.$watch(attributes.hideTabs, function (value) {
                        $rootScope.hideTabs = 'tabs-item-hide';
                    });
                });

                scope.$on('$ionicView.beforeLeave', function () {
                    scope.$watch(attributes.hideTabs, function (value) {
                        $rootScope.hideTabs = 'tabs-item-hide';
                    });
                    scope.$watch('$destroy', function () {
                        $rootScope.hideTabs = false;
                    })

                });
            }
        };
    }); 


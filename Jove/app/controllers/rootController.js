/// <reference path="../app.js" />
define(["app","jquery"], function (app,$) {
    //注册一个名称为testController的控制器
    //在 app/routes.js中需要注册路由信息
    app.controller("rootController", ['$scope', '$state', '$rootScope',  
    function ($scope, $state, $rootScope) {
        $scope.getViewUrl = function (url) {
            var s = $state;
            if (s.$current.data && s.$current.data.viewPath && url.substr(0,1)!=='/') {
                url = s.$current.data.viewPath + '/' + url;
            }
            return app.getViewUrl(url);
        };
        $scope.getImageUrl = function (url) {
            return (app.rootPath =='/' ? '' :app.rootPath)  + '/app/images/' + url;
        };
        $scope.getUrl = function (url) {
            return (app.rootPath == '/' ? '' : app.rootPath) + url;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //cfpLoadingBar.start();
            showWaitingWindow();
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //cfpLoadingBar.complete();
            hideWaitWindow();
            $rootScope.currentView = $state.current.name;
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            hideWaitWindow();
            //cfpLoadingBar.complete();
        });

        $rootScope.currentView = '';
        

        function getStateName(state) {
            var s = $state;
            if (state.substr(0, 1) == '.') {
                state = 'root' + state;
            } else if (s.$current && s.$current.parent) {
                state = s.$current.parent.name + '.' + state;
            }
            return state;
        };
        $scope.go = function (state, par) {
            var s = $state;
            state = getStateName(state);
            s.go(state, par);
        };
        $scope.getStateName = getStateName;



        $rootScope.settings = {
            layout: {
                pageAutoScrollOnLoad: true,
            },
            pageTitle: _pageTitle
        };
        window.setCookie = function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }

        window.getCookie = function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
        window.showWaitingWindow = function (opts) {
            var id;
            id = setTimeout(function () {
                try {
                    $.blockUI($.extend({ baseZ: 10000 }, opts));
                    //$(".sk-cube-grid").show();
                } catch (e) { }
            }, 500);
            return id;
        }

        window.hideWaitingWindow = function (id) {
            if (id) {
                clearTimeout(id);
            }
            try {
                $.unblockUI();
                $(".sk-cube-grid").hide();
            } catch (e) { }
        }
        //检查是否登录，如果未登录，应跳转到登录页面
        document.location.href = "#/index";
        //authService.check().then(function (r) {
        //    $rootScope.userInfo.UserName = r.ext.UserName;
        //    $rootScope.userInfo.LoginName = r.ext.LoginName;
        //    document.location.href = "#/index";
        //}, function () {
        //    document.location.href = "#/login";
        //});

    }]);
});
/// <reference path="../app.js" />
define(["app", "services/uploadService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.controller("loginController", ['$scope', '$rootScope', 'authService', function ($scope, $rootScope, authService) {

        $scope.loginModel = {
            userName: '',
            password:''
        };
        $scope.regModel = {
            userName: '',
            password: '',
            confirmPassword: '',
            nickName: '',
            station: '',
            column:''
        };

        $scope.login = function (valid) {
            if (!valid) {
                return;
            }
            authService.login($scope.loginModel.userName, $scope.loginModel.password)
            .then(function (r) {
                if (r.code == "0") {
                    document.location.href = "#/index";
                    $rootScope.userInfo.UserID = r.ext.userid;
                    $rootScope.userInfo.LoginCode = r.ext.usercode;
                    $rootScope.userInfo.UserToken = r.ext.usertoken;
                    $rootScope.userInfo.LoginSubSystem = r.ext.loginsubsystem;
                    $rootScope.userInfo.LogiInnfoId = r.ext.logininfoid;
                } else {
                    alert("无法登陆：" + r.msg);
                }
            }, function (r) {
                alert("无法登陆：" + r.msg);
            });
            
        };

       
    }]);
});
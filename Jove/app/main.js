/// <reference path="lib/js/require.js" />
//配置requirejs
requirejs.config({
    paths: {
        lib: './lib/js',
        controllers: './controllers',
        directives: './directives',
        services: './services',
        h5: './h5',
        'angular': './lib/js/angular.min',
        "angular-ui-route": "./lib/js/angular-ui-router.min",
        "ocLazyLoad": "./lib/js/ocLazyLoad.require",
        "jquery": "./lib/js/jquery-2.2.0.min"
    },
    shim: {
        "jquery": {
            exports: 'jquery'
        },
        'angular': {
            exports: 'angular'
        },
        "ocLazyLoad": {
            deps: ["angular"]
        },
        "angular-ui-route": {
            deps: ["angular"],
            exports: "angular-ui-route"
        }
    },
    //urlArgs: "v=1.0.0.0",
    urlArgs: function (moduleName, url) {
        var arr = url.split('\/');
        var key = arr[arr.length - 1];
        if (this.config.verConf[key]) {
            return this.config.verConf[key];
        }
        return '';
    },
    waitSeconds:0,
    //启动
    deps: ['./bootstrap']
});
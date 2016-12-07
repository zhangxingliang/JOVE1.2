define(function () {
    var routeMap = {
        'main': {
            view: 'jove.html' + version, //当修改模板文件后，需修改此版本号，以防止浏览器缓存
            controller: 'joveController',
            url: '^/index',
            isolateView: false, //是否采用独立的ui-view，为true将会为每一个子页面创建一个对应的ui-view
            services: ['cmService', 'dialogService'],
            directives: ["ngScrollbar"]
        }
        //TODO 添加更多控制器
    };

    return routeMap;
});
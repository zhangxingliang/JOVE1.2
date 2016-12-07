/// <reference path="lib/js/angular.js" />
/// <reference path="lib/js/require.js" />
/// <reference path="lib/js/ocLazyLoad.js" />

define('app', ["require", "jquery", "angular", "ocLazyLoad",
    "angular-ui-route", 
    "routes", "services/navService", "lib/ct-ui-router-extras.min"
], function (require, jquery, ng,  ocLazyLoad, uiRoute, routes) {
    var app = ng.module('app', ["oc.lazyLoad", "ui.router", "lmc-nav"]);
    app.rootPath = _siteRoot;
    app.getViewUrl = function (path) {
        return (app.rootPath == '/' ? '' : app.rootPath) + 'app/views/' + path;
    };
    app.apiUrl = _siteRoot;
    var arr, reg = new RegExp("(^| )language=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        _curLang = unescape(arr[2]);
    }
    else {
        //_curLang = "en";
    }
    $.ajaxSetup({
        async: false
    });
    $.get(_siteRoot + "lang.html", function (data, status) {
        if (status == "success") {
            _language = JSON.parse(data);
        }
        else {
            //使用默认的英文
            _language = {
                "content": "Content",
                "effect": "Effect",
                "pageTitle": "Web Quick Editing",
                "baseClass": "Base class must override the name method, return the plugin name.",
                "plugin": "Plugin: ",
                "repeat": " repeat",
                "trackBelongOthers": "There are other media on the track, please remove it first.",
                "trackNotExist": "The track does not exist.",
                "empty": "Empty",
                "buffering": "Buffering...",
                "errorOfNetwork": "Error: network error",
                "errorOfMedia": "Error: media format error, unable to decode",
                "errorOfResource": "Error: unable to access media resources",
                "error": "error",
                "projectInfo": "Project information",
                "name": "Name",
                "unnamed": "Unnamed",
                "frameRate": "Frame rate",
                "breadth": "Breadth",
                "video": "Video",
                "audio": "Audio",
                "subtitle": "Subtitle",
                "picture": "Picture",
                "trackBelongOtherLayer": "The track item has already belonged to a layer, please remove the binding first.",
                "adjustInOutPoint": "Adjust in/out point",
                "addItemL": "Add item[",
                "addItemR": "]",
                "insertItem": "Insert item",
                "adjustItemLoc": "Adjust item location",
                "moveItem": "Move item",
                "deleteItem": "Delete item",
                "wrongStart": "Wrong Start Time",
                "wrongEnd": "Wrong End Time",
                "startTimeGreater": "Start time is greater than the end time",
                "subclassMustType": "Subclasses must override the PopcornPlugin type",
                "subclassMustName": "Subclasses must override the name",
                "operation": "Operation",
                "colorUpdateError": "Color update error",
                "colorValueError": "Color value error",
                "theEditorL": "The Editor \"",
                "theEditorR": "\" does not exist.",
                "editorLayoutWrong": "The layout of editor is wrong",
                "MSYH": "Microsoft YaHei",
                "song": "SimSun",
                "startTimeError": "Start time error, has adjusted automatically",
                "endTimeError": "End time error, has adjusted automatically",
                "default": "Default",
                "second": "Second",
                "noMetadata": "With no metadata",
                "fade": "Fade-in/Fade-out",
                "flashBlack": "Flash Black",
                "flashWhite": "Flash White",
                "markPointM": "Mark Point(M)",
                "tip": "Tip",
                "markPointEmpty": "The Mark point remark can't be empty",
                "markPoint": "Mark Point",
                "property": "Property",
                "displayPropertyInfo": "Display the Property Information of active object",
                "modifyE": "Modify program information(E)",
                "newN": "New(N)",
                "timelineEmpty": "The timeline is not empty, do you want to save it first?",
                "clearTimeline": "Are you sure to clear out the timeline?",
                "saveS": "Save(S)",
                "revokeZ": "Revoke(Z)",
                "redoR": "Redo(R)",
                "addSubtitleT": "Add Subtitle(T)",
                "subtitleExisted": "The current area has already existed the subtitle, please add the caption in the blank area.",
                "tobegin": "To the beginning(Home)",
                "lastFrame": "Last frame(←)",
                "playOrPause": "Play/Pause(Space)",
                "nextFrame": "Next frame(→)",
                "toEnd": "To the end(End)",
                "inL": "In([)",
                "outR": "Out(])",
                "cut": "Cut(/)",
                "delete": "Delete(Delete)",
                "yes": "Yes",
                "no": "No",
                "confirm": "Confirm",
                "cancel": "Cancel",
                "inOrOutPoint": "In/Out point",
                "in": "In",
                "out": "Out",
                "markInGreater": "Mark In time is greater than Mark Out time.",
                "markoutLess": "Mark Out time is less than Mark In time.",
                "remarkEmpty": "The Mark point remark can't be empty.",
                "selectMarkPoint": "Please select the mark point!",
                "welcomeToUse": "Welcome to use the artDialog dialog components!",
                "welcome": "Welcome",
                "description": "Description",
                "buffer": "Buffering",
                "dragToChange": "Drag to change the current time.",
                "clickOrDblclick": "Click the lock / unlock, double click to lock the other tracks(Except the current track)",
                "createTime": "Create time",
                "markPointRemark": "Mark point remark:",
                "edit": "Edit",
                "programInfo": "Program Information",
                "textEditor": "Text editor",
                "basic": "Basic",
                "advanced": "Advanced",
                "warning": "Warning:",
                "pressEnter": "Press Enter to confirm",
                "mediaElement": "Media Element",
                "start": "Start",
                "end": "End",
                "active": "Active",
                "showOrHide": "Show / hide",
                "wrongTimeFormat": "Wrong time format",
                "create": "Create",
                "timelineEmptyNotSave": "The timeline is empty, can't be saved!",
                "success": "Success",
                "saveSuccess": "Save success!",
                "saveFailed": "Save failed!\n",
                "errorUp": "Error",
                "notSetSaveMethod": "Didn't set the save method, can't save the timeline.",
                "initializeFirst": "Please initialize first",
                "signatureTimeout": "Signature timeout, please regenerate a new signature.",
                "generateSignature": "Generate signature:",
                "preload": "Pre-load the next material...",
                "notSupportL": "Can't support the ",
                "notSupportR": " TrackEvent",
                "text": "Text",
                "customize": "Customize",
                "center": "Center",
                "bottom": "Bottom",
                "top": "Top",
                "textPosition": "Text position",
                "left": "Left",
                "right": "Right",
                "alignment": "Alignment",
                "finish": "Finish",
                "font": "Font",
                "fontSize": "Font Size",
                "fontColor": "Font Color",
                "shadow": "Shadow",
                "shadowColor": "Shadow Color",
                "background": "Background",
                "backgroundColor": "Background Color",
                "boldface": "Boldface",
                "italic": "Italic",
                "leftMargin": "Left Margin",
                "topMargin": "Top Margin",
                "width": "Width",
                "address": "Address",
                "height": "Height",
                "color": "Color",
                "sum": "Sum",
                "subtract": "Subtract",
                "multiply": "Multiply",
                "normal": "Normal",
                "renderMethod": "Render method",
                "transition": "Transition",
                "sendToRender": "Send to render",
                "ok": "OK",
                "startAt": "Start at",
                "target": "Target",
                "addSubtitle": "Double click to add subtitle.",
                "search": "search",
                "directory": "Directory",
                "title": "Title",
                "saveAsEdl": "Save As EDL",
                "saveAsClip": "Save As Clip",
                "clearOut": "Clear out(\\)",
                "confirmFlag": "Confirm",
                "share": "Share",
                "export": "Export to 3rd Party",
                "register": "Register to OA",
                "renderSuccess": "Send render success!",
                "saveTileLineSuccess": "Save timeline success!",
                "saveTileLineFailed": "Save timeline Failed!",
                "notGetStream": "Can not get clip stream info!",
                "notGetFormat": "Can not find format info!",
                "getClipInfoFailed": "Get clip info failed!",
                "loadTimelineFailed": "Load Timeline failed",
                "emptyFolderList": "Empty folder list!",
                "getFolderListFailed": "Get folder list failed!",
                "openFolderFailed": "Open folder failed!",
                "getClipListFailed": "Get clip list failed!",
                "emptyResult": "Empty result!",
                "logout": "Logout",
                "help": "Help",
                "sort": "Sort",
                "advancesearch": "Advance Search",
                "time": "Create Time",
                "type": "Type",
                "mv": "MV",
                "sv": "SV",
                "welcome": "Welcome "
            };
        }
    });
   // document.title = _language[_curLang].pageTitle;
    String.prototype.replaceAll = function (s1, s2) {
        return this.split(s1).join(s2);
        //replace(new RegExp(">" + s1 + "<", "gm"), ">" + s2 + "<")
    }
    app.config(['$ocLazyLoadProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($ocLazyLoadProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
        //覆盖了module默认的注册方法，以支持异步加载方式
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.service = $provide.service;
        app.factory = $provide.factory;
        app.provider = $provide.provider;

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            event: true,
            debug: true
        });

    }]);
    
    //  app.run(["navService", function(navService) {
    //    app.navService= navService;
    //    navService.app =app;
    //  }]);


    app.config(['$stateProvider', '$navProvider',
        function ($stateProvider, $navProvider) {
            app.$stateProvider = $stateProvider;

            $navProvider.setConfig({
                container: '.page-container'
            });
            $navProvider.setStateProvider($stateProvider);
            //根Controller，我们在此Controller中加入了一些辅助方法
            $stateProvider.state("root", {
                abstract: false,
                url: '',
                views: {
                    '': {
                        controller: 'rootController',
                        template: '<div ng-spinner-bar class="page-spinner-bar">\
        <div class="bounce1"></div>\
        <div class="bounce2"></div>\
        <div class="bounce3"></div>\
    </div>\
    <ui-view class="viewContainer full" />',
                        resolve: {
                            loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('controllers/rootController');
                            }]
                        }
                    }
                },

            });

            function getView(viewDef, viewPath, controllerPath, views, parentState, key) {
                views = views || {};
                if (viewDef.views) {
                    for (var k in viewDef.views) {
                        getView(viewDef.views[k], viewPath, controllerPath, views, parentState, k);
                    }
                } else {
                    var view = {};

                    view.templateUrl = app.getViewUrl(viewPath + '/' + viewDef.view);
                    view.controller = viewDef.controller;


                    var rs = [];
                    if (viewDef.controller) {
                        rs.push(controllerPath + '/' + viewDef.controller);
                    }
                    if (viewDef.css) {
                        if (ng.isArray(viewDef.css)) {
                            ng.forEach(viewDef.css, function (item) {
                                var cssPath = item;
                                if (cssPath.substr(0, 1) != '/') {
                                    cssPath = app.rootPath + 'app/css/' + cssPath;
                                } else {
                                    cssPath = app.rootPath + cssPath;
                                }
                                rs.push({ type: 'css', path: cssPath });
                            });
                        } else {
                            var cssPath = viewDef.css;
                            if (cssPath.substr(0, 1) != '/') {
                                cssPath = app.rootPath + 'app/css/' + cssPath;
                            } else {
                                cssPath = app.rootPath + cssPath;
                            }
                            rs.push({ type: 'css', path: cssPath });
                        }
                    }
                    if (viewDef.services) {
                        if (ng.isArray(viewDef.services)) {
                            ng.forEach(viewDef.services, function (item) {
                                rs.push('services/' + item);
                            });
                        } else {
                            rs.push('services/' + viewDef.services);
                        }
                    }
                    if (viewDef.directives) {
                        if (ng.isArray(viewDef.directives)) {
                            ng.forEach(viewDef.directives, function (item) {
                                rs.push('directives/' + item);
                            });
                        } else {
                            rs.push('directives/' + viewDef.directives);
                        }
                    }
                    if(viewDef.filters){
                        if (ng.isArray(viewDef.filters)) {
                            ng.forEach(viewDef.filters, function (item) {
                                rs.push('filters/' + item);
                            });
                        } else {
                            rs.push('filters/' + viewDef.filters);
                        }
                    }

                    view.resolve = {
                        // printScreen:['$nav',function($nav) {
                        //     return $nav.printScreen();
                        // }]
                    };


                    if (rs.length > 0) {
                        view.resolve.loadController = ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load(rs);
                        }];

                    }

                    var uiView = '';
                    if (parentState) {
                        uiView = "@" + parentState;

                    }

                    views[key || uiView] = view;
                }

                return views;
            }

            function createState(parentRoute, parentState, viewPath, parentView) {

                for (var v in parentRoute) {
                    var vp = viewPath;

                    if (v === 'views')
                        continue;
                    var view = parentRoute[v];
                    var state = {};
                    state.name = parentState.name + '.' + v;
                    var name = state.name;
                    var subState = null;
                    if (view.isLayout) {
                        state.abstract = true;
                        //只有是layout时才建立视图子文件夹
                        if (viewPath) {
                            vp = vp + '/' + v;
                        } else {
                            vp = v;
                        }

                        if (view.children && view.children.views) {
                            var subViews = getView(view.children, vp, 'controllers/' + vp);
                            subState = {};
                            subState.name = name + '.layout';
                            subState.abstract = true;
                            subState.views = subViews;
                            name = subState.name;

                        }

                    } else if (view.view) {
                        state.url = view.url;
                    }

                    var views = getView(view, vp, 'controllers/' + vp, undefined, parentView, (view.cache || parentState.data.isolateView) ? v : undefined);
                    state.css = view.css;
                    state.views = views;
                    state.data = {
                        viewPath: viewPath,
                        cache: view.cache,
                        name: v,
                        isolateView: view.isolateView,
                        stateName: state.name
                    };
                    if (subState) {
                        $stateProvider.state(subState);
                    }
                    if (view.cache) {
                        state.sticky = true;
                        state.dsr = true;
                    }

                    if (view.cache || view.showInTaskbar) {
                        var navItem = {
                            name: view.title,
                            view: state.name,
                            openInNewPage: view.openInNewPage,
                            showInTaskbar: view.showInTaskbar,
                            cache: view.cache,
                            mutiple: view.mutiple,
                            state: state,
                            autoHideInTaskbar: view.autoHideInTaskbar,
                            isolateView: view.isolateView,
                            showInWindow: view.showInWindow,
                            showActivebar:view.showActivebar,
                            showWndToolbar: view.showWndToolbar
                        };
                        $navProvider.addNavItem(navItem);
                    }

                    $stateProvider.state(state);
                    if (view.children) {
                        var p = undefined;
                        if (subState) {
                            p = state.name;
                        }
                        createState(view.children, state, vp, p);
                    }
                }
            }

            createState(routes, { name: 'root',data:{} }, '');


           // $stickyStateProvider.enableDebug(true);


        }]);

    return app;
});
/// <reference path="../app.js" />
define(["app", "lib/h5editor", "h5/saveplugin"], function (app, editor, savePlugin) {
    app.controller("joveController", ['$scope', '$document', '$element', 'cmService', '$timeout', '$rootScope', '$state', '$stateParams', 'dialogService', function ($scope, $document, $element, cmService, $timeout, $rootScope, $state, $stateParams, dialogService) {
        $scope.folderTree = [{
            fatherGuid: '0',
            guid: '86023a7e3f2646a2bbee8a9fec7e6bcb',
            name: 'MaterialList',
            realname: 'Public',
            parentcount: 0,
            nodes: [],
            path: _rootPath + '/MaterialList'
        }, {
            name: 'Search Result',
            parentcount: 0,
            nodes: [],
            guid: 1,
            cliplist:[],
            path: _rootPath + '/Search Result'
        }];
        $scope.folderTree2 = [];
        $scope.lastSelectedNode = new Object();
        $scope.lastSelectedNode2 = new Object();
        $scope.clipList = [];
        $scope.searchResult = [];
        $scope.searchKeyword = '';
        $scope.currentFolder = null;
        $scope.TimeFn = null;
        $scope.savePath = '';
        var parObj = null;
        $scope.clipShowWay = '';
        $scope.IsShowEffect = "";
        $scope.aactive = "active";
        $scope.bactive = "";
        $scope.mactive = "active";
        $scope.sactive = "";
        $scope.curPath = '';
        $scope.pathHistory = [];
        $scope.lang = {};
        $scope.languagePackege = {};
        $scope.userInfo = {};
        $scope.IsShowSV = false;
        $scope.IsShowSortMenu = false;
        $scope.typeFlag = { flag: true };
        $scope.overresize = {};
        $scope.sortKeyword = ['typeIndex', $scope.titleSort];
        $scope.treeSortKeyword = '';
        $scope.markerList = [];
        $scope.markerListForTL = [];
        $scope.markerType = {
            emarker: true,
            smarker: true,
            cmarker: true
        };
        $scope.previewGuid = '';
        //$scope.clipListSordedCache = null;
        //$scope.worker = new Worker('/app/lib/js/sortWorker.js');
        //$scope.worker.onmessage = function (e) {
        //    $scope.clipListSordedCache = e.data;
        //}
        $scope.markerWidth = getCookie('markerWidth') || 55;
        $scope.toolBarLeft = [0, 400, 545, 665];
        $scope.toolBarSeek = 0;
        $scope.toolBarWidth = window.innerWidth - getCookie('treeWidth') - getCookie('playerWidth');
        $scope.isShowArrowRight = $scope.toolBarSeek < Math.floor(750 / $scope.toolBarWidth);
        $scope.tempFolderList = [];
        if (!window.golbalSetting) {
            window.golbalSetting = {
                //"CMAPI" : "", //nginx
                "CMAPI": "http://hive.sobey.com:9023",

                //"CM": "/CM",//nginx
                "CM": "http://hive.sobey.com:9021",

                //"TMSERVICE" : "/TMSERVICE",//nginx
                "TMSERVICE": "http://hive.sobey.com:9047",

                //"FL" : "/FL",//nginx
                "FL": "http://hive.sobey.com:9033",

                //"JOVE" : "/JOVE", //nginx for link
                "JOVE": "http://hive.sobey.com:9027/",

                //"TMWEB" : "/TMWEB"//nginx   for link
                "TMWEB": "http://hive.sobey.com:9049/"

            };
        }
        if (window.golbalSetting.FAVSWITCH) {
            $scope.folderTree.push({
                name: _language[_curLang].fav,
                parentcount: 0,
                nodes: [],
                guid: -1,
                cliplist: [],
                path: _rootPath + '/Favorite'
            });
        }
        //20161116 wfg add for sv path,get it from golbalSetting
        _previewUrl = golbalSetting.CM + "/ModulePage/webpreview.html";

        cmService.Login().then(function (r) {
            if (r.Code == 0) {
                $scope.userInfo = r.Ext;
                var fulltext = document.createElement("script");
                fulltext.setAttribute("src", golbalSetting.CM + "/js/plugins/jquery.fulltextsearch.js" + version);
                document.querySelector('html').appendChild(fulltext);
                var userstorge = document.createElement("script");
                userstorge.setAttribute("src", golbalSetting.CM + "/js/module/UserSpace.js" + version);
                document.querySelector('html').appendChild(userstorge);
                fulltext.onload = fulltext.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        try {
                            $.fn.fullTextSearch.defaults.usertoken = _userToken;
                            $.fn.fullTextSearch.defaults.loginname = $scope.userInfo.nickName;;
                            $("#div_fullTextSearch").fullTextSearch({});
                            $.fn.fullTextSearch.defaults.callback = function (data) {
                                $scope.folderTree[1].cliplist = $scope.ParseSearchResult('fullsearch', data);
                                $scope.isShowMark = false;
                                $scope.showClips($scope.folderTree[1]);
                            };
                            fulltext.onload = fulltext.onreadystatechange = null;
                        }
                        catch (e) { }
                    }
                };
                userstorge.onload = userstorge.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        try {
                            $("#userStorage").userSpace({ usertoken: _userToken, loginName: $scope.userInfo.loginName });//获取用户空间; d
                        }
                        catch (e) { }
                    }
                };
              
            }
            else {

            }
        }, function (r) {
        });
        if ($rootScope.currentPageParameter && $rootScope.currentPageParameter.paramater) {
            var obj = $rootScope.currentPageParameter.paramater.obj;
            parObj = obj;
        }

        $scope.editor = null;
        h5.onReady(function (H5Editor) {
            var opt = {
                elementId: 'editor',
                resize: true,
                topElementId: 'stage-wrapper',
                playerElementId: 'player',
                mlElementId: 'resourceList',
                initTracks: ['GC', 'PIC', 'VA', 'A'],
                useCanvas: true,
                useCros: true,
                logger: new TimelinePlayer.Logger("debug"),   //
                panelOptions: {
                    minWidth: 700,
                    initWidth: parseInt(getCookie('playerWidth')) || 450,
                    playerPanel: {
                        minWidth: 250
                    },
                    infoPanel: {
                        minWidth: 5,
                        initWidth: parseInt(getCookie('propertyWidth')) || 250
                    }
                }
            };
            $scope.editor = new H5Editor(opt);
            var tkContent = $('.taskmonitorifm')[0];
            tkContent.setAttribute('src', _tkUrl + "TaskMonitor.html?UserCode=" + _userCode);
            $scope.wd = new $scope.editor.Controls.H5Window({
                content: tkContent,
                title: _language[_curLang].taskmonitor
            });
            $scope.editor.timeLineId = '';
            $scope.editor.addEventListener("createnew", function () {
                $scope.editor.timeLineId = '';
            });
            window.editor = $scope.editor;
            /*renderPlugin.createPlugin($scope.editor, {
                service: cmService,
                scope: $scope
            });*/
            $scope.Dialog = $scope.editor.Controls.Dialog;
            /* saveAsPlugin.createPlugin($scope.editor, {
                 service: cmService,
                 scope: $scope,
                 alert: dialogService.showDialog
             });*/
            savePlugin.createPlugin($scope.editor, {
                service: cmService,
                scope: $scope,
                alert: dialogService.showDialog
            });

            /*sharePlugin.createPlugin($scope.editor, {
                service: cmService,
                scope: $scope
            });*/
            $scope.lang = _language[_curLang];
            if (!$scope.lang) {
                //默认
            }
            $scope.editor.create();
            $scope.editor.service.save = function (json, opt, callback) {
                if (!$scope.editor.media.isEmpty()) {
                    if (!document.querySelector(".windowModalDiv")) {
                        cmService.getFolderObjects({ path: _rootPath + '/MaterialList' }).then(function (r) {
                            if (r.length == 0) {
                                dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].emptyFolderList, 'warn', 'OK');
                            }
                            else {
                                $scope.folderTree2 = r;
                            }
                        }, function (r) {
                            dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].getFolderListFailed, 'warn', 'OK');
                        });
                        document.querySelector(".onlysave").click();
                        if (callback) {
                            callback(true);
                        }
                    }
                }
                else {
                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].timeLineIsEmpty, 'warn', 'OK');
                }
            };
            $scope.editor.service.getObjectInfo = function (data, callback) {
               /* if (data.audio && data.duration <= 0) {
                    dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].noLengthInfo, 'warn', 'OK');
                    //alert("获取素材信息失败：" + r.Msg);
                    callback(false, null);
                }*/
                cmService.getObject.call(this, data.clipid, data.sourceid).then(function (r) {
                    if (r.Code == "0") {
                        if (!r.Ext.streammedia || !r.Ext.streammedia[0] || !r.Ext.entity.item.clipfile.length) {
                            dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].notGetStream, 'warn', 'OK');
                            //alert("素材信息异常，加载失败！");
                        }
                        else {
                            if (r.Ext.entity.type == "32" && r.Ext.entity.subtype == "32") {
                                // callback(true, { source: _resourceUrl + (r.Ext.streammedia[0].filepath).replace(":", "").split("\\").join("/"), duration: 10 });
                                callback(true, { source: r.Ext.streammedia[0].filepath, duration: 10 });
                            }
                            else {
                                /*cmService.hasFormatInfo(data).then(function (res) {
                                    if (res.Code == "0") */
                                if (data.in != undefined) {
                                    // callback(true, { source: _resourceUrl + (r.Ext.streammedia[0].filepath).replace(":", "").split("\\").join("/"), duration: data.out - data.in });
                                    callback(true, { source: r.Ext.streammedia[0].filepath, duration: data.out - data.in });
                                }
                                else {
                                    //callback(true, { source: _resourceUrl + (r.Ext.streammedia[0].filepath).replace(":", "").split("\\").join("/"), duration: r.Ext.entity.item.length / 10000000 });
                                    callback(true, { source: r.Ext.streammedia[0].filepath, duration: r.Ext.entity.item.length / 10000000 });
                                }
                                /*else {
                                    dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].notGetFormat, 'warn', 'OK');
                                }*/
                                // });

                            }
                        }
                    } else {
                        dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].getClipInfoFailed, 'warn', 'OK');
                        //alert("获取素材信息失败：" + r.Msg);
                        callback(false, null);
                    }
                }, function (r) {
                    callback(false, null);
                });
            };
            $scope.editor.service.getobject = function (data, callback) {
                cmService.getDragedObject.call(this, data.clipid, "32").then(function (r) {
                    if (r.Code == "0" && r.Ext.Length) {
                        var framerate = 25.0;
                        if (r.Ext.VideoStandard ) {
                            framerate = ETGetVideoFrameRate(r.Ext.VideoStandard).nTimeRate;
                        }
                        angular.forEach(r.Ext.Markers, function (item, index) {
                            item.time = item.keyframe / framerate;
                            item.text = item.note;
                            item.name = item.note;
                            item.intime = item.keyframe / framerate;
                            item.outtime = item.endkeyframe / framerate;
                            item.duration = item.outtime - item.intime;
                            if (item.type == '4') {
                                item.color = 'rgb(208,208,208)';
                            }
                            else if(item.type == '8'){
                                item.color = 'rgb(244,112,104)';
                            }
                            else if (item.type == '65536') {
                                item.color = 'rgb(243,178,102)';
                            }
                            else if (item.type == '131072') {
                                item.color = 'rgb(239,239,97)';
                            }
                            else {
                                item.color = 'rgb(129,233,154)';
                            }
                        });
                        if (data.in != undefined) {
                            r.Ext.Length = (data.out - data.in) * 10000000;
                            r.Ext.TrimIn = data.in * 10000000;
                            r.Ext.TrimOut = data.out * 10000000;
                            callback(true, r.Ext);
                        }
                        else {
                            callback(true, r.Ext);
                        }
                        //$scope.getMarkerList(data.clipid, r.Ext.TrimIn / 10000000, r.Ext.TrimOut / 10000000);
                        
                        
                    } else {
                        callback(false, null);
                    }
                }, function (r) {
                    callback(false, null);
                });
            };
            $scope.gotoFolder = function (f) {
                $scope.dblClick(f);
            }

            $scope.dblClick = function (obj) {
                if (obj.type == "folder") {
                    //$scope.showClips(obj);
                    var pathList = obj.folderpath.split('/');
                    pathList.push(obj.name);
                    pathList.shift();
                    $scope.positionToNode(pathList, $scope.folderTree);
                }
                else if (obj.type == "h5pgm" || obj.type == "sequence") {
                    cmService.getTimeline(obj.guid).then(function (r) {
                        if (r.Code == "0") {
                            var json = JSON.parse(r.Ext.entity.item.projectdata);
                            if (json) {
                                $scope.editor.media.pause();
                                $scope.editor.load(json);
                                document.querySelector("#mvTimeLineTitle").innerText = json.name;
                                $scope.editor.timeLineId = r.Ext.entity.guid;
                                $scope.editor.edlPath = r.Ext.entity.folderpath;
                                $scope.editor.media.currentTime = 0;
                                $scope.editor.editor.openTrackEventProperty($scope.editor.media)
                            }
                            else {
                                dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK');
                                //alert("时间线解析失败");
                            }
                        }
                        else {
                            dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].getClipInfoFailed, 'warn', 'OK');
                            //alert("获取素材信息失败：" + r.Msg);
                        }
                    }, function (r) {
                        dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK');
                        //alert("打开时间线失败");
                    });
                }
                else if (obj.type == 'marker') {
                   
                }
                else {
                    $scope.showSV();
                    document.querySelector("#previewifm").setAttribute('src', _previewUrl + '?type=32&ep=JOVE&id=' + obj.guid + '&uk=' + _userToken);
                    $scope.previewGuid = obj.guid;
                    $scope.getMarkerList(obj.guid);
                }
            }
            document.querySelector("#previewifm").setAttribute('src', _previewUrl + '?type=32&ep=JOVE&uk=' + _userToken);
            if (parObj) {
                var clip = {};
                var obj = parObj;
                if (obj.IconFileName) {
                    clip.icon = obj.IconFileName;
                }
                clip.name = obj.ObjectName;
                clip.clipid = obj.ObjectGUID;
                clip.clipid2 = obj.ObjectID;
                clip.type = cmService.getObjectType(obj);
                clip.duration = obj.TrimOut / 25;
                clip.from = 0;
                obj.__clipType = clip.type;

                clip.detail = obj;

                if (clip.type == "h5pgm") {
                    $scope.dblClick(obj);
                } else if (obj.Files && obj.Files.length > 0) {
                    var f = obj.Files[0];

                    clip.title = clip.name;
                    clip.channel = 2;
                    clip.source = f.FilePath;
                    clip.sourceid = f.ClipID + '@' + f.QualityType + '@' + f.ClipClass + '@' + f.ClipIn;
                    $scope.editor.addTrackEvent(clip.type, clip);
                }
            }



            function updateClipInfo(clipList) {
                angular.forEach(clipList, function (item) {
                });
            }


            /*cmService.getFolderObjects({ path: _rootPath }).then(function (r) {
                if (r.length == 0) {
                    dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].emptyFolderList, 'warn', 'OK');
                }
                else {
                    $scope.ws.Send({ FolderGuid: '86023a7e3f2646a2bbee8a9fec7e6bcb', FatherFolderGuid: 0, isOpen: true });
                    $scope.folderTree = r;
                    $timeout(function () {
                        $scope.editor.initDrag();
                    }, 0);
                }
            }, function (r) {
                dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].getFolderListFailed, 'warn', 'OK');
                //alert("获取素材列表失败");
            });*/
            $scope.openFolder($scope.folderTree[0]);
        });
        $scope.SelectItem = function (guid) {
            angular.forEach($scope.clipList, function (item) {
                if (item.guid ==  guid ) {
                    item.selected = "itemSelected"
                }
            });
        }
        $scope.positionToNode = function (list, foldertree, guid) {
            if (list.length < 1) { return; }
            if (guid) {
                angular.forEach(foldertree, function (item) {
                    if (item.name == list[0]) {
                        if (list.length == 1) {
                            $scope.showClips(item, true, function () { $scope.SelectItem(guid) });
                            return;
                        }
                        else {
                            list.shift();
                            if (item.nodes.length < 1) {
                                $scope.openFolder(item, function () { $scope.positionToNode(list, item.nodes, guid) });
                            }
                            else {
                                $scope.positionToNode(list, item.nodes, guid);
                            }
                            return;
                        }
                    }

                });
            }
            else {
                angular.forEach(foldertree, function (item) {
                    if (item.name == list[0]) {
                        if (list.length == 1) {
                            $scope.showClips(item, true);
                            if (item.nodes.length < 1) {
                                $scope.openFolder(item);
                            }
                            return;
                        }
                        else {
                            list.shift();
                            if (item.nodes.length < 1) {
                                $scope.openFolder(item, function () { $scope.positionToNode(list, item.nodes, guid) });
                            }
                            else {
                                $scope.positionToNode(list, item.nodes);
                            }
                            return;
                        }
                    }

                });
            }
        }
        $scope.getMarkerList = function (guid, trimIn, trimOut) {
            cmService.getObject(guid, "32", true).then(function (r) {
                if (r.Code == "0") {
                    try {
                        var outmarkers = [];
                        var marklist = r.Ext.entity.item.markpoints;
                        var framerate = 25.0;
                        if (r.Ext.entity.item && r.Ext.entity.item.videostandard) {
                            var vs = ETGetVideoFrameRate(r.Ext.entity.item.videostandard);
                            framerate = vs.nTimeRate / vs.nTimeScale;
                        }
                        angular.forEach(marklist, function (item, index) {
                            if (item.color) {
                                var RedColor = (item.color & 0x0000ff);
                                var Gcolor = ((item.color & 0x00ff00) >> 8);
                                var Bcolor = ((item.color & 0xff0000) >> 16);
                                item.bgcolor = { background: 'rgb(' + RedColor + "," + Gcolor + "," + Bcolor + ')' };
                            }
                            else {

                            }                           
                            if (item.type == "4") {
                                item.typeName = "Scene Mark";
                                item.flag = 'smarker'
                                item.isSMarker = true;
                                item.inPoint = cmService.frameToTime(item.keyframe, framerate);
                                item.outPoint = cmService.frameToTime(item.endkeyframe, framerate);
                                item.name = '4';
                                item.color = 'rgb(100,100,100)';
                                item.time = item.keyframe / framerate;
                                item.guid = new Date().getTime() + index;
                                item.text = item.note;
                                item.intime = item.keyframe / framerate;
                                item.outtime = item.endkeyframe / framerate;
                                var outmarker = angular.copy(item);
                                outmarker.time = item.endkeyframe / framerate;
                                outmarker.guid = new Date().getTime() * 2;
                                outmarkers.push(outmarker);
                            }
                            else if (item.type == "8") {
                                item.typeName = "Esscene Mark";
                                item.flag = 'emarker'
                                item.pos = cmService.frameToTime(item.keyframe, framerate);
                                item.name = '5';
                                item.color = 'rgb(150,150,100)';
                                item.time = item.keyframe / framerate;
                                item.guid = new Date().getTime() + index;
                                item.text = item.note;
                            }
                            else if (item.type == "65536") {
                                item.typeName = "Logging Mark";
                                item.flag = 'lmarker'
                                item.pos = cmService.frameToTime(item.keyframe, framerate);
                                item.name = '6';
                                item.color = 'rgb(150,100,150)';
                                item.time = item.keyframe / framerate;;
                                item.guid = new Date().getTime() + index;
                                item.text = item.note;
                            }
                            else if (item.type == "131072") {
                                item.typeName = "Change Mark";
                                item.flag = 'cmarker'
                                item.pos = cmService.frameToTime(item.keyframe, framerate);
                                item.name = '7';
                                item.color = 'rgb(250,150,200)';
                                item.time = item.keyframe / framerate;;
                                item.guid = new Date().getTime() + index;
                                item.text = item.note;
                            }
                            item.iconfilename = cmService.getIconFilename(item.iconfilename)
                        });
                        if (trimIn != undefined) {
                            var timeLineMarkers = marklist.concat(outmarkers);
                            var inMarker = [];
                            var duration = 0;
                            var vTracks =  $scope.editor.media.tracks[2].trackEvents;
                            if (vTracks.length>1) {
                                duration = vTracks[vTracks.length - 2].popcornOptions.end;
                            }
                            angular.forEach(timeLineMarkers, function (item) {
                                if (item.time < trimIn || item.time > trimOut) {

                                }
                                else {
                                    item.time += duration - trimIn;
                                    if (item.intime != undefined) {
                                        item.intime += (duration - trimIn) < -item.intime ? -item.intime : duration - trimIn;
                                    }
                                    if (item.outtime != undefined) {
                                        item.outtime += duration - trimIn;
                                    }
                                    inMarker.push(item);
                                }
                            });
                            $scope.editor.markPointPlugin.addClipMarker(inMarker);
                        }
                        else {
                            $scope.markerList = marklist;
                        }
                    }
                    catch (e) { }
                }
            });
        }
        $scope.positionToFolder = function (obj) {
            cmService.getObject(obj.objectguid, '32').then(function (r) {
                if (r.Code == "0") {
                    var pathList = r.Ext.entity.folderpath.split('/');
                    pathList.shift();
                    $scope.positionToNode(pathList, $scope.folderTree, obj.objectguid);
                }
            });
        }
        $scope.updateFolder = function (tree, data) {
            angular.forEach(tree, function (item, index) {
                if (item.guid == data.guid) {
                    item.name = data.name;
                    item.path = data.folderPath + '/' + item.name;
                    if (item.nodes.length > 0) {
                        $scope.MergeChildNode(item.nodes, item.path);
                    }
                    $scope.SortFolerList(tree);
                    return;
                }
                if (item.nodes.length > 0) {
                    $scope.updateFolder(item.nodes, data)
                }
            });
        }
        $scope.deleteFolder = function (tree, data) {
            angular.forEach(tree, function (item, index) {
                if (item.guid == data.guid) {
                    tree.splice(index, 1);
                    return;
                }
                if (item.nodes.length > 0) {
                    $scope.deleteFolder(item.nodes, data)
                }
            });
        }
        $scope.createFolder = function (tree, data) {
            angular.forEach(tree, function (item, index) {
                if (item.guid == data.fguid) {
                    if (item.nodes.length > 0) {
                        var node = {};
                        node.name = data.name;
                        node.path = data.folderPath + '/' + node.name;
                        node.guid = data.guid;
                        node.fatherGuid = data.fguid;
                        node.nodes = [];
                        node.parentcount = item.parentcount + 1;
                        item.nodes.push(node);
                        $scope.SortFolerList(item.nodes);
                        return;
                    }
                    else {
                        $scope.openFolder(item, null, true);
                    }
                }
                if (item.nodes.length > 0) {
                    $scope.createFolder(item.nodes, data)
                }
            });
        }
        $scope.SortFolerList = function (node) {
            if (node) {
                $scope.DeepSort(node);
            }
            else {
                $scope.DeepSort($scope.folderTree);
            }
            $scope.tempFolderTree = angular.copy($scope.folderTree);
            
        }
        $scope.DeepSort = function (list) {
            list.sort(cmService.SortLikeWin);
            angular.forEach(list, function (item) {
                if (item.nodes.length > 0) {
                    $scope.DeepSort(item.nodes);
                }
            });
        }
        $scope.getIndex = function(list, i){
            var idx = -1;
            angular.forEach(list,function(item, index){
                if(item.guid == i.guid){
                    idx = index;
                    return idx;
                }
            });
            return idx;
        }
        $scope.getIndexOfTree = function (list, item) {
            var index = $scope.getIndex(list, item);
            if (index > -1) {
                return index;
            }
            else {
                angular.forEach(list, function (i) {
                    if (i.nodes.length > 0) {
                        index = $scope.getIndexOfTree(i.nodes, item);
                    }
                });
            }
            return index;
        }
        $scope.MergePah = function (arr) {
            for (var i = 1, l = arr.length; i < l; i++) {
                arr[i].path = arr[i - 1].path + "/" + arr[i].name;
            }
        }
        $scope.MergeChildNode = function (arr, path) {
            angular.forEach(arr,function(item, index){
                item.path = path + '/' + item.name;
                if (item.nodes.length > 0) {
                    $scope.MergeChildNode(item.nodes, item.path);
                }
            });
        }

        $scope.notifyCallback = function (data) {
            //处理文件夹更新
            var tarr = data.type.split('.');
            if (tarr[0] == 'TREE') {
                if (tarr[2] == 'UPDATE') {
                    $scope.$apply(function () {
                        $scope.updateFolder($scope.folderTree, data);                    
                    });
                }
                else if (tarr[2] == 'CREATE' || tarr[2] == 'RECOVERED') {
                    $scope.$apply(function () {
                        $scope.createFolder($scope.folderTree, data);
                    });
                }
                    //处理文件夹删除
                else if (tarr[2] == 'RECYCLED' || tarr[2] == 'MOVED') {
                    $scope.$apply(function () {
                        $scope.deleteFolder($scope.folderTree, data);
                        angular.forEach($scope.pathHistory, function (item, index) {
                            if (item.guid == data.guid) {
                                $scope.pathHistory.splice(index);
                                $scope.refresh(true);
                                return;
                            }
                        });
                    });
                }
                try {
                    angular.forEach($scope.pathHistory, function (item) {
                        if (item.guid == data.fguid) {
                            $scope.refresh(true);
                        }
                    });
                }
                catch (e) { }
            }
            else if (tarr[0] == 'RESOURCE') {
                //处理素材更新
                if (tarr[2] == 'CREATE' || tarr[2] == 'UPDATE' || tarr[2] == 'RECOVERED') {
                    $scope.refresh(true);
                    if($scope.previewGuid == data.guid){
                        $scope.getMarkerList(data.guid);
                    }
                }
                    //处理素材删除
                else if (tarr[2] == 'RECYCLED' || tarr[2] == 'MOVED') {
                    angular.forEach($scope.clipList, function (item, index) {
                        if (item.guid == data.guid) {
                            $scope.$apply(function () {
                                $scope.clipList.splice(index, 1);
                               // $scope.cacheClipList();
                                $scope.tempClipList = $scope.clipList.slice();
                                //$scope.tempClipList.sort(cmService.SortLikeWin);
                            });
                            return;
                        }
                    });
                }
            }
            else if (tarr[0] == 'KEYFRAME') {
                var clip = angular.forEach($scope.clipList, function (item) {
                    if (item.guid == data.guid) {
                        $scope.refresh(true);
                    }
                });
                if ($scope.previewGuid == data.guid) {
                  $scope.getMarkerList(data.guid);
                }
            }
        }

        $scope.ws = new NotifyPlugin(_socketServer.split(';'), $scope.notifyCallback).Init();
        $scope.getSearchModel = function () {
            var id = showWaitingWindow();
            $.ajax({
                type: "post",
                url: golbalSetting.CM + "/Handler/MaterialList.ashx",
                data: { OperationType: "GetSearchResult", usertoken: _userToken, loginname: $scope.userInfo.loginName },
                dataType: "json",
                async: true,
                complete: function () { hideWaitingWindow(id); },
                success: function (data) {
                    if (data.R) {
                        data = data.R;
                        angular.forEach(data, function (item) {
                            item.guid = 2;
                            item.nodes = [];
                            item.cliplist = [];
                            item.parentcount = 1;
                            item.path = "global_sobey_defaultclass/Search Result/" + item.name;
                        });
                        $scope.$apply(function () {
                            $scope.folderTree[1].nodes = data;
                        });
                    }
                }
            });
        }
        $scope.getSearchResult = function (node) {
            try{
                if (node.data) {
                    var model = JSON.parse(decodeURIComponent($.base64.decode(node.data)));
                    var id = showWaitingWindow();
                    $.ajax({
                        type: "post",
                        url: golbalSetting.CM + "/Handler/MaterialList.ashx",
                        data: model,
                        dataType: "json",
                        async: false,
                        complete: function () { hideWaitingWindow(id); },
                        success: function (data) {
                            if (data.R) {
                                var data = JSON.parse(data.R);
                                if (data.code == "0") {
                                    $scope.$apply(function () { node.cliplist = $scope.ParseSearchResult(model.searchType, data.ext); });
                                    $scope.switchSearcgBtnStatus(true);
                                }
                            }
                        }
                    });
                }
            }
            catch(e){}

        }
        $scope.openFolder = function (node, callback, ignore) {
            //$scope.switchSearcgBtnStatus(false);
            try {
                event.preventDefault();
                event.stopPropagation();
            }
            catch (e) { }
            if (node.nodes.length > 0) {
                node.nodes = [];
                $scope.ws.Send({ FolderGuid: node.guid, FolderPath:node.path, FatherFolderGuid: node.fatherGuid, isOpen: false });
            }
            else {
                if (node.guid == '1') {
                    $scope.getSearchModel();
                    //$scope.showClips(node);
                    return;
                }
                else if (node.guid == '2' || node.guid == "-1") {
                    $scope.showClips(node);
                    return;
                }
                var getTree = cmService.getFolderObjects(node, ignore);
                setTimeout(function () {
                    getTree.then(function (r) {
                        $scope.ws.Send({ FolderGuid: node.guid,FolderPath:node.path, FatherFolderGuid: node.fatherGuid, isOpen: true });
                        angular.forEach(r, function (item) {
                            item.createdate = item.createdate.match(/[0-9]/g).join('');
                        });
                        node.nodes = r;
                        $scope.SortFolerList(r);
                        if (callback) {
                            callback();
                        }
                        $timeout(function () {
                            $scope.editor.initDrag();
                        }, 0);
                    }, function (r) {
                        dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].openFolderFailed, 'warn', 'OK');
                        // alert("打开目录失败");
                    });
                }, 0);
            }
        };
        $scope.fixZero = function (v) {
            if (v < 10) {
                return '0' + v;
            }
            return v;
        }
        $scope.formatDate = function (date) {
            if (date) {
                var sec = date.match(/[0-9]/g).join('');
                var dt = new Date();
                dt.setTime(sec);
                return dt.getFullYear() + "-" + $scope.fixZero(dt.getMonth() + 1) + "-" + $scope.fixZero(dt.getDate()) + " " + $scope.fixZero(dt.getHours()) + ":" + $scope.fixZero(dt.getMinutes()) + ":" + $scope.fixZero(dt.getSeconds());
            }
        }
        $scope.cacheClipList = function () {
            $scope.clipListSordedCache = cmService.getClipListCache($scope.clipList);
        }
        $scope.showClips = function (node, flag, callback, ignore) {
            if ($scope.TimeFn != null) {
                clearTimeout($scope.TimeFn);
            }
            $scope.TimeFn = setTimeout(function () {
                if (node.guid) {
                    $scope.lastSelectedNode.isSelected = null;
                    $scope.lastSelectedNode = node;
                    node.isSelected = "selecting";
                    if (node.guid == '1') {
                        $scope.$apply(function () {
                            $scope.clipList = node.cliplist;
                            //$scope.cacheClipList();
                            $scope.switchSearcgBtnStatus(true);
                        });
                        if ($scope.clipList.length > 0 && $scope.clipList[0].flag) {
                            $scope.isShowMark = true;
                        }
                        else
                        {
                            $scope.isShowMark = false;
                        }
                        $scope.tempClipList = $scope.clipList.slice();
                        $scope.tempClipList.sort(cmService.SortLikeWin);
                        $scope.curPath = node.path.substring(_rootPath.length + 1);
                        var folderNameList = $scope.curPath.split('/');
                        $scope.pathHistory = [$scope.folderTree[1]];
                        $timeout(function () {
                            $scope.editor.initDrag();
                        }, 0);
                        return;
                    }
                    else if (node.guid == '2') {
                        if (node.cliplist.length < 1) {
                            $scope.getSearchResult(node);
                        }
                        $scope.clipList = node.cliplist;
                        if ($scope.clipList.length > 0 && $scope.clipList[0].flag) {
                            $scope.isShowMark = true;
                        }
                        else {
                            $scope.isShowMark = false;
                        }
                        $scope.tempClipList = $scope.clipList.slice();
                        $scope.tempClipList.sort(cmService.SortLikeWin);
                        $scope.curPath = node.path.substring(_rootPath.length + 1);
                        var folderNameList = $scope.curPath.split('/');
                        $scope.pathHistory = [$scope.folderTree[1],node];
                        $timeout(function () {
                            $scope.editor.initDrag();
                        }, 0);
                        return;
                    }
                    else if (node.guid == "-1") {
                        $scope.switchSearcgBtnStatus(false);
                        cmService.getFavoriteObject($scope.userInfo.userCode).then(function (r) {
                                $scope.clipList = $scope.ParseSearchResult("fav", r)
                                $scope.tempClipList = $scope.clipList.slice();
                                $scope.tempClipList.sort(cmService.SortLikeWin);
                                $scope.curPath = node.path.substring(_rootPath.length + 1);
                                var folderNameList = $scope.curPath.split('/');
                                $scope.pathHistory = [$scope.folderTree[2]];
                                $timeout(function () {
                                    $scope.editor.initDrag();
                                }, 0);
                        });
                        return;
                    }
                    else {
                        $scope.switchSearcgBtnStatus(false);
                    }
                }
                var tempTree = [];
                cmService.getClipList(node.path, ignore).then(function (r) {
                    $scope.isShowMark = false;
                    angular.forEach(r, function (item) {
                        item.formatDate = $scope.formatDate(item.createdate);
                        item.createdate = item.createdate.match(/[0-9]/g).join('');
                        item.type = cmService.getObjectType(item);
                        if (item.type == "audio") {
                            item.type = "video";
                            item.temptype = "audiobg";
                            item.isAudio = "true";
                            item.typeIndex = 2;
                            if (item.duration > 0) {
                                item.duration = item.duration / 10000000;
                            }
                            else {
                                item.duration = 0;
                            }
                        }
                        else {
                            item.temptype = item.type + "bg";
                            item.isAudio = "false";
                            if (item.type == 'folder') {
                                item.path = item.folderpath + '/' + item.name;
                                item.fatherGuid = node.guid;
                                item.parentcount = node.parentcount + 1;
                                tempTree.push(item);
                                item.typeIndex = 0;
                            }
                            else if (item.type == 'video') {
                                item.typeIndex = 1;
                                item.channel = '2';
                                if (item.duration > 0) {
                                    item.duration = item.duration / 10000000;
                                }
                                else {
                                    item.duration = 0;
                                }
                            }
                            else if (item.type == 'h5pgm') {
                                item.typeIndex = 3;
                            }
                            else if (item.type == 'image') {
                                item.typeIndex = 4;
                                item.duration = 10;
                            }
                            else if (item.type == 'txtfile') {
                                item.typeIndex = 5;
                            }
                            else if (item.type == 'word') {
                                item.typeIndex = 6;
                            }
                            else if (item.type == 'ppt') {
                                item.typeIndex = 7;
                            }
                            else if (item.type == 'excel') {
                                item.typeIndex = 8;
                            }
                            else if (item.type == 'pdf') {
                                item.typeIndex = 9;
                            }
                            else {
                                item.typeIndex = 10;
                            }
                        }
                        try {
                            if (item.type == 'video') {
                                if (item.hasItem) {
                                    if ((item.filestatus & FileStatus.ET_Obj_FS_HA_ALL) > 0 || (item.filestatus & FileStatus.ET_Obj_FS_HV_ALL) > 0) {//高质量
                                        item.HQ = true;
                                    }
                                    if ((item.filestatus & FileStatus.ET_Obj_FS_LV_ALL) > 0 || (item.filestatus & FileStatus.ET_Obj_FS_LA_ALL) > 0) {//低质量
                                        item.LQ = true;
                                    }
                                    if (item.typeIndex == 1) {
                                        if (item.capturestatus == 1 || item.capturestatus == 1 || item.capturestatus == 2 || item.capturestatus == 64 || item.capturestatus == 128 || item.capturestatus == 65536 || item.capturestatus == 8192) {//采集 0 为完成 1位正在采集
                                            item.cliping = true;
                                        }

                                        if (item.filestatus & FileStatus.ET_Obj_FS_WA) {//WA
                                            item.WA = true;
                                        }
                                        if (item.dbestreamchannel && item.dbestreamchannel != 0) {//Dolby
                                            item.DB = true;
                                        }
                                        if (item.videostandard && ETGetVideoStandardPI(item.videostandard) == 2) {//progress
                                            item.P = true;
                                            item.Ptitle = ETGetFrameRate(item.videostandard);
                                        }
                                        else if (item.videostandard && ETGetVideoStandardPI(item.videostandard) == 1) {//Interlace
                                            item.I = true;
                                            item.Ititle = ETGetFrameRate(item.videostandard)
                                        }
                                        if ((item.filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_HA_SEG | FileStatus.ET_Obj_FS_LA_SEG)) == 0) {
                                            item.channel = null;
                                        }
                                    }
                                }
                            }
                        }
                        catch (e) { }
                    });
                    $scope.clipList = r;
                    //$scope.cacheClipList();
                    $scope.tempClipList = $scope.clipList.slice();
                    $scope.tempClipList.sort(cmService.SortLikeWin);
                    if (callback) {
                        callback();
                    }
                    $scope.ws.Send({ ClipFolderGuid: node.guid, ClipFolderPath: node.path });
                    try {
                        $.fn.fullTextSearch.defaults.path = node.path.slice('global_sobey_defaultclass/MaterialList/'.length);
                        $.fn.advancedSearch.defaults.path = node.path.slice('global_sobey_defaultclass/MaterialList/'.length);
                    }
                    catch (e) { }
                    $scope.curPath = node.path.substring(_rootPath.length + 1);
                    var folderNameList = $scope.curPath.split('/');
                    if (flag) {
                        $scope.pathHistory = [];
                        $scope.GetPathHistory($scope.folderTree, folderNameList);
                    }
                    else {
                        $scope.tempFolderList = tempTree;
                        var index = $scope.pathHistory.indexOf(node);
                        if (index > -1) {
                            $scope.pathHistory.splice(index);
                        }
                        var name = folderNameList[folderNameList.length - 1];
                        if (node.guid == '86023a7e3f2646a2bbee8a9fec7e6bcb') {
                            node.realname = 'Public';
                        }
                        node.name = name;

                        $scope.pathHistory.push(node);
                    }

                    /*var folderNameList = $scope.curPath.split('/');
                    $scope.pathHistory = [];
                    for (var i = 0; i < folderNameList.length; i++) {
                        var p;
                        if (i == 0) {
                            p = _rootPath + '/' + folderNameList[i];
                        }
                        else {
                            p = $scope.pathHistory[i - 1].path + '/' + folderNameList[i];
                        }
                        $scope.pathHistory.push({
                            name: folderNameList[i],
                            path: p
                        });
                    }*/
                    $timeout(function () {
                        $scope.editor.initDrag();
                    }, 0);
                }, function (r) {
                    dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].getClipListFailed, 'warn', 'OK');
                    // alert("获取素材列表失败");
                });
            }, 300);
        }

        $scope.GetPathHistory = function (tree, folderNameList) {
            if (folderNameList == [] || tree == []) {
                return;
            }
            angular.forEach(tree, function (item, index) {
                if (item.name == folderNameList[0]) {
                    if (item.guid == '86023a7e3f2646a2bbee8a9fec7e6bcb') {
                        item.realname = 'Public';
                    }
                    item.name = item.name;
                    item.guid = item.guid;
                    item.path = item.path;
                    $scope.pathHistory.push(item);
                    folderNameList.shift();
                    $scope.GetPathHistory(item.nodes, folderNameList);
                }
            });
        }
        $scope.getStyle = function (node) {
            var bgcolor;
            if (node.parentcount == 0) {
                bgcolor = '#222';
            }
            else {
                bgcolor = '#292929';
            }
            return {
                position: 'relative',
                float: 'left',
                "margin-left": node.parentcount * 20 + 10 + 'px',
                "margin-right": '12px'
            }
        };

        $scope.getStyle2 = function (node) {
            if (node.parentcount < 2) {
                return 'angular-ui-tree-handle';
            }
            else {
                return 'angular-ui-tree-handle2';
            }
        };


        $scope.switch = function () {
            $scope.clipShowWay = '';
            document.querySelector(".treediv3").querySelector(".ngscroll-content-container").style["margin-top"] = "0px";
        };
        $scope.switchToList = function () {
            $scope.clipShowWay = 'list';
            document.querySelector(".treediv3").querySelector(".ngscroll-content-container").style["margin-top"] = "0px";

        };
        $scope.backUp = function () {
            $scope.pathHistory.length = Math.max($scope.pathHistory.length - 1, 1);
            $scope.refresh();
        };
        $scope.selectPath = function (node) {
            $scope.lastSelectedNode2.isSelected = null;
            $scope.lastSelectedNode2 = node;
            node.isSelected = "selecting";
            $scope.savePath = node.path.substring(_rootPath.length);
            document.querySelector(".path").value = $scope.savePath;
        };

        $scope.openFolder2 = function (node) {
            event.stopPropagation();
            if (node.nodes.length > 0) {
                node.nodes = [];
            }
            else {
                var getTree = cmService.getFolderObjects(node);
                setTimeout(function () {
                    getTree.then(function (r) {
                        node.nodes = r;
                        $scope.SortFolerList(r);
                    }, function (r) {
                        dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].openFolderFailed, 'warn', 'OK');
                    });
                }, 0);
            }
        };
        $scope.refresh = function (ignore) {
            if ($scope.pathHistory.length > 0) {
                $scope.showClips($scope.pathHistory[$scope.pathHistory.length - 1], null, null, ignore);
            }
            else {
                $scope.clipList = [];
            }
        };
        $scope.showContent = function () {
            $scope.IsShowEffect = "";
            $scope.bactive = "";
            $scope.aactive = "active";
        };
        $scope.showEffect = function () {
            $scope.IsShowEffect = "showeffect";
            $scope.bactive = "active";
            $scope.aactive = "";
        };
        $scope.showMV = function () {
            window.frames[0].postMessage({ ep: "JOVE", operation: "pause" }, '*');
            $scope.overresize = {};
            $scope.IsShowSV = '';
            _svFlag = false;
            $('#previewifm').blur();
            // document.querySelector('.toolbar-wrapper').style.display = 'block';
        };
        $scope.showSV = function () {
            $scope.editor.media.pause();
            $scope.overresize = { 'z-index': 1001 };
            $scope.IsShowSV = 'showSV';
            _svFlag = true;
            //  document.querySelector('.toolbar-wrapper').style.display = 'none';
        };
        $scope.getSrc = function (node) {
            if (node.isSelected) {
                return "../app/images/normal_folder1.png";
            }
            else {
                return "../app/images/normal_folder3.png";
            }
        };
        $scope.switchLanguge = function (l) {
            if (_curLang != l) {
                _curLang = l
                setCookie("language", l);
                location.reload();
            }
        };
        $scope.resizeTree = function ($event) {
            var beforeX = $event.clientX;
            document.onmousemove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var width;
                if (document.querySelector('#resourceList').clientWidth -e.clientX < 400) {
                    width = document.querySelector('#resourceList').clientWidth - 400;
                }
                else if (e.clientX > 400) {
                    width = 400;
                }
                else if (e.clientX < 50) {
                    width = 50;
                }
                else {
                    width = e.clientX;
                }
                setCookie('treeWidth', width);
                document.querySelector('.treediv1').style.width = width + 'px';
                window.onmouseup = function (e) {
                    document.onmousemove = null;
                    //document.onmouseup = null;
                }
            }
            console.log($event);
        }
        $scope.resizeMarkerList = function ($event) {
            var beforeX = $event.clientX;
            document.querySelector('.hoverifm').style.display = "block";
            document.onmousemove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var width;
                var leftWidth = document.querySelector('#resourceList').offsetWidth;
                
                var svWidth = document.querySelector('#resourceList').style.right.match(/\d+/)[0];
                if (e.clientX - leftWidth < 645) {
                    width = svWidth - 645;
                }
                else {
                    width = svWidth - e.clientX + leftWidth;
                }
                $scope.$apply(function () {
                    $scope.markerWidth = width;
                    setCookie('markerWidth', width);
                });
                window.onmouseup = function (e) {
                    document.querySelector('.hoverifm').style.display = "none";
                    document.onmousemove = null;
                    //document.onmouseup = null;
                }
            }
        }
        $scope.$on('$viewContentLoaded', function () {
            window.addEventListener("message", function (event) {
                if (event.data.isShortCutKey) {
                    switch (event.data.code) {
                        case 32: { window.frames[0].postMessage({ ep: "JOVE", operation: "Space" }, '*'); break; }
                        case 36: { window.frames[0].postMessage({ ep: "JOVE", operation: "Home" }, '*'); break; }
                        case 37: { window.frames[0].postMessage({ ep: "JOVE", operation: "LastFrame" }, '*'); break; }
                        case 39: { window.frames[0].postMessage({ ep: "JOVE", operation: "NextFrame" }, '*'); break;}
                        case 35: { window.frames[0].postMessage({ ep: "JOVE", operation: "End" }, '*'); break; }
                    }
                    return;
                }
                var data = JSON.parse(event.data);
                if (!(data.in != -1 && data.out != -1) || (parseInt(data.in) >= parseInt(data.out))) {
                    if (data.in == -1 && data.out == -1) {
                    }
                    else {
                        dialogService.showDialog($scope.Dialog, _language[_curLang].tip, _language[_curLang].canNotAdd, 'warn', 'OK');
                        return;
                    }
                }
                data.id = data.guid;
                data.clipid = data.guid;
                data.channel = "2";
                cmService.getObject.call(this, data.guid, "32").then(function (r) {
                    if (r.Code == "0") {
                        var framerate = 25.0;
                        data.title = r.Ext.entity.name;
                        data.isImage = false;
                        if (r.Ext.entity.iconfilename) {
                            data.icon = r.Ext.entity.iconfilename
                        }
                        data.sourceid = "32";
                        if (r.Ext.entity.subtype == 4) {
                            data.audio = true;
                        }
                        else {
                            data.audio = false;
                            if (r.Ext.entity.subtype == 32)
                            {
                                data.isImage = true;
                            }
                        }
                        data.createdate = $scope.formatDate(r.Ext.entity.createdate);
                        data.from = 0;
                        if (r.Ext.entity.item && r.Ext.entity.item.videostandard) {
                            var vs = ETGetVideoFrameRate(r.Ext.entity.item.videostandard);
                            framerate = vs.nTimeRate / vs.nTimeScale;
                            if (framerate == 29.97) {
                                framerate = 30;
                            }
                        }
                        if (r.Ext.entity.item && r.Ext.entity.item.filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_HA_SEG | FileStatus.ET_Obj_FS_LA_SEG) == 0) {
                            item.channel = null;
                        }


                        if (data.isImage) {
                            data.duration = 10;
                            $scope.editor.addTrackEvent('image', data);
                        }
                        else if (data.audio) {
                            data.channel = "1";
                            data.in = r.Ext.entity.item.trimin / 10000000;
                            data.out = r.Ext.entity.item.trimout / 10000000;
                            data.duration = data.out - data.in
                            data.from = data.in;
                            data.end = data.out;
                            $scope.editor.addTrackEvent('audio', data);
                        }
                        else
                        {
                            var a = data.in, b = data.out;
                                                  
                            data.in = r.Ext.entity.item.trimin / 10000000;
                            data.out = r.Ext.entity.item.trimout / 10000000;
                            data.from = a / framerate;
                            data.end = b / framerate;
                            if (a == -1) {
                                data.from = data.in;
                                data.end = data.out;
                            }
                            data.duration = data.out - data.in;
                            $scope.editor.addTrackEvent('video', data);
                        }
                    }
                });
            });
            window.addEventListener("keyup", function (event) {
                var keycode = event.keyCode;
                var targetTag = event.target.tagName.toUpperCase();
                if (keycode == 8 && targetTag != 'INPUT' && targetTag != 'TEXTAREA') {
                    $scope.backUp();
                }
            });
            //jquery插件  监听dom resize事件
            (function ($, h, c) { var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow"; e[b] = 250; e[f] = true; $.event.special[j] = { setup: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if (a.length === 1) { g() } }, teardown: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.not(l); l.removeData(d); if (!a.length) { clearTimeout(i) } }, add: function (l) { if (!e[f] && this[k]) { return false } var n; function m(s, o, p) { var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments) } if ($.isFunction(l)) { n = l; return m } else { n = l.handler; l.handler = m } } }; function g() { i = h[k](function () { a.each(function () { var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d); if (m !== o.w || l !== o.h) { n.trigger(j, [o.w = m, o.h = l]) } }); g() }, e[b]) } })(jQuery, this);
            $('#toolbarcontainer').resize(function (e) {
                $scope.toolBarWidth = e.target.clientWidth;
                $scope.$apply(function () {
                    if ($scope.toolBarWidth > 195 && $scope.toolBarSeek > 2) {
                        --$scope.toolBarSeek;
                    }
                    if ($scope.toolBarWidth > 310 && $scope.toolBarSeek > 1) {
                        --$scope.toolBarSeek;
                    }
                    if ($scope.toolBarWidth > 740 && $scope.toolBarSeek > 0) {
                        --$scope.toolBarSeek;
                    }
                    $scope.isShowArrowRight = $scope.toolBarSeek < Math.floor(750 / $scope.toolBarWidth);
                });
            });
            var ui = document.createElement("script");
            ui.setAttribute("src", "/app/lib/js/jquery-ui.js" + version);
            document.querySelector('head').appendChild(ui);
            document.querySelector('.treediv1').style.width = getCookie('treeWidth') + 'px';
            
            var fulltextcss = document.createElement("link");
            fulltextcss.setAttribute("href", golbalSetting.CM + "/styles/plugins/jquery.fulltextsearch.css" + version);
            fulltextcss.setAttribute("rel", "stylesheet");
            $('head').prepend(fulltextcss);

            var advancecss = document.createElement("link");
            advancecss.setAttribute("href", golbalSetting.CM + "/styles/plugins/jquery.advancedsearch.css" + version);
            advancecss.setAttribute("rel", "stylesheet");
            $('head').prepend(advancecss);

            var userspacecss = document.createElement("link");
            userspacecss.setAttribute("href", golbalSetting.CM + "/styles/ModulePage/userSpace.css" + version);
            userspacecss.setAttribute("rel", "stylesheet");
            $('head').prepend(userspacecss);

            var userdepcss = document.createElement("link");
            userdepcss.setAttribute("href", golbalSetting.CM + "/styles/getUserAndDep.css" + version);
            userdepcss.setAttribute("rel", "stylesheet");
            $('head').prepend(userdepcss);

            var base64 = document.createElement("script");
            base64.setAttribute("src", golbalSetting.CM + "/js/lib/jquery.base64.js" + version);
            document.querySelector('html').appendChild(base64);
            var advance = document.createElement("script");
            advance.setAttribute("src", golbalSetting.CM + "/js/plugins/jquery.advancedsearch.js" + version);
            document.querySelector('html').appendChild(advance);
            var treeview = document.createElement("script");
            treeview.setAttribute("src", golbalSetting.CM + "/js/lib/jquery.treeview.js" + version);
            document.querySelector('html').appendChild(treeview);
            var user = document.createElement("script");
            user.setAttribute("src", golbalSetting.CM + "/js/common/user.js" + version);
            document.querySelector('html').appendChild(user);
            var userdep = document.createElement("script");
            userdep.setAttribute("src", golbalSetting.CM + "/js/common/getUserAndDepartment.js" + version);
            document.querySelector('html').appendChild(userdep);
            var format = document.createElement("script");
            format.setAttribute("src", golbalSetting.CM + "/js/common/format.js" + version);
            document.querySelector('html').appendChild(format);
            document.querySelector(".hoverifm").addEventListener("drop", function (ev) {
                var data = JSON.parse(ev.dataTransfer.getData("Text"));

                document.querySelector("#previewifm").setAttribute('src', _previewUrl + '?type=32&ep=JOVE&id=' + data.data.clipid + '&uk=' + _userToken);
                $scope.previewGuid = data.data.clipid;
                $scope.getMarkerList(data.data.clipid);
            });
            document.querySelector(".hoverifm").addEventListener("dragenter", function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            document.querySelector(".hoverifm").addEventListener("dragover", function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dragEffect = 'copy';
            });
        });

        $scope.titleSort = function (item) {
            var index;
            try{
                index = $scope.tempClipList.indexOf(item);
            }
            catch (e) {
               // index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            return index;
        }
        $scope.treeTitleSort = function (item) {
            var index;
            try {
                index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            catch (e) {
                // index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            return index;
        }
        $scope.treeTitleSortReverse = function (item) {
            var index;
            try {
                index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            catch (e) {
                // index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            return index * -1;
        }
        $scope.titleSortReverse = function (item) {
            var index;
            try {
                index = $scope.tempClipList.indexOf(item);
            }
            catch (e) {
               // index = $scope.getIndexOfTree($scope.tempFolderTree, item);
            }
            return index * -1;
        }
        $scope.OrderBy = function (t) {
            if (t.flag != undefined) {
                t.flag = !t.flag;
                if (!t.flag) {
                    // $scope.sortKeyword = 'typeIndex';
                   // if ($scope.clipListSordedCache) {
                       // $scope.clipList = $scope.clipListSordedCache.titleUp;
                       // $scope.sortKeyword = 'typeIndex';
                  //  }
                  //  else {
                        $scope.sortKeyword = ['typeIndex', $scope.titleSort];
                  //  }
                }
                else {
                    //$scope.sortKeyword = '-typeIndex';
                    //if ($scope.clipListSordedCache) {
                      //  $scope.clipList = $scope.clipListSordedCache.titleDown;
                    //    $scope.sortKeyword = '-typeIndex';
                   // }
                   // else {
                        $scope.sortKeyword = ['-typeIndex', $scope.titleSortReverse];
                  //  }
                }
                // $scope.sortKeyword = t.keyword;
            }
            else {
                if (t == 'name') {
                   // if ($scope.clipListSordedCache) {
                      //  $scope.clipList = $scope.clipListSordedCache.titleUp;
                     //   $scope.sortKeyword = '';
                   // }
                   // else {
                    $scope.sortKeyword = ['orderType', $scope.titleSort];
                   // }
                    // $scope.sortKeyword = $scope.titleSort;
                    //$scope.treeSortKeyword = $scope.treeTitleSort;
                }
                else if (t == '-name') {
                   // if ($scope.clipListSordedCache) {
                       // $scope.clipList = $scope.clipListSordedCache.titleDown;
                      //  $scope.sortKeyword = '';
                   // }
                   // else {
                    $scope.sortKeyword = ['-orderType', $scope.titleSortReverse];
                   //}
                    //$scope.sortKeyword = $scope.titleSortReverse;
                    //$scope.treeSortKeyword = $scope.treeTitleSortReverse
                }
                else if (t == '-createdate') {
                   // if ($scope.clipListSordedCache) {
                     //   $scope.clipList = $scope.clipListSordedCache.timeUp;
                       // $scope.sortKeyword = '';
                   // }
                   // else {
                    $scope.sortKeyword = ['orderType', t];
                   // }
                    //$scope.sortKeyword = t;
                    //$scope.treeSortKeyword = t;
                }
                else if (t == 'createdate') {
                   // if ($scope.clipListSordedCache) {
                        //$scope.clipList = $scope.clipListSordedCache.timeDown;
                     //   $scope.sortKeyword = '';
                  //  }
                  //  else {
                    $scope.sortKeyword = ['-orderType', t];
                  //  }
                }
            }
            $scope.IsShowSortMenu = false;
            $timeout(function () {
                $scope.editor.initDrag();
            }, 0);
        }
        $scope.Logout = function () {
            open(location, '_self').close();
        }

        $scope.AdvanceSearch = function () {
            try {
                var template = "[{\"tabName\":\"Clip\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\name\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\note\"},{\"fieldName\":\"Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\creator\"},{\"fieldName\":\"Create Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\createdate\"},{\"fieldName\":\"Modified by\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\modifier\"},{\"fieldName\":\"Modified Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\modifydate\"},{\"fieldName\":\"Right\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Journalist\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\journallist\"},{\"fieldName\":\"Item Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Category\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\item\\\\category\"},{\"fieldName\":\"Program Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\item\\\\programname\"}]},{\"tabName\":\"Folder\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\name\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"}]},{\"tabName\":\"PGM\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Right\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"PGMCreator\"},{\"fieldName\":\"Create Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"}]},{\"tabName\":\"Marker\",\"type\":\"Mark\",\"field\":[{\"fieldName\":\"Comments\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Member\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Action\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"LMCreator\"}]}]";
                $.fn.advancedSearch.defaults.usertoken = _userToken;
                $.fn.advancedSearch.defaults.loginname = $scope.userInfo.nickName;
                $.fn.advancedSearch.defaults.template = template;
                $.fn.advancedSearch.defaults.callback = function (type, data) {
                    $scope.folderTree[1].cliplist = $scope.ParseSearchResult(type, data);
                    if (type == "marker") {
                        $scope.isShowMark = true;
                    }
                    else {
                        $scope.isShowMark = false;
                    }
                    $scope.showClips($scope.folderTree[1]);
                };
                $(this).advancedSearch();
            }
            catch (e) { }
        }
        $scope.ParseSearchResult = function (type, data) {
            var r = [];
            if (type == "marker") {
                var marklist = data;
                var framerate = 25.0;
                angular.forEach(marklist, function (item, index) {
                    if (item.color) {
                        var RedColor = (item.color & 0x0000ff);
                        var Gcolor = ((item.color & 0x00ff00) >> 8);
                        var Bcolor = ((item.color & 0xff0000) >> 16);
                        item.bgcolor = { background: 'rgb(' + RedColor + "," + Gcolor + "," + Bcolor + ')' };
                    }
                    else {

                    }
                    if (item.type == "4") {
                        item.typeName = "Scene Mark";
                        item.flag = 'smarker'
                        item.isSMarker = true;
                        item.inPoint = cmService.frameToTime(item.keyframe, framerate);
                        item.outPoint = cmService.frameToTime(item.endkeyframe, framerate);
                        item.name = '4';
                        item.color = 'rgb(100,100,100)';
                        item.time = item.keyframe / framerate;
                        item.guid = new Date().getTime() + index;
                        item.text = item.note;
                        item.intime = item.keyframe / framerate;
                        item.outtime = item.endkeyframe / framerate;
                    }
                    else if (item.type == "8") {
                        item.typeName = "Esscene Mark";
                        item.flag = 'emarker'
                        item.pos = cmService.frameToTime(item.keyframe, framerate);
                        item.name = '5';
                        item.color = 'rgb(150,150,100)';
                        item.time = item.keyframe / framerate;
                        item.guid = new Date().getTime() + index;
                        item.text = item.note;
                    }
                    else if (item.type == "65536") {
                        item.typeName = "Logging Mark";
                        item.flag = 'lmarker'
                        item.pos = cmService.frameToTime(item.keyframe, framerate);
                        item.name = '6';
                        item.color = 'rgb(150,100,150)';
                        item.time = item.keyframe / framerate;;
                        item.guid = new Date().getTime() + index;
                        item.text = item.note;
                    }
                    else if (item.type == "131072") {
                        item.typeName = "Change Mark";
                        item.flag = 'cmarker'
                        item.pos = cmService.frameToTime(item.keyframe, framerate);
                        item.name = '7';
                        item.color = 'rgb(250,150,200)';
                        item.time = item.keyframe / framerate;;
                        item.guid = new Date().getTime() + index;
                        item.text = item.note;
                    }
                    item.name = item.note;
                    item.iconfilename = cmService.getIconFilename(item.iconfilename) //_resourceUrl + (item.iconfilename).replace(":", "").split("\\").join("/");
                    r.push(item);
                });
            }
            else {
                angular.forEach(data, function (item) {
                    var node = {};
                    // item.createdate = item.createdate.match(/[0-9]/g).join('');
                    node.typetemp = item.entity.type;
                    node.type = cmService.getObjectType(item.entity);
                    if (node.type == "audio") {
                        node.type = "video";
                        node.temptype = "audiobg";
                        node.isAudio = "true";
                        node.typeIndex = 2;
                    }
                    else {
                        node.temptype = node.type + "bg";
                        node.isAudio = "false";
                        if (node.type == 'folder') {
                            node.typeIndex = 0;
                        }
                        else if (node.type == 'video') {
                            node.typeIndex = 1;
                            node.channel = '2';
                        }
                        else if (node.type == 'h5pgm') {
                            node.typeIndex = 3;
                        }
                        else if (node.type == 'image') {
                            node.typeIndex = 4;
                        }
                        else if (node.type == 'txtfile') {
                            node.typeIndex = 5;
                        }
                        else if (node.type == 'word') {
                            node.typeIndex = 6;
                        }
                        else if (node.type == 'ppt') {
                            node.typeIndex = 7;
                        }
                        else if (node.type == 'excel') {
                            node.typeIndex = 8;
                        }
                        else if (node.type == 'pdf') {
                            node.typeIndex = 9;
                        }
                        else {
                            node.typeIndex = 10;
                        }
                    }
                    node.folderpath = item.entity.folderpath;
                    node.guid = item.entity.guid;
                    node.id = item.entity.id;
                    node.name = item.entity.name;
                    node.iconfilename = item.entity.iconfilename;
                    node.formatDate = $scope.formatDate(item.entity.createdate);
                    node.createdate = new Date(node.formatDate).getTime();
                    node.duration = item.entity.length / 10000000;
                    node.subtype = item.entity.subtype;
                    try {
                        if (node.type == 'video') {
                            if (item.entity.item) {
                                node.hasItem = true;
                                node.filestatus = item.entity.item.filestatus;
                                node.capturestatus = item.entity.item.capturestatus;
                                node.videostandard = item.entity.item.videostandard;
                                node.dbestreamchannel = item.entity.item.dbestreamchannel;
                                if ((node.filestatus & FileStatus.ET_Obj_FS_HA_ALL) > 0 || (node.filestatus & FileStatus.ET_Obj_FS_HV_ALL) > 0) {//高质量
                                    node.HQ = true;
                                }
                                if ((node.filestatus & FileStatus.ET_Obj_FS_LV_ALL) > 0 || (node.filestatus & FileStatus.ET_Obj_FS_LA_ALL) > 0) {//低质量
                                    node.LQ = true;
                                }
                                if (node.typeIndex == 1) {
                                    if (node.capturestatus == 1 || node.capturestatus == 1 || node.capturestatus == 2 || node.capturestatus == 64 || node.capturestatus == 128 || node.capturestatus == 65536 || node.capturestatus == 8192) {//采集 0 为完成 1位正在采集
                                        node.cliping = true;
                                    }

                                    if (node.filestatus & FileStatus.ET_Obj_FS_WA) {//WA
                                        node.WA = true;
                                    }
                                    if (node.dbestreamchannel && node.dbestreamchannel != 0) {//Dolby
                                        node.DB = true;
                                    }
                                    if (node.videostandard && ETGetVideoStandardPI(node.videostandard) == 2) {//progress
                                        node.P = true;
                                        node.Ptitle = ETGetFrameRate(node.videostandard);
                                    }
                                    else if (node.videostandard && ETGetVideoStandardPI(node.videostandard) == 1) {//Interlace
                                        node.I = true;
                                        node.Ititle = ETGetFrameRate(node.videostandard);
                                    }
                                    if ((node.filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_HA_SEG | FileStatus.ET_Obj_FS_LA_SEG)) == 0) {
                                        node.channel = null;
                                    }
                                }
                            }
                        }
                    }
                    catch (e) { }
                    r.push(node);
                });
            }
            return r;
        }
        document.querySelector("#svItem").addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $scope.$apply($scope.showSV);
        });
        $scope.openMarker = function (marker) {
            window.frames[0].postMessage({ ep: "JOVE", operation: "openMarker", marker: marker }, '*');
        }
        $scope.switchMarkerStatus = function (key) {
            $scope.markerType[key] = !$scope.markerType[key];
        }
        $scope.markerFilter = function (item) {
            return $scope.markerType[item.flag];
        };
        $scope.leftMove = function () {
                switch ($scope.toolBarSeek) {
                    case 0: {
                        if ($scope.toolBarWidth < 750) {
                            ++$scope.toolBarSeek;
                        }
                        break;
                    }
                    case 1: {
                        if ($scope.toolBarWidth < 350) {
                            ++$scope.toolBarSeek;
                        }
                        break;
                    }
                    case 2: {
                        if ($scope.toolBarWidth < 205) {
                            ++$scope.toolBarSeek;
                        }
                        break;
                    }
                }
                $scope.isShowArrowRight = $scope.toolBarSeek < Math.floor(750 / $scope.toolBarWidth);
                $('#toolbarcontainer').animate({ left: (-$scope.toolBarLeft[$scope.toolBarSeek]) + 'px' });
        }
        $scope.rightMove = function () {
                if ($scope.toolBarSeek > 0) {
                    --$scope.toolBarSeek;
                }
                $scope.isShowArrowRight = $scope.toolBarSeek < Math.floor(750 / $scope.toolBarWidth);
                $('#toolbarcontainer').animate({ left: (-$scope.toolBarLeft[$scope.toolBarSeek]) + 'px' });
        }
        $scope.reverseSearch = function (obj) {
            cmService.getObject(obj.objectguid, '32').then(function (r) {
                if (r.Code == "0") {
                    var pathList = r.Ext.entity.folderpath.split('/');
                    pathList.shift();
                    $scope.positionToNode(pathList, $scope.folderTree, obj.objectguid);
                }
            });
        }
        $scope.showTaskMonitor = function () {
            $scope.wd.show();
        }
        $scope.switchSearcgBtnStatus = function (flag) {
            if (flag) {
                $(".advancesearch").attr("disabled", "disabled").css("background-color", "#3e3e3e").addClass("transparentHover");
                $("#fullSearch").attr("disabled", "disabled").css("background-color", "#3e3e3e");
                $("#div_fullTextSearch").css("background-color", "#3e3e3e");
                $("#searchBtn").attr("disabled", "disabled");;
                $("#filterBtn").hide();
            }
            else {
                $(".advancesearch").removeAttr("disabled").css("background-color", "#292929").removeClass("transparentHover");
                $("#fullSearch").removeAttr("disabled").css("background-color", "#292929");
                $("#div_fullTextSearch").css("background-color", "#292929");
                $("#searchBtn").removeAttr("disabled");
                $("#filterBtn").show();
            }
        }
      
    }]);
});
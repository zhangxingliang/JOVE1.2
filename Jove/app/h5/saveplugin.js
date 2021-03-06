﻿define("h5/saveplugin", ["jquery", "h5/template/saveWindow"], function ($, SAVE_CONTENT_LAYOUT) {

    var r = {};

    r.createPlugin = function (editor, mlapp) { 
        var EditorPluginBase = editor.Controls.EditorPluginBase;
        var H5ToolbarButton = editor.Controls.H5ToolbarButton;
        var H5Window = editor.Controls.H5Window;
        var Dialog = editor.Controls.Dialog;
        var json = '';
        function getUrl(url, par) {
            if (par) {
                var q = '';
                if (url.indexOf('?') >= 0) {
                    q = '&';
                } else {
                    q = '?';
                }

                for (var k in par) {
                    if (typeof par[k] === "undefined") {
                        continue;
                    }
                    if (q.length > 1) {
                        q += '&';
                    }
                    q = q + k + "=" + encodeURIComponent(par[k]);
                }

                url = url + q;
            }
            return url;
        }

        var plugin = EditorPluginBase.extend({
            init: function (app) {
                var _this = this,
                   _media = app.media,
                   _service = mlapp.service,
                   _hasCensorPopedom = false;
                 var $tree = $(".saveplugin", window.parent.document);
                 $tree.css("display", "block");
                 var $window = $(SAVE_CONTENT_LAYOUT);
                 $window.find(".treelist").append($tree);
                 var _contentElement = $window[0],
                    _btnOk = _contentElement.querySelector(".ok"),
                    _dirTitle = _contentElement.querySelector(".dir"),
                     _btnCancel = _contentElement.querySelector(".cancel"),
                     _inputTitle = _contentElement.querySelector(".title"),
                     _inputPath = _contentElement.querySelector(".path"),
                         _renderWindow;
                   
                var flag = true;
                var overseaflag = true;
                var _transCodeType = "";
                var guid = '';
                _btnCancel.addEventListener("click", function () {
                    _renderWindow.hide();
                });
                _btnOk.addEventListener("click", function () {
                    if (_inputPath.value == "") {
                        mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].selectPath, 'warn', 'OK');
                        return;
                    } else if (/[\*\?\/\\<>\|\:\"]/.test(_inputTitle.value)) {
                        mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].errorWord, 'warn', 'OK');
                        return;
                    }
                    if (flag) {
                        var url = _siteRoot + "cm/RenderPEF";
                        var par = { usertoken: _userToken, siteCode: _siteCode };
                       // window.parent.editor.media.update({ name: _inputTitle.value });
                        var objstr = JSON.stringify({
                            json: json,
                            title: _inputTitle.value.trim(),
                            folderPath: _rootPath + _inputPath.value
                        });
                        $.ajax({
                            type: "POST",
                            url: getUrl(url, par),
                            data: objstr,
                            async: false,
                            contentType: "application/json;",
                            dataType: "json",
                            success: function (r) {
                                if (r.Code == "0") {
                                    var url2 = _siteRoot + "cm/SendToRender";
                                    var par2 = { usertoken: _userToken, objecttype: '64', transCodeType: _transCodeType ,siteCode:_siteCode};
                                    var request = JSON.parse(objstr);
                                    request.pefFilePath = r.Ext.PEFFilePath;
                                    $.ajax({
                                        type: "POST",
                                        url: getUrl(url2, par2),
                                        data: JSON.stringify(request),
                                        async: false,
                                        contentType: "application/json;",
                                        dataType: "json",
                                        success: function (data, status) {
                                            if (data.Code == "0") {
                                                mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderSuccess, 'warn', 'OK');
                                            }
                                            else {
                                                mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderFailed, 'warn', 'OK');
                                            }
                                        }
                                    });
                                }
                                else {
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderFailed, 'warn', 'OK');
                                }
                            },
                            error: function (r) {
                                mlapp.alert(Dialog, _language[_curLang].tip,  _language[_curLang].renderFailed, 'warn', 'OK');
                            }
                        });
                    }
                    else {
                        var url = _siteRoot + "cm/SaveTimeLine";
                        var par = { usertoken: _userToken, contentid: guid, siteCode: _siteCode };
                        json.name = _inputTitle.value.trim();
                        var request = {
                            json: json,
                            folderPath:_rootPath + _inputPath.value,
                            title: _inputTitle.value.trim()
                        }
                        var objstr = JSON.stringify(request);
                        $.ajax({
                            type: "POST",
                            url: getUrl(url, par),
                            data: objstr,
                            async: false,
                            contentType: "application/json;",
                            dataType: "json",
                            success: function (r) {
                                if (r.Code == "0") {
                                    if (!window.parent.editor.isCreating) {
                                        if (r.Ext) {
                                            window.parent.editor.timeLineId = r.Ext.contentid;
                                            window.parent.editor.edlPath = _rootPath + _inputPath.value;
                                            document.querySelector("#mvTimeLineTitle").innerText = _inputTitle.value;
                                            window.parent.editor.media.update({ name: _inputTitle.value.trim() });
                                        }
                                    }
                                    else {
                                        window.parent.editor.isCreating = false;
                                    }
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineSuccess, 'warn', 'OK');
                                }
                                else {
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineFailed, 'warn', 'OK');
                                }
                            },
                            error: function (r) {
                                mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineFailed, 'warn', 'OK');
                            }
                        });
                    }
                    _renderWindow.hide();
                });
                _this._super(app);
                var split = _this.createToolbarButton("");
                split.appendChild(new H5ToolbarButton({ split: true }).element);

                var submitElement = _this.createToolbarButton("h5-tb-btn-submit-save");
                   
                //var $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li><li class="dropdown clip">&nbsp;&nbsp;' + _language[_curLang].saveAsClip + '</li> </ul></div>');
                var $select = null;
                if (_transCodeTemplate != null && _transCodeTemplate != "") {
                    overseaflag = false;
                    var saveas_Template = "";
                    var json = _transCodeTemplate.replace(/&quot;/g, "\"");
                    var xqo = eval('(' + json + ')');
                    var dropdownDisplay = (_curLang == "zh" ?  "保存为" : "Save As");
                    for (var i in xqo) {
                        saveas_Template += "<li class='dropdown clip' style=\"width:130px\" transCodeType =\"" + xqo[i].value + "\">&nbsp;&nbsp;" + dropdownDisplay + "&nbsp;" + xqo[i].name + "</li>";
                    }

                    $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave" style="width:130px">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl" style="width:130px">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li>' + saveas_Template + '</ul></div>');
                }
                else {
                    $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li><li class="dropdown clip">&nbsp;&nbsp;' + _language[_curLang].saveAsClip + '</li> </ul></div>');
                }

                $select.find("div").click(function () {
                    if (!editor.media.isEmpty()) {
                        if ($select.find("ul").css("display") == "none") {
                            $select.find("ul").css("display", "block");
                            mlapp.service.getFolderObjects({ path: _rootPath + '/MaterialList' }, true).then(function (r) {
                                if (r.length == 0) {
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].emptyFolderList, 'warn', 'OK');
                                }
                                else {
                                    mlapp.scope.folderTree2 = r;
                                    mlapp.scope.SortFolerList(r);
                                }
                            }, function (r) {
                                mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].getFolderListFailed, 'warn', 'OK');
                            });
                        }
                        else {
                            $select.find("ul").css("display", "none");
                        }
                    }
                    else
                    {
                        mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].timeLineIsEmpty, 'warn', 'OK');
                    }
                });
                _dirTitle.innerText = _language[_curLang].directory;
                $select.find("li.edl").click(function () {
                    flag = false;
                    guid = '';
                    json = window.parent.editor.media.json;
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: _language[_curLang].saveAsEdl
                    });
                    _renderWindow.show();
                    _inputTitle.value = window.parent.editor.media.json.name || '';
                });
                $select.find("li.clip").click(function () {
                    flag = true;
                    _transCodeType = $(this).attr("transCodeType");
                    guid = window.parent.editor.timeLineId;
                    json = window.parent.editor.media.json;
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: (overseaflag == true ? _language[_curLang].saveAsClip : $(this).text().trim())
                    });
                    _renderWindow.show();
                    _inputTitle.value = window.parent.editor.media.json.name || '';
                });
                $select.find("li.onlysave").click(function () {
                    flag = false;
                    guid = window.parent.editor.timeLineId;
                    json = window.parent.editor.media.json;
                    if (guid != "") {
                        var url = _siteRoot + "cm/SaveTimeLine";
                        var par = { usertoken: _userToken, contentid: guid, siteCode: _siteCode };
                        var objstr = JSON.stringify({
                            json: window.parent.editor.media.json,
                            title: window.parent.editor.media.json.name,
                            folderPath:window.parent.editor.edlPath
                        });
                        $.ajax({
                            type: "POST",
                            url: getUrl(url, par),
                            data: objstr,
                            async: false,
                            contentType: "application/json;",
                            dataType: "json",
                            success: function (r) {
                                if (r.Code == "0") {
                                    window.parent.editor.isCreating = false;
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].updateSuccessfully, 'warn', 'OK');
                                }
                                else {
                                    mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].updatefailed, 'warn', 'OK');
                                }
                            },
                            error: function (r) {
                                mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].updatefailed, 'warn', 'OK');
                            }
                        });
                    }
                    else {
                        _renderWindow = new H5Window({
                            content: _contentElement,
                            title: _language[_curLang].saveAsEdl
                        });
                        _renderWindow.show();
                        _inputTitle.value = window.parent.editor.media.json.name || '';
                    }
                });

                $select.mouseleave(function () {
                    $select.find("ul").css("display", "none");
                });
                //$("#h5-tb-btn-submit-save").append($select);
                submitElement.appendChild($select[0]);
            },
            name: function () {
                  return "save2";
        }

    });
    editor.editorPlugin.registerPlugin(plugin);

    };

    return r;

});
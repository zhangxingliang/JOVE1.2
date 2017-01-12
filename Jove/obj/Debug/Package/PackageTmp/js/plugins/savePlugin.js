const SAVE_CONTENT_LAYOUT = '<div class="mp-memo-content2">\
                <span style="left: 10px;width: 85px;text-align: left;top: 23px;color: #cfd2d4;">' + _language[_curLang].title + '</span>\
                <div class="input-text-wrapper" style="height: 30px;">\
                    <input type="text" class="mp-input title" onchange="if(this.value.length > 254){this.value = this.value.substring(0, 255);}" oninput="if(this.value.length > 254){this.value = this.value.substring(0, 255);}"/>\
                </div>\
                <div class="treelist"></div>\
                <div class="mp-foot">\
                    <button class="mp-btn cancel">' + _language[_curLang].cancel + '</button>\
                    <button class="mp-btn ok">' + _language[_curLang].confirm + '</button>\
                </div>\
            </div>'
const createPlugin = function(editor, store) {
    var EditorPluginBase = editor.Controls.EditorPluginBase;
    var H5ToolbarButton = editor.Controls.H5ToolbarButton;
    var H5Window = editor.Controls.H5Window;
    var Dialog = editor.Controls.Dialog;
    var json = '';

    var plugin = EditorPluginBase.extend({
        init: function(app) {
            var _this = this,
              _media = app.media,
              _hasCensorPopedom = false;
            var $tree = $(".save_plugin", window.parent.document);
            $tree.css("display", "block");
            var $window = $(SAVE_CONTENT_LAYOUT);
            $window.find(".treelist").append($tree);
            var _contentElement = $window[0],
              _btnOk = _contentElement.querySelector(".ok"),
              _dirTitle = _contentElement.querySelector(".dir_text"),
              _btnCancel = _contentElement.querySelector(".cancel"),
              _inputTitle = _contentElement.querySelector(".title"),
              _inputPath = _contentElement.querySelector(".path"),
              _renderWindow;

            var flag = true;
            var overseaflag = true;
            var _transCodeType = "";
            var guid = '';
            _btnCancel.addEventListener("click", function() {
                _renderWindow.hide();
            });
            _btnOk.addEventListener("click", function() {
                if (!store.state.saveFolder.path) {
                    util.alert(Dialog, _language[_curLang].tip, _language[_curLang].selectPath, 'warn', 'OK');
                    return;
                } else if (/[\*\?\/\\<>\|\:\"]/.test(_inputTitle.value)) {
                    util.alert(Dialog, _language[_curLang].tip, _language[_curLang].errorWord, 'warn', 'OK');
                    return;
                }
                if (flag) {
                    var url = _siteRoot + "cm/RenderPEF";
                    var par = {
                        usertoken: _userToken,
                        siteCode: _siteCode
                    };
                    // window.parent.editor.media.update({ name: _inputTitle.value });
                    var objstr = JSON.stringify({
                        json: json,
                        title: _inputTitle.value.trim(),
                        folderPath: store.state.saveFolder.path
                    });
                    $.ajax({
                        type: "POST",
                        url: util.getUrl(url, par),
                        data: objstr,
                        async: false,
                        contentType: "application/json;",
                        dataType: "json",
                        success: function(r) {
                            if (r.Code == "0") {
                                var url2 = _siteRoot + "cm/SendToRender";
                                var transcodeType = _transCodeType;
                                if(_preSNSPublishPath!=null && _preSNSPublishPath!=""){

                                    if(_preSNSPublishPath == store.state.saveFolder.path){
                                        transcodeType = _snsTransCodeType;
                                    }
                                }

                                var par2 = {
                                    usertoken: _userToken,
                                    objecttype: '64',
                                    transCodeType: transcodeType,
                                    siteCode: _siteCode
                                };
                                var request = JSON.parse(objstr);
                                request.pefFilePath = r.Ext.PEFFilePath;
                                $.ajax({
                                    type: "POST",
                                    url: util.getUrl(url2, par2),
                                    data: JSON.stringify(request),
                                    async: false,
                                    contentType: "application/json;",
                                    dataType: "json",
                                    success: function(data, status) {
                                        if (data.Code == "0") {
                                            util.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderSuccess, 'succeed', 'OK');
                                        } else {
                                            util.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderFailed, 'error', 'OK');
                                        }
                                    }
                                });
                            } else {
                                util.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderFailed, 'error', 'OK');
                            }
                        },
                        error: function(r) {
                            util.alert(Dialog, _language[_curLang].tip, _language[_curLang].renderFailed, 'error', 'OK');
                        }
                    });
                } else {
                    var url = _siteRoot + "cm/SaveTimeLine";
                    var par = {
                        usertoken: _userToken,
                        contentid: guid,
                        siteCode: _siteCode
                    };
                    json.name = _inputTitle.value.trim();
                    var request = {
                        json: json,
                        folderPath: store.state.saveFolder.path,
                        title: _inputTitle.value.trim()
                    }
                    var objstr = JSON.stringify(request);
                    $.ajax({
                        type: "POST",
                        url: util.getUrl(url, par),
                        data: objstr,
                        async: false,
                        contentType: "application/json;",
                        dataType: "json",
                        success: function(r) {
                            if (r.Code == "0") {
                                if (!window.parent.editor.isCreating) {
                                    if (r.Ext) {
                                        editor.timeLineId = r.Ext.contentid;
                                        editor.edlPath = _rootPath + _inputPath.value;
                                        $("#mvTimeLineTitle")[0].innerText = _inputTitle.value;
                                        editor.media.update({
                                            name: _inputTitle.value.trim()
                                        });
                                    }
                                } else {
                                    editor.isCreating = false;
                                }
                                util.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineSuccess, 'succeed', 'OK');
                            } else {
                                util.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineFailed, 'error', 'OK');
                            }
                        },
                        error: function(r) {
                            util.alert(Dialog, _language[_curLang].tip, _language[_curLang].saveTileLineFailed, 'error', 'OK');
                        }
                    });
                }
                _renderWindow.hide();
            });
            _this._super(app);
            var split = _this.createToolbarButton("");
            split.appendChild(new H5ToolbarButton({
                split: true
            }).element);

            var submitElement = _this.createToolbarButton("h5-tb-btn-submit-save");

            //var $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li><li class="dropdown clip">&nbsp;&nbsp;' + _language[_curLang].saveAsClip + '</li> </ul></div>');
            var $select = null;
            if (_transCodeTemplate != null && _transCodeTemplate != "") {
                overseaflag = false;
                var saveas_Template = "";
                var json = _transCodeTemplate.replace(/&quot;/g, "\"");
                var xqo = eval('(' + json + ')');
                var dropdownDisplay = (_curLang == "zh" ? "保存为" : "Save As");
                for (var i=0;i<xqo.length;i++) {
                    saveas_Template += "<li class='dropdown clip' style=\"width:130px\" transCodeType =\"" + xqo[i].value + "\">&nbsp;&nbsp;" + dropdownDisplay + "&nbsp;" + xqo[i].name + "</li>";
                }

                $select = $('<div class="toolbar-btn"><div class="divdiv toolbar-btn save" title="' + lang[_curLang].saveS + '"  style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave" style="width:130px">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl" style="width:130px">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li>' + saveas_Template + '</ul></div>');
            } else {
                $select = $('<div class="toolbar-btn"><div class="divdiv toolbar-btn save" title="' + lang[_curLang].saveS + '" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> <span class="caret"></span></div><ul style="display:none; color:#cfd2d4; background-color:#1b1b1b;" class="dropdown"><li class="dropdown onlysave">&nbsp;&nbsp;' + _language[_curLang].saveEdl + '</li> <li class="dropdown edl">&nbsp;&nbsp;' + _language[_curLang].saveAsEdl + '</li><li class="dropdown clip">&nbsp;&nbsp;' + _language[_curLang].saveAsClip + '</li> </ul></div>');
            }

            $select.find("div").click(function() {
                if (!editor.media.isEmpty()) {
                    if ($select.find("ul").css("display") == "none") {
                        $select.find("ul").css("display", "block");
                        store.dispatch({
                            type: types.GET_MATERIALS,
                            source: store.state.saveBasePath
                        });
                        //mlapp.service.getFolderObjects({ path: _rootPath + '/MaterialList' }, true).then(function (r) {
                        //if (r.length == 0) {
                        //  mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].emptyFolderList, 'warn', 'OK');
                        //  }
                        //else {
                        //  mlapp.scope.folderTree2 = r;
                        //mlapp.scope.SortFolerList(r);
                        //  }
                        //  }, function (r) {
                        //  mlapp.alert(Dialog, _language[_curLang].tip, _language[_curLang].getFolderListFailed, 'warn', 'OK');
                        //  });
                    } else {
                        $select.find("ul").css("display", "none");
                    }
                } else {
                    util.alert(Dialog, _language[_curLang].tip, _language[_curLang].timeLineIsEmpty, 'warn', 'OK');
                }
            });
            _dirTitle.innerText = _language[_curLang].directory;
            $select.find("li.edl").click(function() {
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
            $select.find("li.clip").click(function() {
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
            $select.find("li.onlysave").click(function() {
                flag = false;
                guid = window.parent.editor.timeLineId;
                json = window.parent.editor.media.json;
                if (guid != "") {
                    var url = _siteRoot + "cm/SaveTimeLine";
                    var par = {
                        usertoken: _userToken,
                        contentid: guid,
                        siteCode: _siteCode
                    };
                    var objstr = JSON.stringify({
                        json: editor.media.json,
                        title: editor.media.json.name,
                        folderPath: editor.edlPath
                    });
                    $.ajax({
                        type: "POST",
                        url: util.getUrl(url, par),
                        data: objstr,
                        async: false,
                        contentType: "application/json;",
                        dataType: "json",
                        success: function(r) {
                            if (r.Code == "0") {
                                editor.isCreating = false;
                                util.alert(Dialog, _language[_curLang].tip, _language[_curLang].updateSuccessfully, 'succeed', 'OK');
                            } else {
                                util.alert(Dialog, _language[_curLang].tip, _language[_curLang].updatefailed, 'error', 'OK');
                            }
                        },
                        error: function(r) {
                            util.alert(Dialog, _language[_curLang].tip, _language[_curLang].updatefailed, 'error', 'OK');
                        }
                    });
                } else {
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: _language[_curLang].saveAsEdl
                    });
                    _renderWindow.show();
                    _inputTitle.value = window.parent.editor.media.json.name || '';
                }
            });

            $select.mouseleave(function() {
                $select.find("ul").css("display", "none");
            });
            //$("#h5-tb-btn-submit-save").append($select);
            submitElement.appendChild($select[0]);
        },
        name: function() {
            return "save2";
        }

    });
    editor.editorPlugin.registerPlugin(plugin);

};

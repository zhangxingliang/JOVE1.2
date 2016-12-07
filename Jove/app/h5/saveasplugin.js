define("h5/saveasplugin", ["jquery", "h5/template/saveWindow"], function ($, SAVE_CONTENT_LAYOUT) {

    var r = {};

    r.createPlugin = function (editor, mlapp) { 
        var EditorPluginBase = editor.Controls.EditorPluginBase;
        var H5ToolbarButton = editor.Controls.H5ToolbarButton;
        var H5Window = editor.Controls.H5Window;
        var Dialog = editor.Controls.Dialog;
        var ShortcutKey = editor.Controls.ShortcutKey;
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
                 var $window = $(SAVE_CONTENT_LAYOUT);
                 var _contentElement = $window[0],
                    _btnOk = _contentElement.querySelector(".ok"),
                    _dirTitle = _contentElement.querySelector(".dir"),
                     _btnCancel = _contentElement.querySelector(".cancel"),
                     _inputTitle = _contentElement.querySelector(".title"),
                     _inputPath = _contentElement.querySelector(".path"),
                         _renderWindow;
                   
                var flag = true;
                _btnCancel.addEventListener("click", function () {
                    _renderWindow.hide();
                });
                _btnOk.addEventListener("click", function () {
                    //save

                    var url = _siteRoot + "cm/SaveTimeLine";
                    var par = { usertoken: _userToken, path: _rootPath + '/MaterialList' + _inputPath.value, title: _inputTitle.value, contentid: window.parent.editor.timeLineId };
                    window.parent.editor.media.update({ name: _inputTitle.value});
                    var objstr = JSON.stringify(window.parent.editor.media.json);
                    $.ajax({
                        type: "POST",
                        url: getUrl(url,par),
                        data: objstr,
                        async:false,
                        contentType: "application/json;",
                        dataType: "json",
                        success: function (r) {
                            if (r.Code == "0" && flag) {
                                var url2 = _siteRoot + "cm/SendToRender";
                                var par2 = { usertoken: _userToken, folderPath: _rootPath + '/MaterialList' + _inputPath.value, objecttype: '64', contentid: r.Ext.contentid };
                                $.get(getUrl(url2, par2),
                                    function (data, status) {
                                        if (data.Code == "0") {
                                            var dialog = new Dialog({
                                                title: _language[_curLang].tip,
                                                content: _language[_curLang].renderSuccess,
                                                style: 'warn',
                                                button: 'Ok'
                                            });
                                            dialog.open();
                                            //alert("发起合成成功");
                                        }
                                        else {
                                            var dialog = new Dialog({
                                                title: _language[_curLang].tip,
                                                content: data.Msg,
                                                style: 'warn',
                                                button: 'Ok'
                                            });
                                            dialog.open();
                                            //alert();
                                        }
                                    });
                            }
                            else if (r.Code == "0") {
                                var dialog = new Dialog({
                                    title: _language[_curLang].tip,
                                    content: _language[_curLang].saveTileLineSuccess,
                                    style: 'warn',
                                    button: 'Ok'
                                });
                                dialog.open();
                               // alert("保存时间线成功");
                            }
                            else {
                                var dialog = new Dialog({
                                    title: _language[_curLang].tip,
                                    content: _language[_curLang].saveTileLineFailed,
                                    style: 'warn',
                                    button: 'Ok'
                                });
                                dialog.open();
                               // alert("保存时间线失败：" + r.Msg);
                            }
                        },
                        error: function (r) {
                            var dialog = new Dialog({
                                title: _language[_curLang].tip,
                                content: r,
                                style: 'warn',
                                button: 'Ok'
                            });
                            dialog.open();
                        }
                    });
                   
                    _renderWindow.hide();
                });
                _this._super(app);

                var submitElement = _this.createToolbarButton("h5-tb-btn-submit-saveas");
                   
                var $select = $('<div class="toolbar-btn"><div class="divdiv" style="color: #cfd2d4;"><span style="top:0px;font-size: 16px;vertical-align: middle;line-height:25px;"  class="glyphicon glyphicon-floppy-disk"></span> </div></div>');
                $select.find(".divdiv").click(function () {
                    _renderWindow = new H5Window({
                        content: _contentElement,
                        title: _language[_curLang].saveAsEdl
                    });
                    mlapp.service.getFolderObjects({ path: _rootPath + '/MaterialList' }).then(function (r) {
                        if (r.length == 0) {
                            mlapp.alert($scope.Dialog, _language[_curLang].tip, _language[_curLang].emptyFolderList, 'warn', 'OK');
                        }
                        else {
                            mlapp.scope.folderTree2 = r;
                            _renderWindow.show();
                            _inputTitle.value = window.parent.editor.media.json.name || '';
                        }
                    }, function (r) {
                        mlapp.alert($scope.Dialog, _language[_curLang].tip, _language[_curLang].getFolderListFailed, 'warn', 'OK');
                    });
                });

                submitElement.appendChild($select[0]);
            },
            name: function () {
                  return "saveas";
        }

    });
    editor.editorPlugin.registerPlugin(plugin);

    };

    return r;

});
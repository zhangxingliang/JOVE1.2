
const app = new Vue({
  store,
  data: {
    folderBlockStatus: true,
    infoBlockStatus: true,
    userOperationStatus: false,
    sortByStatus: false,
    sortType: 'title',
    sortSymbol: true,
    typeSymbol: false,
    listSymbol: true,
    taskMonitorUrl: '',
    taskMonitorWindow: null,
    svplayerStyle: {
      right: '0'
    },
    esMarkerSymbol: true,
    scMarkerSymbol: true,
    chMarkerSymbol: true,
  },
  components: {
    'tree-ctrl': tree_ctrl,
    'material-ctrl': material_ctrl,
    'nav-path-ctrl': nav_path_ctrl,
    'vue-nice-scrollbar': vueNiceScrollbar,
    'marker-ctrl': marker_ctrl,
    'tree-ctrl2': tree_ctrl2,
    'list-material-header-ctrl': list_material_header_ctrl,
    'list-material-ctrl': list_material_ctrl,
    'sv-marker-ctrl': sv_marker_ctrl,
  },
  computed: {
    selectedNode() {
      return this.$store.getters.selectedNode
    },
    _svMarkerList() {
      return this.$store.state.svMarkerList.filter(item => this[item.tag + 'Symbol'])
    },
    dict() {
      return this.$store.state.dict
    },
    currentCtrl() {
      if (this.materials.length > 0 && this.materials[0].type === 'marker') {
        this.listSymbol = false;
        return 'marker-ctrl'
      } else if (this.listSymbol) {
        return 'list-material-ctrl'
      }
      return 'material-ctrl'
    },
    nodes() {
      return this.$store.getters.folderTree;
    },
    savePath() {
      return this.$store.getters.savePathTree;
    },
    _materials() {
      return this.listSymbol ? this.listMaterials : this.materials
    },
    materials() {
      if (this.$store.getters.currentNode.guid === 1 || this.$store.getters.currentNode.guid === 2) {
        if (this.sortType === 'type') {
          return util.sortBy(this.$store.getters.currentNode.searchResult, this.sortType, this.typeSymbol)
        } else {
          return util.sortBy(this.$store.getters.currentNode.searchResult, this.sortType, this.sortSymbol)
        }
      } else {
        if (this.sortType === 'type') {
          return util.sortBy(this.$store.getters.currentNode.children, this.sortType, this.typeSymbol)
        } else {
          return util.sortBy(this.$store.getters.currentNode.children, this.sortType, this.sortSymbol)
        }
      }
    },
    listMaterials() {
      if (this.$store.getters.currentNode.guid === 1 || this.$store.getters.currentNode.guid === 2) {
        return util.sortBy(this.$store.getters.currentNode.searchResult, this.$store.state.listOrder.type, this.$store.state.listOrder.symbol)
      } else {
        return util.sortBy(this.$store.getters.currentNode.children, this.$store.state.listOrder.type, this.$store.state.listOrder.symbol)
      }
    },
    materialsCount() {
      return this.materials.length
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    editor() {
      return this.$store.state.editor
    },
    Dialog() {
      return this.editor.Controls.Dialog
    },
    media() {
      return this.editor.media
    },
    previewUrl() {
      return this.$store.state.previewUrl
    },
    resourceBlockStatus() {
      return this.$store.state.resourceBlockStatus
    },
    svplayerStatus() {
      return this.$store.state.svplayerStatus
    },
    thumbPadding() {
      if (this.currentCtrl == 'material-ctrl') {
        return this.$store.state.thumbPadding
      } else {
        return 0
      }
    }
  },
  methods: {
    dropInSV(event) {
      var data = JSON.parse(event.dataTransfer.getData("Text"));
      var url = this.$store.state.previewBaseUrl + '?type=32&ep=JOVE&id=' + data.data.clipid + '&uk=' + _userToken + '&h=' + $('.sv_container').height();
      this.$store.commit({
        type: types.SET_PREVIEWURL,
        data: url
      })
      this.$store.dispatch({
        type: types.GET_OBJECT_INFO,
        data: {
          clipid: data.data.clipid,
          sourceid: '32'
        }
      }).then((res) => {
        this.$store.commit({
          type: types.SET_SVMARKERS,
          data: util.getMarkerList(res.data.Ext)
        })
      })
    },
    dropOverSV(event) {
      event.dataTransfer.dragEffect = 'copy';
    },
    switchListThumb(symbol) {
      if (this.materials.length > 0 && this.materials[0].type === 'marker') {
      } else {
        var _this = this
        this.listSymbol = symbol
        Vue.nextTick(() => {
          editor.initDrag()
        })
      }
    },
    hideMenu() {
      this.userOperationStatus = this.sortByStatus = false
    },
    orderBy(type, symbol) {
      this.sortType = type
      if (symbol !== undefined) {
        this.sortSymbol = symbol
      } else {
        this.typeSymbol = !this.typeSymbol
      }
    },
    logout() {
      this.userOperationStatus = false
      open(location, '_self').close()
    },
    refreshMaterial() {
      this.$store.dispatch({
        type: types.REFRESH_MATERIAL,
        source: this.$store.getters.currentNode
      }).then(() => {
        Vue.nextTick(() => {
          editor.initDrag()
        })
      })
    },
    toggleSVMV() {
      if (this.svplayerStatus) {
        this.$store.commit({
          type: types.DISACTIVE_SVPLAYER
        })
      } else {
        this.$store.commit({
          type: types.ACTIVE_SVPLAYER
        })
      }
    },
    showMV() {
      this.$store.commit({
        type: types.DISACTIVE_SVPLAYER
      })
    },
    toggleInfoBlock() {
      if (this.infoBlockStatus) {
        _infoResizer.hide()
        this.svplayerStyle.right = '-250px'
      } else {
        _infoResizer.show()
        this.svplayerStyle.right = 0
      }
      this.infoBlockStatus = !this.infoBlockStatus
      Vue.nextTick(() => {
        this.$store.commit({
          type: types.SET_THUMBPADDING
        })
      })
    },
    toggleResourceBlock() {
      if (this.folderBlockStatus && this.resourceBlockStatus) {
        this.folderBlockStatus = false
      }
      Vue.nextTick(() => {
        this.$store.commit({
          type: types.TOGGLE_RESOURCEBLOCKSTATUS
        })
      })
    },
    toggleFolderBlock() {
      if (!this.resourceBlockStatus) {
        this.$store.commit({
          type: types.TOGGLE_RESOURCEBLOCKSTATUS
        })
      }
      this.folderBlockStatus = !this.folderBlockStatus
      Vue.nextTick(() => {
        this.$store.commit({
          type: types.SET_THUMBPADDING
        })
      })
    },
    advanceSearch() {
      try {
        var _this = this
        var template = "[{\"tabName\":\"Clip\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\name\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\note\"},{\"fieldName\":\"Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\creator\"},{\"fieldName\":\"Create Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\createdate\"},{\"fieldName\":\"Modified by\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\modifier\"},{\"fieldName\":\"Modified Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\modifydate\"},{\"fieldName\":\"Right\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Journalist\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\journallist\"},{\"fieldName\":\"Item Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Category\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\item\\\\category\"},{\"fieldName\":\"Program Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\item\\\\programname\"},{\"fieldName\": \"Storage Status\",\"type\": \"List\",\"defaultValue\": \"All\",\"Values\": \"All,Online,Archived\",\"Key\": \"entity\\archivestatus\" }]},{\"tabName\":\"Folder\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Name\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"entity\\\\name\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"}]},{\"tabName\":\"PGM\",\"type\":\"info\",\"field\":[{\"fieldName\":\"Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Right\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Comments\",\"type\":\"Text\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"PGMCreator\"},{\"fieldName\":\"Create Date\",\"type\":\"Datetime\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"}]},{\"tabName\":\"Marker\",\"type\":\"Mark\",\"field\":[{\"fieldName\":\"Comments\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Title\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Member\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Action\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"\"},{\"fieldName\":\"LM Creator\",\"type\":\"String\",\"defaultValue\":\"\",\"Values\":\"\",\"Key\":\"LMCreator\"}]}]";
        $.fn.advancedSearch.defaults.usertoken = _userToken;
        $.fn.advancedSearch.defaults.sitecode = _siteCode;
        $.fn.advancedSearch.defaults.loginname = _this.$store.state.userInfo.loginName;
        $.fn.advancedSearch.defaults.template = template;
        $.fn.advancedSearch.defaults.callback = function(type, data) {
          _this.$store.commit({
            type: types.SET_MATERIALS,
            target: _this.$store.getters.searchResult,
            data: util.parseData(data, _this.$store.getters.searchResult, type)
          })
          _this.$store.commit({
            type: types.GET_NAVPATH,
            target: _this.$store.getters.searchResult,
            data: []
          })
        }
        $(this).advancedSearch();
      } catch (e) {}
    },
    taskMonitor() {
      if (this.taskMonitorWindow) {
      } else {
        var H5Window = this.editor.Controls.H5Window
        this.taskMonitorWindow = new H5Window({
          content: $('.taskmonitorifm')[0],
          title: this.dict.taskmonitor
        })
      }
      this.taskMonitorWindow.show()
    }
  },
  created() {
    // init
    var _this = this;
    var headerArr = JSON.parse(util.getCookie('item_headers'))
    if (util.isArray(headerArr)) {
      this.$store.commit({
        type: types.SET_HEADERS,
        data: headerArr
      })
    }
    if (window.golbalSetting.FAVSWITCH) {
      _this.$store.commit({
        type: types.ADD_FAVORITE
      })
    }
    h5.onReady(function(H5Editor) {
      var opt = {
        elementId: 'editor',
        resize: false,
        topElementId: 'stage_wrapper',
        playerElementId: 'player',
        mlElementId: 'resourceList',
        initTracks: ['GC', 'PIC', 'VA', 'A'],
        useCanvas: true,
        useCros: true,
        logger: new TimelinePlayer.Logger("debug"),
        panelOptions: {
          minWidth: 890,
          initWidth: 450,
          playerPanel: {
            minWidth: 250
          },
          infoPanel: {
            minWidth: 5,
            initWidth: 250
          }
        }
      }
      var editor = new H5Editor(opt)
      editor.timeLineId = ''
      editor.addEventListener("createnew", function() {
        editor.timeLineId = ''
      });
      window.editor = editor;
      // Dialog = editor.Controls.Dialog;
      createPlugin(editor, _this.$store)
      editor.create()
      // get streammedia info
      editor.service.getObjectInfo = (data, callback) => {
        _this.$store.dispatch({
          type: types.GET_OBJECT_INFO,
          data: data
        }).then(res => {
          if (res.data.Code === '0') {
            var entity = res.data.Ext
            if (entity.entity.archivestatus == "online_deleted") {
              var dialog
              dialog = new _this.editor.Controls.Dialog({
                title: lang[_curLang].tip,
                content: lang[_curLang].archived,
                style: 'question',
                button: lang[_curLang].confirmFlag,
                ok: function() {
                  if (!entity.streammedia || !entity.streammedia[0] || !entity.entity.item.clipfile.length) {
                    util.alert(_this.Dialog, _language[_curLang].tip, _language[_curLang].notGetStream, 'warn', 'OK')
                  } else {
                    // pic
                    if (entity.entity.type == "32" && entity.entity.subtype == "32") {
                      callback(true, {
                        source: entity.streammedia[0].filepath,
                        duration: 10
                      })
                    } else {
                      // video
                      if (data.in != undefined) {
                        callback(true, {
                          source: entity.streammedia[0].filepath,
                          duration: data.out - data.in
                        })
                      } else {
                        callback(true, {
                          source: entity.streammedia[0].filepath,
                          duration: entity.entity.item.length / 10000000
                        })
                      }
                    }
                  }
                },
                cancel: function() {
                  callback(false, null)
                  return
                }
              })
              dialog.open()
            } else {
              if (!entity.streammedia || !entity.streammedia[0] || !entity.entity.item.clipfile.length) {
                util.alert(_this.Dialog, _language[_curLang].tip, _language[_curLang].notGetStream, 'warn', 'OK')
              } else {
                // pic
                if (entity.entity.type == "32" && entity.entity.subtype == "32") {
                  callback(true, {
                    source: entity.streammedia[0].filepath,
                    duration: 10
                  })
                } else {
                  // video
                  if (data.in != undefined) {
                    callback(true, {
                      source: entity.streammedia[0].filepath,
                      duration: data.out - data.in
                    })
                  } else {
                    callback(true, {
                      source: entity.streammedia[0].filepath,
                      duration: entity.entity.item.length / 10000000
                    })
                  }
                }
              }
            }
          } else {
            util.alert(_this.Dialog, _language[_curLang].tip, _language[_curLang].getClipInfoFailed, 'warn', 'OK')
            callback(false, null)
          }
        }, () => {
          // reject
          callback(false, null)
        })
      }
      // get resource
      editor.service.getobject = function(data, callback) {
        _this.$store.dispatch({
          type: types.GET_FORMATE_INFO,
          data: data
        }).then(res => {
          if (res.data.Code == "0" && res.data.Ext.Length) {
            var framerate = 25.0
            if (res.data.Ext.VideoStandard) {
              framerate = ETGetVideoFrameRate(res.data.Ext.VideoStandard).nTimeRate
            }
            if (res.data.Ext.Markers) {
              res.data.Ext.Markers.forEach((item, index) => {
                item.time = item.keyframe / framerate
                item.text = item.note
                item.name = item.note
                item.intime = item.keyframe / framerate
                item.outtime = item.endkeyframe / framerate
                item.duration = item.outtime - item.intime
                if (item.type == '4') {
                  item.color = 'rgb(208,208,208)'
                } else if (item.type == '8') {
                  item.color = 'rgb(244,112,104)'
                } else if (item.type == '65536') {
                  item.color = 'rgb(243,178,102)'
                } else if (item.type == '131072') {
                  item.color = 'rgb(239,239,97)'
                } else {
                  item.color = 'rgb(129,233,154)'
                }
              });
            }
            if (data.in != undefined) {
              res.data.Ext.Length = (data.out - data.in) * 10000000
              res.data.Ext.TrimIn = data.in * 10000000
              res.data.Ext.TrimOut = data.out * 10000000
              callback(true, res.data.Ext)
            } else {
              callback(true, res.data.Ext);
            }
          } else {
            callback(false, null)
          }
        }, () => {
          // reject
          callback(false, null)
        })
      }

      editor.service.save = function(json, opt, callback) {
        if (!editor.media.isEmpty()) {
          if (!document.querySelector(".windowModalDiv")) {
            // get folder
            _this.$store.dispatch({
              type: types.GET_MATERIALS,
              source: _this.$store.state.saveBasePath
            });
            document.querySelector(".onlysave").click();
            if (callback) {
              callback(true)
            }
          }
        } else {
          util.alert(_this.Dialog, _language[_curLang].tip, _language[_curLang].timeLineIsEmpty, 'warn', 'OK')
        }
      };
      _this.$store.commit({
        type: types.SET_EDITOR,
        data: editor
      })
    });
    var ui = document.createElement("script")
    ui.setAttribute("src", "/js/lib/jquery-ui.js" + version)
    document.querySelector('head').appendChild(ui)

    var fulltextcss = document.createElement("link")
    fulltextcss.setAttribute("href", golbalSetting.CM + "/styles/plugins/jquery.fulltextsearch.css" + version)
    fulltextcss.setAttribute("rel", "stylesheet")
    $('head').prepend(fulltextcss)

    var advancecss = document.createElement("link")
    advancecss.setAttribute("href", golbalSetting.CM + "/styles/plugins/jquery.advancedsearch.css" + version)
    advancecss.setAttribute("rel", "stylesheet")
    $('head').prepend(advancecss)

    var userspacecss = document.createElement("link")
    userspacecss.setAttribute("href", golbalSetting.CM + "/styles/ModulePage/userSpace.css" + version)
    userspacecss.setAttribute("rel", "stylesheet")
    $('head').prepend(userspacecss)

    var userdepcss = document.createElement("link")
    userdepcss.setAttribute("href", golbalSetting.CM + "/styles/getUserAndDep.css" + version)
    userdepcss.setAttribute("rel", "stylesheet")
    $('head').prepend(userdepcss)

    var base64 = document.createElement("script")
    base64.setAttribute("src", golbalSetting.CM + "/js/lib/jquery.base64.js" + version)
    document.querySelector('html').appendChild(base64)
    var advance = document.createElement("script")
    advance.setAttribute("src", golbalSetting.CM + "/js/plugins/jquery.advancedsearch.js" + version)
    document.querySelector('html').appendChild(advance)
    var treeview = document.createElement("script")
    treeview.setAttribute("src", golbalSetting.CM + "/js/lib/jquery.treeview.js" + version)
    document.querySelector('html').appendChild(treeview)
    var user = document.createElement("script")
    user.setAttribute("src", golbalSetting.CM + "/js/common/user.js" + version)
    document.querySelector('html').appendChild(user)
    var userdep = document.createElement("script")
    userdep.setAttribute("src", golbalSetting.CM + "/js/common/getUserAndDepartment.js" + version)
    document.querySelector('html').appendChild(userdep)
    var format = document.createElement("script")
    format.setAttribute("src", golbalSetting.CM + "/js/common/format.js" + version)
    document.querySelector('html').appendChild(format)
  },
  mounted() {
    var _this = this
    var resizeCallback = util.throttle(100, function(e) {
      _this.$store.commit({
        type: types.SET_THUMBPADDING,
      })
      var url = _this.$store.state.previewUrl
      url = url.replace(/&h=(\d+)*/, '&h=' + $('.sv_container').height())
      _this.$store.commit({
        type: types.SET_PREVIEWURL,
        source: this.material,
        data: url
      })
    }, true)
    Vue.nextTick(() => {
      var url = this.$store.state.previewUrl + '&h=' + $('.sv_container').height()
      _this.$store.commit({
        type: types.SET_PREVIEWURL,
        source: this.material,
        data: url
      })
    })
    window.addEventListener('resize', resizeCallback)
    window.addEventListener("message", function(event) {
      if (event.data.isShortCutKey) {
        switch (event.data.code) {
          case 32: {
            window.frames[0].postMessage({
              ep: "JOVE",
              operation: "Space"
            }, '*');
            break;
          }
          case 36: {
            window.frames[0].postMessage({
              ep: "JOVE",
              operation: "Home"
            }, '*');
            break;
          }
          case 37: {
            window.frames[0].postMessage({
              ep: "JOVE",
              operation: "LastFrame"
            }, '*');
            break;
          }
          case 39: {
            window.frames[0].postMessage({
              ep: "JOVE",
              operation: "NextFrame"
            }, '*');
            break;
          }
          case 35: {
            window.frames[0].postMessage({
              ep: "JOVE",
              operation: "End"
            }, '*');
            break;
          }
        }
        return;
      }
      var data = JSON.parse(event.data);
      if (!(data.in != -1 && data.out != -1) || (parseInt(data.in) >= parseInt(data.out))) {
        if (data.in == -1 && data.out == -1) {
        } else {
          util.alert(_this.Dialog, _language[_curLang].tip, _language[_curLang].canNotAdd, 'warn', 'OK');
          return;
        }
      }
      data.id = data.guid;
      data.clipid = data.guid;
      data.channel = "2";
      data.sourceid = '32'
      _this.$store.dispatch({
        type: types.GET_OBJECT_INFO,
        data: data
      }).then(res => {
        if (res.data.Code === '0') {
          var framerate = 25.0;
          var r = res.data;
          data.title = r.Ext.entity.name;
          data.isImage = false;
          if (r.Ext.entity.iconfilename) {
            data.icon = r.Ext.entity.iconfilename
          }
          data.sourceid = "32";
          if (r.Ext.entity.subtype == 4) {
            data.audio = true;
          } else {
            data.audio = false;
            if (r.Ext.entity.subtype == 32) {
              data.isImage = true;
            }
          }
          data.createdate = r.Ext.entity.createdate.formatDate();
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
            _this.editor.addTrackEvent('image', data);
          } else if (data.audio) {
            data.channel = "1";
            data.in = r.Ext.entity.item.trimin / 10000000;
            data.out = r.Ext.entity.item.trimout / 10000000;
            data.duration = data.out - data.in
            data.from = data.in;
            data.end = data.out;
            _this.editor.addTrackEvent('audio', data);
          } else {
            var a = data.in,
              b = data.out;
            data.in = r.Ext.entity.item.trimin / 10000000;
            data.out = r.Ext.entity.item.trimout / 10000000;
            data.from = a / framerate;
            data.end = b / framerate;
            if (a == -1) {
              data.from = data.in;
              data.end = data.out;
            }
            data.duration = data.out - data.in;
            _this.editor.addTrackEvent('video', data);
          }
        }
      });
    });
    window.addEventListener("keydown", function(event) {
      var keycode = event.keyCode;
      var targetTag = event.target.tagName.toUpperCase();
      if (targetTag != 'INPUT' && targetTag != 'TEXTAREA') {
        //if (keycode == 38) {
        //  _this.$store.commit({
        //    type: types.PREV_ITEM,
        //    source: _this.selectedNode
        //  })
        //} else if (keycode == 40) {
        //  _this.$store.commit({
        //    type: types.NEXT_ITEM,
        //    source: _this.selectedNode
        //  })
        //} else if (keycode == 39) {
        //  _this.$store.dispatch({
        //    type: types.EXPAND_FOLDER,
        //    source: _this.selectedNode
        //  });
        //} else if (keycode == 37) {
        //  _this.$store.commit({
        //    type: types.CLOSE_FOLDER,
        //    target: _this.selectedNode
        //  })
        //} else if (keycode == 13) {
        //  if (_this.selectedNode.guid === 1) {
        //    _this.$store.commit({
        //      type: types.GET_NAVPATH,
        //      target: _this.selectedNode,
        //      data: []
        //    })
        //  } else if (_this.selectedNode.guid === 2) {
        //    _this.$store.dispatch({
        //      type: types.GET_SEARCHRESULT,
        //      source: _this.selectedNode
        //    }).then(() => {
        //      _this.$store.commit({
        //        type: types.GET_NAVPATH,
        //        target: _this.selectedNode,
        //        data: []
        //      })
        //    })
        //  } else if (_this.selectedNode.guid === -1) {
        //    _this.$store.dispatch({
        //      type: types.GET_FAVORITERESULT,
        //      source: _this.selectedNode
        //    }).then(() => {
        //      _this.$store.commit({
        //        type: types.GET_NAVPATH,
        //        target: _this.selectedNode,
        //        data: []
        //      })
        //    })
        //  } else {
        //    // normal folder
        //    _this.$store.dispatch({
        //      type: types.GET_MATERIALS,
        //      source: _this.selectedNode
        //    }).then(() => {
        //      _this.$store.commit({
        //        type: types.GET_NAVPATH,
        //        target: _this.selectedNode,
        //        data: []
        //      })
        //    })
        //  }
        //} else
        if (keycode == 8) {
          _this.$store.commit({
            type: types.BACK_UP
          })
        }
      }
    });

    this.$store.dispatch({
      type: types.LOGIN,
      data: _userToken
    }).then(() => {
      var _this = this;
      setTimeout(() => {
        _this.taskMonitorUrl = _tkUrl + "TaskMonitor.html?UserCode=" + $.base64.encode(_this.userInfo.userCode)
        var H5Window = this.editor.Controls.H5Window
        this.taskMonitorWindow = new H5Window({
          content: $('.taskmonitorifm')[0],
          title: this.dict.taskmonitor
        })
      }, 1000);
      var fulltext = document.createElement("script")
      fulltext.setAttribute("src", golbalSetting.CM + "/js/plugins/jquery.fulltextsearch.js" + version)
      document.querySelector('html').appendChild(fulltext)
      var userstorge = document.createElement("script")
      userstorge.setAttribute("src", golbalSetting.CM + "/js/plugins/UserSpace.js" + version)
      document.querySelector('html').appendChild(userstorge)
      fulltext.onload = fulltext.onreadystatechange = function() {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          try {
            $.fn.fullTextSearch.defaults.usertoken = _userToken;
            $.fn.fullTextSearch.defaults.sitecode = _siteCode;
            $.fn.fullTextSearch.defaults.loginname = _this.userInfo.loginName;;
            $("#div_fullTextSearch").fullTextSearch({});
            $.fn.fullTextSearch.defaults.callback = function(data) {
              _this.$store.commit({
                type: types.SET_MATERIALS,
                target: _this.nodes[1],
                data: util.parseData(data, _this.$store.state.nodes[1])
              })
              _this.$store.commit({
                type: types.GET_NAVPATH,
                target: _this.$store.getters.searchResult,
                data: []
              })
            };
            fulltext.onload = fulltext.onreadystatechange = null;
            _this.$store.dispatch({
              type: types.GET_MATERIALS,
              source: _this.nodes[0]
            }).then(() => {
              _this.$store.commit({
                type: types.GET_NAVPATH,
                target: _this.nodes[0],
                data: []
              })
              var path = util.utf8to16(_folderPath).replace('Public', 'MaterialList').split('/').filter(item => item != '');
              if (path.length > 1) {
                util.locateFolder(_this.$store, path, {
                  children: _this.$store.getters.folderTree
                })
              }
              Vue.nextTick(() => {
                editor.initDrag()
              })
            })
          } catch (e) {}
        }
      }
      userstorge.onload = userstorge.onreadystatechange = function() {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          try {
            $("#userStorage").userSpace({
              usertoken: _userToken,
              loginName: _this.userInfo.loginName
            })
          } catch (e) {}
        }
      }
    })
  }
}).$mount('#app')

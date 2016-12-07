// init app and start
const app = new Vue({
  store,
  data: {
    previewUrl : ''
  },
  components: {
    'tree-ctrl' : tree_ctrl,
    'material-ctrl' : material_ctrl,
    'nav-path-ctrl' : nav_path_ctrl,
    'vue-nice-scrollbar' : vueNiceScrollbar

  },
  computed: {
    nodes(){
      return this.$store.getters.folderTree.sort()
    },
    savePath(){
      return this.$store.getters.savePathTree.sort()
    },
    materials(){
      return this.$store.getters.currentNode.children.sort((a, b)=>a.name.localeCompare(b.name))
    },
    materialsCount(){
      return this.materials.length
    },
    userInfo(){
      return this.$store.state.userInfo
    },
    editor(){
      return this.$store.state.editor
    },
    Dialog(){
      return this.editor.Controls.Dialog
    }
  },
  methods: {
    advanceSearch(){

    },
    taskMonitor(){

    }
  },
  created(){
    var ui = document.createElement("script")
    ui.setAttribute("src", "/app/lib/js/jquery-ui.js" + version)
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
  mounted(){
    // init
    var _this = this;
    h5.onReady(function (H5Editor) {
    var opt = {
        elementId: 'editor',
        resize: true,
        topElementId: 'stage_wrapper',
        playerElementId: 'player',
        mlElementId: 'resourceList',
        initTracks: ['GC', 'PIC', 'VA', 'A'],
        useCanvas: true,
        useCros: true,
        logger: new TimelinePlayer.Logger("debug"),
        panelOptions: {
            minWidth: 700,
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
    editor.addEventListener("createnew", function () {
        editor.timeLineId = ''
    });
    window.editor = editor;

    // Dialog = editor.Controls.Dialog;
    createPlugin(editor, _this.$store)
    editor.create()
    // get streammedia info
    editor.service.getObjectInfo = (data, callback)=>{
      _this.$store.dispatch({
        type : types.GET_OBJECT_INFO,
        data : data
      }).then(res=>{
        if(res.data.Code === '0'){
          var  entity = res.data.Ext
          if (!entity.streammedia || !entity.streammedia[0] || !entity.entity.item.clipfile.length) {
            util.alert(this.Dialog, _language[_curLang].tip, _language[_curLang].notGetStream, 'warn', 'OK')
          }
          else {
            // pic
            if (entity.entity.type == "32" && entity.entity.subtype == "32") {
              callback(true, { source: entity.streammedia[0].filepath, duration: 10 })
            }
            else {
              // video
              if (data.in != undefined) {
                callback(true, { source: entity.streammedia[0].filepath, duration: data.out - data.in })
              }
              else {
                callback(true, { source: entity.streammedia[0].filepath, duration: entity.entity.item.length / 10000000 })
              }
            }
          }
        }
        else {
        util.alert(this.Dialog, _language[_curLang].tip, _language[_curLang].getClipInfoFailed, 'warn', 'OK')
        callback(false, null)
      }
    }, ()=>{
      // reject
       callback(false, null)
    })
    }
    // get resource
    editor.service.getobject = function (data, callback) {
      _this.$store.dispatch({
        type : types.GET_FORMATE_INFO,
        data : data
      }).then(res=>{
        if (res.data.Code == "0" && res.data.Ext.Length) {
          var framerate = 25.0
          if (res.data.Ext.VideoStandard ) {
            framerate = ETGetVideoFrameRate(res.data.Ext.VideoStandard).nTimeRate
          }
          res.data.Ext.Markers.forEach((item, index)=>{
            item.time = item.keyframe / framerate
            item.text = item.note
            item.name = item.note
            item.intime = item.keyframe / framerate
            item.outtime = item.endkeyframe / framerate
            item.duration = item.outtime - item.intime
            if (item.type == '4') {
              item.color = 'rgb(208,208,208)'
            }
            else if(item.type == '8'){
              item.color = 'rgb(244,112,104)'
            }
            else if (item.type == '65536') {
              item.color = 'rgb(243,178,102)'
            }
            else if (item.type == '131072') {
              item.color = 'rgb(239,239,97)'
            }
            else {
              item.color = 'rgb(129,233,154)'
            }
          });
          if (data.in != undefined) {
            res.data.Ext.Length = (data.out - data.in) * 10000000
            res.data.Ext.TrimIn = data.in * 10000000
            res.data.Ext.TrimOut = data.out * 10000000
            callback(true, res.data.Ext)
          }
          else {
            callback(true, res.data.Ext);
          }
        }
        else{
           callback(false, null)
        }
      }, ()=>{
        // reject
        callback(false, null)
      })
    }

    editor.service.save = function (json, opt, callback) {
        if (editor.media.isEmpty()) {
            if (!document.querySelector(".windowModalDiv")) {
                // get folder
                _this.$store.dispatch({
                  type : types.GET_MATERIALS,
                  source : mlapp.state.saveBasePath
                });
                document.querySelector(".onlysave").click();
                if (callback) {
                    callback(true)
                }
            }
        }
        else {
            util.alert(this.Dialog, _language[_curLang].tip, _language[_curLang].timeLineIsEmpty, 'warn', 'OK')
        }
    };
    _this.$store.commit({
        type : types.SET_EDITOR,
        data : editor
      })
    });
     this.previewUrl = golbalSetting.CM + "/ModulePage/webpreview.html"

     this.$store.dispatch({
       type : types.LOGIN,
       data : _userToken
     }).then(()=>{
       var _this = this;
       var fulltext = document.createElement("script")
       fulltext.setAttribute("src", golbalSetting.CM + "/js/plugins/jquery.fulltextsearch.js" + version)
       document.querySelector('html').appendChild(fulltext)
       var userstorge = document.createElement("script")
       userstorge.setAttribute("src", golbalSetting.CM + "/js/module/UserSpace.js" + version)
       document.querySelector('html').appendChild(userstorge)
       fulltext.onload = fulltext.onreadystatechange = function () {
         if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            try {
              $.fn.fullTextSearch.defaults.usertoken = _userToken;
              $.fn.fullTextSearch.defaults.loginname = _this.userInfo.loginName;;
              $("#div_fullTextSearch").fullTextSearch({});
              $.fn.fullTextSearch.defaults.callback = function (data) {
                this.$store.commit({
                  type : types.SET_MATERIALS,
                  target : this.nodes[1],
                  data : util.ParseSearchResult('fullsearch', data)
                })
                this.$store.dispatch({
                  type : types.GET_MATERIALS,
                  source : this.nodes[1]
                })
              };
              fulltext.onload = fulltext.onreadystatechange = null;
          }
          catch (e) { }
        }
      }
      userstorge.onload = userstorge.onreadystatechange = function () {
      if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
        try {
          $("#userStorage").userSpace({ usertoken: _userToken, loginName: _this.userInfo.loginName })
        }
        catch (e) { }
      }
     }
    })
  }
}).$mount('#app')

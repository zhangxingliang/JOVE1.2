const material_ctrl = {
  template: "#material_ctrl",
  props: {
    data: Object
  },
  data: function() {
    return {
      intervalId: -1,
      top: 0,
      left: 0,
    }
  },
  methods: {
    dblclick: function(event) {
      if (this.material.type === 'folder') {
        util.locateFolder(this.$store, this.material.path.split('/').slice(1), {
          children: this.$store.getters.folderTree
        })
      /*this.$store.commit({
        type : types.EXPAND_FOLDER,
        target : this.material
      })
      this.$store.dispatch({
        type : types.GET_MATERIALS,
        source : this.material
      }).then(()=>{
        this.$store.commit({
          type : types.GET_NAVPATH,
          target :  this.material,
          data : []
        })
        Vue.nextTick(()=>{
          editor.initDrag()
        })
      })*/
      } else if (this.material.type === 'h5pgm') {
        this.$store.dispatch({
          type: types.GET_OBJECT_INFO,
          data: {
            clipid: this.material.guid,
            sourceid: this.material.typeid
          }
        }).then(res => {
          if (res.data.Code == "0") {
            var json = JSON.parse(res.data.Ext.entity.item.projectdata)
            if (json) {
              this.editor.media.pause()
              this.editor.load(json)
              //document.querySelector("#mvTimeLineTitle").innerText = json.name;
              this.editor.timeLineId = res.data.Ext.entity.guid
              this.editor.edlPath = res.data.Ext.entity.folderpath
              this.editor.media.currentTime = 0
              this.editor.editor.openTrackEventProperty(this.editor.media)
              $('#mvTimeLineTitle')[0].innerText = json.name
              this.$store.commit({
                type: types.DISACTIVE_SVPLAYER
              })
            } else {
              util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
            }
          } else {
            util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
          }
        }, () => {
          util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
        })
      } else if (this.material.type === 'marker') {
        this.$store.dispatch({
          type: types.GET_OBJECT_INFO,
          data: {
            clipid: this.material.objectguid,
            sourceid: '32'
          }
        }).then(res => {
          var pathList = res.data.Ext.entity.folderpath.split('/')
          util.locateFolder(this.$store, pathList.slice(1), {
            children: this.$store.getters.folderTree
          })
        })
      } else {
        var url = this.$store.state.previewBaseUrl + '?type=32&ep=JOVE&id=' + this.material.guid + '&uk=' + _userToken + '&h=' + $('.sv_container').height()
        this.$store.commit({
          type: types.SET_PREVIEWURL,
          source: this.material,
          data: url
        })
        this.$store.commit({
          type: types.ACTIVE_SVPLAYER
        })
        this.$store.dispatch({
          type: types.GET_OBJECT_INFO,
          data: {
            clipid: this.material.guid,
            sourceid: '32'
          }
        }).then((res) => {
          this.$store.commit({
            type: types.SET_SVMARKERS,
            data: util.getMarkerList(res.data.Ext)
          })
        })
      /*if (!this.$store.resourceBlockStatus) {
        this.$store.commit({
          type: types.MOVE_SVPLAYER
        })
      }*/
      }
    },
    mousemove(event) {
      var x1 = event.x
      var x2 = $(event.target).offset().left
      var offset = Math.floor((x1 - x2) / 6.25)
      this.left = x1 - x2
      this.top = -135 * offset
    }
  },
  computed: {
    material() {
      return this.data
    },
    editor() {
      return this.$store.state.editor
    },
    thumbPadding() {
      return this.$store.state.thumbPadding
    }
  }
}

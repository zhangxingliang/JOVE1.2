const material_ctrl = {
  template: "#material_ctrl",
  props: {
    data: Object
  },
  data: function(){
    return {
      intervalId : -1
    }
  },
  methods: {
    dblclick: function(event){
      if(this.material.type === 'folder'){
        util.locateFolder(this.$store, this.material.path.split('/').slice(1), {children : this.$store.getters.folderTree})
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
      }
      else if(this.material.type === 'h5pgm'){
        this.$store.dispatch({
          type : types.GET_OBJECT_INFO,
          data : {
            clipid : this.material.guid,
            sourceid : this.material.typeid
          }
        }).then(res=>{
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
            }
            else {
              util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
            }
          }
          else {
            util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
          }
        }, ()=>{
          util.alert(this.editor.Controls.Dialog, _language[_curLang].tip, _language[_curLang].loadTimelineFailed, 'warn', 'OK')
        })
      }
    }
  },
  computed: {
    material(){
      return this.data
    },
    editor(){
      return this.$store.state.editor
    }
  }
}

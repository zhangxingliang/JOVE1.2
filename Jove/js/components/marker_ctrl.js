const marker_ctrl = {
  template: '#marker_ctrl',
  props: {
    data: Object
  },
  data: function() {
    return {
    }
  },
  methods: {
    dblclick: function(event) {
      if (this.material.type === 'marker') {
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
      }
    }
  },
  computed: {
    material() {
      return this.data
    }
  }
}

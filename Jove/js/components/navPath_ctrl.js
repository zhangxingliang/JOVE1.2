const nav_path_ctrl = {
    template: "#nav_path_ctrl",
    computed: {
      navPath(){
        return this.$store.state.navPath
      }
    },
    methods: {
      click: function (node) {
        util.locateFolder(this.$store, node.path.split('/').slice(1), {children : this.$store.getters.folderTree})
        /*this.$store.dispatch({
          type : types.GET_MATERIALS,
          source : node
        })*/
      },
      backUp: function () {
          this.$store.commit({
            type : types.BACK_UP
        });
      }
    }
};

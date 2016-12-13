const tree_ctrl =
{
    template: "#tree_ctrl",
    props: {
        data: Object
    },
    name: "tree-ctrl",
    data: function () {
        return {
          intervalId : -1,
          dragOver : false
        };
    },
    methods: {
        click: function () {
          if(this.node.guid === 1){
            this.$store.commit({
              type : types.GET_NAVPATH,
              target :  this.node,
              data : []
            })
            Vue.nextTick(()=>{
              editor.initDrag()
            })
          }
          else if(this.node.guid === 2)
          {
            this.$store.dispatch({
              type : types.GET_SEARCHRESULT,
              source : this.node
            }).then(()=>{
              this.$store.commit({
                type : types.GET_NAVPATH,
                target :  this.node,
                data : []
              })
              Vue.nextTick(()=>{
                editor.initDrag()
              })
            })
          }
          else{
            // normal folder
            this.$store.dispatch({
              type : types.GET_MATERIALS,
              source : this.node
            }).then(()=>{
              this.$store.commit({
                type : types.GET_NAVPATH,
                target :  this.node,
                data : []
              })
              Vue.nextTick(()=>{
                editor.initDrag()
              })
            })
          }
        },
        dblclick: function (node) {
          if(this.node.guid === 1){
            this.$store.dispatch({
              type : types.GET_SEARCHMODEL,
              source : this.node
            }).then(()=>{
            })
          }
          this.$store.dispatch({
            type : types.TOGGLE_FOLDER,
            source : this.node
          })
        },
        nodeToggle: function(node){
          this.$store.dispatch({
            type : types.TOGGLE_FOLDER,
            source : this.node
          })
        },
        dragOver: function(event){
          //sethover effect
          this.dragOver = true

          event.dataTransfer.effectAllowed = "move"
          //event.dataTransfer.setDragImage(event.target, 0, 0);
          if(!this.node.openned){
            this.intervalId = setTimeout(()=>{
              this.$store.dispatch({
                type : types.EXPAND_FOLDER,
                source : this.node
              })
            }, 1000)
          }
        },
        dragLeave:function(event){
          // clear hover effct
          clearTimeout(this.intervalId)
          this.intervalId = -1
          this.dragOver = true
        },
        drop: function(event){
          if(event.dataTransfer.files.length > 0){
            this.$store.dispatch({
              type : types.GET_MATERIALS,
              source : this.node
            })
            this.$store.dispatch({
              type : types.UPLOAD_FILES,
              data : event.dataTransfer.files,
              source : this.node
            })
          }
          else{
            var data = JSON.parse(event.dataTransfer.getData("text"))
            if(util.isArray(data)){
              // item.name should be item.guid
              var materials = this.$store.getters.currentNode.children.filter(item=>data.indexOf(item.name)>-1)
              this.$store.dispatch({
                type : types.MOVE_MATERIALS,
                target : this.node,
                data : data
              })
            }
          }
        }
    },
    computed: {
      node(){
        // Special folder transfer
        return this.data
      },
      selectedNode(){
        return this.$store.state.currentNode
      },
      sortFunc(){
        return window.SortLikeWin
      }
    }
}

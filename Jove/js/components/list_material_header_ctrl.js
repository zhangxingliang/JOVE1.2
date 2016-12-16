const list_material_header_ctrl = {
  template: "#list_material_header_ctrl",
  data: function() {
    return {
      dragItem: {},
      dragName: '',
      index: -1,
      dragging: false,
      x: 0,
      offset: 0,
      mousemove: null,
      mouseup: null
    }
  },
  methods: {
    dragstart(event, header) {
      this.dragItem = header
      this.dragName = header.name
      this.index = this.headers.indexOf(header)
      var x = $(event.target).offset().left - 200
      this.offset = this.x % 200
      this.x = Math.max(x - this.offset, 0)
      this.dragging = true
      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    //header.name = ''
    //event.dataTransfer.setData("text", header.name);
    //event.dataTransfer.setDragImage(event.target, 0, 0);
    }
  },
  created() {
    var _this = this
    this.mousemove = function(event) {
      var header
      var x = Math.max(event.x - 200, 0)
      if (x > _this.x) {
        _this.x = Math.max(x - _this.offset, 0)
        header = _this.headers[Math.floor(_this.x / 200) + 1]
      } else {
        _this.x = Math.max(x - _this.offset, 0)
        header = _this.headers[Math.floor(_this.x / 200)]
      }

      //var header = util.getListHeader(_this.x, _this.headers)

      if (header != _this.dragItem) {
        var index = _this.headers.indexOf(header)
        if (index > _this.index)
          index -= 1
        _this.headers.remove(_this.dragItem)
        _this.headers.splice(index, 0, _this.dragItem)
        _this.index = index + 1;
      }
    }
    this.mouseup = function(event) {
      _this.dragging = false;
      window.removeEventListener('mousemove', _this.mousemove)
      window.removeEventListener('mouseup', _this.mouseup)
    }
  },
  computed: {
    headers() {
      return this.$store.state.headers
    }
  }
}

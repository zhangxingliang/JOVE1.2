const list_material_header_ctrl = {
  template: "#list_material_header_ctrl",
  data: function() {
    return {
      dragItem: null,
      dragName: '',
      index: -1,
      dragging: false,
      x: 0,
      offset: 0,
      mousemove: null,
      mouseup: null,
      stampWidth: 0,
      stampLeft: 0,
      titleWidth: 200,
      titleLeft: 0,
      targetWidth: 0,
      resizeX: 0,
      resizeMove: null,
      resizeUp: null,
      resizeItem: null,
      oldWidth: 0,
    }
  },
  methods: {
    dragstart(event, header) {
      if (header.name === 'Title') {
        return false
      }
      var ele = event.target.tagName === 'DIV' ? $(event.target) : $(event.target).parent()
      this.dragItem = header
      this.dragName = header.name
      header.dragging = true
      this.index = this.headers.indexOf(header)
      this.stampLeft = $('.list_header_stamp').offset().left
      this.stampWidth = $('.list_header_stamp').width()
      this.titleWidth = this.headers[0].width
      this.targetWidth = ele.width()
      var eventLeft = ele.offset().left
      this.x = eventLeft - this.stampLeft // foldertree + stamp
      this.offset = (event.x - eventLeft) % ele.width()
      this.dragging = true
      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    },
    sortBy(header, symbol) {
      this.$store.commit({
        type: types.SET_ORDERTYPE,
        data: {
          type: header.attr,
          symbol: symbol
        }
      })
    },
    resize(event, header) {
      this.resizeItem = header
      this.oldWidth = header.width
      this.resizeX = event.x
      window.addEventListener('mousemove', this.resizeMove)
      window.addEventListener('mouseup', this.resizeUp)
    }
  },
  created() {
    var _this = this
    this.mousemove = function(event) {
      var header
      var min = _this.stampWidth
      var x = Math.min(_this.headers.reduce((item1, item2) => {
          return {
            width: item1.width + item2.width
          }
        }
        ).width + min, Math.max(event.x - _this.stampLeft, min + _this.titleWidth))
      if (x - _this.offset > _this.x) {
        // →  30 为缓冲距离
        _this.x = Math.max(x - _this.offset, min + _this.titleWidth)
        header = util.getListHeader(_this.x - min - 30 + _this.targetWidth, _this.headers)
      } else {
        _this.x = Math.max(x - _this.offset, min + _this.titleWidth)
        header = util.getListHeader(_this.x - min + 30, _this.headers)
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
      _this.dragging = false
      _this.dragItem.name = _this.dragName
      _this.dragItem.dragging = false
      window.removeEventListener('mousemove', _this.mousemove)
      window.removeEventListener('mouseup', _this.mouseup)
    }
    this.resizeMove = function(event) {
      var newX = event.x
      _this.resizeItem.width = Math.max(45, _this.oldWidth + newX - _this.resizeX)
    }
    this.resizeUp = function(event) {
      _this.resizeItem = null
      window.removeEventListener('mousemove', _this.resizeMove)
      window.removeEventListener('mouseup', _this.resizeUp)
    }
  },
  computed: {
    headers() {
      return this.$store.state.headers
    },
    headerWidth() {
      return this.headers.reduce((item1, item2) => {
          return {
            width: item1.width + item2.width
          }
        }).width + 120
    }
  }
}

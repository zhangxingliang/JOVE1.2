const list_material_header_ctrl = {
  template: "#list_material_header_ctrl",
  data: function() {
    return {
      dragItem: {
        width: 200
      },
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
      filterSymbol: false,
      filterWindow: null,
      __headers: [],
      lastX: 0
    }
  },
  methods: {
    selectAll() {
      if (this.$data.__headers.every(item => item.checked)) {
        this.$data.__headers.forEach(item => {
          if (item.name !== 'Title') {
            item.checked = false
          }
        })
      } else {
        this.$data.__headers.forEach(item => item.checked = true)
      }
    },
    openFilterWindow() {
      this.filterSymbol = true
      this.$data.__headers = JSON.parse(JSON.stringify(this.$store.state.headers))
      Vue.nextTick(() => {
        if (!this.filterWindow) {
          var H5Window = this.$store.state.editor.Controls.H5Window
          this.filterWindow = new H5Window({
            content: $('.header_filter_container')[0],
            title: 'Column Filter'
          })
        }
        this.filterWindow.show()
      })
    },
    closeFilter() {
      this.filterWindow.hide()
    },
    saveFilter() {
      var indexArr = []
      this.$data.__headers.forEach((item, index) => {
        if (item.checked) {
          indexArr.push(index)
        }
      })
      this.$store.commit({
        type: types.SET_HEADERFILTER,
        data: indexArr
      })
      this.filterWindow.hide()
    },
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
      this.lastX = event.x
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
      var right = false
      var min = _this.stampWidth
      var x = Math.min(_this.headers.reduce((item1, item2) => {
          return {
            width: item1.width + item2.width
          }
        }
        ).width + min, Math.max(event.x - _this.stampLeft, min + _this.titleWidth))
      //if (x - _this.offset > _this.x) {
      if (event.x > _this.lastX) {
        // →  30 为缓冲距离
        _this.x = Math.max(x - _this.offset, min + _this.titleWidth)
        header = util.getListHeader(_this.x - min - 30 + _this.targetWidth, _this.headers)
        right = true
      } else {
        _this.x = Math.max(x - _this.offset, min + _this.titleWidth)
        header = util.getListHeader(_this.x - min + 30, _this.headers)
        right = false
      }
      _this.lastX = event.x
      //var header = util.getListHeader(_this.x, _this.headers)

      if (header != _this.dragItem) {
        var index = _this.$store.state.headers.indexOf(header)
        if ((right && index < _this.index) || (!right && index > _this.index))
          return
        if (index > _this.index) {
          index -= 1
          _this.index = index + 1
        } else {
          _this.index = index
        }
        // 待替换为mutation
        _this.$store.commit({
          type: types.SWAP_HEADERITEMS,
          data: {
            item: _this.dragItem,
            index: index
          }
        })
      }
    }
    this.mouseup = function(event) {
      _this.dragging = false
      _this.dragItem.name = _this.dragName
      _this.dragItem.dragging = false
      util.setCookie('item_headers', JSON.stringify(_this.$store.state.headers))
      window.removeEventListener('mousemove', _this.mousemove)
      window.removeEventListener('mouseup', _this.mouseup)
    }
    this.resizeMove = function(event) {
      var newX = event.x
      _this.resizeItem.width = Math.max(70, _this.oldWidth + newX - _this.resizeX)
    }
    this.resizeUp = function(event) {
      _this.resizeItem = null
      util.setCookie('item_headers', JSON.stringify(_this.$store.state.headers))
      window.removeEventListener('mousemove', _this.resizeMove)
      window.removeEventListener('mouseup', _this.resizeUp)
    }
  },
  computed: {
    cheaders() {
      return this.$data.__headers
    },
    selectedAllSymbol() {
      return this.cheaders.every(item => item.checked)
    },
    headers() {
      return this.$store.state.headers.filter(item => item.checked)
    },
    headerWidth() {
      return this.headers.reduce((item1, item2) => {
          return {
            width: item1.width + item2.width
          }
        }).width + 121
    }
  }
}

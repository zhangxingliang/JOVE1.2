const mutations = {
  [types.SET_MATERIALS](state, payload) {
    if (payload.target.guid === 1 || payload.target.guid === 2) {
      payload.target.searchResult = payload.data
    } else if (payload.target.guid === -1) {
      payload.target.favorites = payload.data
    } else {
      payload.target.children = payload.data
    }
  },
  [types.TOGGLE_FOLDER](state, payload) {
    payload.target.open = !payload.target.open
  },
  [types.EXPAND_FOLDER](state, payload) {
    payload.target.open = true
  },
  [types.CLOSE_FOLDER](state, payload) {
    payload.target.open = false
  },
  [types.MOVE_MATERIALS](state, payload) {
    payload.data.forEach(item => {
      item.floor = payload.target.floor + 1
      item.father.children.remove(item)
      item.father = payload.target
      item.checked = false
      payload.target.children.push(item)
    })
  },
  [types.BACK_UP](state, payload) {
    var l = state.navPath.length
    if (l > 1) {
      var lastNode = state.navPath.splice(-1, 1)[0]
      lastNode.selected = false
      lastNode.checked = false
    }
    if (state.selectedNode) {
      state.selectedNode.checked = false
      state.selectedNode.selected = false
    }
    state.navPath[state.navPath.length - 1].selected = true
    state.navPath[state.navPath.length - 1].checked = true
    state.selectedNode = state.navPath[state.navPath.length - 1]
  },
  [types.GET_NAVPATH](state, payload) {
    if (state.navPath.length) {
      state.navPath[state.navPath.length - 1].selected = false
      state.navPath[state.navPath.length - 1].checked = false
    }
    if (state.selectedNode) {
      state.selectedNode.checked = false
      state.selectedNode.selected = false
    }
    payload.target.selected = true;
    payload.target.checked = true;
    state.selectedNode = payload.target
    state.navPath.length = 0 ;
    util.getHistories(payload.target, state.navPath);
    Vue.nextTick(() => {
      editor.initDrag()
    })
    var currentNode = state.navPath[state.navPath.length - 1]
    var width = $('#resourceList').width()
    state.thumbPadding = util.getPadding(width, 150, currentNode.children.length)
    if ([1, 2, -1].indexOf(currentNode.guid) > -1) {
      $(".advance_search").attr("disabled", "disabled").css("background-color", "#3e3e3e").addClass("transparentHover");
      $("#fullSearch").attr("disabled", "disabled").css("background-color", "#3e3e3e");
      $("#div_fullTextSearch").css("background-color", "#3e3e3e");
      $("#searchBtn").attr("disabled", "disabled");;
      $("#filterBtn").hide();
    } else {
      $(".advance_search").removeAttr("disabled").css("background-color", "#292929").removeClass("transparentHover");
      $("#fullSearch").removeAttr("disabled").css("background-color", "#292929");
      $("#div_fullTextSearch").css("background-color", "#292929");
      $("#searchBtn").removeAttr("disabled");
      $("#filterBtn").show();
    }
  },
  [types.SET_USERINFO](state, payload) {
    state.userInfo = payload.data
  },
  [types.SET_EDITOR](state, payload) {
    state.editor = payload.data
  },
  [types.GET_SEARCHMODEL](state, payload) {
    var newArr = []
    payload.data.forEach(item => {
      item.guid = 2
      item.searchResult = []
      item.floor = payload.target.floor + 1
      item.father = payload.target
      item.type = 'folder'
      item.selected = false
      item.children = []
      newArr.push(item)
    })
    payload.target.children = newArr
  },
  [types.PREVIEW_MATERIAL](state, payload) {
    state.previewUrl = payload.data
  },
  [types.ACTIVE_SVPLAYER](state, payload) {
    /*if (state.resourceBlockStatus) {
      state.svplayerStyle = {
        right: 0 + 'px'
      }*/
    state.editor.media.pause();
    state.svplayerStatus = true
  /*} else {
    state.svplayerStyle = {
      right: '860px'
    }
  }*/
  },
  [types.DISACTIVE_SVPLAYER](state, payload) {
    if (state.resourceBlockStatus) {
      state.svplayerStatus = false
      previewifm.blur()
      window.frames[0].postMessage({
        ep: "JOVE",
        operation: "pause"
      }, '*');
    } else {

    }
  },
  /*[types.MOVE_SVPLAYER](state, payload) {
    state.svplayerStyle = {
      right: 0 + 'px'
    }
  },
  [types.RESET_SVPLAYER](state, payload) {
    state.svplayerStyle = {
      right: '860px'
    }
  },
  [types.TOGGLE_RESOURCEBLOCKSTATUS](state, payload) {
    if (state.resourceBlockStatus) {
      state.svplayerStyle = {
        right: '860px'
      }
      state.svplayerStatus = true
    } else if (state.svplayerStatus) {
      state.svplayerStyle = {
        right: 0 + 'px'
      }
    }
    state.resourceBlockStatus = !state.resourceBlockStatus
  },*/
  [types.SET_ALWAYSGET](state, payload) {
    state.alwaysGet = payload.data
  },
  [types.SET_PREVIEWURL](state, payload) {
    state.previewUrl = payload.data
  },
  [types.SET_SAVEFOLDER](state, payload) {
    state.saveFolder.selected = false
    state.saveFolder = payload.source
    state.saveFolder.selected = true
  },
  [types.SET_ORDERTYPE](state, payload) {
    state.listOrder = payload.data
  },
  [types.SET_HEADERFILTER](state, payload) {
    state.headers.forEach((item, index) => {
      if (payload.data.indexOf(index) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    util.setCookie('item_headers', JSON.stringify(state.headers))
  },
  [types.SWAP_HEADERITEMS](state, payload) {
    state.headers.remove(payload.data.item)
    state.headers.splice(payload.data.index, 0, payload.data.item)
  },
  [types.SET_HEADERS](state, payload) {
    state.headers = payload.data
  },
  [types.ADD_FAVORITE](state, payload) {
    state.nodes.push({
      name: _language[_curLang].fav,
      selected: false,
      checked: false,
      open: false,
      guid: -1,
      path: _rootPath + '/' + _language[_curLang].fav,
      floor: 1,
      type: "folder",
      children: [],
      favorites: []
    })
  },
  [types.SET_SVMARKERS](state, payload) {
    state.svMarkerList = payload.data
  },
  [types.SET_THUMBPADDING](state, payload) {
    setTimeout(() => {
      var width = $('#resourceList').width()
      state.thumbPadding = util.getPadding(width, 150, state.navPath[state.navPath.length - 1].children.length)
    }, 300)
  },
  [types.NEXT_ITEM](state, payload) {
    var node = util.getNextItem(payload.source)
    if (state.selectedNode) {
      state.selectedNode.checked = false
      state.selectedNode.selected = false
    } else {
      state.navPath[state.navPath.length - 1].checked = false
      state.navPath[state.navPath.length - 1].selected = false
    }
    if (node) {
      state.selectedNode = node
    } else if (payload.source.guid === 1 && state.nodes.length > 2) {
      state.selectedNode = state.nodes[2]
    } else if (payload.source.guid !== -1) {
      state.selectedNode = state.nodes[1]
    }
    if (state.selectedNode) {
      state.selectedNode.checked = true
      state.selectedNode.selected = true
    }

  },
  [types.PREV_ITEM](state, payload) {
    var node = util.getPrevItem(payload.source)
    if (state.selectedNode) {
      state.selectedNode.checked = false
      state.selectedNode.selected = false
    } else {
      state.navPath[state.navPath.length - 1].checked = false
      state.navPath[state.navPath.length - 1].selected = false
    }
    if (node) {
      state.selectedNode = node
    } else if (payload.source.guid === -1) {
      state.selectedNode = util.getLastItem(state.nodes[1])
    } else if (payload.source.guid === 1) {
      state.selectedNode = util.getLastItem(state.nodes[0])
    }
    if (state.selectedNode) {
      state.selectedNode.checked = true
      state.selectedNode.selected = true
    }

  },
}

const mutations = {
  [types.SET_MATERIALS](state, payload) {
    if (payload.target.guid === 1 || payload.target.guid === 2) {
      payload.target.favorites = payload.data
    } else if (payload.target.guid === -1) {
      payload.target.searchResult = payload.data
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
      state.navPath.splice(-1, 1)[0].selected = false
    }
    state.histories[state.histories.length - 1].selected = true
  },
  [types.GET_NAVPATH](state, payload) {
    if (state.navPath.length) {
      state.navPath[state.navPath.length - 1].selected = false;
    }
    payload.target.selected = true;
    state.navPath.length = 0 ;
    util.getHistories(payload.target, state.navPath);
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
    if (state.resourceBlockStatus) {
      state.svplayerStyle = {
        right: 0 + 'px'
      }
      state.editor.media.pause();
      state.svplayerStatus = true
    } else {
      state.svplayerStyle = {
        right: '860px'
      }
    }
  },
  [types.DISACTIVE_SVPLAYER](state, payload) {
    if (state.resourceBlockStatus) {
      state.svplayerStatus = false
      window.frames[0].postMessage({
        ep: "JOVE",
        operation: "pause"
      }, '*');
    } else {

    }
  },
  [types.MOVE_SVPLAYER](state, payload) {
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
  },
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
}

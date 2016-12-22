const actions = {
  [types.GET_MATERIALS](context, payload) {
    if (payload.source.children.length > 0 && !context.state.alwaysGet) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      var URL = util.getUrl('Cm/GetClipList', {
        siteCode: _siteCode
      })
      return new Promise((resolve, reject) => {
        axios.post(URL, {
          usertoken: _userToken,
          path: payload.source.path
        }).then(res => {
          context.commit({
            type: types.SET_MATERIALS,
            target: payload.source,
            data: util.parseData(res.data, payload.source)
          })
          resolve()
        })
      })
    }
  },
  [types.GET_MATERIALS2](context, payload) {
    if (payload.source.children.length > 0) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    } else {
      var URL = util.getUrl('Cm/GetClipList', {
        siteCode: _siteCode
      })
      return new Promise((resolve, reject) => {
        axios.post(URL, {
          usertoken: _userToken,
          path: payload.source.path
        }).then(res => {
          context.commit({
            type: types.SET_MATERIALS,
            target: payload.source,
            data: util.parseData(res.data, payload.source)
          })
          resolve()
        })
      })
    }
  },
  [types.TOGGLE_FOLDER](context, payload) {
    if (payload.source.guid === 1) {
      context.dispatch({
        type: types.GET_SEARCHMODEL,
        source: payload.source
      }).then(() => {
        context.commit({
          type: types.TOGGLE_FOLDER,
          target: payload.source
        })
      })
    } else if (payload.source.guid === 2) {

    } else if (payload.source.guid === -1) {

    } else {
      context.dispatch({
        type: types.GET_MATERIALS,
        source: payload.source
      }).then(() => {
        context.commit({
          type: types.TOGGLE_FOLDER,
          target: payload.source
        })
      })
    }
  },
  [types.EXPAND_FOLDER](context, payload) {
    context.dispatch({
      type: types.GET_MATERIALS,
      source: payload.source
    })
    context.commit({
      type: types.EXPAND_FOLDER,
      target: payload.source
    })
  },
  [types.UPLOAD_FILES](context, payload) {},
  [types.MOVE_MATERIALS](context, payload) {
    context.commit({
      type: types.MOVE_MATERIALS,
      data: payload.data,
      target: payload.target
    })
  },
  [types.BACK_UP](context, payload) {
    context.commit({
      type: types.BACK_UP
    })
  },
  [types.LOGIN](context, payload) {
    var URL = util.getUrl('Cm/Login', {
      usertoken: _userToken,
      siteCode: _siteCode
    })
    return new Promise((resolve, reject) => {
      axios.get(URL).then(res => {
        if (res.data.Code === '0') {
          context.commit({
            type: types.SET_USERINFO,
            data: res.data.Ext
          })
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  [types.GET_OBJECT_INFO](context, payload) {
    var URL = util.getUrl('Cm/GetClipInfo', {
      usertoken: _userToken,
      contentid: payload.data.clipid,
      objecttype: payload.data.sourceid,
      siteCode: _siteCode
    })
    return new Promise((resolve, reject) => {
      axios.get(URL).then(res => {
        resolve(res)
      })
    })
  },
  [types.GET_FORMATE_INFO](context, payload) {
    var URL = util.getUrl('Cm/GetDragedClipInfo', {
      usertoken: _userToken,
      contentid: payload.data.clipid,
      objecttype: payload.data.sourceid,
      siteCode: _siteCode
    })
    return new Promise((resolve, reject) => {
      axios.get(URL).then(res => {
        resolve(res)
      })
    })
  },
  [types.GET_TIMELINE](context, payload) {
    var URL = util.getUrl('Cm/GetTimeLine', {
      usertoken: _userToken,
      contentid: payload.data,
      siteCode: siteCode
    })
    return new Promise((resolve, reject) => {
      axios.get(URL).then(res => {
        resolve(res)
      })
    })
  },
  [types.GET_SEARCHMODEL](context, payload) {
    var URL = util.getUrl(golbalSetting.CM + "/Handler/MaterialList.ashx")
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "post",
        url: URL,
        data: {
          OperationType: "GetSearchResult",
          usertoken: _userToken,
          loginname: context.state.userInfo.loginName
        },
        dataType: "json",
        async: true,
        complete: function() {},
        success: function(data) {
          if (data.R) {
            context.commit({
              type: types.GET_SEARCHMODEL,
              target: payload.source,
              data: data.R
            })
            resolve()
          }
        }
      })
    })
  },
  [types.GET_SEARCHRESULT](context, payload) {
    var URL = util.getUrl(golbalSetting.CM + "/Handler/MaterialList.ashx")
    var model = JSON.parse(decodeURIComponent($.base64.decode(payload.source.data)));
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "post",
        url: URL,
        data: model,
        dataType: "json",
        async: true,
        complete: function() {},
        success: function(data) {
          if (data.R) {
            var data = JSON.parse(data.R);
            context.commit({
              type: types.SET_MATERIALS,
              target: payload.source,
              data: util.parseData(data.ext, payload.source, model.searchType)
            })
            resolve()
          }
        }
      })
    })
  },
  [types.PREVIEW_MATERIAL](context, payload) {
    context.commit({
      type: types.SET_PREVIEWURL,
      data: url
    })
  },
  [types.REFRESH_MATERIAL](context, payload) {
    var URL = util.getUrl('Cm/GetClipList')
    return new Promise((resolve, reject) => {
      axios.post(URL, {
        usertoken: _userToken,
        path: payload.source.path,
        siteCode: _siteCode
      }).then(res => {
        context.commit({
          type: types.SET_MATERIALS,
          target: payload.source,
          data: util.parseData(res.data, payload.source)
        })
        resolve()
      })
    })
  },
  [types.UPDATE_MATERIALS](context, payload) {
    var tarr = payload.data.type.split('.')
    if (tarr[2] === 'UPDATE') {
      util.updateMaterial(context.state.nodes, payload.data)
    } else if (tarr[2] == 'CREATE' || tarr[2] == 'RECOVERED') {
      util.getMaterialFoder(context.state.nodes, payload.data).then(res => {
        context.dispatch({
          type: types.REFRESH_MATERIAL,
          source: res
        })
      })
    } else if (tarr[2] == 'RECYCLED' || tarr[2] == 'MOVED') {
      util.deleteMaterial(context.state.nodes, payload.data)
    }
  },
  [types.GET_FAVORITERESULT](context, payload) {
    var URL = util.getUrl('Cm/GetFavoriteObject', {
      usertoken: _userToken,
      usercode: context.state.userInfo.userCode,
      siteCode: _siteCode
    })
    return new Promise((resolve, reject) => {
      axios.get(URL).then(res => {
        context.commit({
          type: types.SET_MATERIALS,
          target: payload.source,
          data: util.parseData(res.data, payload.source)
        })
        resolve()
      })
    })
  }
}

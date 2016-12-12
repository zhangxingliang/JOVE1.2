const actions = {
  [types.GET_MATERIALS](context, payload){
    // http get then commit if need
    if(payload.source.children.length > 0 && !context.state.alwaysGet){
      return new Promise((resolve, reject)=>{
        resolve()
      })
    }
    else {
      var URL = util.getUrl('Cm/GetClipList')
      return new Promise((resolve, reject)=>{
        axios.post(URL, {
          usertoken : _userToken,
          path : payload.source.path
        }).then(res=>{
          context.commit({
              type : types.SET_MATERIALS,
              target : payload.source,
              data : util.parseData(res.data, payload.source)
            })
          resolve()
        })
      })
      // success commit  fail alert
    }
  },
  [types.TOGGLE_FOLDER](context, payload){
    context.dispatch({
      type : types.GET_MATERIALS,
      source : payload.source
    })
    context.commit({
      type : types.TOGGLE_FOLDER,
      target : payload.source
    })
  },
  [types.EXPAND_FOLDER](context, payload){
    context.dispatch({
      type : types.GET_MATERIALS,
      source : payload.source
    })
    context.commit({
      type : types.EXPAND_FOLDER,
      target : payload.source
    })
  },
  [types.UPLOAD_FILES](context, payload){

  },
  [types.MOVE_MATERIALS](context, payload){
    context.commit({
      type : types.MOVE_MATERIALS,
      data : payload.data,
      target : payload.target
    })
  },
  [types.BACK_UP](context, payload){
    context.commit({
      type : types.BACK_UP
    })
  },
  [types.LOGIN](context, payload){
    var URL = util.getUrl('Cm/Login', {
      usertoken : _userToken
    })
    return new Promise((resolve, reject)=>{
      axios.get(URL).then(res=>{
        context.commit({
          type : types.SET_USERINFO,
          data : res.data.Ext
        })
        resolve()
      })
    })
  },
  [types.GET_OBJECT_INFO](context, payload){
    var URL = util.getUrl('Cm/GetClipInfo', {
        usertoken : _userToken,
        contentid : payload.data.clipid,
        objecttype : payload.data.sourceid
    })
    return new Promise((resolve, reject)=>{
      axios.get(URL).then(res=>{
        resolve(res)
      })
    })
  },
  [types.GET_FORMATE_INFO](context, payload){
    var URL = util.getUrl('Cm/GetDragedClipInfo', {
        usertoken : _userToken,
        contentid : payload.data.clipid,
        objecttype : payload.data.sourceid
    })
    return new Promise((resolve, reject)=>{
      axios.get(URL).then(res=>{
        resolve(res)
      })
    })
  },
  [types.GET_TIMELINE](context, payload){
    var URL = util.getUrl('Cm/GetTimeLine', {
        usertoken : _userToken,
        contentid : payload.data,
    })
    return new Promise((resolve, reject)=>{
      axios.get(URL).then(res=>{
        resolve(res)
      })
    })
  },
  [types.GET_SEARCHMODEL](context, payload){
    var URL = util.getUrl(golbalSetting.CM + "/Handler/MaterialList.ashx")
    return new Promise((resolve, reject)=>{
      $.ajax({
        type: "post",
        url: URL,
        data: { OperationType: "GetSearchResult", usertoken: _userToken, loginname: context.state.userInfo.loginName },
        dataType: "json",
        async: true,
        complete: function () { },
        success: function (data) {
          if (data.R) {
            context.commit({
                type : types.GET_SEARCHMODEL,
                target : payload.source,
                data : data.R
              })
            resolve()
          }
        }
      })
    })
  },
  [types.GET_SEARCHRESULT](context, payload){
    var URL = util.getUrl(golbalSetting.CM + "/Handler/MaterialList.ashx")
    var data = {
      OperationType : 'GetSearchResult',
      usertoken : _userToken,
      username : context.state.userInfo.userName,
    }
    return new Promise((resolve, reject)=>{
      axios.post(URL, data).then(res=>{
        resolve(res)
      })
    })
  },
  [types.GET_SEARCHRESULT](context, payload){
    var URL = util.getUrl(golbalSetting.CM + "/Handler/MaterialList.ashx")
    var model = JSON.parse(decodeURIComponent($.base64.decode(payload.source.data)));
    return new Promise((resolve, reject)=>{
      $.ajax({
        type: "post",
        url: URL,
        data: model,
        dataType: "json",
        async: true,
        complete: function () { },
        success: function (data) {
          if (data.R) {
            var data = JSON.parse(data.R);
            context.commit({
                type : types.SET_MATERIALS,
                target : payload.source,
                data : util.parseData(data.ext, payload.source, model.searchType)
              })
            resolve()
          }
        }
      })
    })
  },
  [types.PREVIEW_MATERIAL](context, payload){
    context.commit({
      type : types.SET_PREVIEWURL,
      data : url
    })
  },
  [types.REFRESH_MATERIAL](context, payload){
    var URL = util.getUrl('Cm/GetClipList')
    return new Promise((resolve, reject)=>{
      axios.post(URL, {
        usertoken : _userToken,
        path : context.getters.currentNode.path
      }).then(res=>{
        context.commit({
            type : types.SET_MATERIALS,
            target : context.getters.currentNode,
            data : util.parseData(res.data, context.getters.currentNode)
          })
        resolve()
      })
    })
  },
  [types.CLIP_MATERIALS](context, payload){

  }
}

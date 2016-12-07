const actions = {
  [types.GET_MATERIALS](context, payload){
    // http get then commit if need
    if(payload.source.children.length > 0){
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
  [types.LOCATE_FOLDER](context, payload){

  },
  [types.CLIP_MATERIALS](context, payload){

  },
}

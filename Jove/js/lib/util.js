Array.prototype.remove = function(item){
  var idx = this.indexOf(item)
  if(idx > -1){
      this.splice(idx, 1)
  }
  return idx
}
Array.prototype.groupBy = function(attr){
  var newArrObj = {}
  this.forEach(item=>{
    var objAttr = attr + '_' + item[attr]
    if(newArrObj[objAttr]){
      newArrObj[objAttr].push(item)
    }
    else {
      newArrObj[objAttr] = []
      newArrObj[objAttr].push(item)
    }
  })
  var newArr = []
  for(let i in newArrObj){
    newArr.push(newArrObj[i])
  }
  return newArr
}
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(), //day
        'h+': this.getHours(), //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
        'S': this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return format
}
Array.prototype.unique = function () {
    var n = {}, r = [];
    for (var i = 0; i < this.length; i++) {
        if (!n[this[i]]) {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
}
String.prototype.formatDate = function(){
  var sec = this.match(/\d+/g)
  var dt = new Date()
  dt.setTime(sec)
  return dt.getFullYear() + '-' + (dt.getMonth() + 1).fixZero() + '-' + dt.getDate().fixZero() + ' ' + dt.getHours().fixZero() + ':' + dt.getMinutes().fixZero() + ':' + dt.getSeconds().fixZero()
}
Number.prototype.fixZero = function(){
  if(/\^d{1}$/.test(this)){
    return '0' + this
  }
  return this
}
String.prototype.fixZero = function(){
  if(/\^d{1}$/.test(this)){
    return '0' + this
  }
  return this
}
const util = {
  isArray: function(arr){
    return Object.prototype.toString.call(arr) === '[object Array]'
  },
  getHistories: function(node, arr){
    arr.unshift(node)
    if(node.father){
      util.getHistories(node.father, arr)
    }
  },
  deselectAllItems: function(items){
    util.isArray(items)&&items.forEach(item=>{
      item.checked = false
    })
  },
  getOperations: function(items){

  },
  sortBy: function(arr, type, symbol){
    if(type === 'title'){
      var folderArr = arr.filter(item=>{
        if(item.type === 'folder')return item
      })
      var otherArr = arr.filter(item=>{
        if(item.type !== 'folder')return item
      })
      if(symbol){
        arr = folderArr.sort(SortLikeWin).concat(otherArr.sort(SortLikeWin))
      }
      else{
        arr = folderArr.sort(SortLikeWin).concat(otherArr.sort(SortLikeWin)).reverse()
      }
      return arr
    }
    else if(type === 'createTime'){
      var folderArr = arr.filter(item=>{
        if(item.type === 'folder')return item
      })
      var otherArr = arr.filter(item=>{
        if(item.type !== 'folder')return item
      })
      if(symbol){
        arr = folderArr.sort((item1,item2)=>{
          return item1.createdate - item2.createdate
        }).concat(otherArr.sort((item1,item2)=>{
          return item1.createdate - item2.createdate
        }))
      }
      else{
        arr = folderArr.sort((item1,item2)=>{
          return item1.createdate - item2.createdate
        }).concat(otherArr.sort((item1,item2)=>{
          return item1.createdate - item2.createdate
        })).reverse()
      }
      return arr
    }
    else {
      if(symbol){
        arr.sort((item1,item2)=>{
          return item1.typeIndex - item2.typeIndex
        })
      }
      else{
        arr.sort((item1,item2)=>{
          return item1.typeIndex - item2.typeIndex
        }).reverse()
      }
      var  groupedArr  = arr.groupBy('typeIndex')
      var newArr = []
      groupedArr.forEach(item=>{
        newArr = newArr.concat(item.sort(SortLikeWin))
      })
      return newArr
    }

  },
  getIconFilename: function(iconfilename) {
      var _iconfilename = ''
      if (iconfilename) {
          _iconfilename = iconfilename.replace(/\\/g, '/')
          _iconfilename = _iconfilename.replace(':', '').split('\\').join('/')
          if (_iconfilename.indexOf('bucket-') >= 0) {
              if (_iconfilename.indexOf('bucket-') != _iconfilename.lastIndexOf('bucket-')) {
                  _iconfilename = _iconfilename.substring(_iconfilename.lastIndexOf('bucket-') + 7)
              }
              else {
                  _iconfilename = _iconfilename.substring(_iconfilename.indexOf('bucket-') + 7)
              }

          }

          if (_iconfilename.length == 0) {
              _iconfilename = '/images/nostamp.png'
          } else {
              _iconfilename = _resourceUrl + _iconfilename
          }
      }
      return _iconfilename
  },
  throttle: function(delay, action, immediately){
    var last = 0
    return function(){
      if(last === 0 && immediately){
        action.apply(this, arguments)
      }
      var curr = +new Date()
      if (curr - last > delay){
        action.apply(this, arguments)
        last = curr
      }
    }
  },
  frameToTime: function(frame, frameRate){
    var h, m, s, f
    f = (Math.round(frame % frameRate)).fixZero()
    h = (Math.floor(frame / (frameRate * 60 * 60))).fixZero()
    m = (Math.floor(frame / (frameRate * 60)) % 60).fixZero()
    s = (Math.floor(frame / (frameRate)) % 60).fixZero()
    return h +':' + m + ':' + s + '.' + f
  },
  parseData: function(arr, father, option){
    var newArr = []
    if(option === 'marker'){
      var marklist = arr
      var framerate = 25.0
      marklist.forEach((item, index)=>{
          if (item.color) {
              var RedColor = (item.color & 0x0000ff)
              var Gcolor = ((item.color & 0x00ff00) >> 8)
              var Bcolor = ((item.color & 0xff0000) >> 16)
              item.bgcolor = { background: 'rgb(' + RedColor + ',' + Gcolor + ',' + Bcolor + ')' }
          }
          else {

          }
          if (item.type == '4') {
              item.typeName = 'Scene Mark'
              item.flag = 'smarker'
              item.isSMarker = true
              item.inPoint = util.frameToTime(item.keyframe, framerate)
              item.outPoint = util.frameToTime(item.endkeyframe, framerate)
              item.name = '4'
              item.color = 'rgb(100,100,100)'
              item.time = item.keyframe / framerate
              item.guid = new Date().getTime() + index
              item.text = item.note
              item.intime = item.keyframe / framerate
              item.outtime = item.endkeyframe / framerate
          }
          else if (item.type == '8') {
              item.typeName = 'Esscene Mark'
              item.flag = 'emarker'
              item.pos = util.frameToTime(item.keyframe, framerate)
              item.name = '5'
              item.color = 'rgb(150,150,100)'
              item.time = item.keyframe / framerate
              item.guid = new Date().getTime() + index
              item.text = item.note
          }
          else if (item.type == '65536') {
              item.typeName = 'Logging Mark'
              item.flag = 'lmarker'
              item.pos = util.frameToTime(item.keyframe, framerate)
              item.name = '6'
              item.color = 'rgb(150,100,150)'
              item.time = item.keyframe / framerate
              item.guid = new Date().getTime() + index
              item.text = item.note
          }
          else if (item.type == '131072') {
              item.typeName = 'Change Mark'
              item.flag = 'cmarker'
              item.pos = util.frameToTime(item.keyframe, framerate)
              item.name = '7'
              item.color = 'rgb(250,150,200)'
              item.time = item.keyframe / framerate
              item.guid = new Date().getTime() + index
              item.text = item.note
          }
          item.name = item.note
          item.iconfilename = util.getIconFilename(item.iconfilename)
          item.type = "marker"
          newArr.push(item);
      })
    }
    else{
      var floor = 0
      if(father){
        floor = father.floor + 1
      }
      if(util.isArray(arr)){
        arr.forEach(item=>{
          var node = {}
          node.formatDate = item.entity.createdate.formatDate()
          node.createdate = item.entity.createdate.match(/\d+/g).join('')
          node.typeid = item.entity.type
          node.type = util.getMaterialType(item.entity)
          if(node.type === 'audio'){
            node.type = 'video'
            node.bgtype = 'audiobg'
            node.isAudio = 'true'
          }
          else{
            node.bgtype = node.type + 'bg'
            node.isAudio = 'false'
            if(node.type === 'folder'){
              node.path = item.entity.folderpath + '/' + item.entity.name
              node.typeIndex = 0
            }
            else if(node.type === 'video'){
              node.typeIndex = 1
              node.channel = 2
            }
            else if(node.type === 'h5pgm'){
              node.typeIndex = 3
            }
            else if(node.type === 'image'){
              node.typeIndex = 4
            }
            else if(node.type === 'txtfile'){
              node.typeIndex = 5
            }
            else if(node.type === 'word'){
              node.typeIndex = 6
            }
            else if(node.type === 'ppt'){
              node.typeIndex = 7
            }
            else if(node.type === 'excel'){
              node.typeIndex = 8
            }
            else if(node.type === 'pdf'){
              node.typeIndex = 9
            }
            else{
              node.typeIndex = 10
            }
          }
          node.duration = 10
          node.folderpath = item.entity.folderpath
          node.guid = item.entity.guid
          node.id = item.entity.id
          node.name = item.entity.name
          node.iconfilename = item.entity.iconfilename ? util.getIconFilename(item.entity.iconfilename) : './images/nostamp.png'
          node.subtype = item.entity.subtype
          try{
            if(node.type === 'video'){
              if(item.entity.item){
                node.duration = item.entity.item.length / 10000000
                if((item.entity.item.filestatus & FileStatus.ET_Obj_FS_HA_ALL) > 0 || (item.entity.item.filestatus & FileStatus.ET_Obj_FS_HV_ALL) > 0){
                  node.HQ = true
                }
                if((item.entity.item.filestatus & FileStatus.ET_Obj_FS_LV_ALL) > 0 || (item.entity.item.filestatus & FileStatus.ET_Obj_FS_LA_ALL) > 0){
                  node.LQ = true
                }
                if(node.typeIndex === 1){
                  if ([1, 2, 64, 128, 65536, 8192].indexOf(item.entity.item.filestatus) > -1){
                    node.clipping = true
                  }
                  if(item.entity.item.filestatus & FileStatus.ET_Obj_FS_WA){
                    node.WA = true
                  }
                  if(item.entity.item.dbestreamchannel && item.entity.item.dbestreamchannel != 0){
                    node.DB = true
                  }
                  if(item.entity.item.videostandard && ETGetVideoStandardPI(item.entity.item.videostandard) == 2){
                    node.P = true
                    node.Ptitle = ETGetFrameRate(item.entity.item.videostandard)
                  }
                  else if(item.entity.item.videostandard && ETGetVideoStandardPI(item.entity.item.videostandard) == 1){
                    node.I = true
                    node.Ititle = ETGetFrameRate(item.entity.item.videostandard)
                  }
                  if((item.entity.item.filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_HA_SEG | FileStatus.ET_Obj_FS_LA_SEG)) == 0){
                    node.channel = 1
                  }
                }
              }
            }
          }
          catch(e){

          }
          node.floor = floor
          node.selected = false
          node.father = father
          node.open = false
          node.children = []
          newArr.push(node)
        })
        //may sort filter by option
      }
      else{
        newArr = []
      }
    }

    return newArr
  },
  getMaterialType: function(material){
    var ctype = 'other'
    if (material.type == 16) {
      ctype = 'folder'
    }
    else {
      ctype = 'file';
      if (material.type == 32) {
        switch (material.subtype) {
          case 0x01:
          case 0x02:
          case 1024:
          case 512:
          case 2048:
            ctype = 'video'
            break
          case 0x0004:
            ctype = 'audio'
            break;
          case 0x002000:
            ctype = 'txtfile'
            break
          case 0x004000:
            ctype = 'word'
            break;
          case 0x008000:
            ctype = 'ppt'
            break
          case 0x010000:
            ctype = 'excel'
            break
          case 0x040000:
            ctype = 'pdf'
            break
          case 0x000020:
            ctype = 'image'
            break
          case 0x10000000:
            ctype = 'rar'
            break
        }
      }
      else if (material.type == 0x40) {
        if (material.subtype == 1) {
          ctype = 'sequence'
        }
        else if (material.subtype == 3 || material.subtype == 2 || material.subtype == 4) {
          ctype = 'h5pgm'
        }
      }
      else if (material.type == 0x80000) {
        ctype = 'log'
      }
      else if (material.type == 0 && material.subtype == 0) {
        ctype = 'rar'
      }
    }
      return ctype
  },
  getUrl: function(url, par) {
    if (par) {
        var q = ''
        if (url.indexOf('?') >= 0) {
            q = '&'
        } else {
            q = '?'
        }

        for (var k in par) {
            if (typeof par[k] === 'undefined') {
                continue;
            }
            if (q.length > 1) {
                q += '&'
            }
            q = q + k + '=' + encodeURIComponent(par[k])
        }

        url = url + q
    }
    return url
  },
  alert: function (Dialog, title, content, style, button) {
    var dialog = new Dialog({
                            title: title,
                            content: content,
                            style: style,
                            button: button
                          })
    dialog.open()
  },
  locateFolder: function(store, folderList, fNode){
    if(folderList.length == 0){
      store.commit({
        type : types.GET_NAVPATH,
        target :  fNode,
        data : []
      })
    }
    else{
      var folderName = folderList[0]
      var folder = fNode.children.filter(item=>item.name === folderName && item.type === 'folder')[0]
      if(folder){
        store.dispatch({
          type : types.GET_MATERIALS,
          source : folder
        }).then(()=>{
          store.commit({
            type : types.EXPAND_FOLDER,
            target : folder
          })
          folderList.shift()
          util.locateFolder(store, folderList, folder)
        })
      }
    }
  }
}
function SortLikeWin(str1, str2) {
    var a = str1.name.toUpperCase();
    var b = str2.name.toUpperCase();
    var reg = /[0-9]+/g;
    var lista = a.match(reg);
    var listb = b.match(reg);
    if (!lista || !listb) {
        return CommonCompare(a, b);
    }
    for (var i = 0, minLen = Math.min(lista.length, listb.length) ; i < minLen; i++) {
        //数字所在位置序号
        var indexa = a.indexOf(lista[i]);
        var indexb = b.indexOf(listb[i]);
        //数字前面的前缀
        var prefixa = a.substring(0, indexa);
        var prefixb = b.substring(0, indexb);
        //数字的string
        var stra = lista[i];
        var strb = listb[i];
        //数字的值
        var numa = parseInt(stra);
        var numb = parseInt(strb);
        //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
        if (indexa != indexb || prefixa != prefixb) {
            return CommonCompare(a, b);
        }
        else {
            //数字的string全等
            if (stra === strb) {
                //如果是最后一个数字，比较数字的后缀
                if (i == minLen - 1) {
                    return CommonCompare(a.substring(indexa+1), b.substring(indexb+1));
                }
                //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
                else {
                    a = a.substring(indexa + stra.length);
                    b = b.substring(indexa + stra.length);
                }
            }
                //如果数字的string不全等，但值相等
            else if (numa == numb) {
                //直接比较数字前缀0的个数，多的更小
                return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
            }
            else {
                //如果数字不等，直接比较数字大小
                return numa - numb;
            }
        }
    }
}
function CommonCompare(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a.length == 0 || b.length == 0) {
        return a < b ? -1 : 1;
    }
    var reg = /[^\u2E80-\u9FFF\d+a-zA-Z]/g;//匹配特殊字符
    var lista = a.match(reg);
    var listb = b.match(reg);
    if (!lista || !listb) {
        if (!lista && !listb) {
            return ZHCompare(a, b)//a < b ? -1 : 1;
        }
        else if (!lista && listb) {//a没匹配到特殊字符，b匹配到了
            var index = b.indexOf(listb[0]);
            var prefixa = a.substring(0, index);
            var prefixb = b.substring(0, index);
            if (prefixa != prefixb) {
                return ZHCompare(prefixa, prefixb);//prefixa < prefixb ? -1 : 1;//不考虑数字
            }
            else {
                return !a[index]? -1 : a[index] < b[index]? -1 : 1;//如果a的index位置为undefined，则返回-1,否则比较abindex位置的值
            }
        }
        else {//b没匹配到特殊字符，a匹配到了
            var index = a.indexOf(lista[0]);
            var prefixa = a.substring(0, index);
            var prefixb = b.substring(0, index);
            if (prefixa != prefixb) {
                return ZHCompare(prefixa, prefixb);//prefixa < prefixb ? -1 : 1;//不考虑数字
            }
            else {
                return !b[index] ? 1 : a[index] < b[index] ? -1 : 1;//如果b的index位置为undefined，则返回1,即有特殊字符的a大于没特殊字符且index位置为undefined的b，否则比较a，b，index位置的值
            }
        }
    }
    else {
        for (var i = 0, minLen = Math.min(lista.length, listb.length) ; i < minLen; i++) {
            //字符所在位置序号
            var indexa = a.indexOf(lista[i]);
            var indexb = b.indexOf(listb[i]);
            //字符前面的前缀
            var prefixa = a.substring(0, indexa);
            var prefixb = b.substring(0, indexb);
            //字符的string
            var stra = lista[i];
            var strb = listb[i];
            //如果字符的序号不等或前缀不等，属于前缀不同的情况，直接比较
            if (indexa !== indexb || prefixa !== prefixb) {
                return ZHCompare(prefixa, prefixb);//prefixa < prefixb ? -1 : 1;//不考虑数字
            }
            else {
                if (stra === strb) {
                    //如果是最后一个字符，比较字符的后缀
                    if (i == minLen - 1) {
                        return CommonCompare(a.substring(indexa+1), b.substring(indexb+1));
                    }
                    else {
                        a = a.substring(indexa + stra.length);
                        b = b.substring(indexa + stra.length);
                    }
                }
                else {
                    return ZHCompare(stra, strb);//stra < strb ? -1 : 1;
                }
            }
        }
    }
}
function ZHCompare(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a.length == 0 || b.length == 0) {
        return a < b ? -1 : 1;
    }
    var reg = /[\u2E80-\u9FFF]/g; //匹配中文
    var lista = a.match(reg);
    var listb = b.match(reg);
    if (!lista || !listb) {
        return a < b ? -1 : 1;
    }
    else {//a b 都包含中文
        for (var i = 0, minLen = Math.min(lista.length, listb.length) ; i < minLen; i++) {
            //中文所在位置序号
            var indexa = a.indexOf(lista[i]);
            var indexb = b.indexOf(listb[i]);
            //中文前面的前缀
            var prefixa = a.substring(0, indexa);
            var prefixb = b.substring(0, indexb);
            //中文
            var stra = lista[i];
            var strb = listb[i];

            //如果中文的序号不等或前缀不等，属于前缀不同的情况，直接比较
            if (indexa != indexb || prefixa != prefixb) {
                return prefixa < prefixb ? -1 : 1;
            }
            else {
                //中文全等
                if (stra === strb) {
                    //如果是最后一个数字，比较数字的后缀
                    if (i == minLen - 1) {
                        return a.substring(indexa + 1) < b.substring(indexb + 1) ? -1 : 1;
                    }
                        //如果不是最后一个中文，则循环跳转到下一个中文，并去掉前面相同的部分
                    else {
                        a = a.substring(indexa + stra.length);
                        b = b.substring(indexa + stra.length);
                    }
                }
                else {
                    //如果中文不等，直接比较中文大小
                    return stra.localeCompare(strb);
                }
            }
        }
    }
}

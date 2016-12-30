Array.prototype.remove = function(item) {
  var idx = this.indexOf(item)
  if (idx > -1) {
    this.splice(idx, 1)
  }
  return idx
}
Array.prototype.groupBy = function(attr) {
  var newArrObj = {}
  this.forEach(item => {
    var objAttr = attr + '_' + item[attr]
    if (newArrObj[objAttr]) {
      newArrObj[objAttr].push(item)
    } else {
      newArrObj[objAttr] = []
      newArrObj[objAttr].push(item)
    }
  })
  var newArr = []
  for (let i in newArrObj) {
    newArr.push(newArrObj[i])
  }
  return newArr
}
Date.prototype.format = function(format) {
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    'S': this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return format
}
Array.prototype.unique = function() {
  var n = {},
    r = [];
  for (var i = 0; i < this.length; i++) {
    if (!n[this[i]]) {
      n[this[i]] = true;
      r.push(this[i]);
    }
  }
  return r;
}
String.prototype.formatDate = function() {
  if (/:/g.test(this)) return this.replace('/["\']/g', '')
  var sec = this.match(/\d+/g)
  var dt = new Date()
  dt.setTime(sec)
  return dt.getFullYear() + '-' + (dt.getMonth() + 1).fixZero() + '-' + dt.getDate().fixZero() + ' ' + dt.getHours().fixZero() + ':' + dt.getMinutes().fixZero() + ':' + dt.getSeconds().fixZero()
}
Number.prototype.fixZero = function() {
  if (/\^d{1}$/.test(this)) {
    return '0' + this
  }
  return this
}
String.prototype.fixZero = function() {
  if (/\^d{1}$/.test(this)) {
    return '0' + this
  }
  return this
}
const util = {
  isArray: function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  },
  getHistories: function(node, arr) {
    arr.unshift(node)
    if (node.father) {
      util.getHistories(node.father, arr)
    }
  },
  deselectAllItems: function(items) {
    util.isArray(items) && items.forEach(item => {
      item.checked = false
    })
  },
  getOperations: function(items) {},
  sortBy: function(arr, type, symbol) {
    if (type === 'title') {
      var folderArr = arr.filter(item => {
        if (item.type === 'folder') return item
      })
      var otherArr = arr.filter(item => {
        if (item.type !== 'folder') return item
      })
      if (symbol) {
        arr = folderArr.sort(SortLikeWin).concat(otherArr.sort(SortLikeWin))
      } else {
        arr = folderArr.sort(SortLikeWin).concat(otherArr.sort(SortLikeWin)).reverse()
      }
      return arr
    } else if (type === 'createTime') {
      var folderArr = arr.filter(item => {
        if (item.type === 'folder') return item
      })
      var otherArr = arr.filter(item => {
        if (item.type !== 'folder') return item
      })
      if (symbol) {
        arr = folderArr.sort((item1, item2) => {
          return item1.createdate - item2.createdate
        }).concat(otherArr.sort((item1, item2) => {
          return item1.createdate - item2.createdate
        }))
      } else {
        arr = folderArr.sort((item1, item2) => {
          return item1.createdate - item2.createdate
        }).concat(otherArr.sort((item1, item2) => {
          return item1.createdate - item2.createdate
        })).reverse()
      }
      return arr
    } else if (type === 'type') {
      if (symbol) {
        arr.sort((item1, item2) => {
          return item1.typeIndex - item2.typeIndex
        })
      } else {
        arr.sort((item1, item2) => {
          return item1.typeIndex - item2.typeIndex
        }).reverse()
      }
      var groupedArr = arr.groupBy('typeIndex')
      var newArr = []
      groupedArr.forEach(item => {
        newArr = newArr.concat(item.sort(SortLikeWin))
      })
      return newArr
    } else {
      var sortFunc = sortLikeWinBy(type)
      var folderArr = arr.filter(item => {
        if (item.type === 'folder') return item
      })
      var otherArr = arr.filter(item => {
        if (item.type !== 'folder') return item
      })
      if (symbol) {
        arr = folderArr.sort(sortFunc).concat(otherArr.sort(sortFunc))
      } else {
        arr = folderArr.sort(sortFunc).concat(otherArr.sort(sortFunc)).reverse()
      }
      return arr
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
        } else {
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
  throttle: function(delay, action, immediately) {
    var last = 0
    return function() {
      if (last === 0 && immediately) {
        action.apply(this, arguments)
      }
      var curr = +new Date()
      if (curr - last > delay) {
        action.apply(this, arguments)
        last = curr
      }
    }
  },
  frameToTime: function(frame, frameRate) {
    var h,
      m,
      s,
      f
    f = (Math.round(frame % frameRate)).fixZero()
    h = (Math.floor(frame / (frameRate * 60 * 60))).fixZero()
    m = (Math.floor(frame / (frameRate * 60)) % 60).fixZero()
    s = (Math.floor(frame / (frameRate)) % 60).fixZero()
    return h + ':' + m + ':' + s + '.' + f
  },
  parseData: function(arr, father, option) {
    var newArr = []
    if (option === 'marker') {
      var marklist = arr
      var framerate = 25.0
      marklist.forEach((item, index) => {
        if (item.color) {
          var RedColor = (item.color & 0x0000ff)
          var Gcolor = ((item.color & 0x00ff00) >> 8)
          var Bcolor = ((item.color & 0xff0000) >> 16)
          item.bgcolor = {
            background: 'rgb(' + RedColor + ',' + Gcolor + ',' + Bcolor + ')'
          }
        } else {

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
        } else if (item.type == '8') {
          item.typeName = 'Esscene Mark'
          item.flag = 'emarker'
          item.pos = util.frameToTime(item.keyframe, framerate)
          item.name = '5'
          item.color = 'rgb(150,150,100)'
          item.time = item.keyframe / framerate
          item.guid = new Date().getTime() + index
          item.text = item.note
        } else if (item.type == '65536') {
          item.typeName = 'Logging Mark'
          item.flag = 'lmarker'
          item.pos = util.frameToTime(item.keyframe, framerate)
          item.name = '6'
          item.color = 'rgb(150,100,150)'
          item.time = item.keyframe / framerate
          item.guid = new Date().getTime() + index
          item.text = item.note
        } else if (item.type == '131072') {
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
    } else {
      var floor = 0
      if (father) {
        floor = father.floor + 1
      }
      if (util.isArray(arr)) {
        arr.forEach(item => {
          var node = {}
          node.formatDate = item.entity.createdate.formatDate()
          node.createdate = item.entity.createdate.match(/\d+/g).join('')
          node.typeid = item.entity.type
          node.type = util.getMaterialType(item.entity)
          if (node.type === 'audio') {
            node.type = 'video'
            node.bgtype = 'audio'
            node.isAudio = 'true'
          } else {
            node.bgtype = node.type
            node.isAudio = 'false'
            if (node.type === 'folder') {
              node.path = item.entity.folderpath + '/' + item.entity.name
              node.typeIndex = 0
            } else if (node.type === 'video') {
              node.typeIndex = 1
              node.channel = 2
            } else if (node.type === 'h5pgm') {
              node.typeIndex = 3
            } else if (node.type === 'image') {
              node.typeIndex = 4
            } else if (node.type === 'txtfile') {
              node.typeIndex = 5
            } else if (node.type === 'word') {
              node.typeIndex = 6
            } else if (node.type === 'ppt') {
              node.typeIndex = 7
            } else if (node.type === 'excel') {
              node.typeIndex = 8
            } else if (node.type === 'pdf') {
              node.typeIndex = 9
            } else {
              node.typeIndex = 10
            }
          }
          node.duration = 10
          node.folderpath = item.entity.folderpath
          node.guid = item.entity.guid
          node.id = item.entity.id
          node.name = item.entity.name
          node.iconfilename = item.entity.iconfilename ? util.getIconFilename(item.entity.iconfilename) : ''
          node.subtype = item.entity.subtype
          util.extendData(item, node)
          try {
            if (node.type === 'video') {
              if (item.entity.item) {
                node.duration = item.entity.item.length / 10000000
                if ((item.entity.item.filestatus & FileStatus.ET_Obj_FS_HA_ALL) > 0 || (item.entity.item.filestatus & FileStatus.ET_Obj_FS_HV_ALL) > 0) {
                  node.HQ = true
                }
                if ((item.entity.item.filestatus & FileStatus.ET_Obj_FS_LV_ALL) > 0 || (item.entity.item.filestatus & FileStatus.ET_Obj_FS_LA_ALL) > 0) {
                  node.LQ = true
                }
                if (node.typeIndex === 1) {
                  if ([1, 2, 64, 128, 65536, 8192].indexOf(parseInt(item.entity.item.capturestatus)) > -1) {
                    node.clipping = true
                  }
                  if (item.entity.item.filestatus & FileStatus.ET_Obj_FS_WA) {
                    node.WA = true
                  }
                  if (item.entity.item.dbestreamchannel && item.entity.item.dbestreamchannel != 0) {
                    node.DB = true
                  }
                  if (item.entity.item.videostandard && ETGetVideoStandardPI(item.entity.item.videostandard) == 2) {
                    node.P = true
                    node.Ptitle = ETGetFrameRate(item.entity.item.videostandard)
                  } else if (item.entity.item.videostandard && ETGetVideoStandardPI(item.entity.item.videostandard) == 1) {
                    node.I = true
                    node.Ititle = ETGetFrameRate(item.entity.item.videostandard)
                  }
                  if ((item.entity.item.filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_HA_SEG | FileStatus.ET_Obj_FS_LA_SEG)) == 0) {
                    node.channel = 1
                  }
                }
              }
            }
          } catch (e) {}
          node.floor = floor
          node.selected = false
          node.father = father
          node.open = false
          node.children = []
          newArr.push(node)
        })
      //may sort filter by option
      } else {
        newArr = []
      }
    }

    return newArr
  },
  getMaterialType: function(material) {
    var ctype = 'other'
    if (material.type == 16) {
      ctype = 'folder'
    } else {
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
      } else if (material.type == 0x40) {
        if (material.subtype == 1) {
          ctype = 'sequence'
        } else if (material.subtype == 3 || material.subtype == 2 || material.subtype == 4) {
          ctype = 'h5pgm'
        }
      } else if (material.type == 0x80000) {
        ctype = 'log'
      } else if (material.type == 0 && material.subtype == 0) {
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
  alert: function(Dialog, title, content, style, button) {
    var dialog = new Dialog({
      title: title,
      content: content,
      style: style,
      button: button
    })
    dialog.open()
  },
  locateFolder: function(store, folderList, fNode) {
    if (folderList.length == 0) {
      store.commit({
        type: types.GET_NAVPATH,
        target: fNode,
        data: []
      })
    } else {
      var folderName = folderList[0]
      var folder = fNode.children.filter(item => item.type === 'folder' && (item.name === folderName || item.path.split('/').pop() === folderName))[0]
      if (folder) {
        store.dispatch({
          type: types.GET_MATERIALS2,
          source: folder
        }).then(() => {
          store.commit({
            type: types.EXPAND_FOLDER,
            target: folder
          })
          folderList.shift()
          util.locateFolder(store, folderList, folder)
        })
      }
    }
  },
  updateMaterial: function(arr, data) {
    arr.forEach(item => {
      if (item.guid === data.guid) {
        item.name = data.name
        item.path = data.folderPath + '/' + item.name
        if (item.children.length > 0) {
          util.mergeChildrenPath(item.children, item.path)
        }
        return
      }
      if (item.children.length > 0) {
        util.updateMaterial(item.children, data)
      }
    })
  },
  deleteMaterial: function(arr, data) {
    arr.forEach(item => {
      if (item.guid === data.guid) {
        arr.remove(item)
        return
      }
      if (item.children.length > 0) {
        util.deleteMaterial(item.children, data)
      }
    })
  },
  getMaterialFoder: function(arr, data) {
    return new Promise((resolve, reject) => {
      arr.forEach(item => {
        if (item.guid === data.fguid) {
          resolve(item)
        }
        if (item.children.length > 0) {
          util.getMaterialFoder(item.children, data).then(res => {
            resolve(res)
          })
        }
      })
    })
  }
}
function sortLikeWinBy(attr) {
  return function(str1, str2) {
    try {
      if (str1[attr] === undefined)
        str1[attr] = '';
      if (str2[attr] === undefined)
        str2[attr] = '';
      var a = str1[attr].toUpperCase();
      var b = str2[attr].toUpperCase();
      var reg = /[0-9]+/g;
      var lista = a.match(reg);
      var listb = b.match(reg);
      if (!lista || !listb) {
        return CommonCompare(a, b);
      }
      for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
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
        } else {
          //数字的string全等
          if (stra === strb) {
            //如果是最后一个数字，比较数字的后缀
            if (i == minLen - 1) {
              return CommonCompare(a.substring(indexa + 1), b.substring(indexb + 1));
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
          } else {
            //如果数字不等，直接比较数字大小
            return numa - numb;
          }
        }
      }
    } catch (e) {
      return -1;
    }
  }
}
function SortLikeWin(str1, str2) {
  try {
    if (str1.name === undefined)
      str1.name = '';
    if (str2.name === undefined)
      str2.name = '';
    var a = str1.name.toUpperCase();
    var b = str2.name.toUpperCase();
    var reg = /[0-9]+/g;
    var lista = a.match(reg);
    var listb = b.match(reg);
    if (!lista || !listb) {
      return CommonCompare(a, b);
    }
    for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
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
      } else {
        //数字的string全等
        if (stra === strb) {
          //如果是最后一个数字，比较数字的后缀
          if (i == minLen - 1) {
            return CommonCompare(a.substring(indexa + 1), b.substring(indexb + 1));
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
        } else {
          //如果数字不等，直接比较数字大小
          return numa - numb;
        }
      }
    }
  } catch (e) {
    return -1;
  }
}
function CommonCompare(a, b) {
  if (a === b) {
    return 0;
  } else if (a.length == 0 || b.length == 0) {
    return a < b ? -1 : 1;
  }
  var reg = /[^\u2E80-\u9FFF\d+a-zA-Z]/g; //匹配特殊字符
  var lista = a.match(reg);
  var listb = b.match(reg);
  if (!lista || !listb) {
    if (!lista && !listb) {
      return ZHCompare(a, b) //a < b ? -1 : 1;
    } else if (!lista && listb) { //a没匹配到特殊字符，b匹配到了
      var index = b.indexOf(listb[0]);
      var prefixa = a.substring(0, index);
      var prefixb = b.substring(0, index);
      if (prefixa != prefixb) {
        return ZHCompare(prefixa, prefixb); //prefixa < prefixb ? -1 : 1;//不考虑数字
      } else {
        return !a[index] ? -1 : a[index] < b[index] ? -1 : 1; //如果a的index位置为undefined，则返回-1,否则比较abindex位置的值
      }
    } else { //b没匹配到特殊字符，a匹配到了
      var index = a.indexOf(lista[0]);
      var prefixa = a.substring(0, index);
      var prefixb = b.substring(0, index);
      if (prefixa != prefixb) {
        return ZHCompare(prefixa, prefixb); //prefixa < prefixb ? -1 : 1;//不考虑数字
      } else {
        return !b[index] ? 1 : a[index] < b[index] ? -1 : 1; //如果b的index位置为undefined，则返回1,即有特殊字符的a大于没特殊字符且index位置为undefined的b，否则比较a，b，index位置的值
      }
    }
  } else {
    for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
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
        return ZHCompare(prefixa, prefixb); //prefixa < prefixb ? -1 : 1;//不考虑数字
      } else {
        if (stra === strb) {
          //如果是最后一个字符，比较字符的后缀
          if (i == minLen - 1) {
            return CommonCompare(a.substring(indexa + 1), b.substring(indexb + 1));
          } else {
            a = a.substring(indexa + stra.length);
            b = b.substring(indexa + stra.length);
          }
        } else {
          return ZHCompare(stra, strb); //stra < strb ? -1 : 1;
        }
      }
    }
  }
}
function ZHCompare(a, b) {
  if (a === b) {
    return 0;
  } else if (a.length == 0 || b.length == 0) {
    return a < b ? -1 : 1;
  }
  var reg = /[\u2E80-\u9FFF]/g; //匹配中文
  var lista = a.match(reg);
  var listb = b.match(reg);
  if (!lista || !listb) {
    return a < b ? -1 : 1;
  } else { //a b 都包含中文
    for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
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
      } else {
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
        } else {
          //如果中文不等，直接比较中文大小
          return stra.localeCompare(strb);
        }
      }
    }
  }
}
var base64DecodeChars = new Array(
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
  var c1,
    c2,
    c3,
    c4;
  var i,
    len,
    out;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c1 == -1);
    if (c1 == -1)
      break;
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c2 == -1);
    if (c2 == -1)
      break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)
        return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == -1);
    if (c3 == -1)
      break;
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61)
        return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == -1);
    if (c4 == -1)
      break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}
util.utf8to16 = function(str) {
  str = base64decode(str);
  var out,
    i,
    len,
    c;
  var char2,
    char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx　 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx　10xx xxxx　10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}
util.getListHeader = function(left, arr) {
  var l = arr.length
  for (let i = 0; i < l; i++) {
    if (arr[i].width > left) {
      return arr[i]
    } else {
      left -= arr[i].width
    }
  }
  return arr[l - 1]
}
util.extendData = function(sdata, node) {
  var _framerate = 25;
  var clipData = sdata.entity;
  if (sdata.streammedia != undefined) {
    if (sdata.streammedia.length > 0) {
      _framerate = sdata.streammedia[0].framerate;
    }
  }
  if (clipData.item != undefined) {
    var _ntsctcmode = (clipData.item.ntsctcmode == undefined ? 0 : clipData.item.ntsctcmode);
    var _videostandard = (clipData.item.videostandard == undefined ? 0 : clipData.item.videostandard);
  } else {
    var _ntsctcmode = 0;
    var _videostandard = 0;
  }
  var _filestatus;
  if (clipData.item != undefined) {
    if (clipData.item.filestatus != undefined) {
      _filestatus = clipData.item.filestatus;
    }
  }
  //创建者
  if (clipData.creator != undefined) {
    if (clipData.creator.length == 32) {
      node.creatorName = getUserNameByUserCode(clipData.creator, _userToken);
    } else {
      node.creatorName = clipData.creator;
    }
  }
  //修改者
  if (clipData.modifier != undefined) {
    if (clipData.modifier.length == 32) {
      node.modifierName = getUserNameByUserCode(clipData.modifier, _userToken);
    } else {
      node.modifierName = clipData.modifier;
    }
  }
  //  Storage Status
  if (clipData.type == "32") {
    node.onlinstatus = (clipData.archivestatus == undefined ? "Online" : (clipData.archivestatus == "online_deleted" ? "Archived" : "Online"))
  }

  //素材状态
  var clipStatus = "";
  if (clipData.item != undefined) {
    if (_filestatus & FileStatus.ET_Obj_FS_WA) { //WA类型的单独处理
      node.clipStatus = (clipData.item.capturestatus == undefined ? "Normal" : GetClipStatus(clipData.item.capturestatus));

    } else {
      node.clipStatus = (clipData.item.capturestatus == undefined ? "" : GetClipStatus(clipData.item.capturestatus));
    }
  }
  //HV
  var hv = "";
  if ((clipData.subtype & CLIPTYPE.ET_CLIPTYPE_AV) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_V) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_XDCAM)
    || (CLIPTYPE.ET_CLIPTYPE_XDCAM_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2 & clipData.subtype)
    || (CLIPTYPE.ET_CLIPTYPE_INFINITY & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2 & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2_LIST & clipData.subtype)) {
    if (_filestatus & (FileStatus.ET_Obj_FS_HV_ALL | FileStatus.ET_Obj_FS_HV_SEG)) {
      node.hv = '✓';
    }
  }
  //LV
  if ((clipData.subtype & CLIPTYPE.ET_CLIPTYPE_AV) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_V) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_XDCAM) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_A)
    || (CLIPTYPE.ET_CLIPTYPE_XDCAM_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2 & clipData.subtype)
    || (CLIPTYPE.ET_CLIPTYPE_INFINITY & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2 & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2_LIST & clipData.subtype)) {
    if (_filestatus & (FileStatus.ET_Obj_FS_LV_ALL | FileStatus.ET_Obj_FS_LV_SEG)) {
      node.lv = '✓';
    }
  }
  //HA
  if (_filestatus != undefined) {
    if ((clipData.subtype & CLIPTYPE.ET_CLIPTYPE_A) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_AV) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_V) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_XDCAM) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_A)
      || (CLIPTYPE.ET_CLIPTYPE_XDCAM_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2 & clipData.subtype)
      || (CLIPTYPE.ET_CLIPTYPE_INFINITY & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2 & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2_LIST & clipData.subtype)) {
      if (_filestatus & (FileStatus.ET_Obj_FS_HA_ALL | FileStatus.ET_Obj_FS_HA_SEG)) {
        node.ha = '✓';
      }
    }
  }
  //LA
  if (_filestatus != undefined) {
    if ((clipData.subtype & CLIPTYPE.ET_CLIPTYPE_A) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_AV) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_V) || (clipData.subtype & CLIPTYPE.ET_CLIPTYPE_XDCAM)
      || (CLIPTYPE.ET_CLIPTYPE_XDCAM_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2_LIST & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_P2 & clipData.subtype)
      || (CLIPTYPE.ET_CLIPTYPE_INFINITY & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2 & clipData.subtype) || (CLIPTYPE.ET_CLIPTYPE_E2_LIST & clipData.subtype)) {
      if (_filestatus & (FileStatus.ET_Obj_FS_LA_ALL | FileStatus.ET_Obj_FS_LA_SEG)) {
        node.la = '✓';
      }
    }
  }
  //HD\SD
  if (clipData.item != undefined) {
    if (clipData.item.videostandard != undefined) {
      //if(item.videostandard==VideoStandard.)
      var temphs = ET_VideoStandardGetHSClass(clipData.item.videostandard);
      if (temphs == Video_HS.ET_VIDEO_HS_SD) {
        node.hsd = "SD";
      }
      if (temphs == Video_HS.ET_VIDEO_HS_HD720p || temphs == Video_HS.ET_VIDEO_HS_HD1080i
        || temphs == Video_HS.ET_VIDEO_HS_HD1080p || temphs == Video_HS.ET_VIDEO_HS_HD1440i) {
        node.hsd = "HD";
      }
    }
  }
  //16:9
  if (clipData.item != undefined) {
    node.img16_9sd = (clipData.item.imagetype == ImageType.ET_CLIP_IMAGETYPE_16_9SD ? "✓" : "");
  }
  //to be del
  if (clipData.deleteflag != undefined) {
    node.tobedel = (clipData.deleteflag == 1 ? "✓" : "");
  }
  node.comments = clipData.note;
  node.modificationDate = clipData.modifydate.formatDate();
  //node.clipStatus = GetClipStatus(clipData.status);
  node.rights = clipData.rights;

  if (node.type === 'image') {
    node.totalDuration = GetTimeStringByFrameNum(GetFrameNumByHundredNS(863999600000, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
    node.length = GetTimeStringByFrameNum(GetFrameNumByHundredNS(40000000, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
    node.trimin = '00:00:00:00';
    node.trimout = GetTimeStringByFrameNum(GetFrameNumByHundredNS(40000000, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
  } else if (node.type === 'video') {
    var _in = 0;
    var _out = 0;
    if (clipData.item.trimin != undefined) {
      _in = clipData.item.trimin
    }
    if (clipData.item.trimout != undefined) {
      _out = clipData.item.trimout
    }
    node.totalDuration = GetTimeStringByFrameNum(GetFrameNumByHundredNS(clipData.item.length, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
    node.length = GetTimeStringByFrameNum(GetFrameNumByHundredNS((_out - _in), _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
    node.trimin = GetTimeStringByFrameNum(GetFrameNumByHundredNS(clipData.item.trimin, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
    node.trimout = GetTimeStringByFrameNum(GetFrameNumByHundredNS(clipData.item.trimout, _videostandard, _ntsctcmode), _ntsctcmode, _videostandard, _framerate)
  } else {
  }

}
function GetFrameNumByHundredNS(hundredNanoSeconds, videoStandard, ntscTcMode) {
  if (isNaN(hundredNanoSeconds)) {
    hundredNanoSeconds = 0;
  }
  videoStandard = Format.ET_GetOldStandard(videoStandard);
  //百纳秒转帧
  var seconds = (hundredNanoSeconds / Math.pow(10, 9)) * 100;
  var _frame;

  if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_50) {
    _frame = seconds * 50;
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_5994) {
    _frame = seconds * 59.94;
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_25) {
    _frame = seconds * 25;
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_2997) {
    _frame = seconds * 29.97;
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_30) {
    _frame = seconds * 30;
  }
  _frame = _frame.toFixed(0);
  return _frame
}
function GetFrameRateByVideoStandard(videostandard) {
  var _frameRate = Format.ETGetVideoFrameRate(videostandard).nTimeRate;
  var frameRate = FrameRateEnum.FR_25;
  if (_frameRate == 25) {
    frameRate = FrameRateEnum.FR_25;
  } else if (_frameRate == 2997) {
    frameRate = FrameRateEnum.FR_2997;
  } else if (_frameRate == 50) {
    frameRate = FrameRateEnum.FR_50;
  } else if (_frameRate == 5994) {
    frameRate = FrameRateEnum.FR_5994;
  } else if (_frameRate == 30) {
    frameRate = FrameRateEnum.FR_30;
  }
  return frameRate;
}
function GetTimeStringByFrameNum(lFrameNum, lNtscTcMode, videoStandard, framerate) {
  if (lFrameNum == undefined || lNtscTcMode == undefined) return "00:00:00:00";
  videoStandard = Format.ET_GetOldStandard(videoStandard);
  var frm = 0,
    sec = 0,
    min = 0,
    hour = 0;
  var df = false;
  if (lNtscTcMode == 0) {
    df = true;
  }
  if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_50) {
    var frm720p = lFrameNum % (25 * 2);
    frm = parseInt(frm720p / 2);
    var sec_total = (lFrameNum - frm720p) / (25 * 2);
    sec = sec_total % 60;
    var min_total = (sec_total - sec) / 60;
    min = min_total % 60;
    hour = (min_total - min) / 60;

    df = false; //P制都是非丢帧的
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_5994) {
    if (lNtscTcMode == 0) {
      var freeFrame = lFrameNum % (107892 * 2);
      hour = parseInt(lFrameNum / (107892 * 2));
      var tenMin = parseInt(freeFrame / (17982 * 2));
      freeFrame = freeFrame % (17982 * 2);
      var nMin = parseInt((freeFrame - 4) / (1798 * 2));
      min = nMin + tenMin * 10;
      freeFrame = freeFrame - nMin * (1798 * 2);

      sec = parseInt(freeFrame / (30 * 2));
      //frm = freeFrame % (30*2);
      var frm720p = freeFrame % (30 * 2);
      frm = parseInt(frm720p / 2);

      df = true;
    } else {
      var frm720p = lFrameNum % (30 * 2);
      frm = parseInt(frm720p / 2);
      var sec_total = (lFrameNum - frm720p) / (30 * 2);
      sec = sec_total % 60;
      var min_total = (sec_total - sec) / 60;
      min = min_total % 60;
      hour = (min_total - min) / 60;
    }
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_25) {
    frm = lFrameNum % 25;
    var sec_total = (lFrameNum - frm) / 25;
    sec = sec_total % 60;
    var min_total = (sec_total - sec) / 60;
    min = min_total % 60;
    hour = (min_total - min) / 60;

    df = false; //P制都是非丢帧的
  } else if (GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_2997 || GetFrameRateByVideoStandard(videoStandard) == FrameRateEnum.FR_30) {
    if (lNtscTcMode == 0) {
      var freeFrame = lFrameNum % 107892;
      hour = parseInt(lFrameNum / 107892);
      var tenMin = parseInt(freeFrame / 17982);
      freeFrame = freeFrame % 17982;
      var nMin = parseInt((freeFrame - 2) / 1798);
      min = nMin + tenMin * 10;
      freeFrame = freeFrame - nMin * 1798;

      sec = parseInt(freeFrame / 30);
      frm = freeFrame % 30;
      df = true;
    } else {
      frm = lFrameNum % 30;
      var sec_total = (lFrameNum - frm) / 30;
      sec = sec_total % 60;
      var min_total = (sec_total - sec) / 60;
      min = min_total % 60;
      hour = (min_total - min) / 60;
    }
  } else { //默认按照25帧率算

    frm = lFrameNum % 25;
    var sec_total = (lFrameNum - frm) / 25;
    sec = sec_total % 60;
    var min_total = (sec_total - sec) / 60;
    min = min_total % 60;
    hour = (min_total - min) / 60;

    df = false; //P制都是非丢帧的
  }

  return (hour < 10 ? '0' + hour : hour) + ":" + (min < 10 ? '0' + min : min) + (df ? "." : ":") + (sec < 10 ? '0' + sec : sec) + ":" + (frm < 10 ? '0' + frm : frm);
}
util.setCookie = function(name, value) {
  if (localStorage && localStorage.setItem) {
    localStorage.setItem(name, value);
  } else {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }
}
util.getCookie = function(name) {
  if (localStorage && localStorage.getItem) {
    return localStorage.getItem(name);
  } else {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
}

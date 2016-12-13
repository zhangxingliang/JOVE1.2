/// <reference path="../app.js" />
define(["app", "services/utilsService"], function (app) {
    //注册一个名称为mainIndexController的控制器
    //在 app/routes.js中需要注册路由信息
    app.service("cmService", ['$http', '$q', 'utilsService', '$rootScope', function ($http, $q, utilsService, $rootScope) {
        var _this = this;
        var apiUrl = app.apiUrl;
        this.getFavoriteObject = function (userCode, ignoreWaiting) {
            return utilsService.get("Cm/GetFavoriteObject", { usertoken: _userToken, usercode: userCode, siteCode: _siteCode }, null, ignoreWaiting);
        }

        this.getDragedObject = function (contentid, objecttype, ignoreWaiting) {
            return utilsService.get("Cm/GetDragedClipInfo", { usertoken: _userToken, contentid: contentid, objecttype: objecttype, siteCode: _siteCode }, null, ignoreWaiting);
        };

        this.getClipList = function (path, ignoreWaiting) {
            return utilsService.post("Cm/GetClipList", { siteCode: _siteCode }, { usertoken: _userToken, path: path, t: new Date().getTime(), siteCode: _siteCode }, ignoreWaiting);
        };

        this.searchClips = function (keyword) {
            return utilsService.get("Cm/SearchClips", { usertoken: _userToken, keyword: keyword, siteCode: _siteCode })
        }

        this.getFolderObjects = function (node, ignoreWaiting) {
            node.usertoken = _userToken;
            return utilsService.post("Cm/GetFolderList", {siteCode: _siteCode }, node, ignoreWaiting);
        };

        this.searchObjects = function (keyword, objectTypes, subTypes) {
            return utilsService.get("Cm/SearchObjects", { keyword: keyword, objectTypes: objectTypes, subTypes: subTypes, siteCode:_siteCode });
        };
        this.getObject = function (contentid, objecttype, ignoreWaiting) {
            return utilsService.get("Cm/GetClipInfo", { usertoken: _userToken, contentid: contentid, objecttype: objecttype,siteCode:_siteCode }, null, ignoreWaiting);
        };
        this.getTimeline = function (guid, ignoreWaiting) {
            return utilsService.get("Cm/GetTimeLine", { usertoken: _userToken, guid: guid ,siteCode:_siteCode}, null, ignoreWaiting);
        }
        this.hasFormatInfo = function (data) {
            return utilsService.get("Cm/HasFormatInfo", { usertoken: _userToken, contentid: data.clipid ,siteCode : _siteCode});
        }
        this.getLanguage = function () {
            return utilsService.get("Cm/GetLanguagePackege", {});
        };
        this.Login = function () {
            return utilsService.get("Cm/Login", { usertoken: _userToken , siteCode:_siteCode});
        }
        this.GetUserStorage = function (loginNmae) {
            return utilsService.get("Cm/GetUserStorage", { usertoken:_userToken, loginname: loginNmae });
        }
        this.getSearchModel = function (token, loginname) {
            return utilsService.post(golbalSetting.CM + "/Handler/MaterialList.ashx", null, { OperationType: "GetSearchResult", usertoken: _userToken, loginname: loginname });
        }
        this.getObjectType = function (obj) {
            var ctype = '';
            if (obj.type == 16) {
                ctype = 'folder';
                obj.orderType = 0;
            } else {
                ctype = "file";
                obj.orderType = 1;
                if (obj.type == 32) {
                    switch (obj.subtype) {
                        case 0x01:
                        case 0x02:
                        case 1024:
                        case 512:
                        case 2048:
                            ctype = "video";
                            break;
                        case 0x0004:
                            ctype = "audio";
                            break;
                        case 0x002000:
                            ctype = "txtfile";
                            break;
                        case 0x004000:
                            ctype = "word";
                            break;
                        case 0x008000:
                            ctype = "ppt";
                            break;
                        case 0x010000:
                            ctype = "excel";
                            break;
                       /* case 0x020000:
                            ctype = "project";
                            break;*/
                        case 0x040000:
                            ctype = "pdf";
                            break;
                        case 0x000020:
                            ctype = "image";
                            break;
                        case 0x10000000:
                            ctype = 'rar';
                            break;

                    }
                } else if (obj.type == 0x40) {
                    if (obj.subtype == 1) {
                        ctype = "sequence";
                    }
                    else if (obj.subtype == 3 || obj.subtype == 2 || obj.subtype == 4) {
                        ctype = "h5pgm";
                    }
                } else if (obj.type == 0x80000) {
                    //场记
                    ctype = "log";
                }
                else if (obj.type == 0 && obj.subtype == 0) {
                    ctype = "rar";
                }
            }
            return ctype;
        };

        this.getsignurl = function (fileid, qs, callback) {
            var q = '';
            for (var k in qs) {
                if (q.length > 1) {
                    q += '&';
                }
                q = q + k + "=" + encodeURIComponent(qs[k]);
            }
            utilsService.get("cm/getsignurl", { fileid: fileid, qs: q }).then(function (r) {
                if (r.code == "0") {
                    if (callback) {
                        callback.call(_this, true, r.ext);
                    }
                } else {
                    if (callback) {
                        callback.call(_this, false, r.ext);
                    }
                }
            }, function (r) {
                if (callback) {
                    callback.call(_this, false, r.ext);
                }
            });
        };

        this.sortClipList = function (list) {
            list = list.sort(function (a, b) {
                if (a.ObjectType == 16) {
                    if (b.ObjectType == 16) {
                        return (a.ObjectName || "").localeCompare(b.ObjectName);
                    }
                    return -1;
                }
                if (a.ObjectType == b.ObjectType) {
                    return (a.ObjectName || "").localeCompare(b.ObjectName);
                }
                return a.ObjectType;
            });
            return list;
        }

        this.SortLikeWin = function(str1, str2) {
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
        function SortBy(arr, para, func) {
            var splitedArr = [];
            var splitedObj = {};
            var orderTypeArr = [];
            arr.forEach(function (item, index) {
                if (splitedObj[item[para]]) {
                    splitedObj[item[para]].push(item);
                }
                else {
                    splitedObj[item[para]] = [item];
                    orderTypeArr.push(item[para]);
                }
            });
            orderTypeArr.sort().forEach(function (item) {
                splitedArr = splitedArr.concat(splitedObj[item].sort(func));
            });
            return splitedArr;
        }
        this.getClipListCache = function(data){
            var titleUpArr = SortBy(data, 'orderType', this.SortLikeWin).slice();
            var titleDownArr = titleUpArr.slice().reverse();
            var timeUpArr = SortBy(data, 'orderType', function (m, n) {
                return m.createdate - n.createdate;
            }).slice();
            var timeDownArr = timeUpArr.slice().reverse();
            var typeUpArr = SortBy(data, 'typeIndex', this.SortLikeWin).slice();
            var typeDownArr = typeUpArr.slice().reverse();
            return({
                titleUp: titleUpArr,
                titleDown: titleDownArr,
                timeUp: timeUpArr,
                timeDown: timeDownArr,
                typeUp: typeUpArr,
                typeDown: typeDownArr
            });
        }
        function fomartTime(value) {
            return value < 10 ? "0" + value : value;
        }
        this.find = function (array, condition) {
            if (!array || array.length == 0) {
                return null;
            }

            angular.forEach(array,function(item, index){
                if (condition(item, index)) {
                    return item;
                }
            });
        }
        this.frameToTime = function(frame,frameRate){
            var h,
                m,
                s,
                f;
            f = fomartTime(Math.round(frame % frameRate));
            h = fomartTime(Math.floor(frame / (frameRate * 60 * 60)));
            m = fomartTime(Math.floor(frame / (frameRate * 60)) % 60);
            s = fomartTime(Math.floor(frame / (frameRate)) % 60);
            return h+":"+m+":"+s+"."+f;
        }
        this.getIconFilename = function(iconfilename) {
            var _iconfilename = "";
            if (iconfilename) {
                _iconfilename = iconfilename.replace(/\\/g, '/');
                _iconfilename = _iconfilename.replace(":", "").split("\\").join("/");
                if (_iconfilename.indexOf("bucket-") >= 0) {
                    if (_iconfilename.indexOf("bucket-") != _iconfilename.lastIndexOf("bucket-")) {
                        _iconfilename = _iconfilename.substring(_iconfilename.lastIndexOf("bucket-") + 7);
                    }
                    else {
                        _iconfilename = _iconfilename.substring(_iconfilename.indexOf("bucket-") + 7);
                    }

                }

                if (_iconfilename.length == 0) {
                    _iconfilename = "/app/images/nostamp.png";
                } else {
                    _iconfilename = _resourceUrl + _iconfilename;
                }
            }
            return _iconfilename;
        }

    }]);
});
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        global.NotifyPlugin = factory();
    }
})(this, function () {
    if (!('WebSocket' in window)) {
        return;
    }
    function NotifyPlugin(urlList, Notify) {
		
        var Guid ;
        var ws;
        var seek = 0;
        var total = urlList.length;
        var _this = this;

        var Reconnect = function () {
            if (seek < total - 1) {
                seek += 1;
            }
            else {
                seek = 0;
            }
            _this.Init();
        }
        this.Init = function () {
            if (total > 0) {
                ws = new WebSocket(urlList[seek]);
                ws.onopen = function (e) {
                    if (ws.readyState == 1) {
                        ws.send(JSON.stringify({ GUID: Guid }));
                    }
                }
                ws.onmessage = function (e) {
                    var res = JSON.parse(e.data);

                    if (res.GUID) {
                        Guid = res.GUID;
                    }
                    else {
                        Notify(res);
                    }
                }
                ws.onclose = Reconnect;
            }
            return this;
        }
        this.Send = function (data) {
            data.GUID = Guid;
            if (ws.readyState == 1) {
                ws.send(JSON.stringify(data));
                return true;
            }
            else {
                Reconnect();
                return false;
            }
          
        }
    }
    return NotifyPlugin;
});
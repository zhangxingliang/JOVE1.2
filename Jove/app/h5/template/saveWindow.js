define('h5/template/saveWindow', [], function () {
    return '<div class="mp-memo-content2">\
                <span style="left: 10px;width: 85px;text-align: left;top: 23px;color: #cfd2d4;">' + _language[_curLang].title+ '</span>\
                <div class="input-text-wrapper" style="height: 30px;">\
                    <input type="text" class="mp-input title" onchange="if(this.value.length > 254){this.value = this.value.substring(0, 255);}" oninput="if(this.value.length > 254){this.value = this.value.substring(0, 255);}"/>\
                </div>\
                <div class="treelist"></div>\
                <div class="mp-foot">\
                    <button class="mp-btn cancel">' + _language[_curLang].cancel+ '</button>\
                    <button class="mp-btn ok">' + _language[_curLang].confirm + '</button>\
                </div>\
            </div>';
});
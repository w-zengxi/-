const qqmap = require('../lib/qqmap-wx-jssdk.min.js');
const key = 'A7LBZ-VSBKO-L7KWS-SNPXQ-WQPKT-ZRFA4';
const qqMap = new qqmap({ key})

class Qmap {
  // 获取POI数据
  static getPoi (keyword = '', page_index = 1) {
    return new Promise((resolve, reject) => qqMap.search({ keyword, page_index, success: resolve, fail: reject}));
  }

  static getLocation () {
    return new Promise((resolve, reject) => qqMap.reverseGeocoder({ success: resolve, fail: reject}))
  };

  static getSuggestion(keyword = '', region = '') {
    return new Promise((resolve, reject) => qqMap.getSuggestion({ keyword, success: resolve, fail: reject}));
  }
}
module.exports = Qmap;

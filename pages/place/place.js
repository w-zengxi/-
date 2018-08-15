//place.js
const config = require('../../utils/config.js')
const qqmap = require('../../lib/qqmap-wx-jssdk.min.js');
const qqMap = new qqmap({ key: config.qqKey })
Page({
  data: {
    map: {
      longitude: '',
      latitude: '',
      markers: [],
      scale: '14'
    }
  },
  onLoad: function (options) {
    var that = this;
    var place = JSON.parse(options.place)
    that.calculateDistance(place);
    that.setData({
      address: place,
      place: place,
      'map.longitude': place.location.lng,
      'map.latitude': place.location.lat,
      'map.markers': [{
        id: place.id,
        latitude: place.location.lat,
        longitude: place.location.lng,
        title: place.title,
        width: 40,
        height: 40,
        iconPath: '/images/place.png'
      }]
    })
  },
  calculateDistance: function (place) {
    var that = this;
    qqMap.calculateDistance({
      to: [{
        latitude: place.location.lat,
        longitude: place.location.lng
      }],
      success: function (res) {
        console.log(res.result.elements[0]);
        if (res.result.elements[0].distance >= 1000){
          that.setData({
            distance: (res.result.elements[0].distance / 1000).toFixed(1) + '公里'
          })
        }else{
          that.setData({
            distance: res.result.elements[0].distance + '米'
          })
        }
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          distance: res.message
        })
      }
    })
  },
  // 打开搜索页面
  openSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  // 打开路线页面
  openRoute: function () {
    wx.navigateTo({
      url: '../route/route'
    })
  }
})
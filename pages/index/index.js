//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const qqmap = require('../../lib/qqmap-wx-jssdk.min.js');
const qqMap = new qqmap({ key: config.qqKey})
var wxMarkerData = []
Page({
  data: {
    map: {
      markers: [],
      latitude: '',
      longitude: '',
      scale: 15
    },
    address: ''
  },
  //事件处理函数
  searchSite: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function () {
    var that = this;
    that.getLocation();
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          'map.longitude': res.longitude,
          'map.latitude': res.latitude
        })
        qqMap.reverseGeocoder({
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          },
          success: function (res) {
            var city = res.result.address_component.city;
            wx.setStorage(
              {
                key: 'city',
                data: city
              }
            )
          }
        })
      }
    })
  }, 
  changeScale: function (e) {
    var that = this;
    switch (e.target.id){
      case 'enlarge':
        that.setData({
          'map.scale': that.data.map.scale >= 20 ? 20 : ++that.data.map.scale
        })
        break;
      case 'narrow':
        that.setData({
          'map.scale': that.data.map.scale <= 5 ? 5 : --that.data.map.scale
        })
        break;
    }
  },
  moveToLocation: function () {
    var that = this;
    that.mapCtx.moveToLocation()
    that.setData({
      'map.scale': 15
    })
  }
  // setMarker: function (data) {
  //   var that = this;
  //   var markers = [];
  //   for (var i = 0; i < data.length; i++) {
  //     var random = Math.floor(Math.random() * 10 + 1)
  //     markers.push(
  //       {
  //         id: data[i].id,
  //         latitude: data[i].location.lat,
  //         longitude: data[i].location.lng,
  //         title: data[i].title,
  //         width: 20,
  //         height: 20,
  //         second: random,
  //         iconPath: '/images/' + (random >= 7 ? 7 : random) + '.png',
  //         label: {
  //           // content: data[i].address
  //         }
  //       }
  //     )
  //   }
  //   that.setData({
  //     'map.markers': markers
  //   });
  // }
})

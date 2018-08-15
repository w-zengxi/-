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
      scale: 15,
      markers: []
    },
    address: ''
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    that.getLocation();
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
  // 获取当前位置
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          'map.longitude': res.longitude,
          'map.latitude': res.latitude
        })
      }
    })
  }, 
  // 改变地图的缩放级别
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
  },
  moveToLocation: function () {
    var that = this;
    that.mapCtx.moveToLocation()
    that.setData({
      'map.scale': 15
    })
  }
})

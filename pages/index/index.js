//index.js
//获取应用实例
const app = getApp()
const Qmap = require('../../utils/qqmap.js')
Page({
  data: {
    latitude: '',
    longitude: '',
    latitude2: '',
    longitude2: '',
    markers: [],
    scale: 15,
    positionData: '',
    city: ''
  },
  //事件处理函数
  onLoad: function () {
    let that = this;
    wx.showLoading({
      icon: 'loading',
      mask: true
    }) 
    // 获取当前位置信息
    Qmap.getLocation().then(res => {
      console.log(res)
      that.setData({
        longitude: res.result.location.lng,
        latitude: res.result.location.lat,
        city: res.result.address_component.city
      })
      wx.hideLoading();
    }).catch(res => {
      console.log(res)
    })
  },
  // 监听页面渲染
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map');
  },
  // 打开搜索页面
  openSearch: function () {
    let that = this;
    let { latitude, longitude, city} = that.data;
    let url = `/pages/search/search?city=${city}&latitude=${latitude}&longitude=${longitude}`
    wx.navigateTo({ url })
  },
  // 打开路线页面
  openRoute: function () {
    let that = this;
    let { latitude, longitude, latitude2, longitude2, positionData} = that.data;
    let url = `/pages/route/route?latitude=${latitude}&longitude=${longitude}&latitude2=${latitude2}&longitude2=${longitude2}&title=${positionData.title}&address=${positionData.address}`;
    wx.navigateTo({ url })
  },
  // 移动定位
  moveToLocation: function () {
    var that = this;
    that.mapCtx.moveToLocation()
    that.setData({
      'scale': 15
    })
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '我的位置',
      desc: '私人定制',
      path: ''
    }
  }
})

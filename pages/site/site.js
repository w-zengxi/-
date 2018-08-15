// pages/site/site.js
const config = require('../../utils/config.js')
const qqmap = require('../../lib/qqmap-wx-jssdk.min.js');
const qqMap = new qqmap({ key: config.qqKey })
Page({
  /* 页面的初始数据*/
  data: {
    map: {},
    check: -1,
    formatted_addresses: '【位置】'
  },
  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        that.setData({
          'map.longitude': res.longitude,
          'map.latitude': res.latitude
        })
        that.reverseGeocoder(res)
      }
    })
  },
  /*生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
    this.mapCtx = wx.createMapContext('map')
  },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
  },
  /*生命周期函数--监听页面隐藏*/
  onHide: function () {
  },
  /* 生命周期函数--监听页面卸载*/
  onUnload: function () {
  },
  /*页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
  },
  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function () {
  },
  /*用户点击右上角分享*/
  onShareAppMessage: function () {
  },
  moveToLocation: function () {
    var that = this;
    that.mapCtx.moveToLocation()
  },
  regionchange: function (e) {
    var that = this;
    if (e.type === 'end') {
      //获取当前地图的中心经纬度
      that.mapCtx.getCenterLocation({
        success: function (res) {
          that.reverseGeocoder(res)
        }
      })
    }
  },
  reverseGeocoder: function (location) {
    var that = this;
    qqMap.reverseGeocoder({
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      get_poi: 1,
      // poi_options: 'page_size=20',
      success: function (res) {
        var pois = res.result.pois;
        var markers = [];
        for (var i = 0; i < pois.length; i++) {
          var p = {
            id: i,
            title: pois[i].title,
            latitude: pois[i].location.lat,
            longitude: pois[i].location.lng,
            iconPath: '../../images/tag_red.png',
            width: 24,
            height: 24,
            callout: {
              content: pois[i].title,
              borderRadius: 4,
              bgColor: '#fff',
              padding: 5,
              display: 'BYCLICK'
            },
            anchor: {
              x: .5,
              y: .5
            }
          }
          markers.push(p)
        }
        that.setData({
          // formatted_addresses: res.result.formatted_addresses.recommend,
          pois: res.result.pois,
          'map.markers': markers,
          location: res.result.location
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
    });
  },
  checkPoi: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if(index == -1){
      that.setData({
        check: index,
        'map.longitude': that.data.location.lng,
        'map.latitude': that.data.location.lat,
        'map.markers': []
      })
    }else{
      that.setData({
        check: index,
        'map.longitude': that.data.pois[index].location.lng,
        'map.latitude': that.data.pois[index].location.lat,
        'map.markers': [{
          id: 0,
          latitude: that.data.pois[index].location.lat,
          longitude: that.data.pois[index].location.lng,
          iconPath: '../../images/point.png',
          width: 24,
          height: 24,
          anchor: {
            x: .5,
            y: .5
          }
        }]
      })
    }
  },
  markertap: function(e){
    // console.log(e.markerId)
    var that = this;
    var i = e.markerId;
    that.setData({
      formatted_addresses: that.data.pois[e.markerId].address
      // 'map.markers[i].iconPath': '../../images/tag_blue.png'
    })
  },
  aaaa: function(){
    console.log(1)
  }
})
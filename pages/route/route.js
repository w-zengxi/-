// pages/route.js
const config = require('../../utils/config.js')
Page({
//页面的初始数据
  data: {
    map: {
      longitude: '',
      latitude: '',
      markers: [],
      polyline: []
    },
    travel: 0,
    origin: '',
    destination: ''
  },
//生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var place = JSON.parse(options.place)
    that.setData({
      'map.markers': [{
        id: 0,
        latitude: place.location.lat,
        longitude: place.location.lng,
        title: '吉山小学',
        width: 40,
        height: 40,
        iconPath: '/images/sign.png'
      }],
      place: place,
      destination: place.location.lat + ',' + place.location.lng
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        that.setData({
          'map.longitude': res.longitude,
          'map.latitude': res.latitude,
        })
        that.setData({
          origin: res.latitude + ',' + res.longitude
        })
        that.goToCar()
      },
    })
  },
//生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
//生命周期函数--监听页面显示
  onShow: function () {
  },
//生命周期函数--监听页面隐藏
  onHide: function () {
  },
//生命周期函数--监听页面卸载
  onUnload: function () {
  },
//页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
  },
//页面上拉触底事件的处理函数
  onReachBottom: function () {
  },
//用户点击右上角分享
  onShareAppMessage: function () {
  
  },
  // 选择出行方式
  selectStrategy (e) {
    var that = this;
    that.setData({
      travel: e.currentTarget.dataset.strategy
    })
    switch (e.currentTarget.dataset.strategy) {
      case '0':
        that.goToCar();
        break;
      case '1':
        that.goToBus();
        break;
      case '2':
        that.goToRide();
        break;
      case '3':
        that.goToWalk();
        break;
    }
  },
  // 驾车
  goToCar: function () {
    var that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${that.data.origin}&to=${that.data.destination}&config=${config.qqKey}`,
      success: function (res) {
        var coors = res.data.result.routes[0].polyline
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        //划线
        var b = [];
        for (var i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          'map.polyline': [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
        if (res.data.result.routes[0].distance){
          var distance = parseInt(res.data.result.routes[0].distance);
          if (distance >= 1000){
            distance = distance / 1000
            that.setData({
              distance: '约' + distance.toFixed(1) + '公里'
            });
          }else{
            that.setData({
              distance: '约' + distance + '米'
            });
          }
        }
        if (res.data.result.routes[0].taxi_fare.fare) {
          that.setData({
            cost: '打车约' + parseInt(res.data.result.routes[0].taxi_fare.fare) + '元'
          });
        }
      }
    })
  },
  // 公交
  goToBus: function () {
    var that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/transit/?from=${that.data.origin}&to=${that.data.destination}&key=${config.qqKey}`,
      success: function (res) {
        console.log(res)
        var coors = res.data.result.routes[0].steps.polyline
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        // console.log(coors)
        //划线
        var b = [];
        for (var i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          'map.polyline': [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
      }
    })
  },
  // 骑行
  goToRide: function () {
    var that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/bicycling/?from=${that.data.origin}&to=${that.data.destination}&key=${config.qqKey}`,
      success: function (res) {
        var coors = res.data.result.routes[0].polyline
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        // console.log(coors)
        //划线
        var b = [];
        for (var i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          'map.polyline': [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
      }
    })
  },
  // 步行
  goToWalk: function () {
    var that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/walking/?from=${that.data.origin}&to=${that.data.destination}&key=${config.qqKey}`,
      success: function (res) {
        var coors = res.data.result.routes[0].polyline
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        // console.log(coors)
        //划线
        var b = [];
        for (var i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          'map.polyline': [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
      }
    })
  },
  // 打开详情
  openInfo: function () {

  },
  // 导航
  mapNavigation: function(){
    var that = this;
    wx.openLocation({
      latitude: that.data.place.location.lat,
      longitude: that.data.place.location.lng,
      name: that.data.place.title,
      address: that.data.place.address,
      scale: 28
    })
  },

  moveToLocation: function () {
    var that = this;
    that.mapCtx.moveToLocation()
  }
})
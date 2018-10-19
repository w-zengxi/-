// pages/route.js
Page({
//页面的初始数据
  data: {
    longitude: '',
    latitude: '',
    longitude2: '',
    latitude2: '',
    markers: [],
    polyline: [],
    travel: 0
  },
//生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    let { latitude, longitude, latitude2, longitude2, title, address } = options;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    if (latitude2 && longitude2) {
      that.setData({
        longitude,
        latitude,
        longitude2,
        latitude2,
        title,
        address,
        markers: [{
          id: 0,
          latitude: latitude,
          longitude: longitude,
          title: '',
          width: 40,
          height: 40,
          iconPath: '/images/route_origin.png'
        },
        {
          id: 1,
          latitude: latitude2,
          longitude: longitude2,
          title: title,
          width: 40,
          height: 40,
          iconPath: '/images/route_destination.png'
        }],
        destination_title: title
      })
      that.goToCar()
    }
  },
//生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    let that = this;
    that.mapCtx = wx.createMapContext('map');
    that.includePoints();
  },
  // 打开详情
  openSite: function () {
    wx.navigateTo({
      url: '../site/site'
    })
  },
  // 导航
  mapNavigation: function () {
    let that = this;
    wx.openLocation({
      latitude: that.data.place.location.lat,
      longitude: that.data.place.location.lng,
      name: that.data.place.title,
      address: that.data.place.address,
      scale: 28
    })
  },
  // 将地图中心移动到当前定位点
  moveToLocation: function () {
    let that = this;
    that.mapCtx.moveToLocation()
  },
  // 自动缩放视野展示所有经纬度
  includePoints: function () {
    let that = this;
    let { latitude, longitude, latitude2, longitude2 } = that.data;
    console.log(latitude, longitude, latitude2, longitude2)
    let points = [
      {
        latitude: latitude,
        longitude: longitude
      }, {
        latitude: latitude2,
        longitude: longitude2
      }
    ]
    that.mapCtx.includePoints({
      points: points
    })
  },
  // 选择出行方式
  selectStrategy (e) {
    let that = this;
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
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    let { latitude, longitude, latitude2, longitude2} = that.data;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${latitude},${longitude}&to=${latitude2},${longitude2}&output=json&callback=cb&key=A7LBZ-VSBKO-L7KWS-SNPXQ-WQPKT-ZRFA4`,
      success: function (res) {
        console.log(res)
        let coors = res.data.result.routes[0].polyline
        for (let i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        //划线
        let b = [];
        for (let i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          polyline: [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
        if (res.data.result.routes[0].distance){
          let distance = parseInt(res.data.result.routes[0].distance);
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
        wx.hideLoading();
      }
    })
  },
  // 公交
  goToBus: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    let { latitude, longitude, latitude2, longitude2} = that.data;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/transit/?from=${latitude},${longitude}&to=${latitude2},${longitude2}&output=json&callback=cb&key=A7LBZ-VSBKO-L7KWS-SNPXQ-WQPKT-ZRFA4`,
      success: function (res) {
        console.log(res.data.result)
        // let coors = res.data.result.routes[0].steps.polyline
        // for (let i = 2; i < coors.length; i++) {
        //   coors[i] = coors[i - 2] + coors[i] / 1000000
        // }
        // // console.log(coors)
        // //划线
        // let b = [];
        // for (let i = 0; i < coors.length; i = i + 2) {
        //   b[i / 2] = {
        //     latitude: coors[i], longitude: coors[i + 1]
        //   };
        //   // console.log(b[i / 2])
        // }
        // that.setData({
        //   polyline: [{
        //     points: b,
        //     color: "#FF0000DD",
        //     width: 5
        //   }]
        // })
      }
    })
  },
  // 骑行
  goToRide: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    let { latitude, longitude, latitude2, longitude2} = that.data;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/bicycling/?from=${latitude},${longitude}&to=${latitude2},${longitude2}&output=json&callback=cb&key=A7LBZ-VSBKO-L7KWS-SNPXQ-WQPKT-ZRFA4`,
      success: function (res) {
        console.log(res)
        // let coors = res.data.result.routes[0].polyline
        // for (let i = 2; i < coors.length; i++) {
        //   coors[i] = coors[i - 2] + coors[i] / 1000000
        // }
        // // console.log(coors)
        // //划线
        // let b = [];
        // for (let i = 0; i < coors.length; i = i + 2) {
        //   b[i / 2] = {
        //     latitude: coors[i], longitude: coors[i + 1]
        //   };
        //   // console.log(b[i / 2])
        // }
        // that.setData({
        //   polyline: [{
        //     points: b,
        //     color: "#FF0000DD",
        //     width: 5
        //   }]
        // })
        wx.hideLoading();
      }
    })
  },
  // 步行
  goToWalk: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    let { latitude, longitude, latitude2, longitude2} = that.data;
    wx.request({
      url: `https://apis.map.qq.com/ws/direction/v1/walking/?from=${latitude},${longitude}&to=${latitude2},${longitude2}&output=json&callback=cb&key=A7LBZ-VSBKO-L7KWS-SNPXQ-WQPKT-ZRFA4`,
      success: function (res) {
        let coors = res.data.result.routes[0].polyline
        for (let i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        // console.log(coors)
        //划线
        let b = [];
        for (let i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i], longitude: coors[i + 1]
          };
          // console.log(b[i / 2])
        }
        that.setData({
          polyline: [{
            points: b,
            color: "#FF0000DD",
            width: 5
          }]
        })
        wx.hideLoading();
      }
    })
  }
})
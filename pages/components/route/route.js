// pages/components/route/route.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectStrategy(e) {
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
          if (res.data.result.routes[0].distance) {
            var distance = parseInt(res.data.result.routes[0].distance);
            if (distance >= 1000) {
              distance = distance / 1000
              that.setData({
                distance: '约' + distance.toFixed(1) + '公里'
              });
            } else {
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
    }
  }
})

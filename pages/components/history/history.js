// pages/components/history/history.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    history: {
      type: Array
    },
    latitude: {
      type: String
    },
    longitude: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historys: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 打开路线规划
    routePlanning: function (e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let { latitude, longitude, history } = that.data;
      let url = `/pages/route/route?latitude=${latitude}&longitude=${longitude}&latitude2=${history[index].location.lat}&longitude2=${history[index].location.lng}&title=${history[index].title}&address=${history[index].address}`;
      wx.navigateTo({ url })
    },
    // 查看地点
    viewPlace: function (e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let { history } = that.data;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        latitude2: history[index].location.lat,
        longitude2: history[index].location.lng,
        markers: [{
          id: history[index].id,
          latitude: history[index].location.lat,
          longitude: history[index].location.lng,
          title: history[index].title,
          width: 40,
          height: 40,
          iconPath: '/images/place.png'
        }],
        positionData: {
          title: history[index].title,
          address: history[index].address
        }
      })
      that.recordHistory(index)
      let url = `/pages/index/index`
      wx.navigateBack(-1)
    },
    // 记录历史
    recordHistory: function (index) {
      let that = this;
      let { history } = that.data;
      history.unshift(history[index]);
      // 去重
      for (let i = 0; i < history.length; i++) {
        for (let j = i + 1; j < history.length; j++) {
          if (history[i].id == history[j].id) {
            history.splice(j, 1)
          }
        }
      }
      if (history.length > 5) {
        history.splice(5)
      }
      that.setData({
        history
      })
      wx.setStorageSync('history', JSON.stringify(history))
    },
    // 清除历史记录
    clearHistory: function () {
      let that = this;
      let { history} = that.data;
      wx.removeStorageSync('history')
      that.triggerEvent('clearHistory', history)
    }
  }
})

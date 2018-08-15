// pages/components/history/history.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    history: {
      type: Array
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
    // 打开地点
    viewPlace: function (e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var history = that.data.history;
      var place = '';
      history.unshift(history[index]);
      place = history[index];
      // 去除重复的历史记录
      for (var i = 0; i < history.length; i++) {
        for (var j = i + 1; j < history.length; j++) {
          if (history[i].id == history[j].id) {
            history.splice(j, 1)
          }
        }
      }
      // 限定历史记录的长度为5
      if (history.length > 5) {
        history.splice(5)
      }
      that.setData({
        history: history
      })
      wx.setStorageSync('history', JSON.stringify(history))
      console.log(place)
      wx.redirectTo({
        url: '../place/place?place=' + JSON.stringify(place)
      })
    },
    // 打开路线规划
    routePlanning: function (e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: '../route/route?place=' + JSON.stringify(that.data.history[index])
      })
    },
    // 清除历史记录
    clearHistory: function () {
      var that = this;
      wx.removeStorageSync('history')
      this.triggerEvent('clearHistory', this.data.historys)
    }
  }
})

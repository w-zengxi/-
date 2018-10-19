// search.js
const Qmap = require('../../utils/qqmap.js')
Page({
  // 页面的初始数据
  data: {
    keyword: '',
    city: '',
    latitude: '',
    longitude: '',
    history: [],
    sugData: [],
    page_size: 10,
    page_index: 1,
    poi: false
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    let { city, latitude, longitude } = options;
    let history = wx.getStorageSync('history'); // 获取历史记录
    that.setData({
      city,
      latitude,
      longitude,
      history: JSON.parse(history)
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    let that = this;
    let { keyword, page_index, poi } = that.data;
    if (poi) {
      page_index++;
      that.Search(keyword, page_index)
      that.setData({
        page_index
      })
    }
  },
  // 绑定input输入（输入预测）搜索地点
  bindKeyInput: function (e) {
    let that = this;
    let { city } = that.data;
    that.setData({
      keyword: e.detail.value,
      sugData: [],
      poi: false
    })
    Qmap.getSuggestion(e.detail.value, city).then(res => {
      that.setData({
        sugData: res.data
      })
      console.log(res)
    }).catch(res => {
      that.setData({
        sugData: []
      })
    })
  },
  // 搜附近
  searchPoi: function (e) {
    let that = this;
    let { keyword } = that.data;
    that.setData({
      sugData: [],
      poi: true
    })
    that.Search(keyword, 1)
  },
  Search: function (keyword, pageindex) {
    let that = this;
    let { sugData } = that.data;
    console.log(keyword, pageindex)
    Qmap.getPoi(keyword, pageindex).then(res => {
      console.log(res)
      if (res.data.length != 0) {
        res.data.forEach(function (item, index, array) {
          sugData.push(item);
        })
        that.setData({
          sugData
        })
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(res => {
      that.setData({
        sugData: []
      })
    })
  },
  // 打开地点并添加到历史记录
  viewPlace: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let { sugData } = that.data
    let pages = getCurrentPages();
    console.log(pages)
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      latitude2: sugData[index].location.lat,
      longitude2: sugData[index].location.lng,
      markers: [{
        id: sugData[index].id,
        latitude: sugData[index].location.lat,
        longitude: sugData[index].location.lng,
        title: sugData[index].title,
        width: 40,
        height: 40,
        iconPath: '/images/place.png'
      }],
      positionData: {
        title: sugData[index].title,
        address: sugData[index].address
      }
    })
    that.recordHistory(index)
    let url = `/pages/index/index`
    wx.navigateBack(-1)
  },
  // 记录历史
  recordHistory: function (index) {
    let that = this;
    let { sugData, history } = that.data
    history.unshift(sugData[index]);
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
  // 清空搜索框
  clearInput: function () {
    let that = this;
    that.setData({
      keyword: '',
      sugData: []
    })
  },
  // 清除历史记录
  clearHistory: function () {
    let that = this;
    that.setData({
      history: []
    })
  }
})
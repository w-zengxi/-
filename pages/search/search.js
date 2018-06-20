// search.js
const config = require('../../utils/config.js')
const qqmap = require('../../lib/qqmap-wx-jssdk.min.js');
const qqMap = new qqmap({ key: config.qqKey})
Page({
  // 页面的初始数据
  data: {
    sugData: [],
    city: '',
    address: ''
  },
  // 绑定input输入（输入预测）
  bindKeyInput: function(e) {
    var that = this;
    var sugData = [];
    var value = e.detail.value;
    that.setData({
      address: value
    })
    qqMap.getSuggestion({
      keyword: e.detail.value,
      region: that.data.city,
      policy: 1,
      success: function (res) {
        sugData = res.data;
        that.setData({
          sugData: sugData
        })
      },
      fail: function (res) {
        sugData = [];
        that.setData({
          sugData: sugData
        })
        console.log(res);
      },
      complete: function (res) {
      }
    })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'city',
      success: function(res){
        var city = res.data
        that.setData({
          city: city
        })
      },
      fail: function(res){
        comsole.log(res)
      }
    })
  },

  //  生命周期函数--监听页面初次渲染完成
  onReady: function () {
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
  },
  //  生命周期函数--监听页面隐藏
  onHide: function () {
  },
  // 生命周期函数--监听页面卸载
  onUnload: function () {
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
  
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
  
  },

  //  用户点击右上角分享
  onShareAppMessage: function () {
  
  },
  // 向上一个页面传值
  // navigateBackFunc: function (e) {
  //   var that = this
  //   var pages = getCurrentPages()
  //   var prevPage = pages[pages.length - 1]  //当前界面
  //   var prevPage = pages[pages.length - 2]  //上一个页面
  //   prevPage.setData({
  //     address: e.currentTarget.dataset.adress
  //   })
  //   wx.navigateBack()
  // }
  // placeSearch: function () {
  //   var that = this;
  //   qqMap.getSuggestion({
  //     keyword: that.data.address,
  //     region: that.data.city,
  //     success: function (res) {
  //       console.log(res)
  //       // if (result){
  //       //   that.setData({
  //       //     sugData: result
  //       //   })
  //       // }
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //     },
  //     complete: function (res) {
  //       // console.log(res);
  //     }
  //   })
  // },
  viewPlace: function (e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(that.data.sugData[index])
    wx.navigateTo({
      url: '../place/place?place=' + JSON.stringify(that.data.sugData[index])
    })
  },
  routePlanning: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../route/route?place=' + JSON.stringify(that.data.sugData[index])
    })
  }
})
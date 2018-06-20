//place.js
Page({
  data: {
    map: {
      longitude: '',
      latitude: '',
      markers: [],
      scale: '14'
    }
  },
  onLoad: function (options) {
    var that = this;
    var data = JSON.parse(options.place)
    that.setData({
      place: data
    })
    var marker = [{
      id: data.id,
      latitude: data.location.lat,
      longitude: data.location.lng,
      title: data.title,
      width: 28,
      height: 28,
      iconPath: '/images/sign.png',
    }]
    that.setData({
      address: data,
      'map.markers': marker,
      'map.longitude': data.location.lng,
      'map.latitude': data.location.lat
    })
  }
})
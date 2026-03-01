const raceData = require('../../data/races.js');

Page({
  data: {
    raceList: []
  },

  onLoad() {
    // 页面加载时，把全部赛事数据塞进列表里
    this.setData({
      raceList: raceData
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 点击卡片跳转到详情页
  goToDetail(e) {
    const raceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/race-detail/race-detail?id=${raceId}`
    });
  }
})
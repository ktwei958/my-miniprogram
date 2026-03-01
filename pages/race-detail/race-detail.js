// 1. 引入全局的赛事数据库
const raceData = require('../../data/races.js');

Page({
  data: {
    currentTab: 'detail',
    currentGroupIndex: 0,
    raceInfo: null // 初始设为空，等加载时再填入真实数据
  },

  // ✨ 核心生命周期函数：页面加载时触发
  onLoad(options) {
    // options.id 就是首页传过来的 "race_001" 或 "race_002"
    const targetId = options.id;
    console.log("详情页接收到的赛事ID：", targetId);

    // 在数据库中寻找 ID 匹配的那个赛事对象
    const foundRace = raceData.find(item => item.id === targetId);

    if (foundRace) {
      // 找到了！把数据塞进页面的 data 里，开始渲染！
      this.setData({
        raceInfo: foundRace,
        currentGroupIndex: 0 // 默认选中该比赛的第一个组别
      });
    } else {
      console.error("糟了，没找到对应的赛事数据！");
    }
  },

  goBack() {
    wx.navigateBack();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  switchGroup(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentGroupIndex: index });
  }
})
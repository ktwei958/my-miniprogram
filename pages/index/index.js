// pages/index/index.js

// 【引入数据】：通过相对路径找到刚才那个文件
const raceData = require('../../data/races.js');
// ✨ 新增：获取小程序的全局实例（也就是咱们的“全局公告板”）
const app = getApp();

Page({
  data: {
    // 直接把引入的数据赋值给页面的 raceList 变量
    raceList: raceData,
    
    // ✨ 新增：控制顶部 UI 状态的变量
    isConnected: false,
    deviceName: 'AST的\nRMB PRO' 
  },

  onShow() {
    // 隐藏微信官方原生的底部栏，只用我们自己画的 custom-tabbar
    wx.hideTabBar(); 
    
    // ... 保持你原本的判断登录连接状态的代码不变
    if (app.globalData && app.globalData.isConnected) {
      this.setData({
        isConnected: true,
        deviceName: app.globalData.deviceName || 'AST的\nRMB PRO'
      });
    }
    
    // 监听蓝牙连接状态变化
    this.listenBluetoothState();
  },
  
  // 监听蓝牙连接状态变化
  listenBluetoothState() {
    wx.onBLEConnectionStateChange((res) => {
      console.log('蓝牙连接状态变化', res);
      // 更新全局数据
      app.globalData.isConnected = res.connected;
      // 更新页面数据
      this.setData({
        isConnected: res.connected
      });
      // 如果断开连接，显示提示
      if (!res.connected) {
        wx.showToast({
          title: '设备已断开连接，请重新搜索连接',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  goToConnect() {
    wx.navigateTo({ url: '/pages/ble-connect/ble-connect' });
  },

  goToMore() {
    wx.navigateTo({ url: '/pages/race-list/race-list' });
  },

  goToDetail(e) {
    const raceId = e.currentTarget.dataset.id;
    console.log("👉 第一步：检测到点击！拿到的赛事ID是：", raceId);

    wx.navigateTo({
      // 这里的路径必须和 app.json 里配置的一模一样
      url: `/pages/race-detail/race-detail?id=${raceId}`,
      success: function() {
        console.log("✅ 第二步：跳转页面成功！");
      },
      fail: function(err) {
        console.error("❌ 第二步：跳转失败！微信给出的原因是：", err);
      }
    });
  },

  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
  
})
const app = getApp(); // 引入全局公告板

Page({
  data: {
    isLoggedIn: false, // 是否已登录
    userName: ''
  },

  onShow() {
    wx.hideTabBar(); 

    // ... 保持原本的登录判断代码不变
    if (app.globalData && app.globalData.isLoggedIn) {
      this.setData({
        isLoggedIn: true,
        userName: app.globalData.userName || 'AST 探险家_007'
      });
    }
  },

  // 点击顶部名片栏
  handleCardClick() {
    if (!this.data.isLoggedIn) {
      // 如果没登录，跳转到专门的登录页面 (咱们下一步就建这个页面)
      wx.navigateTo({
        url: '/pages/login/login' 
      });
    } else {
      // 如果已登录，可以跳转到个人资料编辑页
      wx.showToast({ title: '查看个人资料', icon: 'none' });
    }
  },

  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
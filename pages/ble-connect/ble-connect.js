Page({
  data: {
    isSearching: true, // 控制雷达动画的状态
    deviceList: [] // 空数组，用于存储搜索到的设备
  },

  onLoad() {
    console.log("进入设备连接页面，开始搜索...");
    this.initBluetooth();
  },

  onUnload() {
    // 页面卸载时停止蓝牙搜索
    wx.stopBluetoothDevicesDiscovery();
  },

  goBack() {
    wx.navigateBack();
  },

  // 初始化蓝牙适配器
  initBluetooth() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('蓝牙适配器初始化成功', res);
        this.startBluetoothDiscovery();
      },
      fail: (res) => {
        console.error('蓝牙适配器初始化失败', res);
        wx.showToast({
          title: '蓝牙初始化失败',
          icon: 'none'
        });
        this.setData({ isSearching: false });
      }
    });
  },

  // 开始搜索蓝牙设备
  startBluetoothDiscovery() {
    wx.startBluetoothDevicesDiscovery({
      services: [], // 搜索所有服务
      allowDuplicatesKey: false,
      success: (res) => {
        console.log('开始搜索蓝牙设备', res);
        this.onBluetoothDeviceFound();
      },
      fail: (res) => {
        console.error('搜索蓝牙设备失败', res);
        wx.showToast({
          title: '搜索设备失败',
          icon: 'none'
        });
        this.setData({ isSearching: false });
      }
    });
  },

  // 监听蓝牙设备发现
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      const devices = res.devices;
      console.log('发现蓝牙设备', devices);
      
      // 过滤掉没有名称或信号强度的设备
      const validDevices = devices.filter(device => {
        return device.name && device.RSSI;
      });
      
      // 更新设备列表
      if (validDevices.length > 0) {
        this.setData({
          deviceList: [...this.data.deviceList, ...validDevices]
        });
      }
    });
  },

  // 点击连接按钮的交互
  connectDevice(e) {
    const app = getApp(); // 获取全局公告板
    const deviceId = e.currentTarget.dataset.id;
    const deviceName = e.currentTarget.dataset.name;
    
    // 1. 停止搜索
    wx.stopBluetoothDevicesDiscovery();
    
    // 2. 弹出加载圈，正在连接蓝牙
    wx.showLoading({
      title: '正在连接...',
      mask: true
    });

    // 3. 连接设备
    wx.createBLEConnection({
      deviceId: deviceId,
      success: (res) => {
        console.log('连接蓝牙设备成功', res);
        wx.hideLoading(); // 关掉加载圈
        wx.showToast({ title: '连接成功', icon: 'success' }); // 弹出成功提示
        
        // 4. 核心：修改全局变量，记录已连接的设备信息
        app.globalData.isConnected = true;
        app.globalData.deviceName = deviceName.replace('-', '的\n'); // 比如 AST的\nUltra-01
        app.globalData.deviceId = deviceId;

        // 5. 延迟 1 秒后，自动退回主页面
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      },
      fail: (res) => {
        console.error('连接蓝牙设备失败', res);
        wx.hideLoading();
        wx.showToast({
          title: '连接失败，请重试',
          icon: 'none'
        });
        // 重新开始搜索
        this.startBluetoothDiscovery();
      }
    });
  }
})
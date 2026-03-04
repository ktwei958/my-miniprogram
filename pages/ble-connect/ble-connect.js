Page({
  data: {
    isSearching: true, // 控制雷达动画的状态
    deviceList: [] // 空数组，用于存储搜索到的设备
  },

  onLoad() {
    console.log("进入设备连接页面，开始搜索...");
    // 重置全局连接状态
    const app = getApp();
    app.globalData.isConnected = false;
    app.globalData.deviceId = '';
    app.globalData.deviceName = '';
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
        // 先停止之前可能正在进行的搜索
        wx.stopBluetoothDevicesDiscovery({
          success: () => {
            console.log('停止之前的搜索成功');
            // 延迟一下再开始新的搜索，确保状态正确
            setTimeout(() => {
              this.startBluetoothDiscovery();
            }, 500);
          },
          fail: () => {
            console.log('停止之前的搜索失败，可能没有正在进行的搜索');
            // 直接开始新的搜索
            this.startBluetoothDiscovery();
          }
        });
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
    // 清空设备列表
    this.setData({ deviceList: [] });
    console.log('准备开始搜索蓝牙设备');
    wx.startBluetoothDevicesDiscovery({
      services: [], // 搜索所有服务
      allowDuplicatesKey: true, // 允许重复上报，确保能捕获到设备状态变化
      success: (res) => {
        console.log('开始搜索蓝牙设备', res);
        // 重新注册设备发现监听器，确保监听器是最新的
        this.onBluetoothDeviceFound();
        // 设置搜索超时，避免一直搜索
        setTimeout(() => {
          wx.stopBluetoothDevicesDiscovery({
            success: () => {
              console.log('搜索超时，停止搜索');
              // 如果没有找到设备，提示用户
              if (this.data.deviceList.length === 0) {
                wx.showToast({
                  title: '未找到设备，请确保设备已开机并靠近手机',
                  icon: 'none'
                });
              }
            }
          });
        }, 15000); // 15秒后停止搜索
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
    // 先移除之前可能存在的监听器，避免重复注册
    wx.offBluetoothDeviceFound();
    
    wx.onBluetoothDeviceFound((res) => {
      const devices = res.devices;
      console.log('发现蓝牙设备', devices);
      
      // 过滤掉没有名称或信号强度的设备
      const validDevices = devices.filter(device => {
        return device.name && device.RSSI;
      });
      
      // 设备去重，基于deviceId
      if (validDevices.length > 0) {
        const currentDeviceIds = new Set(this.data.deviceList.map(device => device.deviceId));
        const newDevices = validDevices.filter(device => !currentDeviceIds.has(device.deviceId));
        
        if (newDevices.length > 0) {
          this.setData({
            deviceList: [...this.data.deviceList, ...newDevices]
          });
          console.log('设备列表更新', this.data.deviceList);
        }
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
        
        // 4. 获取设备服务
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: (servicesRes) => {
            console.log('获取设备服务成功', servicesRes);
            
            // 5. 遍历服务，找到需要的服务
            servicesRes.services.forEach(service => {
              console.log('服务 UUID:', service.uuid);
              
              // 6. 获取服务的特征值
              wx.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: service.uuid,
                success: (characteristicsRes) => {
                  console.log('获取特征值成功', characteristicsRes);
                  
                  // 7. 遍历特征值，找到可读写和通知的特征
                  characteristicsRes.characteristics.forEach(characteristic => {
                    console.log('特征 UUID:', characteristic.uuid);
                    console.log('是否可写:', characteristic.properties.write);
                    console.log('是否可读:', characteristic.properties.read);
                    console.log('是否可通知:', characteristic.properties.notify);
                    
                    // 8. 如果特征支持通知，订阅通知
                    if (characteristic.properties.notify) {
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: deviceId,
                        serviceId: service.uuid,
                        characteristicId: characteristic.uuid,
                        state: true,
                        success: (notifyRes) => {
                          console.log('订阅通知成功', notifyRes);
                        },
                        fail: (notifyErr) => {
                          console.error('订阅通知失败', notifyErr);
                        }
                      });
                    }
                  });
                },
                fail: (characteristicsErr) => {
                  console.error('获取特征值失败', characteristicsErr);
                }
              });
            });
            
            // 9. 核心：修改全局变量，记录已连接的设备信息
            app.globalData.isConnected = true;
            app.globalData.deviceName = deviceName.replace('-', '的\n'); // 比如 AST的\nUltra-01
            app.globalData.deviceId = deviceId;

            // 10. 监听特征值变化
            wx.onBLECharacteristicValueChange((characteristicRes) => {
              console.log('收到蓝牙数据:', characteristicRes);
              // 这里可以处理接收到的数据
            });

            // 11. 关闭加载圈，显示成功提示
            wx.hideLoading();
            wx.showToast({ title: '连接成功并已订阅服务', icon: 'success' });

            // 12. 延迟 1 秒后，自动退回主页面
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          },
          fail: (servicesErr) => {
            console.error('获取设备服务失败', servicesErr);
            wx.hideLoading();
            wx.showToast({
              title: '获取服务失败',
              icon: 'none'
            });
            // 重新开始搜索
            this.startBluetoothDiscovery();
          }
        });
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
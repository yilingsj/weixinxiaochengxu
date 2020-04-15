// components/downloadFile/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    res: '',
    canvasWidth: 640,
    canvasHeight: 884,
    data: [],
    poster: {
      avatar: 'https://card-cdn-test.5ifengdu.com/upfile/ueditor/image/website/202002/25/1582601559_7yQZz21zYi.png',
      qrCode: 'https://img.alicdn.com/imgextra/i4/759415648/O1CN01uL5CUw1rapSLOfSRv_!!759415648.png',
      bg: 'https://card-cdn-test.5ifengdu.com/ali/default/202002/19/1582079748940_5724656727.img'
    }, // 海报信息
    tempFilePath: {}, // 缓存数据
    isDisabled: false // 防频繁操作
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* wx.downloadFile方法下载图片 */
    handleDownloadFile () {
      wx.showLoading({
        title: '正在生成海报'
      });
      this.setDisabled(true); /* 设置禁用状态，配合css */
      wx.downloadFile({
        url: this.data.poster.avatar, /* 头像地址 */
        success: (res) => {
          this.setData({
            'tempFilePath.avatar': res.tempFilePath
          });
          wx.downloadFile({
            url: this.data.poster.bg, /* 背景地址 */
            success: (res) => {
              this.setData({
                'tempFilePath.bg': res.tempFilePath
              });
              wx.downloadFile({
                url: this.data.poster.qrCode, /* 二维码 */
                success: (res) => {
                  this.setData({
                    'tempFilePath.qrCode': res.tempFilePath,
                    res: JSON.stringify(res)
                  });
                  this.draw(); /* 调用封闭的绘图方法 */
                },
                fail: (err) => {
                  console.log('qrCode fail=', err); /* 打印二维码的错误信息 */
                  const errMsg = this.formatError(err); /* 封闭一个转换err错误信息的函数，方便弹窗中显示 */
                  wx.hideLoading(); /* 隐藏loading提示 */
                  this.setDisabled(false); /* 清除禁用状态，用户可再次点击 */
                  wx.showModal({
                    title: '提示',
                    content: 'qrCode fail=' + errMsg,
                    showCancel: false
                  });
                }
              });
            },
            fail: (err) => {
              console.log('bg fail=', err);
              const errMsg = this.formatError(err);
              wx.hideLoading();
              this.setDisabled(false);
              wx.showModal({
                title: '提示',
                content: 'bg fail=' + errMsg,
                showCancel: false
              });
            }
          });
        },
        fail: (err) => {
          console.log('avatar fail=', err);
          let errMsg = this.formatError(err);
          this.setDisabled(false);
          wx.hideLoading();
          /* 验证是否禁用了存储空间 start */
          if (errMsg.match(/downloadFile:fail download fail:1001/)) {
            errMsg = '请在设置中开启微信的存储空间权限';
          }
          /* 验证是否禁用了存储空间 end */
          wx.showModal({
            title: '提示',
            content: 'avatar fail=' + errMsg,
            showCancel: false
          });
        }
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: wx.getImageInfo方法 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html
     * @return {void}
     * @Date: 2020-03-31 21:35:43
     */
    handleGetImageInfo () {
      // this.getWritePhotosAlbum()
      wx.showLoading({
        title: '正在生成海报',
      });
      this.setDisabled(true);
      wx.getImageInfo({
        src: this.data.poster.avatar,
        success: (res) => {
          this.setData({
            'tempFilePath.avatar': res.path
          });
          wx.getImageInfo({
            src: this.data.poster.bg,
            success: (res) => {
              this.setData({
                'tempFilePath.bg': res.path
              });
              wx.getImageInfo({
                src: this.data.poster.qrCode,
                success: (res) => {
                  this.setData({
                    'tempFilePath.qrCode': res.path
                  });
                  this.draw();
                },
                fail: (err) => {
                  console.log('getImageInfo qrCode fail=', err);
                  const errMsg = this.formatError(err);
                  wx.hideLoading();
                  this.setDisabled(false);
                  wx.showModal({
                    title: '提示',
                    content: 'qrCode fail=' + errMsg,
                    showCancel: false
                  });
                }
              });
            },
            fail: (err) => {
              console.log('getImageInfo bg fail=', err);
              const errMsg = this.formatError(err);
              wx.hideLoading();
              this.setDisabled(false);
              wx.showModal({
                title: '提示',
                content: 'bg fail=' + errMsg,
                showCancel: false
              });
            }
          });
        },
        fail: (err) => {
          console.log('getImageInfo avatar fail=', err)
          const errMsg = this.formatError(err);
          wx.hideLoading();
          this.setDisabled(false);
          wx.showModal({
            title: '提示',
            content: 'avatar fail=' + errMsg,
            showCancel: false
          });
        }
      });
    },
    /* 设置禁用状态 */
    setDisabled (status) {
      this.setData({
        isDisabled: status /* WXML页面中调用样式*/
      });
    },
    /* 把图片绘到画布上 */
    draw () {
      const poster = this.data.tempFilePath;
      const ctx = wx.createCanvasContext('my-canvas', this);
      ctx.width = this.data.canvasWidth;
      ctx.height = this.data.canvasHeight;
      ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
      ctx.drawImage(poster.bg, 0, 0, this.data.canvasWidth, this.data.canvasHeight);
      ctx.drawImage(poster.avatar, 20, 500, 40, 40);
      ctx.drawImage(poster.qrCode, 140, 350, 100, 100);
      ctx.draw(false, () => {
        this.handleCanvasToTempFilePath();
      });
    },
    /* 将画布导出成图片 */
    handleCanvasToTempFilePath () {
      wx.canvasToTempFilePath({
        canvasId: 'my-canvas',
        width: this.data.canvasWidth,
        height: this.data.canvasHeight,
        success: (res) => {
          wx.previewImage({ /* 预览图片 */
            urls: [res.tempFilePath],
            current: res.tempFilePath
          });
          wx.hideLoading();
          this.setDisabled(false);
        },
        fail: (err) => {
          this.setDisabled(false);
          wx.showModal({
            title: '提示',
            content: '生成商品海报失败',
            showCancel: false,
            success: () => {
              wx.hideLoading();
            }
          });
        }
      }, this); /* 若canvas在组件中，必须带上this！ */
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 格式化错误信息
     * @param {Object} err
     * @return {void}
     * @Date: 2020-04-02 22:08:16
     */
    formatError (err) {
      let errMsg = err;
      if (typeof err === 'object') {
        errMsg = JSON.stringify(err);
      }
      return errMsg;
    }
  }
})

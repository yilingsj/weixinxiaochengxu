/*
 * @Description: 
 * @Author: yilingsj（315800015@qq.com）
 * @Date: 2020-04-06 13:59:44
 * @LastEditors: yilingsj（315800015@qq.com）
 * @LastEditTime: 2020-04-06 20:50:37
 */
// components/writePhotosAlbum/index.js
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
    canvasWidth: 640,
    canvasHeight: 884,
    data: [],
    poster: {
      avatar: 'https://card-cdn-test.5ifengdu.com/upfile/ueditor/image/website/202002/25/1582601559_7yQZz21zYi.png',
      qrCode: 'https://img.alicdn.com/imgextra/i4/759415648/O1CN01uL5CUw1rapSLOfSRv_!!759415648.png',
      bg: 'https://card-cdn-test.5ifengdu.com/ali/default/202002/19/1582079748940_5724656727.img'
    }, // 海报信息
    tempFilePath: {}, // 缓存数据
    isDisabled: false, // 防频繁操作
    isDisabledSave: false, // 防频繁操作
    src: '' // 生成图片后预览的地址
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: wx.downloadFile方法 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html
     * @return {void}
     * @Date: 2020-03-31 21:27:38
     */
    handleDownloadFile() {
      wx.showLoading({
        title: '正在生成海报',
      });
      this.setDisabled(true);
      wx.downloadFile({
        url: this.data.poster.avatar,
        success: (res) => {
          this.setData({
            'tempFilePath.avatar': res.tempFilePath
          });
          wx.downloadFile({
            url: this.data.poster.bg,
            success: (res) => {
              this.setData({
                'tempFilePath.bg': res.tempFilePath
              });
              wx.downloadFile({
                url: this.data.poster.qrCode,
                success: (res) => {
                  this.setData({
                    'tempFilePath.qrCode': res.tempFilePath
                  });
                  this.draw();
                },
                fail: (err) => {
                  console.log('qrCode fail=', err);
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
    handleGetImageInfo() {
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
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 格式化错误信息
     * @param {Object} err
     * @return {void}
     * @Date: 2020-04-02 22:08:16
     */
    formatError(err) {
      let errMsg = err;
      if (typeof err === 'object') {
        errMsg = JSON.stringify(err);
      }
      return errMsg;
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 设置禁用状态
     * @param {Boolean} status boolean
     * @param {String} name 要设置的变量名
     * @return {void}
     * @Date: 2020-04-02 22:29:16
     */
    setDisabled(status, name) {
      const key = name || 'isDisabled';
      this.setData({
        [key]: status
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 把图片绘画到画布上
     * @return {void}
     * @Date: 2020-03-31 21:51:27
     */
    draw() {
      const poster = this.data.tempFilePath;
      var ctx = wx.createCanvasContext('my-canvas', this);
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
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 把画布导出成图片 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html
     * @return {void}
     * @Date: 2020-04-02 22:32:35
     */
    handleCanvasToTempFilePath() {
      wx.canvasToTempFilePath({
        canvasId: 'my-canvas',
        width: this.data.canvasWidth,
        height: this.data.canvasHeight,
        success: (res) => {
          this.setData({
            src: res.tempFilePath
          });
          wx.hideLoading();
          this.setDisabled(false);
        },
        fail: (err) => {
          console.log('生成商品海报失败err=', err);
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
      }, this);
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 不验证是否授权
     * @return {void}
     * @Date: 2020-04-06 15:06:02
     */
    handleSaveImageNoVerification() {
      wx.showLoading({
        title: '保存中......',
      });
      this.setDisabled(true, 'isDisabledSave');
      this.handleSaveImageToPhotosAlbum();
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 验证是否授权
     * @return {void}
     * @Date: 2020-04-06 15:06:02
     */
    handleSaveImageVerification() {
      wx.showLoading({
        title: '保存中......',
      });
      this.setDisabled(true, 'isDisabledSave');
      this.getWritePhotosAlbum(() => {
        this.handleSaveImageToPhotosAlbum();
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 保存海报的按钮
     * @return {void}
     * @Date: 2020-04-06 14:25:56
     */
    handleSaveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.src,
        success: (res) => {
          console.log('保存成功=', res);
          // setTimeout是为了防止在苹果手机中一闪而过
          setTimeout(() => {
            wx.showToast({
              title: '保存成功！请到相册中查看',
              icon: 'none',
              duration: 3000
            });
          }, 0);
        },
        fail: (err) => {
          console.log('保存失败=', err);
          this.setDisabled(false, 'isDisabledSave');
          wx.showModal({
            title: '提示',
            content: '保存失败',
            showCancel: false
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    /**
     * @author: adu（duhw@5ifengdu.com）
     * @description: 验证是否有保存图片到相册的权限（注意：无法检测系统存储空间的权限！）
     * @param {Function} callback 回调
     * @return {void}
     * @Date: 2020-03-29 19:16:21
     */
    getWritePhotosAlbum(callback) {
      wx.getSetting({
        success: res => {
          wx.hideLoading();
          console.log('res=', res);
          if (res.authSetting['scope.writePhotosAlbum']) {
            console.log('true');
            callback && callback();
          } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
            wx.showModal({
              title: '提示',
              content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
              success: (res) => {
                if (res.confirm) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: (res) => {
                      callback && callback()
                      console.log('授权下载成功', res);
                    },
                    fail: (res) => {
                      console.log('您没有授权 fail=', res);
                      this.setDisabled(false, 'isDisabledSave');
                      wx.hideLoading();
                      wx.showToast({
                        title: '您没有授权，无法保存到相册',
                        icon: 'none'
                      });
                    }
                  });
                } else {
                  console.log('取消了');
                  this.setDisabled(false, 'isDisabledSave');
                  wx.hideLoading();
                }
              }
            });
          } else {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  console.log('false success res=', res);
                  callback && callback();
                } else {
                  wx.showToast({
                    title: '您没有授权，无法保存到相册！',
                    icon: 'none'
                  });
                  this.setDisabled(false, 'isDisabledSave');
                  wx.hideLoading();
                }
              },
              fail: (res) => {
                this.setDisabled(false, 'isDisabledSave');
                wx.hideLoading();
                console.log('false file res=', res);
              }
            });
          }
        }
      });
    }
  }
})

// components/longPressToSave/index.js
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
    url: "",
    filepath: '/images/qrcode.png', // 本地路径
    src: 'https://img.alicdn.com/imgextra/i4/759415648/O1CN01uL5CUw1rapSLOfSRv_!!759415648.png',
    longPressSrc: '',
    base64: 'data:image/gif;base64,R0lGODlhIwANALMNAP/68//37v/48f/26//06P/z5P/x4f/79v/79//w3//v3fOkguRJSv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwANACwAAAAAIwANAAAEj7DJtqq9OOs6KfpgKI7kt0zLcTCMurZuLM/qKS0AwDI5q+++IE+Ys1UEAmCSsUQ6WU0oVHBaBK4BVna3xV6BwG6gMiiXWWc0OA1mDNCDKmFOYNHtdnq9zdjPjQsFBSyCgwyGhYWEiIkFNhQGkZKTbZEslgyYkY8LCZ6foKGio56cCqeoqaqrrKePFBuxshwRACH5BAUGAA0ALAYAAQAOAAkAAAQikLFGJb14ZsmvxkAIUELzYWiAmhY2oEO8zlRRXLbXzUbvRwAh+QQFCAANACwGAAEAFwAJAAAEMxChRmVjONPN6eneIV4MaVIAqK6l0Glbeb1gYK+gjO9qVhIUArBBwMRKhaSSx6QYDE5oBAAh+QQFCAANACwGAAEAGgAJAAAEOrDJKZG9jbG89TzHF0qaR50mcK7TlrGNsAo0zG4Batoo3wySAfB3OxGOBN4RVipJCoVnlLPb+SYGQwQAIfkEBQgADQAsDgABABIACQAABCmwydkQqtc2xo7/VBhy3ARIp6iuU+CyIikxM701wwDHduEXtWDDR5LtIgAh+QQFCAANACwVAAEACwAJAAAEG7DJORE6p2Gdqf+CFH5kOTGolDZMQxBmuq5SBAAh+QQFZAANACweAAIAAgAIAAAEB/AcRqsthUYAOw==',
    isCanUse: false, // 是否可以使用
    systemInfo: {} // 设备信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 在canvas上绘画
     * @return {void}
     * @Date: 2020-04-24 21:15:48
     */
    draw() {
      const ctx = wx.createCanvasContext('canvasId', this);
      const windowWidth = 750;
      const windowHeight = 750;
      ctx.setFillStyle('#cccccc');
      ctx.fillRect(0, 0, windowWidth, windowHeight);
      ctx.setFontSize(24);
      ctx.setFillStyle('#ff0000');
      ctx.fillText('模拟生成海报，长按保存', 10, 80);
      // 画图
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          fileType: 'jpg',
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowHeight,
          canvasId: 'canvasId',
          quality: 1,
          success: (res) => {
            const tempFilePath = res.tempFilePath;
            console.log('rss=', res);
            this.setData({
              url: tempFilePath,
            });
            wx.previewImage({
              urls: [tempFilePath],
              current: tempFilePath
            });
          },
          fail: (err) => {
            console.log('err=', err);
          }
        }, this);
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 方法二（1）：点击按钮时模拟生成海报的操作
     * @return {void}
     * @Date: 2020-04-24 21:20:19
     */
    handlePreviewImage() {
      this.draw();
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 方法二（2）：base64
     * @return {void}
     * @Date: 2020-04-24 21:21:56
     */
    handlePreviewImageBase64() {
      wx.previewImage({
        urls: [this.data.base64],
        current: this.data.base64
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 方法二（3）：wx.getImageInfo + wx.previewImage 的组合
     * @return {void}
     * @Date: 2020-04-24 21:22:35
     */
    handlePreviewImage3() {
      wx.getImageInfo({
        src: this.data.src,
        success: (res) => {
          wx.previewImage({
            urls: [res.path],
            current: res.path
          });
        },
        fail: (err) => {
          console.log('getImageInfo qrCode fail=', err);
        }
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 方法三：长按
     * @param {Object} e event
     * @return {void}
     * @Date: 2020-04-24 21:23:30
     */
    handleLongPress(e) {
      const src = e.currentTarget.dataset.src;
      console.log('e=', e, src);
      this.setData({
        longPressSrc: src
      });
      this.getWritePhotosAlbum(() => { /* 验证用户是否授权了保存图片到相册的权限 */
        this.handleSaveImageToPhotosAlbum(); /* 调用封装好的保存图片到相册的代码 */
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 保存图片到系统相册
     * @return {void}
     * @Date: 2020-04-06 14:25:56
     */
    handleSaveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.longPressSrc,
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
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 设置禁用样式
     * @param {Boolean} status 布尔
     * @param {String} name 字符串
     * @return {void}
     * @Date: 2020-04-24 22:05:07
     */
    setDisabled(status, name) {
      name = name || 'isDisabled';
      this.setData({
        [name]: status
      });
    },
    /**
     * @author: adu
     * @description: 获取系统信息
     * @return {void}
     * @Date: 2019-12-19
     */
    handleGetSystemInfo() {
      wx.getSystemInfo({ /* 获取系统信息 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html */
        success: (res) => {
          this.setData({
            systemInfo: res
          });
          console.log('微信版本号：', res.version, '；客户端基础库版本：', res.SDKVersion, '；设备型号：', res.model, '；操作系统及版本：', res.system, '；res=', res);
        },
        fail: (res) => {
          console.log('err getSystemInfo-', res);
        }
      });
    }
  },
  ready() {
    console.log('是否支持 image.show-menu-by-longpress：', wx.canIUse('image.show-menu-by-longpress'));
    this.handleGetSystemInfo();
    this.setData({
      isCanUse: wx.canIUse('image.show-menu-by-longpress') // https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html
    });
  }
})

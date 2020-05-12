// components/wxs-diyAudioPlayer/index.js
var left = 0;
var currentTime = 0;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioSrc: {
      type: String
    } // 音频网址
  },

  /**
   * 组件的初始数据
   */
  data: {
    playSrc: '../../images/audio-play.png', // 播放状态时的图片
    pauseSrc: '../../images/audio-stop.png', // 暂停状态时的图片
    isPlay: false, // 播放中
    innerAudioContext: null, // 音频对象
    isTouchMove: false, // 是否拖拽（显示tips）
    isCanplay: false, // 监听音频进入可以播放状态的事件
    durationValue: 0, // 音频总长度
    currentTime: 0, // 当前播放位置
    progressWidthValue: 0, // 时间轴的有效长度
    isProgress: false // 是否显示播放的进度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 获取音频信息
     * @return {void}
     * @Date: 2020-05-10 14:10:08
     */
    getAudioInfo() {
      if (this.data.audioSrc) {
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.autoplay = true; // 经测试发现，必需要播放才能在真机中获取时长！（虽然false时工具中是能获取时间的）
        this.innerAudioContext.src = this.data.audioSrc;
        this.innerAudioContext.onPlay(res => {
          var duration = this.innerAudioContext.duration; // 这行代码非常重要！注释后，切换播放和暂停时会出现异常
        });
        this.innerAudioContext.onError(res => {
          console.log(res.errMsg, res.errCode);
        });
        // 监听音频进入可以播放状态的事件
        this.innerAudioContext.onCanplay(() => {
          if (this.data.isCanplay) return
          setTimeout(() => {
            this.setData({
              isPlay: true,
              isCanplay: true,
              isProgress: true
            });
            // 再次获取
            if (this.data.durationValue === 0) {
              this.setData({
                durationValue: this.innerAudioContext.duration
              });
            }
          }, 500);
        });
        // 监听音频播放进度更新事件
        this.innerAudioContext.onTimeUpdate(() => {
          if (this.data.durationValue === 0) {
            this.setData({
              durationValue: this.innerAudioContext.duration
            });
          }
          this.setData({
            currentTime: this.innerAudioContext.currentTime
          });
        });
        // 监听音频完成跳转的操作
        this.innerAudioContext.onSeeked((res) => {
          this.goPlay();
        })
        // 播放结束后
        this.innerAudioContext.onEnded((res) => {
          // this.innerAudioContext.seek(0); /* 开启后会无限循环播放 */
          this.setData({
            isPlay: false,
            currentTime: 0
          });
        });
      }
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 播放
     * @return {void}
     * @Date: 2020-02-06 16:45:30
     */
    goPlay() {
      this.innerAudioContext.play();
      this.setData({
        isPlay: true
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 暂停
     * @return {void}
     * @Date: 2020-02-06 16:45:23
     */
    goPause() {
      this.innerAudioContext.pause();
      this.setData({
        isPlay: false
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 获取dom信息
     * @param {String} name name
     * @param {Function} callback 回调
     * @return {void}
     * @Date: 2020-02-06 16:44:24
     */
    getDom(name, callback) {
      let query = wx.createSelectorQuery().in(this);
      query.select(name).boundingClientRect();
      query.exec(res => {
        callback && callback(res);
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 监听手动拖拽
     * @param {Object} data data
     * @return {void}
     * @Date: 2020-02-06 17:31:38
     */
    touchMove(data) {
      if (data && !data.target && data.currentTime !== undefined) {
        this.setData({
          currentTime: data.currentTime // 接收wxs中计算出的值并利用setData实现数据响应
        });
      }
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 触摸开始时立即暂停
     * @return {void}
     * @Date: 2020-05-10 14:07:48
     */
    touchStart() {
      this.setData({
        isTouchMove: true,
      });
      this.goPause();
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 触摸结束后跳转并播放
     * @param {Object} data data
     * @return {void}
     * @Date: 2020-05-10 14:07:48
     */
    touchEnd(data) {
      this.setData({
        isTouchMove: false,
      });
      let currentTime = 0;
      if (data.currentTime) {
        currentTime = data.currentTime;
        this.innerAudioContext.seek(currentTime);
      }
    },
  },
  ready() {
    this.getDom('.audio__progress', res => {
      this.getDom('.audio__progress_bar', val => {
        this.setData({
          progressWidthValue: res[0].width - val[0].width
        });
      });
    });
    this.getAudioInfo();
  },
  /**
   * @author: yilingsj（315800015@qq.com）
   * @description: 页面离开时销毁音频
   * @return {void}
   * @Date: 2020-02-11 13:55:57
   */
  detached() {
    this.innerAudioContext.destroy();
  }
});
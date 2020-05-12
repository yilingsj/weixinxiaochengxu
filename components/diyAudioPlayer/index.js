// components/diyAudioPlayer/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioSrc: {
      type: String
    } // 音频网址，非本地！
  },

  /**
   * 组件的初始数据
   */
  data: {
    playSrc: '../../images/audio-play.png', // 播放状态时的图标
    pauseSrc: '../../images/audio-stop.png', // 暂停状态时的图标
    isPlay: false, // 播放中
    total: '00:00', // 音频总长度
    totalToNumber: 0,
    progress: '00:00', // 播放进度
    progressWidth: 0, // 进度条的长度
    innerAudioContext: null, // 音频对象
    x: 0,  // 滑块x坐标
    isTouchMove: false, // 拖拽时显示
    isCanplay: false, // 监听音频进入可以播放状态的事件
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
          if (this.data.isCanplay) return;
          setTimeout(() => {
            this.setData({
              total: this.getTime(this.innerAudioContext.duration),
              totalToNumber: this.innerAudioContext.duration,
              isPlay: true,
              x: 0,
              isCanplay: true,
              isProgress: true
            });
          }, 500);
        });
        // 监听音频播放进度更新事件
        this.innerAudioContext.onTimeUpdate(() => {
          let value = this.innerAudioContext.currentTime;
          this.setData({
            progress: this.getTime(value),
          });
          this.changeX(value);
        });
        // 监听音频完成跳转的操作
        this.innerAudioContext.onSeeked((res) => {
          this.goPlay();
        });
        // 播放结束后
        this.innerAudioContext.onEnded((res) => {
          this.innerAudioContext.seek(0); // 开启后会无限循环播放
          this.setData({
            isPlay: false,
            progress: '00:00',
            x: 0
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
      console.log('暂停,currentTime =', this.innerAudioContext.currentTime);
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
     * @description: 监听滑块改变
     * @param {Object} e event
     * @return {void}
     * @Date: 2020-02-06 16:44:52
     */
    bindchange(e) {
      let {
        x,
        y
      } = e.detail;
      let progress = (x / this.data.progressWidth) * this.data.totalToNumber;
      this.setData({
        progressDefault: progress,
        progress: this.getTime(progress)
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 监听手动拖拽
     * @return {void}
     * @Date: 2020-02-06 17:31:38
     */
    touchMove() {
      this.setData({
        isTouchMove: true,
        isPlay: false
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 触摸开始时立即暂停
     * @return {void}
     * @Date: 2020-05-10 14:07:48
     */
    touchStart() {
      this.innerAudioContext.pause();
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 触摸结束后跳转并播放
     * @return {void}
     * @Date: 2020-05-10 14:07:48
     */
    touchEnd() {
      this.innerAudioContext.seek(this.getTime(this.data.progress, '', 1));
      this.setData({
        isTouchMove: false,
        isPlay: true
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 根据currentTime计算出x的值
     * @param {Number} value currentTime
     * @return {void}
     * @Date: 2020-02-06 17:08:56
     */
    changeX(value) {
      let newValue = (
        this.getTime(value, '', 1) / this.data.totalToNumber *
        this.data.progressWidth
      ).toFixed(2);
      this.setData({
        x: Number(newValue)
      });
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 时间转换
     * @param {Number} value 数字
     * @param {Boolean} isHours 布尔值
     * @param {Boolean} type 布尔值
     * @return {void}
     * @Date: 2020-02-06 19:20:07
     */
    getTime(value, isHours, type) {
      let result = null;
      let hours = 0;
      let minute = 0;
      let second = 0;
      // 时间转数字
      if (type) {
        const newValue = ('' + value).split(':')
        if (newValue.length === 3) {
          hours = newValue[0] * 60 * 60;
          minute = newValue[1] * 60;
          second = newValue[2];
        } else if (newValue.length === 2) {
          minute = newValue[0] * 60;
          second = newValue[1];
        } else if (newValue.length === 1) {
          second = newValue[0];
        }
        result = hours + minute + Number(second);
      } else {
        // 数字转时间
        minute = Math.floor(value / 60);
        second = Math.floor(value % 60);
        // 分
        if (minute < 10) {
          minute = '0' + minute;
        }
        // 秒
        if (second < 10) {
          second = '0' + second;
        }
        // 输出小时
        if (isHours) {
          hours = Math.floor(value / 3600);
          // 时
          if (hours < 10) {
            hours = '0' + hours;
          }
          result = hours + ':' + minute + ':' + second;
        } else {
          result = minute + ':' + second;
        }
      }
      return result;
    },
  },
  ready() {
    this.getDom('.audio__progress', res => {
      this.getDom('.audio__progress_bar', val => {
        this.setData({
          progressWidth: res[0].width - val[0].width
        });
        console.log('res=', res, ';progressWidth=', this.data.progressWidth);
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

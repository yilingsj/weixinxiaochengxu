// components/textarea-fixed-bottom/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object
    } // 父级传入数据
  },

  /**
   * 组件的初始数据
   */
  data: {
    focusTop: '100%', // 输入框获取焦点时的top值
    commentsText: '', // 当前输入评论的内容
    maxLength: 140, // 评论框最大字数
    platform: '', // 机型
    // domHeight: 'auto', // dom元素高度（自动增高时不需要设置）
    keyHeight: '', // 键盘高度
    focusTime: 0 // 获取焦点的时间 yiling 20200408 14:43:56
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @author: yiling
     * @description: 评论框获取焦点时
     * @param {Object} e event
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleEvaluationFocus(e) {
      if (this.data.info.isClear) {
        this.setData({
          commentsText: ''
        })
      }
      /* 获取焦点时记录时间 yiling 202000408 14:43:56 start */
      this.setData({
        focusTime: Date.now()
      })
      /* 获取焦点时记录时间 yiling 202000408 14:43:56 end */
      const {
        height
      } = e.detail // 为键盘高度
      this.setData({
        keyHeight: height
      })
      if (this.data.oldFocusTop) {
        this.setData({
          focusTop: this.data.oldFocusTop
        })
      } else {
        this.calculateNewTop(height) // 计算新top值
      }
    },
    /**
     * @author: yiling
     * @description: 监听输入框输入内容，统计字数
     * @param {Object} event event
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleEvaluationInput(event) {
      let {
        value
      } = event.detail
      this.setData({
        commentsText: value
      })
    },
    /**
     * @author: yiling
     * @description: 监听输入框行数变化
     * @param {Object} e event
     * @return {void}
     * @Date: 2020-06-19 21:59:28
     */
    bindlinechange(event) {
      if (this.data.keyHeight) {
        this.calculateNewTop(this.data.keyHeight)
      }
    },
    /**
     * @author: yiling
     * @description: 点击完成按钮时关闭弹窗
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleEvaluationConfirm() {
      this.handleClose()
    },
    /**
     * @author: yiling
     * @description: 点击发表评论按钮
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleEvaluationRelease() {
      this.handleClose((object) => {
        object.id = this.data.info.id // id
        object.content = this.data.commentsText // 评论内容
        object.typeName = this.data.info.typeName // 类型：名片 / 资讯 / 商城 / ...
      })
    },
    /**
     * @author: yiling
     * @description: 关闭输入框的弹窗
     * @param {Function} callback 回调
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleClose(callback) {
      const object = {
        isShow: false,
      }
      this.setData({
        focusTop: '100%',
      })
      try {
        callback && callback(object)
      } catch (e) { }
      this.triggerEvent('myeventEvaluationData', object) // 向父组件发送数据
    },
    /**
     * @author: yiling
     * @description: 防页面穿透
     * @return {void}
     * @Date: 2019-12-16 15:46:22
     */
    handleEvaluationtouchmove() {
      this.handleClose()
      return false
    },
    /**
     * @author: yiling
     * @description: 失去焦点（某些极端情况下会用到，如：安卓机键盘右上方小三角）
     * @return {void}
     * @Date: 2019-12-19
     */
    handleEvaluationBlur() {
      if (Date.now() > this.data.focusTime && this.data.focusTime !== 0) {
        this.handleClose()
      }
    },
    /**
     * @author: yiling
     * @description: 获取系统信息
     * @return {void}
     * @Date: 2019-12-19
     */
    handleGetSystemInfo() {
      wx.getSystemInfo({
        success: (res) => {
          const version = Number(res.version.replace(/\./g, ''))
          const SDKVersion = Number(res.SDKVersion.replace(/\./g, ''))
          const platform = res.platform
          if (version < 700) { // 说明微信版本小于7
            console.log('低版本')
          }
          this.setData({
            platform: platform
          })
          console.log('getSystemInfo-', res)
        },
        fail: (res) => {
          console.log('err getSystemInfo-', res)
        }
      })
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 阻止冒泡
     * @return {void}
     * @Date: 2020-04-10 21:37:34
     */
    handleEvaluationCatchTap() {
      this.handleClose()
    },
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 计算新top值
     * @param {Number} height 数值
     * @return {void}
     * @Date: 2020-06-19 22:03:26
     */
    calculateNewTop(height) {
      const windowHeight = wx.getSystemInfoSync().windowHeight // 可使用窗口高度，单位px
      const query = wx.createSelectorQuery().in(this) // 自定义组件内必须添加.in(this)，否则获取不到dom数据！
      query.select('.popup-evaluation-wrap').boundingClientRect()
      query.exec(res => {
        if (res[0]) {
          const domHeight = res[0].height || 156
          this.setData({
            focusTop: (windowHeight - domHeight - height) + 'px',
            oldFocusTop: (windowHeight - domHeight - height) + 'px',
            // domHeight: domHeight + 'px', // 固定高度，输入框自动高度时就不需要这行代码了
          })
        }
      })
    }
  },
  ready() {
    this.handleGetSystemInfo() // 获取系统信息，主要是判断机型（修复ios上内边距的bug）
  }
})
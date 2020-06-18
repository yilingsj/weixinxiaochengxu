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
    domHeight: 'auto', // dom元素高度
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
      const windowHeight = wx.getSystemInfoSync().windowHeight // 可使用窗口高度，单位px
      if (this.data.oldFocusTop) {
        this.setData({
          focusTop: this.data.oldFocusTop
        })
        /* 向父组件传递键盘高度和组件高度 20200618 start */
        const object = {
          keyHeight: height, // 获取键盘高度
          domHeight: parseInt(this.data.domHeight) // 获取底部输入框组件的高度
        }
        this.triggerEvent('myeventEvaluationData', object)
        /* 向父组件传递键盘高度和组件高度 20200618 end */
      } else {
        const query = wx.createSelectorQuery().in(this) // 自定义组件内必须添加.in(this)，否则获取不到dom数据！
        query.select('.popup-evaluation-wrap').boundingClientRect()
        query.exec(res => {
          if (res[0]) {
            const domHeight = res[0].height || 156
            this.setData({
              focusTop: (windowHeight - domHeight - height) + 'px',
              oldFocusTop: (windowHeight - domHeight - height) + 'px',
              domHeight: domHeight + 'px', // 固定高度，防止部分机型中多行文本时布局错乱
            })
            /* 向父组件传递键盘高度和组件高度 20200618 start */
            const object = {
              keyHeight: height,
              domHeight: domHeight
            }
            this.triggerEvent('myeventEvaluationData', object)
            /* 向父组件传递键盘高度和组件高度 20200618 end */
            console.log('domHeight=', this.data.domHeight)
          }
        })
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
      } catch (e) {}
      this.triggerEvent('myeventEvaluationData', object)
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
     * @description: 失去焦点
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
    }
  },
  ready() {
    this.handleGetSystemInfo() // 获取系统信息，主要是判断机型
  }
})
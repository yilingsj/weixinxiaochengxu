/*
 * @Description: 
 * @Author: yilingsj（315800015@qq.com）
 * @Date: 2020-06-09 11:20:33
 * @LastEditors: yilingsj（315800015@qq.com）
 * @LastEditTime: 2020-06-09 18:06:03
 */
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    popupEvaluation: {
      isShow: false, // 评论框弹层弹窗是否显示
      id: null, // id
      typeName: '', // 类型：商城 / 资讯 / 名片
      isClear: false // 是否清空上次的数据
    },
    evaluationData: [], // 评论数据
    footerDefaultHeight: ''
  },
  onLoad: function () {
    this.initData() // 未对接接口时，初始化一堆数据便于观察
    this.getDom('.page-footer', res => {
      this.setData({
        footerDefaultHeight: res[0].height // 底部默认高度
      });
    });
  },
  /**
   * @author: adu（duhw@5ifengdu.com）
   * @description: 评论数据
   * @param {Object} event 元素本身
   * @return {void}
   * @Date: 2020-04-10 15:24:45
   */
  myeventEvaluationData(event) {
    let {
      isShow,
      typeName,
      content,
      id,
      keyHeight,
      domHeight
    } = event.detail
    if (typeName) { // 点击了发布评论按钮
      wx.showLoading({
        title: '发布中...'
      })
      switch (typeName) {
        case 'infomation': // 资讯
          console.log('资讯id=', id, ';评论内容=', content)
          break
        case 'mall': // 商城
          console.log('商品id=', id, ';评论内容=', content)
          break
        case 'card': // 名片的评论
          console.log('名片的评论id=', id, ';评论内容=', content)
          break
        default:
          break
      }
      // 此处的延迟是模拟发送数据，真实场景应在上面的switch中进行
      setTimeout(() => {
        let editEvaluationData = this.data.evaluationData
        const data = {
          name: '最新评论' + (this.data.evaluationData.length + 1),
          text: content,
          type: typeName,
          time: Date.now()
        }
        editEvaluationData.splice(0, 0, data)
        this.setData({
          'popupEvaluation.isShow': false,
          'popupEvaluation.isClear': true,
          evaluationData: editEvaluationData,
          paddingHeight: ''
        });
        this.pageScrollFirst(); /* 新增：滚动到最新评论处 */
        wx.showLoading({
          title: '发布成功',
        })
        this.pageScrollFirst() // 滚动到最新评论处
        setTimeout(() => {
          wx.hideLoading()
        }, 500)
      }, 1000)
    } else {
      console.log('普通关闭')
      if (keyHeight) { // 软键盘弹起时
        this.setData({
          paddingHeight: domHeight / 2 + keyHeight + this.data.footerDefaultHeight
        })
        if (!wx.canIUse('pageScrollTo.object.selector')) {
          wx.showToast({
            title: '当前微信版本过低，不支持selector',
            icon: 'none',
            duration: 2000
          })
        }
        this.pageScrollBottom() // 滚动到最后一条评论
      } else {
        this.setData({
          'popupEvaluation.isShow': isShow,
          'popupEvaluation.isClear': false,
          paddingHeight: '' // 清空值
        })
      };
    }
  },
  /**
   * @author: yilingsj（315800015@qq.com）
   * @description: 点击时显示评论组件
   * @return {void}
   * @Date: 2020-04-10 21:59:38
   */
  handleIsShowComment() {
    this.setData({
      'popupEvaluation.isShow': true,
      'popupEvaluation.id': 0,
      /* id为动态，请修改 */
      'popupEvaluation.typeName': 'card',
      /* typeName也为动态，请修改 */
      'popupEvaluation.isClear': this.data.popupEvaluation.isClear
    })
  },
  /**
   * @author: yilingsj（315800015@qq.com）
   * @description: 滚动到页尾
   * @return {void}
   * @Date: 2020-06-09 17:11:55
   */
  pageScrollBottom() {
    wx.pageScrollTo({
      selector: '.evaluation-end'
    })
  },
  /**
   * @author: yilingsj（315800015@qq.com）
   * @description: 滚动到最新评论（第一条）的位置
   * @return {void}
   * @Date: 2020-06-09 17:12:33
   */
  pageScrollFirst() {
    wx.pageScrollTo({
      selector: '.evaluation-wrap'
    })
  },
  /**
   * @author: yilingsj（315800015@qq.com）
   * @description: 初始化一堆假数据
   * @return {void}
   * @Date: 2020-06-09 17:39:40
   */
  initData() {
    let data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        name: '佚名' + (Number(i) + 1),
        text: '第' + (Number(i) + 1) + '条评论',
        type: '资讯',
        time: Date.now()
      })
    }
    this.setData({
      evaluationData: data
    })
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
  }
})
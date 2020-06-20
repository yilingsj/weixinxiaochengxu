/*
 * @Description: 
 * @Author: yilingsj（315800015@qq.com）
 * @Date: 2020-06-19 00:18:39
 * @LastEditors: yilingsj（315800015@qq.com）
 * @LastEditTime: 2020-06-20 10:49:40
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
    evaluationData: [] // 评论数据
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
      id
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
        const index = this.data.evaluationData.length - 1 >= 0 ? this.data.evaluationData.length : 0
        let editEvaluationData = 'evaluationData[' + index + ']'
        const data = {
          text: content,
          type: typeName,
          time: Date.now()
        }
        this.setData({
          'popupEvaluation.isShow': false,
          'popupEvaluation.isClear': true,
          [editEvaluationData]: data
        })
        wx.showLoading({
          title: '发布成功',
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 500)
      }, 1000)
    } else {
      console.log('普通关闭')
      this.setData({
        'popupEvaluation.isShow': isShow,
        'popupEvaluation.isClear': false
      })
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
      'popupEvaluation.id': 0, /* id为动态，请修改 */
      'popupEvaluation.typeName': 'card', /* typeName也为动态，请修改 */
      'popupEvaluation.isClear': this.data.popupEvaluation.isClear
    })
  }
})
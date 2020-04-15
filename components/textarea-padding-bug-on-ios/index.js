/*
 * @Description: 
 * @Author: yilingsj（315800015@qq.com）
 * @Date: 2020-04-14 21:33:07
 * @LastEditors: yilingsj（315800015@qq.com）
 * @LastEditTime: 2020-04-14 21:55:13
 */
// components/textarea-padding-bug-on-ios/index.js
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
    platform: '' // 客户端平台
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @author: yilingsj（315800015@qq.com）
     * @description: 获取系统信息
     * @return {void}
     * @Date: 2020-04-14 21:36:24
     */
    handleGetSystemInfo() {
      wx.getSystemInfo({ /* 获取系统信息 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html */
        success: (res) => {
          this.setData({
            platform: res.platform
          })
          console.log('getSystemInfo-', res)
        }
      })
    }
  },
  ready() {
    this.handleGetSystemInfo()
  }
})

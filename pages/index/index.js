//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShow: false // 弹窗
  },
  // 点击时显示弹出评论功能
  handleShowPingLun() {
    console.log('点击弹出评论功能,bindtap会一直向上冒泡,catchtap不会', Date.now())
    this.setData({
      isShow: !this.data.isShow
    })
  },
  // 禁止向上冒泡（非操作区域时关闭弹窗）
  handleCatchTap() {
    console.log('我是顶级的view.page标签', Date.now())
    if (this.data.isShow) {
      this.setData({
        isShow: false
      })
    }
  },
  // 滑屏（页面滚动时也关闭弹窗）
  handleTouchmove() {
    this.handleCatchTap()
  },
  handleInfo() {
    console.log('我是父级pinglun-info，现在被无辜触发了事件')
  },
  handlePinglun() {
    console.log('我是评论')
  },
  handleCancel() {
    console.log('我是取消功能')
  }
})

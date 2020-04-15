# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增一个wx.downloadFile下载图片的demo
分支：dev-downloadFile-20200404

说明：公司的微信小程序中的生成海报功能中使用了wx.downloadFile这个API，但写代码的作者未做拦截处理，导致用户在一波狂点后不停进入fail并触发弹窗！实际上海报生成是没有问题的，这个弹窗一直被老板认为是bug。所以，此demo提供简单的复现场景及源码，有兴趣的可下载后进行体验。

视频演示：

[![点击播放视频](https://img.alicdn.com/imgextra/i1/6000000006743/O1CN01qgEOMA1zgLGPptYyh_!!6000000006743-0-tbvideo.jpg)](https://cloud.video.taobao.com//play/u/759415648/p/1/e/6/t/1/258391969253.mp4)

踩坑文章地址：
[微信小程序入坑教程二十：生成海报前使用wx.downloadFile或wx.getImageInfo时潜在的坑](http://www.yilingsj.com/xwzj/2020-04-05/weixin-downloadFile-getImageInfo.html)

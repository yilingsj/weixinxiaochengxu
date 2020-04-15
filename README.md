# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增一个textarea在ios上存在bug的demo
分支：dev-textarea-padding-bug-in-ios-20200414 

说明：微信小程序的textarea组件在ios设备上，padding有最小值且不能被重置掉，最小值为20rpx 10rpx；line-height行高属性也有最小值，值为34rpx；为了在安卓机上和ios端尽可能实现统一样式，使用wx.getSystemInfo来判断设备，然后再利用margin的负边距来抵消差异。

相关图片：

![textarea组件设置相同属性后在苹果和安卓手机中左侧的距离不一致](https://img.alicdn.com/imgextra/i4/759415648/O1CN01pxZOad1rapZZzb2wv_!!759415648.png)
https://img.alicdn.com/imgextra/i4/759415648/O1CN01pxZOad1rapZZzb2wv_!!759415648.png

![textatea的上内边距也不一样.png](https://img.alicdn.com/imgextra/i1/759415648/O1CN01jVI8HD1rapZaxLepv_!!759415648.png)
https://img.alicdn.com/imgextra/i1/759415648/O1CN01jVI8HD1rapZaxLepv_!!759415648.png

![使用margin的负边距来抵消padding.png](https://img.alicdn.com/imgextra/i1/759415648/O1CN01S2c24r1rapZeOxLIK_!!759415648.png)
https://img.alicdn.com/imgextra/i1/759415648/O1CN01S2c24r1rapZeOxLIK_!!759415648.png

踩坑文章地址：
[微信小程序从入坑到放弃二十三：都0202年了，textarea在ios上的bug咋还未修复呢](http://www.yilingsj.com/xwzj/2020-04-13/weixin-textarea-padding-bug-in-ios.html)


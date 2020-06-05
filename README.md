# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增demo：冒泡事件bindtap和catchtap的区别
分支：dev-bindtap-and-catchtap-20200605

说明：
bindtap会产生正常的事件向上冒泡，若在这条链树上有其他的tap事件，在冒泡过程中会顺带触发。通常情况下，我们并不希望无关事件也自动触发，所以这时可以使用catch进行拦截。

### 如图
bindtap 一直向上冒泡
[bindtap 一直向上冒泡](https://img.alicdn.com/imgextra/i1/759415648/O1CN01n8d2o01rapa7GNUcL_!!759415648.png)

catchtap 阻止向上冒泡
[catchtap 阻止向上冒泡](https://img.alicdn.com/imgextra/i4/759415648/O1CN01PPnVcC1rapaHkcSxf_!!759415648.gif)

踩坑文章地址：
[微信小程序从入坑到放弃二十七：可控制播放进度的音乐播放器(初级版)](http://www.yilingsj.com/xwzj/2020-06-05/weixin-bindtap-and-catchtap.html)

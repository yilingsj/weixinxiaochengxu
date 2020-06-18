# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增demo：scroll-view组件实现评论前后页面滚动到指定评论处的功能
分支：dev-scroll-view-scrollIntoView-20200618 

需求：业务中有一个需求，用户点击评论框时，自动将最后一条评论显示在评论框的上方；当用户发表评论后，页面自动滚动到最新评论的位置。

解决方案：scroll-view组件天然支持滚动，然后通过动态修改scroll-into-view属性即可实现需求。另外需要注意初始化时设置高度，在评论框被激活时，还要计算出页面应该填充的高度。

[最终效果演示](https://cloud.video.taobao.com//play/u/759415648/p/1/e/6/t/1/269410341895.mp4)

踩坑文章地址：
[微信小程序从入坑到放弃三十一：scroll-view组件在评论功能中的应用](http://www.yilingsj.com/xwzj/2020-06-18/weixin-scroll-into-view.html)


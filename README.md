# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增一个兼容ios手机的底部评论框
分支：dev-textarea-fixed-bottom-20200410

说明：固定在底部的评论框一直是前端项目中的一个魔鬼，总是会有那么一种情况输入框被系统键盘遮挡，或者是输入框悬浮于半空中但键盘没有展开。写这个分支时，艺灵也是经过了各种折腾，wxss的样式也会引起一些莫名的bug！wx:if或wx:for也不建议使用，因为在某些低版本微信中，在首次点击时也会存在bug！废话不多说，上最终的视频

视频演示：
兼容苹果手机的底部评论框

[![兼容苹果手机的底部评论框](https://img.alicdn.com/imgextra/i1/6000000004562/O1CN01ouaYAe1jZRRdgxmPk_!!6000000004562-0-tbvideo.jpg)](https://cloud.video.taobao.com//play/u/759415648/p/1/e/6/t/1/259290038850.mp4)

踩坑文章地址：
(微信小程序从入坑到放弃二十二：完美兼容安卓和ios手机的底部评论框)[http://www.yilingsj.com/xwzj/2020-04-10/weixin-textarea-fixed-bottom.html]

# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增一个使用wx.saveImageToPhotosAlbum保存图片到相册时检测权限的demo
分支：dev-scope-writePhotosAlbum-20200406

说明：wx.saveImageToPhotosAlbum保存图片时，在安卓手机上会有一个提示授权的弹窗，有且只提醒一次。若用户点击了拒绝，再次点保存海报时就会进入fail。所以我们要通过检测scope.writePhotosAlbum的值来判断用户有没有授权下载图片的权限。若没有权限，就提示用户开启权限方可下载

视频演示：
未加验证前的视频演示

[![未加验证前的视频演示](https://img.alicdn.com/imgextra/i4/6000000002097/O1CN01tpOpac1RMT8wUuuq0_!!6000000002097-0-tbvideo.jpg)](https://cloud.video.taobao.com//play/u/759415648/p/1/e/6/t/1/258639941558.mp4)

加验证后的视频演示

[![加验证后的视频演示](https://img.alicdn.com/imgextra/i1/6000000003242/O1CN01zMFAwU1ZosdeUXv5Z_!!6000000003242-0-tbvideo.jpg)](https://cloud.video.taobao.com//play/u/759415648/p/1/e/6/t/1/258974291898.mp4)

踩坑文章地址：
[微信小程序入坑教程二十一：使用wx.saveImageToPhotosAlbum保存图片时通过检测scope.writePhotosAlbum权限来提醒用户是否需要授权](http://www.yilingsj.com/xwzj/2020-04-06/weixin-scope-writePhotosAlbum.html)

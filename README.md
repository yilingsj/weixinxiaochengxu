# weixinxiaochengxu
微信小程序-日常开发爬坑记录

## 新增一个在wxs中使用正则表达式的demo
分支：dev-wxs-regexp-20200427 

说明：在wxs中使用正则表达式时，如果直接使用replace来替换字符是会报错的，需要先使用getRegExp函数

[在wxs中直接使用replace会报错](https://img.alicdn.com/imgextra/i4/759415648/O1CN01mYcjuF1rapZsdAEPj_!!759415648.png)

踩坑文章地址：
[微信小程序从入坑到放弃二十五：记一次在WXS中使用正则表达式的坑](http://www.yilingsj.com/xwzj/2020-04-27/weixin-wxs-regexp.html)

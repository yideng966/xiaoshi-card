# 集合卡
## 配置资源文件
~~~ 
- url: /hacsfiles/xiaoshi-card/xiaoshi-card.js
  type: module
~~~

## 功能1：加载随机图片网址API
**引用示例**
~~~
type: custom:xiaoshi-image-card
top: 0vh   # 上下偏移的距离
url:			 # 引用api网址的数组
	- "https://t.alcy.cc/moemp/" # 萌版竖图
	- "https://t.alcy.cc/ysmp/"  # 原神竖图
~~~

## 功能2：加载随机视频网址API
**引用示例**
~~~
type: custom:xiaoshi-video-card 
top: 0vh   # 上下偏移的距离
url: 			 # 引用api网址的数组
	- "https://videos.xxapi.cn/0db2ccb392531052.mp4" # 示例网址
	- "https://videos.xxapi.cn/228f4dd7318750dd.mp4" # 示例网址
~~~

# 集合卡
## 配置资源文件
~~~ 
- url: /hacsfiles/xiaoshi-card/xiaoshi-card.js
  type: module
~~~
## 功能1：灯光控制卡2.0
**引用示例**
~~~
type: custom:xiaoshi-light-group-card
entities:             # 要想使用全关功能，灯光必须是light实体
  - light.light1
  - light.light2
  - light.light3    
width: 87vw           # 卡片宽度
height: 20vw          # 卡片高度
rgb: true             # 是否显示亮度、色温控制
show: auto            # 当有这行调用时，仅当灯光时on时才会显示，当灯光时off时卡片整体隐藏
theme: "on"           # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
total: "on"           # 选项on显示表头统计行，选项off不显示统计行，默认参数为on
~~~

## 功能2：插座控制卡2.0
**引用示例**
~~~
type: custom:xiaoshi-switch-group-card
entities:
  - entity: switch.switch1   # 插座1实体 
    power: sensor.power1     # 插座1对应功率实体
  - entity: switch.switch2   # 插座2实体
    power: sensor.power2     # 插座2对应功率实体
height: 85vw                 # 卡片宽度
width: 20vw                  # 卡片高度
theme: "on"                  # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
total: "on"                  # 选项on显示表头统计行，选项off不显示统计行，默认参数为on
~~~

## 功能3：text输入框卡2.0
**引用示例**
~~~
type: custom:xiaoshi-text-card
entity: text.text1           # text实体
height: 56px                 # 卡片高度
width: 65vw                  # 卡片宽度
border-radius: 10px          # 圆角大小,默认值是10px
theme: "on"                  # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
~~~

## 功能4：加载随机图片网址API
**引用示例**
~~~
type: custom:xiaoshi-image-card
top: 0vh  # 上下偏移的距离
url:
  - https://api.suyanw.cn/api/sjmv.php  # 引用图片api网址的数组
  - https://api.suyanw.cn/api/meinv.php # 引用图片api网址的数组
~~~

## 功能5：加载随机视频网址API
**引用示例**
~~~
type: custom:xiaoshi-video-card 
top: 0vh  # 上下偏移的距离
url:
  - https://videos.xxapi.cn/0db2ccb392531052.mp4 # 引用视频api网址的数组
  - https://videos.xxapi.cn/228f4dd7318750dd.mp4 # 引用视频api网址的数组
~~~

## 功能6：时间显示卡(平板端)
**引用示例**
~~~
type: custom:xiaoshi-time-card
entity: sensor.lunar  #该实体需要配合NR使用
                      #弹出菜单需要button_card模板配合
~~~

## 功能7：分布卡(温度分布、湿度分布)
**引用示例**
~~~
type: custom:xiaoshi-grid-card
entities:
  - entity: sensor.shidu_ciwo
    grid: 0%,0%,30%,29%
  - entity: sensor.shidu_keting
    grid: 32%,69%,17%,9%     # 横坐标、纵坐标、宽度、高度
    state: false             # false不显示数值，默认显示，可省略 
    unit: " %"               # 显示的单位，默认不显示，可省略
width: 100px                 # 卡片 整体宽度
height: 120px                # 卡片 整体高度
min: 20                      # 当前地区最小值
max: 80                      # 当前地区最大值
mode: 湿度                   # 【温度】或者【湿度】
~~~

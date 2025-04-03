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
top: 0vh  # 上下偏移的距离
url:
  - https://api.suyanw.cn/api/sjmv.php  # 引用图片api网址的数组
  - https://api.suyanw.cn/api/meinv.php # 引用图片api网址的数组
~~~

## 功能2：加载随机视频网址API
**引用示例**
~~~
type: custom:xiaoshi-video-card 
top: 0vh  # 上下偏移的距离
url:
  - https://videos.xxapi.cn/0db2ccb392531052.mp4 # 引用视频api网址的数组
  - https://videos.xxapi.cn/228f4dd7318750dd.mp4 # 引用视频api网址的数组
~~~

## 功能3：灯光控制卡（单卡）
**引用示例**
~~~
type: custom:xiaoshi-light-card
entity: light.light1   
width: 87vw           # 卡片宽度
height: 20vw          # 卡片高度
rgb: true             # 是否显示亮度、色温控制
show: auto            # 当有这行调用时，仅当灯光时on时才会显示，当灯光时off时卡片整体隐藏
theme: on             # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'  
~~~

## 功能4：灯光控制卡（灯组）
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
theme: on             # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
                      # 表头第一行有【总共开启xx盏灯】和全关按钮（没有灯光开启时，全关按钮隐藏）
~~~

## 功能5：插座控制卡（单插座）
**引用示例**
~~~
type: custom:xiaoshi-switch-card    【三击解锁】
entity: switch.switch1   # 插座实体
power: sensor.power1     # 插座对应功率实体
height: 85vw             # 卡片宽度
width: 20vw              # 卡片高度
theme: "on"              # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'      
~~~

## 功能6：插座控制卡（插座组）
**引用示例**
~~~
type: custom:xiaoshi-switch-group-card  【三击解锁】
entities:
  - entity: switch.switch1   # 插座1实体 
    power: sensor.power1     # 插座1对应功率实体
  - entity: switch.switch2   # 插座2实体
    power: sensor.power2     # 插座2对应功率实体
height: 85vw                 # 卡片宽度
width: 20vw                  # 卡片高度
theme: "on"                  # 选项on是白色，选项off是黑色，也可以引用全局函数：'[[[ return theme()]]]'
                             # 表头第一行有【插座开启xx个  关闭xx个  总功率xxW】 
~~~


## 功能7：时间显示卡(平板端)
**引用示例**
~~~
type: custom:xiaoshi-time-card
entity: sensor.lunar  #该实体需要配合NR使用
                      #弹出菜单需要button_card模板配合
~~~

# html解析流程

#### 建立连接阶段

DNS解析出域名的真实IP -> 与服务器建立TCP连接 -> 向服务器发起HTTP请求 -> 服务器返回HTML文件

#### HTML解析阶段

启动渲染主线程，从上往下解析HTML并构建**DOM树**

#### link异步下载解析

遇到link标签css链接，继续解析HTML，并行下载css文件，并解析css文件构建**CSSOM树**（CSS Object Model描述如何在DOM上应用CSS）

（如果link标签**rel=preload**，则**提前异步**下载css文件，下载完成后并不会直接解析CSS文件，需要手动把rel=stylesheet）

```HTML
<link href="demo.css" rel="preload" onload="this.rel='styleSheet'" />
```

#### script阻塞HTML

遇到script标签脚本，暂停解析HTML，下载script文件并执行完成脚本，如果脚本访问了CSSOM，则会暂停等待CSSOM完成

（如果script标签设置了**async**或**defer**属性，则会**异步并行**下载脚本文件，虽然下载不阻塞HTML解析，但是async下载完成后会立即执行，如果此时HTML解析未完成还是会暂停等待脚本执行完成，如果是defer，则会在HTML解析完成后再按顺序执行脚本）

#### **Computed Style**

HTML解析完成，DOM和CSSOM合并成**渲染树**Render Tree，包含节点结构和样式

#### **Layout**

计算渲染树各个节点的几何位置和大小生成**布局树**，再分析元素堆叠层级信息生成**层次树**

#### **Paint**

渲染主线程生成绘制指令，合成线程创建多个分块器线程进行图层分块处理，GPU进行光栅化处理确认像素点的渲染，最后执行绘制指令渲染页面。

![1739455895555](https://image.antoncook.xyz/picGo/1739455895555.jpg)

[渲染流程精讲](https://zhuanlan.zhihu.com/p/586060532)

重排：重新渲染主线程；重绘：只重新合成线程

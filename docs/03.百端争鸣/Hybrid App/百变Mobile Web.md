
## 响应式布局方案

### flexible

手淘的flexible实现原理实际上就是viewport + rem

1. 根据设备dpr动态修改viewport

```JavaScript
const viewportEle = document.documentElement.querySelector('meta[name="viewport"]')
const DPR = window.devicePixelRatio || 1
// viewport尺寸和缩放比例是成反比的
// scale越小，viewport越大，页面能显示的内容则越多，但是设备的屏幕宽度不变
// 所以看起来就像页面缩小了，渲染精度就更细了从而能解决1px的问题
const SCALE = 1 / DPR
viewportEle.setAttribute(
    'content', 
    `width=device-width,
    initial-scale=${SCALE},
    maximum-scale=${SCALE},
    user-scalable=no,
    viewport-fit=cover`
)
```

2. 根据视窗大小动态修改html节点fontsize

```JavaScript
const UI_PIXEL = 750 // 设计稿的宽度
const setHtmlFontSize = () => {
    const deviceWidth = document.documentElement.clientWidth
    const fontSize = deviceWidth / UI_PIXEL * 100 // 设备尺寸和设计的比例，*100便于计算
    document.documentElement.style.fontSize = fontSize + 'px' 
}
setHtmlFontSize() // 初始化执行
window.addEventListener('onResize', setHtmlFontSize)
```

3. 使用rem为css单位

```CSS
.test {
    width: 375 / 100 rem
}
// 可以用postcss-px-to-rem直接转换
```

### vw + rem

```CSS
// 定义fontSize，便于计算即可，只要依旧该fontSize转rem和vw即可
$html_fontSize: 75
@function rem($px) {
    // px转rem
    @return ($px / $html_fontSize) * 1rem;
}
// 以750px的物理像素设计稿来计算
$uiPixel: 750
html {
    // px转vw，因为vw是逻辑像素，所以需要/2换算成逻辑像素
    font-size: ($html_fontSize/ ($uiPixel / 2)) * 100vw
}
@media screen and (max-width: 320px) {
    font-size: 64px
}
@media screen and (min-width: 540px) {
    font-size: 108px
}
body {
    max-width：540px;
    min-width: 320px;
}
```

### 1px的问题

| 方案     | 对 1px 的处理方式                       | 存在的问题                       |
| -------- | --------------------------------------- | -------------------------------- |
| flexible | 缩放viewport的DPR使其还原设计稿viewport | 不支持viewport的场景             |
| vw+rem   | 通过rem小于 1px 的 vw 解决              | 不兼容高精度vw甚至不支持vw的场景 |

## 像素

参考资料：[基于Viewport的移动端web屏幕适配方案详解](https://juejin.cn/post/6931691734669885454#heading-15)

### DPR

#### 物理像素

#### 设备像素

### 视口

#### 布局视口

#### 视窗视口

在移动端document.doucmentElement.clientWidth始终为980px，所以移动端可以显示完整的

## 调试方案

[Webview调试大法](./Webview调试大法)

## 经验包

### 技术方案

多页面打包与apollo热更新

webview通信规则

cordova codepush热更新

Jpush极光推送

### 兼容问题

1. fastclick：移动端为了适配双击手势事件，点击事件的响应会有300ms的延时
2. ios键盘，safari导航栏，webview的手势前进处理，history堆栈处理，ios本地资源沙箱跨域
3. 使用node服务处理iframe嵌套微信文章的跨域问题，node服务通过text形式请求微信文章，然后替换html文本里涉及跨域的src，再以contentType为html返回给前端页面
4. ios软键盘回弹空白：监听input失去焦点，延时对页面的的滚动距离进行回调

```js
(function (_this) {
    var isIOS = /iphone|ipad|ipod/.test(_this.navigator.userAgent.toLowerCase());
    if (isIOS) {
        var keybordHandler = function () {
            var currentposition, timer;
            var speed = 1; //页面滚动&巨离
            timer = setInterval(function () {
                currentPosition = _this.document.documentElement.scrollTop || _this.document.body.scrollTop;
                currentPosition -= speed;
                window.scrollTo(0, currentposition); // 页面向上滚动
                currentPosition += speed; // speed 变量
                window.scrollTo(0, currentposition); // 页面向下滚动
                clearInterval(Rmer);
            }, 1);
        }；
        var inputList = _this.document.getElementsByTagName('input');
        for (var i = 0; i < inputList.length; i++) {
        	inputList[i].addEventListener('blur', keybordHandler);
        }
    }
})(window);
```

5. 滚动穿透问题：设置滚动容器overflow:hidden，或者fixed固定
6. 移动端默认passive为true，调用preventDefault不会生效，可以让浏览器执行默认的滚动优化处理，减少主线程阻塞

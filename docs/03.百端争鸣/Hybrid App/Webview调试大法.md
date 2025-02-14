# Webview调试大法

| 机型场景 / PC系统   | Mac                                 | Windows                                     |
| ------------------- | ----------------------------------- | ------------------------------------------- |
| IOS                 | IOS Safari、Mac Safari              | IOS Safari、ios-webkit-debug-proxy + Chrome |
| Android             | Android 非X5浏览器、Chrome + VPN    | Android 非X5浏览器、Chrome + VPN            |
| Android X5(微信/QQ) | http://debugx5.qq.com、Chrome + VPN | http://debugx5.qq.com、Chrome + VPN         |
| IOS X5              | ❌                                  | ❌                                          |

## Android

### Chrome

---

适用场景：非鹅厂Webview

1. #### VPN
2. #### 确认Android手机连上电脑

重要：需在开发者选项里允许USB调试

检测android连接情况

```Plain
adb devices
```

3. #### 在chrome地址栏输入 chrome://inspect

![1739437492121](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437492121.jpg)

4. #### 打开要调试的页面，PC可和移动端同步操作

![1739437526001](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437526001.jpg)

### TBS-X5内核

腾讯浏览服务(TBS)是致力于优化移动端webview体验的整套解决方案。该方案由SDK、手机QQ浏览器X5内核和X5云端服务组成，解决移动端webview使用过程中出现的一切问题，优化用户的浏览体验。同时，腾讯还将持续提供后续的更新和优化，为开发者提供最新最优秀的功能和服务。

#### [TBS Studio](https://x5.tencent.com/tbs/guide/debug/download.html)

---

X5内核浏览器的调试工具

页面下载按钮有错，打开F12开发者面板再点击下载按钮，可看到下载链接，点击链接手动下载

适用场景：鹅厂Android APP Webview，小程序（已不支持）

![1739437583740](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437583740.jpg)

#### [X5内核管理](http://debugtbs.qq.com)

---

X5内核管理工具，只可在X5内核的浏览器中打开

![1739437605776](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437605776.png)

#### [X5内核调试工具](http://debugx5.qq.com/)

---

X5内核调试工具页面，只可在安装了X5内核

提示：如果该链接打不开，先打开上面的「X5内核管理工具」检查内核

勾选 inspector调试，调试webview

勾选 X5JsCore，调试小程序（已不支持）

![1739437622485](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437622485.jpg)

#### [前端X5内核常见问题官方解答](https://x5.tencent.com/tbs/technical.html#/detail)

---

小程序已经不支持调试的原因：

![1739437655155](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437655155.jpg)

## IOS

### Safari

---

适用场景：IOS Safari，用原生WKWebview的APP

Safari版本和Mac版本直接关联，比较新的IOS不升级macOS就无法调试，有时候可以使用[Beta版Safari](https://developer.apple.com/download/all/?q=Safari)

1. #### IOS设置Safari

![1739437676596](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437676596.jpg)

2. #### Mac设置Safari

![1739437695468](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437695468.jpg)

3. #### IOS 使用Safari打开一个网页
4. #### Mac使用Safari找到页面进行调试

![1739437719438](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437719438.jpg)

### ios-webkit-debug-proxy

---

可用任意浏览器调试IOS，例如Chrome

适用场景：IOS Safari，用原生WKWebview的APP

1. #### 安装[ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy)

```Plain
// MacOS
// HOMEBREW_NO_AUTO_UPDATE 可以取消brew自动更新，否则将会十分漫长，而且90%出错
HOMEBREW_NO_AUTO_UPDATE=1 brew install ios-webkit-debug-proxy

// Windows
scoop bucket add extras
scoop install ios-webkit-debug-proxy
```

2. #### 确保iphone连接上电脑

如果未连接设备是无法启动的

3. #### 作为Chrome devtools启动

```Plain
ios_webkit_debug_proxy -f chrome-devtools://devtools/bundled/inspector.html
```

默认9221端口，可看到已连接的设备

![1739437746330](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437746330.jpg)

第一个设备9222端口，可看见已打开的页面，到此确定ios-webkit-debug-proxy安装成功

4. #### 安装[remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)

*在 Chrome 和 Safari 的最新版本中，* *[Chrome Remote Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol)* *和* *[Webkit Inspector Protocol](https://github.com/WebKit/webkit/tree/master/Source/JavaScriptCore/inspector/protocol)* *之间存在重大差异，这意味着较新版本的 Chrome DevTools 与 Safari 不兼容。*

```Plain
// MacOS
npm install remotedebug-ios-webkit-adapter -g

// Windows
scoop bucket add extras
scoop install ios-webkit-debug-proxy
```

5. #### 启动[remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)

```Plain
remotedebug_ios_webkit_adapter --port=9000
```

![1739437762260](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437762260.jpg)

6. #### 配置Chrome Devtools - network target

新增9000端口

![1739437779766](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437779766.jpg)

7. #### 开始调试页面

### 模拟器

---

模拟器ios版本与Xcode版本关联，Xcode版本又受到MacOS版本限制

1. #### 安装Xcode
2. #### 查看已安装模拟器

```Plain
xcrun instruments -s
```

or

```bash
xcrun simctl list
```

3. #### 启动模拟器

```Plain
xcrun simctl boot 模拟器名
```

or

```bash
xcrun instruments -w 模拟器名
```

4. #### 使用模拟器Safari调试，同IOS真机

![1739437803829](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437803829.jpg)

5. #### 如果有app安装包，也可以调试app

## 其他工具

### Charles

---

#### 代理请求到本地

1. ##### Charles基础配置省略

提示：Android抓https需要root，或者目标APP开放了权限

2. ##### 抓包，找到要代理的请求或文件
3. ##### 右击目标请求，选中Map Local

![1739437819053](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437819053.jpg)

4. ##### 选中要代理的本地文件

![1739437832539](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/1739437832539.jpg)

### [BrowserSync](http://www.browsersync.cn/)

---

```Plain
browser-sync start --proxy "主机名"
```

| 机型场景 / PC系统   | Mac                                 | Windows                                     |
| ------------------- | ----------------------------------- | ------------------------------------------- |
| IOS                 | IOS Safari、Mac Safari              | IOS Safari、ios-webkit-debug-proxy + Chrome |
| Android             | Android 非X5浏览器、Chrome + VPN    | Android 非X5浏览器、Chrome + VPN            |
| Android X5(微信/QQ) | http://debugx5.qq.com、Chrome + VPN | http://debugx5.qq.com、Chrome + VPN         |
| IOS X5              | ❌                                  | ❌                                          |

# Android

## Chrome

---

适用场景：非鹅厂Webview

1. ### VPN
2. ### 确认Android手机连上电脑

重要：需在开发者选项里允许USB调试

检测android连接情况

```Plain
adb devices
```

3. ### 在chrome地址栏输入 chrome://inspect

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MTk2NWQ1Nzc4ZDhmNmNhYjU2NzUzZGI1ZDJiNDM3OTRfa3d6dTA4SnNIUHpTZWh5TERsWEE2SGI2dnNwNDVyeElfVG9rZW46SnFQOGJWOTZub0hZMFR4OUJkY2NoaUpFbmdhXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

4. ### 打开要调试的页面，PC可和移动端同步操作

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ODQ3MmM5YzI0ZGU3NmE4ZWM1NmQ2OTJjZjMzYTI4NDZfamZKU1dIbnY1V216bkNqU0VtYmprVXdCSGdKNGllQ3VfVG9rZW46UVA0WWJVUmZjb1p1Z1Z4MWhGOGNJbU5qbmNlXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

# TBS-X5内核

腾讯浏览服务(TBS)是致力于优化移动端webview体验的整套解决方案。该方案由SDK、手机QQ浏览器X5内核和X5云端服务组成，解决移动端webview使用过程中出现的一切问题，优化用户的浏览体验。同时，腾讯还将持续提供后续的更新和优化，为开发者提供最新最优秀的功能和服务。

## [TBS Studio](https://x5.tencent.com/tbs/guide/debug/download.html)

---

X5内核浏览器的调试工具

页面下载按钮有错，打开F12开发者面板再点击下载按钮，可看到下载链接，点击链接手动下载

适用场景：鹅厂Android APP Webview，小程序（已不支持）

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NTQxNzg4YWU0ZjgwYTNiMTZlOTlmODUzMTZjMGNkOGFfTktYNE1CT0NSOFNnb3VtVWcyc2xhVWlxM01RWEF0NFRfVG9rZW46WUdaNGJ1N1Y0b3hpc2d4M1lVTWNGblc4bmtmXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

## [X5内核管理](http://debugtbs.qq.com)

---

X5内核管理工具，只可在X5内核的浏览器中打开

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGY2Y2NkZThiZDQ3MmUzYzEwNjM4NDYyYWY0ZjllMzJfbkVSYVh4dWR0aXVnREpjeDBsY3dNVkN3QmZab2xrMjVfVG9rZW46UHd0c2JvZXVPb0I3R3N4M0lSUmNOakpKbjVlXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

## [X5内核调试工具](http://debugx5.qq.com/)

---

X5内核调试工具页面，只可在安装了X5内核

提示：如果该链接打不开，先打开上面的「X5内核管理工具」检查内核

勾选 inspector调试，调试webview

勾选 X5JsCore，调试小程序（已不支持）

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ODFlMmY5NTEwNmQ4ZDVkOWI0YWM0NDE3MzMxODhiNTFfcUdmbm51YWxzMERGcG9QNHIwbTdUZTdreEl3eGVucnNfVG9rZW46TVhRSmJadllQb1IxeTN4VzNwamNBZURTblljXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

## [前端X5内核常见问题官方解答](https://x5.tencent.com/tbs/technical.html#/detail)

---

小程序已经不支持调试的原因：

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NmFlZDZhYzJiNmJhN2E0YTU1OTJjYzVkODc3NDNiNWJfQ3VpYm5nbU8wQUUwb0VtQnp2U3NaS3g5S3hMR0VGN2VfVG9rZW46VDZZcmJwS0Nwb0o5Zjl4NzRqSmNWU3pLblV4XzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

# IOS

## Safari

---

适用场景：IOS Safari，用原生WKWebview的APP

Safari版本和Mac版本直接关联，比较新的IOS不升级macOS就无法调试，有时候可以使用[Beta版Safari](https://developer.apple.com/download/all/?q=Safari)

1. ### IOS设置Safari

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDZhYmRmNGEwZWZmYWY5OTAwNWZkYTU1NDI1NmU0NzhfbHFpMUNTcGwxOVNtRkFXV2xyUUlWaGJXdTE2M3o1VWdfVG9rZW46R1k0ZGJpVzIyb2ZqdG94S1pqM2NWSE1XbmxCXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

2. ### Mac设置Safari

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=YzVjZmMyZDZmNDAwZjBkODMyMGRiMjIxMjA3MWU1YmJfT2pwN29BTU9XR1RWdVdFbml6NWdHdTUzNnFiUUxPOFFfVG9rZW46WEMySWJLaWpJb3hIZW94V0Y1aGNiTXVkblpiXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

3. ### IOS 使用Safari打开一个网页
4. ### Mac使用Safari找到页面进行调试

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MzMwYjBhNGU5MDE4OTVhMmY5NGNkMzQ5NTYxNWU4MDBfdFRKMzY0R0RPdTNyVGV2ZGRtdnVFRTVMV0FFSHBVNFdfVG9rZW46QXRYSWI0OHBMb1FzQkV4OWxKTmNEZFd6bjNnXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

## ios-webkit-debug-proxy

---

可用任意浏览器调试IOS，例如Chrome

适用场景：IOS Safari，用原生WKWebview的APP

1. ### 安装[ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy)

```Plain
// MacOS
// HOMEBREW_NO_AUTO_UPDATE 可以取消brew自动更新，否则将会十分漫长，而且90%出错
HOMEBREW_NO_AUTO_UPDATE=1 brew install ios-webkit-debug-proxy

// Windows
scoop bucket add extras
scoop install ios-webkit-debug-proxy
```

2. ### 确保iphone连接上电脑

如果未连接设备是无法启动的

3. ### 作为Chrome devtools启动

```Plain
ios_webkit_debug_proxy -f chrome-devtools://devtools/bundled/inspector.html
```

默认9221端口，可看到已连接的设备

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjNmYzAxZGY1MTc3ZjU1OGY3ZTUwNWFkNzlmMGE5ZDdfSmNPdlpRcTg0SG5XS3YyeWJ4bHNEOG9mWkdMWVZndXBfVG9rZW46T2lOWGJWTDRzb0dnb2V4emg5dWN2TW40bm9iXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

第一个设备9222端口，可看见已打开的页面，到此确定ios-webkit-debug-proxy安装成功

4. ### 安装[remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)

*在 Chrome 和 Safari 的最新版本中，* *[Chrome Remote Debugging Protocol](https://developer.chrome.com/devtools/docs/debugger-protocol)* *和* *[Webkit Inspector Protocol](https://github.com/WebKit/webkit/tree/master/Source/JavaScriptCore/inspector/protocol)* *之间存在重大差异，这意味着较新版本的 Chrome DevTools 与 Safari 不兼容。*

```Plain
// MacOS

npm install remotedebug-ios-webkit-adapter -g



// Windows

scoop bucket add extras

scoop install ios-webkit-debug-proxy
```

5. ### 启动[remotedebug-ios-webkit-adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)

```Plain
remotedebug_ios_webkit_adapter --port=9000
```

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MmY4NDM3ODUyZDA2ZGRkYzczYWVjMDMxNTdlNTQ5YjFfdkppbEViZkhydTFJMERtd0ZTczJnY0JqSzhCaXFLSXRfVG9rZW46RUt6NmJyYjYxbzExZGJ4MGI2aGNnZHg4bkNmXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

6. ### 配置Chrome Devtools - network target

新增9000端口

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MDYxNzAyOGM2ZjZlNTZjZjhmODE3ZDVjN2NlZDM0YWRfQllVMkpKT2l5dk91VnExNkVEUGZGM2o5SG9XREdyVXFfVG9rZW46RUJYZGJUVnhsb1lURTZ4NllqbmNSSXdibnNmXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

7. ### 开始调试页面

## 模拟器

---

模拟器ios版本与Xcode版本关联，Xcode版本又受到MacOS版本限制

1. ### 安装Xcode
2. ### 查看已安装模拟器

```Plain
xcrun instruments -s

or 

xcrun simctl list
```

3. ### 启动模拟器

```Plain
xcrun simctl boot 模拟器名

or

xcrun instruments -w 模拟器名
```

4. ### 使用模拟器Safari调试，同IOS真机

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ODEzOGQyMjVkZGIxZjlhNDRjOWJlNDAxN2YyOWY0MDNfOVZBWThZaG5SdnZQMDVlcnV0ek1WWjdCWkZqeVpwcGtfVG9rZW46QXpPQ2I0UEphb1BIeWJ4bWR2MmNSQVVUbjVmXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

5. ### 如果有app安装包，也可以调试app

# 其他工具

## Charles

---

### 代理请求到本地

1. ### Charles基础配置省略

提示：Android抓https需要root，或者目标APP开放了权限

2. ### 抓包，找到要代理的请求或文件
3. ### 右击目标请求，选中Map Local

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=OWFhZDI3NjJkMzNlMjBjZjFkYzViNmZkY2Q4OGE1NzBfek5INzl2Sm1RRloyYzh4b0JFaVpRVjM2cGlxRW9hN01fVG9rZW46RjB4cGJTZmdqb3RWNVR4QnhGSGN6SWNibmFlXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

4. ### 选中要代理的本地文件

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTk3NDQ4ZGY0OTVhYzVkZDk1NTQ4ZTEzMTI5OWE0YjJfM3NLV1dVb3I0ZFV3VVA5dFUwcTZ1SjdUY2NxdHNMN0VfVG9rZW46SEZNOWJ6ZXhVb2xYYVZ4VFBqWGNUNHpxbnlkXzE3Mzc1MzQ1ODE6MTczNzUzODE4MV9WNA)

## [BrowserSync](http://www.browsersync.cn/)

---

```Plain
browser-sync start --proxy "主机名"
```

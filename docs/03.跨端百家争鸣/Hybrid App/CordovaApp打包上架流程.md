# CordovaApp打包上架流程

## 关键流程

一、Web项目打包

二、打包App上架应用市场

三、发布code-push（App热更新）

## 详细打包步骤

### 一、Web项目打包

在你的Web项目中，执行打包指令获得输出文件。

假设输出文件夹`build`，复制文件夹下所有内容

[![md_2](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_1.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_1.jpg)

### 二、打包App

**1、删除本项目中`www/`文件夹下的所有内容，然后把第一步复制的所有内容粘贴到`www/`中：**

[![md_2](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_2.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_2.jpg)

**2、修改`./config.xml`文件中的版本号，它应该和你的Web项目中的版本号保持一致：**

[![md_3](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_3.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_3.jpg)

**3、在命令行中运行`cordova prepare`。应先改版本号再prepare，否则改的版本号不会更新到app上。**

[![md_4](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_4.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_4.jpg)

#### Android

**1、检查`./build-extras.gradle`中的`productFlavors`字段，测试环境和生产环境有区别：**

测试环境`productFlavors`应该是空的：

[![md_5](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_5.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_5.jpg)

生产环境`productFlavors`有各个渠道的配置：

[![md_6](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_6.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_6.jpg)

**2、运行`cordova build android — release`打包安卓，在`platforms/android/build/outputs/apk/`文件夹下可以找到打包好的apk文件。根据步骤4中`productFlavors`的不同，打包出来的文件数不一样。这里面，`x86`文件夹里的apk是不能用的，所以打完包可以删掉`x86`文件夹。**

生产环境：

[![md_7](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_7.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_7.jpg)

测试环境：

[![md_8](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_8.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_8.jpg)

有时候测试环境打包出来也有很多文件夹，那是因为之前的没有清理，实际上更新的只有`arm7`和`x86`。

**到这里，Android的打包就完成了。生产环境中把apk文件夹压缩了发送给运营同学，就可以往各个渠道上发布了**

#### IOS

**1、在xcode中打开`platforms/ios/一度店.xcworkspace`文件，打开iOS的工程，选为Generic iOS Device**

[![md_9](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_9.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_9.jpg)

**2、Product -> Archive打包**

[![md_10](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_10.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_10.jpg)

**3、打包成功后，点击Distribute App，选择发布方式**

[![md_11](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_11.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_11.jpg)

**4、生产环境选择iOS App Store，测试环境选择Ad Hoc**

[![md_12](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_12.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_12.jpg)

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_13.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_13.jpg)

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_14.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_14.jpg)

[![15](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_15.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_15.jpg)

到这里，iOS的打包就算结束了。如果是测试环境，往蒲公英上传打包好的ipa文件就完成了，如果是生产环境，往下看。

**5、在苹果上操作发布app**

打开https://developer.apple.com/account/，输入帐号和密码，到达能信苹果帐号主页，点击App Store Connect -> Go to App Store Connect -> 选“我的App” -> 点击进入“一度店”：

[![16](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_16.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_16.jpg)

[![17](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_17.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_17.jpg)

[![18](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_18.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_18.jpg)

**6、在TestFlight里处理合规证明，然后新建Apple Store新版本，关联构建版本**

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_19.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_19.jpg)

[![20](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_20.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_20.jpg)

[![21](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_21.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_21.jpg)

[![22](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_22.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_22.jpg)

到这里，补上其他的相关信息，就可以提交审核了。审核通过后，就可以发布到App Store了，生产环境app的发布就完成了。

### 三、发布code-push（生产包需要，测试包不需要）

**1、为什么生产一定要发布code-push？**

因为生产环境的App会在wifi环境下，会在打开App时静默检查code-push和App上的代码是否一致。如果不及时发布code-push，有可能会导致用户下载新版App后，内容却出现倒退的情况。

举个例子，App Store上发布了新版本3.4.2，而之前用户手机里App是3.3.3，code-push上的版本也是3.3.3，当用户更新到3.4.2，在wifi环境下打开App时，触发了code-push的检查，发现3.4.2 !== 3.3.3，于是code-push下载3.3.3版本并更到App上。

**2、发布code-push**

运行`npm run codePush`，并且选择production、选择Android和iOS：

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_23.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_23.jpg)

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_24.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_24.jpg)

最后输入版本描述，包括发布时间、版本号、内容：

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_25.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_25.jpg)

确认后就发布了。仔细看发布的log，有2处successfully，就表明2个平台的code-push都发布成功了:

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_26.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_26.jpg)

[![img](https://github.com/AntonHu/cordova-app/raw/main/markdown_img/md_27.jpg)](https://github.com/AntonHu/cordova-app/blob/main/markdown_img/md_27.jpg)

**至此，整个生产环境的发布就成功了。**
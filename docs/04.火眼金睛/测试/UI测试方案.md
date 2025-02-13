# UI测试方案

## Puppeteer

通过无头浏览器模拟网页的浏览交互，然后截图保存后检查UI是否符合预期

```JavaScript
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6']; // 使用预设的iphone6设备环境预设

/* 模拟设备环境启动无头浏览器 */
const browser = await puppeteer.launch({
  headless: true // 默认值也是true，无头浏览器，如果想同时预览网页可以设置成false
});
const page = await browser.newPage(); // 新建一个标签页
await page.emulate(iPhone); // 模拟设备环境
/* 模拟访问网页 */
await page.goto('https://antonHu.github.io'); // 前往目标网站
await timeout(1000); // 延时等待页面加载完成
await page.screenshot({ // 截图
     path: 'loaded.png'
 });
/* 模拟点击 */
await page.tap('.button'); // 点击douemnt.selector('.js_sale_buyalbum')节点
await page.screenshot({ // 再生成一张截图
    path: 'clickButton.png'
 });
/* 模拟输入 */
await page.tap("#input"); //直接操作dom选择器，是不是很方便
await page.type("Hi! I am AntonHu.");
await page.screenshot({ // 再生成一张截图
    path: 'input.png'
 });
 browser.close(); // 关闭浏览器
```
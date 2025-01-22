## html

### 网页解析流程

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

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=Zjc5ODJhNDAwZGVhOGI5YTJhOGJhZGM4MjdlMjBkMWVfNXplUVJQOHhVZHdBYlhnUk9UMGVoWE9zc0VhN2c0a2lfVG9rZW46WTd5SmI4Q0Nxb25hSnh4QVdWZGNkTGt3bjJmXzE3Mzc1MzQwMjg6MTczNzUzNzYyOF9WNA)

[渲染流程精讲](https://zhuanlan.zhihu.com/p/586060532)

重排：重新渲染主线程；重绘：只重新合成线程

### 图片

#### img**标签渲染流程**

1. **HTML 解析** ：浏览器解析 HTML，遇到 `<img>` 标签时发起图片资源请求。
2. **资源加载** ：根据 `src` 属性加载图片资源（从缓存或服务器）。
3. **图片解码** ：将图片解码为位图（bitmap）。
4. **布局（Layout）** ：根据图片尺寸（由 `width`、`height` 或 CSS 指定）计算布局。
5. **绘制（Paint）** ：将解码后的位图绘制到屏幕上。
6. **合成（Composite）** ：将图片与其他页面内容合成，最终显示。

#### 优化手段

###### **图片格式优化**

* 使用现代图片格式（如 WebP、AVIF）。
* 根据场景选择格式（PNG 适合透明度，JPEG 适合色彩丰富图片，SVG 适合矢量图标）。

转**WebP**案例：

1. 图片资源转webp，一般不本地转码浪费资源，使用OSS提供的转码api处理，除非是文件处理的项目。

```JavaScript
/** 判断当前环境是否支持webp */
const isSupportWebp = () => {
    return new Promise((res, rej) => {
        const webp = new Image()
        webp.onerror = () => rej()
        // 宽度和资源尺寸不匹配说明不支持
        webp.onload = () => res(webp.width === 1)
        // 1*1的webp资源
        webp.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
    })
}
/** 转webp */
const toWebp = async (image) => {
    const isSupport = await isSupportWebp().catch(e => console.log(e))
    if (isSupport) {
        // 图片转webp的处理，canvas，使用OSS转码
    }
}
```

2. 资源持久化配置OSS，对图片资源自动生成webp的cdn缓存

###### **图片尺寸优化**

使用 `srcset` 和 `sizes` 实现响应式图片。

* `srcset`：指定一组图片资源及其宽度或像素密度。
* `sizes`：指定图片在不同屏幕宽度下的显示尺寸。

```HTML
<img src="small.jpg"
     srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w"
     sizes="(max-width: 600px) 500px, (max-width: 1200px) 1000px, 1500px"
     alt="Responsive Image">
```

压缩图片（如 TinyPNG、ImageOptim）。

###### **懒加载（Lazy Loading）**

* 使用 `loading="lazy"` 属性：

```HTML
<img src="image.jpg" loading="lazy" alt="Lazy Loaded Image">
```

* 使用 Intersection Observer API 实现懒加载。

```JavaScript
const images = document.querySelectorAll('img[data-src]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

images.forEach(img => observer.observe(img));
```

###### **预加载（Preload）**

* 使用 `<link rel="preload">`：

```HTML
<link rel="preload" href="critical-image.jpg" as="image">
```

###### **渐进加载**

| 特性     | 渐进式 JPEG          | 基线 JPEG        |
| -------- | -------------------- | ---------------- |
| 加载方式 | 从模糊到清晰逐步显示 | 从上到下逐行显示 |
| 用户体验 | 更好                 | 较差             |
| 文件体积 | 略大                 | 较小             |
| 解码性能 | 可能更消耗 CPU       | 较低             |
| 兼容性   | 现代浏览器支持良好   | 所有浏览器支持   |

* 使用渐进式 JPEG 或模糊效果：

```HTML
<img src="placeholder.jpg" data-src="progressive-image.jpg" class="progressive" alt="Progressive Image">
```

```CSS
.progressive {
  filter: blur(5px);
  transition: filter 0.3s;
}
.progressive.loaded {
  filter: blur(0);
}
```

```JavaScript
const img = document.querySelector('img.progressive');
img.src = img.dataset.src;
img.onload = () => img.classList.add('loaded');
```

###### **CDN 加速**

* 使用 CDN 分发图片资源，提升加载速度。

###### **缓存优化**

* 使用 HTTP 缓存（`Cache-Control`、`ETag`）。
* 使用 Service Worker 缓存图片资源。

```JavaScript
// 注册serviceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Worker 注册成功');
  });
}

// sw.js
const CACHE_NAME = 'image-cache-v1';
const urlsToCache = [
  '/images/image1.jpg',
  '/images/image2.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

###### **减少图片数量**

* 使用 CSS 替代小图标：更小的文件体积，更好的渲染性能，更灵活的响应式尺寸，css代码的维护性高。
* 使用雪碧图（Sprite）合并多个小图标。

###### **异步解码**

* 使用 `decode()` 方法异步解码图片：

```JavaScript
const img = new Image();
img.src = 'image.jpg';
img.decode().then(() => {
  document.body.appendChild(img);
});
```

###### **图片加载失败处理**

1. **设置** `alt` **属性**

* **作用** ：为图片提供替代文本，当图片加载失败时显示。
* **示例** ：

```HTML
<img src="non-existent-image.jpg" alt="Description of the image">
```

---

2. **使用备用图片**

* **作用** ：当图片加载失败时，显示备用图片。
* **实现** ：

```HTML
<img src="non-existent-image.jpg" onerror="this.src='fallback.jpg'" alt="Fallback Image">
```

---

3. **设置固定尺寸**

* **作用** ：避免图片加载失败后布局错乱。
* **示例** ：

```HTML
<img src="non-existent-image.jpg" width="300" height="200" alt="Example Image">
```

---

4. **使用 CSS 占位符**

* **作用** ：在图片加载失败时显示占位符（如背景色或图标）。
* **示例** ：

```HTML
<div class="image-container">
  <img src="non-existent-image.jpg" onerror="this.style.display='none'" alt="Example Image">
</div>
```

```CSS
.image-container {
  width: 300px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-container::after {
  content: "Image not available";
  color: #999;
}
```

---

5. **使用 JavaScript 监听错误**

* **作用** ：通过 JavaScript 监听图片加载失败事件，执行自定义操作。
* **示例** ：

```HTML
<img src="non-existent-image.jpg" id="dynamic-image" alt="Example Image">
```

---

6. **使用** `<picture>` **标签**

* **作用** ：提供多个图片源，根据设备或条件选择合适的图片。
* **示例** ：

```HTML
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="fallback.jpg" alt="Fallback Image">
</picture>
```

如果 `image.webp` 和 `image.jpg` 都加载失败，会显示 `fallback.jpg`。

## CSS

### BFC

### vertical-align

垂直方向上的对齐，只对行内元素生效，不继承，即设置在父级块元素无法生效

`baseline`与父级基线对齐

`middle`与 父级基线+父级高度一半 对齐

`top`顶部与所在行顶部对齐

`bottom`底部与所在行底部对齐

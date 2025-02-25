# webpack打包优化

## 构建提速

### 持久化缓存

Webpack 4 自身并不直接提供内置的持久化缓存功能，但可以通过配置 `cache` 选项或者借助第三方插件实现

- 内置缓存配置：可以设置 `cache.type` 为 `'memory'` 或 `'filesystem'` 来控制是否启用内存缓存或文件系统缓存。对于持久化缓存来说，我们应该选择 `'filesystem'`。

```Plain
module.exports = {
  // ...
  cache: {
    type: 'filesystem', // 启用文件系统缓存
    buildDependencies: {
      config: [__filename], // 当 webpack 配置变化时清除缓存
    },
  },
};
```

- hard-source-wepack-plugin：它可以创建更复杂的缓存逻辑，包括跨不同构建之间共享缓存。

```JavaScript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin(),
  ],
};
```

### DllReferencePlugin三方库处理

`DllReferencePlugin`：先将常用的大型三方库打包成dll，再通过webpack.DllReferencePlugin引用dll，节省重复打包

### 多线程压缩

对于生产环境下的代码压缩，可以使用 `TerserPlugin` 的 `parallel` 选项来启用多线程压缩

```JavaScript
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 启用多线程压缩
      }),
    ],
  },
};
```

### thread-loader多线程

将任务分配给多个 worker 线程的 loader。它适合那些耗时较长的任务，比如 JavaScript 文件的转译（通过 Babel）、样式文件的处理等

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              // Your Babel options here
            },
          },
        ],
        include: path.resolve('src'),
      },
    ],
  },
};
```

### cache-loader缓存

可以缓存任何 loader 的结果，这样在下次构建时如果输入没有变化就可以直接使用缓存。这对于大型项目来说非常有用

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
        include: path.resolve('src'),
      },
    ],
  },
};
```

## 打包体积优化

### Tree Shaking 

### splitChunks

代码分割，也可以动态import()

## 样式优化

### 首屏样式提取

`html-critical-webpack-plugin` 插件通过 **Puppeteer**（无头浏览器）来模拟页面渲染，并使用 **Critical CSS 提取算法** 识别出首屏样式，将这部分“关键CSS”关联进html的head中，并将非关键样式分离延后加载。

```javascript
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlCriticalWebpackPlugin({
      base: 'dist', // 输出目录
      src: 'index.html', // 目标 HTML 文件
      dest: 'index.html', // 输出 HTML 文件
      inline: true, // 内联关键 CSS
      minify: true, // 压缩关键 CSS
      width: 1300, // 视口宽度
      height: 900, // 视口高度
      penthouse: {
        blockJSRequests: false, // 是否阻止 JavaScript 请求
      },
    }),
  ],
};
```

优点

- **提升首屏加载速度**：通过内联关键 CSS，减少渲染阻塞时间。
- **优化用户体验**：确保用户能够尽快看到页面的核心内容。
- **自动化处理**：无需手动提取关键 CSS，插件会自动完成。

缺点

- **依赖 Puppeteer**：需要安装 Puppeteer，可能会增加构建时间。
- **动态内容处理困难**：对于动态生成的内容（如通过 JavaScript 渲染的 DOM 元素），可能无法准确提取关键 CSS。
- **配置复杂**：对于复杂的项目，可能需要调整配置以确保提取的 CSS 准确无误。

### 清除冗余样式

`purgecss-webpack-plugin` 插件会扫描项目中的 HTML、JavaScript 等文件，识别出实际使用到的 CSS 类名，然后与 CSS 处理工具（如 PostCSS）配合，移除未被引用的 CSS 。

```js
const HtmlCriticalWebpackPlugin = require('purgecss-webpack-plugin');

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }), // 匹配 src 目录下的所有文件
    }),
  ],
};
```


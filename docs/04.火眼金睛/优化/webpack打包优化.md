# webpack打包优化

## 构建速度优化

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

DllReferencePlugin：先将常用的大型三方库打包成dll，再通过webpack.DllReferencePlugin引用dll，节省重复打包

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

Tree Shaking 消除未使用的代码

optimization.splitChunks 代码分割，也可以动态import()
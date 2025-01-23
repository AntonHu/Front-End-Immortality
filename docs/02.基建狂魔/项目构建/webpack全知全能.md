# Webpack全知全能

## 模块化

### UMD

## 原理

### 打包流程

1. 初始化，合并命令行参数，配置文件参数，得到最终的打包配置，创建compiler打包管理对象
2. 解析入口，递归解析模块依赖关系，构建依赖图
3. 加载模块，根据依赖图，加载各个模块并根据类型进行处理
4. 模块转译：通过loader进行各个类型模块的转译处理
5. 产生bundle：将加载好的模块合并成bundle文件
6. bundle优化：一系列优化输出产物的处理，tree shaking，terser压缩等
7. 输出文件：将打包产物输出到指定的路径

### 手写源码

```JavaScript
const module_list = {
    '模块路径': function (module, exports, __webpack_require_) {
        // 模块加载函数
        var dependency = __webpack_require_('依赖的模块路径') // 加载依赖模块
        exports.handler = function() {} // 一些业务逻辑
    },
    '被依赖模块路径': function (module, exports, __webpack_require_) {
        // 模块加载函数
        exports.handler = function() {} // 一些业务逻辑
    }
}
(function(modules) {
    var installedModules = [] // 已加载的模块列表
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            // 当前模块已加载
            return installedModules[moduleId].exports
        }
        // 创建模块加载对象
        const module = {
            id: moduleId,
            isLoaded: false,
            code: '模块内代码',
            export: {}
        }
        // 调用模块，进行模块加载处理
        // 参考了CommonJS module.exports的写法，webpack把模块加载得到的数据都放到exports里
        // 所以这里把上下文指向module.exports
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
        module.isLoaded = true // 模块加载完成
        return module.exports // 返回带有模块导出数据的exports，供依赖该模块的其他模块使用
    }
    // 模块加载入口
    return __webpack_require__("./src/index.js");
}(module_list))
```

### 生命周期

1. 初始化阶段：
   1. `entryOption`：在 Webpack 处理入口选项之前触发。
   2. `afterPlugins`：在所有插件被初始化之后触发。
   3. `afterResolvers`：在所有解析器被初始化之后触发。
2. 编译阶段：
   1. `compile`：在 Webpack 开始编译时触发。
   2. `compilation`：在创建新的编译实例对象时触发。
   3. `make`：在 Webpack 开始构建模块依赖图时触发。
   4. `buildModule`：在构建模块时触发。
   5. `normalModuleLoader`：在加载普通模块时触发。
   6. `contextModuleLoader`：在加载上下文模块时触发。
   7. `program`：在 Webpack 生成 AST 之后触发。
   8. `seal`：在 Webpack 完成模块构建并准备生成输出时触发。
3. 优化阶段：
   1. `optimize`：在 Webpack 进行优化之前触发。
   2. `optimizeModules`：在优化模块时触发。
   3. `optimizeChunks`：在优化代码块时触发。
   4. `optimizeTree`：在优化模块依赖树时触发。
   5. `afterOptimizeModules`：在模块优化完成后触发。
   6. `afterOptimizeChunks`：在代码块优化完成后触发。
   7. `afterOptimizeTree`：在模块依赖树优化完成后触发。
4. 生成阶段：
   1. `emit`：在 Webpack 生成输出文件之前触发。
   2. `assetEmitted`：在每个输出文件被生成时触发。
   3. `afterEmit`：在 Webpack 生成输出文件之后触发。
5. 完成阶段：
   1. `done`：在 Webpack 完成编译过程时触发。
   2. `failed`：在 Webpack 编译过程中发生错误时触发。
   3. `invalid`：在 Webpack 检测到文件变化并需要重新编译时触发。
   4. `watchRun`：在 Webpack 进入监听模式并开始观察文件变化时触发。

## 插件

#### tapable

#### 常用插件

## loader

loader的顺序是从右往左的

### 常用loader

#### babel-loader

##### 原理

AST

##### 基础库

###### **@babel/cli**

babel的命令行工具，适合单独使用babel，webpack中集成babel使用@babel/core即可。

###### **@babel/core**

babel核心库，提供了babel的编译引擎，执行实际的代码编译工作，但不包含编译规则。

##### preset

preset预设的顺序也是从右往左的。

###### **@babel/preset-env**

根据目标环境自动确定需要的 Babel 插件和 polyfill，从而将现代 JavaScript 代码转换为兼容目标环境的代码。

```JSON
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "not dead"], // 目标浏览器
          "node": "current" // 目标 Node.js 版本
        },
        /** entry-在入口文件顶部根据目标环境所有引入polyfill，usage-按需引入polyfill */
        "useBuiltIns": "usage", // preset的polyfill是全局引入的，会污染全局环境，适合应用开发不适合组件库等
        "corejs": 3 // 指定 core-js 版本，需要安装core-js3
      }
    ]
  ]
}
```

###### **@babel/preset-react**

编译react的babel预设，react17之后还支持运行时导入jsx编译。

###### **@babel/preset-typescript**

不进行类型检查，移除typescript类型注解转为javascript。

##### plugins

同样是从右往左执行。

###### **@babel/plugin-transform-runtime**

1. **复用辅助函数** ：将 Babel 转换代码时生成的辅助函数（如 `_classCallCheck`、`_defineProperty` 等）提取到 `@babel/runtime` 中，避免重复生成。
2. **按需引入 polyfill** ：通过 `core-js` 提供 polyfill，并按需引入，避免全局污染。

```JSON
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3 // 需要安装 @babel/runtime-corejs3 或 @babel/runtime和core-js3
      }
    ]
  ]
}
```

作用

插件仅包含了对js源码的替换操作，具体的辅助函数在**`@babel/runtime`**库，polyfill在 **`core-js@版本号`** ，可以使用** `@babel/rumtime-corejs3`**同时包含二者。

**与preset对比**

preset的是全局的polyfill引入处理，plugin-transform-runtime是模块化按需导入的，更适合组件工具库的开发。

#### ts-loader

调用tsc编译器进行完整的类型检查，所以依赖**`typescript`**包，编译速度也较慢。

## resolve

## sourcemap

通过webpack.devtool配置

```JavaScript
// 以下参数可以通过中划线组合
// 想要更直观更定制化的配置，可以使用webpack.SourceMapDevToolPlugin
module.exports = {
    devtool: 'eval', // 在eval内设置sourceURL，将模块代码拆分生成可调试的js文件，webpack就是利用这一特性简化了sourcemap的处理
    devtool: 'source-map', // 生成.map文件，映射源码
    devtool: 'eval-source-map', // 将eval拆分的可调试js文件进一步映射成源码
    devtool: 'inline-source-map', // 将生成的map映射代码转成dataURL内联进代码中
    devtool: 'hidden-source-map', // 仅生成.map文件，但不在代码中关联使用
    devtool: 'cheap-source-map', // 只生成映射行信息的map文件，缺少列信息，生成更快
    devtool: 'module', // 默认sourceMap只映射到最后一次处理的源码，如果经历了多次loader plugin处理，想映射到最初的源码，就需要设置为module
    devtool: 'nosources' 
    // 默认.map文件中会包含源码，以sourceContent字段贴在.map代码中
    // 这样在找不到源码文件的时候也可以映射源码，但是这会增加sourcemap体积
    // 设置为nosources，.map中就不再包含content，只提供映射关系，这样可以保护源码
    // 可以在调试时，根据.map文件中source字段的路径，自己导入源码文件到目标路径，从而实现源码调试
}
```

## Hash

### **Hash生成原理**

基于文件内容，包括源代码、依赖模块等信息，使用哈希算法（如MD4）计算出唯一哈希值加入到文件名中。

### **Hash作用**

* **缓存优化** ：通过文件名中的 Hash 码，确保文件内容变化时文件名也会变化，避免浏览器缓存旧文件。
* **版本控制** ：Hash 码可以用于标识文件版本，便于调试和追踪问题。

### Hash类型

| Hash 类型     | 作用范围     | 特点                                       | 适用场景                   |
| ------------- | ------------ | ------------------------------------------ | -------------------------- |
| [hash]        | 整个项目     | 项目内容变化时，所有文件的 Hash 都会变化。 | 全局缓存刷新               |
| [chunkhash]   | 单个 Chunk   | 只有当前 Chunk 内容变化时，Hash 才会变化。 | 代码分割（Code Splitting） |
| [contenthash] | 单个文件内容 | 只有当前文件内容变化时，Hash 才会变化。    | CSS 文件、静态资源         |

## HMR

### 原理

和vite的区别

### devServer

#### 配置

**`historyApiFallback`**

解决SPA刷新页面404问题，服务端将未匹配到的请求重定向到指定页面，默认主页html

```JavaScript
module.exports = {
  //...其他配置
  devServer: {
    historyApiFallback: true,
    // 或者可以指定更详细的重定向规则
    historyApiFallback: {
      rewrites: [
        { from: /^\/some-path/, to: '/index.html' },
      ],
    },
  },
};
```

对应nginx的配置方法

```JSON
location / {
    try_files $uri /index.html;
}
```

## 优化

### 构建提速

#### 持久化缓存

Webpack 4 自身并不直接提供内置的持久化缓存功能，但可以通过配置 `cache` 选项或者借助第三方插件实现

* 内置缓存配置：可以设置 `cache.type` 为 `'memory'` 或 `'filesystem'` 来控制是否启用内存缓存或文件系统缓存。对于持久化缓存来说，我们应该选择 `'filesystem'`。

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

* hard-source-wepack-plugin：它可以创建更复杂的缓存逻辑，包括跨不同构建之间共享缓存。

```JavaScript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin(),
  ],
};
```

#### DllPlugin三方库处理

 **webpack.DllPlugin** ：将三方库打包成dll

```JavaScript
// webpack.dll.config.js
module.exports = {
    entry: {
        "vendors-react": ['react', 'react-dom', 'react-router-dom'],
        "vendors-redux": ['redux', 'redux-thunk', 'redux-saga']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].dll.js',
        library: '[name]_library' // 设置dll全局变量
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_library',
            path: path.resolve(__dirname, 'dist', '[name]-manifest.json')
        })
    ]
}
```

 **DllReferencePlugin** ：通过webpack.DllReferencePlugin引用dll，避免重复打包

```TypeScript
// webpack.config.js
module.exports = {
    // ...其他配置
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: [
                './dist/vendors-react-manifest.json', 
                './dist/vendors-redux-manifest.json'
            ]
        })
    ]
}
```

#### 多线程压缩

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

#### thread-loader多线程

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

#### cache-loader缓存

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

### 体积缩小

#### Tree Shaking 消除未使用的代码

#### 异步加载

##### splitChunks

代码分割的优化效果：提取公共代码减少重复，拆分不同功能的代码按需加载，优化缓存只更新部分包不需要全局更新，提升性能懒加载减少冗余加载等

```TypeScript
module.exports = {
    optimization: {
        splitChunks: {
            chunk: 'all', // initial 同步；async 异步；function(chunk) 自定义逻辑
            minSize: 30000, // 最小块30K
            maxSize: 100000,
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10 // 数值越大优先级越高
                },
                commons: {
                    name: 'commons',
                    minChunks: 2, // 至少引用2次才提取
                    priority: -20, 
                    reuseExistingChunk: true // 复用已存在的chunk
                }
            }
        }
    }
}
```

##### import()

##### weboackJsonp

##### SourceMap

设置为nosource，不将源码贴在sourceContent字段

## 其他配置

### npm打包

externals：不需要打包而是cdn引入的库

resolve：通过module字段指定node_modules路径加快解析

splitChunk：配置cacheGroups拆分npm模块生成单独chunk文件

```JavaScript
const path = require('path');

module.exports = {
  entry: './src/index.js', // 入口文件
  output: {
    filename: '[name].bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出目录
    clean: true, // 清理旧文件
  },
  resolve: {
    modules: [
        path.resolve(__dirname, 'src/modules'), // 先查找自定义路径
        /node_modules/ // 自定义路径没有再查找node_modules
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 分割所有代码
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中的依赖
          name: 'vendor', // 生成的 chunk 名称
          priority: 10, // 优先级
        },
      },
    },
    minimize: true, // 启用代码压缩
    usedExports: true, // 启用 Tree Shaking
    concatenateModules: true, // 启用作用域提升
  },
  externals: {
    react: 'React', // 从 CDN 加载 React
    'react-dom': 'ReactDOM', // 从 CDN 加载 ReactDOM
  },
};
```

## 经验

### 源码阅读记录

#### 查找脚手架脚本

1. **从webpack打包指令找起**

从你项目的package.json中的scripts看出，webpack的打包指令只需要一句 `webpack --config ***`

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmJiYWZlMjU4MDFiZDI4OThlYWQ3MDBiMGEwMDMxYmFfZlREVDk1cUdRVjN0TE5DWXNaM3Z1dlRFbHJXVWt4ZWJfVG9rZW46UXhHVWJkbXhyb3pHREJ4SXdqOGMwOWhvbnJkXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

2. **找到项目中的webpack包**

于是在node_modules目录下找到名为webpack的包，打开package.json

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGExZWFlMzMyODNlYjlkMWExMjJjMmRmNzNmODM2YzJfRnU3UnJUT2JiTE9ndlpjTkxSOTNUWmNzRjNxTDk3OVZfVG9rZW46VVZ4T2JlUFdmb2FDbHJ4dldzcWNkN3hHbnFjXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

3. **package.json中的bin属性**

bin属性即是脚手架指令的设置，其中webpack指向的路径就是 `webpack --config ***`命令行指向的执行脚本。

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDU1NjVkYjM4OTBjNjU1NTJiMmU2ODUyOWIyODQ1ZDRfQkx0aGtmU1BBdnVkUEJ5TmtzNTNaeGpTWnlmdnc0dXVfVG9rZW46UE5CeWJla2NWb2hwWXV4M1o4WWNYbGxHbjRiXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

这其实就是脚手架命令行的实现方式，如果你想自定义自己的脚手架指令，例如实现 `my-webpack --config ***`，只需要在bin属性下增加 `my-webpack`属性，并指定你自己的脚本路径即可。

4. **找到脚本位置**

这个脚本就在webpack仓库中的 `bin/webpack.js`

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NzM2ZDEzNDUyMmM1ZDZlZjBkOWExNTJkZDNiNzQ4MWNfem1EcWlsVmtjeFJwNGxmNWFOSEM3OVpMTlRQR200U0xfVG9rZW46QWIxOGI2TUdxb2ltWmV4ZXcxQmNKMFJXbnppXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

#### 阅读webpack命令行打包脚本

1. **阅读webpack/bin/webpack.js**

先忽视前面一堆变量函数的定义，直接看末尾脚本的执行

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTBiYzViYzk5Mjc2ZWU0OGNmYjk2MWRiNjQwNjM0MjZfckdjTFZqSDN3SUdGMEFFc25HVFJDaDNFUzJYTThiNUJfVG9rZW46WHZVNmJCdkZZbzBGNm94Y0g5OWNnUXJxblpmXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

2. **判断是否安装了****`webpack-cli`**

脚本判断了cli.installed属性，该值由函数isInstalled返回值决定，通过看代码逻辑可知，就是判断 `webpack-cli`包是否安装

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGZiNTBkNDViNzFmOTk5OTE1YTU4OTNmZGU2OWRhNGJfcVdPdk1uUGNjbVpEQ1hwWnBLYXVJb0xVblRsd01UdnlfVG9rZW46QjhhamJSbnhlb1kyaGx4cFNycGNFNnowbk1lXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

3. **安装****`webpack-cli`**

可见webpack打包的执行必须还要安装webpack-cli，如果没有安装的情况下执行了打包指令，脚本会提醒你缺少这个第三方包，并且通过问询的形式帮你自动安装：

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MDQwMmRlNzFkOGQ4OGExOGU3ZWMxNTU4YWI1YzVhMWVfT3FZZURlRWNJbFhqZDFDanV2R2JCd1kxS2ltdWdVemJfVG9rZW46RkpHQmJEM3NQb1lEMGt4ZlZ4VWNxZFFwbjlmXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

4. **执行****`runCli`**

在确定安装了webpack-cli之后，脚本将执行runCli函数，函数结尾require导入了webpack-cli的bin指令脚本，至此webpack打包的入口脚本执行结束，接下来前往webpack-cli包

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=YzIxOTNkNjE1N2Y0ODU3Yzg5ZDNiZGU5NmNlZTc1OTVfT2JZbWRhS1JuNXRUYWxIdk1iQ0RESmlGbGVWZURLV2ZfVG9rZW46TnZaTmJ1dlF1b3BmN2R4VzVTU2NkRHVWblhmXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

#### 阅读webpack-cli命令行脚本

1. **查看webpack-cli包的** **`webpack-cli ***`** **指令**

根据上面的流程，我们来到了webpack-cli的package.json文件，知道了bin下的webapck-cli指令配置的脚本路径

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MTBmZWNkY2NiMmYzZThiZmYwYjkxOGViYjhkNjVjZjFfZ2xNM1daZkxBa1RZRG5oSEZGdXpWTUx5WmFYam5MZkVfVG9rZW46V2FsRWI0dHo3b1ZpZWJ4T083NmNCNFVNbmlnXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MTUyNjk1NjI5ZTZjNTEzNmZiNWEzNWE0OGFhNGYyYmFfTE1SckVobUtybUNiZVpVWEZFTEE4VFdxc0hSNFFVUFVfVG9rZW46UlJzaWIybEpXb01wMER4TVAzMmNLNVhMbm5nXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

2. **阅读webpack-cli/bin/cli.js**

内容很少，主要是另一个脚本的导入使用，前往目标脚本查看**runCLI**的实现

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=OGFjZTBjM2IxYjNjZGUzNDIxZTBiMzEyOTZlYTg4NmVfc0FqZldaNGdINUswRTdWaWNOTU5Hd3JZcUFXeGFJRlFfVG9rZW46VmdxemJKUFFDbzZ2S2t4czcwaGNMZmlYbmVjXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

3. **阅读webpack-cli/lib/bootstrap.js**

内容也是很少，前往目标脚本查看**webpackCLI**的实现

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NmM5YTg3MTEyOTE3ZWI1OThmYmEwYjA1YmU0NjFkNTFfaGRvdUFGaUk1SVdnY2RRdUlJRG41SDNWdkZjQWM1ZW9fVG9rZW46SGo2NGJvSEtLb3JRa1d4Zll6WmNrTDE3bkhlXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

4. **阅读webpack-cli/lib/webpack-cli.js**

调用class WebpackCLI的**run**函数，**loadWebpack**相当于 `this.webpack = require('webpack')`这里就不贴源码了

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2I3MDkwNGQxMTdmNWE0NGJjNTVmZGU3NTk1OWI2YjhfcTZpd094Q1gzQkluZEIyUGoyUjlUaW5LSEFvTzlPcTBfVG9rZW46U0lpQ2JSVXRRb0lpR3Z4NVlHZWN4bVliblFjXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

require('webpack')执行的是webpack包中package.json的**main**属性指向的脚本路径

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=YzVhMTZlNjQ2YTkwMmRmMzdlZTRhNjdjMzMzZmUwZTFfSlNVVGUxdFpyWkhhdWpQbVIwS28xOERjSnV5RXNNa3hfVG9rZW46WDVuZWIxY3dTb1poQzR4a290QmMyZW5sbmkwXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

**runWebpack**函数创建了compiler，本次打包的管理对象

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=YmJhN2E3ZDdkNjU1NzI0MDQ0YzQ0NTBkOGFiYjY0NGZfM2xHT25SR2ZicGdFQWxPbFpMRUo5aVNURHl0bzNhZHlfVG9rZW46SmlOcGI4SldWbzBGYzZ4blRnamNpUzgybm1kXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

**createCompiler**其实就是携带options参数调用webpack，拿到的返回值就是compiler对象

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ODlkMTRlYzQ5NWIyNDAzZjNiYzc2ODNhMmNkNzRmMjdfSUFXNml0UjVnRWNxT2VaS3NjdXdMSkI5a09wOEt0bFRfVG9rZW46SHZtUGJxMjlqb0J6aFV4OE94OGNyZjNHbjNjXzE3Mzc2MTIyMzQ6MTczNzYxNTgzNF9WNA)

### 插件开发

#### Html-url-replace

对打包产物中用到的url进行域名替换，解决OSS服务迁移，项目服务器迁移的问题

#### Qiniu-cdn-uploader

将打包产物自动上传cdn，对html中的路径引入问题进行修改

#### Sentry-sourcemap-deleter

生产环境打包生成sourcemap上传sentry，上传后自动删除项目内sourcemap

```JavaScript
const path = require('path')
const fs = require('fs')

class DeleteSourceMapPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('DeleteSourceMapPlugin', (compilation) => {
      const JSPath = './dist'
      const nods = (dir) => {
        const readDir = fs.readdirSync(dir)
        readDir.forEach((filename) => {
          const src = path.join(dir, filename)
          const st = fs.statSync(src)
          if (st.isFile()) {
            // 文件处理
            if (/\.map$/.test(filename)) {
              fs.unlinkSync(src)
              console.log('成功删除：' + src)
            }
          } else {
            // 文件夹处理
            nods(src)
          }
        })
      }
      nods(JSPath)
    })
  }
}

module.exports = DeleteSourceMapPlugin
```

#### Mobile-web-adaptor

在打包生成的html模板嵌入移动端适配脚本

### 脚手架搭建

#### [gulp+webpack构建项目实践](https://dfrtcthz8n.feishu.cn/docx/WPmydFIJBoBJf1xrJYecaoo2n4e)

#### 从0搭建现代化Multi-Page

# Webpack揭秘之常用配置

## sourcemap

sourcemap配置会让webpack在打包源代码的同时，生成映射源码的.map文件，文件中包含了对源码的文件路径，定位代码的具体行数列数的数据信息，便于调试打包压缩后的混淆代码。

从webpack打包原理可知，模块的加载方式就是使用能动态执行脚本的eval函数，将模块代码放到eval函数中，通过调用eval来动态的加载模块。而浏览器正好支持一种在eval内设置sourceURL自动拆分出可调试js文件的设计，webpack正是利用这一特性，简化了sourcemap的处理。

以下就是通过webpack.devtool配置各种不同类型的sourcemap的方法

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

- **缓存优化**：通过文件名中的 Hash 码，确保文件内容变化时文件名也会变化，避免浏览器缓存旧文件。
- **版本控制**：Hash 码可以用于标识文件版本，便于调试和追踪问题。

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

## resolve
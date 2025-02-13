## Webpack揭秘之loader

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

1. **复用辅助函数**：将 Babel 转换代码时生成的辅助函数（如 `_classCallCheck`、`_defineProperty` 等）提取到 `@babel/runtime` 中，避免重复生成。
2. **按需引入 polyfill**：通过 `core-js` 提供 polyfill，并按需引入，避免全局污染。

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

插件仅包含了对js源码的替换操作，具体的辅助函数在**`@babel/runtime`**库，polyfill在**`core-js@版本号`**，可以使用**`@babel/rumtime-corejs3`**同时包含二者。

**与preset对比**

preset的是全局的polyfill引入处理，plugin-transform-runtime是模块化按需导入的，更适合组件工具库的开发。

#### ts-loader

调用tsc编译器进行完整的类型检查，所以依赖**`typescript`**包，编译速度也较慢。
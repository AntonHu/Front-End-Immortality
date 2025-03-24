# Webpack揭秘

## 打包流程

1. 初始化，合并命令行参数，配置文件参数，得到最终的打包配置，创建compiler打包管理对象
2. 解析入口，递归解析模块依赖关系，构建依赖图（make）
3. 加载模块，根据依赖图，加载各个模块并根据类型进行处理
4. 模块转译：通过loader进行各个类型模块的转译处理
5. 产生bundle：将加载好的模块合并成bundle文件
6. bundle优化：（optimize）一系列优化输出产物的处理，tree shaking，terser压缩等
7. 输出文件：（emit）将打包产物输出（assetEmmitted）到指定的路径（afterEmit）

## 手写源码

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

## 生命周期

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

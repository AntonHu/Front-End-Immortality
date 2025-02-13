# JSX

jsx是一种js语法糖，他的设计能让你以类似html的风格，将html代码书写在js文件中，便于在开发过程中与js进行数据的绑定和交互，他最终会被编译为js函数，通过调用函数得到虚拟DOM的数据对象。

## babel编译

React17之前，需要显示导入React

```JavaScript
import React from 'react' // 显示导入
<div key="propKey">Hello World</div>
/** babel编译结果 */
React.createElement('div', { key: 'propKey' }, "Hello", "World")
```

React17+，可以不显示导入React，但是需要配置tsconfig或babel的react预设

```JavaScript
/** React17之后，不导入React */
<div key="propKey">Hello World</div>
/** babel编译结果 */
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime' // babel自动导入
_jsx('div', { key: 'keyProp', children: "Hello"})
_jsxs('div', { key: 'keyProp', children: ["Hello", "World"]})
```

babel和tsconfig配置二选一

```JavaScript
/** babel和tsconfig配置二选一 */
/** babel配置 */
{
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader', 
        options: { 
            presets: [
                ['@babel/preset-react', { runtime: 'automatic' }]
            ]
        }
    }, 'ts-loader']
}
/** tsconfig配置 */
{
    ...,
    "jsx": "react-jsx" // 原配置"react"
}
```

## type转换关系

| jsx元素类型       | react.createElement 转换后                       | type 属性                 |
| ----------------- | ------------------------------------------------ | ------------------------- |
| element元素类型   | react element类型                                | 标签字符串，例如 div      |
| fragment类型      | react element类型                                | symbol react.fragment类型 |
| 文本类型          | 直接字符串                                       | 无                        |
| 数组类型          | 返回数组结构，里面元素被 react.createElement转换 | 无                        |
| 组件类型          | react element类型                                | 组件类或者组件函数本身    |
| 三元运算 / 表达式 | 先执行三元运算，然后按照上述规则处理             | 看三元运算返回结果        |
| 函数执行          | 先执行函数，然后按照上述规则处理                 | 看函数执行返回结果        |

## 常用API

 **React.Children.toArray** (children)

将Children类数组转为常规数组类型，同时拍平数组包括深层次数组。

 **React.Children.forEach** (children, (item, index) => {})

遍历Children类数组，且会先经过React.Children.toArray同样的处理。

 **React.Children.map** () 同上，但是会返回一个新的Children

 **React.isValidElement** (element) 判断是否是ReactElement

 **React.cloneElement** (element, [newProps], [...newChildren])

拷贝返回一个新的元素，

props：newProps会覆盖与element.props中key相同的属性，element.props中没有的则会追加，newProps中没有的key则保留element.props的。

newChildren：newChildren会完全覆盖element.children
# Taro架构解析

## 2.0

架构特点：重编译时，babel编译与AST修改使得不利于sourcemap工程化和插件，编译后代码与React无关

![img](https://cdn.jsdelivr.net/gh/antonhu/picx-images-hosting/picGo/asynccode)

### 编译时

### 运行时

## 3.0

架构特点：重运行时

### 编译时

#### Web Component组件库

### 运行时

#### 路由

v3.6+在运行时新增location/history对象的实现

### 渲染

#### CSS-In-JS

采用linaria，近似styled-components的API，零运行时

#### 渲染HTML字符串

小程序渲染HTML通常会使用wxparse，但这个库不再维护，且API复杂不易拓展，内部实现不准确，Taro3实现的HTML字符串渲染则有以下特性：

- API与Web一致，可使用React的dangerouslySetInnerHTML或Vue的v-html调用
- 可通过CSS控制标签样式
- 给已渲染的HTML绑定事件
- 在HTML的解析和渲染阶段提供钩子定制渲染

#### 预渲染

### 工程化

#### 插件系统

基于Tapable设计的插件系统，参考了React Reconciler设计了一套修改运行时的API

#### 构建速度优化

#### Sourcemap

#### 小程序转React

### 拓展

#### Taro鸿蒙

#### TaroRN

## 4.0
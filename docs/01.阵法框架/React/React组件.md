# React组件

在React中，主要分为类组件和函数组件，下面将通过源码来介绍这两种组件在React中是如何创建的。

## 类组件构造

### 构造函数定义

```JavaScript
/** react/src/ReactBaseClasses.js **/
/** 
 * @note 类组件构造函数定义
 * 当继承React.Component的组件在构造函数中执行super(props)时，调用的就是Component 
 */
function Component(props, context, updater) {
    this.props = props
    this.context = context
    this.refs = emptyObject
    this.updater = updater || ReactNoopUpdateQueue
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null)
    throw new Error('takes an object of state variables to update or a ' + 'function which returns an object of state variables.',);
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

### 组件渲染

```js
/** react-reconciler/src/ReactFiberClassComponent.js */
/** @note 类组件渲染 FiberTag = 1 */
function constructClassInstance(
  workInProgress: Fiber, // 当前工作中的Fiber
  ctor: any, // 类组件构造函数
  props: any, // 组件 props
): any {
    /** @note 实例化组件，得到组件实例instance */
    let instance = newctor(props, context);
 }
```

## 函数组件构造

```JavaScript
/** react-reconciler/src/ReactFiberHooks.js */
/** @note 函数组件渲染 FiberTag = 0 */
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null, // 当前函数组件对应的Fiber，初始化
  workInProgress: Fiber, // 当前工作中的Fiber
  Component: (p: Props, arg: SecondArg) => any, // 函数组件
  props: Props, // 函数组件的第一个参数props
  secondArg: SecondArg, // 函数组件的其他参数，例如forwardRef中的ref，memo中的compare
  nextRenderLanes: Lanes, // 下次渲染优先级（旧版是nextRenderExpirationTime）
): any {
    /**
   * @note 调用函数组件，得到React.element对象
   */
  let children = __DEV__
    ? callComponentInDEV(Component, props, secondArg)
    : Component(props, secondArg);
 }
```

## 
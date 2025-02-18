# React组件

> 本章节涉及的React源码均为版本19.0.0

在React中，本章节将通过源码来介绍类组件与函数组件在React中是如何定义与创建的。

## 类组件构造

类组件的构造有两部分，首先是Class的定义，然后是获取new实例

### 构造函数定义

在文件 `react/src/ReactBaseClasses.js` 中的 `Component` 函数，是在定义一个类组件时的具体实现，这是一个用function模拟实现的Class的实现案例

```JavaScript
/** react/src/ReactBaseClasses.js **/
/** 
 * @note 类组件构造函数定义
 * 当继承React.Component的组件在构造函数中执行super(props)时，调用的就是Component 
 */
function Component(props, context, updater) {
    this.props = props // 绑定props，这也是为什么super要传props
    this.context = context
    this.refs = emptyObject // {}
    this.updater = updater || ReactNoopUpdateQueue
}
Component.prototype.isReactComponent = {}; // 无状态组件则是
Component.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null)
    throw new Error('takes an object of state variables to update or a ' + 'function which returns an object of state variables.',);
  // 这里能看出，setState本质上是调用updater的enqueueSetState方法实现的
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

### 创建组件实例

`react-reconciler/src/ReactFiberClassComponent.js` 文件中的函数 `constructClassInstance` 则是组件实际使用时，创建组件实例的具体实现

```js
/** react-reconciler/src/ReactFiberClassComponent.js */
/** @note 类组件渲染 FiberTag = 1 */
function constructClassInstance(
  workInProgress: Fiber, // 当前工作中的Fiber
  ctor: any, // 类组件构造函数
  props: any, // 组件 props
): any {
  let isLegacyContextConsumer = false;
  let unmaskedContext = emptyContextObject;
  let context = emptyContextObject;
  const contextType = ctor.contextType;

  // context获取
  if (typeof contextType === 'object' && contextType !== null) {
    context = readContext((contextType: any));
  } else if (!disableLegacyContext) {
    unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    const contextTypes = ctor.contextTypes;
    isLegacyContextConsumer =
      contextTypes !== null && contextTypes !== undefined;
    context = isLegacyContextConsumer
      ? getMaskedContext(workInProgress, unmaskedContext)
      : emptyContextObject;
  }

  // 类组件实例创建，得到组件实例instance
  let instance = new ctor(props, context);
  // 初始化state，updater
  const state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined
      ? instance.state
      : null);
  instance.updater = classComponentUpdater;
  // 设置组件实例与Fiber之间的关系，才能调度更新
  workInProgress.stateNode = instance;
  setInstance(instance, workInProgress);
  // 缓存context
  if (isLegacyContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context);
  }

  return instance;
}
```

## 函数组件构造

函数组件则没有像类组件那样要先定义Class，再new一个实例，只需要调用 `renderWithHooks` 方法

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

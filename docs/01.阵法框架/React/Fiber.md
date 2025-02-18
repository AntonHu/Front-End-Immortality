# Fiber

> 本章节涉及的React源码均为版本19.0.0

## 什么是Fiber

Fiber是React16之后设计的，一种表示**vDom节点运行时**的对象。

通过模拟链表的数据结构，在Fiber对象中设计了**child/sibling/return**的**指针域**属性，并存储vDom在调和过程中的工作状态作为**数据域**，从而形成vDom节点之间依赖关系的链表。

他采用**双缓存**的机制，基于**优先级策略**和**帧间回调**的循环任务**调度算法**，对React的更新渲染过程进行了优化。

## Fiber的作用

React16之前更新虚拟Dom的调和过程是**递归**完成的，它是一个**不可中断**的**调用栈越来越深**的遍历过程，当有繁重的更新任务时，处理时间过长就会导致浏览器主线程长时间被JS占用，渲染进程被阻塞，页面出现卡顿无法响应。而Fiber架构的设计，将长任务拆分成更小的执行单元，通过时间分片的调度形式取代了之前的递归调和，有效减少了页面阻塞，同时采用的双缓存和优先级策略，提升了vDom遍历的效率，以及重要任务的插队执行，让浏览器交互的响应更为及时，较大优化了性能。

## Fiber的数据结构

```TypeScript
// react-reconciler\src\ReactFiber.js
/** @note Fiber节点创建 */
function FiberNode(
  this: $FlowFixMe,
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance对应的节点实例信息
  this.tag = tag; // Fiber的类型标记
  this.key = key; // Fiber唯一标识符
  this.elementType = null; // ？？？
  this.type = null; // 组件对应的函数或类，或Dom节点的类型
  this.stateNode = null; // Fiber对应的实例，如类组件的实例，Dom节点的实例
  // Fiber节点关系信息
  this.return = null; // 父Fiber
  this.child = null; // 第一个子Fiber
  this.sibling = null; // 下一个兄弟Fiber
  this.index = 0; // Fiber在父Fiber中的索引
  // ref
  this.ref = null;
  this.refCleanup = null; // 用于清理ref
  // 更新状态相关
  this.pendingProps = pendingProps; // 当前Fiber的props
  this.memoizedProps = null; // 上一次渲染的props
  this.updateQueue = null; // 更新队列
  this.memoizedState = null; // 上一次渲染的state，函数组件则是Hooks信息，DOM则是null
  this.dependencies = null; // context或时间依赖项
  // 模式设置
  this.mode = mode; // Fiber的模式，比如ConcurrentMode、StrictMode等
  // Effects
  this.flags = NoFlags; // Fiber的更新标记，如Placement、Update、Deletion等
  this.subtreeFlags = NoFlags; // 子树的更新标记
  this.deletions = null; // 待删除的子Fiber
  // lane优先级模型
  this.lanes = NoLanes; // Fiber的优先级，17之前是expirationTime
  this.childLanes = NoLanes; // 子树的优先级
  // 双缓存的关键，current Fiber和workInProgress Fiber的关联
  this.alternate = null; // 用于双缓存机制，指向上一次渲染的Fiber
}
```

### Fiber Tag

```JavaScript
export const FunctionComponent = 0;       // 函数组件
export const ClassComponent = 1;          // 类组件
export const IndeterminateComponent = 2;  // 初始化的时候不知道是函数组件还是类组件 
export const HostRoot = 3;                // Root Fiber 可以理解为根元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4;              // 对应  ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

## Fiber的核心原理

### 调和Diff方案-双缓存机制

双缓存机制

Fiber.alternate 指向另一个Fiber链表中对应的Fiber节点（双缓存的关键）

`WorkInprogress` 当前更新过程中构建在内存中的vDom对应的Fiber。更新完成后会将其变为current

`Current` 当前渲染显示在视图层的vDom对应的Fiber。

### 优先级策略-lane模型

lane模型

### 时间分片方案-调度算法

帧间回调的循环事件调度算法：requestIdleCallback（polyfill）
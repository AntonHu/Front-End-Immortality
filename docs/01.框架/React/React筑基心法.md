# React筑基心法

## JSX

### babel编译

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

### type转换关系

| jsx元素类型       | react.createElement 转换后                       | type 属性                 |
| ----------------- | ------------------------------------------------ | ------------------------- |
| element元素类型   | react element类型                                | 标签字符串，例如 div      |
| fragment类型      | react element类型                                | symbol react.fragment类型 |
| 文本类型          | 直接字符串                                       | 无                        |
| 数组类型          | 返回数组结构，里面元素被 react.createElement转换 | 无                        |
| 组件类型          | react element类型                                | 组件类或者组件函数本身    |
| 三元运算 / 表达式 | 先执行三元运算，然后按照上述规则处理             | 看三元运算返回结果        |
| 函数执行          | 先执行函数，然后按照上述规则处理                 | 看函数执行返回结果        |

### 常用API

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

## React组件

### 类组件构造

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

```JavaScript
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

### 函数组件构造

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

## State

### legacy模式

#### setState

```JavaScript
this.setState(
    (prevState, currentProps) => {}, 
    () => {this.state /* 更新后的state */}
)
```

1. 产生本次更新优先级lane（旧版是expirationTime）
2. 从fiber root向下调和子节点，比对发生更新的地方，更新比对lane，找到发生更新的组件
3. 合并state，执行render函数得到新的UI视图层
4. commit替换真实DOM，完成更新
5. 调用callback回调函数，结束setState

##### enqueueSetState

setState实际调用的就是**updater.enqueueSetState**

```JavaScript
/** react-reconciler/src/ReactFiberClassComponent.js */
const classComponentUpdater = {
  isMounted,
  /** @note setState实际调用的是updater.enqueueSetState */
  enqueueSetState(inst: any, payload: any, callback) {
    const fiber = getInstance(inst);
    const lane = requestUpdateLane(fiber); // 1.产生本次更新优先级（旧版是expirationTime）

    const update = createUpdate(lane); // 创建update
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback);
      }
      update.callback = callback; // 设置更新回调函数
    }

    const root = enqueueUpdate(fiber, update, lane); // 将update加入Fiber
    if (root !== null) {
      startUpdateTimerByLane(lane); // 开始更新计时
      scheduleUpdateOnFiber(root, fiber, lane); // 2.调度更新
      entangleTransitions(root, fiber, lane); 
    }
    // ...
  }
  // ...
}
```

##### 批量更新

因为setState一般都是在用户交互时发生，所以setState的批量更新也是在React事件系统中统一调度的

```JavaScript
/** react-dom-bindings/src/events/DOMPluginSystem.js */
/** @note 事件都将经过此函数同一处理 */
export function dispatchEventForPluginEventSystem(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  nativeEvent: AnyNativeEvent,
  targetInst: null | Fiber,
  targetContainer: EventTarget,
) {
    // ... 
    /** @note 调用批量更新 */
    batchedUpdates(() =>
        dispatchEventsForPlugins(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          ancestorInst,
          targetContainer,
        ),
    );  
}
```

```JavaScript
/** react-reconciler/src/events/ReactDOMUpdateBatching.js */
/** @note 事件批量更新 */
export function batchedUpdates(fn, a, b) {
  if (isInsideEventHandler) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(a, b);
  }
  isInsideEventHandler = true; // 事件处理程序中，开启批量更新 旧版是isBatchingEventUpdates
  try {
    return batchedUpdatesImpl(fn, a, b); // 批量更新处理函数 ReactFiberWorkLoop.js -> batchedUpdates
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
}
```

##### 优先级

flushSync setState > 常规setState > setTimeout setState > Promise setState

###### 常规setState

开启批量更新 -> setState加入队列 -> 合并state -> 更新state -> render -> callback -> 关闭批量更新

```JavaScript
class Index extends React.Component {
    state = initalState
    onClick = () => {
        // 1. 开启批量更新isInsideEvenetHandler=true，旧版是isBatchingEventUpdates
        this.setState( // 2. 加入批量更新队列
            newState1, 
            () => console.log(this.state) // 11. callback打印newState3
        )
        console.log(this.state) // 3. 打印initalState；
        this.setState( // 4. 加入批量更新队列
            newState2, 
            () => console.log(this.state) // 12. callback打印newState3
        )
        console.log(this.state) // 5. 打印initalState；
        this.setState( // 6. 加入批量更新队列
            newState3, 
            () => console.log(this.state) // 13. callback打印newState3
        )
        console.log(this.state) // 7. 打印initalState；
        // 8. 合并批量更新：newState1 => newState2 => newState3
        // 9. 更新为newState3，前往render
        // 14. 关闭批量更新isInsideEvenetHandler=false
    }
  
    render() {
        // 10. render，打印newState3
        console.log(this.state)
        return <div onClick={this.onClick} />
    }
}
```

###### setTimeout setState

打破批量更新，多次setState多次render：

开启批量更新 -> setTimeout -> 关闭批量更新 -> 按加入队列的顺序执行setState -> 更新state -> render -> calllback -> 下一个加入队列的setState -> 循环到所有队列中setState结束

```JavaScript
class Index extends React.Component {
    state = initalState
    onClick = () => {
        // 1. 开启批量更新isInsideEvenetHandler=true，旧版是isBatchingEventUpdates
        setTimeout(() => { // 2. 加入事件循环队列推迟执行
            this.setState( // 4. 批量更新已关
                newState1, // 5. 更新为newState1，前往render
                () => console.log(this.state) // 7. callback打印newState1
            )
            console.log(this.state) // 8. 打印newState1
            this.setState( // 9. 批量更新已关
                newState2,  // 10. 更新为newState2，前往render
                () => console.log(this.state) // 12. callback打印newState2
            )
            console.log(this.state) // 13. 打印newState2
            this.setState( // 14. 批量更新已关
                newState3,  // 15. 更新为newState3，前往render
                () => console.log(this.state) // 17. callback打印newState3
            )
            console.log(this.state) // 18. 打印newState3
        })
        // 3. 关闭批量更新isInsideEvenetHandler=false
    }
    render() {
        // 6. render，打印newState1
        // 11. render，打印newState2
        // 16. render，打印newState3
        console.log(this.state)
        return <div onClick={this.onClick} />
    }
}
```

###### unstable_batchedUpdates

手动批量更新，强制合并setState，效果等同于常规的setState：

开启批量更新 -> setTimeout -> 关闭批量更新 -> unstable_batchedUpdates -> [常规setState](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-MZw9dvzLxo65WOxZnVScDYIZnRd)

```JavaScript
import ReactDOM from 'react-dom'
class Index extends React.Component {
    state = initalState
    onClick = () => {
        // 1. 开启批量更新isInsideEvenetHandler=true，旧版是isBatchingEventUpdates
        setTimeout(() => { // 2. 加入事件循环队列推迟执行
            ReactDOM.unstable_batchedUpdates(() => { // 4. 强制开启批量更新
                this.setState( // 5. 加入批量更新队列
                    newState1,
                    () => console.log(this.state) // 14. callback打印newState3
                )
                console.log(this.state) // 6. 打印initalState；
                this.setState( // 7. 加入批量更新队列
                    newState2, 
                    () => console.log(this.state) // 15. callback打印newState3
                )
                console.log(this.state) // 8. 打印initalState；
                this.setState( // 9. 加入批量更新队列
                    newState3, 
                    () => console.log(this.state) // 16. callback打印newState3
                )
                console.log(this.state) // 10. 打印initalState；
                // 11. 合并批量更新：newState1 => newState2 => newState3
                // 12. 更新为newState3，前往render
            })
        })
        // 3. 关闭批量更新isInsideEvenetHandler=false
    }
  
    render() {
        // 13. render，打印newState3
        console.log(this.state)
        return <div onClick={this.onClick} />
    }
}
```

###### flushSync setState

高优先级批量更新：

开启批量更新 -> 上文setState加入队列 -> flushSync优先执行setState -> 合并当前队列state -> 更新state -> render -> callback -> 下文setState加入队列 -> 合并state -> 更新state -> render -> callback -> 关闭批量更新

```JavaScript
import ReactDOM from 'react-dom'
class Index extends React.Component {
    state = initalState
    onClick = () => {
        // 1. 开启批量更新isInsideEventHandler=true，旧版是isBatchingEventUpdates
        setTimeout(() => { // 2. 加入事件循环队列推迟执行
            this.setState( // 14. 批量更新已关
                newState1, // 15. 更新为newState1，前往render
                () => console.log(this.state) // 17. callback打印newState1
            )
        })
        this.setState( // 3. 加入批量更新队列
            newState2,
            () => console.log(this.state)
        )
        ReactDOM.flushSync(() => { // 3. 高优先级执行
            this.setState( // 4. 合并批量更新队列newState2 => newState3
                newState3, // 5. 更新为newState3，前往render
                () => console.log(this.state) // 7. callback打印newState3
            )
        })
        this.setState( // 8. 加入批量更新队列
            newState4,
            () => console.log(this.state) // 13. callback打印newState4
        )
        // 9. 关闭批量更新isInsideEventHandler=false
        // 10. 合并批量更新队列，newState4
        // 11. 更新为newState4，前往render
    }
  
    render() {
        // 6. render，打印newState3
        // 12. render，打印newState4
        // 16. render，打印newState1
        console.log(this.state)
        return <div onClick={this.onClick} />
    }
}
```

#### useState

后续补充

### concurrent模式

后续补充

## 生命周期

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=NjRmZGFkZjU5MWM0MWNlNjJjOTc0Y2VhZjlkNGRhN2ZfUGZOcjgzVmtTb0lDQnY3RzVkdDlFUk93cHB2T1NmS25fVG9rZW46UU1NOGIySHhzbzJidzF4MUFiQ2NpNkFNbjhlXzE3Mzc2MTIwODQ6MTczNzYxNTY4NF9WNA)

### 类组件

#### 组件初始化（初次渲染）

fiber与实例之间互相获取：workInProgress.stateNode = 组件实例; instance._reactInternals = 实例fiber

##### 初始化流程入口函数

```JavaScript
// react-reconciler\src\ReactFiberBeginWork.js
/** @note 类组件更新主流程 */
function updateClassComponent(
  current: Fiber | null, // 在第一次 fiber 调和之后，会将 workInProgress 树赋值给 current 树
  workInProgress: Fiber, // 当前调和的fiber
  Component: any, // 组件
  nextProps: any, // 即将更新的props
  renderLanes: Lanes, // 渲染优先级
) {
  const props = [workInProgress,Component,nextProps,renderLanes] // 自己写的，节约行数
  const instance = workInProgress.stateNode; // 从fiber中获取组件实例
  let shouldUpdate; // 判断是否应该更新组件
  if (instance === null) { // 实例不存在，说明是初次渲染
    resetSuspendedCurrentOnMountInLegacyMode(current, workInProgress);
    // In the initial pass we might need to construct the instance.
    constructClassInstance(workInProgress, Component, nextProps); // 构建组件实例 详情点击跳转
    mountClassInstance(workInProgress, Component, nextProps, renderLanes); // 挂载组件实例
    shouldUpdate = true; // 初始化挂载后需要更新
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    // 有实例，但没有current，说明是恢复渲染，恢复实例挂载
    shouldUpdate = resumeMountClassInstance(...props);
  } else {
    // 更新组件实例
    shouldUpdate = updateClassInstance(current,...props);
  }
  // 前往执行render方法，获取组件的子节点，并进行深度调和
  const nextUnitOfWork = finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderLanes,
  );
  return nextUnitOfWork; // 返回子节点fiber
}
```

##### constructor

constructor构建组件实例，前面介绍类组件构造中提到的[constructClassInstance](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-KuKadTqI1oovC5xKz4QcuW9gnmh)

##### 挂载类组件实例函数

```JavaScript
// react-reconciler\src\ReactFiberClassComponent.js
// Invokes the mount life-cycles on a previously never rendered instance.
/** @note 类组件挂载 */
function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderLanes: Lanes,
): void {
  const instance = workInProgress.stateNode; // 类组件实例
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = {};

  initializeUpdateQueue(workInProgress); // 初始化更新队列workInProgress.updateQueue

  const contextType = ctor.contextType; // 获取组件构造函数上的静态属性contextType
  // 下面是对组件实例的context属性进行处理赋值
  if (typeof contextType === 'object' && contextType !== null) {
    instance.context = readContext(contextType);
  } else if (disableLegacyContext) {
    instance.context = emptyContextObject;
  } else {
    const unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    instance.context = getMaskedContext(workInProgress, unmaskedContext);
  }

  instance.state = workInProgress.memoizedState;

  // 获取组件构造函数上的静态方法getDerivedStateFromProps
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  if (typeof getDerivedStateFromProps === 'function') {
    // 调用getDerivedStateFromProps方法，将props和state合并得到新的state
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    ); 
    instance.state = workInProgress.memoizedState;
  }

  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.
  // 如果组件有静态方法 getDerivedStateFromProps 或 实例上有 getSnapshotBeforeUpdate 则不会调用willMount
  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
    callComponentWillMount(workInProgress, instance); // 调用componentWillMount 和 UNSAFE_componentWillMount
    // If we had additional state updates during this life-cycle, let's
    // process them now.
    processUpdateQueue(workInProgress, newProps, instance, renderLanes);
    suspendIfUpdateReadFromEntangledAsyncAction();
    instance.state = workInProgress.memoizedState;
  }

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.flags |= Update | LayoutStatic; // 添加更新标记和布局标记
  }
}
```

##### getDerivedStateFromProps

```JavaScript
// react-reconciler\src\ReactFiberClassComponent.js
/** @note 从props衍生合并新的state */
function applyDerivedStateFromProps(
  workInProgress: Fiber,
  ctor: any,
  getDerivedStateFromProps: (props: any, state: any) => any,
  nextProps: any,
) {
  const prevState = workInProgress.memoizedState;
  let partialState = getDerivedStateFromProps(nextProps, prevState);

  // Merge the partial state and the previous state.
  const memoizedState =
    partialState === null || partialState === undefined
      ? prevState
      : assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState;

  // Once the update queue is empty, persist the derived state onto the
  // base state.
  if (workInProgress.lanes === NoLanes) {
    // Queue is always non-null for classes
    const updateQueue: UpdateQueue<any> = (workInProgress.updateQueue: any);
    updateQueue.baseState = memoizedState;
  }
}
```

##### componentWillMount

```JavaScript
// react-reconciler\src\ReactFiberClassComponent.js
/** @note 类组件挂载前调用componentWillMount 和 UNSAFE_componentWillMount */
function callComponentWillMount(workInProgress: Fiber, instance: any) {
  const oldState = instance.state;

  if (typeof instance.componentWillMount === 'function') {
    instance.componentWillMount();
  }
  if (typeof instance.UNSAFE_componentWillMount === 'function') {
    instance.UNSAFE_componentWillMount();
  }

  if (oldState !== instance.state) { // 如果state发生变化，进行替换state操作
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}
```

`enqueueReplaceState`：创建一个为state替换的更新加入调度队列

```JavaScript
// react-reconciler\src\ReactFiberClassComponent.js
/** @note 类组件更新的updater对象 */
const classComponentUpdater = {
  isMounted,
  enqueueSetState() {...},
  /** @note 创建一个为state替换的更新加入调度队列 */
  enqueueReplaceState(inst: any, payload: any, callback: null) {
    const fiber = getInstance(inst); // 获取实例对应的Fiber
    const lane = requestUpdateLane(fiber); // 获取更新优先级
  
    const update = createUpdate(lane); // 创建更新对象
    update.tag = ReplaceState; // 设置更新标记为一次替换state的更新
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      update.callback = callback; // 设置更新回调函数
    }
  
    const root = enqueueUpdate(fiber, update, lane); // 将更新加入Fiber的更新队列
    if (root !== null) {
      startUpdateTimerByLane(lane);
      scheduleUpdateOnFiber(root, fiber, lane); // 调度更新
      entangleTransitions(root, fiber, lane); // 处理并发模式的过渡更新
    }

    if (enableSchedulingProfiler) {
      markStateUpdateScheduled(fiber, lane);
    }
  }
}
```

##### render

[mountClassInstance](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-VMEUdNCVlo4QWtxKeYlcrEXWnfj)至此执行完毕，回到[updateClassComponent](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-X40gdJdluoRBYbxNo66cE5bsn1g)，调用[finishClassComponent](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-I9ItdmuhYoHEGgxLER3c0xoCneA)

获取children进行深度调和reconcileChildren

```JavaScript
// react-reconciler\src\ReactFiberBeginWork.js
/** @note 类组件调和完成，执行render继续调和子组件 */
function finishClassComponent(省略，看上面的调用) {
  const didCaptureError = (workInProgress.flags & DidCapture) !== NoFlags; // 是否捕获到错误

  if (!shouldUpdate && !didCaptureError) { // 不需要更新，且没有捕获到错误
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, false);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }
  
  const instance = workInProgress.stateNode;
  let nextChildren; // 子节点
  nextChildren = instance.render(); // 执行render方法,获取子节点
  reconcileChildren(current, workInProgress, nextChildren, renderLanes); // 深度调和子节点
  return workInProgress.child; // 返回子节点fiber
}
```

##### componentDidMount

render调和完成之后，进入到commit阶段。

```JavaScript
// react-reconciler\src\ReactFiberCommitWork.js
/** @note commit阶段，组件的layout生命周期处理 */
function commitLayoutEffectOnFiber(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedLanes: Lanes,
): void {
  const prevEffectStart = pushComponentEffectStart(); // 开始记录组件的layout生命周期

  // When updating this function, also update reappearLayoutEffects, which does
  // most of the same things when an offscreen tree goes from hidden -> visible.
  const flags = finishedWork.flags; // 当前fiber节点的flags
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    // 函数组件处理
    case SimpleMemoComponent: {
      // 递归子节点执行当前函数 commitLayoutEffectOnFiber
      recursivelyTraverseLayoutEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
      );
      if (flags & Update) {
        // 函数组件commit阶段的layout生命周期处理
        commitHookLayoutEffects(finishedWork, HookLayout | HookHasEffect);
      }
      break;
    }
    // 类组件处理
    caseClassComponent: {
      // 递归子节点执行当前函数 commitLayoutEffectOnFiber
      recursivelyTraverseLayoutEffects(
        finishedRoot,
        finishedWork,
        committedLanes,
      );
      if (flags & Update) {
        // 类组件commit阶段的layout生命周期处理
        commitClassLayoutLifecycles(finishedWork, current);
      }

      if (flags & Callback) {
        commitClassCallbacks(finishedWork);
      }

      if (flags & Ref) {
        safelyAttachRef(finishedWork, finishedWork.return);
      }
      break;
    }
    case HostRoot: {略}
    case HostHoistable: {略}
    case HostSingleton:
    case HostComponent: {略}
    case Profiler: {略}
    case SuspenseComponent: {略}
    case OffscreenComponent: {略}
    default: {略}
  }
  // 略
  popComponentEffectStart(prevEffectStart); // 结束记录组件的layout生命周期
}
```

可以看到以下函数同时包含了**`componentDidMount`**和** `componentDidUpdate`**的执行

```JavaScript
// react-reconciler\src\ReactFiberCommitEffects.js
/** @note 类组件commit阶段的生命周期处理 */
export function commitClassLayoutLifecycles(
  finishedWork: Fiber,
  current: Fiber | null,
) {
  const instance = finishedWork.stateNode; // 获取组件实例
  if (current === null) {
    // 初次挂载渲染阶段
    // We could update instance props and state here,
    // but instead we rely on them being set during last render.
    // TODO: revisit this when we implement resuming.
    if (__DEV__) {
      // ...
    }
    if (shouldProfile(finishedWork)) {
      // profile模式，开启性能检测
      startEffectTimer();
      // ... 省略代码同下方else代码块
      recordEffectDuration(finishedWork);
    } else {
      if (__DEV__) {
        // ...
      } else {
        try {
          instance.componentDidMount(); // 调用componentDidMount生命周期
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
  } else {
    // 更新阶段
    const prevProps = resolveClassComponentProps(
      finishedWork.type,
      current.memoizedProps,
      finishedWork.elementType === finishedWork.type,
    ); // 获取上一次的props
    const prevState = current.memoizedState; // 获取上一次的state
    // We could update instance props and state here,
    // but instead we rely on them being set during last render.
    // TODO: revisit this when we implement resuming.
    if (__DEV__) {
      // ...
    }
    if (shouldProfile(finishedWork)) {
      // profile模式，开启性能检测
      startEffectTimer();
      // ... 省略代码同下方else代码块
      recordEffectDuration(finishedWork);
    } else {
      if (__DEV__) {
        // ...
      } else {
        try {
          // 调用componentDidUpdate生命周期
          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate,
          );
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error);
        }
      }
    }
  }
}
```

##### 总结

执行顺序：constructor -> getDerivedStateFromProps / componentWillMount -> render -> componentDidMount

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MGYyOWQ4NGQ4Y2JhOWVkYTc4MTE0YTY0MzRlZjg1NGVfVzNPbzFtYmZ6SnFlelZvcDhoY3VHYVBWYmgzVXJGZDhfVG9rZW46SVQ2N2J6c24wb1J4a2x4M2YxamN5N1dVbk5nXzE3Mzc2MTIwODQ6MTczNzYxNTY4NF9WNA)

#### 组件更新

##### 更新流程入口函数

和初始化流程同一个人口函数 [updateClassComponent](https://dfrtcthz8n.feishu.cn/docx/H4CndEL8Aoe8u0xdGgkcOuUanmb#share-S6LfdGoCxoNbn6xe2iccCCsXnng)

##### 更新类组件实例函数

```JavaScript
// react-reconciler\src\ReactFiberClassComponent.js
/** @note 类组件更新阶段流程 */
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderLanes: Lanes,
): boolean {
  const instance = workInProgress.stateNode; // 获取组件实例

  cloneUpdateQueue(current, workInProgress);

  // 下面是对新旧props的获取
  const unresolvedOldProps = workInProgress.memoizedProps;
  const oldProps = resolveClassComponentProps(
    ctor,
    unresolvedOldProps,
    workInProgress.type === workInProgress.elementType,
  );
  instance.props = oldProps;
  const unresolvedNewProps = workInProgress.pendingProps;

  // 下面是对新旧context的获取
  const oldContext = instance.context;
  const contextType = ctor.contextType;
  let nextContext = emptyContextObject;
  if (typeof contextType === 'object' && contextType !== null) {
    nextContext = readContext(contextType);
  } else if (!disableLegacyContext) {
    const nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
  }

  // 获取组件构造函数上的静态方法getDerivedStateFromProps
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  // 判断是否有新的生命周期方法
  const hasNewLifecycles =
    typeof getDerivedStateFromProps === 'function' ||
    typeof instance.getSnapshotBeforeUpdate === 'function';
  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
      typeof instance.componentWillReceiveProps === 'function')
  ) {
    // 不存在新的生命周期方法
    if (
      unresolvedOldProps !== unresolvedNewProps ||
      oldContext !== nextContext
    ) {
      // 浅比较props和context，如果有变化，调用componentWillReceiveProps 和 UNSAFE_componentWillReceiveProps
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext,
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();

  // 获取新旧state
  const oldState = workInProgress.memoizedState;
  let newState = (instance.state = oldState);
  processUpdateQueue(workInProgress, newProps, instance, renderLanes);
  suspendIfUpdateReadFromEntangledAsyncAction();
  newState = workInProgress.memoizedState;

  // props，state，context都无变化且没有强制更新
  if (
    unresolvedOldProps === unresolvedNewProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing() &&
    !(
      enableLazyContextPropagation &&
      current !== null &&
      current.dependencies !== null &&
      checkIfContextChanged(current.dependencies)
    )
  ) {
    // 不更新
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    }
    return false;
  }

  if (typeof getDerivedStateFromProps === 'function') {
    // 调用getDerivedStateFromProps方法，将props和state合并得到新的state
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps,
    );
    newState = workInProgress.memoizedState;
  }

  // 执行shouldComponentUpdate方法，判断是否需要更新
  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext,
    ) ||
    // TODO: In some cases, we'll end up checking if context has changed twice,
    // both before and after `shouldComponentUpdate` has been called. Not ideal,
    // but I'm loath to refactor this function. This only happens for memoized
    // components so it's not that common.
    (enableLazyContextPropagation &&
      current !== null &&
      current.dependencies !== null &&
      checkIfContextChanged(current.dependencies));

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === 'function' ||
        typeof instance.componentWillUpdate === 'function')
    ) {
      // 执行 UNSAFE_componentWillUpdate componentWillUpdate 方法
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }
      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }
    }
    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.flags |= Update;
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.flags |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Update;
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (
        unresolvedOldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.flags |= Snapshot;
      }
    }

    // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.
    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;

  return shouldUpdate;
}
```

#### 组件销毁

### 函数组件

## Fiber

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

## Scheduler

## Reconciler

## 事件合成

## Concurrent

## Suspense

## React19

## Hooks

### effect

### Ref

### Context

### Memo

### Lazy Suspense

## 状态管理

### Mobx

### redux

## React-router

### React-router-dom

基于React-router上开发的适用Web环境的路由组件库，提供了常用的HashRouter，BrowserRouter，Link，NavLink，Routes(react-router6弃用Switch)，Navigate(react-router4弃用Redirect)等组件

### 精准路由

### 动态路由

### keep-alive

### 微前端路由

### 路由拦截

### 路由守卫

## SSR

[手写SSR渲染原理](https://dfrtcthz8n.feishu.cn/docx/FQIldG2sBoKN6UxbUH0c3fdSnhr?from=from_copylink)

## 性能优化

### React Scan

[一款超强的 React 性能测试工具！](https://mp.weixin.qq.com/s/P_VR-uaftAWbJgbqjD39eA)

### 用普通函数还是箭头函数

```JavaScript
/** 类组件 */
class Parent extends React.Component {
    commonHanlder() {} // 创建在类组件上；普通函数的引用不会变化
    arrowHanlder = () => {} // 创建在组件实例上；每次渲染会创建新的props对象，导致对箭头函数的引用会变化
    render() {
        return <>
            <Child onClick={this.commonHanlder} /> // this指向变成了click事件而不是类组件
            <Child onClick={this.arrowHanlder} /> // Parent每次渲染Child都跟着渲染
            <Child onClick={() => {}} /> // 每次渲染重新定义新的函数
        </>
    }
}

/** 函数组件 每次渲染都是重新执行Parent函数 */
function Parent(props) {
    function commonHandler() {} // 每次渲染重新定义新的函数 ps：普通函数由于js引擎的优化，创建与销毁的性能开销较小
    const arrowHandler = () => {} // 每次渲染重新定义新的函数
    return <>
        <Child onClick={commonHanlder} /> // Parent每次渲染Child都跟着渲染
        <Child onClick={arrowHanlder} /> // Parent每次渲染Child都跟着渲染
        <Child onClick={() => {}} /> // 每次渲染重新定义新的函数
    </>
}
```

#### 最佳实践

类组件使用绑定this的普通函数；函数组件使用useCallback缓存函数；React.memo比较其他props来减少渲染；

```JavaScript
/** 类组件 */
class Example extends React.Component {
    constructor(props) {
        super(props)
        this.commonHanlder = this.commonHanlder.bind(this)
    }
    commonHanlder() {}
        return <div onClick={this.commonHanlder} />
    }
}

/** 函数组件 */
function Parent(props) {
    const callbackHandler = useCallback(() => {}), []
    return <Child onClick={callbackHandler} />
}
```

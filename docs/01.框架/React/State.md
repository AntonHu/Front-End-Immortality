# State

state是React中重要的数据，反映了组件所处的状态，下面将通过setState源码，揭秘React中修改state的实现流程，让你彻底弄明白，为什么setState有时候是异步有时候又是同步。

## legacy模式

### setState

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

#### enqueueSetState

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

#### 批量更新

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

#### 优先级

flushSync setState > 常规setState > setTimeout setState > Promise setState

##### 常规setState

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

##### setTimeout setState

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

##### unstable_batchedUpdates

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

##### flushSync setState

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

### useState

后续补充

## concurrent模式

后续补充
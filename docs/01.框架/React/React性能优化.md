# React性能优化

## 用普通函数还是箭头函数

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

**总结最佳实践**

类组件使用绑定this的普通函数；函数组件使用useCallback缓存函数；React.memo比较其他props来减少渲染；
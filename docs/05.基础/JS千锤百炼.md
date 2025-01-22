## 数据类型

### 基础类型

#### 字符串

#### Number

##### 二进制

###### 小数

使用浮点数表示法（如 IEEE 754），包含符号位、指数位和尾数位。

**转换方法**

* 整数部分：不断除以 `2`，记录余数。
* 小数部分：不断乘以 `2`，记录整数部分。

**示例**

将 `6.25` 转换为二进制

1. 整数部分（6）：
   1. `6 / 2 = 3`，余数 `0`
   2. `3 / 2 = 1`，余数 `1`
   3. `1 / 2 = 0`，余数 `1`
   4. 逆序排列：`110`
2. **小数部分（0.25）** ：
3. `0.25 * 2 = 0.5`，整数部分 `0`
4. `0.5 * 2 = 1.0`，整数部分 `1`
5. 顺序排列：`.01`
6. **合并结果** ：
7. `110.01`

###### 负数

在二进制中以**补码**来表示

1. 计算出负数绝对值对应的正数，例如-6绝对值是6，二进制 00000110
2. 将该正数取反得到补码，如上 00000110 取反，11111001
3. +1 得到的结果就是表示负数的补码，如上 11111001 + 1 = 11111010

补码特性

1. **符号位** ：最高位（最左边的位）是符号位：
2. `0` 表示正数。
3. `1` 表示负数。
4. **范围** ：对于 `n` 位二进制数，补码表示的范围是：
5. 最小值：`-2^(n-1)`
6. 最大值：`2^(n-1) - 1`
7. 例如，8 位补码的范围是 `-128` 到 `127`。
8. **唯一性** ：每个数只有一个补码表示，避免了正负零的问题。

###### 位运算

```JavaScript
// React源码中FiberFlag的状态逻辑采用了二进制的形式便于运算
let flag = 0 // 0000
const Update = 1 << 0 // 0001 0001往左位移0位
const LayoutStatic = 1 << 1 // 0010 0001往左位移1位

flag |= Update | LayoutStatic // 增加update和layoutStatic状态，先计算
flag & Update // 判断是否有Update状态
flag & LayoutStatic // 判断是否有LayoutStatic状态
flag &= ~Update // 去除Update状态
flag = ~flag // 清空所有状态
```

##### Number高频题

###### 0.1 + 0.2 === 0.3？

```JavaScript
// 由于浮点数运算的原因，0.1 + 0.2得到的结果是0.3的浮点数，是一个无限循环的二进制
// 0.3 * 2 -> 0.6 取整数0，余0.6
// 0.6 * 2 -> 1.2 取整数1，余0.2
// 0.2 * 2 -> 0.4 取整数0，余0.4
// 0.4 * 2 -> 0.8 取整数0，余0.8
// 0.8 * 2 -> 1.6 取整数1，余0.6
// 到此又回到了0.6的运算，接下来就是循环，以下是解决方案
BigInt
```

### 对象

#### 原型

[[prototype]]写作__proto__，也可以通过Object.getPrototypeOf获取，他指向他的构造函数对象的prototype属性

##### new命令

```JavaScript
function _new(constructor, params) {
    // arguments是类数组转为数组才能用数组api
    const _arguments = Array.prototype.slice.call(arguments)
    const _constructor = _arguments.shift()
    // 继承原型
    const obj = Object.create(_constructor.prototype)
    // 执行构造函数
    const result = _constructor.apply(obj, _arguments)
    // 保证return的是对象
    return Object.prototype.isProptotypeOf(result) ? result : obj
}
```

##### this

##### instanceof

##### 继承

###### 构造函数继承

Tips: 多继承可以借 Object.assign(Sub.prototype, Super2.prototype)变向实现

```JavaScript
function Child() {
    // 构造函数内部继承
    Parent.call(this)
}
// 原型继承
Child.prototype = Object.create(Parent.prototype) // 避免直接修改Super原型
// 构造函数指向纠正
Child.prototype.constructor = Child
```

#### 对象高频题

##### 属性自定义

* `Object.defineProperty`：适合对单个属性进行精细控制，例如定义 getter/setter 或修改属性特性。
* `Proxy`：适合拦截整个对象的操作，自定义对象的行为。
* `Reflect.defineProperty`：与 `Object.defineProperty` 功能相同，但返回布尔值，适合需要判断操作是否成功的场景。

##### 对象遍历

| **遍历方法**           | **描述**                 | **自身属性** | **原型属性** |
| ---------------------------- | ------------------------------ | ------------------ | ------------------ |
| **可枚举**             | **不可枚举**             | **Symbol**   | **可枚举**   |
| for...in                     | 遍历属性                       | ✅                 | ❌                 |
| Object.keys                  | 获取自身属性                   | ✅                 | ❌                 |
| Object.values                | 获取自身属性值                 | ✅                 | ❌                 |
| Object.entries               | 获取自身属性+值 [[key, value]] | ✅                 | ❌                 |
| Object.getOwnPropertyNames   | 获取自身属性名                 | ✅                 | ✅                 |
| Object.getOwnPropertySymbols | 获取自身Symbol属性             | ❌                 | ❌                 |
| Reflect.ownKeys              | 获取自身所有属性               | ✅                 | ✅                 |

```JavaScript
const parent = { protoKey: 1 };
const child = Object.create(parent) // protoKey作为child的原型链属性

child.enumerableKey = 2 // enumerableKey为child的可枚举属性
Object.defineProperty(obj, 'nonenumerableKey', {
  value: 3,
  enumerable: false, // 不可枚举
});
child[Symbol('symbolKey')] = 3; // symbol属性默认不可枚举，可通过defineProperty改为可枚举，但仍不可被 for...in 和 Object.keys 遍历

for (const key in obj) { // 遍历可枚举属性
  console.log(key); // 输出：protoKey, enumerableKey
}

// 非原型链上的属性，包含不可枚举属性，但不包含symbol属性
const ownPropertyies = Object.getOwnPropertyNames(child); // ['enumerableKey', 'nonenumerableKey']
// 非原型链上的symbol属性
const ownSymblKeys = Object.getOwnPropertySymbols(child); // [Symbol(c)]
// 
const reflectOwnKeys= Reflect.ownKeys(child); // ['enumerableKey', 'nonenumerableKey', Symbol(c)]
```

### 数组

#### Api

##### Sort

```JavaScript
let arr = [3,2,1,10,20,30]
arr.sort() // [1,10,2,20,3,30] 将数组元素转为字符串进行ASCII升序排序
// 使用比较函数
arr.sort((a, b) => 大于0，b在a前面；小于0，a在b前面；等于0，ab位置不变)
arr.sort((a, b) => a - b) // [1,2,3,10,20,30] b在前升序
arr.sort((a, b) => b - a) // [1,2,3,10,20,30] a在前降序
```

### 类型高频考题

#### typeof和instanceof

#### valueOf和toString

二者都是Object原型链上的方法，当进行拼接或运算时，可能会触发隐式转换，**先调用valueOf**，如果valueOf不是能拿来运算的原始值，就会**继续调用toString**。

##### valueOf

```JavaScript
/** 普通对象 */
var obj = {}
obj.valueOf() // {} 返回对象本身

/** 数组 */
var arr = [1,2,3]
arr.toString() // [1,2,3] 返回数组本身

/** Number对象 */
var numObj = Number(123)
numObj.valueOf() // 123 javascript重写了valueOf，返回原始值

/** 基础类型 */
var num = 123
num.valueOf() // 123 返回原始值
```

##### toString

```JavaScript
/** 普通对象 */
var obj = {}
obj.toString() // "[object Object]" 返回类型字符串

/** 数组 */
var arr = [1,2,3]
arr.toString() // "1,2,3" 数组默认重写了toString，返回逗号拼接的字符串
Array.prototype.toString.call(arr) // "1,2,3" 等于上面
Object.prototype.toString.call(arr) // "[object Array]" Object原型链toString未重写，返回类型字符串

/** Number对象 */
var numObj = Number(123)
numObj.toString() // "123" Number对象重写了toString，返回原始值的字符串
Number.prototype.toString.call(arr) // "123" 等于上面
Object.prototype.toString.call(numObj) // "[object Number]" Object原型链toString未重写，返回类型字符串

/** 基础类型 */
var num = 123
num.toString() // "123" 转成字符串
```

#### valueEqual等值判断

```JavaScript
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function valueEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return valueEqual(item, b[index]);
    });
  }
  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);
  if (aType !== bType) return false;
  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();
    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }
  return false;
}
export default valueEqual;
```

## 函数

### Prototype

函数对象具有prototype原型对象属性，用于定义通过new操作符创建的实例原型，prototype.constructor指向构造函数本身。

#### Object.prototype

所有对象的原型链终点，所有对象都继承Object.prototype对象的方法和属性（除了Object.create(null)）

```JavaScript
Object.prototype.__proto__ === null
```

#### Function.prototype

所有函数对象的原型，所以有以下有趣的自循环原型关系：

```JavaScript
// Function函数对象的原型 指向 Function构造函数的prototype
Function.__proto__ === Function.prototype // 输出: ƒ () { [native code] }
// Function.prototype是函数对象，只有constructor和__proto__的空函数
// 是对象所以原型就会指向Object.prototype
Function.prototype.__proto__ === Object.prototype
```

### eval

将字符串当作js执行的函数，常用来动态创建js执行，有安全隐患，创建函数建议用new Function，解析JSON用JSON.parse。

非严格模式，运行作用域为调用eval所在作用域；严格模式，作用域会eval内部临时作用域；

```TypeScript
eval('var x = 1')
console.log(x) // x is not defined
```

### 箭头函数和普通函数区别

#### 箭头函数

this指向词法作用域，函数定义时的作用域this指向

#### 普通函数

this指向动态作用域，函数被调用时的上下文this指向

### 函数高频考题

#### 节流防抖

```JavaScript
function throttle(fn, wait) {
    let timer = null
    return function() {
        if (timer) return
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, wait)
    }
}
function debounce(fn, delay) {
    let timer = null
    return function() {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}
```

## ES6+

### 模块

### 类

#### extends

```JavaScript
const __extends = (child, parent) => {
    // parent不是构造函数也不是null则无法继承
    if (typeof parent !== 'function' && parent !== null) 
        throw new TypeError(`Class extends value ${String(parent)} is not a function or null`)
    // 复用类继承函数，这是babel打包的模块化的复用处理
    if (this && this.__extends) {
        return this.__extends(c, p)
    }
    /** 静态属性继承 */
    const extendsStatics = (c, p) => {
        // 支持setPrototypeOf则直接使用
        if (Object.setPrototypeOf) {
            Object.setPrototype(c, p)
            return
        }
        // 支持__proto__则直接使用
        if ({__proto__: []} instanceof Array) {
            c.__proto__ = p
            return
        }
        // babel回退方案，遍历parent显示属性复制到child
        // 实际上这是不符合setPrototypeOf机制的，复制的属性无法实现动态化，父类增加静态属性方法，子类无法访问
        for (const prop in parent) {
            if (parent.hasOwnPrototype(prop)) {
                child[prop] = parent[prop]
            }
        }
    }
    // 1. 继承静态属性方法，子类构造函数原型链继承
    extendsStatics(child, parent)
    // 2. 继承实例属性方法，子类实例原型链继承
    child.prototype = Object.create(parent === null ? parent : parent.prototype)
    // 3. 重置被覆盖的构造函数
    child.prototype.constructor = child
    // 4. 添加 super 方法，用于调用父类构造函数
    child.super = parent
}
```

#### super

手写super

### Set/WeakSet

### Map/WeakMap

### Symbol

### Proxy

### ES6+高频考题

#### ... 拓展运算符兼容写法

```JavaScript
function _spreadObject(target) {
    for(var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source) {
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
    }
    return target
}
// const newObj = {...oldObject, ...otherObject}
var newObj = _spreadObject({}, oldObject, otherObject)
```

## 异步

### Promise

### Async await

### 迭代器

## 运行时

### 垃圾回收

JS采用分代式垃圾回收机制，内存分为新老生代空间

#### 新生代空间

存放短期数据，采用 **Scavenge GC算法（复制算法）** ，有**From**和**To**两个空间。

新分配的对象放From空间，当From空间满时，进行GC处理，将存活对象复制到To空间，销毁失活对象，然后将To空间与From空间互换

#### 老生代空间

存放长期活跃数据，有两个算法，**标记清除算法**和 **标记压缩算法** 。

##### 如何进入老生代

1. 经历过新生代GC的对象会进入老生代空间
2. 在To空间内存占用超过25%的对象

##### 标记清除法

标记：从根对象遍历，即全局对象或当前调用栈变量开始，遍历所有可触达对象，将其标记为活跃。

清除：遍历堆内存，清除回收所有未标记的对象（为优化回收造成的页面停顿，后续升级了增量标记和并发标记）

##### 标记压缩法

也叫标记整理法，标记清除后形成碎片空间，当碎片过多会触发整理，将活跃对象往一端迁移聚集，然后清除回收空闲空间

#### 优化内存使用

* 避免全局变量
* 及时释放引用，如设置null，清定时器事件监听
* 使用弱引用(WeakSet和WeakMap)存放临时数据

### 作用域

### 闭包

### 模块

## 正则

## 媒体

### 文件上传

## 事件

### 传播三阶段

* 捕获阶段： window-document-html-body-父节点-目标节点
* 目标阶段：目标节点触发事件
* 冒泡阶段：目标节点-父节点-body-html-document-window

### 事件API

#### addEventListener

```JavaScript
addEventListener('name', handler, isCapture) // isCapture是否捕获阶段，默认冒泡阶段
```

#### Event和CustomEvent

```JavaScript
const event = new Event('name', {
    bubbles: true, // 是否冒泡，false则只触发捕获阶段
    cancelable: true // 是否可取消，只有为true，preventDefault才能生效
})
event.cancelBubble // true相当于stopPropagation
const customEvent = new CustomEvent('name', {
    detail: { data }, // 比Event多了detail
    bubbles: true
    cancelable: true
})
```

#### dispatchEvent

EventTarget.dispatchEvent，只要有preventDefault则返回false

#### StopImmediatePropagation

除了阻止向上冒泡，同时阻止了当前节点相同事件的其他函数（同一个事件可以添加多个处理函数按顺序执行）

网页

### session历史

#### pageshow pagehide

当用户点击“前进/后退”按钮时，浏览器就会从缓存中加载页面。

`pageshow`事件在页面加载时触发，包括第一次加载和从缓存加载两种情况，第一次加载时，它的触发顺序排在 `load`事件后面。从缓存加载时，`load`事件不会触发。

`pageshow`的 `persisted`，页面第一次加载时，是 `false`；从缓存加载时，是 `true`。

`pagehide`事件，当用户通过“前进/后退”按钮，离开当前页面时触发。如果定义了 `unload/beforeunload` 事件页面不会保存在缓存中，用 `pagehide`事件，页面会保存在缓存中。

`pagehide`的 `persisted`，`true`表示页面要保存在缓存中；`false`表示网页不保存在缓存中，如果监听了unload事件，该函数将在 pagehide 事件后立即运行。

#### hashchange popstate

调用 `history.pushState()`或 `history.replaceState()`，并不会触发 `popstate`事件。该事件只在用户在 `history`记录之间显式切换时触发，比如鼠标点击“后退/前进”按钮，或者在脚本中调用 `history.back()`、`history.forward()`、`history.go()`时触发。

### 网页状态

#### DOMContentLoaded

仅完成了DOM，其他样式资源可能未完成，load事件才是完全加载完成

#### readystatechange

`readystatechange`事件当 Document 对象和 XMLHttpRequest 对象的 `readyState`属性发生变化时触发。`document.readyState`有三个可能的值：

* `loading`（网页正在加载）
* `interactive`（网页已经解析完成，但是外部资源仍然处在加载状态）
* `complete`（网页和所有外部资源已经结束加载，`load`事件即将触发）

```JavaScript
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    // ...
  }
}
```

### 拖拽

```JavaScript
<div draggable="true">
  此区域可拖拉
</div>

var dragged = null
document.addEventListener('dragstart', e => {
  dragged = e.target; // 保存被拖拉节点
  var img = document.createElement('img');
  img.src = 'http://path/to/img';
  e.dataTransfer.setDragImage(img, 0, 0); // 节点拖拽时的样式
}, false);
document.addEventListener('drop', e => {
  e.preventDefault(); // 防止事件默认行为（比如某些元素节点上可以打开链接）
  if (e.target.className === 'dropzone') {
    dragged.parentNode.removeChild(dragged); // 删除原位置节点
    e.target.appendChild(dragged); // 将被拖拉节点插入目标节点
  }
}, false);
```

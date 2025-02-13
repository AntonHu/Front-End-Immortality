# JS数据类型之基础类型

## Number

### 小数

使用浮点数表示法（如 IEEE 754），包含符号位、指数位和尾数位。

**转换方法**

- 整数部分：不断除以 `2`，记录余数。
- 小数部分：不断乘以 `2`，记录整数部分。

**示例**

将 `6.25` 转换为二进制

1. 整数部分（6）：
   1. `6 / 2 = 3`，余数 `0`
   2. `3 / 2 = 1`，余数 `1`
   3. `1 / 2 = 0`，余数 `1`
   4. 逆序排列：`110`
2. **小数部分（0.25）**：
   1. `0.25 * 2 = 0.5`，整数部分 `0`
   2. `0.5 * 2 = 1.0`，整数部分 `1`
   3. 顺序排列：`.01`
3. **合并结果**：
   1. `110.01`

### 负数

在二进制中以**补码**来表示

1. 计算出负数绝对值对应的正数，例如-6绝对值是6，二进制 00000110
2. 将该正数取反得到补码，如上 00000110 取反，11111001
3. +1 得到的结果就是表示负数的补码，如上 11111001 + 1 = 11111010

补码特性

1. **符号位**：最高位（最左边的位）是符号位：
   1. `0` 表示正数。
   2. `1` 表示负数。
2. **范围**：对于 `n` 位二进制数，补码表示的范围是：
   1. 最小值：`-2^(n-1)`
   2. 最大值：`2^(n-1) - 1`
   3. 例如，8 位补码的范围是 `-128` 到 `127`。
3. **唯一性**：每个数只有一个补码表示，避免了正负零的问题。

### 位运算

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

### Number高频题

#### 0.1 + 0.2 === 0.3？

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

## 字符串



## 类型特性题

### typeof和instanceof

### valueOf和toString

二者都是Object原型链上的方法，当进行拼接或运算时，可能会触发隐式转换，**先调用valueOf**，如果valueOf不是能拿来运算的原始值，就会**继续调用toString**。

#### valueOf

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

#### toString

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

### valueEqual等值判断

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

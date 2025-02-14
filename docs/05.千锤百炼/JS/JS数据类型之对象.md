# JS数据类型之对象

## 原型

[[prototype]]写作__proto__，也可以通过Object.getPrototypeOf获取，他指向他的构造函数对象的prototype属性

## new命令

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

### this

### instanceof

## 继承

### 构造函数继承

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

## 对象特性题

### 属性自定义

- `Object.defineProperty`：适合对单个属性进行精细控制，例如定义 getter/setter 或修改属性特性。
- `Proxy`：适合拦截整个对象的操作，自定义对象的行为。
- `Reflect.defineProperty`：与 `Object.defineProperty` 功能相同，但返回布尔值，适合需要判断操作是否成功的场景。

### 对象遍历

| **遍历方法**                 | **描述**                       | **自身属性** | **原型属性** |              |            |      |      |
| ---------------------------- | ------------------------------ | ------------ | ------------ | ------------ | ---------- | ---- | ---- |
| **可枚举**                   | **不可枚举**                   | **Symbol**   | **可枚举**   | **不可枚举** | **Symbol** |      |      |
| for...in                     | 遍历属性                       | ✅            | ❌            | ❌            | ✅          | ❌    | ❌    |
| Object.keys                  | 获取自身属性                   | ✅            | ❌            | ❌            | ❌          | ❌    | ❌    |
| Object.values                | 获取自身属性值                 | ✅            | ❌            | ❌            | ❌          | ❌    | ❌    |
| Object.entries               | 获取自身属性+值 [[key, value]] | ✅            | ❌            | ❌            | ❌          | ❌    | ❌    |
| Object.getOwnPropertyNames   | 获取自身属性名                 | ✅            | ✅            | ❌            | ❌          | ❌    | ❌    |
| Object.getOwnPropertySymbols | 获取自身Symbol属性             | ❌            | ❌            | ✅            | ❌          | ❌    | ❌    |
| Reflect.ownKeys              | 获取自身所有属性               | ✅            | ✅            | ✅            | ❌          | ❌    | ❌    |

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

# JS函数

## Prototype

函数对象具有prototype原型对象属性，用于定义通过new操作符创建的实例原型，prototype.constructor指向构造函数本身。

### Object.prototype

所有对象的原型链终点，所有对象都继承Object.prototype对象的方法和属性（除了Object.create(null)）

```JavaScript
Object.prototype.__proto__ === null
```

### Function.prototype

所有函数对象的原型，所以有以下有趣的自循环原型关系：

```JavaScript
// Function函数对象的原型 指向 Function构造函数的prototype
Function.__proto__ === Function.prototype // 输出: ƒ () { [native code] }
// Function.prototype是函数对象，只有constructor和__proto__的空函数
// 是对象所以原型就会指向Object.prototype
Function.prototype.__proto__ === Object.prototype
```

## eval

将字符串当作js执行的函数，常用来动态创建js执行，有安全隐患，创建函数建议用new Function，解析JSON用JSON.parse。

非严格模式，运行作用域为调用eval所在作用域；严格模式，作用域会eval内部临时作用域；

```TypeScript
eval('var x = 1')
console.log(x) // x is not defined
```

## 箭头函数和普通函数区别

### 箭头函数

this指向词法作用域，函数定义时的作用域this指向

### 普通函数

this指向动态作用域，函数被调用时的上下文this指向

## 函数特性题

### 节流防抖

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

## 
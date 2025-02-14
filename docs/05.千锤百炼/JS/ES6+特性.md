# ES6+特性

## 模块

## 类

### extends

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

### super

手写super

## Set/WeakSet

## Map/WeakMap

## Symbol

## Proxy

## ES6+特性题

### ... 拓展运算符兼容写法

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

## 
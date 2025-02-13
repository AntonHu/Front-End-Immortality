# JS数据类型之数组

## API

### map

```
array.map((element, index, array) => newElement, thisArg?)
```

要点：1. 稀松数组的处理；2. 回调函数的this指向；3. 被遍历的数组

```JavaScript
array.map((item, index, arr) => item, this)

Array.prototype.map = function(callbackFn, thisArg) {
    const resultArray = [] // 返回的新数组
    const originArray = this // 调用map的数组
    const callbackFnThis = thisArg || this // map的第二个参数，指定回调函数的this指向
    for (var i = 0; i < originArray.length; i++) {
        // 使用in判断索引是否在数组中已经初始化，map只会遍历初始化过的数组元素
        if (i in originArray) {
            // 这里使用resultArray[i]赋值，才能还原稀疏数组，如果用push会导致数组长度不正确
            resultArray[i] = callback.call(callbackFnThis, originArray[i], i, originArray)
        }
    }
    return resultArray
}
```

### reduce

```
array.reduce((accumulator, currentValue, currentIndex) => newAccumulator, initialValue?)
```

要点：初始currentValue和initialValue的关系，有initialValue时，currentValue为array[0]，否则为array[1]

```JavaScript
Array.prototype.reduce = function(callback, initialValue) {
    const array = this
    if (array.length === 0) throw new TypeError('Reduce of empty array with no initial value')
}
```

### sort

```JavaScript
let arr = [3,2,1,10,20,30]
arr.sort() // [1,10,2,20,3,30] 将数组元素转为字符串进行ASCII升序排序
// 使用比较函数
arr.sort((a, b) => 大于0，b在a前面；小于0，a在b前面；等于0，ab位置不变)
arr.sort((a, b) => a - b) // [1,2,3,10,20,30] b在前升序
arr.sort((a, b) => b - a) // [1,2,3,10,20,30] a在前降序
```
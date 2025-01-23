# Typescript运用

## 类型声明

* **.d.ts** ：常用于JS库的typescirpt类型声明文件，便于 **给ts的使用者提供静态检查** ，编辑器提示等作用
* **declare** ：声明类型的关键字，常用于声明一些在**运行时环境已知的类型**信息，第三方库等，例如jquery等
* **global** ：**拓展全局**作用域，global是可访问的对象
* **namespace** ：可以对变量函数类等进行分组，避免污染全局变量，常用于单一文件内的代码组织和封装，适合简单的场景使用，**复杂的多文件之间现在都习惯用模块化**了

## 函数与类

### 函数

```TypeScript
interface Function {
    (param: number): string
    new (prop: boolean): Date
}
const 
```

### 类

#### 接口

可以定义对象或函数的形状(shape)，不包含任何实现这是与抽象类的区别，他还可以被类实现

接口与类型别名的区别：

| 特性     | 接口（Interface）             | 类型别名（Type Alias）             |
| -------- | ----------------------------- | ---------------------------------- |
| 定义方式 | 使用 interface 关键字         | 使用 type 关键字                   |
| 扩展性   | 可以通过 extends 继承其他接口 | 可以通过 & 交叉类型扩展            |
| 实现     | 可以被类实现（implements）    | 不能直接被类实现                   |
| 合并     | 同名接口会自动合并            | 同名类型别名会报错                 |
| 适用场景 | 定义对象的形状、类的契约      | 定义复杂类型、联合类型、交叉类型等 |

#### 成员类型

```TypeScript
/** 抽象类，不能被实例化但可以包含实现，属性和构造函数，而且可以包含抽象成员强制子类实现，接口则不包含实现 */
abstract class AbstractExample {
    /** 实例抽象成员，子类必须实现的成员 */
    abstract abstractProp: string
}
class Example extends AbstractExample {
    /** 继承自抽象类的抽象成员，子类必须实现 */
    abstractProp = "abstract"
    /** 实例公共成员，public可以省略，默认就是公共成员 */
    public publicProp = "public"
    /** 静态成员，只声明在类上不存在于实例上 */
    static staticProp = "static"
    /** 实例只读成员，只能在声明时或构造函数中初始化，不可修改 */
    readonly readonlyProp: string
    constructor(initValue) {
        this.readonlyProp = initValue // 只有声明时没有初始化才可以在这里赋值
    }
    /** 实例访问器成员，通过get，set控制访问 */
    get getProp() {
        return "get"
    }
    set setProps(prop) {
        tihs.publicProp = prop
    }
    /** 实例私有成员，只能在类内部访问 */
    private privateProp = "private"
    /** 实例受保护成员，只能在类内部和子类内部访问 */
    protected protectedProp = "protected"
}

const example = new Example("初始化")
example.publicProp // 
/** 静态成员 */
Example.staticProp // '动物'
example.staticProp // undefined
/** 实例只读成员 */
example.readonlyProp // '动物'
example.readonlyProp = '生物' // throw error
/** 实例
```

## 未知类型

### unknown

位置类型，定义时未知的或者不可控不好定义的类型，同时也是提醒开发者后续进行类型校验，一般后续使用需要类型断言，并注意类型校验

### never

表示不可能出现的类型，例如无限循环，抛出异常等

### any

任意类型，绕过typescript检查，失去类型安全

### void

无返回值，用于函数返回值

## **泛型**

在定义时不需要声明具体类型，在**使用时指定类型**的一种类型声明形式，常用于声明多类型参数的函数类等，也适合复用类型的场景

### 类型推断

在没有显示声明的情况下，ts会基于上下文对变量，函数参数，返回值进行类型推导，例如给变量赋值，ts则会给变量推导出对应值的类型定义，不过undefined和null通过需要显示声明，直接赋值会推导为any

### 工具类型

#### Pick<T, K>

从接口T中提取属性K

```TypeScript
interface Person {
    id: string
    name: string
    age: number
}
type pick = Pick<Person , 'name' | 'age'> // { name: string; age: number }
```

#### Omit<T, K>

从接口T中排除属性K

```TypeScript
interface Person {
    id: string
    name: string
    age: number
}
type omit = Omit<Person, 'age'> // { id: string; name: string }
```

#### Exclude<T, U>

从类型T中排除类型U

```TypeScript
type animal = 'dog' | 'cat' | 'pig'
type zodic = Exclude<animal, 'cat'> // 'dog' | 'pig' 猫不是十二生肖
```

#### Extract<T, U>

提取类型T和类型U相同的部分

```TypeScript
type fruit = 'apple' | 'orange' | 'pear'
type round = 'apple' | 'orange' | 'egg'
type extract = Extract<fruit, round> // 'apple' | 'orange'
```

#### Partial`<T>`

让接口T的所有属性都变为可选的

```TypeScript
interface Person {
    id: string
    name: string
    age: number
}
type partial = Partial<Person> // {id?: string; name?:string; age?: number }
```

#### Required`<T>`

让接口T的所有属性变为必需

```TypeScript
interface Person {
    id?: string
    name?: string
    age?: number
}
type partial = Required<Person> // {id: string; name:string; age: number }
```

#### Record<K, T>

以K为key，T为value的键值对

```TypeScript
Record<keyof Person, Person> // 等同于Person
```

#### **NonNullable`<T>`**

从 `T` 中移除 `null` 和 `undefined`。

#### **ReturnType`<T>`**

获取函数类型的返回值类型。

## 高阶类型

### 条件类型

```TypeScript
type IsString<T> = T extends string? T : never
type OnlyString = IsString<string | number | boolean> // string
```

### 索引类型

```TypeScript
type Keys = keyof Person // 'id' | 'name' | 'age'
```

### 映射类型

```TypeScript
type ReadonlyPerson = { readonly [Key in keyof Person]: Person[Key] }
```

## 常用配置

#### baseUrl

#### paths

#### target

#### jsx

#### react

#### react-jsx

#### lib

#### allowJs

#### esModuleInterop

#### module

#### moduleResolution

#### skipLibCheck

#### exclude

#### include

#### plugins

#### typescript-plugin-css-modules

#### strict

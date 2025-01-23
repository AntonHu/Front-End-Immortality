# Pnpm:最先进的依赖管理

pnpm，英文里面的意思叫做 `performant npm` ，意味“高性能的 npm”，官网地址可以参考 [https://pnpm.io/](https://pnpm.io)

## 什么是pnpm

---

Pnpm 本质上就是一个包管理器，这一点跟 npm/yarn 没有区别，但它作为杀手锏的两个优势在于:

* 节约磁盘空间
* 提升安装速度

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2Y0MTEzMGE5YTI1MmQ0ZjIwYmFmMGU1NjM4N2UyMDJfTGJUVW5hWEpXSlYxOHU5THM3TDFJS0xGdHF5MHRZVG1fVG9rZW46VHFBRmJlUnVrbzlwSEt4WTh0SGNVRmRWbjJkXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

另外他还能解决 npm/yarn 【幽灵依赖】的问题

## 谁在使用

---

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=N2ZiOGVjZWFlMGQ4NDdhOTIzMzQwMjRmYWNmOTZhZjRfR1FKYjY3WHdGbGpEUGNGV1hxekV1WmVGU3N2THhNbWlfVG9rZW46UjZnemJRTDFwb1JXNkF4dDlCcGNmcDFqbnNjXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

## pnpm的特性

---

### Store

安装的依赖包文件，会通过hard links硬链接的形式存储在pnpm创建的store目录下，默认情况下全局只会有一个store目录 .pnpm-store，所有的项目都共用这一目录下的硬链接

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MTBmYmJkNmExMzYwODA4MmNmNjc1ZGQzOTFiZWRmMThfSk94b0xsTWt0dEl5dmZ4cm5wNm1xeTZNVUEwWnRPQ3pfVG9rZW46WTdRdWJCbWJPb2EyUEJ4Nk5VQmNySjVHbllmXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

### node_modules

创建非扁平化的 node_modules 文件夹

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ODQ4ZTQ5MDAxNjJkODI5NDlhNTM3NTBlZDY4MzY0YzFfcU1Qazg3clVwZUdXNEVEWWpBNW4zTW55NlQ4UWpnRFBfVG9rZW46R1pHY2JEdWVnb2JJamx4Tk1ybmMwWWVHbnpiXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

npm/yarn 如今的安装的node_modules都是拍平的形式，而pnpm默认是不拍平的，这能解决【幽灵依赖】，如果想要继续使用拍平的方式，也支持配置.npmrc hoist = true

### workspace 支持

对于 monorepo 类型的项目，pnpm 提供了 workspace 来支持，而且比yarn workspace配置更简单，只需在项目根目录下创建一个 pnpm-workspace.yaml 文件。 具体可以参考[官网文档](https://pnpm.io/zh/workspaces)

## 痛点解决

---

1. ### 节约磁盘空间，提升安装速度
2. #### 装过的包都通过 hard links 存储在磁盘的 .pnpm-store 文件夹内，所有项目共用，相同的包直接复用

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=YTMzZjBkMzJkNTc3MzA2MzQ1ODU0MjAwY2E1OTQ1ZWRfdU1KZHhCUkVrWlNkeWg3N1BIQXVseVRiam13dEdqSHNfVG9rZW46Q0hxYWJOaWVkb3BpSzl4T0lLYmNRbjRMbldkXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

2. 不采用拍平的方式，绝不会下载重复的包
3. 当更新一个包时，如果原版本有100个文件，新版本只新增了1个文件，pnpm不会重新下载101个文件，而只是下载新增的1个文件
4. ### **NPM doppelgangers**

Npm doppelgangers，即npm包分身的问题

1. #### < npm3

node_modules采用循环链式依赖的方式进行安装，由此产生的问题：

依赖链路过长，大量重复安装的依赖

将npm切换到npm3之前，新建一个项目进行测试

配置该项目依赖两个包 fs-extra jsonfile

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MzFiYmU4N2M1NWY3YWZmN2ZhOGIxMGEyYWY1ZWNjOWRfcnY4ZjRMaG9Pck5vT1N4THRCd01yQjNSRUNuNjRpaFlfVG9rZW46VFBDbmJCSjhub0lEcEZ4T01TTGNTT1NzbjZkXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

执行 npm install 产生的 node_modules

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MmQwMWJkMjM1ZTdhNmJmYWY5NDRkODIwNmYwMzlkNWZfdU1lV1hlMjc2d0o2V05GaTNHc0JSQm80d1BNVDZjWk9fVG9rZW46VmdWOGIwTlhOb2plV2h4YUFxamNjdjd3bjBiXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

可以看到由于 fs-extra 和 jsonfile 都依赖了 graceful-fs universalify ，所以分别在两个依赖包下分别安装了一遍，这就是链式的循环依赖。

实际开发中项目依赖的包会很多，这样链式嵌套的情况会导致链路十分冗长，且重复安装的包特别多

2. #### >= npm3 / yarn

为了解决以上问题，npm3+和yarn 采用了拍平 node_modules 的方式进行安装

拍平后依赖链路不再嵌套，不会安装重复的包

下面是上一个项目，使用npm3+安装的 node_modules

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=MjYxMGMwMTQxYzQwMTcwZWE2NjA1MjEyZWFmMTkzZDhfRG1hR2MwQnZYUFdVSHJTanVGNE45WUJ3Z2hKU0w3S1RfVG9rZW46Rjc2T2IzaDlub2h0cGN4S3NKUWN0RG9rbk9oXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

但因此产生的新问题，[幽灵依赖](https://v5hhs75fgk.feishu.cn/docs/doccnUcxx6uyk402oE3E3iMIcbd#2YephB)

随着 monorepo 的趋势，yarn workspace 成为一种流行的实现方式，而这种和 npm3+ 相同的 node_modules 安装方式出现了新的问题，npm包分身

同样的，新建一个基于 yarn workspace 的 monorepo 项目进行测试

并创建4个工作区，分别让 package1 和 package2 依赖 fs-extra@9，package3 和 package4 依赖 fs-extra@10

在项目根目录执行 yarn 安装的 node_modules 如下

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=OTkwNTdjYzhkMTI4NmE1ZWU4MTYyZTYxMGJhN2FiYzlfRE1zMUN3d2NjNlZ0VlhVZjg0TjliS3p0dnBHU0VlS09fVG9rZW46SERJSGJYOGpYb2FmdDR4VlRnY2NPS1BObmplXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

3. #### pnpm

解决幽灵依赖，绝不会重复安装相同的包

每个workspace下都有自己的node_modules，里面只能访问到在 package.json 里显示声明的 fs-extra，而fs-extra软链接到 全局node_modules下对应版本的 fs-extra，没有任何一个包会安装多次

![](https://dfrtcthz8n.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGRjODRlZGI5Y2M4N2NiYmU1ZjRmNzNjM2Y3MThmNDhfbXZuYjVoQ25oaW1MUUt4alpZeUdaTXdIb3g0bDhRT0pfVG9rZW46WXgwSGI5SlY1bzRuNkV4eHZ5dWN4VEdSblVjXzE3Mzc2MTIzMzM6MTczNzYxNTkzM19WNA)

3. ### Phantom dependencies

Phantom dependencies 幽灵依赖，解释起来很简单，即某个包并没有在 package.json 中声明依赖，却能在项目中导入使用。

例如项目 project 在 pacakge.json 里只依赖了 packageA，而 packageA 本身依赖了 packageB

如果使用 npm/yarn 安装依赖， node_modules 下将会同时有 packageA 和 packageB，且 project 中可直接 import packageB

某天 packageA 不再依赖 packageB ，project使用packageB这种做法将会报错

这种幽灵依赖的做法在当前的开发环境下已是常见现象，而使用 pnpm ，node_modules不再拍平，将无法再使用幽灵依赖

## 使用指南

---

1. ### 安装pnpm

```Plain
npm install pnpm -g
```

2. ### 初始化pnpm项目

新建一个文件夹作为项目目录，在目录下执行指令（和 npm init 一致）

```Plain
pnpm init
```

3. ### 安装依赖

```Plain
pnpm install

pnpm add <package_name>
```

4. ### Workspace配置

在项目下创建一个工作区的文件夹，例如 packages

在根目录创建一个workspace配置文件 pnpm-workspace.yaml，写入：

```Plain
packages:

  # 所有在 packages 子目录下的 package

  - 'packages/**'

  # 不包括在 test 文件夹下的 package

  - '!**/test/**'
```

5. ### Monorepo常用指令

```Plain
安装依赖

pnpm add <package_name> --filter <workspace_name>



运行脚本

pnpm start --filter <workspace_name>



删除全局和每个workspace的node_modules

pnpm -r exec rm -rf node_modules
```

更多使用方式[查看官网](https://pnpm.io/zh/cli/add)

## 总结

pnpm 作为包管理器里面的“后起之秀”，通过作者别出心裁的设计方案，完美解决了许多了现有的包管理工具 npm、yarn 以及 node_modules 本身设计原因留下的痛点。

## 附录

[软链接&amp;硬链接在前端中的应用](https://juejin.cn/post/7047429181021356062)

[nodejs对于软硬链接的兼容](https://github.com/nodejs/node/discussions/37509)

[Benchmarks of JavaScript Package Managers](https://pnpm.io/zh/benchmarks)

[平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)

[基于符号链接的 node_modules 结构](https://pnpm.io/zh/symlinked-node-modules-structure)

[如何处理peers](https://pnpm.io/zh/how-peers-are-resolved)

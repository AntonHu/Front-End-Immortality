# SPA在微信分享中的路由问题

## 问题描述

> 在微信中使用一个SPA应用时，复制当前链接、分享好友或者朋友圈、以及在浏览器中打开，链接始终是初始进入的路由。

## 场景复现

你在微信中点击进入了一个SPA单页面：

www.baidu.com/main

当你做了一系列操作，路由跳转到了：

www.baidu.com/detail

点击右上角

![image-20250213213934459](https://image.antoncook.xyz/picGo/image-20250213213934459.png)

无论是复制链接，分享给好友还是朋友圈，或者在浏览器中打开，url始终是www.baidu.com/main。

不要慌，你的页面没有毛病，这是因为：

**微信浏览器对histroy的支持还不全面，只保存了第一条history记录**。

## 解决方案

### 微信jssdk

可以配置分享好友和朋友圈的链接，但是复制链接和浏览器中打开不行；

### history.replace

替换微信浏览器仅存的一条histroy记录为当前路由；

```JavaScript
/**
 * 在微信浏览器内只保存一条history记录，使用history.replace替换成当前路由
 * 增加一个标志参数，这样可以避免重复replace
 */
const wxRefresh = () => {
  const PARAM_NAME = 'wxReplaceTime'; // 新增的参数名
  const { protocol, host, pathname, hash, search } = window.location;
  if ( search.indexOf(PARAM_NAME) > -1 ) return; // 避免重复刷新，参数已存在
  const replaceQueryParam = ( paramName, newVale ) => {
    const reg = new RegExp(`([?;&])${paramName}[^&;]*[;&]?`);
    const query = search.replace(reg, '$1').replace(/&$/, '');
    return (query.length > 2 ? `${query}&` : '?') + (newVale ? `${paramName}=${newVale}` : '');
  };
  window.location.replace(
    `${protocol}//${host}${pathname}${replaceQueryParam(PARAM_NAME, new Date().getTime())}${hash}`
  );
};
```
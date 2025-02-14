# JS事件监听

## 事件

### 传播三阶段

- 捕获阶段： window-document-html-body-父节点-目标节点
- 目标阶段：目标节点触发事件
- 冒泡阶段：目标节点-父节点-body-html-document-window

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

`pageshow`事件在页面加载时触发，包括第一次加载和从缓存加载两种情况，第一次加载时，它的触发顺序排在`load`事件后面。从缓存加载时，`load`事件不会触发。

`pageshow`的`persisted`，页面第一次加载时，是`false`；从缓存加载时，是`true`。

`pagehide`事件，当用户通过“前进/后退”按钮，离开当前页面时触发。如果定义了`unload/beforeunload` 事件页面不会保存在缓存中，用`pagehide`事件，页面会保存在缓存中。 

`pagehide`的`persisted`，`true`表示页面要保存在缓存中；`false`表示网页不保存在缓存中，如果监听了unload事件，该函数将在 pagehide 事件后立即运行。

#### hashchange popstate

调用`history.pushState()`或`history.replaceState()`，并不会触发`popstate`事件。该事件只在用户在`history`记录之间显式切换时触发，比如鼠标点击“后退/前进”按钮，或者在脚本中调用`history.back()`、`history.forward()`、`history.go()`时触发。

### 网页状态

#### DOMContentLoaded

仅完成了DOM，其他样式资源可能未完成，load事件才是完全加载完成

#### readystatechange

`readystatechange`事件当 Document 对象和 XMLHttpRequest 对象的`readyState`属性发生变化时触发。`document.readyState`有三个可能的值：

- `loading`（网页正在加载）
- `interactive`（网页已经解析完成，但是外部资源仍然处在加载状态）
- `complete`（网页和所有外部资源已经结束加载，`load`事件即将触发）

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


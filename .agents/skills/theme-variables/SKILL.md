---
name: theme-variables
description: 指导在前端项目中正确使用 Ant Design 与自定义主题 CSS 变量，避免硬编码颜色并保证暗色/浅色主题切换一致性。当前端编写或修改样式时使用本技能。
---

# 主题 CSS 变量与样式规范

## 使用场景

当你在：

- 为组件/页面编写新的样式
- 修改已有样式以适配暗色/浅色主题

请使用本技能，并同时遵守 `.agents/rules/04-组件规范.md` 与 `.agents/rules/08-样式规范.md`。

---

## 基本原则

- 所有自定义样式必须使用 **CSS 变量** 表达主题相关的颜色与尺寸。
- 禁止硬编码主色、文本色、背景色等与主题相关的属性。

---

## 常用 Ant Design 主题变量

在 SCSS 中直接使用：

```scss
color: var(--ant-color-text);
background-color: var(--ant-color-bg-container);
border-color: var(--ant-color-border);
```

常见变量举例：

- 主色：`var(--ant-color-primary)`
- 文本色：`var(--ant-color-text)`
- 容器背景：`var(--ant-color-bg-container)`
- 边框色：`var(--ant-color-border)`

---

## 自定义主题变量示例

项目中可以定义自有变量，例如：

- `var(--shentu-card-bg)`
- `var(--shentu-border-radius)`
- `var(--shentu-cn-family)`

在组件样式中的使用：

```scss
.card {
  background-color: var(--shentu-card-bg);
  border-radius: var(--shentu-border-radius);
  font-family: var(--shentu-cn-family);
}
```

---

## 反例（不要这样写）

```scss
// ❌ 硬编码颜色，不随主题变化
.button {
  background-color: #1677ff;
  color: #ffffff;
}
```

---

## 快速检查清单

- [ ] 所有颜色是否都来自 `var(--xxx)` 变量？
- [ ] 是否优先使用 Antd 自带变量，其次再用自定义变量？
- [ ] 是否避免在组件/页面样式中写死颜色值？


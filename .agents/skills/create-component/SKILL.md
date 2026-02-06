---
name: create-component
description: 指导在前端项目中按团队规范创建和拆分 React 组件，包括目录结构、文件命名、样式与主题变量使用。当前端需要新增或重构组件时使用本技能。
---

# 创建与拆分组件

## 使用场景

当你需要：

- 新增一个**可复用通用组件**
- 为某个页面新增**页面级组件**
- 拆分过大的页面/组件文件

请使用本技能，并同时遵守 `.agents/rules/03-项目结构.md` 与 `.agents/rules/04-组件规范.md`。

---

## 组件放在哪里？

详见 `.agents/rules/04-组件规范.md` 中的"组件放置决策树"。

- **通用组件**（跨页面复用）：`src/components/<component-name>/`
- **页面级组件**（只在单页使用）：`src/routes/<route>/components/`

命名约定：

- 目录名：`kebab-case`，例如 `error-boundary`
- React 组件名：`PascalCase`，例如 `ErrorBoundary`

---

## 标准目录结构

通用组件示例：

```text
src/components/shentu-button/
  ├─ index.tsx
  └─ index.module.scss
```

页面级组件示例：

```text
src/routes/home/components/header/
  ├─ index.tsx
  └─ index.module.scss
```

---

## 步骤 1：创建组件骨架

```tsx
// src/components/shentu-button/index.tsx
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface ShentuButtonProps {
  onClick: () => void;
  className?: string;
}

export const ShentuButton: React.FC<ShentuButtonProps> = ({onClick, className, children}) => {
  return (
    <button
      type="button"
      className={classNames(styles.shentuButton, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

并在 `src/components/index.ts` 中集中导出：

```ts
// src/components/index.ts
export * from './shentu-button';
```

---

## 步骤 2：样式与主题变量

在 `index.module.scss` 中：

```scss
// src/components/shentu-button/index.module.scss
.shentuButton {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  // 必须使用主题变量，禁止硬编码主色
  background-color: var(--ant-color-primary);
  color: var(--ant-color-text);
}
```

**原则：**

- 必须使用 SCSS Modules：`index.module.scss`
- 自定义颜色必须使用主题 CSS 变量：
  - Ant Design 变量：`var(--ant-color-primary)`、`var(--ant-color-text)` 等
  - 自定义变量：`var(--shentu-card-bg)`、`var(--shentu-border-radius)` 等
- 禁止在组件样式中直接硬编码主色，如 `#1677ff`。

**样式还原检查**：涉及 UI 还原的组件样式开发，请参考 `.agents/skills/create-proposal/SKILL.md` 中的「样式还原验证检查清单」及对应页面的 `docs/样式还原/<名称>-UI分析清单.md`。

---

## 步骤 3：组件职责与拆分

- 单个 `.tsx` 文件建议不超过 **400 行**，超过时优先考虑拆分为子组件。
- 拆分时遵循：
  - **页面级组件**：只在一个路由使用 → 放在该路由的 `components/` 下。
  - **通用组件**：在多个路由使用 → 提取到 `src/components`。
- 一个组件应聚焦单一职责（一个明确的 UI 区块或交互单元）。

---

## 步骤 4：与 Ant Design 协同

通用交互控件应基于 Antd 进行二次封装：

```tsx
import React from 'react';
import {Button, ButtonProps} from 'antd';

type ShentuButtonProps = ButtonProps & {
  // 可以扩展一些自定义属性
};

export const ShentuButton: React.FC<ShentuButtonProps> = (props) => {
  return <Button type="primary" {...props} />;
};
```

---

## 快速检查清单

- [ ] 组件目录是否放在了正确位置（通用 vs 页面级）？
- [ ] 是否使用了 `index.tsx + index.module.scss` 的结构？
- [ ] 是否通过 `src/components/index.ts` 集中导出通用组件？
- [ ] 样式是否全部使用 SCSS Modules，且颜色使用主题变量？
- [ ] 组件文件是否过大，是否需要拆分子组件？

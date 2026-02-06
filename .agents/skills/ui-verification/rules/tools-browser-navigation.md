---
title: 浏览器工具打开页面指南
impact: HIGH
impactDescription: 使用浏览器工具查看实际页面效果
tags: tools, browser, navigation, playwright, cursor
---

## 浏览器工具打开页面指南

**核心原则**：验收必须以「实际页面效果 vs 设计稿」为准，必须使用浏览器工具查看目标页面。

### 在 Cursor 中优先使用 `@Browser`

**操作步骤**：
1. 使用 Browser 的导航（如 `browser_navigate`）前往目标 URL（例如 `http://localhost:5222/craft-sheet`）
2. 等待页面加载完成
3. 确认页面已加载完成、无报错，能够看到需要验收的区域

**工具说明**：
- **Browser**（@Browser，Cursor 专用）：在 Cursor IDE 中可用于打开目标页面、截取页面截图、获取页面快照（DOM/元素）等；**在 Cursor 中优先使用**。

### 仅当不在 Cursor 或 Browser 不可用时，使用 Playwright MCP

**操作步骤**：
1. 调用 Playwright MCP 提供的导航工具（如 `browser_navigate`）前往目标 URL
2. 等待页面加载完成

**工具说明**：
- **Playwright MCP**：用于在任何支持 MCP 的环境中打开目标页面、截图（整页或元素）、获取页面快照（如可访问性树）、查找元素并执行点击/输入/滚动/表单提交等交互；也可在需要时配合设置 cookies/localStorage 或模拟登录来访问受保护页面。**仅当不在 Cursor 或 Browser 不可用时使用**。

### 获取实际页面的可比对信息

**截图比对**：
- 在 Cursor 中优先用 Browser 的 `browser_take_screenshot` 对目标页面（或关键区域）截图
- 无 Browser 时用 Playwright MCP 的截图工具
- 用途：与设计稿同区域截图并排对比

**元素/快照比对**：
- 在 Cursor 中优先用 Browser 的 `browser_snapshot` 获取页面结构、元素位置与尺寸
- 无 Browser 时用 Playwright MCP 的快照/可访问性树工具
- 用途：与设计稿（.pen/Figma）中对应节点坐标、尺寸、样式逐项对比

**建议**：先做**整体或分区域截图**，与设计稿截图对比，发现差异后再用**元素快照**精确定位（如某块 padding、某字体大小）。

**验收时检查**：
- [ ] **按钮高度、宽度**：必须用浏览器工具实际查看渲染效果，不能仅凭代码推测
- [ ] **对齐效果**：必须用浏览器查看实际对齐效果
- [ ] **hover/active 状态**：必须用浏览器实际触发查看
- [ ] **响应式表现**：必须用浏览器在不同视口下查看

**相关规则**：
- `errors-button-dimensions.md` - 按钮尺寸问题
- `tools-design-guidelines.md` - 设计稿工具使用指南

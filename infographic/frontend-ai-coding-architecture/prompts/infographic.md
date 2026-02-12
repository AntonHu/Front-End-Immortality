Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: hub-spoke
- **Style**: technical-schematic
- **Aspect Ratio**: landscape (16:9)
- **Language**: zh

## Core Principles

- Follow the layout structure precisely for information architecture
- Apply style aesthetics consistently throughout
- If content involves sensitive or copyrighted figures, create stylistically similar alternatives
- Keep information concise, highlight keywords and core concepts
- Use ample whitespace for visual clarity
- Maintain clear visual hierarchy

## Text Requirements

- All text must match the specified style treatment
- Main titles should be prominent and readable
- Key concepts should be visually emphasized
- Labels should be clear and appropriately sized
- Use the specified language for all text content

## Layout Guidelines

### Hub-Spoke Layout Structure

- **Central Hub**: "AI Coding 架构" - This is the main concept, prominently displayed in the center
- **Four Spokes**: Radiating outward from the center hub, evenly distributed:
  1. **SDD** (top-right quadrant) - 开发流程控制
  2. **MCP** (bottom-right quadrant) - 外部能力对接
  3. **Rules** (bottom-left quadrant) - 规范与约束
  4. **Skills** (top-left quadrant) - 实践技能
- **Spoke Lines**: Clear connection lines from center hub to each component node
- **Node Styling**: Each component node should be visually distinct with icons or geometric shapes
- **Optional Secondary Elements**: 
  - Development workflow (7 steps) can be shown as a linear progression below or around the hub-spoke structure
  - Multi-Agent support can be shown as a directory structure diagram

### Visual Hierarchy

- Central hub should be largest and most prominent
- Component nodes should be clearly visible but secondary to the hub
- Supporting information (workflow, directory structure) should be tertiary

## Style Guidelines

### Technical-Schematic Style

**Color Palette**:
- Primary: Blues (#2563EB), teals, grays, white lines
- Background: Deep blue (#1E3A5F), white, or light gray with grid
- Accents: Amber highlights (#F59E0B), cyan callouts

**Visual Elements**:
- Geometric precision throughout
- Grid pattern or technical grid background
- Clean vector shapes with consistent stroke weights
- Technical symbols and annotations
- Dimension lines and measurements where appropriate
- Blueprint-style aesthetic with engineering precision

**Typography**:
- Technical stencil or clean sans-serif font
- All-caps labels for component names
- Clear, readable Chinese text for descriptions
- Floating labels for annotations
- Bold headings for main sections

**Style Enforcement**:
- Maintain technical/engineering diagram aesthetic
- Use geometric shapes, not organic forms
- Clean lines, no decorative elements
- Professional and precise appearance

---

Generate the infographic based on the content below:

## Content Structure

### Central Hub: AI Coding 架构体系

**Core Concept**: 四个核心组件（SDD、MCP、Rules、Skills）协同工作，形成稳定可演进的 AI Coding 底座。

**Key Message**: 
- Rules 管「怎么才算对」，Skills 管「怎么一步步做」，MCP 让 Agent 能看到真实世界，而 SDD 负责记录「这次为什么要改、应该改成什么样」并把每次变更沉淀成新的真相
- 四者合在一起，才是真正稳定可演进的 AI Coding 底座
- 落地效果：前端页面可以做到 90% 还原设计稿，需求实现更准确，代码风格一致，结构设计合理

### Spoke 1: SDD - 开发流程控制

**Key Concept**: Specification-Driven Development，用规范驱动开发，保证需求不遗漏，开发不脱节。

**Core Points**:
- 先写 spec 再写代码：任何需求或变更，先写清楚需求，「现在是怎样 → 期望变成怎样」，再开干
- 变更可追踪：变更以「提案 + 任务 + spec 增量」管理，实施完归档
- 验收有据可依：验收按 spec 来，而不是「感觉差不多」
- 三个作用：需求/变更收敛、开发执行对齐、验收与归档

**Visual**: Process flow diagram showing: 需求输入 → 创建提案 → 实施任务 → 验收归档

### Spoke 2: MCP - 外部能力对接

**Key Concept**: Model Context Protocol，让模型能安全、结构化地调用外部能力。

**Core Points**:
- 设计稿类：Pencil（.pen 设计稿，效果优于 Figma MCP）、Figma
- 浏览器类：Cursor IDE Browser（Cursor 内优先）、Playwright
- 接口与文档类：ApiFox（OAS 接口定义）、Context7（主流库最新文档）

**Visual**: Three categories with icons: 设计稿类 | 浏览器类 | 接口文档类

### Spoke 3: Rules - 规范与约束

**Key Concept**: 约定「做什么、不做什么」，保证 AI 遵循项目结构、规范约束、代码风格。

**Core Points**:
- 演进历程：大文件 → 模块拆分（01～11）→ 与 Skills 分离
- 11 个规范模块：项目概述、编码规范、项目结构、组件规范、API规范、路由规范、状态管理、通用约束、样式规范、文档规范、测试规范

**Visual**: Grid/list showing 11 rule modules with numbers and names

### Spoke 4: Skills - 实践技能

**Key Concept**: 约定「怎么做」，渐进披露按需指导 AI 完成具体任务。

**Core Points**:
- 开源 Skills：vercel-react-best-practices、vercel-composition-patterns、web-design-guidelines、find-skills、skill-creator
- 自封装 Skills：create-proposal、design-analysis、ui-verification、create-route、create-component、create-api、create-store、theme-variables
- 作用：创建提案、设计稿分析、页面/UI 开发、UI 验收、业务开发/联调

**Visual**: Two categories: 开源 Skills | 自封装 Skills

### Supporting Information: 完整开发流程

**7 Steps**:
1. 需求输入
2. 设计稿分析
3. 创建提案
4. 页面/UI 开发
5. UI 验收
6. 业务开发与联调
7. 归档

**Visual**: Linear progression flow with numbered steps and arrows

### Supporting Information: 多 Agent 支持

**Key Concept**: 只维护一份，所有 Agent 共用。

**Core Points**:
- 适用所有支持 skills/mcp 的 Agent
- 维护 `.agents` 一份，各 Agent 目录（.cursor、.claude、.opencode、.agent、.trae）软链接指向 `.agents`

**Visual**: Directory structure diagram showing .agents as root with soft links

---

Text labels (in zh):

## Main Title
前端 AI Coding 架构体系

## Central Hub
AI Coding 架构

## Component Labels
- SDD
- MCP
- Rules
- Skills

## Component Subtitles
- SDD: 开发流程控制
- MCP: 外部能力对接
- Rules: 规范与约束
- Skills: 实践技能

## Key Points (for each component)

### SDD
- 先写 spec 再写代码
- 变更可追踪
- 验收有据可依

### MCP
- 设计稿类：Pencil、Figma
- 浏览器类：Cursor IDE Browser、Playwright
- 接口文档类：ApiFox、Context7

### Rules
- 11 个规范模块
- 约定「做什么、不做什么」

### Skills
- 开源 Skills（5个）
- 自封装 Skills（两类）
- 约定「怎么做」

## Development Workflow Labels
1. 需求输入
2. 设计稿分析
3. 创建提案
4. 页面/UI 开发
5. UI 验收
6. 业务开发与联调
7. 归档

## Multi-Agent Support
- 只维护一份，所有 Agent 共用
- .agents/ (root)
- .cursor/ → .agents
- .claude/ → .agents
- .opencode/ → .agents
- .agent/ → .agents
- .trae/ → .agents

## Key Metrics
- 90% 还原设计稿
- 需求实现更准确
- 代码风格一致
- 结构设计合理

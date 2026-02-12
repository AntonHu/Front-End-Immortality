# 前端 AI Coding 架构体系

## Overview

一套以规范、能力扩展和流程为主线的前端 AI Coding 架构，通过 SDD、MCP、Rules、Skills 四个核心组件协同工作，实现 90% 还原设计稿、需求实现更准确、代码风格一致、结构设计合理的开发效果。

## Learning Objectives

The viewer will understand:
1. 前端 AI Coding 架构的四个核心组件（SDD、MCP、Rules、Skills）及其作用
2. 从需求到归档的完整开发流程链路
3. 如何配置和使用这套架构体系

---

## Section 1: 架构核心 - AI Coding 架构体系

**Key Concept**: 四个核心组件（SDD、MCP、Rules、Skills）协同工作，形成稳定可演进的 AI Coding 底座。

**Content**:
- Rules 管「怎么才算对」，Skills 管「怎么一步步做」，MCP 让 Agent 能看到真实世界，而 SDD 负责记录「这次为什么要改、应该改成什么样」并把每次变更沉淀成新的真相
- 四者合在一起，才是真正稳定可演进的 AI Coding 底座
- 落地之后最直观的效果是：前端页面可以做到 90% 还原设计稿，需求实现更准确，代码风格一致，结构设计合理

**Visual Element**:
- Type: central hub illustration
- Subject: AI Coding 架构作为中心，四个组件围绕
- Treatment: 中心突出显示"AI Coding 架构"，四个组件用不同颜色/图标表示，用连接线连接到中心

**Text Labels**:
- Headline: "前端 AI Coding 架构体系"
- Center label: "AI Coding 架构"
- Component labels: "SDD", "MCP", "Rules", "Skills"

---

## Section 2: SDD - 开发流程控制

**Key Concept**: Specification-Driven Development，用规范驱动开发，保证需求不遗漏，开发不脱节。

**Content**:
- 先写 spec 再写代码：任何需求或变更，先写清楚需求，「现在是怎样 → 期望变成怎样」，再开干
- 变更可追踪：变更以「提案 + 任务 + spec 增量」管理，实施完归档，可回溯是谁、什么时候、为什么改了什么
- 验收有据可依：验收按 spec 来，而不是「感觉差不多」
- OpenSpec 在这套架构里的三个作用：需求/变更收敛、开发执行对齐、验收与归档

**Visual Element**:
- Type: process flow diagram
- Subject: SDD 工作流程（proposal → tasks → spec → archive）
- Treatment: 流程图形式，展示从需求到归档的步骤

**Text Labels**:
- Headline: "SDD - 开发流程控制"
- Step labels: "需求输入", "创建提案", "实施任务", "验收归档"
- Key point: "先写 spec 再写代码"

---

## Section 3: MCP - 外部能力对接

**Key Concept**: Model Context Protocol，让模型能安全、结构化地调用外部能力。

**Content**:
- 设计稿类：Pencil（.pen 设计稿，效果优于 Figma MCP）、Figma（Figma 链接）
- 浏览器类：Cursor IDE Browser（Cursor 内优先，效果优于 Playwright）、Playwright（脚本化验收）
- 接口与文档类：ApiFox（OAS 接口定义）、Context7（主流库最新文档与示例注入）
- Pencil MCP 在「设计稿分析」环节作为主数据源，效果明显好于 Figma MCP

**Visual Element**:
- Type: categorized icons/groups
- Subject: 三类 MCP 工具（设计稿类、浏览器类、接口文档类）
- Treatment: 三个分组，每个分组内显示对应的工具图标和名称

**Text Labels**:
- Headline: "MCP - 外部能力对接"
- Category labels: "设计稿类", "浏览器类", "接口文档类"
- Tool labels: "Pencil", "Figma", "Cursor IDE Browser", "Playwright", "ApiFox", "Context7"

---

## Section 4: Rules - 规范与约束

**Key Concept**: 约定「做什么、不做什么」，保证 AI 遵循项目结构、规范约束、代码风格。

**Content**:
- 实践中的演进历程：最初是一整个大 Rule.md → 按模块拆成多份（01～11）→ Skills 加入后，Rules 只保留原则与约束
- 项目级 Rules 清单：11 个规范文件（项目概述、编码规范、项目结构、组件规范、API规范、路由规范、状态管理、通用约束、样式规范、文档规范、测试规范）
- Rules 目录下的 README 清晰的介绍了各个 rule 的作用和使用时机

**Visual Element**:
- Type: list/grid of rule modules
- Subject: 11 个规范模块
- Treatment: 网格或列表形式展示各个规范模块，每个模块有图标和名称

**Text Labels**:
- Headline: "Rules - 规范与约束"
- Subhead: "约定「做什么、不做什么」"
- Module labels: "01-项目概述", "02-编码规范", "03-项目结构", "04-组件规范", "05-API规范", "06-路由规范", "07-状态管理", "08-通用约束", "09-样式规范", "10-文档规范", "11-测试规范"

---

## Section 5: Skills - 实践技能

**Key Concept**: 约定「怎么做」，渐进披露按需指导 AI 完成具体任务。

**Content**:
- 开源 Skills：vercel-react-best-practices、vercel-composition-patterns、web-design-guidelines、find-skills、skill-creator
- 自封装 Skills 两类：从 Rules「怎么做」拆出来的（create-route、create-component、create-api、create-store、theme-variables）；可复用的流程（create-proposal、design-analysis、ui-verification）
- Skills 在 AI Coding 过程中发挥的作用：创建提案、设计稿分析、页面/UI 开发、UI 验收、业务开发/联调

**Visual Element**:
- Type: categorized list
- Subject: 开源 Skills 和自封装 Skills 的分类展示
- Treatment: 两个分组，开源 Skills 和自封装 Skills，每个技能用图标或标签表示

**Text Labels**:
- Headline: "Skills - 实践技能"
- Subhead: "约定「怎么做」"
- Category labels: "开源 Skills", "自封装 Skills"
- Skill labels: "create-proposal", "design-analysis", "ui-verification", "create-route", "create-component", "create-api", "create-store", "theme-variables"

---

## Section 6: 完整开发流程

**Key Concept**: 从需求到归档的 7 步完整链路，四组件协同工作。

**Content**:
1. 需求输入：明确是否有设计稿、是否有接口、交付形态
2. 设计稿分析（有稿时）：用 Pencil（或 Figma）MCP 读稿 → 执行 design-analysis 技能 → 产出 UI 分析清单
3. 创建提案：执行 create-proposal，产出 SDD 的 proposal、tasks、spec 增量
4. 页面/UI 开发：按 tasks 顺序做；读 Rules + Skills；依据 UI 分析清单还原布局与样式
5. UI 验收：用 Cursor IDE Browser 打开实现页，执行 ui-verification，与设计稿或分析清单比对
6. 业务开发与联调：Rules（API、状态、通用约束）+ create-api、create-store
7. 归档：tasks 全部勾选后执行 SDD archive，更新 specs

**Visual Element**:
- Type: linear progression flow
- Subject: 7 步开发流程
- Treatment: 水平或垂直流程图，每个步骤用编号和图标表示，步骤间用箭头连接

**Text Labels**:
- Headline: "完整开发流程"
- Step labels: "1. 需求输入", "2. 设计稿分析", "3. 创建提案", "4. 页面/UI 开发", "5. UI 验收", "6. 业务开发与联调", "7. 归档"

---

## Section 7: 多 Agent 支持

**Key Concept**: 只维护一份，所有 Agent 共用。

**Content**:
- 适用所有支持 skills/mcp 的 Agent
- 在项目根目录创建 `.agents`，下面放 `rules` 和 `skills`
- 各 Agent 配置：Cursor（`.cursor`）、Claude（`.claude`）、OpenCode（`.opencode`）、Gemini（`.agent`）、Trae（`.trae`）
- 各 Agent 目录下的 `rules`、`skills` 用软链接指到 `.agents/rules`、`.agents/skills`
- 这样只需维护 `.agents` 一份，即可同时支持上述所有 Agent

**Visual Element**:
- Type: directory structure diagram
- Subject: 项目目录结构，展示 .agents 和各 Agent 目录的关系
- Treatment: 树状结构图，.agents 作为根，各 Agent 目录通过软链接指向 .agents

**Text Labels**:
- Headline: "多 Agent 支持"
- Subhead: "只维护一份，所有 Agent 共用"
- Directory labels: ".agents/", ".cursor/", ".claude/", ".opencode/", ".agent/", ".trae/"

---

## Data Points (Verbatim)

All statistics, numbers, and quotes exactly as they appear in source:

### Key Metrics
- "前端页面可以做到 90% 还原设计稿，需求实现更准确，代码风格一致，结构设计合理"

### Core Principles
- "Rules 管「怎么才算对」，Skills 管「怎么一步步做」，MCP 让 Agent 能看到真实世界，而 SDD 负责记录「这次为什么要改、应该改成什么样」并把每次变更沉淀成新的真相"
- "只维护一份，所有 Agent 共用"
- "适用所有支持 skills/mcp 的 Agent"

### Process Steps
- 开发流程 7 个步骤：需求输入 → 设计稿分析 → 创建提案 → 页面/UI 开发 → UI 验收 → 业务开发与联调 → 归档

### Component Counts
- SDD 三个作用：需求/变更收敛、开发执行对齐、验收与归档
- MCP 三类：设计稿类、浏览器类、接口与文档类
- Rules 11 个规范模块
- Skills：开源 Skills（5个）+ 自封装 Skills（两类）

---

## Design Instructions

Extracted from user's steering prompt:

### Style Preferences
- 无特殊风格偏好，使用技术架构图风格

### Layout Preferences
- 中心辐射布局展示四个核心组件的关系

### Other Requirements
- 保持专业性和可读性
- 突出四个核心组件和开发流程

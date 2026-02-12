---
title: "前端 AI Coding 落地指南（一）架构篇"
topic: "technical"
data_type: "system-architecture"
complexity: "moderate"
point_count: 7
source_language: "zh"
user_language: "zh"
---

## Main Topic

一套以规范、能力扩展和流程为主线的前端 AI Coding 架构体系，通过 SDD、MCP、Rules、Skills 四个核心组件，实现 90% 还原设计稿、需求实现更准确、代码风格一致、结构设计合理的开发效果。

## Learning Objectives

After viewing this infographic, the viewer should understand:
1. 前端 AI Coding 架构的四个核心组件（SDD、MCP、Rules、Skills）及其作用
2. 从需求到归档的完整开发流程链路
3. 如何配置和使用这套架构体系

## Target Audience

- **Knowledge Level**: Intermediate（有一定前端开发经验，了解 AI 辅助开发）
- **Context**: 希望提升 AI Coding 效率和质量，减少返工和风格不一致问题
- **Expectations**: 了解如何搭建一套稳定可演进的 AI Coding 架构体系

## Content Type Analysis

- **Data Structure**: 中心辐射型架构（四个核心组件围绕 AI Coding 流程）
- **Key Relationships**: 
  - SDD 负责流程控制和变更追踪
  - MCP 提供外部能力对接
  - Rules 定义规范和约束
  - Skills 提供具体实施步骤
  - 四者协同工作形成完整闭环
- **Visual Opportunities**: 
  - 中心：AI Coding 架构
  - 四个核心组件围绕中心
  - 开发流程链路可视化
  - 各组件的作用和关系用连接线表示

## Key Data Points (Verbatim)

- "前端页面可以做到 90% 还原设计稿，需求实现更准确，代码风格一致，结构设计合理"
- "Rules 管「怎么才算对」，Skills 管「怎么一步步做」，MCP 让 Agent 能看到真实世界，而 SDD 负责记录「这次为什么要改、应该改成什么样」并把每次变更沉淀成新的真相"
- "只维护一份，所有 Agent 共用"
- "适用所有支持 skills/mcp 的 Agent"
- 开发流程 7 个步骤：需求输入 → 设计稿分析 → 创建提案 → 页面/UI 开发 → UI 验收 → 业务开发与联调 → 归档
- SDD 三个作用：需求/变更收敛、开发执行对齐、验收与归档
- MCP 类型：设计稿类（Pencil、Figma）、浏览器类（Cursor IDE Browser、Playwright）、接口与文档类（ApiFox、Context7）
- Rules 演进：大文件 → 模块拆分 → 与 Skills 分离
- Skills 分类：开源 Skills（5个）+ 自封装 Skills（两类）

## Layout × Style Signals

- Content type: system-architecture → suggests hub-spoke（中心辐射，展示四个核心组件围绕架构）
- Tone: technical → suggests technical-schematic（技术架构图风格）
- Audience: intermediate developers → suggests corporate-memphis（专业但友好的风格）
- Complexity: moderate → suggests balanced layout with clear sections

## Design Instructions (from user input)

无特殊设计指令，使用默认推荐组合。

## Recommended Combinations

1. **hub-spoke + technical-schematic** (Recommended): 中心辐射布局完美展示四个核心组件（SDD、MCP、Rules、Skills）围绕 AI Coding 架构的关系，技术架构图风格符合技术文档的专业性
2. **hub-spoke + corporate-memphis**: 中心辐射布局展示架构关系，企业级扁平风格更友好易读
3. **hierarchical-layers + technical-schematic**: 分层布局展示架构的层次关系，技术风格保持专业性

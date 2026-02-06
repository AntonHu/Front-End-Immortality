# 项目上下文

## 项目概述

一个基于 React + TypeScript 的单页应用（SPA）。

## 技能与规范

本项目定义了两层指导体系，统一存放在 `.agents/` 目录下。

### `.agents/rules/` - 开发规范

规范文件包含项目开发的核心规则，不会自动加载。当需要确认规范时，主动读取对应文件：

| 文件             | 何时读取                   |
| ---------------- | -------------------------- |
| `01-项目概述.md` | 需要了解项目背景、技术栈时 |
| `02-编码规范.md` | 编写或审查代码时           |
| `03-项目结构.md` | 确定代码应放在哪个目录时   |
| `04-组件规范.md` | 创建或拆分组件时           |
| `05-API规范.md`  | 新增或修改接口时           |
| `06-路由规范.md` | 新增页面或配置路由时       |
| `07-状态管理.md` | 新增或重构状态管理时       |
| `08-通用约束.md` | 确认通用约束时             |
| `09-样式规范.md` | 编写组件样式或主题适配时   |
| `10-文档规范.md` | 编写或审查代码注释时       |
| `11-测试规范.md` | 确认测试要求时             |

### `.agents/skills/` - 实践技能

技能文件包含具体落地步骤与示例代码，按需读取：

| 场景              | 技能文件                                   |
| ----------------- | ------------------------------------------ |
| 创建提案时        | `.agents/skills/create-proposal/SKILL.md`  |
| 新增接口          | `.agents/skills/create-api/SKILL.md`       |
| 创建/拆分组件     | `.agents/skills/create-component/SKILL.md` |
| 新增页面路由      | `.agents/skills/create-route/SKILL.md`     |
| 新增全局状态      | `.agents/skills/create-store/SKILL.md`     |
| 编写样式/主题适配 | `.agents/skills/theme-variables/SKILL.md`  |

技能索引文件：`.agents/skills/README.md`

# 前端 AI Coding 架构体系 - 信息图生成总结

## 生成信息

- **主题**: 前端 AI Coding 落地指南（一）架构篇
- **布局**: hub-spoke（中心辐射）
- **风格**: technical-schematic（技术架构图）
- **宽高比**: landscape (16:9)
- **语言**: 中文 (zh)

## 输出文件

所有文件已保存在 `infographic/frontend-ai-coding-architecture/` 目录下：

```
infographic/frontend-ai-coding-architecture/
├── source-frontend-ai-coding-architecture.md  # 源文档
├── analysis.md                                 # 内容分析
├── structured-content.md                       # 结构化内容
├── prompts/
│   └── infographic.md                         # 图片生成提示词
└── infographic.png                            # 信息图（待生成）
```

## 内容结构

### 中心 Hub
**AI Coding 架构** - 四个核心组件协同工作的架构体系

### 四个核心组件（Spokes）

1. **SDD - 开发流程控制**
   - 先写 spec 再写代码
   - 变更可追踪
   - 验收有据可依
   - 三个作用：需求/变更收敛、开发执行对齐、验收与归档

2. **MCP - 外部能力对接**
   - 设计稿类：Pencil、Figma
   - 浏览器类：Cursor IDE Browser、Playwright
   - 接口文档类：ApiFox、Context7

3. **Rules - 规范与约束**
   - 11 个规范模块
   - 约定「做什么、不做什么」

4. **Skills - 实践技能**
   - 开源 Skills（5个）
   - 自封装 Skills（两类）
   - 约定「怎么做」

### 支持信息

- **完整开发流程**: 7 步流程（需求输入 → 设计稿分析 → 创建提案 → 页面/UI 开发 → UI 验收 → 业务开发与联调 → 归档）
- **多 Agent 支持**: 只维护一份，所有 Agent 共用

## 关键数据点

- **90% 还原设计稿**
- 需求实现更准确
- 代码风格一致
- 结构设计合理

## 图片生成

**状态**: 待生成

**生成命令**:
```bash
cd /Users/zjsf/personal/project/Front-End-Immortality
npx -y bun .agents/skills/baoyu-image-gen/scripts/main.ts \
  --promptfiles infographic/frontend-ai-coding-architecture/prompts/infographic.md \
  --image infographic/frontend-ai-coding-architecture/infographic.png \
  --ar 16:9
```

**前置要求**:
需要配置 API key（以下任一）：
- `GOOGLE_API_KEY` 或 `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `DASHSCOPE_API_KEY`

配置方式：
1. 创建 `~/.baoyu-skills/.env` 或 `<项目根目录>/.baoyu-skills/.env`
2. 添加对应的 API key

## 设计说明

### 布局结构
- **中心 Hub**: "AI Coding 架构" 作为核心概念
- **四个 Spokes**: SDD、MCP、Rules、Skills 均匀分布在四个象限
- **支持信息**: 开发流程和多 Agent 支持信息作为辅助展示

### 视觉风格
- **颜色**: 深蓝色背景 (#1E3A5F) 带网格图案
- **主色调**: 蓝色 (#2563EB)、青色
- **强调色**: 琥珀色高亮 (#F59E0B)
- **风格**: 技术蓝图风格，几何精确，工程精度

### 文本要求
- 所有文本使用中文
- 主标题："前端 AI Coding 架构体系"
- 组件标签：SDD、MCP、Rules、Skills
- 关键指标突出显示

## 下一步

1. 配置 API key
2. 执行图片生成命令
3. 查看生成的信息图
4. 如需调整，修改 `prompts/infographic.md` 后重新生成

---
name: project-skills-index
description: 项目的本地技能索引，帮助 Agent 在具体开发场景下选择合适的技能文件。
---

# 项目技能索引

项目在 `.agents/skills` 下定义了一些与 RULE 配套的技能，用于承载**具体实践步骤与示例代码**，避免在 RULE 中塞入过多细节。

## 当前技能列表

### 内容创作类

- `write-blog`：编写技术实践博客（配合 `博客书写规范` 使用）
- `baoyu-comic`：知识漫画创作，支持多种艺术风格和色调
- `baoyu-slide-deck`：专业幻灯片生成，从内容生成演示文稿图片

### 图片生成与处理类

- `baoyu-image-gen`：AI 图片生成，支持 OpenAI、Google、DashScope 等 API
- `baoyu-cover-image`：文章封面图生成，支持 5 维定制（类型、调色板、渲染、文本、情绪）
- `baoyu-article-illustrator`：文章配图，分析文章结构并生成配套插图
- `baoyu-infographic`：专业信息图生成，支持 20 种布局类型和 17 种视觉风格
- `baoyu-xhs-images`：小红书图片生成，将内容拆分为 1-10 张卡通风格图片
- `baoyu-compress-image`：图片压缩，支持 WebP 和 PNG 格式

### 内容转换类

- `baoyu-markdown-to-html`：Markdown 转 HTML，支持代码高亮、数学公式、PlantUML 等
- `baoyu-format-markdown`：Markdown 格式化，优化文章结构和排版
- `baoyu-url-to-markdown`：网页转 Markdown，使用 Chrome CDP 抓取并转换
- `baoyu-danger-x-to-markdown`：X (Twitter) 内容转 Markdown，支持推文和长文

### 内容发布类

- `baoyu-post-to-wechat`：发布到微信公众号，支持文章和图文消息
- `baoyu-post-to-x`：发布到 X (Twitter)，支持常规推文和长文

### 工具类

- `baoyu-danger-gemini-web`：Gemini Web API 客户端，支持文本和图片生成
- `release-skills`：通用发布工作流，自动检测版本文件和更新日志

---

后续如有新的实践场景，也建议以新的技能目录形式补充到本目录中。

---
alwaysApply: false
description: 项目的 API 规范，包括接口请求封装、函数命名约定、错误处理原则。当新增或修改接口时读取此规则。
---

# API 规范

## 接口请求规范

- 接口请求必须使用 `src/http` 目录下的请求函数
- 使用 `@shentu/request` 的 `ShenTuHttpClient` 进行请求封装
- 所有接口集中在 `src/http/<Name>.ts` 文件中
- 使用 TS 类型定义 Params/Body/Response，放在 `src/interfaces/<Name>/api.ts` 下
- 接口基于 Token 认证，统一使用 shentuHttpClient 的 auth 配置

如需查看完整示例与落地步骤，请使用技能文件：

- `.agents/skills/create-api/SKILL.md`

## 接口函数命名（NON-NEGOTIABLE）

| 操作 | 命名规则 | 示例 |
|---|----|---|
| 获取列表 | getXxxList | `getBannerList` |
| 获取详情 | getXxxDetail | `getBannerDetail` |
| 创建 | createXxx | `createBanner` |
| 更新 | updateXxx | `updateBanner` |
| 删除 | deleteXxx | `deleteBanner` |

**禁止**使用 `fetch` 前缀或匈牙利命名法。

## 接口错误处理（NON-NEGOTIABLE）

`shentuHttpClient` 的请求封装已包含错误码的映射提示，业务代码中**禁止重复添加** `message.error` 等错误提示：

- 接口错误由 HTTP 拦截器统一处理，业务代码只需处理成功逻辑
- 前端表单验证错误和业务逻辑检查错误可以保留
- 成功提示可以保留（业务逻辑的成功反馈）

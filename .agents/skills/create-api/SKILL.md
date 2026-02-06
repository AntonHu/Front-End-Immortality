---
name: create-api
description: 指导在前端项目中按团队规范创建和维护 HTTP 接口，包括类型定义、请求封装、命名约定与错误处理。当前端需要新增或调整 API 时使用本技能。
---

# 创建与维护 API

## 使用场景

当前端需要：

- 为某个业务模块 **新增接口**
- 为已有接口 **补充类型定义**
- **重构接口文件** 或拆分模块

请使用本技能，并同时遵守 `.agents/rules/05-API规范.md` 中的强制规则。

---

## 步骤 1：确定接口归属模块

1. 先确定业务模块名称（如 `banner`、`user`、`ai-editor`）。
2. 对应的文件归属：
   - 请求封装文件：`src/http/<module>.ts`
   - 类型定义文件：`src/interfaces/<module>/api.ts`
   - 业务模型类型：`src/interfaces/<module>/model.ts`

**约定：**

- 所有请求函数都放在 `src/http` 下按模块拆分，禁止在组件、page、store 中直接写 `shentuHttpClient.xxx`。

---

## 步骤 2：在 interfaces 中定义类型

在 `src/interfaces/<module>/model.ts` 中定义基础业务模型：

```ts
// src/interfaces/banner/model.ts
export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  status: BannerStatus;
}
```

在 `src/interfaces/<module>/api.ts` 中定义请求/响应类型：

```ts
// src/interfaces/banner/api.ts
import type {Banner} from './model';

export interface GetBannerListParams {
  page: number;
  pageSize: number;
  status?: Banner['status'];
}

export interface GetBannerListResponse {
  list: Banner[];
  total: number;
}
```

**注意：**

- 请求参数类型和返回值类型应严格依据 Apifox 等接口文档，**禁止凭空创造字段**。
- 返回值一般是
  \{
    code: number;
    msg: string;
    data: {...}
  \}
  `shentuHttpClient` 内部已处理 `code` 判断并返回 `data`，因此这里只需定义 `data` 的结构。

---

## 步骤 3：在 http 中创建请求函数

在 `src/http/<module>.ts` 中：

```ts
// src/http/banner.ts
import {shentuHttpClient} from '@/http';
import type {
  GetBannerListParams,
  GetBannerListResponse,
  GetBannerDetailResponse,
  CreateBannerParams,
  UpdateBannerParams,
} from '@/interfaces/banner/api';

export const getBannerList = async (params: GetBannerListParams) => {
  return shentuHttpClient.get<GetBannerListResponse>('/backend/banners', params);
};

export const getBannerDetail = async (id: number) => {
  return shentuHttpClient.get<GetBannerDetailResponse>(`/backend/banner/${id}`);
};

export const createBanner = async (data: CreateBannerParams) => {
  return shentuHttpClient.post<unknown>('/backend/banner', data);
};

export const updateBanner = async (data: UpdateBannerParams) => {
  return shentuHttpClient.put<unknown>(`/backend/banner/${data.id}`, data);
};

export const deleteBanner = async (id: number) => {
  return shentuHttpClient.delete<unknown>(`/backend/banner/${id}`);
};
```

---

## 步骤 4：命名与错误处理约定

**命名（必须遵守 `05-API规范` 中的 NON-NEGOTIABLE）：**

- 获取列表：`getXxxList`
- 获取详情：`getXxxDetail`
- 创建：`createXxx`
- 更新：`updateXxx`
- 删除：`deleteXxx`
- **禁止** 使用 `fetchXxx` 等前缀。

**错误处理：**

- 接口错误由 `shentuHttpClient` 拦截器统一处理，业务代码中**禁止重复**加 `message.error` 等错误提示。
- 业务侧只处理成功逻辑，以及**前端自身校验错误**（如表单校验失败）。

---

## 步骤 5：在业务代码中使用

在组件或 store 中使用时：

```ts
import {getBannerList} from '@/http/banner';

const onLoad = async () => {
  const res = await getBannerList({page: 1, pageSize: 10});
  // 这里的 res 类型已经是 GetBannerListResponse
};
```

---

## 快速检查清单

- [ ] 是否在 `src/interfaces/<module>/api.ts` 中定义了清晰的请求/响应类型？
- [ ] 是否在 `src/http/<module>.ts` 中集中管理该模块的所有接口？
- [ ] 函数命名是否符合 `get/create/update/deleteXxx` 规范？
- [ ] 是否避免在业务代码中重复处理接口错误提示？


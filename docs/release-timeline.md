# Next.js 版本发布时间线

## 中间件相关版本发布时间

| 版本 | 发布日期 | 发布活动/说明 |
|------|---------|-------------|
| **v12.0** | 2021年10月 | 引入 Middleware（Beta 阶段） |
| **v12.2** | 2022年2月 | Middleware 稳定版（GA） |
| **v13.0** | **2022年10月25日** | 在 Next.js Conf 大会上发布，引入 App Router，增强中间件功能 |
| **v14.0** | 2023年10月 | 继续增强中间件和 App Router 功能 |
| **v15.0** | 2024年 | 引入 React 19 支持 |
| **v15.2** | 2024年 | 实验性支持 Node.js runtime 中间件 |
| **v15.5** | 2024年 | Node.js runtime 中间件支持稳定 |
| **v16.0** | 2025年 | 重大变化：middleware → proxy 重命名 |

## 关键时间节点

### 2021年10月 - Next.js 12.0
- 首次引入 Middleware 功能（Beta）
- 默认运行在 Edge Runtime
- 基础的路由匹配、重写、重定向功能

### 2022年2月 - Next.js 12.2
- Middleware 进入稳定版
- 修复早期版本的限制和问题
- 不再允许直接返回 Response body

### 2022年10月25日 - Next.js 13.0 ⭐
- **重要里程碑**：在 Next.js Conf 大会上正式发布
- 引入 App Router（与 Pages Router 并存）
- 增强中间件功能：
  - 新增 `userAgent()` helper 函数
  - 改进的 Cookies API（`delete()` 替代 `clearCookie()`）
  - 增强的 matcher 配置（支持排除模式）
  - 支持配置 flags（`skipMiddlewareUrlNormalize` 等）
  - 支持修改请求头并传递给后端

### 2023年10月 - Next.js 14.0
- 继续增强中间件功能
- 优化 App Router 性能
- 改进 Server Actions

### 2024年 - Next.js 15.x
- v15.2: 实验性支持在中间件中使用 Node.js runtime
- v15.5: Node.js runtime 支持稳定
- 这是中间件功能的重大突破，允许使用 Node.js API

### 2025年 - Next.js 16.0
- 重大变化：`middleware.ts` 重命名为 `proxy.ts`
- 强制使用 Node.js runtime
- Edge runtime 的 middleware 被标记为弃用

## 版本间隔

- **v12 → v13**: 约 1 年（2021年10月 → 2022年10月）
- **v13 → v14**: 约 1 年（2022年10月 → 2023年10月）
- **v14 → v15**: 约 1 年（2023年10月 → 2024年）
- **v15 → v16**: 约 1 年（2024年 → 2025年）

## 中间件功能演进时间线

```
2021年10月 ──┐
             ├─ v12.0: 引入 Middleware (Beta)
2022年2月  ──┘
             └─ v12.2: Middleware 稳定版

2022年10月 ──┐
             ├─ v13.0: 增强功能，userAgent helper，新 Cookies API
2023年10月 ──┘
             └─ v14.0: 继续增强

2024年 ──────┐
             ├─ v15.2: 实验性 Node.js runtime 支持
             └─ v15.5: Node.js runtime 稳定支持

2025年 ──────┐
             └─ v16.0: middleware → proxy 重命名，强制 Node.js
```

## 参考链接

- [Next.js 12 发布公告](https://nextjs.org/blog/next-12)
- [Next.js 13 发布公告](https://nextjs.org/blog/next-13) - 2022年10月25日
- [Next.js 14 发布公告](https://nextjs.org/blog/next-14)
- [Next.js 15 发布公告](https://nextjs.org/blog/next-15)
- [Next.js 16 发布公告](https://nextjs.org/blog/next-16)

---

**文档版本**: 1.0  
**最后更新**: 2026-01-20

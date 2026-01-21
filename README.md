# Next.js Middleware 验证项目

本项目用于验证 Next.js 中间件在不同版本下的行为，特别是部署到边缘平台时的兼容性。

## ⚠️ 边缘平台特性

**重要说明**：
- ✅ **只支持 Edge Runtime**：边缘平台只支持 Next.js 的 Edge runtime 中间件
- ✅ **Edge Functions 打包**：会将 Next.js 的 Edge 部分打包到 Edge Functions
- ❌ **不支持 Node.js Runtime**：即使 Next.js 15+ 支持 Node.js runtime，边缘平台也不支持
- ❌ **不支持 Next.js 16**：Next.js 16 的 proxy.ts 强制使用 Node.js runtime，不适用于边缘平台

**测试范围**：
- ✅ Next.js 13.x/14.x（Edge runtime）
- ✅ Next.js 15.x（Edge runtime，不使用 Node.js runtime）
- ❌ Next.js 12.x（不测试）
- ❌ Next.js 16.x（不支持，强制 Node.js runtime）

## Next.js 版本与中间件变化概览

### 版本演进

| 版本 | 发布时间 | 关键变化 |
|------|---------|---------|
| **v12.0** | 2021年10月 | 引入 Middleware（Beta），默认 Edge runtime |
| **v12.2** | 2022年2月 | Middleware 稳定版，修复早期限制 |
| **v13.0** | **2022年10月25日** | 增强功能，支持 matcher 配置，支持修改请求/响应头，引入 App Router |
| **v14.0** | 2023年10月 | 继续增强中间件功能 |
| **v15.2** | 2024年 | 实验性支持 Node.js runtime |
| **v15.5** | 2024年 | Node.js runtime 支持稳定 |
| **v16** | 2025年 | **重大变化**：`middleware.ts` → `proxy.ts`，强制 Node.js runtime |

### 主要 API 变化

1. **文件命名**
   - v12-v15: `middleware.ts/js` 在根目录或 `src` 目录
   - v16: 改为 `proxy.ts/js`

2. **运行时环境**
   - v12-v14: 默认 Edge runtime
   - v15+: 支持选择 Edge 或 Node.js runtime
   - v16: 强制 Node.js runtime（Edge runtime 的 middleware 被弃用）

3. **响应处理**
   - v12 早期: 可以直接返回 Response body
   - v12.2+: 不再允许直接返回 body，只能 redirect/rewrite
   - v16: 强调不直接返回响应体

4. **Cookies API**
   - 旧 API: `cookies.getWithOptions`, `.cookie`, `.clearCookie`
   - 新 API: `cookies.get`, `cookies.set`, `cookies.delete`

5. **Matcher 配置**
   - v12: 隐式路径匹配
   - v13+: 显式 `config.matcher` 配置，支持更精确的路由控制

6. **同步 vs 异步 API**
   - v12-v15: 部分 API 支持同步访问
   - v16: 全面改为异步 API

## 项目结构

```
nextjs-middleware-validate/
├── README.md
├── package.json
├── versions/                    # 不同版本的示例
│   ├── v13/                    # Next.js 13.x/14.x 示例（Edge runtime）
│   └── v15/                    # Next.js 15.x 示例（Edge runtime，适用于边缘平台）
├── test-cases/                 # 测试用例说明
│   ├── test-checklist.md       # 完整测试清单（已废弃，包含 v12/v16）
│   └── test-checklist-edgeone.md # 边缘平台专用测试清单
└── docs/                       # 详细文档
```

## 测试场景（边缘平台专用）

### 1. 基础功能测试（Edge Runtime）
- [ ] 路径匹配（matcher）
- [ ] 请求重写（rewrite）
- [ ] 请求重定向（redirect）
- [ ] 修改请求头
- [ ] 修改响应头
- [ ] Cookie 操作

### 2. Edge Runtime 特性测试
- [ ] Edge runtime 行为验证
- [ ] Edge runtime API 可用性
- [ ] userAgent() helper 功能
- [ ] 改进的 Cookies API

### 3. 版本兼容性测试
- [ ] v13/v14 增强功能
- [ ] v15 Edge runtime（不使用 Node.js runtime）

### 4. Edge Functions 验证
- [ ] 中间件代码被正确打包到 Edge Functions
- [ ] Edge Functions 在边缘平台上正常执行
- [ ] Edge Functions 执行日志和监控
- [ ] 静态资源处理（Edge Functions 不处理）
- [ ] API 路由处理
- [ ] 性能测试（执行时间、冷启动等）
- [ ] 错误处理和日志

## 使用方法

### 运行特定版本示例

```bash
# 进入对应版本目录
cd versions/v12

# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

### 部署到边缘平台

1. 将对应版本的项目推送到 Git 仓库
2. 在平台控制台创建项目
3. 连接 Git 仓库并选择对应分支
4. 配置构建命令和输出目录
5. 部署并验证中间件功能

## 注意事项

### 边缘平台限制
- ⚠️ **只支持 Edge Runtime**：必须使用 Edge runtime，不能使用 Node.js runtime
- ⚠️ **不支持 Next.js 16**：Next.js 16 的 proxy.ts 强制 Node.js runtime，不兼容
- ✅ **Edge Functions 打包**：中间件会被打包到 Edge Functions
- ✅ **支持的版本**：Next.js 13.x, 14.x, 15.x（仅 Edge runtime）

### 部署要求
- 支持的 Node.js 版本：22.11.0, 20.18.0, 18.20.4, 16.20.2, 14.21.3
- 确保 Next.js 版本与 Node.js 版本兼容
- 确保中间件配置使用 Edge runtime（`runtime: 'edge'` 或不配置，默认就是 Edge）
- 不要使用 Node.js API（如 fs, crypto 等），这些在 Edge runtime 中不可用

## 参考文档

- [Next.js Middleware 文档](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js 16 升级指南](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

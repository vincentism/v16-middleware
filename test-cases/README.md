# 测试用例说明

本文档详细说明了各个 Next.js 版本的中间件/Proxy 测试用例和验证要点。

## 版本对比表

| 特性 | v12 | v13/v14 | v15 | v16 |
|------|-----|---------|-----|-----|
| 文件命名 | `middleware.ts` | `middleware.ts` | `middleware.ts` | `proxy.ts` |
| 函数名 | `middleware` | `middleware` | `middleware` | `proxy` |
| 默认 Runtime | Edge | Edge | Edge (可选 Node.js) | Node.js (强制) |
| Node.js Runtime | ❌ | ❌ | ✅ (v15.5+) | ✅ (强制) |
| userAgent() helper | ❌ | ✅ | ✅ | ✅ |
| Matcher 配置 | 基础 | 增强 | 增强 | 增强 |
| Cookies API | 旧 API | 新 API | 新 API | 新 API |
| 直接返回 Response body | ❌ (v12.2+) | ❌ | ❌ | ❌ |
| 异步 API | 部分 | 部分 | 部分 | 全面 |
| 配置项命名 | - | `skipMiddlewareUrlNormalize` | `skipMiddlewareUrlNormalize` | `skipProxyUrlNormalize` |

## 测试场景

### 1. 基础功能测试

#### 1.1 路径匹配 (Matcher)

**测试目标**: 验证中间件只在配置的路径上执行

**测试步骤**:
1. 访问 `/api/test` - 应该执行中间件
2. 访问 `/dashboard` - 应该执行中间件（如果配置了）
3. 访问 `/` - 根据配置决定是否执行
4. 访问静态资源 `/favicon.ico` - 不应该执行中间件

**验证点**:
- 检查响应头中是否有中间件添加的标识头
- 检查控制台日志（如果有）

**各版本差异**:
- v12: 基础 matcher 配置
- v13+: 支持更复杂的 matcher 模式，支持 `has`/`missing` 条件
- v15/v16: 继承 v13+ 的功能

#### 1.2 请求重写 (Rewrite)

**测试目标**: 验证中间件可以重写请求路径

**测试步骤**:
1. 访问 `/about` (v12 示例)
2. 检查实际渲染的页面内容
3. 检查 URL 是否保持不变（重写不会改变 URL）

**验证点**:
- URL 应该保持为 `/about`
- 页面内容应该是 `/about-us` 的内容

**各版本差异**:
- 所有版本都支持，API 基本一致

#### 1.3 请求重定向 (Redirect)

**测试目标**: 验证中间件可以重定向请求

**测试步骤**:
1. 访问 `/old` (v12 示例) 或 `/protected/*` (v13+)
2. 检查是否被重定向
3. 检查重定向后的 URL

**验证点**:
- 应该返回 307/308 重定向状态码
- Location 头应该指向新 URL
- 浏览器应该自动跳转到新 URL

**各版本差异**:
- 所有版本都支持，API 基本一致

#### 1.4 修改请求头

**测试目标**: 验证中间件可以修改请求头并传递给后端

**测试步骤**:
1. 访问 `/api/test` 或 `/api/user`
2. 在 API 路由中检查请求头
3. 验证中间件添加的请求头是否存在

**验证点**:
- API 路由应该能接收到中间件添加的请求头
- 例如: `x-forwarded-by`, `x-original-path` 等

**各版本差异**:
- v12: 支持，但功能较基础
- v13+: 增强支持，可以更灵活地修改请求头
- v15/v16: 继承并增强

#### 1.5 修改响应头

**测试目标**: 验证中间件可以修改响应头

**测试步骤**:
1. 访问任何匹配的路径
2. 在浏览器开发者工具中检查响应头
3. 验证中间件添加的响应头

**验证点**:
- 响应头中应该有中间件添加的标识
- 例如: `x-middleware-version`, `x-runtime` 等

**各版本差异**:
- 所有版本都支持

### 2. Cookie 操作测试

#### 2.1 读取 Cookie

**测试目标**: 验证中间件可以读取请求中的 Cookie

**测试步骤**:
1. 设置一个 Cookie（通过浏览器或代码）
2. 访问匹配的路径
3. 检查中间件是否正确读取 Cookie

**验证点**:
- 中间件应该能读取到 Cookie 值
- 可以基于 Cookie 值做条件判断

**各版本差异**:
- v12: 使用旧 API `request.cookies.get()`
- v13+: 使用新 API，功能更强大
- v15/v16: 使用新 API

#### 2.2 设置 Cookie

**测试目标**: 验证中间件可以设置 Cookie

**测试步骤**:
1. 访问匹配的路径（确保没有对应 Cookie）
2. 检查响应头中的 Set-Cookie
3. 验证 Cookie 是否被正确设置

**验证点**:
- 响应头中应该有 Set-Cookie
- Cookie 应该包含正确的值、路径、过期时间等

**各版本差异**:
- v12: 使用旧 API `response.cookies.set()` 或 `.cookie()`
- v13+: 使用新 API `response.cookies.set()`，支持更多选项
- v15/v16: 使用新 API

#### 2.3 删除 Cookie

**测试目标**: 验证中间件可以删除 Cookie

**测试步骤**:
1. 先设置一个 Cookie
2. 访问匹配的路径（中间件删除 Cookie）
3. 检查 Cookie 是否被删除

**验证点**:
- Cookie 应该被删除或过期

**各版本差异**:
- v12: 使用 `response.cookies.clearCookie()` 或 `.delete()`
- v13+: 使用 `response.cookies.delete()`
- v15/v16: 使用新 API

### 3. User-Agent 处理测试

#### 3.1 Bot 检测

**测试目标**: 验证中间件可以检测 Bot

**测试步骤**:
1. 使用浏览器访问（正常 User-Agent）
2. 使用 curl 或 Postman 模拟 Bot User-Agent 访问
3. 检查响应头中的 Bot 标识

**验证点**:
- 正常访问不应该有 Bot 标识
- Bot 访问应该有 `x-detected-bot: true`

**各版本差异**:
- v12: 需要手动解析 User-Agent 头
- v13+: 可以使用 `userAgent()` helper 函数
- v15/v16: 使用 `userAgent()` helper（异步）

### 4. 运行时测试

#### 4.1 Edge Runtime

**测试目标**: 验证 Edge Runtime 的行为

**测试步骤**:
1. 在 v12/v13 项目中运行中间件
2. 检查响应头中的 runtime 标识
3. 验证 Edge Runtime 的限制（不能使用某些 Node.js API）

**验证点**:
- 应该运行在 Edge Runtime
- 不能使用 Node.js 特定的 API（如 fs, crypto 等）

**适用版本**: v12, v13, v14

#### 4.2 Node.js Runtime

**测试目标**: 验证 Node.js Runtime 的行为

**测试步骤**:
1. 在 v15/v16 项目中运行中间件（配置 Node.js runtime）
2. 检查响应头中的 runtime 标识
3. 验证可以使用更多 Node.js API

**验证点**:
- 应该运行在 Node.js Runtime
- 可以使用更多 Node.js API（但仍需谨慎）

**适用版本**: v15, v16

### 5. 认证和授权测试

#### 5.1 基于 Header 的认证

**测试目标**: 验证基于 Authorization Header 的认证

**测试步骤**:
1. 访问 `/protected/*` 路径（无 Authorization header）
2. 应该被重定向到登录页
3. 使用 curl/Postman 添加 Authorization header 访问
4. 应该能正常访问

**验证点**:
- 无认证信息应该被重定向
- 有认证信息应该能正常访问

**适用版本**: v13+, v15, v16

#### 5.2 基于 Cookie 的认证

**测试目标**: 验证基于 Cookie 的认证

**测试步骤**:
1. 访问 `/admin/*` 或 `/secure/*`（无 session cookie）
2. 应该被重定向到登录页
3. 设置 session cookie 后访问
4. 应该能正常访问

**验证点**:
- 无 session cookie 应该被重定向
- 有 session cookie 应该能正常访问

**适用版本**: 所有版本

### 6. 边缘平台 部署验证

#### 6.1 部署检查清单

- [ ] 项目成功构建
- [ ] 中间件文件被正确识别
- [ ] 中间件在部署环境中正常执行
- [ ] 响应头正确添加
- [ ] 重定向功能正常
- [ ] 重写功能正常
- [ ] Cookie 操作正常
- [ ] 静态资源不受中间件影响

#### 6.2 日志和调试

**检查点**:
1. 边缘平台 控制台的构建日志
2. 运行时日志（如果有）
3. 浏览器开发者工具的 Network 标签
4. 响应头中的中间件标识

#### 6.3 性能测试

**测试点**:
1. 中间件执行时间
2. 对页面加载速度的影响
3. 对 API 响应时间的影响

## 常见问题

### Q1: v16 中 middleware.ts 还能用吗？

A: 可以，但会被标记为弃用。建议迁移到 `proxy.ts`。

### Q2: 边缘平台 支持 proxy.ts 吗？

A: 需要实际测试验证。理论上应该支持，因为 边缘平台 支持完整的 Next.js 功能。

### Q3: 如何选择使用 Edge 还是 Node.js runtime？

A: 
- v12-v14: 只能使用 Edge runtime
- v15: 可以选择 Edge 或 Node.js runtime
- v16: 强制使用 Node.js runtime

### Q4: 中间件可以访问数据库吗？

A: 
- Edge runtime: 不能直接访问，需要通过 API 调用
- Node.js runtime: 可以，但不推荐，会影响性能

### Q5: 中间件可以返回 JSON 响应吗？

A: 从 v12.2 开始，不再允许直接返回响应体。只能使用 redirect 或 rewrite。如果需要返回 JSON，应该使用 API 路由。

## 测试报告模板

```markdown
## 测试报告 - Next.js v[X] Middleware

### 测试环境
- Next.js 版本: [版本号]
- Node.js 版本: [版本号]
- 边缘平台 版本: [版本号]
- 测试日期: [日期]

### 测试结果

#### 基础功能
- [ ] 路径匹配: ✅/❌
- [ ] 请求重写: ✅/❌
- [ ] 请求重定向: ✅/❌
- [ ] 修改请求头: ✅/❌
- [ ] 修改响应头: ✅/❌

#### Cookie 操作
- [ ] 读取 Cookie: ✅/❌
- [ ] 设置 Cookie: ✅/❌
- [ ] 删除 Cookie: ✅/❌

#### 运行时
- [ ] Edge Runtime: ✅/❌
- [ ] Node.js Runtime: ✅/❌

#### 部署验证
- [ ] 构建成功: ✅/❌
- [ ] 中间件执行: ✅/❌
- [ ] 功能正常: ✅/❌

### 问题记录
[记录遇到的问题和解决方案]

### 备注
[其他需要记录的信息]
```

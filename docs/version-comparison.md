# Next.js 中间件版本对比详细文档

## 概述

本文档详细对比了 Next.js 从 v12 到 v16 版本中中间件（Middleware/Proxy）的 API 变化、配置差异和最佳实践。

## 版本演进时间线

```
2021年10月 → Next.js 12.0  → 引入 Middleware (Beta)
2022年2月  → Next.js 12.2  → Middleware 稳定版
2022年10月25日 → Next.js 13.0 → 增强功能，userAgent helper，引入 App Router
2023年10月 → Next.js 14.0  → 继续增强中间件功能
2024年     → Next.js 15.2  → 实验性 Node.js runtime 支持
2024年     → Next.js 15.5  → Node.js runtime 稳定支持
2025年     → Next.js 16    → middleware → proxy 重命名，强制 Node.js
```

## 详细对比

### 1. 文件结构和命名

#### Next.js 12-15
```typescript
// 文件位置: middleware.ts (根目录或 src 目录)
// 函数导出: export function middleware(request: NextRequest)
```

#### Next.js 16
```typescript
// 文件位置: proxy.ts (根目录或 src 目录)
// 函数导出: export async function proxy(request: NextRequest)
// 注意: middleware.ts 仍然可用但被标记为弃用
```

### 2. 运行时环境

#### Next.js 12-14
- **默认**: Edge Runtime
- **配置**: 无法选择，只能使用 Edge
- **限制**: 不能使用 Node.js API（fs, crypto 等）

#### Next.js 15
- **默认**: Edge Runtime
- **可选**: Node.js Runtime (v15.2 实验性，v15.5 稳定)
- **配置**:
  ```typescript
  export const config = {
    runtime: 'nodejs', // 或 'edge'
    matcher: [...]
  }
  ```

#### Next.js 16
- **默认**: Node.js Runtime（强制）
- **Edge Runtime**: 被弃用，不再推荐使用
- **配置**:
  ```typescript
  export const config = {
    runtime: 'nodejs', // 强制，不能选择 edge
    matcher: [...]
  }
  ```

### 3. API 变化

#### Cookies API

**v12 (旧 API)**:
```typescript
// 读取
const cookie = request.cookies.get('name')

// 设置
response.cookies.set('name', 'value', {
  path: '/',
  maxAge: 3600
})

// 删除
response.cookies.clearCookie('name')
```

**v13+ (新 API)**:
```typescript
// 读取（相同）
const cookie = request.cookies.get('name')

// 设置（增强）
response.cookies.set('name', 'value', {
  path: '/',
  maxAge: 3600,
  httpOnly: true,
  sameSite: 'lax',
  secure: true
})

// 删除（改名）
response.cookies.delete('name')
```

#### User-Agent 处理

**v12**:
```typescript
// 需要手动解析
const userAgent = request.headers.get('user-agent') || ''
if (userAgent.includes('bot')) {
  // ...
}
```

**v13+**:
```typescript
import { userAgent } from 'next/server'

// 使用 helper 函数
const ua = userAgent(request)
if (ua.isBot) {
  // ...
}
```

**v16**:
```typescript
import { userAgent } from 'next/server'

// 异步 API
const ua = await userAgent(request)
if (ua.isBot) {
  // ...
}
```

### 4. Matcher 配置

#### v12 (基础)
```typescript
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*'
  ]
}
```

#### v13+ (增强)
```typescript
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    // 排除静态文件
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  // 新增 flags
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
}
```

#### v16 (重命名)
```typescript
export const config = {
  matcher: [...],
  // 配置项重命名
  skipProxyUrlNormalize: true, // 旧: skipMiddlewareUrlNormalize
}
```

### 5. 响应处理限制

#### v12 早期
```typescript
// ❌ 早期版本可以，但 v12.2+ 不再允许
export function middleware(request: NextRequest) {
  return NextResponse.json({ error: 'Not allowed' })
  // 或
  return new Response('Hello', { status: 200 })
}
```

#### v12.2+
```typescript
// ✅ 只能使用这些方式
export function middleware(request: NextRequest) {
  // 重定向
  return NextResponse.redirect(new URL('/login', request.url))
  
  // 重写
  return NextResponse.rewrite(new URL('/new-path', request.url))
  
  // 继续处理
  return NextResponse.next()
}
```

### 6. 异步 API

#### v12-15
```typescript
// 部分同步 API
export function middleware(request: NextRequest) {
  const params = request.nextUrl.searchParams // 同步
  const headers = request.headers // 同步
  const cookies = request.cookies // 同步
}
```

#### v16
```typescript
// 全面异步
export async function proxy(request: NextRequest) {
  const params = await request.nextUrl.searchParams // 异步
  const headers = await request.headers // 异步
  const cookies = await request.cookies // 异步
  const ua = await userAgent(request) // 异步
}
```

## 迁移指南

### 从 v12 迁移到 v13+

1. **更新 Cookies API**:
   ```typescript
   // 旧
   response.cookies.clearCookie('name')
   
   // 新
   response.cookies.delete('name')
   ```

2. **使用 userAgent helper**:
   ```typescript
   // 旧
   const ua = request.headers.get('user-agent')
   
   // 新
   import { userAgent } from 'next/server'
   const ua = userAgent(request)
   ```

3. **增强 matcher 配置**:
   ```typescript
   // 添加排除静态文件的模式
   matcher: [
     '/((?!_next/static|_next/image|favicon.ico).*)',
   ]
   ```

### 从 v13/v14 迁移到 v15

1. **选择运行时**:
   ```typescript
   export const config = {
     runtime: 'nodejs', // 如果需要 Node.js API
     matcher: [...]
   }
   ```

2. **注意性能影响**:
   - Node.js runtime 可能比 Edge runtime 慢
   - 谨慎使用 Node.js API

### 从 v15 迁移到 v16

1. **重命名文件**:
   ```bash
   mv middleware.ts proxy.ts
   ```

2. **重命名函数**:
   ```typescript
   // 旧
   export function middleware(request: NextRequest) { }
   
   // 新
   export async function proxy(request: NextRequest) { }
   ```

3. **更新配置项**:
   ```typescript
   // 旧
   skipMiddlewareUrlNormalize: true
   
   // 新
   skipProxyUrlNormalize: true
   ```

4. **更新异步 API**:
   ```typescript
   // 旧
   const ua = userAgent(request)
   
   // 新
   const ua = await userAgent(request)
   ```

## 最佳实践

### 1. 性能优化

- **保持中间件轻量**: 避免在中间件中执行耗时操作
- **使用 Edge Runtime**: 如果不需要 Node.js API，优先使用 Edge runtime（v15 及之前）
- **合理使用 Matcher**: 精确配置 matcher，避免不必要的执行

### 2. 安全性

- **验证输入**: 始终验证和清理用户输入
- **使用 HTTPS**: 在生产环境中使用 HTTPS
- **设置安全头**: 在中间件中设置安全响应头

### 3. 可维护性

- **清晰的注释**: 说明中间件的用途和逻辑
- **错误处理**: 妥善处理错误情况
- **日志记录**: 记录重要的操作和错误

### 4. 边缘平台 部署

- **测试构建**: 在本地测试构建过程
- **检查日志**: 部署后检查构建和运行时日志
- **验证功能**: 部署后验证所有中间件功能
- **监控性能**: 监控中间件对性能的影响

## 常见错误和解决方案

### 错误 1: 直接返回响应体

```typescript
// ❌ 错误
return NextResponse.json({ error: 'Not allowed' })

// ✅ 正确
return NextResponse.redirect(new URL('/error', request.url))
```

### 错误 2: 在 Edge Runtime 中使用 Node.js API

```typescript
// ❌ 错误 (Edge Runtime)
import fs from 'fs'
const data = fs.readFileSync('file.txt')

// ✅ 正确 (使用 API 路由)
// 在 API 路由中使用 Node.js API
```

### 错误 3: 忘记配置 matcher

```typescript
// ❌ 错误 - 中间件会在所有路径执行
export function middleware(request: NextRequest) { }

// ✅ 正确
export const config = {
  matcher: ['/api/:path*']
}
```

## 总结

Next.js 中间件从 v12 到 v16 经历了显著的变化：

1. **功能增强**: 从基础的路径匹配到强大的条件判断
2. **API 改进**: Cookies API、userAgent helper 等
3. **运行时支持**: 从仅 Edge 到支持 Node.js
4. **重大重构**: v16 的 proxy 重命名和强制 Node.js runtime

在 边缘平台 上部署时，需要：
- 确认平台支持的 Next.js 版本
- 测试各个版本的中间件功能
- 验证运行时环境
- 监控性能和错误

建议根据项目需求选择合适的版本，并遵循最佳实践。

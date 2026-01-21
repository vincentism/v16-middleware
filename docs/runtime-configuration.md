# Next.js 中间件运行时配置指南

## 如何设置中间件使用 Edge 还是 Node.js Runtime

### 基本配置方法

在 `middleware.ts` 文件中，通过 `export const config` 来配置运行时：

```typescript
export const config = {
  runtime: 'edge',    // 或 'nodejs'
  matcher: [...]
}
```

---

## 各版本的配置方式

### Next.js 12.x

**只能使用 Edge Runtime**，无法配置：

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 默认就是 Edge runtime，无法更改
}

export const config = {
  matcher: ['/api/:path*']
  // 注意：没有 runtime 配置项
}
```

**特点**：
- ✅ 默认 Edge runtime
- ❌ 无法选择 Node.js runtime
- ❌ 不能使用 Node.js API

---

### Next.js 13.x / 14.x

**只能使用 Edge Runtime**，无法配置：

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 默认就是 Edge runtime，无法更改
}

export const config = {
  matcher: ['/api/:path*']
  // 注意：没有 runtime 配置项，默认就是 'edge'
}
```

**特点**：
- ✅ 默认 Edge runtime
- ❌ 无法选择 Node.js runtime
- ❌ 不能使用 Node.js API

---

### Next.js 15.x

**可以选择 Edge 或 Node.js Runtime**：

#### 使用 Edge Runtime（默认）

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Edge runtime 代码
}

// 方式 1: 不配置 runtime（默认就是 Edge）
export const config = {
  matcher: ['/api/:path*']
}

// 方式 2: 显式配置为 Edge
export const config = {
  runtime: 'edge',  // 显式指定 Edge runtime
  matcher: ['/api/:path*']
}
```

#### 使用 Node.js Runtime

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Node.js runtime 代码
  // 可以使用 Node.js API（但不推荐）
}

export const config = {
  runtime: 'nodejs',  // 指定 Node.js runtime
  matcher: ['/api/:path*']
}
```

**特点**：
- ✅ 默认 Edge runtime（不配置或 `runtime: 'edge'`）
- ✅ 可选 Node.js runtime（`runtime: 'nodejs'`）
- ⚠️ v15.2: 实验性支持 Node.js runtime
- ✅ v15.5+: 稳定支持 Node.js runtime

---

### Next.js 16.x

**强制使用 Node.js Runtime**：

```typescript
// proxy.ts（注意：文件名改为 proxy.ts）
export async function proxy(request: NextRequest) {
  // Node.js runtime 代码
}

export const config = {
  runtime: 'nodejs',  // 强制 Node.js runtime
  matcher: ['/api/:path*']
}
```

**特点**：
- ✅ 强制 Node.js runtime
- ❌ Edge runtime 被弃用
- ⚠️ 文件重命名为 `proxy.ts`

---

## 完整配置示例

### Edge Runtime 配置示例

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Edge runtime 可以使用的功能
  response.headers.set('x-runtime', 'edge')
  
  return response
}

export const config = {
  // 方式 1: 不配置（默认 Edge）
  matcher: ['/api/:path*']
  
  // 方式 2: 显式配置（Next.js 15+）
  // runtime: 'edge',
  // matcher: ['/api/:path*']
}
```

### Node.js Runtime 配置示例（仅 Next.js 15+）

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Node.js runtime 可以使用 Node.js API
  // const fs = require('fs') // ⚠️ 可以使用但不推荐
  const timestamp = Date.now()
  
  response.headers.set('x-runtime', 'nodejs')
  response.headers.set('x-timestamp', timestamp.toString())
  
  return response
}

export const config = {
  runtime: 'nodejs',  // 指定 Node.js runtime（仅 Next.js 15+）
  matcher: ['/api/:path*']
}
```

---

## 版本对比表

| Next.js 版本 | 默认 Runtime | 可配置 Runtime | 配置方式 |
|-------------|-------------|---------------|---------|
| **12.x** | Edge | ❌ 仅 Edge | 无需配置，默认 Edge |
| **13.x / 14.x** | Edge | ❌ 仅 Edge | 无需配置，默认 Edge |
| **15.x** | Edge | ✅ Edge 或 Node.js | `runtime: 'edge'` 或 `runtime: 'nodejs'` |
| **16.x** | Node.js | ❌ 仅 Node.js | `runtime: 'nodejs'`（强制） |

---

## 边缘平台 平台要求

### ⚠️ 重要限制

**边缘平台 只支持 Edge Runtime**：

```typescript
// ✅ 正确配置（边缘平台 支持）
export const config = {
  runtime: 'edge',  // 或省略（默认就是 Edge）
  matcher: ['/api/:path*']
}

// ❌ 错误配置（边缘平台 不支持）
export const config = {
  runtime: 'nodejs',  // 边缘平台 不支持 Node.js runtime
  matcher: ['/api/:path*']
}
```

### 边缘平台 配置建议

```typescript
// middleware.ts - 边缘平台 推荐配置
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-runtime', 'edge')
  return response
}

// 方式 1: 不配置 runtime（推荐，默认 Edge）
export const config = {
  matcher: ['/api/:path*']
}

// 方式 2: 显式配置 Edge runtime（更明确）
export const config = {
  runtime: 'edge',  // 显式指定，更清晰
  matcher: ['/api/:path*']
}
```

---

## 如何判断当前使用的 Runtime

### 方法 1: 检查响应头

在中间件中设置响应头来标识：

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // 设置标识头
  response.headers.set('x-runtime', 'edge')  // 或 'nodejs'
  
  return response
}
```

### 方法 2: 检查配置

查看 `middleware.ts` 中的 `config`：

```typescript
export const config = {
  runtime: 'edge',  // 明确指定
  // 或
  // runtime: 'nodejs',  // 明确指定
  // 或
  // 没有 runtime 配置 = 默认 Edge（v12-15）
}
```

### 方法 3: 尝试使用 Node.js API

```typescript
// 如果这段代码报错，说明是 Edge runtime
try {
  const fs = require('fs')  // Edge runtime 不支持
  console.log('Node.js runtime')
} catch (e) {
  console.log('Edge runtime')
}
```

---

## Runtime 差异对比

### Edge Runtime

**优点**：
- ✅ 启动速度快（冷启动 < 50ms）
- ✅ 全球边缘节点部署
- ✅ 低延迟
- ✅ 适合简单逻辑

**限制**：
- ❌ 不能使用 Node.js API（fs, crypto, path 等）
- ❌ 不能访问文件系统
- ❌ 不能使用某些 npm 包（依赖 Node.js API 的包）

**适用场景**：
- 请求/响应头修改
- Cookie 操作
- 重定向/重写
- 简单的认证检查
- Bot 检测

### Node.js Runtime

**优点**：
- ✅ 可以使用所有 Node.js API
- ✅ 可以访问文件系统
- ✅ 可以使用更多 npm 包
- ✅ 可以进行数据库查询、外部 API 调用等

**限制**：
- ❌ 启动速度较慢（冷启动 > 100ms）
- ❌ 可能不在边缘节点
- ❌ 延迟可能较高

**适用场景**：
- 需要访问文件系统
- 需要数据库查询
- 需要调用外部 API
- 复杂的业务逻辑

---

## 常见问题

### Q: 如何知道我的中间件使用的是哪个 Runtime？

A: 
1. 检查 `config.runtime` 配置
2. 查看响应头中的标识
3. 尝试使用 Node.js API，如果报错就是 Edge runtime

### Q: Next.js 15 中如何选择 Runtime？

A: 
- 默认是 Edge runtime（不配置或 `runtime: 'edge'`）
- 如果需要 Node.js API，配置 `runtime: 'nodejs'`
- 但注意：边缘平台 不支持 Node.js runtime

### Q: 边缘平台 支持 Node.js runtime 吗？

A: ❌ 不支持。边缘平台 只支持 Edge runtime，会将中间件打包到 Edge Functions。

### Q: 不配置 runtime 会使用什么？

A: 
- Next.js 12-15: 默认使用 Edge runtime
- Next.js 16: 强制使用 Node.js runtime（文件改为 proxy.ts）

### Q: 可以在中间件中混用 Edge 和 Node.js 功能吗？

A: ❌ 不可以。一个中间件只能使用一种 runtime。如果需要 Node.js 功能，应该使用 API 路由。

---

## 最佳实践

### 1. 边缘平台 部署

```typescript
// ✅ 推荐配置
export const config = {
  runtime: 'edge',  // 显式指定，更清晰
  matcher: ['/api/:path*']
}
```

### 2. 本地开发

```typescript
// Next.js 15+ 可以选择
export const config = {
  runtime: 'edge',  // 或 'nodejs'（如果需要 Node.js API）
  matcher: ['/api/:path*']
}
```

### 3. 性能优化

- 优先使用 Edge runtime（性能更好）
- 只在必要时使用 Node.js runtime
- 避免在中间件中执行耗时操作

---

**文档版本**: 1.0  
**最后更新**: 2026-01-20

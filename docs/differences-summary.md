# Next.js 12、13/14、15 中间件差异总结

## 快速对比表

| 特性 | Next.js 12 | Next.js 13/14 | Next.js 15 |
|------|-----------|--------------|-----------|
| **运行时** | Edge (仅) | Edge (默认) | Edge 或 Node.js (可选) |
| **User-Agent 处理** | 手动解析 | `userAgent()` helper | `userAgent()` helper |
| **Cookies API** | 旧 API (`clearCookie`) | 新 API (`delete`) | 新 API (`delete`) |
| **Matcher 配置** | 基础 | 增强（支持排除模式） | 增强（支持排除模式） |
| **配置 Flags** | ❌ | ✅ (`skipMiddlewareUrlNormalize` 等) | ✅ (`skipMiddlewareUrlNormalize` 等) |
| **Node.js API** | ❌ 不支持 | ❌ 不支持 | ✅ 支持（需配置） |
| **异步操作** | 有限支持 | 有限支持 | ✅ 完整支持 |

---

## 一、运行时环境差异

### Next.js 12
- **仅支持 Edge Runtime**
- 无法选择，只能使用 Edge
- 不能使用 Node.js API（如 `fs`, `crypto`, `path` 等）

```typescript
// v12 - 只能使用 Edge runtime
export function middleware(request: NextRequest) {
  // 不能使用 Node.js API
  // const fs = require('fs') // ❌ 不支持
}
```

### Next.js 13/14
- **默认 Edge Runtime**
- 仍然只能使用 Edge Runtime
- 不能使用 Node.js API

```typescript
// v13/v14 - 仍然只能使用 Edge runtime
export function middleware(request: NextRequest) {
  // 不能使用 Node.js API
}
```

### Next.js 15
- **默认 Edge Runtime，可选 Node.js Runtime**
- v15.2: 实验性支持 Node.js runtime
- v15.5: Node.js runtime 稳定支持
- 可以选择使用 Node.js API

```typescript
// v15 - 可以选择 Node.js runtime
export const config = {
  runtime: 'nodejs', // ✅ 可以选择 Node.js runtime
  matcher: [...]
}

export async function middleware(request: NextRequest) {
  // ✅ 可以使用 Node.js API（但需谨慎）
  const timestamp = Date.now()
  // 可以访问文件系统、数据库等（不推荐在中间件中）
}
```

**关键差异**：
- v12/v13/v14: 只能 Edge，性能好但功能受限
- v15: 可以选择 Node.js，功能更强大但可能更慢

---

## 二、User-Agent 处理差异

### Next.js 12
需要手动解析 User-Agent 字符串：

```typescript
// v12 - 手动解析
const userAgent = request.headers.get('user-agent') || ''
if (userAgent.includes('bot')) {
  // 检测 bot
}
```

### Next.js 13/14
提供了 `userAgent()` helper 函数：

```typescript
// v13/v14 - 使用 helper
import { userAgent } from 'next/server'

const ua = userAgent(request)
if (ua.isBot) {
  // 更简单的 bot 检测
  response.headers.set('x-bot-name', ua.ua)
}
```

### Next.js 15
同样使用 `userAgent()` helper（与 v13/14 相同）：

```typescript
// v15 - 使用 helper（同步）
import { userAgent } from 'next/server'

const ua = userAgent(request)
if (ua.isBot) {
  // 检测 bot
}
```

**关键差异**：
- v12: 需要手动解析字符串
- v13+/v15: 使用便捷的 helper 函数，代码更简洁

---

## 三、Cookies API 差异

### Next.js 12
使用旧的 Cookies API：

```typescript
// v12 - 旧 API
const cookie = request.cookies.get('name')

// 设置
response.cookies.set('name', 'value', {
  path: '/',
  maxAge: 3600
})

// 删除 - 使用 clearCookie
response.cookies.clearCookie('name') // ❌ 旧方法
```

### Next.js 13/14
使用新的标准化 Cookies API：

```typescript
// v13/v14 - 新 API
const cookie = request.cookies.get('name')

// 设置 - 支持更多选项
response.cookies.set('name', 'value', {
  path: '/',
  maxAge: 3600,
  httpOnly: true,    // ✅ 新增
  sameSite: 'lax',   // ✅ 新增
  secure: true        // ✅ 新增
})

// 删除 - 使用 delete
response.cookies.delete('name') // ✅ 新方法
```

### Next.js 15
与 v13/14 相同，使用新 API：

```typescript
// v15 - 新 API（与 v13/14 相同）
response.cookies.set('name', 'value', {
  httpOnly: true,
  sameSite: 'lax',
  secure: true
})

response.cookies.delete('name')
```

**关键差异**：
- v12: `clearCookie()` 方法
- v13+/v15: `delete()` 方法，支持更多安全选项

---

## 四、Matcher 配置差异

### Next.js 12
基础的路径匹配：

```typescript
// v12 - 基础匹配
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*'
  ]
}
```

### Next.js 13/14
增强的匹配，支持排除模式：

```typescript
// v13/v14 - 增强匹配
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    // ✅ 支持排除静态文件
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  // ✅ 新增配置 flags
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
}
```

### Next.js 15
与 v13/14 相同，支持增强匹配：

```typescript
// v15 - 增强匹配（与 v13/14 相同）
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs', // ✅ v15 新增：可以选择 runtime
  skipMiddlewareUrlNormalize: true,
}
```

**关键差异**：
- v12: 基础匹配，无排除模式，无配置 flags
- v13+/v15: 支持排除模式，支持配置 flags
- v15: 额外支持 `runtime` 配置

---

## 五、请求头修改差异

### Next.js 12
可以修改响应头，但请求头修改功能较基础：

```typescript
// v12 - 基础功能
const response = NextResponse.next()
response.headers.set('x-custom', 'value')
return response
```

### Next.js 13/14
支持修改请求头并传递给后端：

```typescript
// v13/v14 - 支持请求头修改
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-forwarded-by', 'middleware-v13')

return NextResponse.next({
  request: {
    headers: requestHeaders, // ✅ 可以修改请求头
  },
})
```

### Next.js 15
与 v13/14 相同，支持请求头修改：

```typescript
// v15 - 支持请求头修改（与 v13/14 相同）
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-forwarded-by', 'middleware-v15-nodejs')
requestHeaders.set('x-original-path', pathname)

return NextResponse.next({
  request: {
    headers: requestHeaders,
  },
})
```

**关键差异**：
- v12: 主要支持响应头修改
- v13+/v15: 完整支持请求头和响应头修改

---

## 六、异步操作支持差异

### Next.js 12
有限的异步支持：

```typescript
// v12 - 同步为主
export function middleware(request: NextRequest) {
  // 主要是同步操作
}
```

### Next.js 13/14
有限的异步支持：

```typescript
// v13/v14 - 同步为主
export function middleware(request: NextRequest) {
  // 主要是同步操作
}
```

### Next.js 15
完整的异步支持（特别是 Node.js runtime）：

```typescript
// v15 - 支持异步操作
export async function middleware(request: NextRequest) {
  // ✅ 可以执行异步操作
  // 例如：数据库查询、外部 API 调用等
  // 注意：在生产环境中要谨慎使用
}
```

**关键差异**：
- v12/v13/v14: 主要是同步操作
- v15: 支持完整的异步操作（特别是 Node.js runtime）

---

## 七、实际代码对比示例

### 示例：Bot 检测

**Next.js 12**:
```typescript
const userAgent = request.headers.get('user-agent') || ''
if (userAgent.includes('bot')) {
  response.headers.set('x-detected-bot', 'true')
}
```

**Next.js 13/14**:
```typescript
import { userAgent } from 'next/server'

const ua = userAgent(request)
if (ua.isBot) {
  response.headers.set('x-detected-bot', 'true')
  response.headers.set('x-bot-name', ua.ua || 'unknown')
}
```

**Next.js 15**:
```typescript
import { userAgent } from 'next/server'

const ua = userAgent(request) // 与 v13/14 相同
if (ua.isBot) {
  response.headers.set('x-detected-bot', 'true')
}
```

### 示例：Cookie 删除

**Next.js 12**:
```typescript
response.cookies.clearCookie('name') // 旧方法
```

**Next.js 13/14/15**:
```typescript
response.cookies.delete('name') // 新方法
```

### 示例：Runtime 配置

**Next.js 12/13/14**:
```typescript
export const config = {
  matcher: [...]
  // 无法选择 runtime，只能使用 Edge
}
```

**Next.js 15**:
```typescript
export const config = {
  runtime: 'nodejs', // ✅ 可以选择 Node.js runtime
  matcher: [...]
}
```

---

## 八、迁移建议

### 从 v12 迁移到 v13/14

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

### 从 v13/14 迁移到 v15

1. **选择运行时**（如果需要 Node.js API）:
   ```typescript
   export const config = {
     runtime: 'nodejs', // 可选
     matcher: [...]
   }
   ```

2. **使用异步函数**（如果使用 Node.js runtime）:
   ```typescript
   export async function middleware(request: NextRequest) {
     // 可以执行异步操作
   }
   ```

---

## 九、总结

### Next.js 12 特点
- ✅ 基础中间件功能
- ✅ Edge runtime（性能好）
- ❌ 功能受限（无 Node.js API）
- ❌ 需要手动处理 User-Agent
- ❌ 旧的 Cookies API

### Next.js 13/14 特点
- ✅ 增强的中间件功能
- ✅ userAgent() helper
- ✅ 新的 Cookies API
- ✅ 增强的 matcher 配置
- ✅ 支持请求头修改
- ❌ 仍然只能使用 Edge runtime

### Next.js 15 特点
- ✅ 继承 v13/14 的所有功能
- ✅ **可以选择 Node.js runtime**（最大差异）
- ✅ 支持完整的异步操作
- ✅ 可以使用 Node.js API
- ⚠️ Node.js runtime 可能比 Edge 慢

### 选择建议

- **性能优先，功能简单**: 使用 v12 或 v13/14（Edge runtime）
- **需要 Node.js API**: 使用 v15（Node.js runtime）
- **需要最新特性**: 使用 v15
- **向后兼容**: 使用 v13/14（最稳定）

---

**文档版本**: 1.0  
**最后更新**: 2026-01-20

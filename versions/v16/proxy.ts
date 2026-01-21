import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userAgent } from 'next/server'

/**
 * Next.js 16.x Proxy 示例
 * 
 * 重大变化：
 * - middleware.ts → proxy.ts（文件重命名）
 * - 函数名 middleware → proxy（或默认导出）
 * - 强制使用 Node.js runtime（Edge runtime 的 middleware 被弃用）
 * - 全面改为异步 API
 * - 不再允许直接返回响应体（只能 redirect/rewrite）
 * - 配置项重命名：skipMiddlewareUrlNormalize → skipProxyUrlNormalize
 */

// 配置使用 Node.js runtime（v16 强制）
export const config = {
  runtime: 'nodejs', // v16 强制使用 Node.js runtime
  matcher: [
    '/api/:path*',
    '/secure/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  // v16 配置项重命名
  // skipProxyUrlNormalize: true, // 旧名称 skipMiddlewareUrlNormalize
}

// v16: 函数名改为 proxy（或使用默认导出）
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 示例 1: 使用异步 API（v16 全面异步化）
  const timestamp = Date.now()
  const response = NextResponse.next()

  // 示例 2: 使用 userAgent helper（异步）
  const ua = await userAgent(request)
  if (ua.isBot) {
    response.headers.set('x-detected-bot', 'true')
    response.headers.set('x-bot-name', ua.ua || 'unknown')
  }

  // 示例 3: Cookie 操作（使用新 API）
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie && pathname.startsWith('/secure')) {
    // 未登录，重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 示例 4: 设置响应头
  response.headers.set('x-proxy-version', 'v16')
  response.headers.set('x-runtime', 'nodejs')
  response.headers.set('x-timestamp', timestamp.toString())
  response.headers.set('x-file-name', 'proxy.ts') // 标识使用 proxy.ts

  // 示例 5: 修改请求头
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-forwarded-by', 'proxy-v16')
  requestHeaders.set('x-original-path', pathname)

  // 示例 6: 基于路径的条件处理
  if (pathname.startsWith('/api/')) {
    response.headers.set('x-content-type-options', 'nosniff')
    response.headers.set('x-frame-options', 'DENY')
    response.headers.set('x-xss-protection', '1; mode=block')
  }

  // 示例 7: v16 不允许直接返回响应体
  // 以下代码会报错或不起作用：
  // return NextResponse.json({ error: 'Not allowed' }) // ❌ 不允许
  // return new Response('Hello', { status: 200 }) // ❌ 不允许
  
  // 只能使用 redirect 或 rewrite：
  // return NextResponse.redirect(...) // ✅ 允许
  // return NextResponse.rewrite(...) // ✅ 允许
  // return NextResponse.next() // ✅ 允许

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// 注意：v16 中旧的 middleware.ts 文件仍然可以工作，但会被标记为弃用
// 建议迁移到 proxy.ts

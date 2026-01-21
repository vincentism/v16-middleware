import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userAgent } from 'next/server'

/**
 * Next.js 13.x/14.x Middleware 示例
 * 
 * 特点：
 * - 增强的 matcher 配置，支持更精确的路由控制
 * - 支持 has/missing 条件判断（header/cookie）
 * - 新增 userAgent() helper 函数
 * - 支持 skipMiddlewareUrlNormalize 等 flags
 * - 改进的 Cookies API（标准化）
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 示例 1: 使用新的 userAgent() helper
  const ua = userAgent(request)

  // 示例 5: 认证检查示例（基于 header）- 需要先检查，可能提前返回
  const authHeader = request.headers.get('authorization')
  if (pathname.startsWith('/protected') && !authHeader) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 示例 7: 修改请求头（转发到后端）
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-forwarded-by', 'middleware-v13')
  
  // 针对 /api/user 路径，添加额外的测试请求头
  if (pathname === '/api/user') {
    requestHeaders.set('x-modified-by-middleware', 'true')
    requestHeaders.set('x-original-user-agent', request.headers.get('user-agent') || '')
  }

  // 创建响应对象，包含修改的请求头
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // 示例 2: 基于 User-Agent 的处理（使用新 API）
  if (ua.isBot) {
    response.headers.set('x-detected-bot', 'true')
    response.headers.set('x-bot-name', ua.ua || 'unknown')
  }

  // 示例 3: 改进的 Cookie 操作（使用新 API）
  const testCookie = request.cookies.get('test-cookie')
  if (!testCookie) {
    // 使用新的 cookies.set API
    response.cookies.set('test-cookie', 'v13-middleware', {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  // 示例 4: 基于路径的响应头设置
  if (pathname.startsWith('/api/')) {
    response.headers.set('x-middleware-version', 'v13')
    response.headers.set('x-request-path', pathname)
    response.headers.set('x-timestamp', new Date().toISOString())
  }
  
  // 针对 /api/user 路径，在响应头中也添加标识，证明中间件修改了请求头
  if (pathname === '/api/user') {
    response.headers.set('x-request-header-modified', 'true')
  }

  // 示例 6: 基于 cookie 的条件处理
  const theme = request.cookies.get('theme')
  console.log("theme", theme);
  if (theme) {
    response.headers.set('x-theme', theme.value)
  }

  return response
}

// 增强的 matcher 配置（v13+）
export const config = {
  matcher: [
    // 基础路径匹配
    '/api/:path*',
    '/protected/:path*',
    // 排除静态文件和 Next.js 内部文件
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  // v13+ 支持的 flags
  // skipMiddlewareUrlNormalize: true, // 跳过 URL 规范化
  // skipTrailingSlashRedirect: true,  // 跳过尾部斜杠重定向
}

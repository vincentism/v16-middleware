import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { userAgent } from 'next/server'

/**
 * Next.js 15.x Middleware 示例（Edge Runtime）
 * 
 * 注意：边缘平台只支持 Edge Runtime
 * - 边缘平台会将 Next.js 的 Edge 部分打包到 Edge Functions
 * - 不支持 Node.js runtime（即使 v15 支持）
 * - 使用 Edge runtime 以获得最佳性能和兼容性
 */

// 配置使用 Edge runtime（边缘平台要求）
export const config = {
  runtime: 'experimental-edge', // Next.js 15 中 edge runtime 需使用 experimental-edge
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/protected/:path*',
    '/about',
    '/about-us',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const timestamp = Date.now()

  // ========== 1. 认证和授权 ==========
  // 1.1 基于 Cookie 的认证重定向
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 1.2 基于 Header 的认证检查
  const authHeader = request.headers.get('authorization')
  if (pathname.startsWith('/protected') && !authHeader) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ========== 2. 请求重写 ==========
  // 将 /about 重写到 /about-us（URL 不变，内容改变）
  if (pathname === '/about') {
    return NextResponse.rewrite(new URL('/about-us', request.url))
  }

  // ========== 3. A/B 测试 ==========
  // 基于 Cookie 的 A/B 测试分配
  const abTestCookie = request.cookies.get('ab-test-variant')
  let abTestVariant: string = abTestCookie?.value || ''
  if (!abTestVariant) {
    // 随机分配 A 或 B
    abTestVariant = Math.random() > 0.5 ? 'variant-a' : 'variant-b'
  }

  // ========== 4. 多语言/国际化 ==========
  // 基于 Accept-Language header 检测语言
  const acceptLanguage = request.headers.get('accept-language') || 'en'
  const preferredLang = acceptLanguage.split(',')[0].split('-')[0] // 取第一个语言代码

  // ========== 5. 地理位置检测 ==========
  // 基于 Cloudflare/Vercel 的地理位置 header（如果可用）
  const country = request.headers.get('cf-ipcountry') || 
                  request.headers.get('x-vercel-ip-country') || 
                  'unknown'

  // ========== 6. 请求限流标识 ==========
  // 基于 IP 或 Cookie 的简单限流标识（实际限流需要外部服务）
  const clientId = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') ||
                   'unknown'

  // ========== 7. 主题切换 ==========
  // 基于 Cookie 的主题
  const themeCookie = request.cookies.get('theme')
  const theme = themeCookie?.value || 'light'

  // ========== 8. 修改请求头（转发到后端）==========
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-forwarded-by', 'middleware-v15-edge')
  requestHeaders.set('x-original-path', pathname)
  requestHeaders.set('x-ab-test-variant', abTestVariant)
  requestHeaders.set('x-preferred-lang', preferredLang)
  requestHeaders.set('x-country', country)
  requestHeaders.set('x-client-id', clientId)
  requestHeaders.set('x-theme', theme)

  // 创建响应对象，包含修改的请求头
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // ========== 9. User-Agent 检测 ==========
  const ua = userAgent(request)
  if (ua.isBot) {
    response.headers.set('x-detected-bot', 'true')
    response.headers.set('x-bot-name', ua.ua || 'unknown')
  }

  // ========== 10. 设置响应头 ==========
  response.headers.set('x-middleware-version', 'v15')
  response.headers.set('x-runtime', 'experimental-edge')
  response.headers.set('x-timestamp', timestamp.toString())
  response.headers.set('x-ab-test-variant', abTestVariant)
  response.headers.set('x-preferred-lang', preferredLang)
  response.headers.set('x-country', country)
  response.headers.set('x-theme', theme)

  // ========== 11. Cookie 操作 ==========
  // 设置 A/B 测试 Cookie（如果不存在）
  if (!abTestCookie) {
    response.cookies.set('ab-test-variant', abTestVariant, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 天
      sameSite: 'lax',
    })
  }

  // ========== 12. 基于路径的条件处理 ==========
  if (pathname.startsWith('/api/')) {
    // API 路由安全头
    response.headers.set('x-content-type-options', 'nosniff')
    response.headers.set('x-frame-options', 'DENY')
    response.headers.set('x-xss-protection', '1; mode=block')
  }

  // ========== 13. 基于查询参数的处理 ==========
  // 例如：?preview=true 时添加预览标识
  if (searchParams.get('preview') === 'true') {
    response.headers.set('x-preview-mode', 'true')
    requestHeaders.set('x-preview-mode', 'true')
  }

  // ========== 14. 缓存控制 ==========
  // 为静态资源设置缓存头
  if (pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|css|js)$/)) {
    response.headers.set('cache-control', 'public, max-age=31536000, immutable')
  }

  // ========== 15. 请求验证 ==========
  // 验证必要的请求头（Edge runtime 不能直接返回 JSON，使用重定向）
  const requiredHeader = request.headers.get('x-api-key')
  if (pathname.startsWith('/api/secure') && !requiredHeader) {
    // Edge runtime 不支持 NextResponse.json，使用重定向到错误页
    const errorUrl = new URL('/api/error?code=401&msg=Missing%20x-api-key', request.url)
    return NextResponse.redirect(errorUrl)
  }

  return response
}

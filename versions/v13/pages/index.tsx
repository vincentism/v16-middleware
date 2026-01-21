import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Next.js 13 Middleware 验证</title>
        <meta name="description" content="Next.js 13.x/14.x 中间件验证页面" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Next.js 13.x/14.x Middleware 验证</h1>
        
        <section style={{ marginTop: '2rem' }}>
          <h2>测试链接</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/test">/api/test - 测试 API 路由（应添加中间件响应头）</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/protected/dashboard">/protected/dashboard - 测试认证重定向（无 token 应重定向到 /login）</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/user">/api/user - 测试请求头修改</Link>
            </li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>版本信息</h2>
          <p>Next.js 版本: 13.x/14.x</p>
          <p>Middleware 文件: middleware.ts</p>
          <p>Runtime: Edge (默认)</p>
          <p>新特性: userAgent() helper, 增强的 matcher, 改进的 Cookies API</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>测试说明</h2>
          <p>打开浏览器开发者工具，查看 Network 标签页中的响应头：</p>
          <ul>
            <li>x-middleware-version: 应显示 v13</li>
            <li>x-forwarded-by: 应显示 middleware-v13</li>
            <li>x-detected-bot: 如果是 bot，应显示 true</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Home

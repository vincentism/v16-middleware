import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Next.js 16 Proxy 验证</title>
        <meta name="description" content="Next.js 16.x Proxy 验证页面" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Next.js 16.x Proxy 验证</h1>
        
        <section style={{ marginTop: '2rem' }}>
          <h2>重大变化</h2>
          <ul>
            <li>✅ middleware.ts → proxy.ts（文件重命名）</li>
            <li>✅ middleware() → proxy()（函数重命名）</li>
            <li>✅ 强制使用 Node.js runtime</li>
            <li>✅ 全面异步 API</li>
            <li>✅ 不再允许直接返回响应体</li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>测试链接</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/test">/api/test - 测试 API 路由（proxy.ts）</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/secure/dashboard">/secure/dashboard - 测试认证检查（无 session 应重定向）</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/user">/api/user - 测试请求头修改</Link>
            </li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>版本信息</h2>
          <p>Next.js 版本: 16.x</p>
          <p>Proxy 文件: <strong>proxy.ts</strong>（不再是 middleware.ts）</p>
          <p>Runtime: <strong>Node.js</strong>（强制）</p>
          <p>API: 全面异步</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>测试说明</h2>
          <p>打开浏览器开发者工具，查看 Network 标签页中的响应头：</p>
          <ul>
            <li>x-proxy-version: 应显示 v16</li>
            <li>x-runtime: 应显示 nodejs</li>
            <li>x-file-name: 应显示 proxy.ts</li>
            <li>x-forwarded-by: 应显示 proxy-v16</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Home

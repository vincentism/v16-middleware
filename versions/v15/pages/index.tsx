import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Next.js 15 Middleware 验证</title>
        <meta name="description" content="Next.js 15.x 中间件验证页面（Node.js runtime）" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Next.js 15.x Middleware 验证</h1>
        
        <section style={{ marginTop: '2rem' }}>
          <h2>测试场景</h2>
          
          <h3>1. 基础功能</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/test">/api/test - 测试 API 路由和响应头</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/about">/about - 测试请求重写（重写到 /about-us）</Link>
            </li>
          </ul>

          <h3>2. 认证和授权</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/admin/dashboard">/admin/dashboard - Cookie 认证（无 session 应重定向）</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/protected/dashboard">/protected/dashboard - Header 认证（无 Authorization 应重定向）</Link>
            </li>
          </ul>

          <h3>3. 请求头修改</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/test">/api/test - 查看中间件修改的请求头（在 JSON 响应中）</Link>
            </li>
          </ul>

          <h3>4. 其他功能</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/test?preview=true">/api/test?preview=true - 测试查询参数处理</Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link href="/api/secure/test">/api/secure/test - 测试请求验证（需要 x-api-key header）</Link>
            </li>
          </ul>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>版本信息</h2>
          <p>Next.js 版本: 15.x</p>
          <p>Middleware 文件: middleware.ts</p>
          <p>Runtime: <strong>Edge</strong> (边缘平台只支持 Edge runtime)</p>
          <p>注意: 边缘平台会将 Edge runtime 中间件打包到 Edge Functions</p>
          <p>新特性: 增强的 Edge runtime 功能，userAgent helper，改进的 Cookies API</p>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>测试说明</h2>
          <p>打开浏览器开发者工具，查看 Network 标签页中的响应头：</p>
          <ul>
            <li><strong>x-middleware-version</strong>: v15</li>
            <li><strong>x-runtime</strong>: experimental-edge</li>
            <li><strong>x-ab-test-variant</strong>: variant-a 或 variant-b（A/B 测试）</li>
            <li><strong>x-preferred-lang</strong>: 检测到的语言</li>
            <li><strong>x-country</strong>: 检测到的国家（如果可用）</li>
            <li><strong>x-theme</strong>: 当前主题</li>
          </ul>
          
          <h3>中间件功能列表</h3>
          <ul>
            <li>✅ 认证和授权（Cookie/Header）</li>
            <li>✅ 请求重定向</li>
            <li>✅ 请求重写</li>
            <li>✅ A/B 测试</li>
            <li>✅ 多语言检测</li>
            <li>✅ 地理位置检测</li>
            <li>✅ 主题切换</li>
            <li>✅ User-Agent 检测</li>
            <li>✅ Cookie 操作</li>
            <li>✅ 请求头修改</li>
            <li>✅ 响应头设置</li>
            <li>✅ 查询参数处理</li>
            <li>✅ 缓存控制</li>
            <li>✅ 请求验证</li>
          </ul>
          
          <p><strong>注意</strong>: 此版本配置为 Edge runtime，适用于边缘平台。</p>
        </section>
      </main>
    </div>
  )
}

export default Home

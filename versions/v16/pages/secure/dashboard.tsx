export default function SecureDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>安全仪表板</h1>
      <p>这是受保护的页面，需要 session cookie 才能访问</p>
      <p>如果看到这个页面，说明 proxy 认证检查通过</p>
      <p>这是 Next.js 16 使用 proxy.ts 的示例</p>
    </div>
  )
}

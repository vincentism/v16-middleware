export default function AdminDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>管理员仪表板</h1>
      <p>这是受保护的页面，需要 session cookie 才能访问</p>
      <p>如果看到这个页面，说明中间件认证检查通过</p>
    </div>
  )
}

export default function ProtectedDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>受保护的仪表板</h1>
      <p>需要 Authorization header 才能访问</p>
      <p>如果看到这个页面，说明中间件认证检查通过</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>登录页面</h1>
      <p>这是从受保护页面重定向过来的登录页面</p>
      <p>要访问受保护页面，请在请求头中添加 Authorization header</p>
    </div>
  )
}

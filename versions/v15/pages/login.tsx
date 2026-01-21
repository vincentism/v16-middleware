export default function LoginPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>登录页面</h1>
      <p>这是从受保护页面重定向过来的登录页面</p>
      <p>要访问 /admin 页面，需要设置 session cookie</p>
      <button
        onClick={() => {
          document.cookie = 'session=test-session; path=/; max-age=3600'
          window.location.href = '/admin/dashboard'
        }}
        style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          cursor: 'pointer',
        }}
      >
        设置 Session Cookie 并跳转
      </button>
    </div>
  )
}

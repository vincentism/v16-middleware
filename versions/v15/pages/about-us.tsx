export default function AboutUs() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>关于我们</h1>
      <p>这是通过中间件重写后的页面（/about → /about-us）</p>
      <p>URL 保持为 /about，但内容来自 /about-us</p>
    </div>
  )
}

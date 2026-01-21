import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 检查中间件添加的响应头
  const middlewareVersion = req.headers['x-middleware-version']
  const requestPath = req.headers['x-request-path']
  const timestamp = req.headers['x-timestamp']
  const forwardedBy = req.headers['x-forwarded-by']

  // 读取 theme cookie 并设置到响应头
  const theme = req.cookies.theme
  if (theme) {
    res.setHeader('x-theme', theme)
  } else {
    res.setHeader('x-theme', 'dark')
  }

  res.status(200).json({
    message: 'API 路由测试 (v13)',
    middlewareVersion: middlewareVersion || '未检测到',
    requestPath: requestPath || '未检测到',
    timestamp: timestamp || '未检测到',
    forwardedBy: forwardedBy || '未检测到',
    theme: theme || '未设置',
    allHeaders: Object.keys(req.headers).filter(h => h.startsWith('x-')),
  })
}

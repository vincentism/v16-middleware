import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * /api/user - 测试中间件修改请求头
 * 
 * 验证中间件在 middleware.ts 中修改的请求头是否能正确传递给后端
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 读取中间件修改的请求头
  const forwardedBy = req.headers['x-forwarded-by']
  const modifiedByMiddleware = req.headers['x-modified-by-middleware']

  res.status(200).json({
    message: 'API 路由测试 - 请求头修改验证',
    // 中间件修改的请求头（如果看到这些值，说明中间件成功修改了请求头）
    'x-forwarded-by': forwardedBy || '未检测到',
    'x-modified-by-middleware': modifiedByMiddleware || '未检测到',
  })
}

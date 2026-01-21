import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const proxyVersion = req.headers['x-proxy-version']
  const runtime = req.headers['x-runtime']
  const timestamp = req.headers['x-timestamp']
  const fileName = req.headers['x-file-name']
  const forwardedBy = req.headers['x-forwarded-by']
  const originalPath = req.headers['x-original-path']

  res.status(200).json({
    message: 'API 路由测试 (v16 - Proxy)',
    proxyVersion: proxyVersion || '未检测到',
    runtime: runtime || '未检测到',
    timestamp: timestamp || '未检测到',
    fileName: fileName || '未检测到',
    forwardedBy: forwardedBy || '未检测到',
    originalPath: originalPath || '未检测到',
    allHeaders: Object.keys(req.headers).filter(h => h.startsWith('x-')),
    note: '这是使用 proxy.ts 的 Next.js 16 版本',
  })
}

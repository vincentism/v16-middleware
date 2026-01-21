import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 读取中间件修改的请求头
  const getHeader = (header: string | string[] | undefined): string => {
    if (Array.isArray(header)) return header[0]
    return header || ''
  }

  res.status(200).json({
    message: 'API 路由测试 (v15 - Edge runtime)',
    
    // 基础信息
    middlewareVersion: getHeader(req.headers['x-middleware-version']),
    runtime: getHeader(req.headers['x-runtime']),
    timestamp: getHeader(req.headers['x-timestamp']),
    
    // 请求头修改
    forwardedBy: getHeader(req.headers['x-forwarded-by']),
    originalPath: getHeader(req.headers['x-original-path']),
    
    // A/B 测试
    abTestVariant: getHeader(req.headers['x-ab-test-variant']),
    
    // 多语言和地理位置
    preferredLang: getHeader(req.headers['x-preferred-lang']),
    country: getHeader(req.headers['x-country']),
    
    // 主题
    theme: getHeader(req.headers['x-theme']),
    
    // 预览模式
    previewMode: getHeader(req.headers['x-preview-mode']),
    
    // 客户端信息
    clientId: getHeader(req.headers['x-client-id']),
    
    // 所有 x- 开头的请求头
    allXHeaders: Object.keys(req.headers)
      .filter(h => h.startsWith('x-'))
      .reduce((acc, key) => {
        acc[key] = req.headers[key]
        return acc
      }, {} as Record<string, string | string[] | undefined>),
    
    note: '此版本使用 Edge runtime，适用于边缘平台',
  })
}

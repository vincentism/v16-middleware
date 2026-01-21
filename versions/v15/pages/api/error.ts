import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code || '400'
  const msg = req.query.msg || 'Bad Request'

  res.status(Number(code)).json({
    error: msg,
    code: code,
  })
}

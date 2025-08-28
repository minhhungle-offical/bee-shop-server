import { sendError } from '../utils/sendError.js'
import { verifyToken } from '../utils/token.js'

export const checkPrivileged = (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) return sendError(res, 401, 'Unauthorized: Missing token')

    const user = verifyToken(token)
    req.user = user

    if (user.role !== 'admin') return sendError(res, 403, 'Forbidden: insufficient privileges')

    next()
  } catch (err) {
    return sendError(res, 401, 'Unauthorized: Invalid token')
  }
}

import { RequestHandler } from 'express'
import { CustomError } from '../lib/error'
import { useToken } from '../lib/jwt'
import User from '../models/User'

export const checkAuth: RequestHandler = async (req, res, next) => {
  // get token from req.headers
  let token = req.headers.token as string

  if (!token || !token.startsWith('Bearer ')) {
    throw new CustomError('You are not logged in.', 401)
  }

  token = token.replace('Bearer ', '')
  const userPayload = useToken(token)

  // get user from userPayload.id
  const user = await User.findById(userPayload.id)

  if (!user) {
    throw new CustomError('User not found.', 404)
  }

  // asign user to req.user
  const { password, ...othersUserData } = user._doc
  req.user = othersUserData

  // go to next handler
  next()
}

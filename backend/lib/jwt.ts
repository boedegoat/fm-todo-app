import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'

export const createToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })
}

export const useToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload
}

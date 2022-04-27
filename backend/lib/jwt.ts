import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'
import { dayToMs, secondToMs } from './time'

export interface IToken {
  value: string
  expiresIn: number
}

export const createToken = (user: IUser) => {
  const expiresIn = secondToMs(15)
  const token = {
    value: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn,
    }),
    expiresIn,
  }
  return token
}

export const createRefreshToken = (user: IUser) => {
  const expiresIn = dayToMs(30)
  const refreshToken = {
    value: jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn,
    }),
    expiresIn,
  }
  return refreshToken
}

export const useToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload
}

export const useRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload
}

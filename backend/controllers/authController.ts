import { RequestHandler, Response } from 'express'
import { CustomError } from '../lib/error'
import User, { IUser } from '../models/User'
import { cryptPassword, decryptPassword } from '../lib/crypt'
import { createRefreshToken, createToken, IToken, useRefreshToken } from '../lib/jwt'

const sendTokenCookie = (res: Response, token: IToken) => {
  // send token lifespan to cookie
  const tokenExpiresDate = new Date()
  tokenExpiresDate.setTime(tokenExpiresDate.getTime() + token.expiresIn)
  res.cookie('tokenLifespan', tokenExpiresDate, {
    path: '/',
    expires: tokenExpiresDate,
    sameSite: 'none',
    secure: process.env.PROD ? true : false,
  })
}

const sendRefreshTokenCookie = (res: Response, refreshToken: IToken) => {
  // send refreshToken to httpOnly cookie
  const refreshTokenExpiresDate = new Date()
  refreshTokenExpiresDate.setTime(refreshTokenExpiresDate.getTime() + refreshToken.expiresIn)
  res.cookie('refreshToken', refreshToken.value, {
    path: '/',
    httpOnly: true,
    expires: refreshTokenExpiresDate,
    sameSite: 'none',
    secure: process.env.PROD ? true : false,
  })
}

const deleteTokenCookies = (res: Response) => {
  const currentTime = new Date()
  res.cookie('refreshToken', '', {
    path: '/',
    expires: currentTime,
    sameSite: 'none',
    secure: process.env.PROD ? true : false,
  })
  res.cookie('tokenLifespan', '', {
    path: '/',
    expires: currentTime,
    sameSite: 'none',
    secure: process.env.PROD ? true : false,
  })
}

export const register: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new CustomError('Please provide name, email, and password', 400)
  }

  const newUser = await User.create({
    name,
    email,
    password: cryptPassword(password),
  })

  const token = createToken(newUser)
  const refreshToken = createRefreshToken(newUser)
  sendTokenCookie(res, token)
  sendRefreshTokenCookie(res, refreshToken)

  const { password: p, ...others } = newUser._doc
  res.status(201).json({ ...others, token: token.value })
}

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!email || !password) {
    throw new CustomError('Please provide email and password', 400)
  }

  if (!user) {
    throw new CustomError(`User with email ${email} not found. Please register first.`, 404)
  }

  if (password !== decryptPassword(user.password)) {
    throw new CustomError(`Wrong password.`, 401)
  }

  const token = createToken(user)
  const refreshToken = createRefreshToken(user)
  sendTokenCookie(res, token)
  sendRefreshTokenCookie(res, refreshToken)

  const { password: _, ...others } = user._doc
  res.status(200).json({ ...others, token: token.value })
}

export const refreshToken: RequestHandler = (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    throw new CustomError('you are not logged in', 401)
  }

  const user = useRefreshToken(refreshToken)
  const token = createToken(user as IUser)

  sendTokenCookie(res, token)
  res.status(200).json({ token: token.value })
}

export const logout: RequestHandler = (req, res) => {
  deleteTokenCookies(res)
  res.status(200).json({ message: 'logout success' })
}

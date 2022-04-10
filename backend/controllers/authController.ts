import { RequestHandler } from 'express'
import { CustomError } from '../lib/error'
import User from '../models/User'
import { cryptPassword, decryptPassword } from '../lib/crypt'
import { createToken } from '../lib/jwt'

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

  const { password: p, ...others } = newUser._doc
  const token = createToken(newUser)
  res.status(201).json({ ...others, token })
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
  const { password: p, ...others } = user._doc
  res.status(200).json({ ...others, token })
}

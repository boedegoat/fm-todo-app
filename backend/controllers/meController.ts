import { RequestHandler } from 'express'
import { CustomError } from '../lib/error'
import User from '../models/User'

export const getMe: RequestHandler = (req, res) => {
  const me = req.user
  res.status(200).json(me)
}

export const editMe: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body

  if (!name && !email && !password) {
    throw new CustomError('Please provide name or email or password', 400)
  }

  const editedMe = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      password,
    },
    { new: true }
  )
  const { password: p, ...othersUserData } = editedMe!._doc
  res.status(200).json(othersUserData)
}

export const deleteMe: RequestHandler = async (req, res) => {
  await User.findByIdAndDelete(req.user._id)
  res.status(200).json(`Success delete user with id ${req.user._id}`)
}

import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import authRouter from './routers/auth'
import todoRouter from './routers/todo'
import { CustomError } from './lib/error'
import { IUser } from './models/User'
import { checkAuth } from './middlewares/checkAuth'
import meRouter from './routers/me'
import cookieParser from 'cookie-parser'

// extends express req
declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

const app = express()

// MIDDLEWARES
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://nicetodo.vercel.app/', 'http://localhost:4173'],
  })
)
app.use(express.json())
app.use(cookieParser())

// ROUTERS
app.use('/api/auth', authRouter)
app.use('/api/me', checkAuth, meRouter)
app.use('/api/todos', checkAuth, todoRouter)

// ERROR HANDLERS
// handle route not available
app.use((req, res, next) => {
  throw new CustomError(`${req.method} ${req.path} is not available`, 404)
})
// handle error created by `throw new Error`
app.use(errorHandler)

const start = async () => {
  const port = process.env.PORT || 5000
  const mongodb = await mongoose.connect(process.env.MONGODB_URI)
  console.log(`connected to mongodb (mongoose v${mongodb.version})`)
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

start()

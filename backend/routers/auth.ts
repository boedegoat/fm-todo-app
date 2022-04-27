import { Router } from 'express'
import { login, logout, refreshToken, register } from '../controllers/authController'

const authRouter = Router()

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/refreshToken').get(refreshToken)
authRouter.route('/logout').get(logout)

export default authRouter

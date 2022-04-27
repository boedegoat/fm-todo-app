import { Router } from 'express'
import { login, refreshToken, register } from '../controllers/authController'

const authRouter = Router()

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/refreshToken').get(refreshToken)

export default authRouter

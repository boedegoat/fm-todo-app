import { Router } from 'express'
import { deleteMe, editMe, getMe } from '../controllers/meController'

const meRouter = Router()

meRouter.route('/').get(getMe).put(editMe).delete(deleteMe)

export default meRouter

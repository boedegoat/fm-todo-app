import { Router } from 'express'
import { createNewTodo, deleteTodo, editTodo, getAllTodos } from '../controllers/todoController'

const todoRouter = Router()

todoRouter.route('/').get(getAllTodos).post(createNewTodo)
todoRouter.route('/:id').put(editTodo).delete(deleteTodo)

export default todoRouter

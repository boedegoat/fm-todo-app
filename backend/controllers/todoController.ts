import { RequestHandler } from 'express'
import { CustomError } from '../lib/error'
import Todo from '../models/Todo'
import User from '../models/User'

export const getAllTodos: RequestHandler = async (req, res) => {
  const todos = (await Todo.find({ userId: req.user._id })).map((todo) => {
    const { _id, ...todoDoc } = todo._doc
    return { ...todoDoc, id: _id }
  })
  res.status(200).json(todos)
}

export const createNewTodo: RequestHandler = async (req, res) => {
  const { content } = req.body

  if (!content) {
    throw new CustomError('Please provide todo content', 400)
  }

  const newTodo = await Todo.create({ content, userId: req.user._id })
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { todoPositions: { todoId: newTodo._id } },
  })
  res.status(201).json(newTodo)
}

export const editTodo: RequestHandler = async (req, res) => {
  const { content, isCompleted } = req.body

  if (!content && !isCompleted) {
    throw new CustomError('Please provide content or isCompleted', 400)
  }

  const todoId = req.params.id
  const editedTodo = await Todo.findByIdAndUpdate(todoId, { content, isCompleted }, { new: true })

  if (!editedTodo) {
    throw new CustomError(`Todo with id ${todoId} not found`, 404)
  }

  res.status(200).json(editedTodo)
}

export const deleteTodo: RequestHandler = async (req, res) => {
  const todoId = req.params.id
  const deletedTodo = await Todo.findByIdAndDelete(todoId)

  if (!deletedTodo) {
    throw new CustomError(`Todo with id ${todoId} not found`, 404)
  }

  res.status(200).json(`Success delete todo with id ${todoId}`)
}

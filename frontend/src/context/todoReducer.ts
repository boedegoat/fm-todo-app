import { request } from 'lib/axios'
import { Reducer } from 'react'

export type TodoAction =
  | { type: 'createNewTodo'; payload: Todo }
  | { type: 'setTodo'; payload: Todo[] | undefined }
  | { type: 'editTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: Todo }

const todoReducer: Reducer<Todo[], TodoAction> = (todos, action) => {
  switch (action.type) {
    case 'createNewTodo': {
      request.post('/todos', { content: action.payload.content })
      const newTodo = { id: Date.now().toString(), isCompleted: false, ...action.payload }
      localStorage.todos = JSON.stringify([...todos, newTodo])
      return [...todos, newTodo]
    }

    case 'setTodo': {
      const newTodos = action.payload || todos
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }

    case 'editTodo': {
      request.put(`/todos/${action.payload.id}`, action.payload)
      let newTodos = [...todos]
      const index = newTodos.findIndex((todo) => todo.id === action.payload.id)
      newTodos = [...newTodos.slice(0, index), action.payload, ...newTodos.slice(index + 1)]
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }

    case 'deleteTodo': {
      request.delete(`/todos/${action.payload.id}`)
      let newTodos = [...todos]
      newTodos = newTodos.filter((todo) => todo.id !== action.payload.id)
      // update todoPositions on delete
      request.put('/me', {
        todoPositions: newTodos.map((todo) => ({
          todoId: todo.id,
        })),
      })
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }
  }
}

export default todoReducer

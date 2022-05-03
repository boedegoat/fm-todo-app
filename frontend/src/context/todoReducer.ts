import { authRequest } from 'lib/axios'
import { Reducer } from 'react'

export type TodoAction =
  | { type: 'createNewTodo'; payload: Todo; user: User | null }
  | { type: 'setTodo'; payload: Todo[] | undefined }
  | { type: 'editTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: Todo }

const todoReducer: Reducer<Todo[], TodoAction> = (todos, action) => {
  switch (action.type) {
    case 'createNewTodo': {
      let newTodo = { id: Date.now().toString(), isCompleted: false, ...action.payload }
      localStorage.todos = JSON.stringify([...todos, newTodo])
      if (action.user) {
        authRequest.post('/todos', action.payload).then((res) => {
          const localTodos = JSON.parse(localStorage.todos)
          const thisTodoIdx = localTodos.findIndex((todo: Todo) => todo.id == newTodo.id)
          localStorage.todos = JSON.stringify([
            ...localTodos.slice(0, thisTodoIdx),
            { ...newTodo, id: res.data._id },
            ...localTodos.slice(thisTodoIdx + 1),
          ])
          newTodo.id = res.data._id
          return [...todos, newTodo]
        })
      }
      return [...todos, newTodo]
    }

    case 'setTodo': {
      const newTodos = action.payload || todos
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }

    case 'editTodo': {
      authRequest.put(`/todos/${action.payload.id}`, action.payload)
      let newTodos = [...todos]
      const index = newTodos.findIndex((todo) => todo.id === action.payload.id)
      newTodos = [...newTodos.slice(0, index), action.payload, ...newTodos.slice(index + 1)]
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }

    case 'deleteTodo': {
      authRequest.delete(`/todos/${action.payload.id}`)
      let newTodos = [...todos]
      newTodos = newTodos.filter((todo) => todo.id !== action.payload.id)
      localStorage.todos = JSON.stringify(newTodos)
      return newTodos
    }
  }
}

export default todoReducer

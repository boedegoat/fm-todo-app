import { Reducer } from 'react'

export const initialState: State = {
  todos: [],
}

const todoReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'createNewTodo': {
      const newTodo = { id: Date.now().toString(), isCompleted: false, ...action.payload }
      localStorage.todos = JSON.stringify([...state.todos, newTodo])
      return { ...state, todos: [...state.todos, newTodo] }
    }

    case 'setTodo': {
      const newTodos = action.payload || state.todos
      localStorage.todos = JSON.stringify(newTodos)
      return { ...state, todos: newTodos }
    }

    case 'editTodo': {
      let newTodos = [...state.todos]
      const index = newTodos.findIndex((todo) => todo.id === action.payload.id)
      newTodos = [...newTodos.slice(0, index), action.payload, ...newTodos.slice(index + 1)]
      localStorage.todos = JSON.stringify(newTodos)
      return { ...state, todos: newTodos }
    }

    case 'deleteTodo': {
      let newTodos = [...state.todos]
      newTodos = newTodos.filter((todo) => todo.id !== action.payload.id)
      localStorage.todos = JSON.stringify(newTodos)
      return { ...state, todos: newTodos }
    }
  }
}

export default todoReducer

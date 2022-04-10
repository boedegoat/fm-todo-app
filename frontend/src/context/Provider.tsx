import { request } from 'lib/axios'
import { createContext, FC, useEffect, useMemo, useReducer, useState } from 'react'
import todoReducer, { TodoAction } from './todoReducer'
import useDarkMode, { Theme } from './useDarkMode'

interface IContext {
  todos: {
    todos: Todo[]
    dispatchTodos: React.Dispatch<TodoAction>
  }
  auth: {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
  }
  theme: {
    theme: Theme
    setTheme: (theme: 'toggle' | Theme) => void
  }
}

export const Context = createContext({} as IContext)

const formatUser = (user: any) => {
  const { _id, token, ...userData } = user
  return { ...userData, id: user._id }
}

const Provider: FC = ({ children }) => {
  const [todos, dispatchTodos] = useReducer(todoReducer, [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const res = await request().get('/me')
      setUser(formatUser(res.data))
    }
    getUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await request().post('/auth/login', { email, password })
    localStorage.token = res.data.token
    setUser(formatUser(res.data))
  }

  const logout = async () => {
    delete localStorage.token
    setUser(null)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await request().post('/auth/register', { name, email, password })
    localStorage.token = res.data.token
    setUser(formatUser(res.data))
  }

  return (
    <Context.Provider
      value={{
        todos: { todos, dispatchTodos },
        auth: { user, login, logout, register },
        theme: useDarkMode(),
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Provider

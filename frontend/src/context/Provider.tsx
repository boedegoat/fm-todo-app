import axios from 'axios'
import { authRequest, request } from 'lib/axios'
import { createContext, FC, useEffect, useReducer, useState } from 'react'
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

let token = ''

export const getToken = () => token
export const setToken = (value: string) => {
  token = value
}

const formatUser = (user: any) => {
  const { _id, token, ...userData } = user
  return { ...userData, id: user._id }
}

const Provider: FC = ({ children }) => {
  const [todos, dispatchTodos] = useReducer(todoReducer, [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    refreshToken()
  }, [])

  const getUser = async () => {
    try {
      const res = await authRequest.get('/me')
      setUser(formatUser(res.data))
    } catch (err: any) {
      if (err instanceof axios.Cancel) {
        // silent
      }
    }
  }

  const refreshToken = async () => {
    const { data } = await request.get('/auth/refreshToken')
    setToken(data.token)
    getUser()
  }

  const login = async (email: string, password: string) => {
    const res = await request.post('/auth/login', { email, password })
    setToken(res.data.token)
    setUser(formatUser(res.data))
  }

  const logout = async () => {
    delete localStorage.token
    setUser(null)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await request.post('/auth/register', { name, email, password })
    setToken(res.data.token)
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

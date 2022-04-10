import { createContext, FC, useReducer } from 'react'
import todoReducer, { initialState } from './todoReducer'

export const Context = createContext<
  [State, React.Dispatch<Action>]
  // @ts-ignore
>(null)

const Provider: FC = ({ children }) => {
  return (
    <Context.Provider value={useReducer(todoReducer, initialState)}>{children}</Context.Provider>
  )
}

export default Provider

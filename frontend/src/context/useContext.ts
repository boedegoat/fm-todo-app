import { useContext as useReactContext } from 'react'
import { Context } from './Provider'

export const useContext = () => useReactContext(Context)

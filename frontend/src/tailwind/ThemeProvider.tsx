import { createContext, FC, useContext } from 'react'
import useDarkMode from './useDarkMode'
import { SetThemeType, ThemeType } from './typings'

// @ts-ignore
const ThemeContext = createContext<[theme: ThemeType, setTheme: SetThemeType]>(null)

export function useTheme() {
  return useContext(ThemeContext)
}

const ThemeProvider: FC = ({ children }) => {
  return <ThemeContext.Provider value={useDarkMode()}>{children}</ThemeContext.Provider>
}

export default ThemeProvider

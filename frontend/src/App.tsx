import MoonIcon from 'images/icon-moon.svg'
import SunIcon from 'images/icon-sun.svg'
import Todos from 'components/Todos'
import { useTheme } from 'tailwind/ThemeProvider'
import { useContext } from 'context/useContext'
import { useEffect } from 'react'
import CreateTodo from 'components/CreateTodo'
import TopBar from 'components/TopBar'
import { request } from 'lib/axios'

const App = () => {
  const [, setTheme] = useTheme()
  const { todos, dispatchTodos } = useContext().todos
  const { user } = useContext().auth

  useEffect(() => {
    const getMyTodos = async () => {
      try {
        const res = await request().get('/todos')
        // @ts-ignore
        return res.data.map((todo) => {
          const { _id, ...todoData } = todo
          return { ...todoData, id: _id }
        })
      } catch (err) {
        return null
      }
    }

    const setTodos = async () => {
      // on first render, set todos from localStorage
      if (!('todos' in localStorage)) {
        localStorage.todos = JSON.stringify(todos)
      }

      let cloudTodos
      if (user) cloudTodos = await getMyTodos()

      dispatchTodos({
        type: 'setTodo',
        payload: cloudTodos ?? JSON.parse(localStorage.todos),
      })
    }
    setTodos()
  }, [user])

  return (
    <main>
      <TopBar />
      <header className='header'>
        <div className='wrapper h-full flex flex-col'>
          <div className='flex items-center justify-between'>
            <h1 className='text-light-gray font-bold text-3xl lg:text-4xl tracking-[8px]'>TODO</h1>
            <button onClick={() => setTheme('toggle')}>
              <img className='dark:hidden w-5 lg:w-auto' src={MoonIcon} alt='moon-icon' />
              <img className='hidden dark:block w-5 lg:w-auto' src={SunIcon} alt='sun-icon' />
            </button>
          </div>
          <CreateTodo />
        </div>
      </header>
      <Todos />
    </main>
  )
}

export default App

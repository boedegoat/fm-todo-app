import { useContext } from 'context/useContext'
import { useEffect, useState } from 'react'
import Login from './Login'

const TopBar = () => {
  const { user, logout } = useContext().auth
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (showLogin) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [showLogin])

  return (
    <div className='bg-light-grayish-blue-400 dark:bg-dark-desaturated-blue text-white py-2'>
      <div className='wrapper'>
        {user ? (
          <div className='flex justify-between'>
            <p>Logged in as {user.name}</p>
            <button onClick={logout} className='text-red'>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setShowLogin(true)}>Login</button>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
          </>
        )}
      </div>
    </div>
  )
}

export default TopBar

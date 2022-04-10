import { useContext } from 'context/useContext'
import { FC, useState } from 'react'

interface Props {
  onClose: () => void
}

const Login: FC<Props> = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const { login } = useContext().auth

  const onLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      const [email, password] = (e.target as HTMLFormElement).elements
      // @ts-ignore
      const { error } = await login(email.value, password.value)
      console.log(error)
      onClose()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const onRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
  }

  return (
    <div className='fixed z-10 inset-0 '>
      <div className='absolute inset-0 bg-dark-blue/80' onClick={onClose} />
      <form
        onSubmit={!isRegister ? onLogin : onRegister}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-light-grayish-blue-400
                   p-6 rounded-2xl space-y-8 shadow-md min-w-[350px]'
      >
        {isRegister && <input className='w-full py-2' type='text' placeholder='name' />}
        <input className='w-full py-2' name='email' type='email' placeholder='email' />
        <input className='w-full py-2' name='password' type='password' placeholder='password' />
        <button
          type='submit'
          className='bg-primary-blue hover:bg-primary-blue/50 text-white px-4 py-2 rounded-md'
        >
          {!isRegister ? 'Login' : 'Register'}
        </button>

        {error && <p className='text-red'>{error}</p>}

        {/* Bottom */}
        {!isRegister ? (
          <p>
            Don't have an account yet ?{' '}
            <button onClick={() => setIsRegister(true)} type='button' className='text-primary-blue'>
              Register
            </button>
          </p>
        ) : (
          <p>
            Already have an account ?{' '}
            <button
              onClick={() => setIsRegister(false)}
              type='button'
              className='text-primary-blue'
            >
              Login
            </button>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login

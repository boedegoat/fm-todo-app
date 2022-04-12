import { useContext } from 'context/useContext'
import { FC, useState } from 'react'

interface Props {
  onClose: () => void
}

const Login: FC<Props> = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useContext().auth
  const [loading, setLoading] = useState(false)

  const onLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      // @ts-ignore
      const [email, password]: HTMLInputElement[] = (e.target as HTMLFormElement).elements
      setLoading(true)
      await login(email.value, password.value)
      onClose()
    } catch (err: any) {
      setError(err.response.data.message)
    }
    setLoading(false)
  }

  const onRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      // @ts-ignore
      const [name, email, password]: HTMLInputElement[] = (e.target as HTMLFormElement).elements
      setLoading(true)
      await register(name.value, email.value, password.value)
      onClose()
    } catch (err: any) {
      setError(err.response.data.message)
    }
    setLoading(false)
  }

  return (
    <div className='fixed z-10 inset-0'>
      <div className='absolute inset-0 bg-dark-blue/95' onClick={onClose} />
      <form
        onSubmit={!isRegister ? onLogin : onRegister}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-light-grayish-blue-400 dark:bg-dark-desaturated-blue dark:text-light-gray
                   p-6 rounded-2xl space-y-8 shadow-md w-[90%] sm:w-[500px]'
      >
        {isRegister && <input className='w-full py-2' name='name' type='text' placeholder='name' />}
        <input className='w-full py-2' name='email' type='email' placeholder='email' />
        <input className='w-full py-2' name='password' type='password' placeholder='password' />
        <button
          type='submit'
          disabled={loading}
          className='bg-primary-blue hover:bg-primary-blue/50 disabled:bg-primary-blue/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md'
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

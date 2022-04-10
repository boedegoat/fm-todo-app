import React from 'react'
import ReactDOM from 'react-dom'
import './tailwind/tailwind.css'
import App from './App'
import ThemeProvider from 'tailwind/ThemeProvider'
import Provider from 'context/Provider'

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

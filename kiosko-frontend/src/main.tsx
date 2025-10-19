import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/auth-context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </HeroUIProvider>
  </React.StrictMode>,
)

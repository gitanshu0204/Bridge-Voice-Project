import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// Apply saved settings on app load
const savedSettings = localStorage.getItem('bridgevoice_settings')
if (savedSettings) {
  const settings = JSON.parse(savedSettings)
  if (settings.theme) {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }
  if (settings.fontSize) {
    document.documentElement.setAttribute('data-fontsize', settings.fontSize)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
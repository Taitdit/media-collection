import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.scss";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <div className='mention'><img src='.\tmdb-logo.svg' alt='tmdb logo' height="15px" /><p className='small'>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>
  </StrictMode>
)

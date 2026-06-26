import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.scss";
import { ThemeProvider } from "./components/context/ThemeProvider.jsx";
import App from './App.jsx'
import Footer from './components/Footer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Footer />
    </ThemeProvider>
  </StrictMode>
)

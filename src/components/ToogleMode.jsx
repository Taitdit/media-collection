import { useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"

const ToogleMode = () => {
    const { theme, toggleTheme } = useContext(ThemeContext)
    return (
        <div className="toogleMode">
          <label>
              Dark mode :
              <div className='toogleMode__switch'>
              <input type="checkbox" onChange={toggleTheme} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    toggleTheme();
                  }
                }}
                checked={theme !== 'light'}
              aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'} />
              <span className='slider'></span>
              </div>
          </label>
        </div>    
    )
}
export default ToogleMode
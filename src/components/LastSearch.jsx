import { useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"

const LastSearch = ({lastSearch, clearMoovie}) => {
      const { theme } = useContext(ThemeContext)
    
    return (
        <div className="lastSearch">
            <h2 className="lastSearch__label" aria-label={`Votre recherche pour : ${lastSearch}`}>Votre recherche pour : <b>{lastSearch}</b></h2>
            <button className={`cta-primary${theme !== 'light' ? '-dark' : ''  }`} onClick={clearMoovie}>Supprimer la recherche</button>
        </div>
    )
}   
export default LastSearch


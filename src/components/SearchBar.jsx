import { useState, useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
const SearchBar = ({ onSearch, className }) => {
    const { theme } = useContext(ThemeContext)

    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        const cleaned = query.trim();
        if(!cleaned) return
        
        onSearch(cleaned)
        setQuery("")

    }

    return (
    <div className={className}>
      <p className="search__info">Utilisez la barre de recherche ci-dessous pour trouver votre film, série, animé, série animée ou téléfilm...</p>
    <form className="search__form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        className={`search__input ${theme}`}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      
      <button className={`cta-primary${theme !== 'light' ? '-dark' : ''}`} type="submit">Rechercher</button>
    </form>
    </div>
  );
}

export default SearchBar;
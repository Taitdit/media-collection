import { useState } from "react";

const SearchBar = ({ onSearch, className }) => {

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
      <p className="search__info">Utilisez la barre de recherche ci-dessous pour trouver votre, film, série, animé, série animé ou téléfilm...</p>
    <form className="search__form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        className="search__input"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      
      <button className="search__button" type="submit">Rechercher</button>
    </form>
    </div>
  );
}

export default SearchBar;
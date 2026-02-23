import { useState } from "react";

const SearchBar = ({ onSearch }) => {

    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        const cleaned = query.trim();
        if(!cleaned) return
        
        onSearch(cleaned)
        setQuery("")

    }

    return (
    <>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      
      <button type="submit">Rechercher</button>
    </form>
    </>
  );
}

export default SearchBar;
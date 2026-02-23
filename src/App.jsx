import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MediaGrid from "./components/MediaGrid";
import { mockResults } from "./utils/mockResults";



const App = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [results, setResults] = useState([]);


  const handleSearch = (value) => {
    setLastSearch(value)
    const filtered = mockResults.filter((item) => {
        const q = value.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.titleFr?.toLowerCase().includes(q)
        )
    }
    );
    setResults(filtered)
  };
 return (
    <div className="app">
      <header className="app__header">
        <h1>Ma collection</h1>
      </header>

      <main className="app__main">
        <SearchBar onSearch={handleSearch} />

        <section className="results-section">
          {lastSearch ? <p>Votre recherche pour : {lastSearch}</p> : <p>Recherchez votre film via la barre de recherche ci-dessus</p>}
          <MediaGrid items={results} />
        </section>
      </main>
    </div>
 )
}

export default App

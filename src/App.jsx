import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MediaGrid from "./components/MediaGrid";
import { mockResults } from "./utils/mockResults";



const App = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState('all')

  useEffect(() => {
    setResults(mockResults);
  }, []);

  const filtered = results.filter(item => {
    const okYear = selectedYear === "all" || item.year === Number(selectedYear)
    const okType = selectedType === "all" || item.type === selectedType
    const okGenre = selectedGenre === "all" || (item.genres ?? []).includes(selectedGenre)
    return okYear && okType && okGenre;
  })
  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedGenre("all");
  };
  const sorted = [...filtered].sort((a, b) => {
    const aName = a.titleFr || a.title || ""
    const bName = b.titleFr || b.title || ""
    return aName.localeCompare(bName, "fr", {
      sensitivity: "base",
    });
  });

  const allMoviesShow = () => {
    setLastSearch("")
    clearFilters()
    setResults(mockResults)
  }
  const handleSearch = (value) => {
    setLastSearch(value)
    const q = value.trim().toLowerCase();
    if(!q) {
      setResults(mockResults)
      return
    }
    const filtered = mockResults.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.titleFr?.toLowerCase().includes(q)
        )
    }
    );
    setResults(filtered)

  };
  const availableYears = [...new Set(results.map(item => item.year))].filter(Boolean).sort((a, b) => a - b);
  const availableTypes = [...new Set(results.map(item => item.type))].filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));
  const availableGenres = [...new Set(results.flatMap((item) => item.genres ?? [])),].filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));

  
 return (
    <div className="app">
      <header className="app__header">
        <h1>Ma collection</h1>
      </header>

      <main className="app__main">
        <SearchBar onSearch={handleSearch} />
        {lastSearch.length > 0 && <button onClick={allMoviesShow}>Tout afficher</button>}    
        <section className="results-section">
          {lastSearch ? <p>Votre recherche pour : {lastSearch}</p> : <p>Recherchez votre film via la barre de recherche ci-dessus</p>}
          {availableYears.length > 0 && (    
          <select name="years" value={selectedYear} id="years-select" onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all" key="Toutes les années">Toutes les années</option>             
            {availableYears.map((year) => (
              <option value={year} key={year}>{year}</option>
            ))}
          </select>
          )}
          {availableTypes.length > 0 && (
          <select name="types" value={selectedType} id="types-select" onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all" key="Tous les formats">Tous les formats</option>             
             {availableTypes.map((type) => (
                <option value={type} key={type}>{type}</option>
             ))}
          </select>)
          }
          {availableGenres.length > 0 && (
          <select name="genres" value={selectedGenre} id="genres-select"  onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="all" key="Tous les genres">Tous les genres</option>             
             {availableGenres.map((genre) => (
                <option value={genre} key={genre}>{genre}</option>
             ))}
          </select>)
          }
          {(selectedYear !== "all" || selectedType !== "all" || selectedGenre !== "all") && (
          <button onClick={clearFilters}>
            Réinitialiser les filtres
          </button>
          )}
          <MediaGrid items={sorted} />
        </section>
      </main>
    </div>
 )
}

export default App

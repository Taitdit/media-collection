import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MediaGrid from "./components/MediaGrid";
// import { mockResults } from "./utils/mockResults";
import { searchMulti } from "./services/tmdb";
import useTmdbGenres from "./hooks/useTmdbGenres";



const App = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState('all')

  const toYear = (item) => {
    const dateStr =
      item.media_type === "movie"
        ? item.release_date
        : item.first_air_date;

    return dateStr ? Number(dateStr.substring(0, 4)) : null;
  };
  const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();

  // useEffect(() => {
  //   setResults(mockResults);
  // }, []);

  
//   const testTmdb = async () => {
//   const token = import.meta.env.VITE_TMDB_TOKEN;

//   try {
//     const data = await searchMulti("Breaking Bad", token);
//     console.log("TMDB RAW RESPONSE:", data);
//     console.log("MOVIE GENRE MAP:", movieGenreMap);
//     console.log("TV GENRE MAP:", tvGenreMap);

//         const first = data.results.find((r) => r.media_type === "movie");
//     if (first) {
//       const names = (first.genre_ids ?? [])
//         .map((id) => movieGenreMap[id])
//         .filter(Boolean);
//       console.log("FIRST MOVIE GENRES:", names);
//     }

//   } catch (err) {
//     console.error("TMDB ERROR:", err);
//   }
// };

  const filtered = results.filter(item => {
    const genresReady = Object.keys(movieGenreMap).length > 0 && Object.keys(tvGenreMap).length > 0;
    const okYear = selectedYear === "all" || toYear(item) === Number(selectedYear)
    const okType = selectedType === "all" || item.media_type === selectedType
    const okGenre = selectedGenre === "all" ||(genresReady && (item.genre_ids ?? []).map((id) => {
       return item.media_type === "movie" ? movieGenreMap[id] : tvGenreMap[id]
      
    }).filter(Boolean).includes(selectedGenre)) 
  
    return okYear && okType && okGenre;
  })
  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedGenre("all");
  };
  const sorted = [...filtered].sort((a, b) => {
    const aName = a.title || a.original_title || a.original_name || ""
    const bName = b.title || b.original_title || b.original_name || ""
    return aName.localeCompare(bName, "fr", {
      sensitivity: "base",
    });
  });

  const allMoviesShow = () => {
    setLastSearch("")
    clearFilters()
    setResults([])
  }
  const handleSearch = async (value) => {
    setLastSearch(value)
    const q = value.trim().toLowerCase();
    
    if(!q) {
      clearFilters()
      setResults([])
      return
    }

    const token = import.meta.env.VITE_TMDB_TOKEN;

    try {
      const data = await searchMulti(q, token)

      const cleanedResults = (data.results ?? []).filter(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      );
        clearFilters();
        setResults(cleanedResults);

    } catch (err) {
      console.error("TMDB search error:", err);
      setResults([]);
    }
  };
  const availableYears = [...new Set(results.map(item => toYear(item)))].filter(Boolean).sort((a, b) => a - b);
  const availableTypes = [...new Set(results.map(item => item.media_type))].filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));
  const availableGenres = [
  ...new Set(
    results.flatMap((item) => {
      const ids = item.genre_ids ?? [];
      const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;

      return ids.map((id) => mapForType[id]).filter(Boolean);
    })
  ),
].sort((a, b) => a.localeCompare(b, "fr"));

  
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
        {/* <button onClick={testTmdb}>
  Test TMDB
</button> */}
      </main>
    </div>
 )
}

export default App

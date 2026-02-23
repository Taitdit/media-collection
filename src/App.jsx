import { useState } from "react";
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

  
  const testTmdb = async () => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  try {
    const data = await searchMulti("Matrix", token);
    console.log("TMDB RAW RESPONSE:", data);

  } catch (err) {
    console.error("TMDB ERROR:", err);
  }
};

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
const getDate = (item) => {
  const dateStr =
    item.media_type === "movie"
      ? item.release_date
      : item.first_air_date;

  return dateStr ? new Date(dateStr).getTime() : 0;
};

const sorted = [...filtered].sort((a, b) => {
  return getDate(b) - getDate(a); // décroissant (plus récent d'abord)
});;

  const allMoviesShow = () => {
    setLastSearch("")
    clearFilters()
    setResults([])
  }

  const normalize = (s = "") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const cleanEdgePunct = (w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");

const splitBySpaces = (s = "") =>
  normalize(s)
    .split(/\s+/)
    .map(cleanEdgePunct)
    .filter(Boolean);

    
  const getTitleVariants = (item) => [
  item?.title,
  item?.original_title,
  item?.name,
  item?.original_name,
].filter(Boolean);

  const wordMatches = (titleWord, qWord) => {
  if (!titleWord || !qWord) return false;
  if (titleWord === qWord) return true;
  if (titleWord.includes("-")) return false;
  return titleWord.endsWith(qWord);
};

  
const matchesTitleStrict = (item, query) => {
  const qWords = splitBySpaces(query).filter((w) => w.length >= 2);
  if (qWords.length === 0) return false;

  const allTitleWords = getTitleVariants(item).flatMap(splitBySpaces);

  // (tu as demandé de supprimer la règle "titres longs => 2 mots")
  return qWords.some((qw) => allTitleWords.some((tw) => wordMatches(tw, qw)));
};


  const hasDescription = (item) => {
    const o = item?.overview;
    return typeof o === "string" && o.trim().length >= 30;
  };

  const hasImage = (item) => Boolean(item?.poster_path || item?.backdrop_path);

  const hasDocumentary = (item) => {
      const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
      return (item.genre_ids ?? [])
        .map((id) => mapForType[id])
        .filter(Boolean)
        .includes("Documentaire");
  }
  const hasNotDocumentary = (item) => !hasDocumentary(item);

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
      const pagesToFetch = 7;

      const pageResponses = await Promise.all(
        Array.from({ length: pagesToFetch }, (_, i) => searchMulti(q, token, i + 1))
      );
    
      const combined = pageResponses.flatMap((p) => p?.results ?? []);

      const cleanedResults = combined.filter(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      );

      const filtered = cleanedResults.filter(hasNotDocumentary).filter(hasImage).filter(hasDescription).filter((item) => matchesTitleStrict(item, q));

        clearFilters();
        setResults(filtered);

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
        <button onClick={testTmdb}>
  Test TMDB
</button>
      </main>
    </div>
 )
}

export default App

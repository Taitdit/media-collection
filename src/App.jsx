import { useState } from "react";
import Header from './components/Header.jsx'
import MediaGrid from "./components/MediaGrid";
// import { mockResults } from "./utils/mockResults";
import { searchMulti } from "./services/tmdb";
import useTmdbGenres from "./hooks/useTmdbGenres";
import LastSearch from "./components/LastSearch";





const App = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState('all')



  const [selectedGenres, setSelectedGenres] = useState(['all'])
  const [selectedTypes, setSelectedTypes] = useState(["all"])




  const toYear = (item) => {
    const dateStr =
      item.media_type === "movie"
        ? item.release_date
        : item.first_air_date;

    return dateStr ? Number(dateStr.substring(0, 4)) : null;
  };
  const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();

  const genresReady =
    Object.keys(movieGenreMap).length > 0 && Object.keys(tvGenreMap).length > 0;

  const getGenreNames = (item) => {
    if (!genresReady) return [];
    const ids = item.genre_ids ?? [];
    const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
    return ids.map((id) => mapForType[id]).filter(Boolean);
  };

  const hasGenre = (item, name) => getGenreNames(item).includes(name);

  const filtered = results.filter((item) => {
    const okYear = selectedYear === "all" || toYear(item) === Number(selectedYear);

    const okTypes = 
     selectedTypes.includes("all") ||
     selectedTypes.some((s) => {
      return (
        (s === "movie" && item.media_type === "movie" && !hasGenre(item, "Animation") && !hasGenre(item, "Téléfilm")) ||
        (s === "tv" && item.media_type === "tv" && !hasGenre(item, "Animation") && !hasGenre(item, "Téléfilm")) ||
        (s === "telefilm" && hasGenre(item, "Téléfilm")) ||
        (s === "animated_movie" && item.media_type === "movie" && hasGenre(item, "Animation")) ||
        (s === "animated_tv" && item.media_type === "tv" && hasGenre(item, "Animation"))
      )
     })

      // const okGenre =
      // selectedGenre === "all" ||
      // getGenreNames(item).includes(selectedGenre);

     const okGenres = 
     selectedGenres.includes('all') ||
      getGenreNames(item).some(i => selectedGenres.includes(i));

      
    return okYear && okTypes && okGenres;
  });

  const toogleBtnFilter = (t, prev) => {
      if(t === 'all') return ["all"]
      const withoutAll = prev.filter((x) => x !== 'all')

      if(withoutAll.includes(t)) {
        const next = withoutAll.filter((x) => x !== t)
        return next.length === 0 ? ['all'] : next 
      }
      return [...withoutAll, t]
  }

  const toggleFilter = (t, wichbutton) => {
      if(wichbutton === 'type') setSelectedTypes((prev) => toogleBtnFilter(t, prev))
      if(wichbutton === 'genre') setSelectedGenres((prev) => toogleBtnFilter(t, prev))
  }

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedTypes(["all"])
    setSelectedGenres(["all"]);
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
  });

  const clearMoovie = () => {
    setLastSearch("")
    clearFilters()
    setResults([])
  }

  const normalize = (s = "") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  const cleanEdgePunct = (w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");

  const splitBySpaces = (s = "") => normalize(s).split(/\s+/).map(cleanEdgePunct).filter(Boolean);

    
  const getTitleVariants = (item) => [item?.title, item?.original_title, item?.name, item?.original_name,].filter(Boolean);

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
    return qWords.some((qw) => allTitleWords.some((tw) => wordMatches(tw, qw)));
  };


  const hasDescription = (item) => {
    const o = item?.overview;
    return typeof o === "string" && o.trim().length >= 30;
  };

  const hasYear = (item) => {
    const year = toYear(item)
    return typeof year === 'number' && !Number.isNaN(year)
  }

  const hasLang = (item) => Boolean(item?.original_language)

  const hasImage = (item) => Boolean(item?.poster_path || item?.backdrop_path);

  const hasDocumentary = (item) => {
      const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
      return (item.genre_ids ?? [])
        .map((id) => mapForType[id])
        .filter(Boolean)
        .includes("Documentaire");
  }
  const hasNotDocumentary = (item) => !hasDocumentary(item);

  const hasGenreExist = (item) => {
    if(item?.genre_ids.length === 1 && (hasGenre(item, "Animation") || hasGenre(item, "Téléfilm"))) return false

    return Boolean(item?.genre_ids.length > 0)
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
      const pagesToFetch = 17;

      const pageResponses = await Promise.all(
        Array.from({ length: pagesToFetch }, (_, i) => searchMulti(q, token, i + 1))
      );
    
      const combined = pageResponses.flatMap((p) => p?.results ?? []);

      const cleanedResults = combined.filter(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      );

      const filtered = cleanedResults.filter(hasNotDocumentary).filter(hasGenreExist).filter(hasYear).filter(hasLang).filter(hasImage).filter(hasDescription).filter((item) => matchesTitleStrict(item, q));
      
        clearFilters();
        setResults(filtered);

    } catch (err) {
      console.error("TMDB search error:", err);
      setResults([]);
    }
  };

  const baseTypes = [...new Set(results.map((item) => item.media_type))].filter(Boolean);
  const hasAnimatedMovie = results.some((item) => item.media_type === "movie" && hasGenre(item, "Animation"));
  const hasAnimatedTv = results.some((item) => item.media_type === "tv" && hasGenre(item, "Animation"));
  const hasTelefilm = results.some((item) => hasGenre(item, "Téléfilm"))


  const availableYears = [...new Set(results.map(item => toYear(item)))].filter(Boolean).sort((a, b) => a - b);
  const availableTypes = [...baseTypes, ...(hasAnimatedMovie ? ["animated_movie"] : []), ...(hasAnimatedTv ? ["animated_tv"] : []), ...(hasTelefilm ? ["telefilm"] : []) ]
  .sort((a, b) => a.localeCompare(b, "fr"));
 


  const availableGenres = [
  ...new Set(
    results.flatMap((item) => getGenreNames(item))
  ),
].filter((g) => g !== "Animation").filter((g) => g !== "Téléfilm").sort((a, b) => a.localeCompare(b, "fr"))

const typeLabel = (t) => t === "movie" ? "Film" : t === "tv" ? "Série" : t === "animated_movie" ? "Animation" : t === "animated_tv" ? "Série animée" : t === "telefilm" ? "Téléfilm" : t==="all" ? "Tous les formats" : t;
const typeGenre = (t) => t === "all" ? "Tous les genres" : t

const classResult = () => lastSearch.length <= 0 ?  "results-section empty" : sorted?.length ? "results-section" : "results-section empty"

 return (
  <>
    <Header handleSearch={handleSearch} />
    <div className="app">
      <main className="app__main">
        <section className={classResult()}>
          {lastSearch?.length ? <LastSearch lastSearch={lastSearch} /> : <p>Recherchez votre film via la <b>barre de recherche</b></p> }    

          {availableTypes.length > 0 && (

          <div>
            <h3>Selectionnez le type de format :</h3>
            <button type="button" value="all" key='all' onClick={() => toggleFilter('all', 'type')}>Tous les formats</button>
            {availableTypes.map((type) => (
              <button type="button" value={type} key={type} onClick={() => toggleFilter(type, 'type')}>{typeLabel(type)}</button>
            ))}
            <p>Format selectionné : {typeLabel(selectedTypes.map(typeLabel).join(", "))}</p>
          </div>

          )
          }
          {availableGenres.length > 0 && (
            <div>
            <h3>Selectionnez le genre :</h3>
            <button type="button" value="all" key='all' onClick={() => toggleFilter('all', 'genre')}>Tous les formats</button>
            {availableGenres.map((genre) => (
              <button type="button" value={genre} key={genre} onClick={() => toggleFilter(genre, 'genre')}>{genre}</button>
            ))}
            <p>Genre selectionné : {selectedGenres.map(typeGenre).join(", ")}</p>
          </div>
          )
          }
          
          {availableYears.length > 0 && (    
            <div>
              <h3>Selectionnez l'année :</h3>
              <select name="years" value={selectedYear} id="years-select" onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all" key="Toutes les années">Toutes les années</option>             
                {availableYears.map((year) => (
                  <option value={year} key={year}>{year}</option>
                ))}
              </select>
            </div>

          
          )}


          {(selectedYear !== "all" || selectedTypes[0] !== "all" || selectedGenres[0] !== "all") && (
          <button onClick={clearFilters}>
            Réinitialiser les filtres
          </button>
          )}
          { lastSearch?.length > 0 && <MediaGrid items={sorted} />}
        </section>

      </main>
    </div>
  </>
 )
}

export default App

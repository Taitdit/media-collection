import { useEffect, useState, useContext } from "react";
import Header from './components/Header.jsx'
import MediaGrid from "./components/MediaGrid";
// import { mockResults } from "./utils/mockResults";
import { searchMulti } from "./services/tmdb";
import useTmdbGenres from "./hooks/useTmdbGenres";
import LastSearch from "./components/LastSearch";
import NoResult from "./components/NoResult"
import Filters from "./components/Filters"
import { ListProvider } from "./components/context/ListContext.jsx";
import {ThemeContext} from "./components/context/ThemeContext.jsx"

const App = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [results, setResults] = useState([]);
  const [resultsJSon, setResultJson] = useState([]);

  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedGenres, setSelectedGenres] = useState(['all'])
  const [selectedTypes, setSelectedTypes] = useState(["all"])
  const [msgError, setMsgError] = useState(false)
  const [filmFilter, setFilmFilter] = useState('all')
  const [tab, setTab] = useState('search')

  const { theme } = useContext(ThemeContext)
  const darkmode = theme !== 'light' ? '-dark' : ''

  
  useEffect(() => {
    const body = document.querySelector('body')
    const removeAndAdd = (bool, value) => {
      let valueNeg = ''
      value === "light" ? valueNeg = 'dark' : valueNeg = 'light'
      if(bool) {
        body.classList.remove(value)
        body.classList.add(valueNeg)
      } else {
          body.classList.add(valueNeg)
      }
    }
    theme !== 'light' ? body.classList.contains('light') ? removeAndAdd(true, 'light') : removeAndAdd(false, 'light')  : body.classList.contains('dark') ? removeAndAdd(true, 'dark') : removeAndAdd(false, 'dark')
  },[theme])
    
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

  const filtered = (results) => {
    return results.filter((item) => {
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

     const okGenres = 
     selectedGenres.includes('all') ||
      getGenreNames(item).some(i => selectedGenres.includes(i));

      
    return okYear && okTypes && okGenres;
    });
  }

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

  const clearFilters = (clearRadio) => {
    setSelectedYear("all");
    setSelectedTypes(["all"])
    setSelectedGenres(["all"]);
    clearRadio && setFilmFilter("all")
  };

  const getDate = (bool, item) => {
    const dateStr =
      item.media_type === "movie"
        ? item.release_date
        : item.first_air_date;

    return !bool ? dateStr ? new Date(dateStr).getTime() : 0 : item.year ? item.year : 0;
  };

  const sorted = [...filtered(results)].sort((a, b) => {
    return getDate(false,b) - getDate(false,a); // décroissant (plus récent d'abord)
  });
  const sortedJson = [...filtered(resultsJSon)].sort((a, b) => {
    return getDate(true,b) - getDate(true,a); // décroissant (plus récent d'abord)
  }); 

  const clearMoovie = () => {
    setLastSearch("")
    clearFilters(true)
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



useEffect(() => {
  fetch("/filmotheque.json")
    .then(res => res.json())
    .then(data => setResultJson(data))
}, [])

  const handleSearch = async (value) => {
    setLastSearch(value)
    const q = value.trim().toLowerCase();
    
    if(!q) {
      clearFilters(true)
      setResults([])
      setTab('search')
      return
    }

    const token = import.meta.env.VITE_TMDB_TOKEN;

    try {
      const pagesToFetch = 10;

      const pageResponses = await Promise.all(
        Array.from({ length: pagesToFetch }, (_, i) => searchMulti(q, token, i + 1))
      );
    
      const combined = pageResponses.flatMap((p) => p?.results ?? []);

      const cleanedResults = combined.filter(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      );

      const filtered = cleanedResults.filter(hasNotDocumentary).filter(hasGenreExist).filter(hasYear).filter(hasLang).filter(hasImage).filter(hasDescription).filter((item) => matchesTitleStrict(item, q));
      
        clearFilters(true);
        msgError && setMsgError(true)

        setResults(filtered);
        setTab('search')

    } catch (err) {
      console.error("TMDB search error:", err);
      !msgError && setMsgError(true)
      setResults([]);
      setTab('search')
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
    <div className={`app${darkmode}`}>
      <main className="app__main">
        <div className="tabs">
          <button className={`tabs__tab${tab === 'search' ? ' selected' : ''}`} onClick={() => setTab('search')} disabled={tab === 'search'}>Votre recherche</button>
          <button className={`tabs__tab${tab !== 'search' ? ' selected' : ''}`} onClick={() => setTab('medias')} disabled={tab !== 'search'}>Ma médiathèque</button>
        </div>
        {
          tab === 'search' ?  
          <section className={classResult()}>
        
          {!msgError ?
            <>
            {lastSearch?.length ? <LastSearch lastSearch={lastSearch} clearMoovie={clearMoovie} /> : <NoResult emptyResult={false}/> }

            <div className={`container ${!sorted?.length ? 'empty' : ''}`}>

          {!!(availableTypes?.length || availableGenres?.length || availableYears?.length) &&
            <Filters 
            availableTypes={availableTypes} 
            availableGenres={availableGenres} 
            availableYears={availableYears}
            toggleFilter={toggleFilter}
            typeLabel={typeLabel}
            typeGenre={typeGenre}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
            selectedTypes={selectedTypes}
            selectedGenres={selectedGenres}
            clearFilters={clearFilters}
            /> 
            }

          { lastSearch?.length > 0 &&     
          <ListProvider>
            <MediaGrid 
              jsonItems={false}
              items={sorted} 
              setFilmFilter={setFilmFilter} 
              filmFilter={filmFilter} />
              </ListProvider>}
          </div>
          </>
          :
          <p>&#128557; Désolé il semblerait qu'il y ait un problème avec l'API qui charge les films</p>
          }
          
          </section> : 
          <section className="mediaTed">
            <ListProvider><MediaGrid jsonItems={true} items={sortedJson} setFilmFilter={setFilmFilter} 
              filmFilter={filmFilter} /></ListProvider>
          </section>
        }

      </main>
    </div>
  </>
 )
}

export default App

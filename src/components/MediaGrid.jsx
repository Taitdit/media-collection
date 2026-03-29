import { useMemo, useContext } from "react";
import {ListContext} from "./context/ListContext.jsx"
import MediaCard from "./MediaCard";
import useTmdbGenres from "../hooks/useTmdbGenres";
import useFilmotheque from "../hooks/useFilmotheque";
import NoResult from "./NoResult";
import RadioFilter from "./RadioFilter";


const MediaGrid = ({jsonItems, items, filmFilter, setFilmFilter }) => {
const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();
const { list } = useContext(ListContext)



const normalizeTitle = (s) => (s ?? "").toLowerCase().replace(/['’]/g, "'").replace(/[:\-–—]/g, " ").replace(/\s+/g, " ").trim();
const library = useFilmotheque();

const normalizeType = (s) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "'")
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const makeKey = (type, title, year) =>
  `${normalizeType(type)}|${normalizeTitle(title)}|${year}`;

const formatPriority = (format = "") => {
  const f = format.toLowerCase();

  if (f === "blu-ray") return 3;
  if (f === "dvd") return 2;
  if (f === "disque-dur") return 1;
  return 0;
};

const libraryIndex = useMemo(() => {
  const m = new Map();

  library.forEach((x) => {
    const key = makeKey(x.type, x.name, x.year);
    const existing = m.get(key);
    
    if (!existing || formatPriority(x.format) > formatPriority(existing.format)) {
      m.set(key, x);
    }
  });

  return m;
}, [library]);


  const owned = (item) => {
    if (jsonItems) {
      return item;
    }


    const titles = trueTitle(item);
   
    const type = jsonItems ? item.type : typeLabel(item);
   
    const year = jsonItems ? item.year : toYear(item); 
    return libraryIndex.get(makeKey(type, titles.fr, year)) || libraryIndex.get(makeKey(type, titles.original, year)) || null
  }
  
  const toYear = (item) => {
    const dateStr =
      item.media_type === "movie"
        ? item.release_date
        : item.first_air_date;

    return dateStr ? Number(dateStr.substring(0, 4)) : null;
  };
  const trueTitle = (item) => {
    const dataObjectTitle = {
      fr : '',
      original : ''
    }
    item.media_type === "movie" ? dataObjectTitle.fr = item.title : dataObjectTitle.fr = item.name
    item.media_type === "movie" ? dataObjectTitle.original = item.original_title : dataObjectTitle.original = item.original_name
    return dataObjectTitle
  }
  const typeLabel = (item) => {
    const ids = item.genre_ids ?? [];
    const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
    const hasAnimation = ids.map((id) => mapForType[id]).filter(Boolean).includes("Animation")
    const hastelefilm = ids.map((id) => mapForType[id]).filter(Boolean).includes("Téléfilm")
    if(hasAnimation && item.media_type === "movie") return 'Animation'
    if(hasAnimation && item.media_type === "tv") return 'Série animée'
    if(hastelefilm) return 'Téléfilm'
    return item.media_type === "movie" ? "Film" : "Série"
  }

  const hideCard = (item) => {
    if(owned(item)) {
      if(filmFilter === 'physicalAndDisc' && (owned(item).format?.toLowerCase() !== "dvd" && owned(item).format?.toLowerCase() !== "blu-ray" && owned(item).format?.toLowerCase() !== "disque-dur")) return true
      if(filmFilter === 'physical' && (owned(item).format?.toLowerCase() !== "dvd" && owned(item).format?.toLowerCase() !== "blu-ray")) return true
      if(filmFilter === 'disc' && (owned(item).format?.toLowerCase() !== "disque-dur")) return true
    } else {
      if (filmFilter !== 'all')  {
        return true
     }
    }
     return false
  }

  if (!items?.length) {
    return (
    <div className="container_search">
    <NoResult emptyResult={true} />
    </div>
    )
  }

  const setGenre = (item) => {
      const ids = item.genre_ids ?? [];
      const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
      const arrayGenre =  ids.map((id) => mapForType[id]).filter(Boolean)
      return arrayGenre.filter((v) => v !== 'Animation').filter((v) => v !== 'Téléfilm')
  }

  return (
    <div className="container_search">
    {items.length &&  (
      <RadioFilter jsonItems={jsonItems} filmFilter={filmFilter} setFilmFilter={setFilmFilter}/>
     )}
    <div className={`media-grid${list ? ' list' : ''}`}>
      {jsonItems ? 
        items.map((item) => (
          <MediaCard
            jsonItems={jsonItems}
            key={`${item.type}:${item.id}`}
            id={item.id}
            hide={hideCard(item)}   
            img={item.img}
            title={item.name}
            type={item.type}
            year={item.year}
            owned={owned(item)}
          />
        ))
      :
        items.map((item) => (
          <MediaCard
            jsonItems={jsonItems}
            key={`${item.media_type}:${item.id}`}
            id={item.id}
            hide={hideCard(item)}        
            img={item.poster_path}
            title={trueTitle(item)}
            type={typeLabel(item)}
            year={toYear(item)}
            description={item.overview}
            lang={item.original_language}
            country={item.origin_country}
            owned={owned(item)}
            genre= {setGenre(item)}
          />
        ))
      }

    </div>
    </div>
  );
};

export default MediaGrid;
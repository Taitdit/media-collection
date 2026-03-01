import { useMemo, useState } from "react";
import MediaCard from "./MediaCard";
import useTmdbGenres from "../hooks/useTmdbGenres";
import useFilmotheque from "../hooks/useFilmotheque";

const MediaGrid = ({ items }) => {
const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();
const [filmFilter, setFilmFilter] = useState('all')


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

const libraryIndex = useMemo(() => {
  const m = new Map();
  library.forEach((x) => {
    m.set(makeKey(x.type, x.name, x.year), x)
  });
  return m;
}, [library]);

  const owned = (item) => {
    const titles = trueTitle(item);
    const type = typeLabel(item);
    const year = toYear(item)
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
    <>
    <p>Recherchez votre film via la <b>barre de recherche</b></p>
    <p>&#128557; Aucun résultat</p>
    </>
    )
  }

  return (
    <>
    {items.length && (
<form className="yourVideo">
  <label>
    <input
      type="radio"
      name="filmFilter"
      value="all"
      checked={filmFilter === "all"}
      onChange={(e) => setFilmFilter(e.target.value)}
    />
    Afficher tous les médias de la recherche
  </label>
  <label>
    <input
      type="radio"
      name="filmFilter"
      value="physicalAndDisc"
      checked={filmFilter === "physicalAndDisc"}
      onChange={(e) => setFilmFilter(e.target.value)}
    />
    Afficher tous les médias de la recherche que j'ai 
  </label>
  <label>
    <input
      type="radio"
      name="filmFilter"
      value="physical"
      checked={filmFilter === "physical"}
      onChange={(e) => setFilmFilter(e.target.value)}
    />
    Afficher tous les médias de la recherche que j'ai en DVD ou Blu-ray 
  </label>

  <label>
    <input
      type="radio"
      name="filmFilter"
      value="disc"
      checked={filmFilter === "disc"}
      onChange={(e) => setFilmFilter(e.target.value)}
    />
    Afficher tous les médias de la recherche que j'ai sur disque
  </label>
</form>
     )}
    <div className="media-grid">
      {items.map((item) => (

        <MediaCard
          key={`${item.media_type}:${item.id}`}
          hide={hideCard(item)}        
          img={item.poster_path}
          title={trueTitle(item)}
          type={typeLabel(item)}
          year={toYear(item)}
          description={item.overview}
          lang={item.original_language}
          country={item.origin_country}
          owned={owned(item)}
          genre= {
            (() => {
            const ids = item.genre_ids ?? [];
            const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
            const arrayGenre =  ids.map((id) => mapForType[id]).filter(Boolean)
            return arrayGenre.filter((v) => v !== 'Animation').filter((v) => v !== 'Téléfilm')
          })()
        }
        />
      ))}
    </div>
    </>
  );
};

export default MediaGrid;
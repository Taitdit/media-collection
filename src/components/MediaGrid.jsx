import MediaCard from "./MediaCard";
import useTmdbGenres from "../hooks/useTmdbGenres";


const MediaGrid = ({ items }) => {
  const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();
  console.log(items)

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
    if(hasAnimation) return 'Animation'
    return item.type === "movie" ? "Film" : "Série"
  }


  if (!items?.length) {
    return <p>Aucun résultat pour le moment.</p>;
  }

  return (
    <div className="media-grid">
      {items.map((item) => (

        <MediaCard
          key={`${item.media_type}:${item.id}`}          
          img={item.poster_path}
          title={trueTitle(item)}
          type={typeLabel(item)}
          year={toYear(item)}
          description={item.overview}
          lang={item.original_language}
          country={item.origin_country}
          genre= {
            (() => {
            const ids = item.genre_ids ?? [];
            const mapForType = item.media_type === "movie" ? movieGenreMap : tvGenreMap;
            return ids.map((id) => mapForType[id]).filter(Boolean);
          })()
        }
        />
      ))}
    </div>
  );
};

export default MediaGrid;
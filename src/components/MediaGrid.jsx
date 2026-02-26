import MediaCard from "./MediaCard";
import useTmdbGenres from "../hooks/useTmdbGenres";


const MediaGrid = ({ items }) => {
  const { movieGenreMap, tvGenreMap, loadingGenres, genresError } = useTmdbGenres();

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
          type={item.media_type}
          year={toYear(item)}
          description={item.overview}
          country={item.original_language}
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
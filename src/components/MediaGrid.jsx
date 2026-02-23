import MediaCard from "./MediaCard";

const MediaGrid = ({ items }) => {
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
          key={`${item.type}:${item.id}`}
          img={item.poster_path}
          title={trueTitle(item)}
          type={item.media_type}
          year={toYear(item)}
          description={item.overview}
          country={item.original_language}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
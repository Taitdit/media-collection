import MediaCard from "./MediaCard";

const MediaGrid = ({ items }) => {
  if (!items?.length) {
    return <p>Aucun résultat pour le moment.</p>;
  }

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard
          key={`${item.type}:${item.id}`}
          titlefr={item.titleFr}
          title={item.title}
          type={item.type}
          year={item.year}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
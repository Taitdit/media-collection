const MediaCard = ({ titlefr, title, type, year }) => {
  return (
    <article className="media-card">
      <h3 className="media-card__title">{titlefr}</h3>
      <p>Titre original : {title}</p>
      <p className="media-card__meta">
        {type} {year ? `• ${year}` : ""}
      </p>
    </article>
  );
};

export default MediaCard;
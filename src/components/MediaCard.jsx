const MediaCard = ({ titlefr, title, country, type, description, year }) => {
  return (
    <article className="media-card">
      <h3 className="media-card__title">{titlefr ? titlefr : title}</h3>
      <p>Titre original : {title}</p>
      <p className="media-card__meta">
        {type} {year ? `• ${year}` : ""} {country ? `• ${country}` : ""}
      </p>
      <p className="description">{description}</p>
    </article>
  );
};

export default MediaCard;
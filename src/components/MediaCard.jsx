import ImgCard from "./ImgCard";


const MediaCard = ({title, img, genre , country, type, description, year }) => {
    const genreList = Array.isArray(genre) ? genre : [];
  return (
    <article className="media-card">
      <ImgCard picture={img} title={title} />
      <h3 className="media-card__title">{title.fr || title.original || "Titre inconnu"}</h3>
      <p>Titre original : {title.original}</p>
      <p className="media-card__meta">
        {type} {year ? `• ${year}` : ""} {country ? `• ${country}` : ""}
      </p>
      <p>Genre : {genreList?.join(", ")}</p> 
      <p className="description">{description}</p>
    </article>
  );
};

export default MediaCard;
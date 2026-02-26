import ImgCard from "./ImgCard";


const MediaCard = ({title, img, genre , lang, country, type, description, year }) => {
  console.log(country)
    const genreList = Array.isArray(genre) ? genre : [];
  return (
    <article className="media-card">
      <ImgCard picture={img} title={title} />
      <h3 className="media-card__title">{title.fr || title.original || "Titre inconnu"}</h3>
      <p>Titre original : {title.original}</p>
      {type ?<p className="media-card__meta">Format : {type}</p> : ''}
      {year ?<p className="media-card__meta">Année • {year}</p> : ''}
      {lang ?<p className="media-card__meta">Langue d'origine • {lang}</p> : ''}
      {country ? <ul className="media-card__meta">Pays : {country.map((g) => <li>{g}</li>)}</ul> : ''}

      
      {genreList ? <ul className="media-card__meta">Genres : {genreList.map((g) => <li key={g}>{g}</li>)}</ul> : ''}
      <p className="description">{description}</p>
    </article>
  );
};

export default MediaCard;
import { useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import ImgCard from "./ImgCard";


const MediaCard = ({title, img, genre , lang, hide, country, owned, type, description, year }) => {

    const { theme } = useContext(ThemeContext)

    const genreList = Array.isArray(genre) ? genre : [];
    const format = owned?.format?.toLowerCase();
    const hideOrShow =  hide ? 'hidden' : ''
    const formatClass = format === "dvd" ? "dvd" : format === "blu-ray" ? "bluray" : format === "disque-dur" ? "dd" : "";
    const classArticle = `media-card ${formatClass} ${hideOrShow}`
  return (
    <article className={classArticle}>
      
      <h3 className="media-card__title">{title.fr || title.original || "Titre inconnu"}</h3>

      <div className="container">
        <ImgCard  picture={img} title={title} />
        <div className="infos">
            <p>Titre original : {title.original}</p>
            {type ?<p className="media-card__meta">Format : {type}</p> : ''}
            {year ?<p className="media-card__meta">Année : {year}</p> : ''}
            {lang ?<p className="media-card__meta">Langue d'origine : {lang}</p> : ''}
            {country ? <ul className="media-card__meta">Pays : {country.map((g) => <li  key={g}>{g}</li>)}</ul> : ''}
            {genreList ? <ul className="media-card__meta">Genres : {genreList.map((g) => <li key={g}>{g}</li>)}</ul> : ''}
            <p className="description">{description}</p>
        </div>
      </div>

    </article>
  );
};

export default MediaCard;
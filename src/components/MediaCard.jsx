import { useContext, useState } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import {ListContext} from "./context/ListContext.jsx"
import ImgCard from "./ImgCard";


const MediaCard = ({id, title, img, genre , lang, hide, country, owned, type, description, year }) => {

    const { theme } = useContext(ThemeContext)
    const { list } = useContext(ListContext)
    const [bulleInfo, setBulleInfo] = useState(false) 

    const genreList = Array.isArray(genre) ? genre : [];
    const format = owned?.format?.toLowerCase();
    const hideOrShow =  hide ? ' hidden' : ''
    const formatClass = format === "dvd" ? " dvd" : format === "blu-ray" ? " bluray" : format === "disque-dur" ? " dd" : "";
    const classArticle = `media-card${formatClass}${hideOrShow}${theme !== 'light' ? ' dark' : ''}${list ? ' list' : ''}`
  return (
    <article className={classArticle}>
    
      <div className={`media-card__container${list ? ' list' : ''}`}>
        <ImgCard format={format} popin={false} picture={img} title={title} />
        <div className="media-card__infos">
          <h3 className="media-card__title">{title.fr || title.original || "Titre inconnu"}</h3>

          <div className="media-card__btn">
          {type ?
                <p className="infos__type">Format : <span className="info">{type}</span></p>
           : ''}
           <button className={`cta-four${theme !== 'light' ? '-dark' : ''}`} onClick={() => setBulleInfo((prev) => !prev)}>Infos</button>
         </div>
            {title.original || genreList || description || year || lang || country ?
            <div onClick={() => setBulleInfo((prev) => !prev)} className={`infos__sup${bulleInfo ? ' active' : ''}`}>
              <div className={`infos__container${theme !== 'light' ? ' dark' : ''}`}>
                <div className="cross"></div>
                <h3 className="media-card__title">{title.fr || title.original || "Titre inconnu"}</h3>
                <div className="float">
                  <ImgCard popin={true} picture={img} title={title} />
                    {title.original ? <p className="media-card__meta">Titre original : <span className="info">{title.original}</span></p> : ''}
                    {year ?<p className="media-card__meta">Année : <span className="info">{year}</span></p> : ''}
                    {lang ?<p className="media-card__meta">Langue d'origine : <span className="info">{lang}</span></p> : ''}
                    {country ? <div className="media-card__meta">Pays : <ul>{country.map((g) => <li  key={g}>{g}</li>)}</ul></div> : ''}
                    {genreList ? <div className="media-card__meta">Genres : <ul>{genreList.map((g) => <li key={g}>{g}</li>)}</ul></div> : ''}
                    {description ? <p className="description"><span className="info">{description}</span></p> : ''}
                </div>
              </div>
            </div>
            : ''}
        </div>
      </div>

    </article>
  );
};

export default MediaCard;
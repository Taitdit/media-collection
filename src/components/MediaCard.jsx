import { useContext, useState, useEffect } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import {ListContext} from "./context/ListContext.jsx"
import InfoYourMedia from "./InfoYourMedia"
import ImgCard from "./ImgCard";
import { fetchDetails } from "../services/tmdb";

// tmdb:movie:82702
// tmdb:tv:26453

const MediaCard = ({jsonItems, id, title, img, genre , lang, hide, country, owned, type, description, year }) => {

    const { theme } = useContext(ThemeContext)
    const { list } = useContext(ListContext)
    const [bulleInfo, setBulleInfo] = useState(false) 
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);

    const idForDetails = `tmdb:${
      type ? (type==='série animée' || type==='série') ? 'tv' : 'movie' : ''
    }:${id ? id : ''}`

    useEffect(() => {
        if (!bulleInfo) return;
        if (!idForDetails) return;
        if (details ) return;
      
        let cancelled = false;
    
        (async () => {
          try {
            setError(null);
    
            const data = await fetchDetails(idForDetails);
            if (!cancelled) setDetails(data);
          } catch (e) {
            if (!cancelled) setError(e?.message ?? "Erreur de chargement");
          }
        })();
    
        return () => {
          cancelled = true;
        };
      }, [bulleInfo, idForDetails, details]);

    const genreList = Array.isArray(genre) ? genre : [];
    const format = owned?.format?.toLowerCase();
    const hideOrShow =  hide ? ' hidden' : ''
    const formatClass = format === "dvd" ? " dvd" : format === "blu-ray" ? " bluray" : format === "disque-dur" ? " dd" : "";
    const classArticle = `media-card${formatClass}${hideOrShow}${theme !== 'light' ? ' dark' : ''}${list ? ' list' : ''}`
    const wichTitle = jsonItems ? title : title.fr || title.original || "Titre inconnu"
    const needToLoad = () => {
       if(!jsonItems) {
        if (title.original || genreList.length > 0 || description || year || lang || (country?.length > 0)) return false
       } 
       return true
    }
    return (
    <article className={classArticle}>
    
      <div className={`media-card__container${list ? ' list' : ''}`}>
        <ImgCard format={format} popin={false} picture={img} title={wichTitle} />
        <div className="media-card__infos">
          <h3 className="media-card__title">{wichTitle}</h3>
          {id && <p className="hidden">tmdb:movie:{id}</p>}
          {img && <p className="hidden">{img}</p>}
          
          <div className="media-card__btn">
          {type ?
                <p className="infos__type">Format : <span className="info">{`${type[0].toUpperCase()}${type.replace(type[0],'')}`}</span></p>
           : ''}
           <button className={`cta-four${theme !== 'light' ? '-dark' : ''}`} onClick={() => setBulleInfo((prev) => !prev)}>Infos</button>
         </div>
            {!needToLoad() ?
            <div onClick={() => setBulleInfo((prev) => !prev)} className={`infos__sup${bulleInfo ? ' active' : ''}`}>
              <div className={`infos__container${theme !== 'light' ? ' dark' : ''}`}>
                <div className="cross"></div>
                <h3 className="media-card__title">{wichTitle}</h3>
                <div className="float">
                  <ImgCard popin={true} picture={img} title={title} />
                    {title.original ? <p className="media-card__meta">Titre original : <span className="info">{title.original}</span></p> : ''}
                    {lang ?<p className="media-card__meta">Langue d'origine : <span className="info">{lang}</span></p> : ''}
                    {details?.origin_country ? <div className="media-card__meta">Pays : <ul>{details.origin_country.map((g) => <li  key={g}>{g}</li>)}</ul></div> : ''}
                    {genreList ? <div className="media-card__meta">Genres : <ul>{genreList.map((g) => <li key={g}>{g}</li>)}</ul></div> : ''}
                    {(details?.budget && details.budget > 0)  ? <p className="media-card__meta">Budget : <span className="info">{new Intl.NumberFormat('fr-FR').format(details.budget)}</span></p> : ''}
                    {description ? <p className="media-card__meta">Scénario :<br/><span className="description">{description}</span></p> : ''}

                </div>
              </div>
            </div>
            : <InfoYourMedia id={id} setBulleInfo={setBulleInfo} bulleInfo={bulleInfo} title={wichTitle} img={img} />}
            {year ?<p className="media-card__meta">Année : <span className="info">{year}</span></p> : ''}
        </div>
      </div>

    </article>
  );
};

export default MediaCard;
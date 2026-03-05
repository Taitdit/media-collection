

import { useContext, useState, useEffect } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import ImgCard from "./ImgCard";
import { fetchDetails } from "../services/tmdb";



const InfoYourMedia = ({ id, setBulleInfo, bulleInfo, title, img}) => {
  const { theme } = useContext(ThemeContext);

  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);



useEffect(() => {
    if (!bulleInfo) return;
    if (!id) return;
    if (details ) return;
  
    let cancelled = false;

    (async () => {
      try {
        setError(null);

        const data = await fetchDetails(id);
        if (!cancelled) setDetails(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Erreur de chargement");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bulleInfo, id, details]);

  const close = (e) => {
    e.stopPropagation();
    setBulleInfo(false);
  };

  const original = details?.original_title || details?.original_name;
    return (

      <div onClick={close} className={`infos__sup${bulleInfo ? ' active' : ''}`}>
        <div className={`infos__container${theme !== 'light' ? ' dark' : ''}`}>
        <div className="cross"></div>
        <h3 className="media-card__title">{title}</h3>
        <div className="float">
            <ImgCard popin={true} picture={img} title={title} />
            {error && <p className="media-card__meta">Erreur : {error}</p>}

            {original ? <p className="media-card__meta">Titre original : <span className="info">{original}</span></p> : ''}
            {details?.original_language && (
                <p className="media-card__meta">
                Langue d'origine : <span className="info">{details.original_language}</span>
                </p>
            )}
            {details?.origin_country ? <div className="media-card__meta">Pays : <ul>{details.origin_country.map((g) => <li  key={g}>{g}</li>)}</ul></div> : ''}
            {details?.genres ?   <div className="media-card__meta">Genres : <ul>{details.genres.map((g) => <li key={g.name}>{g.name}</li>)}</ul></div> : ''}
            {(details?.budget && details.budget > 0)  ? <p className="media-card__meta">Budget : <span className="info">{new Intl.NumberFormat('fr-FR').format(details.budget)}</span></p> : ''}
            {details?.overview && (
                <p className="media-card__meta">Scénario :<br/>
                <span className="description">{details.overview}</span>
                </p>
            )}
          </div>
        </div>
      </div>

    )
}

export default InfoYourMedia
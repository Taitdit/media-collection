import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";
import { ListContext } from "./context/ListContext";
import ImgCard from "./ImgCard";
import { fetchDetails } from "../services/tmdb";

const MediaCard = ({
  id,
  title,
  img,
  hide,
  owned,
  type,
  year,
}) => {
  const { theme } = useContext(ThemeContext);
  const { list } = useContext(ListContext);

  const [bulleInfo, setBulleInfo] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const format = owned?.format?.toLowerCase();
  const hideOrShow = hide ? " hidden" : "";

  const formatClass =
    format === "dvd"
      ? " dvd"
      : format === "blu-ray"
      ? " bluray"
      : format === "disque-dur"
      ? " dd"
      : "";

  const classArticle = `media-card${formatClass}${hideOrShow}${
    theme !== "light" ? " dark" : ""
  }${list ? " list" : ""}`;

  const normalize = (value = "") =>
    value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const tmdbType = () => {
    const normalizedType = normalize(type);

    if (normalizedType === "serie" || normalizedType === "serie animee") {
      return "tv";
    }

    return "movie";
  };

  const idForDetails = id ? `tmdb:${tmdbType()}:${id}` : null;

  useEffect(() => {
    if (!bulleInfo) return;
    if (!idForDetails) return;
    if (details) return;

    let cancelled = false;

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchDetails(idForDetails);

        if (!cancelled) {
          setDetails(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? "Erreur de chargement");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [bulleInfo, idForDetails, details]);

  const toggle = () => {
    setBulleInfo((prev) => !prev);
    document.body.classList.toggle("ohi");
  };

  const formatLabel =
    format === "blu-ray"
      ? "Blu-ray"
      : format === "disque-dur"
      ? "Disque dur"
      : format === "dvd"
      ? "DVD"
      : owned?.format;

  return (
    <article className={classArticle}>
      <div className={`media-card__container${list ? " list" : ""}`}>
        <ImgCard
          imgTmdb={true}
          format={format}
          popin={false}
          picture={img}
          title={title}
        />

        <div className="media-card__infos">
          <h3 className="media-card__title">{title}</h3>

          <div className="media-card__btn">
            {type && (
              <p className="infos__type">
                Type : <span className="info">{type}</span>
              </p>
            )}

            <button
              className={`cta-four${theme !== "light" ? "-dark" : ""}`}
              onClick={toggle}
            >
              Infos
            </button>
          </div>

          {year && (
            <p className="media-card__meta">
              Année : <span className="info">{year}</span>
            </p>
          )}

          {formatLabel && (
            <p className="media-card__meta">
              Format : <span className="info">{formatLabel}</span>
            </p>
          )}

          <div
            className={`infos__bgPopin${bulleInfo ? " active" : ""}`}
            onClick={toggle}
          ></div>

          <div
            className={`infos__sup${bulleInfo ? " active" : ""}${
              theme !== "light" ? " dark" : ""
            }`}
          >
            <div className="cross" onClick={toggle}></div>

            <h3 className="media-card__title">{title}</h3>

            <div className="float">
              <ImgCard
                imgTmdb={true}
                popin={true}
                picture={img}
                title={title}
              />

              {loading && <p>Chargement des infos...</p>}

              {error && (
                <p className="media-card__meta">
                  Impossible de charger les infos TMDB.
                </p>
              )}

              {details?.original_title && (
                <p className="media-card__meta">
                  Titre original :{" "}
                  <span className="info">{details.original_title}</span>
                </p>
              )}

              {details?.original_name && (
                <p className="media-card__meta">
                  Titre original :{" "}
                  <span className="info">{details.original_name}</span>
                </p>
              )}

              {details?.original_language && (
                <p className="media-card__meta">
                  Langue d'origine :{" "}
                  <span className="info">{details.original_language}</span>
                </p>
              )}

              {details?.origin_country?.length > 0 && (
                <div className="media-card__meta">
                  Pays :
                  <ul>
                    {details.origin_country.map((country) => (
                      <li key={country}>{country}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details?.genres?.length > 0 && (
                <div className="media-card__meta">
                  Genres :
                  <ul>
                    {details.genres.map((genre) => (
                      <li key={genre.id}>{genre.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details?.budget > 0 && (
                <p className="media-card__meta">
                  Budget :{" "}
                  <span className="info">
                    {new Intl.NumberFormat("fr-FR").format(details.budget)}
                  </span>
                </p>
              )}

              {details?.overview && (
                <p className="media-card__meta">
                  Scénario :
                  <br />
                  <span className="description">{details.overview}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MediaCard;
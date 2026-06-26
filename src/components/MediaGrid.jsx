import { useContext, useEffect, useState } from "react";
import { ListContext } from "./context/ListContext";
import { ThemeContext } from "./context/ThemeContext";
import { useSticky } from "./context/useSticky";
import MediaCard from "./MediaCard";
import Grille from "./svg/Grille";
import Liste from "./svg/Liste";
import FilterA from "./svg/FilterA";
import FilterB from "./svg/FilterB";

const MediaGrid = ({
  items,
  query,
  selectedType,
  setSelectedType,
  selectedFormat,
  setSelectedFormat,
  sortMode,
  setSortMode,
  clearSearch,
}) => {
  const { list, toggleList } = useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const { fixed } = useSticky();

  const [showFilsters, setShowFilters] = useState(false);
  const [openClass, setOpenClass] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenClass(showFilsters ? " open" : "");
    }, 500);

    return () => clearTimeout(timer);
  }, [showFilsters]);

  const classContainer = showFilsters ? "show" : "";

  return (
    <>
      <div className="container-filter">
        <div
          className={`filters${theme !== "light" ? "-dark" : ""} games${
            fixed ? " fixed" : ""
          }${showFilsters ? " open" : openClass}`}
        >
          <button
            className={`cta-acc${theme !== "light" ? "-dark" : ""}`}
            onClick={() => setShowFilters((currentValue) => !currentValue)}
          >
            <span className="label">Filtres</span>
            {!showFilsters ? (
              <FilterA className="picto" />
            ) : (
              <FilterB className="picto" />
            )}
          </button>

          <div className={`filters__container ${classContainer}`}>
            <div className="filters__card">
              <h3>Tri :</h3>

              <div className="filters__buttons">
                <select
                  className={`cta-tertiary${theme !== "light" ? "-dark" : ""}`}
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                >
                  <option value="alpha">Alphabétique</option>
                  <option value="recent">Plus récent au plus ancien</option>
                  <option value="oldest">Plus ancien au plus récent</option>
                </select>
              </div>
            </div>

            <div className="filters__card">
              <h3>Type :</h3>

              <div className="filters__buttons">
                <select
                  className={`cta-tertiary${theme !== "light" ? "-dark" : ""}`}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="film">Film</option>
                  <option value="serie">Série</option>
                  <option value="animation">Animation</option>
                  <option value="serie animee">Série animée</option>
                </select>
              </div>
            </div>

            <div className="filters__card">
              <h3>Format :</h3>

              <div className="filters__buttons">
                <select
                  className={`cta-tertiary${theme !== "light" ? "-dark" : ""}`}
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="dvd">DVD</option>
                  <option value="blu-ray">Blu-ray</option>
                  <option value="disque-dur">Disque dur</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container_search">
        {items.length ? (
          <div className={`radioFilter ${theme !== "light" ? "dark" : ""}`}>
            <h3 className="lastSearch__label">
              Utilisez la barre de recherche pour trouver un film ou une série...
            </h3>

            {query.length > 0 ? (
              <div className="lastSearch">
                <h2
                  className="lastSearch__label"
                  aria-label={`Votre recherche pour : ${query}`}
                >
                  Votre recherche pour : <b>{query}</b>
                </h2>

                <button
                  className={`cta-primary${theme !== "light" ? "-dark" : ""}`}
                  onClick={clearSearch}
                >
                  Supprimer la recherche
                </button>
              </div>
            ) : (
              <p className="lastSearch__label">
                <b>Toute ma filmothèque :</b>
              </p>
            )}

            <button className="radioFilter__list" onClick={toggleList}>
              {list ? <Liste className="picto" /> : <Grille className="picto" />}
            </button>
          </div>
        ) : null}

        {!items.length ? (
          <div className="results-section empty">
            <button
              className={`cta-primary${theme !== "light" ? "-dark" : ""}`}
              onClick={clearSearch}
            >
              Supprimer la recherche
            </button>

            <p>😭 Apparemment je n’ai pas le film ou la série recherché.</p>
            <p>
              🔎 Recherchez votre film via la <b>barre de recherche</b>
            </p>
          </div>
        ) : (
          <>
            <div className="separation"></div>

            <div className={`media-grid${list ? " list" : ""}`}>
              {items.map((item) => (
                <MediaCard
                  key={`${item.type}:${item.id}:${item.format}`}
                  id={item.id}
                  hide={false}
                  img={item.img}
                  title={item.name}
                  type={item.type}
                  year={item.year}
                  owned={item}
                />
                
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MediaGrid;
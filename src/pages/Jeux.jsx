import { useEffect, useMemo, useContext, useState, useCallback } from "react";
import { ListContext } from "../components/context/ListContext.jsx";
import Grille from '../components/svg/Grille'
import Liste from '../components/svg/Liste'
import ImgCard from '../components/imgCard'
import FilterA from "../components/svg/FilterA"
import FilterB from "../components/svg/FilterB"
import { ThemeContext } from "../components/context/ThemeContext.jsx";
import { StickyProvider, useSticky } from "../components/context/StickyContext.jsx";


const JeuxContent = ({ setSearchHandler }) => {
  const { fixed } = useSticky();

  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const { list, toggleList } = useContext(ListContext)

  const [selectedType, setSelectedType] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [sortMode, setSortMode] = useState("alpha");
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [maxDuration, setMaxDuration] = useState(180);

  const { theme } = useContext(ThemeContext);
  const darkmode = theme !== "light" ? "-dark" : "";

  const [showFilsters, setShowFilters] = useState(false)
  const [openClass, setOpenClass] = useState('');

  useEffect(() => {
  const timer = setTimeout(() => {
    setOpenClass(showFilsters ? ' open' : '');
  }, 500);

  return () => clearTimeout(timer);
}, [showFilsters]);

const classContainer = showFilsters ? 'show' : '';

  useEffect(() => {
    fetch("/ludotheque.json")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error("Erreur chargement ludothèque :", err));
  }, []);

  const handleSearch = useCallback((value) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    if (!setSearchHandler) return;

    setSearchHandler(() => handleSearch);

    return () => setSearchHandler(null);
  }, [setSearchHandler, handleSearch]);

  const normalize = (value = "") =>
    value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const getPlayerNumbers = (players = "") => {
    const numbers = players.toString().match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  };
const gameMatchesPlayers = (game) => {
  const selectedPlayers = Number(maxPlayers);

  if (!selectedPlayers) return true;

  const minPlayers = Number(game.playersMin);
  const maxPlayersGame = Number(game.playersMax);

  if (
    Number.isNaN(minPlayers) ||
    Number.isNaN(maxPlayersGame)
  ) {
    return true;
  }

  return (
    selectedPlayers >= minPlayers &&
    selectedPlayers <= maxPlayersGame
  );
};
const gameMatchesDuration = (game) => {
  const selectedDuration = Number(maxDuration);

  if (!selectedDuration) return true;

  const gameDuration = Number(game.duration);

  if (Number.isNaN(gameDuration)) return true;

  return gameDuration <= selectedDuration;
};
const filteredGames = useMemo(() => {
  const q = normalize(query);

  let result = games.filter((game) => {
    const matchesSearch =
      !q ||
      normalize(game.name).includes(q) ||
      normalize(game.type).includes(q) ||
      normalize(game.players).includes(q) ||
      normalize(game.duration).includes(q) ||
      normalize(game.year).includes(q);
    const matchesDuration = gameMatchesDuration(game);

    const matchesType =
      selectedType === "all" ||
      normalize(game.type) === normalize(selectedType);
    
    const matchesStyle =
      selectedStyle === "all" ||
      (normalize(game.style) === 'cartes' && normalize(selectedStyle) === 'cartes') || 
      (normalize(game.style) === 'ambiance' && normalize(selectedStyle) === 'ambiance') ||
      (normalize(game.style) === 'coop' && normalize(selectedStyle) === 'coop') ||
      ((normalize(game.style) === 'plateau' || normalize(game.style) === 'coop') && normalize(selectedStyle) === 'plateau');  

    const matchesPlayers = gameMatchesPlayers(game);

    return matchesSearch && matchesType && matchesPlayers && matchesDuration && matchesStyle;
  });
  result.sort((a, b) => {
    if (sortMode === "recent") {
      return Number(b.year || 0) - Number(a.year || 0);
    }

    if (sortMode === "oldest") {
      return Number(a.year || 0) - Number(b.year || 0);
    }

    return normalize(a.name).localeCompare(normalize(b.name), "fr");
  });

  return result;
}, [games, query, selectedType, sortMode, maxPlayers, maxDuration, selectedStyle]);

const clearSearch = () => {
  setQuery("");
  setSelectedType("all");
  setSortMode("alpha");
  setMaxPlayers(0);
  setMaxDuration(180);
};

  return (
    <div className={`app${darkmode}`}>
      <main className="app__main">


        <section
          className={`container ${
            !filteredGames.length ? "empty" : ""
          }`}
        >
<div className="container-filter">
  <div className={`filters${theme !== 'light' ? '-dark' : ''} games${fixed ? ' fixed' : ''}${showFilsters ? ' open' : openClass}`}>
  <button className={`cta-acc${theme !== 'light' ? '-dark' : ''}`} onClick={() => setShowFilters(currentValue => !currentValue)}><span className="label">Filtres</span> {!showFilsters ? <FilterA className="picto" /> : <FilterB className="picto" />}</button>
  <div className={`filters__container ${classContainer}`}>
    <div className="filters__card">
    <h3>Tri :</h3>
    <div className="filters__buttons">
    <select className={`cta-tertiary${theme !== 'light' ? '-dark' : ''}`}
      value={sortMode}
      onChange={(e) => setSortMode(e.target.value)}
    >
      <option value="alpha">Alphabétique</option>
      <option value="recent">Année : récent au plus ancien</option>
      <option value="oldest">Année : ancien au plus récent</option>
    </select>
    </div>
  </div>
  <div className="filters__card">
    <h3>Type :</h3>
    <div className="filters__buttons">
    <select className={`cta-tertiary${theme !== 'light' ? '-dark' : ''}`}
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
    >
      <option value="all">Tous</option>
      <option value="jeu">Jeu</option>
      <option value="extension">Extension</option>
    </select>
    </div>
  </div>
  <div className="filters__card">
    <h3>Style :</h3>
    <div className="filters__buttons">
    <select className={`cta-tertiary${theme !== 'light' ? '-dark' : ''}`}
      value={selectedStyle}
      onChange={(e) => setSelectedStyle(e.target.value)}
    >
      <option value="all">Tous</option>
      <option value="ambiance">Jeu d'ambiance</option>
      <option value="plateau">Jeu de plateau</option>
      <option value="coop">Jeu de plateau coopératif</option>
      <option value="cartes">Jeu de cartes</option>
    </select>
    </div>
  </div>

<div className="filters__card gameFilters">
  <h3>Joueurs max</h3>

  <div className="gameFilters__duration">
    <input
      type="number"
      min="0"
      value={maxPlayers || ""}
      placeholder="Tous"
      onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
          setMaxPlayers(0);
          return;
        }

        const numberValue = Number(value);

        if (Number.isNaN(numberValue)) return;

        setMaxPlayers(Math.max(0, numberValue));
      }}
    />

    <span>joueur(s)</span>
  </div>

  <button
    type="button"
    className={`cta-tertiary${theme !== "light" ? "-dark" : ""}`}
    onClick={() => setMaxPlayers(0)}
  >
    Pas de joueurs max
  </button>
</div>
<div className="filters__card gameFilters">
  <h3>
    Durée max
  </h3>

  <div className="gameFilters__jauge">
    <input
      id="durationFilter"
      type="range"
      min="0"
      max="180"
      step="5"
      value={maxDuration}
      onChange={(e) => setMaxDuration(Number(e.target.value))}
    />
    </div>
    <div className="gameFilters__duration">
    <input
      type="number"
      min="0"
      max="180"
      step="5"
      value={maxDuration}
      onChange={(e) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value)) return;

        setMaxDuration(
          Math.min(180, Math.max(0, value))
        );
      }}
    />

    <span>min</span>
  </div>
</div>
</div>
</div>
</div>
          <div className="container_search">
            {filteredGames.length ?
            <div className={`radioFilter ${theme !== 'light' ? 'dark' : ''}`}>
            <h3 className="lastSearch__label">
              Utilisez la barre de recherche pour trouver un jeu de société...
            </h3>
            {query.length > 0 ? (
            <div className="lastSearch">
              <h2 className="lastSearch__label" aria-label={`Votre recherche pour : ${query}`}>
                Votre recherche pour :
                <b>
                  {" "}
                  {query}
                </b>
              </h2>

              <button
                className={`cta-primary${theme !== 'light' ? '-dark' : ''  }`}
                onClick={clearSearch}
              >
                Supprimer la recherche
              </button>
            </div>
          ) : <p className="lastSearch__label">
              <b>Tous mes jeux :</b>
            </p>}
            <button className="radioFilter__list" onClick={() => toggleList()}>{list ? <Liste className='picto' /> : <Grille className='picto' />}</button>
            </div> : ''
            }


          {!filteredGames.length ? (
            <div className="results-section empty">
            <button
            className={`cta-primary${theme !== 'light' ? '-dark' : ''  }`}
            onClick={clearSearch}
            >
            Supprimer la recherche
            </button>
            <p>&#128557; Apparement je n'ai pas le jeu recherché.</p>
            <p>&#128269; Recherchez votre jeu via la <b>barre de recherche</b></p>
            </div>
          ) : (
            <>
            <div className="separation"></div>
            <div className="media-grid">
              {filteredGames.map((game) => (
                <article className={`media-card ${game.type}${theme !== 'light' ? ' dark' : ''}${list ? ' list' : ''}`} key={game.id}>
                  <div className={`media-card__container${list ? ' list' : ''}`}>
                    {game.img && (
                      <ImgCard imgTmdb={false} format={game.type} popin={false} picture={game.img} title={game.name} />
                    )}

                    <div className="media-card__infos">
                      <h3 className="media-card__title">
                        {game.name}
                      </h3>

                      {game.type && (
                        <p className="media-card__meta">
                          Type : <span>{game.type}</span>
                        </p>
                      )}

                      {game.year && (
                        <p className="media-card__meta">
                          Année : <span>{game.year}</span>
                        </p>
                      )}

                      {game.players && (
                        <p className="media-card__meta">
                          Joueurs : <span>{game.players}</span>
                        </p>
                      )}

                      {game.duration && (
                        <p className="media-card__meta">
                          Durée : <span>{game.duration} min</span>
                        </p>
                      )}

                      {game.description && (
                        <p className="media-card__meta">
                          Description :
                          <br />
                          <span className="description">
                            {game.description}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </>
          )}
          </div>
        </section>
      </main>
    </div>
  );
};


const Jeux = (props) => {
  return (
    <StickyProvider>
      <JeuxContent {...props} />
    </StickyProvider>
  );
};




export default Jeux;
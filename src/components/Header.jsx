import { useContext } from "react";

import Logo from "./svg/logo"
import SearchBar from "./SearchBar";
import ToogleMode from "./ToogleMode"
import {ThemeContext} from "./context/ThemeContext.jsx"
import { useLocation, Link } from 'react-router-dom';


const Header = ({ handleSearch }) => {
  const location = useLocation();

  const { theme } = useContext(ThemeContext);
  const isHome = location.pathname === '/'
  const isVideo = location.pathname === '/films-et-series'
  const isJeu = location.pathname === '/jeux-de-societe'
  const showSearch =
    isVideo ||
    isJeu;
  return (
    <header className={`app__header ${theme}`}>
      <section className="header">
      <h1 className="sr-only">La Médiated — Médiathèque personnelle</h1>
      <div className={`app__logo ${theme}`}>

      {location.pathname === "/" ? (
        <Logo role="img" ariaLabel="La Médiated — Médiathèque personnelle" className={`app__logo__logo ${theme}`} />
      ) : (
        <Link to="/">
          <Logo role="img" ariaLabel="La Médiated — Médiathèque personnelle" className={`app__logo__logo ${theme}`} />
        </Link>
        
      )}

      </div>
      {showSearch && handleSearch && (
        <SearchBar className={`app__search ${theme}`} onSearch={handleSearch} />
      )}

      <ToogleMode />
      </section>
      <nav className="container__nav">
        <ul>
          <li className={`${isHome ? 'active' : ''}`} >
            {!isHome ? <Link to='/' title="Accueil"><span>Accueil</span></Link> : <span>Accueil</span> }
          </li>  
          <li className={`${isVideo ? 'active' : ''}`} >
            {!isVideo ? <Link to='/films-et-series' title='Film et Série'><span>Films et Séries</span></Link> : <span>Films et Séries</span> }
           </li>
          <li className={`${isJeu ? 'active' : ''}`} > 
            {!isJeu ? <Link to='/jeux-de-societe' title='Film et Série'><span>Jeux de socièté</span></Link> : <span>Jeux de socièté</span> }
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;


import { useContext } from "react";

import Logo from "./svg/logo"
import SearchBar from "./SearchBar";
import ToogleMode from "./ToogleMode"
import {ThemeContext} from "./context/ThemeContext.jsx"


const Header = ({handleSearch}) => {
  const { theme } = useContext(ThemeContext)

  return (
    <header className={`app__header ${theme}`}>
        <h1 className="sr-only">La Médiated — Médiathèque personnelle</h1>

        <Logo role="img" ariaLabel="La Médiated — Médiathèque personnelle" className={`app__logo ${theme}`} />
        <SearchBar className={`app__search ${theme}`} onSearch={handleSearch} />

        <ToogleMode />

    </header>
  );
};

export default Header;


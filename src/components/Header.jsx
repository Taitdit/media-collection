import Logo from "./svg/logo"
import SearchBar from "./SearchBar";


const Header = ({handleSearch}) => {

  return (
    <header className='app__header'>
        <h1 className="sr-only">La Médiated — Médiathèque personnelle</h1>

        <Logo role="img" ariaLabel="La Médiated — Médiathèque personnelle" className="app__logo" />
        <SearchBar className='app__search' onSearch={handleSearch} />

    </header>
  );
};

export default Header;


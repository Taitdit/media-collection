// Layout.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from "react";
import { ListProvider } from "./components/context/ListContext.jsx";
import Home from './pages/Home';
import Film from './pages/Film';

import Header from './components/Header'
import Jeux from './pages/Jeux';
// import Breadcrumb from './components/Breadcrumb/Breadcrumb';


const Layout = () => {
  const [lastSearch, setLastSearch] = useState("");
  const [searchHandler, setSearchHandler] = useState(null);
  return (
    <>
      <Header handleSearch={searchHandler} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="films-et-series"
          element={
            <Film
              lastSearch={lastSearch}
              setLastSearch={setLastSearch}
              setFilmSearchHandler={setSearchHandler}
            />
          }
        />
        <Route path="/jeux-de-societe" element={
            <ListProvider>
            <Jeux lastSearch={lastSearch}
              setLastSearch={setLastSearch} setSearchHandler={setSearchHandler} /></ListProvider>
            } />

      </Routes>
    </>
  );
};
export default Layout
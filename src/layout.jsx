// Layout.jsx
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import { ListProvider } from "./components/context/ListProvider";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Home from "./pages/Home";
import Film from "./pages/Film";
import Jeux from "./pages/Jeux";
import BackToTop from "./components/BackToTop";

const Layout = () => {
  const [searchHandler, setSearchHandler] = useState(null);

  return (
    <>
      <Header handleSearch={searchHandler} />
    <ScrollToTop />
    <BackToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="films-et-series"
          element={
            <Film
              setFilmSearchHandler={setSearchHandler}
            />
          }
        />

        <Route
          path="/jeux-de-societe"
          element={
            <ListProvider>
              <Jeux
                setSearchHandler={setSearchHandler}
              />
            </ListProvider>
          }
        />
      </Routes>
    </>
  );
};

export default Layout;
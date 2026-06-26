import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import MediaGrid from "../components/MediaGrid";
import { ThemeContext } from "../components/context/ThemeContext";
import { StickyProvider } from "../components/context/StickyProvider";
import { ListProvider } from "../components/context/ListProvider";
import {
  loadFilms,
  getFilmsCache,
} from "../services/mediaLibraryCache";

const Film = ({ setFilmSearchHandler }) => {
  const [films, setFilms] = useState(() => getFilmsCache() ?? []);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [sortMode, setSortMode] = useState("recent");

  const { theme } = useContext(ThemeContext);
  const darkmode = theme !== "light" ? "-dark" : "";

  useEffect(() => {
    document.body.classList.toggle("dark", theme !== "light");
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

useEffect(() => {
  loadFilms()
    .then((data) => setFilms(data))
    .catch((err) => console.error("Erreur chargement filmothèque :", err));
}, []);
  const normalize = (value = "") =>
    value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const handleSearch = useCallback((value) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    if (!setFilmSearchHandler) return;

    setFilmSearchHandler(() => handleSearch);

    return () => setFilmSearchHandler(null);
  }, [setFilmSearchHandler, handleSearch]);

  const filteredFilms = useMemo(() => {
    const q = normalize(query);

    const result = films.filter((film) => {
      const matchesSearch =
        !q ||
        normalize(film.name).includes(q) ||
        normalize(film.type).includes(q) ||
        normalize(film.year).includes(q) ||
        normalize(film.format).includes(q);

      const matchesType =
        selectedType === "all" ||
        normalize(film.type) === normalize(selectedType);

      const matchesFormat =
        selectedFormat === "all" ||
        normalize(film.format) === normalize(selectedFormat);

      return matchesSearch && matchesType && matchesFormat;
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
  }, [films, query, selectedType, selectedFormat, sortMode]);

  const clearSearch = () => {
    setQuery("");
    setSelectedType("all");
    setSelectedFormat("all");
    setSortMode("recent");
  };

  return (
    <div className={`app${darkmode}`}>
      <main className="app__main">
        <StickyProvider>
          <section className={`container stretch ${!filteredFilms.length ? "empty" : ""}`}>
            <ListProvider>
              <MediaGrid
                items={filteredFilms}
                query={query}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
                sortMode={sortMode}
                setSortMode={setSortMode}
                clearSearch={clearSearch}
              />
            </ListProvider>
          </section>
        </StickyProvider>
      </main>
    </div>
  );
};

export default Film;
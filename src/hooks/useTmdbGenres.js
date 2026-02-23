import { useEffect, useState } from "react";
import { getMovieGenres, getTvGenres } from "../services/tmdb";

const toMapObject = (genresArray) =>
  Object.fromEntries((genresArray ?? []).map((g) => [g.id, g.name]));

const useTmdbGenres = () => {
  const [movieGenreMap, setMovieGenreMap] = useState({});
  const [tvGenreMap, setTvGenreMap] = useState({});
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [genresError, setGenresError] = useState("");

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    if (!token) {
      setGenresError("TMDB token missing (VITE_TMDB_TOKEN).");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadingGenres(true);
      setGenresError("");

      try {
        const [movieData, tvData] = await Promise.all([
          getMovieGenres(token),
          getTvGenres(token),
        ]);

        if (cancelled) return;

        setMovieGenreMap(toMapObject(movieData.genres));
        setTvGenreMap(toMapObject(tvData.genres));
      } catch (e) {
        if (cancelled) return;
        setGenresError("Impossible de charger les genres TMDB.");
      } finally {
        if (cancelled) return;
        setLoadingGenres(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { movieGenreMap, tvGenreMap, loadingGenres, genresError };
}

export default useTmdbGenres;
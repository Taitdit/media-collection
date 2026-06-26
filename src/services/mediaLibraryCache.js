const cache = {
  films: null,
  games: null,
};

export const getFilmsCache = () => cache.films;
export const getGamesCache = () => cache.games;

export const loadFilms = async () => {
  if (cache.films) return cache.films;

  const res = await fetch("/filmotheque.json");
  const data = await res.json();

  cache.films = data;
  return data;
};

export const loadGames = async () => {
  if (cache.games) return cache.games;

  const res = await fetch("/ludotheque.json");
  const data = await res.json();

  cache.games = data;
  return data;
};

export const preloadLibraries = () => {
  loadFilms();
  loadGames();
};

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function searchMulti(query, token) {
  const url = new URL(`${TMDB_BASE}/search/multi`);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "fr-FR");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("TMDB search failed");
  return res.json();
}

export async function getMovieGenres(token) {
  const url = new URL(`${TMDB_BASE}/genre/movie/list`);
  url.searchParams.set("language", "fr-FR");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Movie genres fetch failed");
  return res.json();
}

export async function getTvGenres(token) {
  const url = new URL(`${TMDB_BASE}/genre/tv/list`);
  url.searchParams.set("language", "fr-FR");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Movie genres fetch failed");
  return res.json()
}
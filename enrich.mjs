import fs from "node:fs/promises";

const INPUT = "./filmotheque-dd.json";
const OUTPUT = "./dd.enriched.json";
const REVIEW = "./dd.needs-review.json";

const TMDB_TOKEN = process.env.TMDB_TOKEN;
if (!TMDB_TOKEN) {
  console.error("Missing TMDB_TOKEN env var");
  process.exit(1);
}

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isSeriesType(type = "") {
  return type.toLowerCase().includes("série") || type.toLowerCase().includes("serie");
}

async function tmdbFetch(path, params = {}) {
  const url = new URL(TMDB_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status} ${res.statusText} :: ${txt}`);
  }
  return res.json();
}

function score(item, cand) {
  const wanted = normalize(item.name);
  const candTitle = normalize(
    cand.title || cand.name || cand.original_title || cand.original_name || ""
  );

  let s = 0;

  if (candTitle === wanted) s += 120;
  if (candTitle.includes(wanted) || wanted.includes(candTitle)) s += 40;

  const y = Number(item.year);
  const date = cand.release_date || cand.first_air_date || "";
  const cy = date ? Number(date.slice(0, 4)) : null;
  if (y && cy && y === cy) s += 80;

  return s;
}

async function searchOne(mediaType, item) {
  const params =
    mediaType === "movie"
      ? { query: item.name, language: "fr-FR", include_adult: "false", year: item.year }
      : { query: item.name, language: "fr-FR", include_adult: "false", first_air_date_year: item.year };

  const data = await tmdbFetch(`/search/${mediaType}`, params);
  const results = Array.isArray(data.results) ? data.results : [];
  if (!results.length) return null;

  const ranked = results
    .map((r) => ({ r, s: score(item, r) }))
    .sort((a, b) => b.s - a.s);

  const best = ranked[0];
  const second = ranked[1];
  const ambiguous = Boolean(second && best.s - second.s < 30);

  return {
    mediaType,
    match: best.r,
    bestScore: best.s,
    ambiguous,
    alternatives: ambiguous
      ? ranked.slice(0, 5).map((x) => ({
          id: x.r.id,
          title: x.r.title || x.r.name,
          date: x.r.release_date || x.r.first_air_date,
          score: x.s,
        }))
      : [],
  };
}

async function bestMatch(item) {
  // Si c'est explicitement une série -> tv direct
  if (isSeriesType(item.type)) {
    const tv = await searchOne("tv", item);
    return tv ? tv : { mediaType: "tv", match: null, reason: "no_results_tv" };
  }

  // Sinon: essayer movie puis tv
  const movie = await searchOne("movie", item);
  if (movie && movie.bestScore >= 140) return movie; // seuil "fort" (titre+année en général)

  const tv = await searchOne("tv", item);
  if (!movie && tv) return tv;
  if (movie && !tv) return movie;

  if (movie && tv) {
    // choisir le meilleur score
    return tv.bestScore > movie.bestScore ? tv : movie;
  }

  return { mediaType: "movie", match: null, reason: "no_results" };
}

async function main() {
  const raw = await fs.readFile(INPUT, "utf-8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error("Ton library.json doit être un tableau d'objets");

  const needsReview = [];
  const enriched = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.id?.startsWith("tmdb:") && item.img) {
      enriched.push(item);
      continue;
    }

    try {
      const r = await bestMatch(item);

      if (!r.match) {
        enriched.push({ ...item, id: "", img: "" });
        needsReview.push({ index: i, item, reason: r.reason || "no_match" });
        continue;
      }

      const tmdbId = r.match.id;
      const posterPath = r.match.poster_path || "";
      const imgUrl = posterPath ? `${IMG_BASE}${posterPath}` : "";

      const out = {
        ...item,
        id: `tmdb:${r.mediaType}:${tmdbId}`,
        img: imgUrl,
      };

      enriched.push(out);

      if (r.ambiguous || r.bestScore < 140) {
        needsReview.push({
          index: i,
          item: out,
          reason: r.ambiguous ? "ambiguous_match" : "low_confidence",
          alternatives: r.alternatives,
          score: r.bestScore,
        });
      }
    } catch (e) {
      enriched.push({ ...item, id: "", img: "" });
      needsReview.push({ index: i, item, reason: String(e?.message || e) });
    }
  }

  await fs.writeFile(OUTPUT, JSON.stringify(enriched, null, 2), "utf-8");
  await fs.writeFile(REVIEW, JSON.stringify(needsReview, null, 2), "utf-8");

  console.log(`Wrote ${OUTPUT}`);
  console.log(`Review ${REVIEW} (${needsReview.length} items)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
const BASE_URL = "https://api.tvmaze.com";

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

export const getPopularMovies = async () => {
  const response = await fetchWithTimeout(`${BASE_URL}/shows`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await response.json();
  return data.map(show => ({
    id: show.id,
    title: show.name,
    poster_path: show.image?.medium,
    release_date: show.premiered
  }));
};

export const searchMovies = async (query) => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }
  const data = await response.json();
  return data.map(item => ({
    id: item.show.id,
    title: item.show.name,
    poster_path: item.show.image?.medium,
    release_date: item.show.premiered
  }));
};

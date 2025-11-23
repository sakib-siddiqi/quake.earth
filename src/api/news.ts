import type { NewsResponse } from '@/types/news';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

export const fetchEarthquakeNews = async (pageSize = 10): Promise<NewsResponse> => {
  if (!NEWS_API_KEY) {
    // Return mock data if no API key is provided
    return {
      status: 'ok',
      totalResults: 0,
      articles: [],
    };
  }

  const url = `${NEWS_API_URL}?q=earthquake&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  return response.json();
};

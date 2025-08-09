import { Movie, MovieDetails, SearchResponse } from '@/types/movie';

const API_BASE_URL = 'https://www.omdbapi.com/';

// Using activated OMDb API key
const API_KEY = '9363b1cd';

export class OMDbApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OMDbApiError';
  }
}

export const omdbApi = {
  async search(
    query: string, 
    page: number = 1, 
    type?: 'movie' | 'series',
    year?: string
  ): Promise<SearchResponse> {
    if (!query.trim()) {
      throw new OMDbApiError('Search query cannot be empty');
    }

    const params = new URLSearchParams({
      apikey: API_KEY,
      s: query.trim(),
      page: page.toString(),
    });

    if (type) {
      params.append('type', type);
    }

    if (year) {
      params.append('y', year);
    }

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new OMDbApiError(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new OMDbApiError(data.Error || 'Search failed');
      }

      return data;
    } catch (error) {
      if (error instanceof OMDbApiError) {
        throw error;
      }
      throw new OMDbApiError('Network error occurred');
    }
  },

  async getMovieDetails(imdbID: string): Promise<MovieDetails> {
    const params = new URLSearchParams({
      apikey: API_KEY,
      i: imdbID,
    });

    try {
      const response = await fetch(`${API_BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new OMDbApiError(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new OMDbApiError(data.Error || 'Failed to fetch movie details');
      }

      return data;
    } catch (error) {
      if (error instanceof OMDbApiError) {
        throw error;
      }
      throw new OMDbApiError('Network error occurred');
    }
  }
};
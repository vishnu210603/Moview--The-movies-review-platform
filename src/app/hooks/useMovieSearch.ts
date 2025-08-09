import { useState, useCallback } from 'react';
import { Movie, SearchFilters } from '@/types/movie';
import { omdbApi, OMDbApiError } from '@/services/omdbApi';
import { useToast } from '@/hooks/use-toast';

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all', year: 'all' });
  const { toast } = useToast();

  const searchMovies = useCallback(async (
    query: string, 
    page: number = 1, 
    newFilters?: SearchFilters
  ) => {
    if (!query.trim()) return;

    setLoading(true);
    
    try {
      const activeFilters = newFilters || filters;
      const response = await omdbApi.search(
        query,
        page,
        activeFilters.type === 'all' ? undefined : activeFilters.type,
        activeFilters.year === 'all' ? undefined : activeFilters.year
      );

      setMovies(response.Search);
      setTotalResults(parseInt(response.totalResults));
      setCurrentPage(page);
      setSearchQuery(query);
    } catch (error) {
      console.error('Search error:', error);
      
      if (error instanceof OMDbApiError) {
        toast({
          title: "Search Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
      
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const handleSearch = useCallback((query: string) => {
    setCurrentPage(1);
    searchMovies(query, 1);
  }, [searchMovies]);

  const handlePageChange = useCallback((page: number) => {
    if (searchQuery) {
      searchMovies(searchQuery, page);
    }
  }, [searchQuery, searchMovies]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (searchQuery) {
      setCurrentPage(1);
      searchMovies(searchQuery, 1, newFilters);
    }
  }, [searchQuery, searchMovies]);

  return {
    movies,
    loading,
    currentPage,
    totalResults,
    searchQuery,
    filters,
    handleSearch,
    handlePageChange,
    handleFiltersChange,
  };
};
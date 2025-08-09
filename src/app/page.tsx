"use client";

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film } from 'lucide-react';
import { Movie, MovieDetails, SearchFilters } from './types/movie';
import { omdbApi } from './services/omdbApi';
import { SearchBar } from './components/SearchBar';
import { MovieFilters } from './components/MovieFilters';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { Pagination } from './components/Pagination';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    year: 'all',
  });

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const type = filters.type !== 'all' ? filters.type : undefined;
      const year = filters.year !== 'all' ? filters.year : undefined;
      
      const response = await omdbApi.search(query, 1, type, year);
      
      if (response.Response === 'True') {
        setMovies(response.Search || []);
        setTotalPages(Math.ceil(parseInt(response.totalResults || '0') / 10));
      } else {
        setMovies([]);
        setError(response.Error || 'No results found');
        setTotalPages(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching for movies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const handlePageChange = async (page: number) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const type = filters.type !== 'all' ? filters.type : undefined;
      const year = filters.year !== 'all' ? filters.year : undefined;
      
      const response = await omdbApi.search(searchQuery, page, type, year);
      
      if (response.Response === 'True') {
        setMovies(response.Search || []);
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(response.Error || 'Failed to load page');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading the page');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleMovieClick = async (movie: Movie) => {
    try {
      setIsLoading(true);
      const details = await omdbApi.getMovieDetails(movie.imdbID);
      setSelectedMovie(details);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery, currentPage);
    }
  }, [filters]);

  // Add a small delay to prevent flash of loading state
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className={`text-center mb-12 transition-opacity duration-500 ${showInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            Movie Search
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Discover and explore your favorite movies and TV shows with our powerful search
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-500/30">
            <SearchBar onSearch={handleSearch} loading={isLoading} />
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <MovieFilters 
                    filters={filters} 
                    onFiltersChange={handleFiltersChange} 
                    className="mt-4"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {isLoading && !searchQuery ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="h-6 w-6 text-blue-400 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-gray-400">Loading movies...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 bg-red-900/30 border border-red-800 rounded-xl backdrop-blur-sm"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          ) : (
            <motion.div 
              key={searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/30"
            >
              <MovieGrid 
                movies={movies} 
                loading={isLoading} 
                onMovieClick={handleMovieClick} 
              />
              
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Pagination 
                    currentPage={currentPage}
                    totalResults={totalPages * 10}
                    resultsPerPage={10}
                    onPageChange={handlePageChange}
                    className="mt-8 px-6 pb-6"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            key="movie-modal"
            isOpen={!!selectedMovie}
            onClose={() => setSelectedMovie(null)}
            movieId={selectedMovie.imdbID}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

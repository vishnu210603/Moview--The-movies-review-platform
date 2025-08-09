import { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { MovieFilters } from '@/components/MovieFilters';
import { MovieGrid } from '@/components/MovieGrid';
import { Pagination } from '@/components/Pagination';
import { MovieModal } from '@/components/MovieModal';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { Movie } from '@/types/movie';
import heroImage from '@/assets/hero-cinema.jpg';

const Index = () => {
  const {
    movies,
    loading,
    currentPage,
    totalResults,
    searchQuery,
    filters,
    handleSearch,
    handlePageChange,
    handleFiltersChange,
  } = useMovieSearch();

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.imdbID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clapperboard className="h-12 w-12 text-accent" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ReelView
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover movies and series from the world's largest entertainment database
          </p>
          
          <div className="mt-12">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
          
          {!searchQuery && (
            <div className="text-sm text-muted-foreground mt-8">
              🎬 Search for your favorite movies and TV series to get started
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Search Results for "{searchQuery}"
              </h2>
              {totalResults > 0 && (
                <p className="text-muted-foreground">
                  Found {totalResults.toLocaleString()} results
                </p>
              )}
            </div>

            <MovieFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange} 
            />

            <MovieGrid 
              movies={movies}
              loading={loading}
              onMovieClick={handleMovieClick}
            />

            {totalResults > 10 && (
              <Pagination
                currentPage={currentPage}
                totalResults={totalResults}
                resultsPerPage={10}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </section>
      )}

      {/* Movie Details Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        movieId={selectedMovieId}
      />
    </div>
  );
};

export default Index;

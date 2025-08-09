import { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Users, Award, Film, Play, Globe, BookOpen, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MovieDetails } from '../types/movie';
import { omdbApi } from '../services/omdbApi';

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string | null;
}

export const MovieModal = ({ isOpen, onClose, movieId }: MovieModalProps) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId || !isOpen) {
      setMovie(null);
      setError(null);
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const details = await omdbApi.getMovieDetails(movieId);
        setMovie(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-gray-900 border-gray-700/50 rounded-2xl overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
            <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-xl p-6 max-w-md">
              <h3 className="text-xl font-bold mb-2">Error Loading Details</h3>
              <p>{error}</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {movie && (
          <div className="relative">
            {/* Backdrop Image */}
            <div className="absolute inset-0 -z-10 opacity-20">
              {movie.Poster !== 'N/A' && (
                <img
                  src={movie.Poster}
                  alt=""
                  className="w-full h-full object-cover blur-xl scale-105"
                />
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-gray-800 transition-colors border border-gray-700/50 shadow-lg"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>

            <ScrollArea className="h-[90vh]">
              <div className="grid md:grid-cols-12 gap-8 p-8">
                {/* Poster */}
                <div className="md:col-span-4 lg:col-span-3">
                  <div className="relative group">
                    {movie.Poster !== 'N/A' ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full rounded-2xl shadow-2xl border-2 border-gray-700/50 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-700/50">
                        <Film className="h-16 w-16 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="w-full space-y-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center">
                          <Play className="h-5 w-5 mr-2" />
                          Watch Trailer
                        </button>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center">
                            <Heart className="h-4 w-4 mr-1.5" />
                            Save
                          </button>
                          <button className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-4 w-4 mr-1.5" />
                            More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="mt-6 space-y-4">
                    {movie.imdbRating !== 'N/A' && (
                      <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 mr-2 fill-yellow-400" />
                          <span className="font-medium">IMDb Rating</span>
                        </div>
                        <span className="text-xl font-bold">{movie.imdbRating}<span className="text-gray-400 text-sm font-normal">/10</span></span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-1">Release Date</div>
                        <div className="font-medium">{movie.Released}</div>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-1">Runtime</div>
                        <div className="font-medium">{movie.Runtime}</div>
                      </div>
                      {movie.Country && (
                        <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
                          <div className="text-xs text-gray-400 mb-1">Country</div>
                          <div className="font-medium">{movie.Country.split(', ')[0]}</div>
                        </div>
                      )}
                      <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl border border-gray-700/50">
                        <div className="text-xs text-gray-400 mb-1">Rated</div>
                        <div className="font-medium">{movie.Rated || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-8 lg:col-span-9 text-gray-200">
                  {/* Title and Metadata */}
                  <div className="mb-6">
                    <DialogTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                      {movie.Title} <span className="text-gray-400">({movie.Year})</span>
                    </DialogTitle>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {movie.Genre.split(', ').map((genre, index) => (
                        <span 
                          key={genre} 
                          className="px-3 py-1 bg-blue-900/30 text-blue-300 text-sm font-medium rounded-full border border-blue-800/50"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Plot */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-white">Storyline</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">DIRECTOR</h4>
                      <p className="text-white">{movie.Director}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">WRITERS</h4>
                      <p className="text-white">{movie.Writer?.split(', ').slice(0, 2).join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">STARS</h4>
                      <p className="text-white">{movie.Actors?.split(',').slice(0, 3).join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">AWARDS</h4>
                      <p className="text-white">{movie.Awards !== 'N/A' ? movie.Awards : 'No awards'}</p>
                    </div>
                  </div>

                  {/* Ratings */}
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-white">Ratings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {movie.Ratings.map((rating, index) => (
                          <div 
                            key={index} 
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                {rating.Source === 'Internet Movie Database' 
                                  ? 'IMDb' 
                                  : rating.Source === 'Rotten Tomatoes' 
                                    ? 'Rotten Tomatoes' 
                                    : rating.Source}
                              </span>
                              {rating.Source === 'Internet Movie Database' && (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              )}
                              {rating.Source === 'Rotten Tomatoes' && (
                                <span className="text-red-500 font-bold">%</span>
                              )}
                              {rating.Source === 'Metacritic' && (
                                <span className="text-blue-400 font-bold">M</span>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {rating.Source === 'Internet Movie Database' 
                                ? rating.Value.split('/')[0] 
                                : rating.Value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">LANGUAGE</h4>
                      <p className="text-white">{movie.Language}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">BOX OFFICE</h4>
                      <p className="text-white">{movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">PRODUCTION</h4>
                      <p className="text-white">{movie.Production || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">WEBSITE</h4>
                      {movie.Website !== 'N/A' ? (
                        <a 
                          href={movie.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center"
                        >
                          <Globe className="h-4 w-4 mr-1" /> Visit Site
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
import { useState } from 'react';
import { Calendar, Film, Tv, Star, Clock } from 'lucide-react';
import { Movie, MovieDetails } from '../types/movie';

interface MovieCardProps {
  movie: Movie & Partial<Pick<MovieDetails, 'imdbRating' | 'Runtime'>>;
  onClick: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getTypeIcon = () => {
    switch (movie.Type) {
      case 'movie':
        return <Film className="h-4 w-4" />;
      case 'series':
        return <Tv className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 hover:scale-[1.02] transform-gpu"
      onClick={() => onClick(movie)}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageError && movie.Poster !== 'N/A' ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <Film className="h-16 w-16 text-gray-500" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 border border-gray-700/50">
          {getTypeIcon()}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="w-full">
            <div className="flex items-center space-x-2 mb-2">
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="flex items-center text-yellow-400 text-sm font-medium bg-yellow-900/30 px-2 py-1 rounded-full">
                  <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                  {movie.imdbRating}
                </div>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="flex items-center text-gray-300 text-xs bg-gray-700/50 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  {movie.Runtime}
                </div>
              )}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="p-4">
        <h3 
          className="font-bold text-gray-100 text-lg mb-1.5 line-clamp-2 leading-tight transition-colors group-hover:text-white" 
          title={movie.Title}
        >
          {movie.Title}
        </h3>
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>{movie.Year}</span>
          <span className="mx-2 text-gray-600">•</span>
          <span className="capitalize text-blue-400 font-medium">
            {movie.Type}
          </span>
        </div>
      </div>
    </div>
  );
};
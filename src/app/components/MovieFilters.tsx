import { SearchFilters } from '../types/movie';

interface MovieFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export const MovieFilters = ({ filters, onFiltersChange, className = '' }: MovieFiltersProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className={`flex flex-wrap gap-6 ${className}`}>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as 'all' | 'movie' | 'series' })}
            className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
        <div className="relative">
          <select
            value={filters.year}
            onChange={(e) => onFiltersChange({ ...filters, year: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
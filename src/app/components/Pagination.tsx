import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({ 
  currentPage, 
  totalResults, 
  resultsPerPage, 
  onPageChange,
  className = ''
}: PaginationProps) => {
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    range.push(1);
    
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }  
    
    range.push(totalPages);
    
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const buttonClass = (page: number | string, isActive = false, isNav = false) => {
    const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200';
    
    if (isNav) {
      return `${baseClasses} ${isActive 
        ? 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/70' 
        : 'text-gray-400 hover:bg-gray-800/50'}`;
    }
    
    if (page === '...') {
      return `${baseClasses} text-gray-500`;
    }
    
    return `${baseClasses} ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 font-semibold' 
        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 border border-gray-700/50 hover:border-gray-600/50'
    }`;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-400">
        Showing <span className="font-medium text-white">
          {((currentPage - 1) * resultsPerPage) + 1}-{
            Math.min(currentPage * resultsPerPage, totalResults)
          }
        </span> of <span className="font-medium text-white">{totalResults}</span> results
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClass(1, false, true)}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={buttonClass(1, false, true)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={`${buttonClass(page, page === currentPage)} ${
              typeof page !== 'number' ? 'cursor-default' : 'hover:scale-105'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={buttonClass(1, false, true)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClass(1, false, true)}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
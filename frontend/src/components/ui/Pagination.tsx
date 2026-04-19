import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

export default function Pagination({ hasNext, hasPrev, total, onNext, onPrev, isLoading }: Props) {
  if (!hasNext && !hasPrev) return null;

  return (
    <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl'>
      <p className='text-sm text-gray-400'>
        Showing <span className='font-medium text-gray-700'>{total}</span> users total
      </p>

      <div className='flex items-center gap-1.5'>
        <button
          onClick={onPrev}
          disabled={!hasPrev || isLoading}
          aria-label='Previous page'
          className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-200
                     text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-colors cursor-pointer bg-white'
        >
          <ChevronLeft className='w-4 h-4' aria-hidden='true' />
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext || isLoading}
          aria-label='Next page'
          className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-200
                     text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-colors cursor-pointer bg-white'
        >
          <ChevronRight className='w-4 h-4' aria-hidden='true' />
        </button>
      </div>
    </div>
  );
}

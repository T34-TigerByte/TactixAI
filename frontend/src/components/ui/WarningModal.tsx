import { MessageSquareWarning, TriangleAlert } from 'lucide-react';

interface WarningModalProps {
  title: string;
  warning: string;
  dotpoints: string[];
  finalWarning: string;
  note?: string;
  variant?: 'default' | 'timeout';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WarningModal({
  title,
  warning,
  dotpoints,
  finalWarning,
  note,
  variant = 'default',
  onConfirm,
  onCancel,
}: WarningModalProps) {
  const isTimeout = variant === 'timeout';

  return (
    <div className='fixed inset-0 bg-gray-900/85 transition-opacity flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl overflow-hidden w-full max-w-md mx-4'>
        <div className={`flex items-center gap-2 px-5 py-4 ${isTimeout ? 'bg-[#0f1c35] border-b-2 border-orange-500' : 'bg-[#0f1c35]'}`}>
          {isTimeout
            ? <TriangleAlert className='w-5 h-5 text-orange-400 shrink-0' />
            : <MessageSquareWarning className='w-5 h-5 text-white shrink-0' />
          }
          <span className='text-white font-bold text-base'>{title}</span>
        </div>

        <div className='p-6'>
          <p className='mb-4 font-bold text-gray-800'>{warning}</p>
          <ul className='mb-6 space-y-2'>
            {dotpoints.map((point, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-red-500 mr-2'>•</span>
                <span className='text-sm text-gray-700'>{point}</span>
              </li>
            ))}
          </ul>

          <p className='mb-3 font-bold text-gray-800'>{finalWarning}</p>

          {note && (
            <div className='mb-5 px-4 py-3 rounded-lg border border-orange-300 bg-orange-50'>
              <div className='flex items-start gap-2'>
                <span className='text-orange-500 mt-0.5'>•</span>
                <span className='text-sm text-orange-800'>{note}</span>
              </div>
            </div>
          )}

          <div className='flex gap-3'>
            <button
              onClick={onCancel}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                isTimeout
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {isTimeout ? 'Continue' : 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer'
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

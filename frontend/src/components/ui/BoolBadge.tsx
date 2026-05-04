import { CheckCircle2, XCircle } from "lucide-react";

export default function BoolBadge({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className='flex items-center gap-1.5'>
      {value ? (
        <CheckCircle2 className='w-4 h-4 text-teal-500 shrink-0' />
      ) : (
        <XCircle className='w-4 h-4 text-gray-300 shrink-0' />
      )}
      <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

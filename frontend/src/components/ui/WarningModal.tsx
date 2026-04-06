import { MessageSquareWarning } from "lucide-react";
import PanelHeader from "./PanelHeader";

export default function WarningModal({ title, warning, dotpoints,  finalWarning, onConfirm, onCancel}: { title: string; warning: string; dotpoints: string[]; finalWarning: string; onConfirm: () => void; onCancel: () => void }) {
    return (
      <div className='fixed inset-0 bg-gray-900/85 transition-opacity flex items-center justify-center z-50'>
        <div className='bg-white rounded-2xl'>
          <PanelHeader icon={<MessageSquareWarning />} title={title} />
          <div className=' p-6 w-full max-w-md'>
            <p className='mb-4 font-bold'>{warning}</p>
            <ul className='mb-6 space-y-2'>
              {dotpoints?.map((point, index) => (
                <li key={index} className='flex items-start'>
                  <span className='text-red-500 mr-2'>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className='mb-6 text-red-500 font-semibold'>{finalWarning}</p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={onCancel}
                className='px-4 py-2 outline-1 rounded hover:bg-gray-100 cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer'
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
interface ChatMessageBubbleProps {
  sender: string;
  content: string;
  timestamp?: string;
  senderLabel?: string;
  variant?: 'chat' | 'history'; // chat: active session, history: review
}

export default function ChatMessageBubble({
  sender,
  content,
  timestamp,
  senderLabel,
  variant = 'history',
}: ChatMessageBubbleProps) {
  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  const label = senderLabel ?? (isUser ? 'You' : isSystem ? 'System' : sender);
  const userBg = variant === 'chat' ? 'bg-orange-500 text-white' : 'bg-[#0f1c35] text-white';

  if (isSystem) {
    return (
      <div className='flex items-start gap-2'>
        <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5'>
          <span className='text-gray-500 text-xs font-bold'>S</span>
        </div>
        <div>
          {timestamp && (
            <span className='text-xs text-gray-400'>{label} · {timestamp}</span>
          )}
          <p className='text-sm text-gray-700 mt-0.5 leading-relaxed'>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] space-y-1 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {timestamp && (
          <span className='text-xs text-gray-400'>{label} · {timestamp}</span>
        )}
        <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed
          ${isUser ? userBg : 'bg-gray-100 text-gray-900'}`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

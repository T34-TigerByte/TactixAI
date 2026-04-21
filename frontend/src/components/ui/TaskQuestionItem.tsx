interface Option {
  answer_key: string;
  title: string;
}

interface TaskQuestionItemProps {
  questionKey: string;
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (questionKey: string, answerKey: string) => void;
}

export default function TaskQuestionItem({
  questionKey,
  title,
  options,
  selected,
  onToggle,
}: TaskQuestionItemProps) {
  const isDone = selected.length > 0;

  return (
    <div className='space-y-2'>
      <div className='flex items-start gap-2'>
        <span className={`text-sm mt-0.5 shrink-0 ${isDone ? 'text-teal-500' : 'text-gray-300'}`}>
          {isDone ? '✓' : '○'}
        </span>
        <p className='text-sm font-semibold text-gray-800 leading-snug'>{title}</p>
      </div>
      <div className='pl-5 space-y-1.5'>
        {options.map((opt) => (
          <label key={opt.answer_key} className='flex items-start gap-2 cursor-pointer group'>
            <input
              type='radio'
              name={`task-${questionKey}`}
              checked={selected.includes(opt.answer_key)}
              onChange={() => onToggle(questionKey, opt.answer_key)}
              className='accent-orange-500 cursor-pointer mt-0.5 shrink-0'
            />
            <span className='text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed'>
              {opt.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

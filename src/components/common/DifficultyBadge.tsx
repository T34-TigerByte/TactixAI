
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  beginner: 'text-teal-600   border-teal-400   bg-teal-50',
  intermediate: 'text-orange-500 border-orange-400 bg-orange-50',
  advanced: 'text-red-600    border-red-400     bg-red-50',
};

const DifficultyBadge = ({ level }: { level: Difficulty }) => (
  <span
    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${DIFFICULTY_STYLE[level]}`}
  >
    {level}
  </span>
);

export default DifficultyBadge;

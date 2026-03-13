import { Flame } from 'lucide-react';

const Logo = () => {

  return (
    <div className='flex items-center gap-2'>
      <div className='w-8 h-8 bg-orange-600 rounded-sm flex items-center justify-center'>
        <Flame className='w-5 h-5 text-white' />
      </div>
      <span className='text-orange-500 font-semibold text-lg'>
        Flame Tree
      </span>
      <span className='font-semibold text-lg text-white'>
        TactixAI.
      </span>
    </div>
  );
};

export default Logo;

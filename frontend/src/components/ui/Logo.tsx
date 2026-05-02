const Logo = () => {
  return (
    <div className='flex items-end'>
      {/* Mobile/tablet: icon-only logo */}
      <img
        src='/logo_simple_Favicon.png'
        alt='TactixAI'
        className='block sm:hidden h-9 w-9 object-contain'
      />
      {/* Desktop: full-width logo (white "Cyber" variant for dark backgrounds) */}
      <img
        src='/flame_tree_cyber_logo_white.png'
        alt='TactixAI'
        className='hidden sm:block h-10 object-contain'
      />
      <span className='hidden sm:inline font-semibold text-lg leading-none text-white ml-2 mb-2'>TactixAI.</span>
    </div>
  );
};

export default Logo;

/**
 * For keyboard only user, skip the repetitive header and let the user jump straight into main content
 * In normal case, visibility hidden, with Tab key, visible on focus 
 */
export default function SkipNav() {
  return (
    <a
      href='#main'
      className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-orange-600 focus:text-white
                 focus:text-sm focus:font-medium focus:shadow-lg'
    >
      Skip to main content
    </a>
  );
}
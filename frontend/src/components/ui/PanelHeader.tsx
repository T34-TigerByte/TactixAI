const PanelHeader = ({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title: string;
}) => (
  <div className='flex items-center gap-3 px-6 py-4 bg-slate-900 rounded-t-xl'>
    <span className='text-teal-400'>{icon}</span>
    <h2 className='text-white font-semibold'>{title}</h2>
  </div>
);

export default PanelHeader;
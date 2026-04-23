interface ActionListItemProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function ActionListItem({ title, subtitle, actions }: ActionListItemProps) {
  return (
    <div className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors'>
      <div className='space-y-1'>
        <p className='font-semibold text-gray-900 text-sm'>{title}</p>
        {subtitle && <p className='text-gray-400 text-xs'>{subtitle}</p>}
      </div>
      {actions && <div className='flex items-center gap-2'>{actions}</div>}
    </div>
  );
}

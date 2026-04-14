interface StatCardProps {
  label: string;
  value?: number | string;
  subText?: string;
  icon: React.ReactNode;
  iconBg?: string;
  valueColor?: string;
}

const StatsCard = ({
  label,
  value,
  subText,
  icon,
  iconBg,
  valueColor = 'text-gray-900',
}: StatCardProps) => (
  <div
    className='bg-white rounded-xl border border-gray-200 p-6
                  flex items-center justify-between shadow-sm'
  >
    <div className='space-y-1'>
      <p className='text-gray-500 text-sm'>{label}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className='text-gray-500 text-sm'>{subText}</p>
    </div>
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg ? iconBg : ''}`}
    >
      {icon}
    </div>
  </div>
);

export default StatsCard;

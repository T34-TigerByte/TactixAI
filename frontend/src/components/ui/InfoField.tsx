interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

export default function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className='text-xs text-gray-400 mb-1'>{label}</p>
      <p className='text-sm font-medium text-gray-900'>{value}</p>
    </div>
  );
}

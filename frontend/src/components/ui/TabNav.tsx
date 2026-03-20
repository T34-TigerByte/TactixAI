interface Tab<T extends string> {
  key: T;
  label: string;
}

interface TabNavProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export default function TabNav<T extends string>({ tabs, activeTab, onChange }: TabNavProps<T>) {
  return (
    <div className='flex rounded-xl overflow-hidden bg-slate-900 p-1'>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${activeTab === tab.key ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import PanelHeader from './PanelHeader';

interface SectionPanelProps {
  title: string;
  icon?: React.ReactNode;
  header?: React.ReactNode; // custom header override
  children: React.ReactNode;
  className?: string;
}

export default function SectionPanel({ title, icon, header, children, className }: SectionPanelProps) {
  return (
    <section className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className ?? ''}`}>
      {header ?? <PanelHeader icon={icon} title={title} />}
      {children}
    </section>
  );
}

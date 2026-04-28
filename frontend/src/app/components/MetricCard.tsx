import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string; // made optional
  iconBgColor?: string; // made optional
}

export default function MetricCard({ title, value, icon: Icon, iconColor, iconBgColor }: MetricCardProps) {
  // If no explicit colors are passed, use elegant defaults
  const bgClass = iconBgColor || "bg-secondary";
  const fgClass = iconColor || "text-primary";

  return (
    <Card className="p-8 border border-border/40 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <p className="text-4xl font-serif text-foreground">{value}</p>
        </div>
        <div className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center border border-border/30`}>
          <Icon className={`w-8 h-8 ${fgClass}`} strokeWidth={1.5} />
        </div>
      </div>
    </Card>
  );
}

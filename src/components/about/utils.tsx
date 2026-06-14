import * as LucideIcons from 'lucide-react';

export function getLucideIcon(iconName: string, className = 'h-6 w-6') {
  const Icon = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  return Icon ? <Icon className={className} aria-hidden="true" /> : null;
}

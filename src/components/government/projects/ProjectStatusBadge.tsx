import { KNOWN_PROJECT_STATUSES } from '../../../data/yamlLoader';

const knownStatusStyles: Record<
  (typeof KNOWN_PROJECT_STATUSES)[number],
  { label: string; className: string }
> = {
  ongoing: {
    label: 'Ongoing',
    className: 'bg-blue-100 text-blue-800',
  },
  planned: {
    label: 'Planned',
    className: 'bg-amber-100 text-amber-800',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800',
  },
};

function formatStatusLabel(status: string): string {
  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface ProjectStatusBadgeProps {
  status?: string;
}

export default function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps) {
  if (!status?.trim()) {
    return null;
  }

  const normalized = status.trim().toLowerCase();
  const knownConfig =
    knownStatusStyles[normalized as keyof typeof knownStatusStyles];

  const label = knownConfig?.label ?? formatStatusLabel(status);
  const className = knownConfig?.className ?? 'bg-gray-100 text-gray-700';

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${className}`}
    >
      {label}
    </span>
  );
}

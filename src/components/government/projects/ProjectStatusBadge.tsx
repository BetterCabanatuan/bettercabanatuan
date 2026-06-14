import type { ProjectStatus } from '../../../data/yamlLoader';

const statusStyles: Record<
  ProjectStatus,
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

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = statusStyles[status];

  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}

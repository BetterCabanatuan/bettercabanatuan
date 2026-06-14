import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { getIconComponent } from '../../../lib/iconMap';
import type { Project } from '../../../data/yamlLoader';
import ProjectStatusBadge from './ProjectStatusBadge';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon = getIconComponent(project.icon);

  return (
    <Link
      to={`/government/projects/${project.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
    >
      <Card
        hoverable
        className="h-full border-t-4 border-accent-500 transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent-50 text-accent-600 shrink-0">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <ProjectStatusBadge status={project.status} />
          </div>

          <p className="text-xs font-medium text-gray-500 mb-1">
            {project.category}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-200 mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {project.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">{project.budget}</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all duration-200">
              View project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

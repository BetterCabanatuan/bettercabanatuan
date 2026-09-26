import CategoryCard from '../../ui/CategoryCard';
import { getIconComponent } from '../../../lib/iconMap';
import type { Project } from '../../../data/yamlLoader';
import ProjectStatusBadge from './ProjectStatusBadge';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  project: Project;
}

/**
 * A project is the same card with a status badge where a department has an
 * acronym. Sharing `CategoryCard` is the point: the two used to differ in
 * padding, tile size, and border colour, which is why a mixed grid of
 * departments and projects never quite lined up.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation('common');

  return (
    <CategoryCard
      to={`/government/projects/${project.slug}`}
      title={project.name}
      description={project.description}
      icon={getIconComponent(project.icon, { domain: 'government' })}
      // Projects carry the accent hue; departments and categories stay on
      // primary. One accent per section keeps a grid from turning into a
      // colour chart.
      tone="accent"
      headingLevel={3}
      meta={<ProjectStatusBadge status={project.status} />}
      footnote={project.budget}
      cta={t('projects.viewProject')}
    />
  );
}

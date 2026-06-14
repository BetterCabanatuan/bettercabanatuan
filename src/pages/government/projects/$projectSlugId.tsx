import { useParams } from 'react-router-dom';
import { getProjectBySlug } from '../../../data/yamlLoader';
import ProjectDetail, {
  ProjectNotFound,
} from '../../../components/government/projects/ProjectDetail';

export default function ProjectDetailPage() {
  const { projectSlugId } = useParams();
  const project = projectSlugId ? getProjectBySlug(projectSlugId) : undefined;

  if (!project) {
    return <ProjectNotFound />;
  }

  return <ProjectDetail project={project} />;
}

import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Building2, Wallet } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { getIconComponent } from '../../../lib/iconMap';
import { Text } from '../../ui/Text';
import Section from '../../ui/Section';
import Breadcrumbs from '../../ui/Breadcrumbs';
import SEO from '../../SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import type { Project } from '../../../data/yamlLoader';
import ProjectStatusBadge from './ProjectStatusBadge';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const Icon = getIconComponent(project.icon);

  return (
    <>
      <SEO
        title={project.name}
        description={project.description}
        keywords={`${project.name}, ${project.category}, Cabanatuan City project, infrastructure`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: 'Projects', href: '/government/projects' },
            {
              label: project.name,
              href: `/government/projects/${project.slug}`,
            },
          ]}
        />

        <Link
          to="/government/projects"
          className="inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent-50 text-accent-600 shrink-0">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <ProjectStatusBadge status={project.status} />
                  <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                    {project.category}
                  </span>
                </div>
                <Heading className="mb-2">{project.name}</Heading>
                <Text className="text-gray-600 mb-0">
                  {project.description}
                </Text>
              </div>
            </div>
          </div>

          <Card className="h-fit border-t-4 border-accent-500">
            <CardContent className="p-6 space-y-4">
              <Heading level={3} className="text-lg mb-2">
                Project Details
              </Heading>
              <DetailRow
                icon={Building2}
                label="Lead Department"
                value={project.department}
              />
              <DetailRow
                icon={MapPin}
                label="Location"
                value={project.location}
              />
              <DetailRow icon={Wallet} label="Budget" value={project.budget} />
              <DetailRow
                icon={Calendar}
                label="Timeline"
                value={`${project.startDate} → ${project.endDate}`}
              />
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export function ProjectNotFound() {
  return (
    <Section className="p-3 mb-12">
      <Breadcrumbs className="mb-8" />
      <Banner
        type="error"
        title="Project not found"
        description="The project you are looking for does not exist."
        icon
      />
    </Section>
  );
}

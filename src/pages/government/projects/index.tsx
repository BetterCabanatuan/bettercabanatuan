import { HardHat } from 'lucide-react';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import ProjectsList from '../../../components/government/projects/ProjectsList';
import { allProjects, projectsData } from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

export default function ProjectsPage() {
  return (
    <>
      <SEO
        title="Projects"
        description={`Infrastructure and community development projects in ${siteConfig.governmentName}.`}
        keywords="projects, infrastructure, development, Cabanatuan City, local government"
      />
      <main className="flex-grow">
        <GovernmentPageHero
          eyebrow="City Development"
          title="Government Projects"
          description={projectsData.description}
          icon={HardHat}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Government', href: '/government' },
            { label: 'Projects', href: '/government/projects' },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <ProjectsList projects={allProjects} />
        </Section>
      </main>
    </>
  );
}

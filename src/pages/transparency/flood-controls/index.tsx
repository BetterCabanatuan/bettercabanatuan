import { Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import FloodControlsFeatured from '../../../components/government/projects/FloodControlsFeatured';
import {
  allFloodControlProjects,
  floodControlsData,
} from '../../../data/yamlLoader';
import { siteConfig } from '../../../lib/siteConfig';

export default function FloodControlsPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <SEO
        title={floodControlsData.title}
        description={floodControlsData.description}
        keywords={`flood control, drainage, infrastructure, transparency, ${siteConfig.governmentName}`}
      />
      <main className="flex-grow" id="main-content">
        <GovernmentPageHero
          eyebrow={t('transparency.eyebrow')}
          title={floodControlsData.title}
          description={floodControlsData.description}
          icon={Droplets}
          breadcrumbs={[
            { label: t('common.home'), href: '/' },
            { label: t('transparency.title'), href: '/transparency' },
            {
              label: floodControlsData.title,
              href: '/transparency/flood-controls',
            },
          ]}
        />
        <Section className="p-3 mb-12 pt-10">
          <FloodControlsFeatured
            title={floodControlsData.title}
            description={floodControlsData.description}
            projects={allFloodControlProjects}
            showHeader={false}
            className=""
          />
        </Section>
      </main>
    </>
  );
}

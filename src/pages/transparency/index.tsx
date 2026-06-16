import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import SEO from '../../components/SEO';
import Section from '../../components/ui/Section';
import { Text } from '../../components/ui/Text';
import { Heading } from '../../components/ui/Heading';
import GovernmentPageHero from '../../components/government/GovernmentPageHero';
import TransparencyResourceCard from '../../components/transparency/TransparencyResourceCard';
import { transparencyData } from '../../data/yamlLoader';
import { siteConfig } from '../../lib/siteConfig';

export default function TransparencyPage() {
  const { t } = useTranslation('common');
  const pageDescription =
    transparencyData.description || t('transparency.description');

  return (
    <>
      <SEO
        title={t('transparency.title')}
        description={pageDescription}
        keywords={`transparency, FOI, open government, ${siteConfig.governmentName}, public documents, accountability`}
      />
      <main className="flex-grow" id="main-content">
        <GovernmentPageHero
          eyebrow={t('transparency.eyebrow')}
          title={t('transparency.title')}
          description={pageDescription}
          icon={FileText}
          breadcrumbs={[
            { label: t('common.home'), href: '/' },
            { label: t('transparency.title'), href: '/transparency' },
          ]}
        />

        <Section className="p-3 mb-12 pt-10">
          <Text className="text-gray-600 mb-10 max-w-3xl">
            {t('transparency.intro', { city: siteConfig.governmentName })}
          </Text>

          <div className="space-y-12">
            {transparencyData.sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`transparency-section-${section.id}`}
                className="motion-safe:animate-fade-in scroll-mt-28"
                style={{ animationDelay: `${sectionIndex * 80}ms` }}
              >
                <Heading
                  id={`transparency-section-${section.id}`}
                  level={2}
                  className="mb-2"
                >
                  {section.title}
                </Heading>
                <Text className="text-gray-600 mb-6 max-w-3xl">
                  {section.description}
                </Text>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {section.resources.map((resource, resourceIndex) => (
                    <div
                      key={resource.href}
                      className="motion-safe:animate-slide-in"
                      style={{
                        animationDelay: `${120 + resourceIndex * 50}ms`,
                      }}
                    >
                      <TransparencyResourceCard resource={resource} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
}

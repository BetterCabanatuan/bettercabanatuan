import { Bus, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import CategoryCard from '../ui/CategoryCard';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import type { VisualTone } from '../../lib/visualTokens';

interface CivicApp {
  /** Key under `civicApps.apps` in the locale files. */
  key: string;
  href: string;
  icon: LucideIcon;
  tone: VisualTone;
}

/**
 * Standalone tools built by the Better Cabanatuan community, hosted on their
 * own subdomains. They open in a new tab, so the card says so in its CTA.
 */
const CIVIC_APPS: CivicApp[] = [
  {
    key: 'pamasahe',
    href: 'https://pamasahe.bettercabanatuan.org',
    icon: Bus,
    tone: 'accent',
  },
];

export default function CivicAppsSection() {
  const { t } = useTranslation();

  return (
    <Section aria-labelledby="civic-apps-title">
      <Heading level={2} id="civic-apps-title" className="text-balance">
        {t('civicApps.title')}
      </Heading>
      <Text className="mb-6 text-pretty text-gray-600">
        {t('civicApps.description')}
      </Text>

      <CardGrid label={t('civicApps.title')}>
        {CIVIC_APPS.map(app => (
          <CardGridItem key={app.key}>
            <CategoryCard
              to={app.href}
              external
              title={t(`civicApps.apps.${app.key}.title`)}
              description={t(`civicApps.apps.${app.key}.description`)}
              icon={app.icon}
              tone={app.tone}
              cta={t('civicApps.open')}
            />
          </CardGridItem>
        ))}
      </CardGrid>
    </Section>
  );
}

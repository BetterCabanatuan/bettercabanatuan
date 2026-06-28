import { ExternalLink, Megaphone } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import FacebookPagePlugin from '../FacebookPagePlugin';
import { siteConfig } from '../../lib/siteConfig';

export default function FacebookSection() {
  const { t } = useTranslation();

  if (!siteConfig.facebookUrl) return null;

  return (
    <Section className="relative overflow-hidden ">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary-100/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10">
        <div
          className="max-w-sm text-center lg:text-left motion-safe:animate-slide-in motion-reduce:animate-none"
          style={{ animationDelay: '0ms' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 mb-4">
            <Megaphone className="size-4 shrink-0" aria-hidden="true" />
            <span>{t('news.badge')}</span>
          </div>
          <Heading level={2} className="mb-3 text-gray-900 text-balance">
            {t('news.title')}
          </Heading>
          <Text className="text-gray-600 mb-6 text-pretty">
            {t('news.description')}
          </Text>
          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,102,235,0.25)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,102,235,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:scale-[0.96] motion-reduce:active:scale-100"
          >
            {t('news.followCta')}
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div
          className="max-w-full shrink-0 motion-safe:animate-slide-in motion-reduce:animate-none"
          style={{ animationDelay: '100ms' }}
        >
          <FacebookPagePlugin
            href={siteConfig.facebookUrl}
            pageName={siteConfig.governmentName}
          />
        </div>
      </div>
    </Section>
  );
}

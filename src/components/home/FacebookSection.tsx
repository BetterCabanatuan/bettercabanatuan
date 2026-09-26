import { ExternalLink, Megaphone } from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import FacebookPagePlugin from '../FacebookPagePlugin';
import NewsList from '../government/news/NewsList';
import { allNews } from '../../data/news';
import { siteConfig } from '../../lib/siteConfig';

/**
 * The official-updates band.
 *
 * ## What this replaced
 *
 * This section used to render a "Latest News & Updates" heading, a
 * "Follow on Facebook" button, the Facebook feed, and *then* a `NewsList` with
 * its own "Latest News & Updates" heading, its own "OFFICIAL UPDATES" eyebrow,
 * and an empty state carrying a second "See announcements on Facebook" button.
 *
 * With no news items published, that meant the page showed the same heading
 * twice, the same eyebrow twice, the same call to action twice, and a large
 * empty state card — roughly a thousand pixels of page explaining that there
 * was nothing there.
 *
 * ## What it does now
 *
 * The band is the city's official announcement channel, and the Facebook feed
 * is its content. That framing means the copy can describe a channel that
 * always has something in it, instead of promising news items that may not
 * exist.
 *
 * The editorial list is a second thing and is treated as one: it renders only
 * when `news.yaml` has items, with no heading of its own, because the band
 * already labels the section. When the file is empty the list collapses and
 * leaves no gap. `/government/news` still shows a full empty state — there, an
 * explanation is the point of the page.
 */
export default function FacebookSection() {
  const { t } = useTranslation();

  if (!siteConfig.facebookUrl) return null;

  const hasNews = allNews.length > 0;

  return (
    <Section className="relative overflow-hidden">
      {/*
        Decorative wash. Purely atmospheric, behind everything, and hidden from
        assistive tech.
      */}
      <div
        className="bg-primary-100/40 pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-secondary-100/20 pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-sm text-center lg:text-left">
          <div className="bg-primary-50 text-primary-700 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Megaphone className="size-4 shrink-0" aria-hidden="true" />
            <span>{t('news.badge')}</span>
          </div>

          <Heading level={2} className="mb-3 text-balance text-gray-900">
            {t('news.title')}
          </Heading>

          <Text className="mb-6 text-pretty text-gray-600">
            {t('news.description')}
          </Text>

          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-600 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,102,235,0.25)] hover:bg-primary-700 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_20px_rgba(0,102,235,0.3)] focus-visible:ring-primary-600 focus-visible:ring-offset-2 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-[transform,background-color,box-shadow] duration-200 focus:outline-none active:scale-[0.96] motion-reduce:active:scale-100"
          >
            {t('news.followCta')}
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div className="flex justify-center lg:justify-end">
          <FacebookPagePlugin
            href={siteConfig.facebookUrl}
            pageName={siteConfig.governmentName}
          />
        </div>
      </div>

      {/*
        The editorial list, only once it has something to show. It carries no
        heading of its own — the band above already names the section — and the
        top rule plus `mt-12` keeps it on the same vertical rhythm as the
        sections either side of it.
      */}
      {hasNews && (
        <div className="border-gray-200 relative mt-12 border-t pt-10">
          <NewsList limit={3} showHeader={false} />
        </div>
      )}
    </Section>
  );
}

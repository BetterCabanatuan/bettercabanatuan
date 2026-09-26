import { CalendarDays, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import { parseNewsDate, type NewsItem } from '../../../data/news';

interface NewsCardProps {
  item: NewsItem;
  className?: string;
}

export default function NewsCard({ item, className = '' }: NewsCardProps) {
  const { t, i18n } = useTranslation('common');

  const published = parseNewsDate(item.date);
  const formattedDate = Number.isNaN(published.getTime())
    ? item.date
    : new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(published);

  return (
    <Card
      className={`h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] ${className}`}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <p className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={item.date}>
            {t('newsFeed.publishedOn', { date: formattedDate })}
          </time>
        </p>

        <Heading level={3} className="text-base mb-2 text-balance">
          {item.title}
        </Heading>

        {item.summary && (
          <Text className="text-sm text-gray-600 mb-4 flex-grow text-pretty">
            {item.summary}
          </Text>
        )}

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-auto min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200 self-start"
        >
          {item.sourceName
            ? `${t('newsFeed.readMore')} — ${item.sourceName}`
            : t('newsFeed.readMore')}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      </CardContent>
    </Card>
  );
}

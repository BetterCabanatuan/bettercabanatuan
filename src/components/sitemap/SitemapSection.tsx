import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Card, CardContent } from '@bettergov/kapwa/card';
import type { SitemapGroup } from '../../data/sitemap';

interface SitemapSectionProps {
  group: SitemapGroup;
  animationDelay?: number;
  compact?: boolean;
}

export default function SitemapSection({
  group,
  animationDelay = 0,
  compact = false,
}: SitemapSectionProps) {
  const Icon = group.icon;

  return (
    <section
      id={group.id}
      aria-labelledby={`sitemap-${group.id}-heading`}
      className="motion-safe:animate-slide-in scroll-mt-24"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Card className="h-full border-t-4 border-primary-500 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 shrink-0">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <Heading
                level={2}
                id={`sitemap-${group.id}-heading`}
                className="text-xl mb-1"
              >
                {group.title}
              </Heading>
              <Text className="text-gray-600 text-sm mb-0">
                {group.description}
              </Text>
            </div>
          </div>

          <nav aria-label={`${group.title} links`}>
            <ul
              className={
                compact
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'
                  : 'space-y-2'
              }
            >
              {group.links.map(link => (
                <li key={`${group.id}-${link.href}-${link.label}`}>
                  <SitemapLinkRow link={link} compact={compact} />
                </li>
              ))}
            </ul>
          </nav>
        </CardContent>
      </Card>
    </section>
  );
}

interface SitemapLinkRowProps {
  link: SitemapGroup['links'][number];
  compact?: boolean;
}

function SitemapLinkRow({ link, compact }: SitemapLinkRowProps) {
  const content = (
    <>
      <span className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
        {link.label}
      </span>
      {!compact && link.description && (
        <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2">
          {link.description}
        </span>
      )}
    </>
  );

  const className =
    'group flex items-start justify-between gap-3 min-h-[44px] px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/80 hover:border-primary-200 hover:bg-primary-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200';

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span className="min-w-0">{content}</span>
        <ExternalLink
          className="h-4 w-4 text-gray-400 group-hover:text-primary-600 shrink-0 mt-0.5"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <Link to={link.href} className={className}>
      <span className="min-w-0">{content}</span>
      <ArrowRight
        className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 shrink-0 mt-0.5 transition-transform duration-200"
        aria-hidden="true"
      />
    </Link>
  );
}

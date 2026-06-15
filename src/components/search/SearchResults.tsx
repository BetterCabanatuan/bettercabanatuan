import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { getSearchTypeIcon } from '../../data/searchIndex';
import type { SearchResult } from '../../lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSuggestedSearch: (query: string) => void;
  suggestedSearches: string[];
}

export default function SearchResults({
  results,
  query,
  onSuggestedSearch,
  suggestedSearches,
}: SearchResultsProps) {
  const { t } = useTranslation('common');

  if (!query.trim()) {
    return (
      <div className="motion-safe:animate-fade-in">
        <Heading level={2} className="mb-3">
          {t('search.suggestionsTitle')}
        </Heading>
        <Text className="text-gray-600 mb-6 max-w-2xl">
          {t('search.suggestionsDescription')}
        </Text>
        <div className="flex flex-wrap gap-2">
          {suggestedSearches.map(term => (
            <button
              key={term}
              type="button"
              onClick={() => onSuggestedSearch(term)}
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full bg-primary-50 text-primary-700 border border-primary-200 text-sm font-medium hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center motion-safe:animate-fade-in"
        aria-live="polite"
      >
        <Heading level={3} className="mb-2">
          {t('search.noResultsTitle')}
        </Heading>
        <Text className="text-gray-600 mb-6">
          {t('search.noResultsDescription', { query })}
        </Text>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestedSearches.slice(0, 4).map(term => (
            <button
              key={term}
              type="button"
              onClick={() => onSuggestedSearch(term)}
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full bg-white text-primary-700 border border-primary-200 text-sm font-medium hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label={t('search.resultsLabel')}>
      {results.map((result, index) => {
        const TypeIcon = getSearchTypeIcon(result.type);
        const content = (
          <Card
            hoverable
            className="border-l-4 border-l-primary-500 motion-safe:animate-slide-in hover:-translate-y-0.5 transition-transform duration-200"
            style={{ animationDelay: `${80 + index * 40}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                      <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {result.typeLabel}
                    </span>
                    {result.external && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {t('search.external')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {result.label}
                  </h3>
                  {result.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                </div>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-primary-500 transition-colors duration-200"
                  aria-hidden="true"
                />
              </div>
            </CardContent>
          </Card>
        );

        return (
          <li key={result.id}>
            {result.external ? (
              <a
                href={result.href}
                target="_blank"
                rel="noreferrer"
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl"
              >
                {content}
              </a>
            ) : (
              <Link
                to={result.href}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-xl"
              >
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

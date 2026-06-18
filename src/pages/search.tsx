import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import SearchHero from '../components/search/SearchHero';
import SearchFilters, {
  type SearchFilterValue,
} from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import {
  getSearchCanonicalUrl,
  searchFilters,
  searchIndex,
  searchSeo,
  suggestedSearches,
} from '../data/searchIndex';
import { parseSearchQuery, searchItems } from '../lib/search';
import { siteConfig } from '../lib/siteConfig';

function parseFilter(value: string | null): SearchFilterValue {
  if (
    value === 'main' ||
    value === 'services' ||
    value === 'government' ||
    value === 'barangays' ||
    value === 'resources'
  ) {
    return value;
  }
  return 'all';
}

export default function SearchPage() {
  const { t } = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = parseSearchQuery(searchParams.get('q'));
  const activeFilter = parseFilter(searchParams.get('type'));
  const [draftQuery, setDraftQuery] = useState(urlQuery);

  useEffect(() => {
    setDraftQuery(urlQuery);
  }, [urlQuery]);

  const results = useMemo(
    () =>
      searchItems(searchIndex, {
        query: urlQuery,
        type: activeFilter,
      }),
    [urlQuery, activeFilter]
  );

  const updateSearchParams = useCallback(
    (query: string, type: SearchFilterValue) => {
      const params: Record<string, string> = {};
      const trimmedQuery = query.trim();
      if (trimmedQuery) params.q = trimmedQuery;
      if (type !== 'all') params.type = type;
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const commitSearch = useCallback(
    (query = draftQuery, type = activeFilter) => {
      setDraftQuery(query);
      updateSearchParams(query, type);
    },
    [activeFilter, draftQuery, updateSearchParams]
  );

  const handleFilterChange = (type: SearchFilterValue) => {
    updateSearchParams(draftQuery, type);
  };

  const handleSuggestedSearch = (query: string) => {
    setDraftQuery(query);
    updateSearchParams(query, activeFilter);
  };

  const pageDescription = searchSeo.description;
  const seoDescription = urlQuery
    ? t('search.seoWithQuery', {
        query: urlQuery,
        city: siteConfig.governmentName,
      })
    : pageDescription;

  return (
    <>
      <SEO
        title={searchSeo.title}
        description={seoDescription}
        keywords={searchSeo.keywords}
        url={getSearchCanonicalUrl(urlQuery, activeFilter)}
        noindex
      />
      <main className="flex-grow" id="main-content">
        <SearchHero
          title={t('search.title')}
          description={pageDescription}
          query={draftQuery}
          onQueryChange={setDraftQuery}
          onSubmit={() => commitSearch()}
          resultCount={urlQuery.trim() ? results.length : undefined}
        />

        <Section className="p-3 mb-12 pt-10">
          <SearchFilters
            filters={searchFilters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
          <SearchResults
            results={results}
            query={urlQuery}
            onSuggestedSearch={handleSuggestedSearch}
            suggestedSearches={suggestedSearches}
          />
        </Section>
      </main>
    </>
  );
}

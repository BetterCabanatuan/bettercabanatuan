import { FormEvent, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../ui/Breadcrumbs';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

interface SearchHeroProps {
  title: string;
  description: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  resultCount?: number;
}

export default function SearchHero({
  title,
  description,
  query,
  onQueryChange,
  onSubmit,
  resultCount,
}: SearchHeroProps) {
  const { t } = useTranslation('common');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-16 lg:py-20"
      aria-labelledby="search-page-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />

      <div className="container mx-auto px-4 relative motion-safe:animate-fade-in">
        <Breadcrumbs
          className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/60"
          items={[
            { label: t('common.home'), href: '/' },
            { label: t('common.search'), href: '/search' },
          ]}
        />

        <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
          {t('search.eyebrow')}
        </p>
        <Heading id="search-page-heading" className="text-white mb-3 max-w-3xl">
          {title}
        </Heading>
        <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-8">
          {description}
        </Text>

        <form
          role="search"
          onSubmit={handleSubmit}
          className="max-w-3xl"
          aria-label={t('search.formLabel')}
        >
          <label htmlFor="site-search" className="sr-only">
            {t('search.inputLabel')}
          </label>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                value={query}
                onChange={event => onQueryChange(event.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full min-h-[52px] pl-12 pr-4 py-3 rounded-xl border-0 bg-white text-gray-900 text-base shadow-lg shadow-primary-900/20 placeholder:text-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              />
            </div>
            <button
              type="submit"
              className="min-h-[52px] px-8 py-3 rounded-xl bg-white text-primary-800 font-semibold hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 transition-colors duration-200"
            >
              {t('search.submit')}
            </button>
          </div>
        </form>

        {typeof resultCount === 'number' && query.trim() && (
          <p
            className="mt-4 text-sm text-primary-100"
            aria-live="polite"
            aria-atomic="true"
          >
            {t('search.resultCount', { count: resultCount, query })}
          </p>
        )}
      </div>
    </section>
  );
}

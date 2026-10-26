import { useMemo, useRef, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ClipboardList,
  ExternalLink,
  HardHat,
  ListChecks,
  Package,
  Search,
  Wallet,
} from 'lucide-react';
import { Banner } from '@bettergov/kapwa/banner';
import SEO from '../../../components/SEO';
import Section from '../../../components/ui/Section';
import { Heading } from '../../../components/ui/Heading';
import { Card, CardContent } from '../../../components/ui/Card';
import GovernmentPageHero from '../../../components/government/GovernmentPageHero';
import ProcurementOfficeBreakdown from '../../../components/transparency/procurement/ProcurementOfficeBreakdown';
import ProcurementItemsTable from '../../../components/transparency/procurement/ProcurementItemsTable';
import {
  formatDate,
  formatPeso,
  formatPesoCompact,
} from '../../../components/transparency/procurement/format';
import {
  officeCodes,
  officeInfo,
  procurementPlan,
  totalBudget,
  totalsByLeadOffice,
} from '../../../data/procurementPlan';
import { siteConfig } from '../../../lib/siteConfig';

const PATH = '/transparency/procurement-plan';
const { source, items: allItems } = procurementPlan;

const officeTotals = totalsByLeadOffice(allItems);

/** Lead offices by budget, then offices only ever listed alongside another. */
const officeOptions = [
  ...officeTotals.map(o => o.code),
  ...[...new Set(allItems.flatMap(i => officeCodes(i.office)))]
    .filter(code => !officeTotals.some(o => o.code === code))
    .sort((a, b) => a.localeCompare(b)),
].map(code => {
  const info = officeInfo(code);
  const label = info.name
    ? info.isCode
      ? `${info.name} (${code})`
      : info.name
    : info.label;
  return { code, label };
});

/** Distinct values of a field, most common first. */
function optionsOf(field: 'category' | 'mode') {
  const counts = new Map<string, number>();
  for (const item of allItems) {
    if (item[field])
      counts.set(item[field], (counts.get(item[field]) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
}
const categoryOptions = optionsOf('category');
const modeOptions = optionsOf('mode');

const isInfrastructure = (category: string) =>
  category.includes('Infrastructure');

const selectClass =
  'w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600';

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-gray-600"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={selectClass}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function ProcurementPlanPage() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language;
  const [params, setParams] = useSearchParams();
  const itemsRef = useRef<HTMLElement>(null);

  const office = params.get('office') ?? '';
  const category = params.get('category') ?? '';
  const mode = params.get('mode') ?? '';
  const query = params.get('q') ?? '';
  const sort = params.get('sort') === 'budget' ? 'budget' : 'plan';

  const setParam = (key: string, value: string) => {
    setParams(
      current => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      // Typing in the search box should not stack history entries.
      { replace: key === 'q' }
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = allItems.filter(
      item =>
        (!office || officeCodes(item.office).includes(office)) &&
        (!category || item.category === category) &&
        (!mode || item.mode === mode) &&
        (!q ||
          [item.title, item.group ?? '', item.office, item.fund].some(text =>
            text.toLowerCase().includes(q)
          ))
    );
    if (sort === 'budget') {
      result.sort((a, b) => (b.budget ?? -1) - (a.budget ?? -1));
    }
    return result;
  }, [office, category, mode, query, sort]);

  const hasFilters = Boolean(office || category || mode || query);
  const title = t('procurementPlan.title', { year: source.fiscalYear });
  const description = t('procurementPlan.description', {
    year: source.fiscalYear,
  });

  const total = totalBudget(allItems);
  const infrastructure = allItems.filter(i => isInfrastructure(i.category));
  const goods = allItems.filter(i => !isInfrastructure(i.category));
  const share = (part: number) =>
    new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(part / total);

  const stats = [
    {
      label: t('procurementPlan.stats.total'),
      value: formatPesoCompact(total, locale),
      note: formatPeso(total, locale),
      icon: Wallet,
    },
    {
      label: t('procurementPlan.stats.items'),
      value: String(allItems.length),
      note: t('procurementPlan.stats.itemsNote'),
      icon: ListChecks,
    },
    {
      label: t('procurementPlan.stats.infrastructure'),
      value: formatPesoCompact(totalBudget(infrastructure), locale),
      note: t('procurementPlan.stats.shareNote', {
        count: infrastructure.length,
        share: share(totalBudget(infrastructure)),
      }),
      icon: HardHat,
    },
    {
      label: t('procurementPlan.stats.goods'),
      value: formatPesoCompact(totalBudget(goods), locale),
      note: t('procurementPlan.stats.shareNote', {
        count: goods.length,
        share: share(totalBudget(goods)),
      }),
      icon: Package,
    },
  ];

  const selectOffice = (code: string) => {
    setParam('office', code);
    if (code) {
      const reduceMotion = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      itemsRef.current?.scrollIntoView?.({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={`annual procurement plan, procurement, bidding, budget, transparency, ${siteConfig.governmentName}`}
        url={PATH}
      />
      <GovernmentPageHero
        eyebrow={t('transparency.eyebrow')}
        title={title}
        description={description}
        icon={ClipboardList}
        breadcrumbs={[
          { label: t('common.home'), href: '/' },
          { label: t('transparency.title'), href: '/transparency' },
          { label: title, href: PATH },
        ]}
      />

      <Section className="p-3 mb-12 pt-10">
        <div
          role="note"
          className="mb-10 max-w-3xl border-l-4 border-primary-600 pl-4"
        >
          <p className="font-semibold text-gray-900">
            {t('procurementPlan.noteTitle')}
          </p>
          <p className="mt-1 text-sm text-gray-700 text-pretty">
            {t('procurementPlan.note')}
          </p>
          <p className="mt-3 text-xs text-gray-500 text-pretty">
            {t('procurementPlan.source', {
              title: source.title,
              approved: formatDate(source.approvedDate, locale),
              posted: formatDate(source.postedDate, locale),
            })}
          </p>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 rounded text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            {t('procurementPlan.openPdf', { pages: source.pages })}
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">({t('transparency.external')})</span>
          </a>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(stat => (
            <Card key={stat.label} className="h-full ring-1 ring-black/[0.06]">
              <CardContent className="p-5">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mb-1 text-2xl font-bold text-gray-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-gray-500 tabular-nums">
                  {stat.note}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <ProcurementOfficeBreakdown
          totals={officeTotals}
          selected={office}
          onSelect={selectOffice}
        />

        <section
          ref={itemsRef}
          aria-labelledby="procurement-items"
          className="scroll-mt-28"
        >
          <Heading id="procurement-items" level={2} className="mb-6">
            {t('procurementPlan.items.heading')}
          </Heading>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr]">
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="procurement-search"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                {t('procurementPlan.items.search')}
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="procurement-search"
                  type="search"
                  value={query}
                  onChange={e => setParam('q', e.target.value)}
                  placeholder={t('procurementPlan.items.searchPlaceholder')}
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
            <FilterSelect
              id="procurement-office"
              label={t('procurementPlan.items.office')}
              value={office}
              onChange={value => setParam('office', value)}
            >
              <option value="">{t('procurementPlan.items.allOffices')}</option>
              {officeOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              id="procurement-category"
              label={t('procurementPlan.items.category')}
              value={category}
              onChange={value => setParam('category', value)}
            >
              <option value="">
                {t('procurementPlan.items.allCategories')}
              </option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              id="procurement-mode"
              label={t('procurementPlan.items.mode')}
              value={mode}
              onChange={value => setParam('mode', value)}
            >
              <option value="">{t('procurementPlan.items.allModes')}</option>
              {modeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              id="procurement-sort"
              label={t('procurementPlan.items.sort')}
              value={sort}
              onChange={value =>
                setParam('sort', value === 'plan' ? '' : value)
              }
            >
              <option value="plan">
                {t('procurementPlan.items.sortPlan')}
              </option>
              <option value="budget">
                {t('procurementPlan.items.sortBudget')}
              </option>
            </FilterSelect>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p
              className="text-sm text-gray-600 tabular-nums"
              aria-live="polite"
            >
              {hasFilters
                ? t('procurementPlan.items.matching', {
                    count: filtered.length,
                    total: formatPeso(totalBudget(filtered), locale),
                  })
                : t('procurementPlan.items.all', {
                    count: allItems.length,
                    total: formatPeso(total, locale),
                  })}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() =>
                  setParams(sort === 'budget' ? { sort: 'budget' } : {})
                }
                className="rounded text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                {t('procurementPlan.items.clear')}
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <Banner
              type="info"
              title={t('procurementPlan.items.noResults')}
              description={t('procurementPlan.items.noResultsHint')}
              icon
            />
          ) : (
            <ProcurementItemsTable
              // A new filter starts the list from the top again.
              key={`${office}|${category}|${mode}|${query}|${sort}`}
              items={filtered}
            />
          )}
        </section>
      </Section>
    </>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import type { OfficeTotal } from '../../../data/procurementPlan';
import { formatPeso } from './format';

interface ProcurementOfficeBreakdownProps {
  totals: OfficeTotal[];
  /** Code of the office the table is filtered to, if any. */
  selected: string;
  onSelect: (code: string) => void;
}

const INITIAL_ROWS = 10;

/**
 * Planned budget by lead office as a ranked bar list. Every row prints its
 * amount and item count beside the bar, so the bars only add the shape of
 * the ranking; selecting a row filters the items table to that office.
 */
export default function ProcurementOfficeBreakdown({
  totals,
  selected,
  onSelect,
}: ProcurementOfficeBreakdownProps) {
  const { t, i18n } = useTranslation('common');
  const [expanded, setExpanded] = useState(false);

  const max = totals[0]?.total ?? 0;
  const rows = expanded ? totals : totals.slice(0, INITIAL_ROWS);

  return (
    <section aria-labelledby="procurement-by-office" className="mb-12">
      <Heading id="procurement-by-office" level={2} className="mb-2">
        {t('procurementPlan.byOffice.heading')}
      </Heading>
      <Text className="mb-6 max-w-3xl text-gray-600">
        {t('procurementPlan.byOffice.description')}
      </Text>

      <ol className="divide-y divide-gray-100 border-y border-gray-200">
        {rows.map(office => {
          const label = office.name ?? office.label;
          const isSelected = selected === office.code;
          return (
            <li key={office.code}>
              <button
                type="button"
                onClick={() => onSelect(isSelected ? '' : office.code)}
                aria-pressed={isSelected}
                aria-label={t('procurementPlan.byOffice.filter', {
                  office: label,
                })}
                className={`grid w-full grid-cols-1 gap-x-6 gap-y-1.5 px-2 py-3 text-left transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 sm:grid-cols-[minmax(0,16rem)_1fr_13rem] sm:items-center ${
                  isSelected ? 'bg-primary-50 hover:bg-primary-50' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900">
                    {label}
                  </span>
                  {office.name && office.isCode && (
                    <span className="block text-xs text-gray-500">
                      {office.label}
                    </span>
                  )}
                </span>
                <span
                  className="block h-2 rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <span
                    className="block h-2 rounded-full bg-primary-600"
                    style={{
                      width: `${max ? Math.max((office.total / max) * 100, 0.5) : 0}%`,
                    }}
                  />
                </span>
                <span className="text-sm tabular-nums sm:text-right">
                  <span className="font-semibold text-gray-900">
                    {formatPeso(office.total, i18n.language)}
                  </span>
                  <span className="ml-2 text-gray-500">
                    {t('procurementPlan.byOffice.itemCount', {
                      count: office.count,
                    })}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {totals.length > INITIAL_ROWS && (
        <button
          type="button"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
          className="mt-4 rounded text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          {expanded
            ? t('procurementPlan.byOffice.showFewer')
            : t('procurementPlan.byOffice.showAll', { count: totals.length })}
        </button>
      )}
    </section>
  );
}

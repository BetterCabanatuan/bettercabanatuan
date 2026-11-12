import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusBadge from '../../ui/StatusBadge';
import {
  officeInfo,
  officeParts,
  type ProcurementItem,
} from '../../../data/procurementPlan';
import { formatPeso } from './format';

const PAGE_SIZE = 50;
/** Titles longer than this start collapsed: a few run to twenty lines. */
const LONG_TITLE = 220;

function ItemTitle({ item }: { item: ProcurementItem }) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const isLong = item.title.length > LONG_TITLE;
  const [first, ...rest] = item.title.split('\n');

  return (
    <div>
      {item.group && (
        <p className="text-xs font-medium text-gray-500">{item.group}</p>
      )}
      <div className={isLong && !open ? 'line-clamp-3' : undefined}>
        <p className="font-medium text-gray-900 text-pretty">{first}</p>
        {rest.length > 0 && (
          <ul className="mt-1 space-y-0.5 text-sm text-gray-700">
            {rest.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          className="mt-1 rounded text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          {open
            ? t('procurementPlan.items.showLess')
            : t('procurementPlan.items.showFull')}
        </button>
      )}
      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span>{t('procurementPlan.items.page', { page: item.page })}</span>
        {item.earlyProcurement && (
          <StatusBadge tone="info" size="sm">
            {t('procurementPlan.items.earlyProcurement')}
          </StatusBadge>
        )}
      </p>
    </div>
  );
}

/**
 * Each office the row names, as printed, linked to its department page where
 * one exists. A sub-unit ("CMO - LYDO") links to its parent office's page.
 */
function Offices({ office }: { office: string }) {
  const parts = officeParts(office);
  return (
    <span className="flex flex-wrap gap-x-1.5 gap-y-0.5">
      {parts.map((part, index) => {
        const info = officeInfo(part.code);
        const separator = index < parts.length - 1 ? ',' : '';
        return info.slug ? (
          <Link
            key={`${index}-${part.text}`}
            to={`/government/departments/${info.slug}`}
            title={info.name}
            className="rounded text-primary-600 hover:text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            {part.text}
            {separator}
          </Link>
        ) : (
          <span key={`${index}-${part.text}`}>
            {part.text}
            {separator}
          </span>
        );
      })}
    </span>
  );
}

function Budget({ item }: { item: ProcurementItem }) {
  const { t, i18n } = useTranslation('common');
  return item.budget === null ? (
    <span className="text-gray-500">
      {t('procurementPlan.items.budgetNotStated')}
    </span>
  ) : (
    <span className="font-semibold text-gray-900 tabular-nums">
      {formatPeso(item.budget, i18n.language)}
    </span>
  );
}

interface ProcurementItemsTableProps {
  items: ProcurementItem[];
}

export default function ProcurementItemsTable({
  items,
}: ProcurementItemsTableProps) {
  const { t } = useTranslation('common');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const shown = items.slice(0, limit);
  const remaining = items.length - shown.length;

  return (
    <>
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {(['item', 'office', 'procurement', 'fund'] as const).map(
                column => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-3 text-left font-semibold text-gray-700"
                  >
                    {t(`procurementPlan.items.columns.${column}`)}
                  </th>
                )
              )}
              <th
                scope="col"
                className="px-4 py-3 text-right font-semibold text-gray-700"
              >
                {t('procurementPlan.items.columns.budget')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {shown.map(item => (
              <tr key={item.id} className="align-top">
                <td className="px-4 py-4 max-w-md">
                  <ItemTitle item={item} />
                </td>
                <td className="px-4 py-4 text-gray-700 max-w-[12rem]">
                  <Offices office={item.office} />
                </td>
                <td className="px-4 py-4 text-gray-700">
                  <p>{item.category}</p>
                  <p className="text-xs text-gray-500">{item.mode}</p>
                </td>
                <td className="px-4 py-4 text-gray-700 max-w-[12rem]">
                  {item.fund}
                </td>
                <td className="px-4 py-4 text-right whitespace-nowrap">
                  <Budget item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="lg:hidden divide-y divide-gray-200 border-y border-gray-200">
        {shown.map(item => (
          <li key={item.id} className="py-4">
            <ItemTitle item={item} />
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-gray-500">
                  {t('procurementPlan.items.columns.office')}
                </dt>
                <dd className="text-gray-700">
                  <Offices office={item.office} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">
                  {t('procurementPlan.items.columns.budget')}
                </dt>
                <dd>
                  <Budget item={item} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">
                  {t('procurementPlan.items.columns.procurement')}
                </dt>
                <dd className="text-gray-700">
                  {item.category}
                  {item.mode && `, ${item.mode}`}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">
                  {t('procurementPlan.items.columns.fund')}
                </dt>
                <dd className="text-gray-700">{item.fund}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit(value => value + PAGE_SIZE)}
            className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            {t('procurementPlan.items.showMore', {
              count: Math.min(PAGE_SIZE, remaining),
            })}
          </button>
        </div>
      )}
    </>
  );
}

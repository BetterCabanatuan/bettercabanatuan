import { useTranslation } from 'react-i18next';
import { ExternalLink, Landmark } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import type { NationalProject } from '../../../data/yamlLoader';

interface NationalProjectsSectionProps {
  title: string;
  description: string;
  projects: NationalProject[];
  className?: string;
}

function formatPeso(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NationalProjectsSection({
  title,
  description,
  projects,
  className = 'mt-12',
}: NationalProjectsSectionProps) {
  const { t, i18n } = useTranslation('common');

  if (projects.length === 0) return null;

  const total = projects.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className={className}>
      <div className="flex items-start gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-700 shrink-0">
          <Landmark className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <Heading id="national-projects-heading" level={2} className="mb-2">
            {title}
          </Heading>
          <Text className="text-gray-600 mb-0 max-w-3xl">{description}</Text>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">
            {t('projects.national.count', { count: projects.length })}
          </p>
          <p className="text-xl font-bold text-gray-900 tabular-nums">
            {formatPeso(total, i18n.language)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500 mb-1">
            {t('projects.national.fundYears')}
          </p>
          <p className="text-xl font-bold text-gray-900 tabular-nums">
            {[...new Set(projects.flatMap(p => p.years))]
              .sort((a, b) => a - b)
              .join('–')}
          </p>
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.national.columns.project')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.national.columns.department')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.national.columns.category')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.national.columns.years')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.national.columns.amount')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {projects.map(project => (
              <tr key={project.slug} className="hover:bg-gray-50/80">
                <td className="px-4 py-4 align-top text-gray-900 font-medium max-w-md">
                  {project.name}
                </td>
                <td className="px-4 py-4 align-top text-gray-700 max-w-xs">
                  {project.department}
                </td>
                <td className="px-4 py-4 align-top text-gray-700 whitespace-nowrap">
                  {project.category}
                </td>
                <td className="px-4 py-4 align-top text-gray-700 whitespace-nowrap">
                  {project.years.join(', ')}
                </td>
                <td className="px-4 py-4 align-top text-gray-900 tabular-nums whitespace-nowrap text-right">
                  {formatPeso(project.amount, i18n.language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end w-full mt-4">
        <a
          href="https://budget.bettergov.ph/api/v1/gaa/search?q=cabanatuan"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          {t('projects.national.source')}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

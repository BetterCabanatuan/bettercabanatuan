import { useTranslation } from 'react-i18next';
import { Droplets, ExternalLink } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import type { FloodControlProject } from '../../../data/yamlLoader';

interface FloodControlsFeaturedProps {
  title: string;
  description: string;
  projects: FloodControlProject[];
  showHeader?: boolean;
  className?: string;
}

function formatCompletionDate(date: string, locale: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export default function FloodControlsFeatured({
  title,
  description,
  projects,
  showHeader = true,
  className = 'mb-12 pb-12 border-b border-gray-200',
}: FloodControlsFeaturedProps) {
  const { t, i18n } = useTranslation('common');

  if (projects.length === 0) return null;

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-start gap-3 mb-2">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-sky-50 text-sky-700 shrink-0">
            <Droplets className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <Heading id="flood-controls-heading" level={2} className="mb-2">
              {title}
            </Heading>
            <Text className="text-gray-600 mb-0 max-w-3xl">{description}</Text>
          </div>
        </div>
      )}
      <p className={`text-sm text-gray-500 ${showHeader ? 'mt-4' : ''} mb-6`}>
        {t('projects.floodControls.count', { count: projects.length })}
      </p>
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.floodControls.columns.project')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.floodControls.columns.contractor')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.floodControls.columns.cost')}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {t('projects.floodControls.columns.completed')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {projects.map(project => (
              <tr key={project.slug} className="hover:bg-gray-50/80">
                <td className="px-4 py-4 align-top text-gray-900 font-medium max-w-md">
                  {project.title}
                </td>
                <td className="px-4 py-4 align-top text-gray-700 max-w-xs">
                  {project.contractor}
                </td>
                <td className="px-4 py-4 align-top text-gray-900 tabular-nums whitespace-nowrap">
                  {project.cost}
                </td>
                <td className="px-4 py-4 align-top text-gray-700 whitespace-nowrap">
                  {formatCompletionDate(project.completionDate, i18n.language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end w-full mt-4">
        <a
          href="https://sumbongsapangulo.ph/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          {t('projects.floodControls.source')}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
      {/* <div className="lg:hidden space-y-3"> */}
      {/*   {projects.map(project => ( */}
      {/*     <article */}
      {/*       key={project.slug} */}
      {/*       className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" */}
      {/*     > */}
      {/*       <h3 className="text-sm font-semibold text-gray-900 mb-3"> */}
      {/*         {project.title} */}
      {/*       </h3> */}
      {/*       <dl className="space-y-2 text-sm"> */}
      {/*         <div className="flex gap-2"> */}
      {/*           <dt className="sr-only"> */}
      {/*             {t('projects.floodControls.columns.contractor')} */}
      {/*           </dt> */}
      {/*           <dd className="flex items-start gap-2 text-gray-700"> */}
      {/*             <Building2 */}
      {/*               className="h-4 w-4 shrink-0 mt-0.5 text-gray-400" */}
      {/*               aria-hidden="true" */}
      {/*             /> */}
      {/*             {project.contractor} */}
      {/*           </dd> */}
      {/*         </div> */}
      {/*         <div className="flex gap-2"> */}
      {/*           <dt className="sr-only"> */}
      {/*             {t('projects.floodControls.columns.cost')} */}
      {/*           </dt> */}
      {/*           <dd className="flex items-center gap-2 text-gray-900 font-medium tabular-nums"> */}
      {/*             <Wallet */}
      {/*               className="h-4 w-4 shrink-0 text-gray-400" */}
      {/*               aria-hidden="true" */}
      {/*             /> */}
      {/*             {project.cost} */}
      {/*           </dd> */}
      {/*         </div> */}
      {/*         <div className="flex gap-2"> */}
      {/*           <dt className="sr-only"> */}
      {/*             {t('projects.floodControls.columns.completed')} */}
      {/*           </dt> */}
      {/*           <dd className="flex items-center gap-2 text-gray-700"> */}
      {/*             <Calendar */}
      {/*               className="h-4 w-4 shrink-0 text-gray-400" */}
      {/*               aria-hidden="true" */}
      {/*             /> */}
      {/*             {formatCompletionDate( */}
      {/*               project.completionDate, */}
      {/*               i18n.language */}
      {/*             )} */}
      {/*           </dd> */}
      {/*         </div> */}
      {/*         <div className="flex gap-2"> */}
      {/*           <dt className="sr-only">Location</dt> */}
      {/*           <dd className="flex items-center gap-2 text-gray-500 text-xs"> */}
      {/*             <MapPin */}
      {/*               className="h-3.5 w-3.5 shrink-0" */}
      {/*               aria-hidden="true" */}
      {/*             /> */}
      {/*             {project.location} */}
      {/*           </dd> */}
      {/*         </div> */}
      {/*       </dl> */}
      {/*     </article> */}
      {/*   ))} */}
      {/* </div> */}
    </div>
  );
}

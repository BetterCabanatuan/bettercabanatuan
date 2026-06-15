import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { getIconComponent } from '../../lib/iconMap';
import type { TransparencyResource } from '../../data/yamlLoader';

interface TransparencyResourceCardProps {
  resource: TransparencyResource;
}

export default function TransparencyResourceCard({
  resource,
}: TransparencyResourceCardProps) {
  const { t } = useTranslation('common');
  const Icon = getIconComponent(resource.icon);
  const isExternal = resource.external || resource.href.startsWith('http');

  const content = (
    <Card
      hoverable
      className="h-full border-t-4 border-primary-500 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 shrink-0">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          {isExternal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              {t('transparency.external')}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {resource.description}
        </p>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all duration-200">
          {t('transparency.viewResource')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );

  if (isExternal) {
    return (
      <a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={resource.href}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
    >
      {content}
    </Link>
  );
}

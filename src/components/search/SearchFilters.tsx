import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SearchContentType } from '../../data/searchIndex';

export type SearchFilterValue = SearchContentType | 'all';

interface SearchFilterOption {
  id: SearchFilterValue;
  label: string;
  icon: LucideIcon;
}

interface SearchFiltersProps {
  filters: SearchFilterOption[];
  activeFilter: SearchFilterValue;
  onFilterChange: (filter: SearchFilterValue) => void;
}

export default function SearchFilters({
  filters,
  activeFilter,
  onFilterChange,
}: SearchFiltersProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className="flex flex-wrap gap-2 mb-8"
      role="group"
      aria-label={t('search.filterLabel')}
    >
      {filters.map(filter => {
        const isActive = activeFilter === filter.id;
        const Icon = filter.icon;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {filter.id === 'all' ? t('search.filters.all') : filter.label}
          </button>
        );
      })}
    </div>
  );
}

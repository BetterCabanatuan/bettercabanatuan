import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import cityData from '../../data/city-data.json';
import { Building2, Users, MapPin, Maximize, TrendingUp } from 'lucide-react';

export default function CityStats() {
  const { t } = useTranslation('common');

  const stats = [
    {
      labelKey: 'cityStats.city',
      value: cityData.cityName,
      icon: Building2,
      color: 'bg-primary-50 text-primary-600',
      borderColor: 'border-primary-500',
      descriptionKey: 'cityStats.cityDescription',
    },
    {
      labelKey: 'cityStats.totalPopulation',
      value: cityData.totalPopulation.toLocaleString(),
      icon: Users,
      color: 'bg-secondary-50 text-secondary-600',
      borderColor: 'border-secondary-500',
      descriptionKey: 'cityStats.populationDescription',
    },
    {
      labelKey: 'cityStats.barangays',
      value: cityData.totalBarangays.toString(),
      icon: MapPin,
      color: 'bg-accent-50 text-accent-600',
      borderColor: 'border-accent-500',
      descriptionKey: 'cityStats.barangaysDescription',
    },
    {
      labelKey: 'cityStats.landArea',
      value: `${cityData.landArea.toLocaleString()} km²`,
      icon: Maximize,
      color: 'bg-success-50 text-success-600',
      borderColor: 'border-success-500',
      descriptionKey: 'cityStats.landAreaDescription',
    },
  ];

  return (
    <Section className="bg-white relative overflow-hidden">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>{t('cityStats.badge')}</span>
        </div>
        <Heading level={2} className="text-gray-900 text-balance">
          {t('cityStats.title')}
        </Heading>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-pretty">
          {t('cityStats.subtitle', { city: cityData.cityName })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.labelKey}
            className={`group relative bg-white rounded-2xl border-t-4 ${stat.borderColor} shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-1 p-6 motion-safe:animate-stat-rise motion-reduce:hover:translate-y-0`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} mb-4 transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100`}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
              {stat.value}
            </div>

            <div className="text-sm font-semibold text-gray-700 mb-1">
              {t(stat.labelKey)}
            </div>

            <div className="text-xs text-gray-500">
              {t(stat.descriptionKey)}
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </Section>
  );
}

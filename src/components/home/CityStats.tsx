import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import cityData from '../../data/city-data.json';
import { Building2, Users, MapPin, Maximize, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'City',
    value: cityData.cityName,
    icon: Building2,
    color: 'bg-primary-50 text-primary-600',
    borderColor: 'border-primary-500',
    description: 'Province of Nueva Ecija',
  },
  {
    label: 'Total Population',
    value: cityData.totalPopulation.toLocaleString(),
    icon: Users,
    color: 'bg-secondary-50 text-secondary-600',
    borderColor: 'border-secondary-500',
    description: 'As of 2020 Census',
  },
  {
    label: 'Barangays',
    value: cityData.totalBarangays.toString(),
    icon: MapPin,
    color: 'bg-accent-50 text-accent-600',
    borderColor: 'border-accent-500',
    description: 'Urban & Rural',
  },
  {
    label: 'Land Area',
    value: `${cityData.landArea.toLocaleString()} km²`,
    icon: Maximize,
    color: 'bg-success-50 text-success-600',
    borderColor: 'border-success-500',
    description: 'Total Land Area',
  },
];

export default function CityStats() {
  return (
    <Section className="bg-white relative overflow-hidden">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>Cabanatuan City at a Glance</span>
        </div>
        <Heading level={2} className="text-gray-900">
          Key Facts About Our City
        </Heading>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Quick statistics and essential information about {cityData.cityName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`group relative bg-white rounded-xl border-t-4 ${stat.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 p-6`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.color} mb-4 transition-transform duration-300 group-hover:scale-110`}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-sm font-semibold text-gray-700 mb-1">
              {stat.label}
            </div>

            {/* Description */}
            <div className="text-xs text-gray-500">{stat.description}</div>

            {/* Hover gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </Section>
  );
}

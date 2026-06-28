import { useTranslation } from 'react-i18next';
import { Building2, Heart, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import {
  cityStats,
  leadership,
  services,
  siteConfig,
} from '../../lib/siteConfig';

export default function AboutMissionSection() {
  const { t } = useTranslation('common');
  const locationLabel = `${siteConfig.governmentName}, ${siteConfig.province}, ${siteConfig.region}`;

  const stats = [
    {
      labelKey: 'about.mission.stats.population',
      value: cityStats.totalPopulation.toLocaleString(),
      noteKey: 'about.mission.stats.populationNote',
      icon: Users,
    },
    {
      labelKey: 'about.mission.stats.barangays',
      value: String(cityStats.totalBarangays),
      noteKey: 'about.mission.stats.barangaysNote',
      noteValues: {
        urban: cityStats.urbanBarangays,
        rural: cityStats.ruralBarangays,
      },
      icon: MapPin,
    },
    {
      labelKey: 'about.mission.stats.serviceAreas',
      value: String(services.length),
      noteKey: 'about.mission.stats.serviceAreasNote',
      icon: Heart,
    },
    {
      labelKey: 'about.mission.stats.electedOfficials',
      value: String(leadership.totalOfficials),
      noteKey: 'about.mission.stats.electedOfficialsNote',
      noteValues: { count: leadership.councilorCount },
      icon: Building2,
    },
  ];

  return (
    <Section className="p-3 mb-0 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <Heading level={2} className="text-balance">
            {t('about.mission.title')}
          </Heading>
          <Text className="text-gray-600 mb-4 text-pretty">
            {t('about.mission.body1', { city: siteConfig.governmentName })}
          </Text>
          <Text className="text-gray-600 mb-6 text-pretty">
            {t('about.mission.body2')}
          </Text>

          <div className="rounded-2xl bg-gray-50 p-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              {t('about.mission.location')}
            </p>
            <p className="text-gray-900 font-medium">{locationLabel}</p>
            <p className="text-sm text-gray-600 mt-2">
              {t('about.mission.locationMeta', {
                type: siteConfig.governmentType,
                area: cityStats.landArea,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.labelKey}
              className="border-t-4 border-primary-500 h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.1)] motion-safe:animate-slide-in motion-reduce:hover:translate-y-0 motion-reduce:animate-none"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5">
                <stat.icon
                  className="h-5 w-5 text-primary-600 mb-2"
                  aria-hidden="true"
                />
                <p className="text-2xl font-bold text-gray-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {t(stat.labelKey)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t(
                    stat.noteKey,
                    'noteValues' in stat ? stat.noteValues : undefined
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

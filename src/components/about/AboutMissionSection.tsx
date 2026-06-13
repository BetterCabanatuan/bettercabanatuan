import { Building2, Heart, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { cityStats, leadership, services, siteConfig } from '../../lib/siteConfig';

export default function AboutMissionSection() {
  const locationLabel = `${siteConfig.governmentName}, ${siteConfig.province}, ${siteConfig.region}`;

  const stats = [
    {
      label: 'Population',
      value: cityStats.totalPopulation.toLocaleString(),
      note: '2020 Census',
      icon: Users,
    },
    {
      label: 'Barangays',
      value: String(cityStats.totalBarangays),
      note: `${cityStats.urbanBarangays} urban · ${cityStats.ruralBarangays} rural`,
      icon: MapPin,
    },
    {
      label: 'Service Areas',
      value: String(services.length),
      note: 'From services catalog',
      icon: Heart,
    },
    {
      label: 'Elected Officials',
      value: String(leadership.totalOfficials),
      note: `${leadership.councilorCount} councilors`,
      icon: Building2,
    },
  ];

  return (
    <Section className="p-3 mb-0 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <Heading level={2}>Our Mission</Heading>
          <Text className="text-gray-600 mb-4">
            This portal is an independent, volunteer-led project built to help
            residents of {siteConfig.governmentName} find accurate information
            about government services, departments, and public programs —
            quickly and in plain language.
          </Text>
          <Text className="text-gray-600 mb-6">
            We believe that better access to information leads to more engaged
            citizens, stronger communities, and more accountable governance.
          </Text>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Location
            </p>
            <p className="text-gray-900 font-medium">{locationLabel}</p>
            <p className="text-sm text-gray-600 mt-2">
              {siteConfig.governmentType} · {cityStats.landArea} km² land area
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map(stat => (
            <Card
              key={stat.label}
              className="border-t-4 border-primary-500 h-full"
            >
              <CardContent className="p-5">
                <stat.icon
                  className="h-5 w-5 text-primary-600 mb-2"
                  aria-hidden="true"
                />
                <p className="text-2xl font-bold text-gray-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-800">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

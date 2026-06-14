import { CheckCircle2, Globe, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import Section from '../ui/Section';

const values = [
  {
    icon: Globe,
    title: 'Open Information',
    description: 'Public data and services, organized clearly.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Built by volunteers, maintained for residents.',
  },
  {
    icon: Users,
    title: 'Civic Engagement',
    description: 'Encouraging participation and transparency.',
  },
  {
    icon: CheckCircle2,
    title: 'Always Improving',
    description: 'Continuously updated and open source.',
  },
];

export default function AboutValuesSection() {
  return (
    <Section>
      <Heading level={2} className="mb-8">
        What We Stand For
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {values.map(item => (
          <Card key={item.title} className="border-t-4 border-primary-500">
            <CardContent className="p-6">
              <item.icon
                className="h-6 w-6 text-primary-600 mb-3"
                aria-hidden="true"
              />
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

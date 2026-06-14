import { Link } from 'react-router-dom';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { governmentSections } from '../../lib/siteConfig';
import { getLucideIcon } from './utils';

function getGovernmentHref(slug: string) {
  if (slug === 'officials') return '/government/officials';
  if (slug === 'barangays') return '/government/barangays';
  if (slug === 'departments') return '/government/departments';
  if (slug === 'projects') return '/government/projects';
  return `/government/${slug}`;
}

export default function AboutGovernmentSection() {
  return (
    <Section>
      <Heading level={2} className="mb-2">
        Government Activity
      </Heading>
      <Text className="text-gray-600 mb-8">
        Explore departments, barangays, transparency documents, and more.
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {governmentSections.map(section => (
          <Link
            key={section.slug}
            to={getGovernmentHref(section.slug)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
          >
            <Card hoverable className="h-full">
              <CardContent className="p-5">
                <div className="bg-primary-100 text-primary-600 p-2.5 rounded-lg w-fit mb-3">
                  {getLucideIcon(section.icon)}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {section.category}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

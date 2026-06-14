import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { siteConfig } from '../../lib/siteConfig';

export default function AboutDisclaimerSection() {
  return (
    <Section>
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="h-6 w-6 text-amber-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <Heading level={3}>Independent Project Disclaimer</Heading>
              <Text className="text-gray-700 mb-4">
                This portal is a community-run project and is not an official
                government website. Information is gathered from public sources
                and official channels to the best of our knowledge.
              </Text>
              <Text className="text-gray-700 mb-0">
                For official transactions, verification, and the most current
                requirements, please contact the city government directly at{' '}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-primary-600 hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>{' '}
                or visit the{' '}
                <a
                  href={siteConfig.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  official {siteConfig.governmentName} website
                </a>
                .
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

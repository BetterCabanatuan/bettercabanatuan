import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Info, Globe, Heart, Users, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About"
        description={`About the ${import.meta.env.VITE_GOVERNMENT_NAME} community portal and the BetterGov.ph initiative.`}
        keywords="about, community portal, local government, Philippines, civic tech"
      />
      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <Heading className="text-white mb-2">About the Portal</Heading>
            <Text className="text-white/90 max-w-2xl">
              A community-run initiative to make local government information
              accessible, transparent, and easy to navigate.
            </Text>
          </div>
        </div>

        {/* Mission */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Heading level={2}>Our Mission</Heading>
              <Text className="text-gray-600 mb-4">
                This portal is an independent, volunteer-led project built to
                help residents of {import.meta.env.VITE_GOVERNMENT_NAME} find
                accurate information about government services, departments, and
                public programs — quickly and in plain language.
              </Text>
              <Text className="text-gray-600 mb-4">
                We believe that better access to information leads to more
                engaged citizens, stronger communities, and more accountable
                governance.
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-t-4 border-primary-500">
                <CardContent className="p-6">
                  <Globe className="h-6 w-6 text-primary-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Open Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    Public data and services, organized clearly.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-primary-500">
                <CardContent className="p-6">
                  <Heart className="h-6 w-6 text-primary-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Community Driven
                  </h4>
                  <p className="text-sm text-gray-600">
                    Built by volunteers, maintained for residents.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-primary-500">
                <CardContent className="p-6">
                  <Users className="h-6 w-6 text-primary-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Civic Engagement
                  </h4>
                  <p className="text-sm text-gray-600">
                    Encouraging participation and transparency.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-primary-500">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-6 w-6 text-primary-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Always Improving
                  </h4>
                  <p className="text-sm text-gray-600">
                    Continuously updated and open source.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        {/* What You Can Find Here */}
        <Section className="bg-gray-50">
          <Heading level={2}>What You Can Find Here</Heading>
          <Text className="text-gray-600 mb-6">
            The portal covers the key areas of local government that residents
            interact with most often.
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Health services and hospital info',
              'Education programs and scholarships',
              'Business permits and tax payments',
              'Social welfare and assistance programs',
              'Disaster preparedness and emergency contacts',
              'Housing, land use, and zoning info',
              'Government departments and elected officials',
              'Public consultations and transparency documents',
              'Guides, regulations, and step-by-step instructions',
            ].map(item => (
              <Card key={item} className="h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Disclaimer */}
        <Section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <Heading level={3}>Independent Project Disclaimer</Heading>
              <Text className="text-gray-700 mb-0">
                This portal is a community-run project and is not an official
                government website. Information is gathered from public sources
                and official channels to the best of our knowledge. For official
                transactions, verification, and the most current requirements,
                please contact the relevant government office directly or visit
                the official government website.
              </Text>
            </CardContent>
          </Card>
        </Section>

        {/* Contribute */}
        <Section className="bg-gray-50">
          <div className="text-center max-w-2xl mx-auto">
            <Heading level={2}>Help Us Improve</Heading>
            <Text className="text-gray-600 mb-6">
              Found outdated information? Have a suggestion? Want to contribute
              content? This project is open source and welcomes contributions.
            </Text>
            <a
              href="https://github.com/BetterCabanatuan/bettercabanatuan"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute on GitHub
            </a>
          </div>
        </Section>
      </main>
    </>
  );
};

export default About;

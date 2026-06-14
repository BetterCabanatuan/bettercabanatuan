import { Link } from 'react-router-dom';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { cityHallAddress } from '../../lib/siteConfig';

export default function AboutContributeSection() {
  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <Heading level={2} className="mb-3">
            Help Us Improve
          </Heading>
          <Text className="text-gray-600 mb-0">
            Found outdated information? Have a suggestion? This project is open
            source and welcomes contributions from the community.
          </Text>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
          <a
            href="https://github.com/BetterCabanatuan/bettercabanatuan"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute on GitHub
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6">City Hall: {cityHallAddress}</p>
    </Section>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import Section from '../ui/Section';
import { cityHallAddress } from '../../lib/siteConfig';

export default function AboutContributeSection() {
  const { t } = useTranslation('common');

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <Heading level={2} className="mb-3 text-balance">
            {t('about.contribute.title')}
          </Heading>
          <Text className="text-gray-600 mb-0 text-pretty">
            {t('about.contribute.body')}
          </Text>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
          <a
            href="https://github.com/BetterCabanatuan/bettercabanatuan"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,102,235,0.25)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('about.contribute.github')}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-gray-800 rounded-xl font-medium shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
          >
            {t('about.contribute.contact')}
          </Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        {t('common.cityHall', { address: cityHallAddress })}
      </p>
    </Section>
  );
}

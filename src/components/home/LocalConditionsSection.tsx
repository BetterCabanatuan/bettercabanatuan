import { ArrowUpRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cityHallLocation, siteConfig } from '../../lib/siteConfig';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import Map from './Map';
import Weather from './Weather';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cityHallLocation.latitude},${cityHallLocation.longitude}`;

export default function LocalConditionsSection() {
  const { t } = useTranslation('common');

  return (
    <Section
      className="bg-gray-50 py-12 md:py-16"
      aria-labelledby="local-conditions-heading"
    >
      <div className="mb-7 md:mb-9">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">
            {t('localConditions.eyebrow')}
          </p>
          <Heading
            id="local-conditions-heading"
            level={2}
            className="mb-2 text-balance"
          >
            {t('localConditions.title')}
          </Heading>
          <p className="max-w-2xl text-pretty text-gray-600">
            {t('localConditions.description', {
              city: siteConfig.governmentName,
            })}
          </p>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_2px_4px_rgba(15,23,42,0.04),0_24px_60px_rgba(15,23,42,0.10)] ring-1 ring-gray-200 lg:grid-cols-[minmax(0,1.65fr)_minmax(21rem,0.75fr)]">
        <div className="order-1 min-w-0 lg:order-2">
          <Weather embedded />
        </div>
        <div className="relative order-2 min-w-0 border-t border-gray-200 lg:order-1 lg:border-r lg:border-t-0">
          <Map embedded />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.16)] ring-1 ring-black/10 backdrop-blur-md sm:inset-x-auto sm:left-4 sm:max-w-md sm:p-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
                {t('map.title')}
              </span>
              <span className="mt-0.5 block truncate text-sm text-gray-700 sm:whitespace-normal">
                {cityHallLocation.address}
              </span>
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('localConditions.openInMapsLabel')}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-primary-700 px-3 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 sm:px-4"
            >
              <span className="hidden sm:inline">
                {t('localConditions.openInMaps')}
              </span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

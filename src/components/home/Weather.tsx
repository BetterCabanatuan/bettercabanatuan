import { useCallback, useEffect, useState } from 'react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  RefreshCw,
  Snowflake,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { siteConfig } from '../../lib/siteConfig';
import {
  fetchWeatherData,
  getWeatherConditionKey,
  type WeatherConditionKey,
  type WeatherSnapshot,
} from '../../lib/weather';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';

const conditionIcons: Record<
  WeatherConditionKey,
  React.ComponentType<{ className?: string }>
> = {
  clear: Sun,
  partlyCloudy: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudRain,
  rain: CloudRain,
  snow: Snowflake,
  thunderstorm: CloudLightning,
  unknown: Cloud,
};

function formatTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function WeatherSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-20 rounded bg-white/15" />
          <div className="mt-5 h-16 w-32 rounded-xl bg-white/15" />
          <div className="mt-3 h-4 w-28 rounded bg-white/15" />
        </div>
        <div className="size-14 rounded-2xl bg-white/15" />
      </div>
      <div className="mt-8 grid grid-cols-3 border-y border-white/10 py-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mx-auto h-9 w-16 rounded bg-white/10" />
        ))}
      </div>
      <div className="mt-7 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default function Weather({ embedded = false }: { embedded?: boolean }) {
  const { t, i18n } = useTranslation('common');
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setWeather(await fetchWeatherData());
    } catch {
      setError(t('weather.error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadWeather();
  }, [loadWeather]);

  const conditionKey = weather
    ? getWeatherConditionKey(weather.current.weatherCode)
    : 'unknown';
  const ConditionIcon = conditionIcons[conditionKey];

  const panel = (
    <aside
      aria-label={t('weather.title')}
      className={cn(
        'relative isolate min-h-[440px] overflow-hidden bg-[#004BAE] text-white',
        embedded ? 'h-full lg:min-h-[520px]' : 'rounded-[1.75rem]'
      )}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-20 size-64 rounded-full bg-primary-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/15 to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex h-full min-h-[440px] flex-col p-5 sm:p-7 lg:min-h-[520px] lg:p-8">
        {isLoading && (
          <div className="h-full" role="status" aria-live="polite">
            <span className="sr-only">Loading weather updates…</span>
            <WeatherSkeleton />
          </div>
        )}

        {!isLoading && error && (
          <div
            className="flex h-full flex-1 flex-col items-center justify-center px-4 text-center"
            role="alert"
          >
            <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/10">
              <Cloud className="size-7 text-primary-100" aria-hidden="true" />
            </span>
            <p className="mb-5 max-w-xs text-sm font-medium text-primary-50">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadWeather()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-900 transition-[background-color,transform] duration-150 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#004BAE] active:scale-[0.98] motion-reduce:active:scale-100"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {t('weather.retry')}
            </button>
          </div>
        )}

        {!isLoading && weather && (
          <div className="flex h-full flex-1 flex-col motion-safe:animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">
                  {t('weather.now')}
                </p>
                <p className="mt-4 text-[4.5rem] font-semibold leading-[0.85] tracking-[-0.055em] tabular-nums sm:text-[5rem] lg:text-[5.5rem]">
                  {Math.round(weather.current.temperature)}°
                </p>
                <p className="mt-4 text-base font-semibold text-white">
                  {t(`weather.conditions.${conditionKey}`)}
                </p>
                <p className="mt-1 text-sm text-primary-50 tabular-nums">
                  {t('weather.high')} {Math.round(weather.daily.high)}° ·{' '}
                  {t('weather.low')} {Math.round(weather.daily.low)}°
                </p>
              </div>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-100 ring-1 ring-inset ring-white/10 sm:size-16">
                <ConditionIcon
                  className="size-7 sm:size-8"
                  aria-hidden="true"
                />
              </span>
            </div>

            <dl className="mt-7 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5">
              <div className="pr-3">
                <dt className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-primary-100">
                  <Thermometer className="size-3.5" aria-hidden="true" />
                  {t('weather.feelsLike')}
                </dt>
                <dd className="mt-2 text-lg font-semibold tabular-nums">
                  {Math.round(weather.current.apparentTemperature)}°
                </dd>
              </div>
              <div className="px-3">
                <dt className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-primary-100">
                  <Droplets className="size-3.5" aria-hidden="true" />
                  {t('weather.humidity')}
                </dt>
                <dd className="mt-2 text-lg font-semibold tabular-nums">
                  {Math.round(weather.current.humidity)}%
                </dd>
              </div>
              <div className="pl-3">
                <dt className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-primary-100">
                  <Wind className="size-3.5" aria-hidden="true" />
                  {t('weather.wind')}
                </dt>
                <dd className="mt-2 text-lg font-semibold tabular-nums">
                  {Math.round(weather.current.windSpeed)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100">
                  {t('weather.nextHours')}
                </p>
                <p className="text-xs font-medium text-primary-100 tabular-nums">
                  {t('weather.rainChance')}{' '}
                  {Math.round(weather.daily.precipitationChance)}%
                </p>
              </div>
              <ul className="grid grid-cols-4 divide-x divide-white/10 rounded-2xl bg-white/[0.07] ring-1 ring-inset ring-white/10">
                {weather.hourly.slice(0, 4).map(hour => (
                  <li
                    key={hour.time.toISOString()}
                    className="px-1.5 py-3 text-center"
                  >
                    <p className="text-[0.6875rem] text-primary-100">
                      {formatTime(hour.time, i18n.language)}
                    </p>
                    <p className="mt-1 text-base font-semibold tabular-nums">
                      {Math.round(hour.temperature)}°
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-auto pt-5 text-[0.6875rem] text-primary-100 tabular-nums">
              {t('weather.updated', {
                time: formatTime(weather.current.time, i18n.language),
                timezone: weather.timezoneAbbreviation,
              })}
            </p>
          </div>
        )}
      </div>
    </aside>
  );

  if (embedded) return panel;

  return (
    <Section className="h-full !py-8">
      <div className="mb-5 text-center">
        <Heading level={2} className="text-balance">
          {t('weather.title')}
        </Heading>
        <p className="mx-auto mt-2 max-w-2xl text-pretty text-sm text-gray-600">
          {t('weather.subtitle', { city: siteConfig.governmentName })}
        </p>
      </div>
      {panel}
    </Section>
  );
}

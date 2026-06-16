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
import { Card, CardContent } from '@bettergov/kapwa/card';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { siteConfig } from '../../lib/siteConfig';
import {
  fetchWeatherData,
  getWeatherConditionKey,
  type WeatherConditionKey,
  type WeatherSnapshot,
} from '../../lib/weather';
import { MAP_PANEL_HEIGHT } from './Map';

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
    <div
      className="animate-pulse h-full flex flex-col justify-between"
      aria-hidden="true"
    >
      <div className="flex justify-between">
        <div className="h-10 w-24 rounded bg-gray-200" />
        <div className="h-12 w-12 rounded-xl bg-gray-200" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 rounded-lg bg-gray-200" />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-12 rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export default function Weather() {
  const { t, i18n } = useTranslation('common');
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData();
      setWeather(data);
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

  return (
    <Section className="h-full !py-8">
      <div className="text-center mb-4">
        <Heading level={2}>{t('weather.title')}</Heading>
        <p className="text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
          {t('weather.subtitle', { city: siteConfig.governmentName })}
        </p>
      </div>

      <Card
        className="border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: MAP_PANEL_HEIGHT }}
      >
        <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 to-primary-700" />
        <CardContent className="p-4 md:p-5 h-[calc(100%-4px)] flex flex-col">
          {isLoading && <WeatherSkeleton />}

          {!isLoading && error && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <Cloud
                className="h-8 w-8 text-gray-400 mb-2"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-700 font-medium mb-3">{error}</p>
              <button
                type="button"
                onClick={() => void loadWeather()}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-colors duration-200"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t('weather.retry')}
              </button>
            </div>
          )}

          {!isLoading && weather && (
            <div className="h-full flex flex-col justify-between motion-safe:animate-fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                    {t('weather.now')}
                  </p>
                  <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">
                    {Math.round(weather.current.temperature)}°
                    <span className="text-xl text-gray-400">C</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {t(`weather.conditions.${conditionKey}`)}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-sky-50 to-primary-50 text-primary-600 shrink-0">
                  <ConditionIcon className="h-7 w-7" aria-hidden="true" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium uppercase tracking-wide mb-0.5">
                    <Thermometer className="h-3 w-3" aria-hidden="true" />
                    {t('weather.feelsLike')}
                  </div>
                  <p className="text-base font-semibold text-gray-900 tabular-nums">
                    {Math.round(weather.current.apparentTemperature)}°
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium uppercase tracking-wide mb-0.5">
                    <Droplets className="h-3 w-3" aria-hidden="true" />
                    {t('weather.humidity')}
                  </div>
                  <p className="text-base font-semibold text-gray-900 tabular-nums">
                    {Math.round(weather.current.humidity)}%
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium uppercase tracking-wide mb-0.5">
                    <Wind className="h-3 w-3" aria-hidden="true" />
                    {t('weather.wind')}
                  </div>
                  <p className="text-base font-semibold text-gray-900 tabular-nums">
                    {Math.round(weather.current.windSpeed)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-800 px-2.5 py-1 text-xs font-medium">
                  {t('weather.high')}: {Math.round(weather.daily.high)}°
                </span>
                <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-800 px-2.5 py-1 text-xs font-medium">
                  {t('weather.low')}: {Math.round(weather.daily.low)}°
                </span>
                <span className="inline-flex items-center rounded-full bg-primary-50 text-primary-800 px-2.5 py-1 text-xs font-medium">
                  {t('weather.rainChance')}:{' '}
                  {Math.round(weather.daily.precipitationChance)}%
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  {t('weather.nextHours')}
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {weather.hourly.slice(0, 4).map(hour => (
                    <div
                      key={hour.time.toISOString()}
                      className="rounded-md border border-gray-100 bg-white px-1.5 py-2 text-center"
                    >
                      <p className="text-[10px] text-gray-500">
                        {formatTime(hour.time, i18n.language)}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">
                        {Math.round(hour.temperature)}°
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-gray-400">
                {t('weather.updated', {
                  time: formatTime(weather.current.time, i18n.language),
                  timezone: weather.timezoneAbbreviation,
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}

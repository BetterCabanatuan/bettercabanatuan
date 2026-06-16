import { fetchWeatherApi } from 'openmeteo';
import { siteConfig, weatherLocation } from './siteConfig';

export interface WeatherSnapshot {
  location: string;
  timezone: string;
  timezoneAbbreviation: string;
  current: {
    time: Date;
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: {
    high: number;
    low: number;
    precipitationChance: number;
    weatherCode: number;
  };
  hourly: Array<{
    time: Date;
    temperature: number;
    precipitationChance: number;
  }>;
}

const range = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step },
    (_, index) => start + index * step
  );

const apiUrl =
  import.meta.env.VITE_OPENMETEO_API_URL ||
  'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(): Promise<WeatherSnapshot> {
  const params = {
    latitude: weatherLocation.latitude,
    longitude: weatherLocation.longitude,
    timezone: 'Asia/Manila',
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: 1,
    forecast_hours: 12,
  };

  const responses = await fetchWeatherApi(apiUrl, params);
  const response = responses[0];

  if (!response) {
    throw new Error('No weather data returned');
  }

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current();
  const hourly = response.hourly();
  const daily = response.daily();

  if (!current || !hourly || !daily) {
    throw new Error('Incomplete weather response');
  }

  const hourlyTimes = range(
    Number(hourly.time()),
    Number(hourly.timeEnd()),
    hourly.interval()
  ).map(time => new Date((time + utcOffsetSeconds) * 1000));

  const hourlyTemperatures = hourly.variables(0)!.valuesArray()!;
  const hourlyPrecipitation = hourly.variables(1)!.valuesArray()!;

  const dailyWeatherCodes = daily.variables(0)!.valuesArray()!;
  const dailyHighs = daily.variables(1)!.valuesArray()!;
  const dailyLows = daily.variables(2)!.valuesArray()!;
  const dailyPrecipitation = daily.variables(3)!.valuesArray()!;

  return {
    location: siteConfig.governmentName,
    timezone: response.timezone() ?? 'Asia/Manila',
    timezoneAbbreviation: response.timezoneAbbreviation() ?? 'PHT',
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0)!.value(),
      humidity: current.variables(1)!.value(),
      apparentTemperature: current.variables(2)!.value(),
      weatherCode: current.variables(3)!.value(),
      windSpeed: current.variables(4)!.value(),
    },
    daily: {
      weatherCode: dailyWeatherCodes[0] ?? 0,
      high: dailyHighs[0] ?? current.variables(0)!.value(),
      low: dailyLows[0] ?? current.variables(0)!.value(),
      precipitationChance: dailyPrecipitation[0] ?? 0,
    },
    hourly: hourlyTimes.slice(0, 6).map((time, index) => ({
      time,
      temperature: hourlyTemperatures[index] ?? 0,
      precipitationChance: hourlyPrecipitation[index] ?? 0,
    })),
  };
}

export type WeatherConditionKey =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown';

export function getWeatherConditionKey(code: number): WeatherConditionKey {
  if (code === 0) return 'clear';
  if (code <= 3) return 'partlyCloudy';
  if (code <= 48) return 'fog';
  if (code <= 57) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain';
  if (code <= 86) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'unknown';
}

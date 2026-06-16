import { describe, expect, it } from 'vitest';
import { getWeatherConditionKey } from '../weather';

describe('weather helpers', () => {
  it('maps clear sky codes', () => {
    expect(getWeatherConditionKey(0)).toBe('clear');
  });

  it('maps partly cloudy codes', () => {
    expect(getWeatherConditionKey(2)).toBe('partlyCloudy');
  });

  it('maps rain codes', () => {
    expect(getWeatherConditionKey(63)).toBe('rain');
  });

  it('maps thunderstorm codes', () => {
    expect(getWeatherConditionKey(95)).toBe('thunderstorm');
  });
});

import { describe, expect, it } from 'vitest';
import { emergencyHotlines, formatPhoneForTel } from '../hotlines';

describe('formatPhoneForTel', () => {
  it('converts leading 0 to +63', () => {
    expect(formatPhoneForTel('0920-611-2000')).toBe('+639206112000');
  });

  it('preserves numbers already starting with 63', () => {
    expect(formatPhoneForTel('639181234567')).toBe('+639181234567');
  });

  it('strips formatting from landline numbers', () => {
    expect(formatPhoneForTel('(044)-463-1111')).toBe('+63444631111');
  });
});

describe('emergencyHotlines', () => {
  it('includes all four emergency agencies', () => {
    expect(emergencyHotlines).toHaveLength(4);
    expect(emergencyHotlines.map(h => h.id)).toEqual([
      'pnp',
      'bfp',
      'cdrrmo',
      'community-affairs',
    ]);
  });

  it('provides callable tel links for every number', () => {
    emergencyHotlines.forEach(hotline => {
      hotline.phones.forEach(phone => {
        const tel = formatPhoneForTel(phone.number);
        expect(tel.length).toBeGreaterThan(0);
        expect(tel).toMatch(/^\+?\d+$/);
      });
    });
  });
});

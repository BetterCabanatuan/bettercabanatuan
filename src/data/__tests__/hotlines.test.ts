import { describe, expect, it } from 'vitest';
import {
  bannerHotlines,
  emergencyHotlines,
  formatPhoneForTel,
} from '../hotlines';

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
  it('lists the seven city hotlines in order', () => {
    expect(emergencyHotlines).toHaveLength(7);
    expect(emergencyHotlines.map(h => h.id)).toEqual([
      'pnp',
      'bfp',
      'cdrrmo',
      'community-affairs',
      'cho',
      'mvg-hospital',
      'cswdo',
    ]);
  });

  it('keeps the header strip to the four responder entries', () => {
    expect(bannerHotlines.map(h => h.id)).toEqual([
      'pnp',
      'bfp',
      'cdrrmo',
      'community-affairs',
    ]);
  });

  it("uses the CDRRMO numbers from the Citizen's Charter", () => {
    const cdrrmo = emergencyHotlines.find(h => h.id === 'cdrrmo');
    expect(cdrrmo?.phones.map(p => p.number)).toEqual([
      '0908-881-1010',
      '0917-851-1320',
      '(044)-940-0161',
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

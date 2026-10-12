import { describe, expect, it } from 'vitest';
import { allBarangays, getBarangayBySlug } from '../yamlLoader';
import { formatPhoneForTel } from '../hotlines';

/**
 * Citizen's Charter 2022 (2nd Edition), "VII. List of Offices", p. 344.
 * The charter prints CHC 7 as "H. Concepcion"; the barangay's registered name
 * is Hermogenes C. Concepcion, Sr.
 */
const CHARTER_HEALTH_CENTERS = [
  {
    slug: 'mayapyap-sur',
    name: 'City Health Center 1',
    phone: '0919 081 3119',
    landline: undefined,
  },
  {
    slug: 'san-josef-norte',
    name: 'City Health Center 2',
    phone: '0919 081 2976',
    landline: '044 960 1613',
  },
  {
    slug: 'mabini-homesite',
    name: 'City Health Center 4',
    phone: '0919 081 1344',
    landline: '044 951 5699',
  },
  {
    slug: 'general-luna',
    name: 'City Health Center 5',
    phone: '0919 081 1535',
    landline: undefined,
  },
  {
    slug: 'caalibangbangan',
    name: 'City Health Center 6',
    phone: '0919 081 1485',
    landline: '044 958 2094',
  },
  {
    slug: 'hermogenes-c-concepcion-sr',
    name: 'City Health Center 7',
    phone: '0919 081 2983',
    landline: '044 803 1079',
  },
] as const;

describe('barangay health centres (charter p. 344)', () => {
  it.each(CHARTER_HEALTH_CENTERS)(
    '$slug carries $name with its charter lines',
    ({ slug, name, phone, landline }) => {
      const barangay = getBarangayBySlug(slug);
      expect(barangay).toBeDefined();
      expect(barangay?.healthCenter).toEqual(
        landline ? { name, phone, landline } : { name, phone }
      );
    }
  );

  it('maps a centre to exactly the barangays the charter names', () => {
    const mapped = allBarangays
      .filter(b => b.healthCenter)
      .map(b => b.slug)
      .sort();
    expect(mapped).toEqual(
      CHARTER_HEALTH_CENTERS.map(entry => entry.slug).sort()
    );
  });

  it('stores every line in a form formatPhoneForTel can normalise', () => {
    allBarangays
      .flatMap(b =>
        b.healthCenter
          ? [b.healthCenter.phone, b.healthCenter.landline].filter(Boolean)
          : []
      )
      .forEach(number => {
        expect(formatPhoneForTel(number as string)).toMatch(/^\+63\d{9,10}$/);
      });
  });
});

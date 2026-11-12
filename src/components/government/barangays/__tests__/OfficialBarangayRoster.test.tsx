import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { OfficialBarangayRoster } from '../OfficialBarangayRoster';
import { renderWithProviders } from '../../../../test/test-utils';
import { allBarangays } from '../../../../data/yamlLoader';
import {
  formatOfficialName,
  getOfficialBarangayRoster,
  officialBarangayRosterRecords,
  officialBarangayRosterSource,
} from '../../../../data/officialBarangayRoster';

describe('official barangay roster', () => {
  it('covers every canonical barangay with the complete filtered source record count', () => {
    expect(officialBarangayRosterSource.recordCount).toBe(1750);
    expect(officialBarangayRosterSource.barangayCount).toBe(89);
    expect(officialBarangayRosterRecords).toHaveLength(1750);
    expect(allBarangays).toHaveLength(89);
    for (const barangay of allBarangays) {
      expect(getOfficialBarangayRoster(barangay.slug).length).toBeGreaterThan(
        0
      );
    }
  });

  it('shows source officials and term without inventing Cruz Roja’s missing Punong Barangay', () => {
    renderWithProviders(<OfficialBarangayRoster barangaySlug="cruz-roja" />);

    expect(
      screen.getByRole('heading', { name: 'Barangay officials' })
    ).toBeTruthy();
    expect(screen.getByText('Term 2023 - 2026')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'DILG Barangay Officials Directory' })
        .getAttribute('href')
    ).toBe('https://www.dilg.gov.ph/barangay-officials-directory');
    expect(
      screen.getByText(
        /based on the provided workbook.*not been independently verified against DILG/i
      )
    ).toBeTruthy();
    expect(screen.getByText('Reynaldo Pestano Feliciano')).toBeTruthy();
    expect(screen.queryByText('Punong Barangay')).toBeNull();

    // Every source record renders exactly once, across all groups.
    expect(screen.getAllByRole('listitem')).toHaveLength(19);
  });

  it('groups council and SK, leader first, with each term', () => {
    renderWithProviders(<OfficialBarangayRoster barangaySlug="aduas-centro" />);

    const council = screen
      .getByRole('heading', { name: 'Barangay Council' })
      .closest('section')!;
    const lead = within(council).getAllByRole('listitem')[0];
    expect(within(lead).getByText('Punong Barangay')).toBeTruthy();
    expect(within(lead).getByText('Gilbert Mora Fernandez')).toBeTruthy();
    expect(within(lead).getByText('3rd term')).toBeTruthy();
    expect(
      within(council).getByText('Kagawad (council members) · 7')
    ).toBeTruthy();

    const sk = screen
      .getByRole('heading', { name: 'Sangguniang Kabataan (SK)' })
      .closest('section')!;
    expect(within(sk).getByText('SK Chairperson')).toBeTruthy();
    expect(within(sk).getByText('SK members · 7')).toBeTruthy();
  });

  it('formats workbook names for reading', () => {
    const base = { ...getOfficialBarangayRoster('aduas-centro')[0] };
    const name = (p: Partial<typeof base>) =>
      formatOfficialName({ ...base, ...p });
    expect(
      name({ firstName: 'AR-JAY', middleName: 'DELA', lastName: 'CRUZ,' })
    ).toBe('Ar-Jay Dela Cruz');
    expect(name({ firstName: 'MA..', suffix: 'JR' })).toBe(
      'Ma. Mora Fernandez Jr.'
    );
    expect(name({ suffix: 'III' })).toBe('Gilbert Mora Fernandez III');
    expect(name({ suffix: 'NONE' })).toBe('Gilbert Mora Fernandez');
  });

  it('does not show telephone values from the source workbook', () => {
    renderWithProviders(<OfficialBarangayRoster barangaySlug="aduas-centro" />);

    expect(screen.queryByText(/\b\d{11}\b/)).toBeNull();
    expect(screen.queryByRole('link', { name: /tel:/ })).toBeNull();
  });
});

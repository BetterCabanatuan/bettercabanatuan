import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { OfficialBarangayRoster } from '../OfficialBarangayRoster';
import { renderWithProviders } from '../../../../test/test-utils';
import { allBarangays } from '../../../../data/yamlLoader';
import {
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
    expect(screen.getByText('Term: 2023 - 2026')).toBeTruthy();
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
    expect(screen.getByText('REYNALDO PESTANO FELICIANO')).toBeTruthy();
    expect(screen.queryByText('Punong Barangay')).toBeNull();

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(19);
  });

  it('does not show telephone values from the source workbook', () => {
    renderWithProviders(<OfficialBarangayRoster barangaySlug="aduas-centro" />);

    expect(screen.queryByText(/\b\d{11}\b/)).toBeNull();
    expect(screen.queryByRole('link', { name: /tel:/ })).toBeNull();
  });
});

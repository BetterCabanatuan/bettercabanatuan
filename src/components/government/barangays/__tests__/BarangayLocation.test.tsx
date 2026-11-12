import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BarangayLocation from '../BarangayLocation';
import boundaries from '../../../../data/barangay-boundaries.json';
import { allBarangays } from '../../../../data/yamlLoader';

describe('barangay location', () => {
  it('has exactly one boundary polygon for every barangay', () => {
    const codes = boundaries.features.map(f => f.properties.psgc);
    expect(new Set(codes).size).toBe(codes.length);
    expect(allBarangays).toHaveLength(89);
    for (const b of allBarangays) expect(codes).toContain(b.psgc_code);
  });

  it('draws the map with the source credit for a known barangay', async () => {
    render(
      <BarangayLocation
        psgcCode="0304903002"
        label="Barangay Aduas Centro"
        caption="Urban"
      />
    );
    expect(
      await screen.findByRole('region', {
        name: 'Map of Barangay Aduas Centro boundary',
      })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: /NAMRIA and PSA via OCHA/ })
    ).toHaveAttribute('href', 'https://data.humdata.org/dataset/cod-ab-phl');
  });

  it('falls back to the pending banner for an unknown code', async () => {
    render(
      <BarangayLocation psgcCode="0000000000" label="Nowhere" caption="x" />
    );
    expect(
      await screen.findByRole('status', {
        name: 'Map location not yet verified',
      })
    ).toBeInTheDocument();
  });

  it('says the map failed to load, not "not verified", on a load error', async () => {
    vi.resetModules();
    vi.doMock('../../../../data/barangay-boundaries.json', () => {
      throw new Error('network');
    });
    const { default: Fresh } = await import('../BarangayLocation');
    render(
      <Fresh psgcCode="0304903002" label="Barangay Aduas Centro" caption="x" />
    );
    expect(
      await screen.findByText(/map of Barangay Aduas Centro couldn’t load/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('status', { name: 'Map location not yet verified' })
    ).toBeNull();
    vi.doUnmock('../../../../data/barangay-boundaries.json');
  });
});

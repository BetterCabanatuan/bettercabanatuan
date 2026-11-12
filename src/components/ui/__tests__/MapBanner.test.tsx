import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import MapBanner from '../MapBanner';

describe('MapBanner', () => {
  it('announces pending verification without implying a map or unavailable location', () => {
    render(
      <MapBanner
        label="Barangay San Juan"
        caption="Urban barangay, Cabanatuan City"
      />
    );

    expect(
      screen.getByRole('status', { name: 'Map location not yet verified' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Barangay San Juan · Urban barangay, Cabanatuan City')
    ).toBeInTheDocument();
    expect(screen.queryByText(/unavailable/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

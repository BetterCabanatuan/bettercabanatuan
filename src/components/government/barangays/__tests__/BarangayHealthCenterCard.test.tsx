import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import { BarangayHealthCenterCard } from '../BarangayHealthCenterCard';
import BarangayDetailPage from '../../../../pages/government/barangays/$barangaySlugId';

describe('BarangayHealthCenterCard', () => {
  it('renders the centre name and a tel: link per charter line', () => {
    render(
      <BarangayHealthCenterCard
        barangayName="San Josef Norte"
        healthCenter={{
          name: 'City Health Center 2',
          phone: '0919 081 2976',
          landline: '044 960 1613',
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Health center' })
    ).toBeInTheDocument();
    expect(screen.getByText(/City Health Center 2/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /0919 081 2976/ })).toHaveAttribute(
      'href',
      'tel:+639190812976'
    );
    expect(screen.getByRole('link', { name: /044 960 1613/ })).toHaveAttribute(
      'href',
      'tel:+63449601613'
    );
  });

  it('omits the landline row when the charter lists none', () => {
    render(
      <BarangayHealthCenterCard
        barangayName="Mayapyap Sur"
        healthCenter={{ name: 'City Health Center 1', phone: '0919 081 3119' }}
      />
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByText('Landline')).not.toBeInTheDocument();
  });
});

describe('barangay detail page health centre card', () => {
  it('shows the card for a barangay the charter names', () => {
    renderWithProviders(<BarangayDetailPage />, {
      route: '/government/barangays/mayapyap-sur',
      routePattern: '/government/barangays/:barangaySlugId',
    });

    expect(
      screen.getByRole('heading', { name: 'Health center' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /0919 081 3119/ })).toHaveAttribute(
      'href',
      'tel:+639190813119'
    );
  });

  it('shows no card for a barangay without a charter entry', () => {
    renderWithProviders(<BarangayDetailPage />, {
      route: '/government/barangays/aduas-centro',
      routePattern: '/government/barangays/:barangaySlugId',
    });

    expect(
      screen.queryByRole('heading', { name: 'Health center' })
    ).not.toBeInTheDocument();
  });
});

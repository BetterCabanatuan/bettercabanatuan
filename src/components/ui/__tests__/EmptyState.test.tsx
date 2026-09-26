import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import EmptyState from '../EmptyState';
import { Newspaper } from 'lucide-react';

describe('EmptyState', () => {
  it('renders icon, title, description and badge', () => {
    renderWithProviders(
      <EmptyState
        icon={Newspaper}
        badge="Coming soon"
        title="This section is being prepared"
        description="Nothing to read here yet."
      />
    );

    expect(
      screen.getByRole('heading', { name: 'This section is being prepared' })
    ).toBeInTheDocument();
    expect(screen.getByText('Nothing to read here yet.')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });

  it('renders internal actions as router links', () => {
    renderWithProviders(
      <EmptyState
        icon={Newspaper}
        title="Empty"
        description="Nothing here."
        primaryAction={{ href: '/transparency', label: 'Open Transparency' }}
        secondaryAction={{ href: '/contact', label: 'Contact Us' }}
      />
    );

    expect(
      screen.getByRole('link', { name: /Open Transparency/ })
    ).toHaveAttribute('href', '/transparency');
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('opens external actions in a new tab with safe rel attributes', () => {
    renderWithProviders(
      <EmptyState
        icon={Newspaper}
        title="Empty"
        description="Nothing here."
        primaryAction={{
          href: 'https://example.gov.ph',
          label: 'Official site',
          external: true,
        }}
      />
    );

    const link = screen.getByRole('link', { name: /Official site/ });
    expect(link).toHaveAttribute('href', 'https://example.gov.ph');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the action row when no actions are given', () => {
    renderWithProviders(
      <EmptyState icon={Newspaper} title="Empty" description="Nothing here." />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('decorative icon is hidden from assistive technology', () => {
    const { container } = renderWithProviders(
      <EmptyState icon={Newspaper} title="Empty" description="Nothing here." />
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from '../Footer';

describe('Footer', () => {
  it('uses compact disclosure groups for mobile navigation', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const groups = container.querySelectorAll('details');
    expect(groups).toHaveLength(3);
    groups.forEach(group => {
      expect(group.querySelector('summary')).not.toBeNull();
    });
  });

  it('links to the privacy notice as a client-side route', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const privacy = screen.getByRole('link', { name: 'Privacy Notice' });
    expect(privacy).toHaveAttribute('href', '/privacy');
    // An internal route must not open in a new tab like the external links do.
    expect(privacy).not.toHaveAttribute('target');
  });

  it('has no Terms link while no /terms page exists', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', { name: /terms/i })
    ).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/terms"]')).toBeNull();
  });
});

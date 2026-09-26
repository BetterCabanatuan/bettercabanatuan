import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import NotFoundGuard from '../NotFoundGuard';

function renderGuard(props: React.ComponentProps<typeof NotFoundGuard>) {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NotFoundGuard {...props} />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('NotFoundGuard', () => {
  it('renders a real level-1 heading, not just styled text', () => {
    // A `Banner` title is not a heading. Seven guards shipped without one, so
    // their pages had no document outline and "skip to content" had no target.
    renderGuard({ subject: 'department' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Department not found' })
    ).toBeInTheDocument();
  });

  it('capitalises the subject without mangling the rest of the phrase', () => {
    renderGuard({ subject: 'service category' });
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Service category not found',
      })
    ).toBeInTheDocument();
  });

  it('tells the resident what happened in plain words', () => {
    renderGuard({ subject: 'project' });
    expect(
      screen.getByText(/The project you are looking for does not exist/)
    ).toBeInTheDocument();
  });

  it('links back to the parent index when one is given', () => {
    renderGuard({ subject: 'barangay', backHref: '/government/barangays' });
    expect(
      screen.getByRole('link', { name: /Back to barangays/ })
    ).toHaveAttribute('href', '/government/barangays');
  });

  it('omits the back link when the subject has no index to return to', () => {
    renderGuard({ subject: 'thing' });
    // Breadcrumbs always render a "Home" link, so this scopes to the back link
    // specifically rather than asserting the page has no links at all.
    expect(screen.queryByRole('link', { name: /^Back to/ })).toBeNull();
  });

  it('asks robots not to index it, and titles itself distinctly', () => {
    // A bad slug is still a crawlable URL. Without noindex every mistyped slug
    // was an indexable page titled exactly like the homepage.
    const { container } = renderGuard({ subject: 'department' });
    expect(container).toBeTruthy();

    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('noindex');

    // Helmet writes the title asynchronously; the assertion is on intent.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});

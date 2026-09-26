import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CardGrid, { CardGridItem } from '../CardGrid';
import BrowseAllLink, { BrowseAllFooter } from '../BrowseAllLink';
import CategoryCard from '../CategoryCard';
import { Heart } from 'lucide-react';

/**
 * The grid and the signpost.
 *
 * Row-fill behaviour is a CSS concern, so it is asserted in
 * `e2e/responsive.spec.ts` against a real browser. What is asserted here is the
 * structure those measurements depend on.
 */

const withRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CardGrid', () => {
  it('is a list, so a screen reader is told how many peers there are', () => {
    // A bare run of divs reads as one undifferentiated block: the count and the
    // boundaries are both lost.
    withRouter(
      <CardGrid label="Service categories">
        <CardGridItem>
          <span>a</span>
        </CardGridItem>
        <CardGridItem>
          <span>b</span>
        </CardGridItem>
      </CardGrid>
    );
    expect(
      screen.getByRole('list', { name: 'Service categories' })
    ).toBeInTheDocument();
  });

  it('marks itself so the QA audit can find card grids specifically', () => {
    // The audit checks row fill, and other wrapping flex rows on the site —
    // the hotline strip, footer links — have last rows that are *meant* to sit
    // left-aligned. Keying off an explicit marker keeps the check aimed.
    const { container } = withRouter(
      <CardGrid>
        <CardGridItem>
          <span>a</span>
        </CardGridItem>
        <CardGridItem>
          <span>b</span>
        </CardGridItem>
      </CardGrid>
    );
    expect(container.querySelector('[data-card-grid]')).not.toBeNull();
  });

  it('keeps directory partial rows aligned to the reading edge', () => {
    const { container } = withRouter(
      <CardGrid>
        <CardGridItem>
          <span>a</span>
        </CardGridItem>
        <CardGridItem>
          <span>b</span>
        </CardGridItem>
        <CardGridItem>
          <span>c</span>
        </CardGridItem>
      </CardGrid>
    );
    const grid = container.querySelector('[data-card-grid]') as HTMLElement;
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('gap-4');
    expect(grid.className).toContain('md:gap-6');
    expect(grid.className).not.toContain('justify-center');
  });

  it('uses the shared one-to-four-column responsive ladder', () => {
    // 1 / 2 / 3 / 4, capped at four: five columns at 1440px would make a card
    // narrower than this site's two-line titles.
    const { container } = withRouter(
      <CardGrid>
        <CardGridItem>
          <span>a</span>
        </CardGridItem>
        <CardGridItem>
          <span>b</span>
        </CardGridItem>
      </CardGrid>
    );
    const grid = container.querySelector('[data-card-grid]') as HTMLElement;
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
    expect(grid.className).toContain('xl:grid-cols-4');
  });

  it('centres a promotional group only when explicitly requested', () => {
    const { container } = withRouter(
      <CardGrid align="center">
        <CardGridItem>
          <span>a</span>
        </CardGridItem>
      </CardGrid>
    );

    const grid = container.querySelector('[data-card-grid]') as HTMLElement;
    expect(grid).toHaveAttribute('data-card-grid-align', 'center');
    expect(grid.className).toContain('justify-center');
  });
});

describe('BrowseAllLink', () => {
  it('states how many items are behind it', () => {
    // The count is what makes this a signpost rather than a category: it tells
    // the reader the grid above is a sample.
    withRouter(
      <BrowseAllLink to="/services" count={10}>
        View all services
      </BrowseAllLink>
    );
    const link = screen.getByRole('link', { name: /View all services/ });
    expect(link).toHaveTextContent('(10)');
  });

  it('looks nothing like a card', () => {
    // It used to be a fifth card in the row, drawn identically to "Health
    // Services", so a reader could not tell the categories from the filler.
    withRouter(<BrowseAllLink to="/services">View all services</BrowseAllLink>);
    const link = screen.getByRole('link');
    expect(link.className).not.toMatch(/shadow-\[/);
    expect(link.className).not.toContain('border-t-4');
    expect(link.className).not.toContain('rounded-lg bg-white');
  });

  it('centres under the grid, on its own line', () => {
    const { container } = withRouter(
      <BrowseAllFooter>
        <BrowseAllLink to="/services">View all services</BrowseAllLink>
      </BrowseAllFooter>
    );
    const footer = container.firstElementChild as HTMLElement;
    expect(footer.className).toContain('justify-center');
  });
});

describe('a real card grid', () => {
  it('keeps every card the same component, whatever the entity type', () => {
    // Four near-identical card implementations existed before this, each with
    // its own padding, tile size, and border colour.
    withRouter(
      <CardGrid label="Departments">
        {['Executive', 'Legislative', 'Accounting'].map(name => (
          <CardGridItem key={name}>
            <CategoryCard
              to={`/government/departments/${name.toLowerCase()}`}
              title={name}
              description="A department."
              icon={Heart}
              cta="View details"
            />
          </CardGridItem>
        ))}
      </CardGrid>
    );

    const links = screen.getAllByRole('link');
    // Three cards, each named by its own title.
    expect(links.map(l => l.textContent)).toEqual([
      expect.stringContaining('Executive'),
      expect.stringContaining('Legislative'),
      expect.stringContaining('Accounting'),
    ]);
  });

  it('uses a real external link for external resources', () => {
    withRouter(
      <CategoryCard
        to="https://example.gov.ph"
        title="Official resource"
        description="Hosted by the national government."
        icon={Heart}
        cta="View resource"
        external
      />
    );

    const link = screen.getByRole('link', { name: 'Official resource' });
    expect(link).toHaveAttribute('href', 'https://example.gov.ph');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

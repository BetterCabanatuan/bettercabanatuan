import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import GovernmentCategoryPage from '../GovernmentCategoryPage';
import { governmentCategories } from '../../../data/yamlLoader';

const STUB_SLUGS = [
  'news',
  'reports-and-statistics',
  'guides-and-regulations',
  'public-consultations',
  'transparency-documents',
];

describe('GovernmentCategoryPage empty states', () => {
  STUB_SLUGS.forEach(slug => {
    const category = governmentCategories.categories.find(
      c => c.slug === slug
    )!;

    it(`shows an intentional empty state on /government/${slug}`, async () => {
      renderWithProviders(<GovernmentCategoryPage />, {
        route: `/government/${slug}`,
        routePattern: '/government/:categoryId',
      });

      // Section title still renders.
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: category.category,
        })
      ).toBeInTheDocument();

      // ...followed by a real empty state, not a blank area.
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'This section is being prepared' })
      ).toBeInTheDocument();
      expect(screen.getByText(category.comingSoonNote!)).toBeInTheDocument();

      // And a way forward.
      expect(
        screen.getByRole('link', { name: /Browse all government sections/ })
      ).toHaveAttribute('href', '/government');
      expect(
        screen.getByRole('link', { name: /Contact the city government/ })
      ).toHaveAttribute('href', '/contact');
    });
  });

  it('flags all five stub sections as coming soon in the data', () => {
    STUB_SLUGS.forEach(slug => {
      const category = governmentCategories.categories.find(
        c => c.slug === slug
      );
      expect(category, `missing category ${slug}`).toBeDefined();
      expect(category!.comingSoon).toBe(true);
      expect(category!.comingSoonNote?.trim()).toBeTruthy();
    });
  });

  it('does not flag sections that have a dedicated page', () => {
    ['officials', 'departments', 'projects', 'barangays'].forEach(slug => {
      const category = governmentCategories.categories.find(
        c => c.slug === slug
      );
      expect(category?.comingSoon ?? false).toBe(false);
    });
  });

  it('renders a not-found banner for an unknown category', () => {
    renderWithProviders(<GovernmentCategoryPage />, {
      route: '/government/not-a-real-section',
      routePattern: '/government/:categoryId',
    });

    expect(screen.getByText('Category not found')).toBeInTheDocument();
  });
});

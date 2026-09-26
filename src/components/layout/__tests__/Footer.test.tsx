import { render } from '@testing-library/react';
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
});

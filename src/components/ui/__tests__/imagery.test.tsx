import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryCard from '../CategoryCard';
import { getInitials } from '../../../lib/visualTokens';
import InitialsAvatar from '../InitialsAvatar';
import StatusBadge from '../StatusBadge';
import { Heart } from 'lucide-react';

/**
 * The imagery system's contract.
 *
 * These assertions exist for the specific ways a placeholder can go wrong: read
 * as a broken image, invent a face, or disappear against its own background.
 */

const withRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('getInitials', () => {
  it('takes the first and last token, skipping a middle initial', () => {
    // The failure this prevents: first + middle renders "MR" for most of the
    // officials on this site, because Filipino names carry a middle initial.
    expect(getInitials('Myca Elizabeth R. Vergara')).toBe('MV');
    expect(getInitials('Joselito C. Roque')).toBe('JR');
    expect(getInitials('Christian Jan Cecilio')).toBe('CC');
  });

  it('handles a single-token name', () => {
    expect(getInitials('Cecilia')).toBe('CE');
  });

  it('ignores punctuation between names', () => {
    expect(getInitials('Vergara, Myca Elizabeth')).toBe('VE');
  });

  it('returns an empty string rather than a glyph for a name with no letters', () => {
    // A blank box is the failure mode; the caller renders a dash instead.
    expect(getInitials('123')).toBe('');
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });
});

describe('InitialsAvatar', () => {
  it('renders the initials and says the photo is unavailable', () => {
    render(<InitialsAvatar name="Myca Elizabeth R. Vergara" />);
    expect(screen.getByText('MV')).toBeInTheDocument();
    // Announced, not merely visible: a reader should know this is a gap in the
    // data rather than a design choice.
    expect(
      screen.getByRole('img', {
        name: 'No official photo available for Myca Elizabeth R. Vergara',
      })
    ).toBeInTheDocument();
  });

  it('never uses a colour below the 3:1 non-text floor for its glyph', () => {
    // gray-400 on gray-100 is 2.97:1 — the one thing on the page a reader
    // genuinely cannot see. gray-600 is 5.46:1.
    render(<InitialsAvatar name="Test Person" />);
    const avatar = screen.getByRole('img');
    expect(avatar.className).toContain('text-gray-600');
    expect(avatar.className).not.toContain('text-gray-400');
  });

  it('renders a dash rather than an empty box when there are no initials', () => {
    render(<InitialsAvatar name="123" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it('renders the status word, never colour alone', () => {
    // The whole point of a badge label: "Ongoing" and "Completed" must be
    // distinguishable without colour vision and in a monochrome print.
    render(<StatusBadge tone="success">Completed</StatusBadge>);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('maps tones onto the badge tokens rather than arbitrary values', () => {
    const { container } = render(
      <StatusBadge tone="warning">Planned</StatusBadge>
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.className).toContain('bg-badge-warning');
    expect(badge.className).toContain('text-badge-warning-fg');
    expect(badge.className).not.toMatch(/\[#/);
  });
});

describe('CategoryCard', () => {
  it('is named by its own title, not by the underlying library label', () => {
    // The library's Card hardcodes aria-label="Service card", which wins over
    // the link's content and made every card on the site announce identically.
    withRouter(
      <CategoryCard
        to="/services/health-services"
        title="Health Services"
        description="Where to go for free check-ups."
        icon={Heart}
        cta="Explore"
      />
    );

    const link = screen.getByRole('link', { name: 'Health Services' });
    expect(link).toHaveAttribute('href', '/services/health-services');
    expect(link).not.toHaveAttribute('aria-label', 'Service card');
  });

  it('drops the library role="article" so cards are not landmarks', () => {
    const { container } = withRouter(
      <CategoryCard to="/services/education" title="Education" icon={Heart} />
    );
    expect(container.querySelector('[role="article"]')).toBeNull();
  });

  it('puts the heading level on the card title', () => {
    withRouter(
      <CategoryCard
        to="/government/departments/executive"
        title="Office of the City Mayor"
        icon={Heart}
        headingLevel={2}
      />
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Office of the City Mayor',
      })
    ).toBeInTheDocument();
  });

  it('gives every card a visual anchor when an icon is supplied', () => {
    const { container } = withRouter(
      <CategoryCard to="/services/education" title="Education" icon={Heart} />
    );
    // The icon is decorative: the card already names itself in text.
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

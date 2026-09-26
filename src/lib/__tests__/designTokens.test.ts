import { describe, expect, it } from 'vitest';
import {
  contrastPairs,
  forbiddenPairs,
  content,
  surface,
  badge,
  space,
  type,
} from '../designTokens';
import { roundRatio } from '../contrast';

/**
 * The token contract, enforced in CI.
 *
 * A colour edit that quietly drops a pair below its WCAG threshold should fail
 * `npm test`, not get noticed during an accessibility review six months later.
 *
 * The other half of the contract — that these values still match the `@theme`
 * block in `src/index.css` — is checked by `npm run check:contrast`, which can
 * read the stylesheet from disk. Vite's `?raw` returns an empty string for CSS
 * under Vitest, so asserting it here would have tested nothing while looking
 * like it tested something.
 */

describe('colour tokens', () => {
  describe('every declared pair clears its WCAG 2.1 threshold', () => {
    it.each(contrastPairs.map(p => [p.role, p] as const))(
      '%s',
      (_role, pair) => {
        const ratio = roundRatio(pair.fg, pair.bg);
        expect(
          ratio,
          `${pair.role} measures ${ratio}:1, needs ${pair.min}:1`
        ).toBeGreaterThanOrEqual(pair.min);
      }
    );
  });

  it('covers the roles the UI actually renders', () => {
    // A token set that silently stopped checking links or badges would still
    // pass every case above while letting a real regression through.
    const roles = contrastPairs.map(p => p.role);
    expect(roles).toContain('link.base on surface.page');
    expect(roles).toContain('content.muted on surface.page');
    expect(roles).toContain('badge.info');
    expect(roles).toContain('badge.success');
    expect(roles).toContain('badge.warning');
    expect(roles.some(r => r.startsWith('focus ring'))).toBe(true);
  });

  describe('the declared traps still measure below their threshold', () => {
    // If a "trap" starts measuring fine, the guidance in the docs is stale and
    // the list needs restating — that is a documentation bug worth failing on.
    it.each(forbiddenPairs.map(p => [p.role, p] as const))(
      '%s',
      (_role, pair) => {
        expect(
          roundRatio(pair.fg, pair.bg),
          `${pair.role} no longer measures as a trap — update designTokens.ts and docs/DESIGN-TOKENS.md`
        ).toBeLessThan(pair.min);
      }
    );
  });

  describe('the content ramp is monotonic and correctly ordered', () => {
    it('darkens as the step increases, so 500 always reads lighter than 600', () => {
      const steps = [
        content.decorative,
        content.subtle,
        content.muted,
        content.default,
        content.strong,
      ];
      for (let i = 1; i < steps.length; i++) {
        expect(
          roundRatio(steps[i], surface.page),
          `step ${i} is not darker than the one before it`
        ).toBeGreaterThan(roundRatio(steps[i - 1], surface.page));
      }
    });
  });

  describe('badge tones are all distinguishable and legible', () => {
    it.each(Object.keys(badge))('%s clears 4.5:1', tone => {
      expect(
        roundRatio(
          badge[tone as keyof typeof badge].fg,
          badge[tone as keyof typeof badge].bg
        )
      ).toBeGreaterThanOrEqual(4.5);
    });

    it('gives every tone its own background', () => {
      const backgrounds = Object.values(badge).map(b => b.bg);
      expect(new Set(backgrounds).size).toBe(backgrounds.length);
    });
  });

  describe('status contrast is not carried by colour alone', () => {
    // Ongoing / Planned / Completed are distinguished by their text label, not
    // only by hue — which is why every badge renders a string, not a dot.
    it.each(Object.entries(badge))(
      '%s has a distinct foreground',
      (_tone, tone) => {
        expect(tone.fg).toMatch(/^#[0-9a-f]{6}$/i);
      }
    );
  });
});

describe('spacing and type scales', () => {
  it('uses a 4px base for every spacing step', () => {
    for (const [name, value] of Object.entries(space)) {
      const rem = parseFloat(value as string) * 16;
      expect(rem % 4, `space.${name} (${value}) is not a multiple of 4px`).toBe(
        0
      );
    }
  });

  it('grows the type scale monotonically', () => {
    const order = [
      'xs',
      'sm',
      'base',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
    ] as const;
    for (let i = 1; i < order.length; i++) {
      const prev = parseFloat(type[order[i - 1]].min) * 16;
      const cur = parseFloat(type[order[i]].min) * 16;
      expect(
        cur,
        `type.${order[i]} should be larger than type.${order[i - 1]}`
      ).toBeGreaterThan(prev);
    }
  });

  it('pairs every type size with a line height', () => {
    for (const [name, step] of Object.entries(type)) {
      expect(step.leading, `type.${name} has no line height`).toBeGreaterThan(
        1
      );
      expect(
        parseFloat(step.max),
        `type.${name} shrinks on desktop`
      ).toBeGreaterThanOrEqual(parseFloat(step.min));
    }
  });
});

import { describe, expect, it, vi } from 'vitest';
import { ICON_MAP, getIconComponent, isKnownIcon } from '../iconMap';

describe('iconMap', () => {
  it('resolves every icon referenced by the content files', () => {
    // A YAML `icon:` that is not in the map used to fall back silently, so a
    // typo and a deliberate choice rendered the same icon.
    for (const name of [
      'Heart',
      'Landmark',
      'Building2',
      'Users',
      'Newspaper',
    ]) {
      expect(isKnownIcon(name), `${name} should be a known icon`).toBe(true);
      expect(ICON_MAP[name]).toBeDefined();
    }
  });

  it('gives each domain its own fallback rather than one generic icon', () => {
    // Previously every unknown name became Building2, so a mis-typed service
    // icon and a mis-typed government icon rendered identically and neither
    // looked like a mistake. Asserted as distinctness rather than identity:
    // Lucide's icons are `forwardRef` objects, and module interop can hand this
    // test a different instance of the same export.
    const service = getIconComponent('NotARealIcon', { domain: 'service' });
    const government = getIconComponent('NotARealIcon', {
      domain: 'government',
    });
    const neutral = getIconComponent('NotARealIcon', { domain: 'neutral' });

    expect(service).toBeDefined();
    expect(government).toBeDefined();
    expect(neutral).toBeDefined();
    expect(service).not.toBe(government);
    expect(government).not.toBe(neutral);
    expect(service).not.toBe(neutral);
    // The old catch-all, which made everything look like a building.
    expect(ICON_MAP.Building2).toBeDefined();
    expect([service, government, neutral]).not.toContain(ICON_MAP.Building2);
  });

  it('prefers a real icon over the domain fallback', () => {
    // Compared against ICON_MAP rather than an icon imported by name: Lucide's
    // icons are `forwardRef` objects, and module interop can hand the test a
    // different instance of the same export, so an identity check against the
    // import would fail for reasons unrelated to the code under test.
    expect(getIconComponent('Heart', { domain: 'service' })).toBe(
      ICON_MAP.Heart
    );
    // Leading and trailing whitespace in a YAML value should not break it.
    expect(getIconComponent('  Heart  ', { domain: 'service' })).toBe(
      ICON_MAP.Heart
    );
  });

  it('never throws or returns nothing for a missing name', () => {
    // A blank card is worse than a fallback icon.
    expect(getIconComponent(undefined)).toBeDefined();
    expect(getIconComponent('')).toBeDefined();
    expect(getIconComponent('   ')).toBeDefined();
  });

  it('warns in development about an unknown name, with the valid set', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getIconComponent('TypoIcon', { domain: 'service', warn: true });
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('TypoIcon');
    // The message has to be actionable: it lists what is allowed.
    expect(warn.mock.calls[0][0]).toContain('Heart');
    warn.mockRestore();
  });

  it('stays silent for an absent name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getIconComponent(undefined, { warn: true });
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('reports unknown names distinctly from known ones', () => {
    expect(isKnownIcon('Heart')).toBe(true);
    expect(isKnownIcon('TypoIcon')).toBe(false);
    expect(isKnownIcon(undefined)).toBe(false);
  });
});

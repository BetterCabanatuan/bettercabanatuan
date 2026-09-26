import { describe, expect, it } from 'vitest';
import { contentUrlTransform } from '../markdownComponents';

describe('contentUrlTransform', () => {
  it('keeps tel: links, which react-markdown strips by default', () => {
    expect(contentUrlTransform('tel:+639190811348')).toBe('tel:+639190811348');
    expect(contentUrlTransform('tel:0919-081-1348')).toBe('tel:0919-081-1348');
  });

  it('keeps the protocols react-markdown already trusts', () => {
    expect(contentUrlTransform('https://cabanatuancity.gov.ph')).toBe(
      'https://cabanatuancity.gov.ph'
    );
    expect(contentUrlTransform('http://example.gov.ph')).toBe(
      'http://example.gov.ph'
    );
    expect(contentUrlTransform('mailto:info@example.gov.ph')).toBe(
      'mailto:info@example.gov.ph'
    );
  });

  it('keeps relative, anchor, and in-site links working', () => {
    expect(contentUrlTransform('/services/health-services')).toBe(
      '/services/health-services'
    );
    expect(contentUrlTransform('#key-health-contacts')).toBe(
      '#key-health-contacts'
    );
  });

  it('still blocks script-bearing protocols', () => {
    expect(contentUrlTransform('javascript:alert(1)')).toBe('');
    expect(contentUrlTransform('JavaScript:alert(1)')).toBe('');
    expect(
      contentUrlTransform('data:text/html,<script>alert(1)</script>')
    ).toBe('');
    expect(contentUrlTransform('vbscript:msgbox(1)')).toBe('');
  });

  it('does not let a lookalike scheme slip through', () => {
    // The scheme is compared in full, so `telx:` must not be treated as `tel`.
    expect(contentUrlTransform('telx:+639190811348')).toBe('');
    expect(contentUrlTransform('not-tel:12345')).toBe('');
  });
});

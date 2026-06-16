import { describe, expect, it } from 'vitest';
import { transparencyData } from '../yamlLoader';

describe('transparency data', () => {
  it('loads sections and resources from transparency.yaml', () => {
    expect(transparencyData.description.length).toBeGreaterThan(0);
    expect(transparencyData.sections.length).toBeGreaterThanOrEqual(3);
  });

  it('includes portal and national resource links', () => {
    const hrefs = transparencyData.sections.flatMap(section =>
      section.resources.map(resource => resource.href)
    );

    expect(hrefs).toContain('/government/transparency-documents');
    expect(hrefs).toContain('/transparency/flood-controls');
    expect(hrefs).toContain('https://www.foi.gov.ph');
    expect(hrefs).toContain('https://data.gov.ph');
  });
});

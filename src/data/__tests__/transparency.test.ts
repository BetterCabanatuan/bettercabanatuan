import { describe, expect, it } from 'vitest';
import {
  TRANSPARENCY_DOCUMENT_STATUSES,
  transparencyData,
  type TransparencySection,
} from '../yamlLoader';
import researchNote from '../../../docs/superpowers/specs/2026-10-11-cabanatuan-resident-needs-research.md?raw';

const CHARTER_PDF =
  'https://www.cabanatuancity.gov.ph/uploads/photos/detail/61d7d8890742f0.14414526.pdf';
const APP_FY2026_PDF =
  'https://www.cabanatuancity.gov.ph/uploads/files/procurement/6a5878e43d7118.12679050.pdf';

/** The sections slice C2 added; every URL in them must be in the research note. */
const CHARTER_DERIVED_SECTION_IDS = [
  'charter',
  'full-disclosure',
  'transparency-seal',
];

function sectionById(id: string): TransparencySection {
  const section = transparencyData.sections.find(s => s.id === id);
  if (!section) throw new Error(`transparency.yaml has no section "${id}"`);
  return section;
}

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

  it('keeps section ids unique so anchors and aria ids do not collide', () => {
    const ids = transparencyData.sections.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("links the Citizen's Charter PDF with its edition and upload date", () => {
    const charter = sectionById('charter');
    expect(charter.resources).toHaveLength(1);

    const [pdf] = charter.resources;
    expect(pdf.href).toBe(CHARTER_PDF);
    expect(pdf.external).toBe(true);
    expect(pdf.description).toContain('2nd Edition');
    expect(pdf.description).toContain('2022-01-07');
  });

  it('lists the eight Full Disclosure Policy documents named in the research note', () => {
    const fdp = sectionById('full-disclosure');
    const titles = (fdp.documents ?? []).map(d => d.title.toLowerCase());

    expect(titles).toHaveLength(8);
    for (const expected of [
      'annual budget',
      'statement of receipts and expenditures',
      'special education fund utilisation',
      '20% development fund utilisation',
      'trust fund utilisation',
      'bid results and awarded contracts',
      'annual procurement plan',
      'manpower complement',
    ]) {
      expect(titles).toContain(expected);
    }

    expect(fdp.description).toContain('2024-021');
    expect(fdp.resources.map(r => r.href)).toContain(
      'https://fdpp.dilg.gov.ph/'
    );
  });

  it('marks the APP as posted with the city PDF and leaves most FDP rows not yet located', () => {
    const fdp = sectionById('full-disclosure');
    const documents = fdp.documents ?? [];

    const app = documents.find(d => d.title === 'Annual procurement plan');
    expect(app?.status).toBe('posted');
    expect(app?.href).toBe(APP_FY2026_PDF);

    // Slice C2: government.yaml keeps `transparency-documents` as comingSoon
    // until at least half the FDP rows are posted. Guard the premise.
    const posted = documents.filter(d => d.status === 'posted').length;
    expect(posted).toBeLessThan(documents.length / 2);
  });

  it('lists the Transparency Seal items with the applicability caveat and its reference', () => {
    const seal = sectionById('transparency-seal');
    const titles = (seal.documents ?? []).map(d => d.title.toLowerCase());

    expect(titles).toHaveLength(9);
    for (const fragment of [
      'mandate',
      'budgets and targets',
      'procurement plan and awarded contracts',
      'major programmes and projects',
      'status reports',
      'subsidy programmes',
      'bfars',
      'retained income',
      'news',
    ]) {
      expect(
        titles.some(t => t.includes(fragment)),
        fragment
      ).toBe(true);
    }

    expect(seal.note).toMatch(/not confirmed/i);
    expect(seal.resources.map(r => r.href)).toContain(
      'https://www.phcc.gov.ph/transparency-seal'
    );
  });

  it('gives every document row a known status and a link only when posted', () => {
    for (const section of transparencyData.sections) {
      for (const document of section.documents ?? []) {
        expect(
          TRANSPARENCY_DOCUMENT_STATUSES,
          `${section.id}: ${document.title}`
        ).toContain(document.status);
        expect(document.title.length).toBeGreaterThan(0);
        expect(document.description.length).toBeGreaterThan(0);

        if (document.status === 'not-yet-located') {
          // A row that was not found has nothing to link to.
          expect(document.href, `${document.title} should not link`).toBe(
            undefined
          );
        }
        if (document.href?.startsWith('http')) {
          expect(document.external, `${document.title} external flag`).toBe(
            true
          );
        }
      }
    }
  });

  it('cites only URLs that appear in the research note in the charter-derived sections', () => {
    const urls = CHARTER_DERIVED_SECTION_IDS.flatMap(id => {
      const section = sectionById(id);
      return [
        ...section.resources.map(r => r.href),
        ...(section.documents ?? []).flatMap(d => (d.href ? [d.href] : [])),
      ];
    }).filter(href => href.startsWith('http'));

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(
        researchNote,
        `${url} is not cited in the research note`
      ).toContain(url);
    }
  });

  it('has no unresolved placeholders in any transparency string', () => {
    const strings: string[] = [transparencyData.description];
    for (const section of transparencyData.sections) {
      strings.push(section.title, section.description, section.note ?? '');
      for (const r of section.resources) {
        strings.push(r.title, r.description, r.href);
      }
      for (const d of section.documents ?? []) {
        strings.push(d.title, d.description, d.sourceNote ?? '', d.href ?? '');
      }
    }
    for (const s of strings) {
      expect(s).not.toMatch(/\{[A-Z0-9_]+\}/);
      expect(s).not.toMatch(/\[[A-Z][A-Z ]+\]/);
    }
  });
});

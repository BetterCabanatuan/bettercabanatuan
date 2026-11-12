import { describe, expect, it } from 'vitest';
import {
  leadOffice,
  officeCodes,
  officeInfo,
  procurementPlan,
  totalBudget,
  totalsByLeadOffice,
} from '../procurementPlan';
import { allDepartments } from '../yamlLoader';

const { source, sections, items } = procurementPlan;

/** Money compared in centavos, so float sums cannot drift a test. */
const centavos = (value: number) => Math.round(value * 100);

describe('procurement plan data', () => {
  it('is the FY 2026 plan from the city website', () => {
    expect(source.fiscalYear).toBe(2026);
    expect(source.url).toBe(
      'https://www.cabanatuancity.gov.ph/uploads/files/procurement/6a5878e43d7118.12679050.pdf'
    );
    expect(source.approvedDate).toBe('2025-12-23');
    expect(items).toHaveLength(500);
  });

  // The import refuses to write unless these hold; this guards hand edits.
  it('adds up to every total the plan prints', () => {
    for (const section of sections) {
      const rows = items.filter(item => item.section === section.id);
      expect(centavos(totalBudget(rows)), section.id).toBe(
        centavos(section.printedTotal)
      );
    }
    expect(centavos(totalBudget(items))).toBe(centavos(5_697_991_404));
    expect(source.printedTotal).toBe(5_697_991_404);
  });

  it('gives every row an id, a title, an office, a month range and a page', () => {
    const ids = new Set(items.map(item => item.id));
    expect(ids.size).toBe(items.length);

    for (const item of items) {
      expect(item.title.length, item.id).toBeGreaterThan(0);
      expect(item.office.length, item.id).toBeGreaterThan(0);
      expect(item.start, item.id).toMatch(/^\d{4}-\d{2}$/);
      expect(item.end, item.id).toMatch(/^\d{4}-\d{2}$/);
      expect(item.page, item.id).toBeGreaterThanOrEqual(1);
      expect(item.page, item.id).toBeLessThanOrEqual(source.pages);
      if (item.budget !== null) expect(item.budget).toBeGreaterThan(0);
    }
  });

  it('keeps group headings on the rows they cover', () => {
    const grouped = items.filter(item => item.group);
    expect(grouped.map(item => `${item.group}: ${item.title}`)).toContain(
      'Purchase of: IT Equipment and Software'
    );
    expect(grouped.map(item => `${item.group}: ${item.title}`)).toContain(
      'Repair and Maintenance: Motor Vehicles'
    );
    expect(grouped).toHaveLength(13);
  });
});

describe('officeCodes', () => {
  it.each([
    ['CEO', ['CEO']],
    ['CSWDO - FDC', ['CSWDO']],
    ['CMO-LYDO', ['CMO']],
    ['City Motorpool Office', ['MOTORPOOL']],
    ['SP/VMO', ['SP', 'VMO']],
    ['CEO, CPDO, CSWDO', ['CEO', 'CPDO', 'CSWDO']],
    [
      'CMO / SP / CBO / CAO / CITY MOTORPOOL / CCENRO',
      ['CMO', 'SP', 'CBO', 'CAO', 'MOTORPOOL', 'CCENRO'],
    ],
    // Printed with only a space between two codes.
    ['CPDO / GSO CCENRO / DENR', ['CPDO', 'GSO', 'CCENRO', 'DENR']],
    [
      'CMO / SP / CEO / CPDO / CHO / CCERNO',
      ['CMO', 'SP', 'CEO', 'CPDO', 'CHO', 'CCENRO'],
    ],
  ])('reads %s', (office, expected) => {
    expect(officeCodes(office)).toEqual(expected);
  });

  it('leaves codes it cannot confirm as printed, without a name', () => {
    expect(officeInfo('CEEMO')).toEqual({
      code: 'CEEMO',
      label: 'CEEMO',
      isCode: true,
    });
    expect(officeInfo('CAO').name).toBeUndefined();
    expect(officeInfo('CAO').slug).toBeUndefined();
    // The plan names these offices rather than coding them.
    expect(officeInfo('MOTORPOOL')).toMatchObject({
      label: 'City Motorpool Office',
      isCode: false,
    });
  });

  it('links only to department pages that exist', () => {
    const slugs = new Set(allDepartments.map(d => d.slug));
    const linked = new Set(
      items.flatMap(item => officeCodes(item.office)).map(officeInfo)
    );
    for (const info of linked) {
      if (info.slug) expect(slugs, info.code).toContain(info.slug);
    }
  });
});

describe('totalsByLeadOffice', () => {
  it('splits the whole plan between lead offices, largest first', () => {
    const totals = totalsByLeadOffice(items);
    const sum = totals.reduce((acc, office) => acc + office.total, 0);
    expect(centavos(sum)).toBe(centavos(totalBudget(items)));
    expect(totals.reduce((acc, office) => acc + office.count, 0)).toBe(
      items.length
    );
    expect(totals[0].code).toBe('CEO');
    for (let i = 1; i < totals.length; i++) {
      expect(totals[i - 1].total).toBeGreaterThanOrEqual(totals[i].total);
    }
  });

  it('counts a row under the first office it names', () => {
    const shared = items.find(item => item.office === 'CSWDO / CHO');
    expect(shared && leadOffice(shared)).toBe('CSWDO');
  });
});

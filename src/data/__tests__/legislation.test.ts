import { describe, expect, it } from 'vitest';
import { legislationData } from '../yamlLoader';

describe('legislation data', () => {
  it('loads republic acts, jurisprudence, and pending bills', () => {
    expect(legislationData.title).toBeTruthy();
    expect(legislationData.republicActs.length).toBeGreaterThanOrEqual(7);
    expect(legislationData.jurisprudence.length).toBeGreaterThanOrEqual(2);
    expect(legislationData.pendingBills.length).toBeGreaterThanOrEqual(1);
  });

  it('includes required republic act fields', () => {
    const act = legislationData.republicActs[0];
    expect(act).toMatchObject({
      raNumber: expect.stringMatching(/^R\.A\. \d+$/),
      title: expect.any(String),
      year: expect.any(Number),
      summary: expect.any(String),
      tags: expect.any(Array),
      url: expect.stringMatching(/^https:\/\//),
    });
  });

  it('references Cabanatuan in bill titles or authors', () => {
    const bill = legislationData.pendingBills[0];
    expect(`${bill.title} ${bill.authors.join(' ')}`).toMatch(
      /Cabanatuan|Vergara/i
    );
  });
});

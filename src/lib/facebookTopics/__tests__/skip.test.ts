import { describe, expect, it } from 'vitest';
import { skipReason } from '../skip';

describe('skipReason', () => {
  it.each([
    ['GOOD MORNING, CABANATUAN!\n\nPaalala sa lahat:', 'good-morning'],
    ["Hiring for SHYLLA'S PARTY JAM!!!", 'private-hiring'],
    [
      'Picture yourself in a new career! 📸✨\nGreat Image is HIRING!',
      'private-hiring',
    ],
    ['We Have the Tools, We Need People\n\n#JayVergara #CongJay', 'politician'],
  ])('skips %j as %s', (text, reason) => {
    expect(skipReason(text)).toBe(reason);
  });

  it('skips listed post ids', () => {
    expect(skipReason('Throwback muna tayo', '1461248302712951')).toBe(
      'post-id'
    );
  });

  it.each([
    'HAPPENING NOW: TRABAHO AGAD JOB FAIR\nAt CDRRMC Training Center',
    'LIBRENG CHECK-UP, PEDIA\nEVERY TUESDAY, 8:00 AM',
    // "hiring" deep in the body is not an ad.
    'PESO, NAGSAGAWA NG ORIENTATION\n\nMga aplikante\n\nMay hiring sa susunod na linggo',
  ])('keeps %j', text => {
    expect(skipReason(text)).toBeNull();
  });
});

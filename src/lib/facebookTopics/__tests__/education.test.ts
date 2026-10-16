import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../education';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('education rule', () => {
  it.each([
    '#WALANGPASOK | August 03, 2026\n\nSuspension of Face-to-face classes and shift to Alternative Delivery Mode. All Levels.',
    '#WALANGPASOK | AUGUST 28, 2026 (FRIDAY)\n\nAlinsunod sa Executive Order No. 26, Series of 2026, mula sa Provincial Government of Nueva Ecija— sinuspinde ang face-to-face classes sa lahat ng antas sa Nueva Ecija',
    '— CITY GOVERNMENT ADVISORY —\n\nAlinsunod sa Memorandum Circular No. 122, suspendido ang trabaho sa mga tanggapan ng pamahalaan at klase sa lahat ng antas sa Nueva Ecija.',
    // MC 126/127 move classes to modules, which parents need to know.
    'Alinsunod sa Memorandum Circular No. 127, inaatasan ang mga tanggapan ng pamahalaan na magpatupad ng alternative work arrangements ngayong Agosto 17, 2026.\n\nIpatutupad rin ang paglilipat o shift sa alternative learning modes para sa mga klase sa lahat ng antas sa mga pampubliko at pribadong paaralan.',
    '📚Alin sa mga paaralang ipinatayo ng City Government of Cabanatuan ang pinapasukan ng inyong mga anak?',
    'J.P. MELENCIO MEMORIAL ELEMENTARY SCHOOL\n\nAng bawat batang Cabanatueño ay may karapatang matuto sa ligtas at maayos na paaralan',
    'IKA -18 TAONG PAG TATAPOS SA ELEMENTARYA AT IKA-7 TAONG PAG TATAPOS NG ANTAS SA MATAAS NA PAARALAN NG ALS LEARNERS',
    'ORIENTATION PARA SA MGA SUPPORT AIDES NG ARAL PROGRAM PARA SA SY 2026–2027',
    '#TINGNAN | AUGUST 21, 2026\n\nDEPED: 2026 BUWAN NG WIKA AT KASAYSAYAN',
    'LUNGSOD NG CABANATUAN, LUMAGDA SA MEMORANDUM OF UNDERSTANDING SA NEUST',
    'OFFICIAL STATEMENT\n\nRe: Heat-Related Incident Involving Learners – July 6, 2026',
    '#CHECKTHISOUT!\n\nLibreng Bakuna Eskwela ng Cabanatuan City Health Office',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    '📣 MR SIA 2026 | CABANATUAN CITY UPDATE\n👶 Target: Mga batang 6–59 months old',
    'LIBRENG EYE CHECK-UP PARA SA MGA BATA!\n\nTarget Beneficiaries: Preschool hanggang Grade 1 students',
    'FREE SEMINAR FOR PARENTS, CAREGIVERS, GUARDIANS, AND TEACHERS OF NEURODIVERGENT CHILDREN IN CABANATUAN CITY, NUEVA ECIJA',
    'CSWDO, PATULOY NA NAGMOMONITOR AT NAGBIBIGAY NG TULONG SA MGA EVACUATION CENTER\n\nsa San Josef National High School, Lazaro Francisco Integrated School',
    'PAUNAWA SA PUBLIKO: VALIDATION AT REGISTRATION NG MGA POTENSYAL NA BENEPISYARYO NG 4Ps',
    'ANNOUNCEMENT | HALF-DAY WORK\nAlinsunod sa Memorandum Circular No. 136, s. 2026—ang trabaho sa mga tanggapan ng pamahalaan ay suspendido simula alas-1:00 ng hapon',
    '#TINGNAN | CABANATUAN WEEKLY NEWS RECAP\n\n🎓 CCSP PAYOUT | S.Y. 2025–2026, 2ND SEMESTER',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

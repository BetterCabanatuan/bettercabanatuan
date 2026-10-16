import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../garbage-waste-disposal';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

describe('garbage-waste-disposal rule', () => {
  // Excerpts of real posts from the city Facebook page.
  it.each([
    'MY CABANATUAN ADVOCACY: 2025 CLEAN! CLEAN! CLEAN! AWARDING CEREMONY | JUNE 30, 2026',
    'CABANATUAN CITY RECOGNIZED AT THE 2026 ENVIRONMENTAL SUMMIT & RECOGNITION CEREMONY\nThe City Government of Cabanatuan was recognized as an Outstanding Local Government Unit in Solid Waste Enforcement and Implementation',
    'Brgy Pagas\n🏆 Outstanding Practices for Materials Recovery Facility Operation',
  ])('tags real post %j', text => {
    expect(tagged(text)).toBe(true);
  });

  // Synthetic examples of posts the page is likely to make later.
  it.each([
    'ANNOUNCEMENT | GARBAGE COLLECTION SCHEDULE\nNarito ang iskedyul ng paghakot ng basura sa inyong barangay.',
    'PAALALA: Ihiwalay ang nabubulok at di-nabubulok na basura bago ilabas.',
    'Mahigpit na ipinatutupad ang RA 9003 o Ecological Solid Waste Management Act.',
    'CITY ORDINANCE: Bawal na ang single-use plastic sa mga palengke simula Nobyembre 1.',
    'Isinagawa ang Barangay Clean-up Drive sa Brgy. Sangitan East ngayong Sabado.',
    'Anti-littering ordinance: may multa ang mahuhuling nagtatapon kung saan-saan.',
    'Dalhin ang inyong e-waste at lumang baterya sa City MRF tuwing Biyernes.',
  ])('tags synthetic post %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    // Real: nutrition post with one recycling tip.
    '2026 Nutrition Month Sub-Theme: Nutrisyon at Kalikasan, Ating Pangalagaan! 💚\n♻️ Mag-segregate at mag-recycle ng basura.',
    // Real: flag raising hosted by CEEMO.
    '#MONDAYFRC | FLAG RAISING CEREMONY CEEMO | AUG 10, 2026\nPinangunahan ng City Economic Enterprise and Management Office (CEEMO) ang Flag Raising Ceremony',
    // Real: waterway dredging is flood control, not waste.
    'EXCAVATION OF WATERWAY | BRGY. VALLE CRUZ\nIsinagawa ang excavation at paglilinis ng waterway gamit ang heavy equipment',
    // Synthetic: storm advisory with a drainage reminder.
    'BANTAY BAGYO | Huwag magtapon ng basura sa kanal upang maiwasan ang pagbaha.',
    // Synthetic: job ad.
    'WE ARE HIRING: Garbage truck drivers para sa City ENRO.',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

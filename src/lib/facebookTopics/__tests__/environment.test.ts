import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../environment';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

describe('environment rule', () => {
  // Excerpts of real posts from the city Facebook page.
  it.each([
    'CABANATUAN CITY RECOGNIZED AT THE 2026 ENVIRONMENTAL SUMMIT & RECOGNITION CEREMONY\nA proud moment for Cabanatuan City as we receive recognition during the 2026 Environmental Summit and Recognition Ceremony of DENR–Environmental Management Bureau Region III',
    'MY CABANATUAN ADVOCACY: 2025 CLEAN! CLEAN! CLEAN! AWARDING CEREMONY | JUNE 30, 2026\nbilang pagkilala sa mga barangay na nagpamalas ng natatanging dedikasyon sa pagpapanatili ng kalinisan, kaayusan, at pangangalaga sa kapaligiran',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  // Synthetic examples of posts the page is likely to make.
  it.each([
    '#TINGNAN | TREE PLANTING ACTIVITY sa Brgy. Bakod Bayan kasama ang City ENRO',
    'Pagtatanim ng mga puno sa gilid ng Pampanga River bilang bahagi ng Arbor Day',
    'RIVER CLEAN-UP DRIVE | Paglilinis ng ilog sa Brgy. Sumacab Este',
    'PAALALA: Bawal ang open burning ng basura alinsunod sa R.A. 9003',
    'City Ordinance on the regulation of single-use plastics, effective January 2027',
    'Earth Hour 2027: Patayin ang ilaw mula 8:30 hanggang 9:30 PM',
  ])('tags synthetic %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    // Real posts.
    '2026 Nutrition Month Sub-Theme: Nutrisyon at Kalikasan, Ating Pangalagaan! 💚\nDahil sa climate change at pagkasira ng kalikasan, naaapektuhan ang pagsasaka',
    '#MONDAYFRC | FLAG RAISING CEREMONY\nCEEMO | AUG 10, 2026\nPinangunahan ng City Economic Enterprise and Management Office (CEEMO) ang Flag Raising Ceremony',
    'PROTECTING CHILDHOOD IN THE DIGITAL AGE\nTinalakay sa training ang kaligtasan at proteksyon ng mga bata sa digital environment',
    'paglikha ng ligtas, maayos, at child-friendly na kapaligiran para sa mga batang Cabanatueños',
    'EXCAVATION OF WATERWAY | BRGY. VALLE CRUZ\nIsinagawa ang excavation at paglilinis ng waterway gamit ang heavy equipment',
    // Synthetic.
    'BANTAY BAGYO | Signal No. 1 — dahil sa climate change, mas malalakas ang bagyo',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

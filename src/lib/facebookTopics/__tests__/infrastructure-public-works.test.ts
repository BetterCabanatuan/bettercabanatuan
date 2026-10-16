import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../infrastructure-public-works';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('infrastructure-public-works rule', () => {
  it.each([
    'BRIDGE CLOSURE ADVISORY\n\nPansamantalang isinara ang Dalampang Bridge dahil sa soil erosion sa road approach papunta sa tulay',
    'CABANATUAN UPDATE | Agarang Pagkukumpuni\n\nNaisaayos na rin ang drainage cover sa Gen. Tinio Street corner Paco Roman Street',
    'PAALALA SA MGA MOTORISTA AT PUBLIKO\n\nKasalukuyang may sirang bahagi ng drainage grate sa Zulueta Street',
    'EXCAVATION OF WATERWAY | BRGY. VALLE CRUZ\nIsinagawa ang excavation at paglilinis ng waterway gamit ang heavy equipment',
    'PATULOY ANG PAGMOMONITOR NG MGA HEAVY EQUIPMENT MATAPOS ANG BAGYONG LUIS',
    'Alin sa mga paaralang ipinatayo ng City Government of Cabanatuan ang pinapasukan ng inyong mga anak?',
    'J.P. MELENCIO MEMORIAL ELEMENTARY SCHOOL\n\nito ang dahilan kung bakit nagpapatayo ang LGU Cabanatuan ng mga paaralan:\n- 4-Storey, 28 Classroom Building',
    'INAUGURATION AT RIBBON-CUTTING CEREMONY NG RICE PROCESSING COMPLEX, MACATBONG, CABANATUAN.',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    'OCTOBER IS MUSEUMS AND GALLERIES MONTH!\n\nThis year, the MGM Celebration has the theme "Bridging Divides, Preserving the Present for Tomorrow"',
    'J.CO DONUTS & COFFEE, MAY BAGONG BRANCH NA SA SM CITY CABANATUAN\nIsinagawa ang ribbon-cutting ceremony ng J.CO Donuts & Coffee',
    'RAPID WATER LEVEL MONITORING | AUGUST 10, 2026\nupang masubaybayan ang kasalukuyang antas ng tubig sa mga waterways, tulay, at flood-prone areas.',
    'RAPID MONITORING – AUGUST 19, 2026\n- Cabu Bridge, Brgy. Cabu – Humigit-kumulang 1 metro; below normal.',
    'MEMORANDUM OF AGREEMENT NG LUNGSOD NG CABANATUAN AT NATIONAL FOOD AUTHORITY',
    '#MONDAYFRC | FLAG RAISING CEREMONY\nCEO | SEPT 14, 2026\n\nPinangunahan ng CEO ang Flag Raising Ceremony ng Pamahalaang Lungsod',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

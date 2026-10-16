import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../housing-land-use';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

describe('housing-land-use rule', () => {
  // Excerpt of a real post from the city Facebook page.
  it('tags the Villa San Isidro HOA title awarding', () => {
    expect(
      tagged(
        '#TINGNAN | SEPTEMBER 14, 2026\n39 MEMBER BENEFICIARIES NG VILLA SAN ISIDRO HOA, TITLE AWARDING CEREMONY\nIsinagawa kahapon ang Nationwide Title Awarding Ceremony para sa mga fully paid member beneficiaries ng Community Mortgage Program (CMP) ng Social Housing Finance Corporation (SHFC).'
      )
    ).toBe(true);
  });

  // Synthetic examples of posts the page has not made yet.
  it.each([
    'ANNOUNCEMENT\nPagpaparehistro para sa Pambansang Pabahay para sa Pilipino (4PH) sa Lungsod ng Cabanatuan',
    'NHA RELOCATION SITE SA BRGY. CALABASA, BINUKSAN NA PARA SA MGA INFORMAL SETTLER FAMILIES',
    'PUBLIC HEARING | Updated Comprehensive Land Use Plan (CLUP) at Zoning Ordinance ng Cabanatuan City',
    'PAALALA: Kumuha muna ng Building Permit sa Office of the Building Official bago magpatayo ng bahay',
    'Pamamahagi ng titulo ng lupa sa mga benepisyaryo ng socialized housing project',
  ])('tags synthetic %j', text => {
    expect(tagged(text)).toBe(true);
  });

  // Excerpts of real posts that only brush against a housing word.
  it.each([
    'Patuloy ang pamamahagi ng 10-kilogramong bigas sa Brgy. San Isidro, Brgy. Mabini Homesite, Brgy. Villa Ofelia',
    'EXCAVATION OF WATERWAY | BRGY. VALLE CRUZ\nupang maalis ang naipong putik, lupa, at mga halaman',
    'Naghain po ako ng bagong panukalang batas — ito ay ang House Bill No. 2790 o ang Residental Care Facility Act\n✅Ligtas at Maayos na Tirahan',
    '#SPCabanatuanSession | August 11, 2026\npati na ang pagkilala sa mga Top Notcher ng July 2026 Real Estate Appraisers Licensure Exam',
    '#CIVILWEDDING\nGinanap sa Phase 2, Kapitan Pepe Subdivision ang Kasalang Bayan',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

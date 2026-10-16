import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../health-services';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('health-services rule', () => {
  it.each([
    'LIBRENG CHECK-UP PARA SA MGA BUNTIS AT MGA BATA',
    'ANNOUNCEMENT\nMEASLES-RUBELLA SUPPLEMENTAL IMMUNIZATION ACTIVITY (MR SIA)',
    '#TINGNAN | JULY 29, 2026\nTB Mass Screening Isinagawa sa Brgy. Bangad',
    '#PhilHealthYAKAP\nLIBRENG GAMOT HATID NG PHILHEALTH AT LGU CABANATUAN!',
    '#TINGNAN | SEPTEMBER 28, 2026\nLOCAL HEALTH BOARD MEETING',
    'PAANO MAGPAKAPON SA CITY VET?',
    '#CityVetCabanatuan | EVERYDAY FREE CONSULTATION, TREATMENT, ANTI-RABIES, DEWORMING, SPAY AND NEUTER',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    'BENTENG BIGAS, MERON NA! Para sa mga senior citizen at PWD na may PhilHealth',
    '#CIVILWEDDING\nPinangunahan ni Mayor ang Kasalang Bayan sa health center',
    'BANTAY BAGYO | Tropical Depression #LuisPh — bukas ang City Health Office',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

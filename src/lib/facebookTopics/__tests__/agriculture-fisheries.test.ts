import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../agriculture-fisheries';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('agriculture-fisheries rule', () => {
  it.each([
    '#TINGNAN | SEPTEMBER 30, 2026\nCABANATUAN CITY AGRICULTURE AND FISHERIES COUNCIL OATH-TAKING CEREMONY',
    '#TINGNAN | July 17, 2026\nHALALAN NG MGA OPISYAL NG CABANATUAN AGRICULTURE AND FISHERIES COUNCIL (CAFC)',
    'INAUGURATION AT RIBBON-CUTTING CEREMONY NG RICE PROCESSING COMPLEX, MACATBONG, CABANATUAN.\nmaaaring bumili ang LGU ng palay nang direkta mula sa mga magsasaka',
    'MEMORANDUM OF AGREEMENT NG LUNGSOD NG CABANATUAN AT NATIONAL FOOD AUTHORITY\nNegotiated Procurement – Agency-to-Agency ng milling ng palay',
    'JULY 20, 2026 | AWARDING OF KADIWA FINANCIAL GRANT TO VIVA STO. NIÑO AGRICULTURE COOPERATIVE',
    'The City Mayor’s Office – Agricultural and Biosystems Engineering Unit (CMO-ABE) spearheaded the awarding',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    'BENTENG BIGAS, MERON NA!\nkatuwang ang Food Terminal Incorporated (FTI) at National Food Authority (NFA) na magbigay ng mas abot-kayang bigas',
    '#BawatBayanMakikinabang | SEPTEMBER 01, 2026\n10-KILONG BIGAS, IPINAMAMAHAGI SA MGA PAMILYANG CABANATUEÑO\nkabilang ang mga magsasaka, mangingisda, senior citizens',
    'HOUSE-TO-HOUSE FREE ANTI-RABIES VACCINATION\nAng Cabanatuan City Veterinary Office ay magsasagawa ng LIBRENG house-to-house anti-rabies vaccination',
    '#CityVetCabanatuan | EVERYDAY FREE CONSULTATION, TREATMENT, ANTI-RABIES, DEWORMING, SPAY AND NEUTER',
    '#MONDAYFRC | FLAG RAISING CEREMONY\nACCOUNTING | JULY 20, 2026\nkasabay ng pag-a-award ng ₱2.5 million check sa mga farmers ng Brgy. Sto. Niño',
    '2026 Nutrition Month Sub-Theme: Nutrisyon at Kalikasan, Ating Pangalagaan!\nnaaapektuhan ang pagsasaka, pangingisda, at suplay ng pagkain',
    'Social Protection and Reintegration Orientation\nDinaluhan ito ni Executive Judge of Palayan City, Hon. Lody Q. Tancioco',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

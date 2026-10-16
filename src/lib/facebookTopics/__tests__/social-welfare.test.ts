import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../social-welfare';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('social-welfare rule', () => {
  it.each([
    'BENTENG BIGAS, MERON NA!\nHATID NG PANGULONG FERDINAND “BONGBONG” MARCOS JR.\nIsinagawa kahapon sa Brgy. Macatbong ang Benteng Bigas, Meron Na! – ₱20 Rice Project',
    '#BawatBayanMakikinabang | SEPTEMBER 15, 2026\n10-KILONG BIGAS, IPINAMAMAHAGI SA MGA PAMILYA NG SENIOR CITIZEN SA ILALIM NG “BAGONG PILIPINAS, BAWAT BAYAN MAKIKINABANG”',
    'MYCABANATUAN: KASALUKUYANG AKTIBIDAD SA LUNGSOD\nPatuloy ang iba’t ibang rice assistance initiatives para sa mga Cabanatueño',
    'PAUNAWA SA PUBLIKO: VALIDATION AT REGISTRATION NG MGA POTENSYAL NA BENEPISYARYO NG 4Ps',
    'Isinagawa kahapon, Hulyo 30, 2026, ang Social Pension Pay-out for Indigent Senior Citizens sa pangunguna ng City Social Welfare and Development Office (CSWDO)',
    '#TINGNAN | AUGUST 14, 2026\nUPLIFT PROGRAM PAYOUT\nIsinagawa ang payout para sa mga benepisyaryo ng Unified Package for Livelihood, Industry, Food and Transport (UPLIFT) Program',
    'CABANATUAN ASSOCIATION OF SENIOR CITIZENS FEDERATION, NAGSAGAWA NG BUWANANG PAGPUPULONG',
    '#TINGNAN | SEPTEMBER 2, 2026\nPROTECTING CHILDHOOD IN THE DIGITAL AGE',
    'FREE SEMINAR FOR PARENTS, CAREGIVERS, GUARDIANS, AND TEACHERS OF NEURODIVERGENT CHILDREN IN CABANATUAN CITY, NUEVA ECIJA',
    '#TINGNAN | AUGUST 04, 2026\nCSWDO, PATULOY NA NAGMOMONITOR AT NAGBIBIGAY NG TULONG SA MGA EVACUATION CENTER',
    'FUNERARIA DE CABANATUAN\nAng Funeraria de Cabanatuan ay isang proyekto ng Pamahalaang Lungsod na nagbibigay ng LIBRE, MAAYOS, AT MARANGAL NA FUNERAL SERVICES',
    '#TINGNAN | JULY 28, 2026\nSocial Protection and Reintegration Orientation',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    '#TINGNAN | CABANATUAN WEEKLY NEWS RECAP\n🍚 BENTENG BIGAS MERON NA\n🤝 CASCFI PWD FEDERATION MONTHLY MEETING',
    'LIBRENG CHECK-UP PARA SA MGA BUNTIS AT MGA BATA',
    '#WALANGPASOK | August 03, 2026\nSuspension of Face-to-face classes and shift to Alternative Delivery Mode. All Levels. Public and Private.',
    'Pinangunahan ni Mayor Myca Elizabeth R. Vergara ang pag-iisang-dibdib ng ilang magkasintahan sa isinagawang Civil Wedding Ceremony',
    'INAUGURATION AT RIBBON-CUTTING CEREMONY NG RICE PROCESSING COMPLEX, MACATBONG, CABANATUAN.\nKasabay ng pagdiriwang, 258 senior citizens ang nabigyan ng bigas',
    'PROGRAMA PARA SA CABANATUEÑO\nMula sa pagpapatayo at pagpapaganda ng mga pasilidad, pagsuporta sa edukasyon, kalusugan, kabuhayan, at serbisyong panlipunan',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../business';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('business rule', () => {
  it.each([
    'ANUNSYO MULA SA CITY TREASURER’S OFFICE\nPaalala po sa lahat ng mga may negosyo sa Lungsod ng Cabanatuan ang palugit sa pagbabayad ng buwis para sa 4th Quarter ng Business Tax',
    'PESO CABANATUAN CITY, KINILALANG BEST PESO SA 2025 NATIONAL SEARCH FOR THE BEST PESO AWARDS',
    'HAPPENING NOW: TRABAHO AGAD JOB FAIR\nAt CDRRMC Training Center, Kapt. Pepe, Cabanatuan City.',
    'PESO, NAGSAGAWA NG ORIENTATION SEMINAR AT INITIAL INTERVIEW PARA SA MGA APLIKANTE',
    'Ready to land your next job?\nWe are bringing the employers straight to you! Check out our line-up of upcoming recruitment activities\nWhere: PESO Office, City Hall Compound, Cabanatuan City',
    'LIVELIHOOD ASSISTANCE, IPINAGKALOOB SA MGA MARGINALIZED INDIVIDUALS MULA SA IKATLONG DISTRITO NG NUEVA ECIJA',
    'BIR REVENUE DISTRICT OFFICE NO. 23B – SOUTH NUEVA ECIJA, NAGSAGAWA NG PAGBISITA SA PAMAHALAANG LUNGSOD NG CABANATUAN',
    'The Local Government Unit of Cabanatuan proudly supports the Malikhaing Pinoy Wanna Make It Right with ISNI and Copyright Project of the Department of Trade and Industry (DTI-PCIDCS)',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    'J.CO DONUTS & COFFEE, MAY BAGONG BRANCH NA SA SM CITY CABANATUAN\nMalugod na tinatanggap ng Pamahalaang Lungsod ng Cabanatuan ang mga bagong negosyo',
    'UPLIFT PROGRAM PAYOUT\nPatuloy namang nagsasagawa ang CSWDO ng mga programang nakatuon sa pagbibigay ng livelihood assistance',
    'AWARDING OF KADIWA FINANCIAL GRANT TO VIVA STO. NIÑO AGRICULTURE COOPERATIVE\nThe grant is intended to provide financial support for the cooperative’s agricultural enterprise',
    'Eternal Plans, Inc. will conduct a boothing activity at Cabanatuan City Hall from July 1 to 31, 2026',
    'ANTI-RED TAPE AUTHORITY, NAGSAGAWA NG COMPLIANCE AUDIT AT ON-SITE MONITORING AND INSPECTION SA CABANATUAN',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

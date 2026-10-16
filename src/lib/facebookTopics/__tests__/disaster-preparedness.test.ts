import { describe, expect, it } from 'vitest';
import { matchTopics } from '../../facebookPosts';
import rule from '../disaster-preparedness';

const tagged = (text: string) => matchTopics(text, [rule]).length > 0;

// Excerpts of real posts from the city Facebook page.
describe('disaster-preparedness rule', () => {
  it.each([
    'BANTAY BAGYO | AUGUST 03, 2026\nTropical Depression #LuisPh\nThrough the recommendation from the City DRRM Office, #WalangPasokBukas',
    'BANTAY BAGYO | #IndayPH\nPatuloy na nakaalerto ang City Government of Cabanatuan kaugnay ng Tropical Cyclone Inday.',
    'RAINFALL WARNING | August 9, 2026\nWeather System: Enhanced Southwest Monsoon #HabagatPH',
    '#WALANGPASOK | August 10, 2026\nStay safe, Cabanatueños!\nBase sa rekomendasyon ng Provincial Disaster Risk Reduction and Management Office (PDRRMO)',
    '#WALANGPASOK | AUGUST 28, 2026 (FRIDAY)\nAlinsunod sa Executive Order No. 26, Series of 2026, mula sa Provincial Government of Nueva Ecija— sinuspinde ang face-to-face classes sa lahat ng antas',
    'AUGUST 06, 2026 | THURSDAY\n— CITY GOVERNMENT ADVISORY —\nAlinsunod sa Memorandum Circular No. 122, suspendido ang trabaho sa mga tanggapan ng pamahalaan at klase sa lahat ng antas sa Nueva Ecija.\nAng mga opisinang nagbibigay ng mga pangunahing serbisyo sa pangkalusugan, gayundin sa mga paghahanda at pagtugon sa sakuna, ay inaatasan na magpatuloy sa operasyon',
    'RAPID WATER LEVEL MONITORING | AUGUST 10, 2026\nPatuloy ang isinagawang Rapid Water Level Monitoring sa iba’t ibang lugar sa Cabanatuan City',
    'RAPID MONITORING – AUGUST 19, 2026\nMga lugar na nananatiling normal o below normal:\n- Purok Adobo, Brgy. San Juan Accfa – Normal; walang naitalang pagbaha.',
    '#TINGNAN | JULY 21, 2026\nCDRRMO, NAGSAGAWA NG FLOOD DRILL BILANG BAHAGI NG NATIONAL DISASTER RESILIENCE MONTH',
    '#TINGNAN | JULY 31, 2026\nCABANATUAN, NAKIBAHAGI SA PAGDIRIWANG NG NATIONAL DISASTER RESILIENCE MONTH 2026\nisinagawa ng Cabanatuan City Disaster Risk Reduction and Management Council ang information and awareness activity nitong nakaraang Hulyo 31, 2026 sa Level 1, SM City Cabanatuan.',
    'PRE-DISASTER RISK ASSESSMENT | July 8, 2026\nThrough the leadership of its Chairperson, Mayor Myca Vergara, the Cabanatuan City Disaster Risk Reduction and Management Council conducts Pre-Disaster Risk Assessment',
    '#TINGNAN | AUGUST 04, 2026\nCSWDO, PATULOY NA NAGMOMONITOR AT NAGBIBIGAY NG TULONG SA MGA EVACUATION CENTER',
    '#TINGNAN | AUGUST 03-05, 2026\nPATULOY ANG PAGMOMONITOR NG MGA HEAVY EQUIPMENT MATAPOS ANG BAGYONG LUIS',
    'EXCAVATION OF WATERWAY | BRGY. VALLE CRUZ\nIsinagawa ang excavation at paglilinis ng waterway gamit ang heavy equipment upang maalis ang naipong putik, lupa, at mga halaman na maaaring magdulot ng pagbaha.',
    'BRIDGE CLOSURE ADVISORY\nPansamantalang isinara ang Dalampang Bridge dahil sa soil erosion sa road approach papunta sa tulay na dulot ng tuloy-tuloy na malakas na pag-ulan.',
  ])('tags %j', text => {
    expect(tagged(text)).toBe(true);
  });

  it.each([
    'HAPPENING NOW: TRABAHO AGAD JOB FAIR\nAt CDRRMC Training Center, Kapt. Pepe, Cabanatuan City.',
    'NO SECOND SCREENING!!!\nARE YOU THE NEXT BINIBINING CABANATUAN?\n📍 CDRRMC Training Center',
    '#TINGNAN | AUGUST 14, 2026\nCITY HEALTH OFFICE AT RITEMED, NAGHATID NG HEALTH TALK SESSION\nsa CDRRMC Training Center, Cabanatuan City.',
    'Isinagawa kahapon, Hulyo 30, 2026, ang Social Pension Pay-out for Indigent Senior Citizens sa pangunguna ng City Social Welfare and Development Office (CSWDO), sa Cabanatuan City DRRM Council Training Center.',
    'Isinagawa kahapon, Hulyo 29, 2026, ang Digital Government Workforce Enhancement Program sa pangunguna ng Human Resource Management Office, sa Cabanatuan City DRRM Council Training Center.',
    'PAUNAWA SA PUBLIKO: VALIDATION AT REGISTRATION NG MGA POTENSYAL NA BENEPISYARYO NG 4Ps\n🏢 4Ps Office 📍 Near CDRRMO Building',
    '#TINGNAN | JULY 28, 2026\nSocial Protection and Reintegration Orientation\nIsinagawa ngayong araw bilang bahagi ng pagdiriwang ng ika-50 anibersaryo',
    'ANNOUNCEMENT | HALF-DAY WORK\nAlinsunod sa Memorandum Circular No. 136, s. 2026—ang trabaho sa mga tanggapan ng pamahalaan ay suspendido simula alas-1:00 ng hapon, bilang paggunita sa 34th National Family Week',
    'PAALALA PARA SA PUBLIKO\nSa ating mga customer at kalapit na residente na naapektuhan ng Southwest Monsoon, bukas ang SM City Cabanatuan at SM Megacenter Cabanatuan bilang ligtas na lugar',
    'INAUGURATION AT RIBBON-CUTTING CEREMONY NG RICE PROCESSING COMPLEX\nupang magsilbing rice buffer stocks sa panahon ng kalamidad, emergency, o pangangailangan ng komunidad.',
  ])('leaves out %j', text => {
    expect(tagged(text)).toBe(false);
  });
});

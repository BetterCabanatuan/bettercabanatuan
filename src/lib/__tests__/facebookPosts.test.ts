import { describe, expect, it } from 'vitest';
import {
  extractHeadline,
  extractSummary,
  matchTopics,
  normalizeText,
  postsToNewsItems,
  toManilaDate,
  type TopicRule,
} from '../facebookPosts';

const HEALTH: TopicRule[] = [
  {
    topic: 'health-services',
    include: /check-?up|bakuna|vaccin/i,
    exclude: /civil ?wedding/i,
  },
];

describe('normalizeText', () => {
  it('folds Facebook bold/sans-serif letters back to plain text', () => {
    expect(normalizeText('𝗟𝗜𝗕𝗥𝗘𝗡𝗚 𝐂𝐇𝐄𝐂𝐊-𝐔𝐏')).toBe('LIBRENG CHECK-UP');
  });
});

describe('extractHeadline', () => {
  it('skips a hashtag and date kicker line', () => {
    const text =
      '#TINGNAN | July 29, 2026\n\nTB Mass Screening sa Brgy. Bangad';
    expect(extractHeadline(text)).toBe('TB Mass Screening sa Brgy. Bangad');
  });

  it('keeps the headline half of a "headline | date" line', () => {
    expect(extractHeadline('WORLD RABIES DAY 2026 | SEPTEMBER 28, 2026')).toBe(
      'WORLD RABIES DAY 2026'
    );
  });

  it('drops weekday-range and generic kicker lines', () => {
    expect(
      extractHeadline(
        '#CityHealthOfficeCabanatuan | LUNES - BIYERNES\n\nLibreng Check-Up'
      )
    ).toBe('Libreng Check-Up');
    expect(extractHeadline('ANNOUNCEMENT\n\nMR SIA ngayong Agosto')).toBe(
      'MR SIA ngayong Agosto'
    );
  });

  it('skips dates with a weekday suffix, month-year dates and advisory kickers', () => {
    expect(
      extractHeadline(
        '#BawatBayanMakikinabang | AUGUST 2026\n\n10-KILONG BIGAS, IPINAMAMAHAGI'
      )
    ).toBe('10-KILONG BIGAS, IPINAMAMAHAGI');
    expect(
      extractHeadline(
        'AUGUST 06, 2026 | THURSDAY\n\n— CITY GOVERNMENT ADVISORY —\n\nSuspendido ang klase.'
      )
    ).toBe('Suspendido ang klase.');
  });

  it('keeps the date on a #WALANGPASOK notice so each one stays distinct', () => {
    expect(
      extractHeadline(
        '#WALANGPASOK | AUGUST 28, 2026 (FRIDAY)\n\nAlinsunod sa…'
      )
    ).toBe('Walang pasok — AUGUST 28, 2026');
    expect(
      extractHeadline(
        '#WALANGPASOK | August 10, 2026\nStay safe, Cabanatueños!\n\nBase sa…'
      )
    ).toBe('Walang pasok — August 10, 2026');
  });

  it('keeps what follows a BANTAY BAGYO label so bulletins stay distinct', () => {
    expect(
      extractHeadline(
        'BANTAY BAGYO | AUGUST 03, 2026\nTropical Depression #LuisPh'
      )
    ).toBe('Bantay Bagyo — AUGUST 03, 2026');
    expect(
      extractHeadline('BANTAY BAGYO | #IndayPH\nPatuloy na nakaalerto')
    ).toBe('Bantay Bagyo — IndayPH');
  });

  it('skips the PROGRAMA PARA SA CABANATUEÑO series banner and tagline', () => {
    expect(
      extractHeadline(
        'PROGRAMA PARA SA CABANATUEÑO\nTuloy-tuloy na serbisyo, para sa tuloy-tuloy na progreso.\n\nFUNERARIA DE CABANATUAN\n\nAng Funeraria…'
      )
    ).toBe('FUNERARIA DE CABANATUAN');
  });

  it('keeps leading digits and strips edge emoji', () => {
    expect(extractHeadline('10-KILONG BIGAS, IPINAMAMAHAGI')).toBe(
      '10-KILONG BIGAS, IPINAMAMAHAGI'
    );
    expect(extractHeadline('📣 MR SIA 2026 | CABANATUAN CITY UPDATE 💉')).toBe(
      'MR SIA 2026 — CABANATUAN CITY UPDATE'
    );
  });
});

describe('extractSummary', () => {
  it('joins schedule lines under the headline', () => {
    const text =
      'LIBRENG CHECK-UP PARA SA MGA BUNTIS\nMON-FRI, 8:00 AM TO 12:00 NN\nTTMF, Kapitan Pepe';
    expect(extractSummary(text)).toBe(
      'MON-FRI, 8:00 AM TO 12:00 NN · TTMF, Kapitan Pepe'
    );
  });

  it('continues past a line that introduces a list', () => {
    const text =
      'LIBRENG EYE CHECK-UP\n\nMay libreng pediatric eye screening para sa mga batang may problema sa paningin, kabilang ang:\n\n-Pagkaduling\n-Paglabanglag';
    expect(extractSummary(text)).toContain('-Pagkaduling');
  });

  it('skips hashtags, bare links and credit lines', () => {
    const text =
      'Headline here\n\nVideo Credits: CLTV36\n#Tag\nhttps://example.com\nThe real first sentence.';
    expect(extractSummary(text)).toBe('The real first sentence.');
  });
});

describe('matchTopics', () => {
  it('applies include and exclude patterns', () => {
    expect(matchTopics('Libreng check-up', HEALTH)).toEqual([
      'health-services',
    ]);
    expect(matchTopics('#CIVILWEDDING check-up', HEALTH)).toEqual([]);
    expect(matchTopics('Weather update', HEALTH)).toEqual([]);
  });
});

describe('toManilaDate', () => {
  it('uses the Manila calendar day, not UTC', () => {
    // 2026-07-01 17:30 UTC is already 2026-07-02 in Manila (UTC+8).
    expect(toManilaDate(Date.UTC(2026, 6, 1, 17, 30) / 1000)).toBe(
      '2026-07-02'
    );
  });
});

describe('postsToNewsItems', () => {
  const at = (day: number) => Date.UTC(2026, 7, day, 2) / 1000;

  it('keeps every post, newest first, collapsing reposted headlines', () => {
    const items = postsToNewsItems(
      [
        { id: '1', url: 'u1', creation_time: at(1), text: 'Libreng Check-Up' },
        { id: '2', url: 'u2', creation_time: at(5), text: 'Libreng Check-Up' },
        { id: '3', url: 'u3', creation_time: at(3), text: 'Bakuna drive' },
        { id: '4', url: 'u4', creation_time: at(4), text: 'Weather update' },
        { id: '2', url: 'u2', creation_time: at(5), text: 'Libreng Check-Up' },
      ],
      HEALTH,
      'City Government'
    );

    expect(items.map(i => i.sourceUrl)).toEqual(['u2', 'u4', 'u3']);
    expect(items[0]).toMatchObject({
      title: 'Libreng Check-Up',
      date: '2026-08-05',
      sourceName: 'City Government',
      topics: ['health-services'],
    });
    expect(items[0]).not.toHaveProperty('summary');
    // General news with no matching rule stays, untagged.
    expect(items[1]).toMatchObject({ title: 'Weather update', topics: [] });
  });

  it('drops a post with no caption', () => {
    const items = postsToNewsItems(
      [{ id: '1', url: 'u1', creation_time: at(1), text: null }],
      HEALTH,
      'City Government'
    );
    expect(items).toEqual([]);
  });

  it('drops a post the sync marked deleted', () => {
    const items = postsToNewsItems(
      [
        { id: '1', url: 'u1', creation_time: at(1), text: 'Bakuna drive' },
        {
          id: '2',
          url: 'u2',
          creation_time: at(2),
          text: 'Libreng Check-Up',
          deleted_at: '2026-08-03T00:00:00+00:00',
        },
      ],
      HEALTH,
      'City Government'
    );
    expect(items.map(i => i.sourceUrl)).toEqual(['u1']);
  });
});

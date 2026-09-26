import { describe, expect, it } from 'vitest';
import {
  publicOfficials,
  councilors,
  getCouncilors,
  getOfficialByBallotName,
  hasBallotNameDifference,
  ballotNames,
} from '../publicOfficials';
import { electionResultsData } from '../yamlLoader';

describe('councilor profiles (P3-3)', () => {
  it('gives every councilor a distinct description', () => {
    const descriptions = councilors.map(c => c.description);
    expect(new Set(descriptions).size).toBe(councilors.length);
  });

  it('gives every councilor a distinct bio', () => {
    const bios = councilors.map(c => c.bio);
    expect(new Set(bios).size).toBe(councilors.length);
  });

  it('reflects each councilor committee assignment in the bio', () => {
    councilors.forEach(councilor => {
      expect(councilor.committees?.length, councilor.name).toBeGreaterThan(0);
      const bio = councilor.bio ?? '';
      councilor.committees!.forEach(committee => {
        expect(bio, `${councilor.name} / ${committee}`).toContain(committee);
      });
    });
  });

  it('does not reuse the generic placeholder description', () => {
    const generic =
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.';
    councilors.forEach(councilor => {
      expect(councilor.description).not.toBe(generic);
    });
  });

  it('has ten councilors', () => {
    expect(councilors).toHaveLength(10);
    expect(getCouncilors()).toHaveLength(10);
  });

  it('keeps a contact channel for every official', () => {
    publicOfficials.forEach(official => {
      expect(
        official.contact?.email || official.contact?.phone,
        official.name
      ).toBeTruthy();
    });
  });

  it('only uses a real, verifiable office email', () => {
    publicOfficials.forEach(official => {
      if (official.contact?.email) {
        expect(official.contact.email, official.name).toMatch(
          /^[^@\s]+@[^@\s]+\.[^@\s]+$/
        );
      }
    });
  });
});

describe('ballot vs formal names (P3-3)', () => {
  it('records a ballot name for every official', () => {
    publicOfficials.forEach(official => {
      expect(official.ballotName, official.name).toBeTruthy();
    });
    expect(ballotNames).toHaveLength(publicOfficials.length);
  });

  it('maps every ballot name back to its official', () => {
    ballotNames.forEach(ballotName => {
      const official = getOfficialByBallotName(ballotName);
      expect(official, ballotName).toBeDefined();
    });
  });

  it('resolves the nicknamed Matias entry to the Matias profile', () => {
    const official = getOfficialByBallotName('KUYA ELLORIN MATIAS');
    expect(official?.id).toBe('councilor-jo-mario-matias');
    expect(official?.name).toBe('Jo-Mario Angelo E. Matias');
    expect(hasBallotNameDifference(official!)).toBe(true);
  });

  it('resolves other nicknamed entries', () => {
    expect(getOfficialByBallotName('BONG LIWAG')?.id).toBe(
      'councilor-emmanuel-liwag'
    );
    expect(getOfficialByBallotName('BOK VILLARUZ DIAZ')?.id).toBe(
      'councilor-aldwin-diaz'
    );
    expect(getOfficialByBallotName('PEEWEE MANAHAN MENDOZA')?.id).toBe(
      'councilor-oscar-mendoza'
    );
  });

  it('flags entries whose ballot name differs from the formal name', () => {
    const differing = publicOfficials.filter(hasBallotNameDifference);
    expect(differing.length).toBeGreaterThan(0);
    differing.forEach(official => {
      expect(official.ballotName).not.toBe(official.name.toUpperCase());
    });
  });

  it('agrees with the ballot names in election-results.yaml', () => {
    // Ballot names span every contest, not just the councilor race.
    const electionBallotNames = electionResultsData.contests
      .flatMap(contest => contest.candidates)
      .filter(c => c.won)
      .map(c => c.name);

    expect(electionBallotNames.length).toBeGreaterThanOrEqual(
      publicOfficials.length
    );

    electionBallotNames.forEach(ballotName => {
      expect(
        getOfficialByBallotName(ballotName),
        `${ballotName} has no profile`
      ).toBeDefined();
    });

    // No profile may claim a ballot name the election data does not have.
    ballotNames.forEach(ballotName => {
      expect(electionBallotNames, ballotName).toContain(ballotName);
    });
  });
});

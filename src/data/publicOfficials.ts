export interface PublicOfficial {
  id: string;
  name: string;
  position: string;
  term: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  description?: string;
  /**
   * Path to an official portrait. When absent, the card shows a neutral
   * placeholder that reads as a placeholder — we never substitute a photo of
   * someone who is not this person.
   */
  avatar?: string;
  contact?: {
    email?: string;
    phone?: string;
    office?: string;
  };
  committees?: string[];
  bio?: string;
  /**
   * Name exactly as printed on the COMELEC ballot, when it differs from the
   * formal name above. Filipino ballots commonly pair a nickname with the
   * surname, so residents should be able to match a ballot entry to a
   * profile. Sourced from `election-results.yaml`.
   */
  ballotName?: string;
}

export const publicOfficials: PublicOfficial[] = [
  {
    id: 'mayor-myca-vergara',
    name: 'Myca Elizabeth R. Vergara',
    firstName: 'Myca Elizabeth',
    middleName: 'R.',
    lastName: 'Vergara',
    position: 'City Mayor',
    term: '2025-2028',
    description:
      'Chief executive of Cabanatuan City, responsible for implementing local programs and policies.',
    committees: [
      'Executive Committee',
      'Disaster Risk Reduction',
      'Economic Development',
    ],
    bio: 'Mayor Myca Elizabeth R. Vergara serves as the chief executive official of Cabanatuan City, elected during the 2025 National and Local Elections.',
    ballotName: 'MYCA RAYMUNDO VERGARA',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      phone: '0919 081 3749',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'vice-mayor-joselito-roque',
    name: 'Joselito C. Roque',
    firstName: 'Joselito',
    middleName: 'C.',
    lastName: 'Roque',
    position: 'Vice Mayor',
    term: '2025-2028',
    description:
      'Presiding officer of the Sangguniang Panlungsod, assumes mayoral duties when the Mayor is absent.',
    committees: ['Legislative Committee', 'Peace and Order'],
    bio: 'Vice Mayor Joselito C. Roque presides over the Sangguniang Panlungsod and ensures legislative sessions run properly.',
    ballotName: 'BUNSO CARASIG ROQUE',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      phone: '044 960 1294',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-jo-mario-matias',
    name: 'Jo-Mario Angelo E. Matias',
    firstName: 'Jo-Mario Angelo',
    middleName: 'E.',
    lastName: 'Matias',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Education and Youth Affairs.',
    committees: ['Committee on Education', 'Committee on Youth Affairs'],
    bio: 'Councilor Matias sits on the Committee on Education and the Committee on Youth Affairs for the 2025-2028 term.',
    ballotName: 'KUYA ELLORIN MATIAS',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      phone: '044 960 1294',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-jean-yasmin-cruz',
    name: 'Jean Yasmin Cruz',
    firstName: 'Jean Yasmin',
    lastName: 'Cruz',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Women and Family and Social Services.',
    committees: [
      'Committee on Women and Family',
      'Committee on Social Services',
    ],
    bio: 'Councilor Cruz sits on the Committee on Women and Family and the Committee on Social Services for the 2025-2028 term.',
    ballotName: 'JEAN DE LEON CRUZ',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-jolly-garcia',
    name: 'Jolly Adriano Garcia',
    firstName: 'Jolly',
    middleName: 'Adriano',
    lastName: 'Garcia',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Infrastructure and Public Works.',
    committees: ['Committee on Infrastructure', 'Committee on Public Works'],
    bio: 'Councilor Garcia sits on the Committee on Infrastructure and the Committee on Public Works for the 2025-2028 term.',
    ballotName: 'JOLLY ADRIANO GARCIA',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-aldwin-diaz',
    name: 'Aldwin Joseph Diaz',
    firstName: 'Aldwin Joseph',
    lastName: 'Diaz',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Finance and Appropriations.',
    committees: ['Committee on Finance', 'Committee on Appropriations'],
    bio: 'Councilor Diaz sits on the Committee on Finance and the Committee on Appropriations for the 2025-2028 term.',
    ballotName: 'BOK VILLARUZ DIAZ',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-oscar-mendoza',
    name: 'Oscar Mendoza',
    firstName: 'Oscar',
    lastName: 'Mendoza',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Health and Sanitation.',
    committees: ['Committee on Health', 'Committee on Sanitation'],
    bio: 'Councilor Mendoza sits on the Committee on Health and the Committee on Sanitation for the 2025-2028 term.',
    ballotName: 'PEEWEE MANAHAN MENDOZA',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-jojo-valino',
    name: 'Jojo Valino',
    firstName: 'Jojo',
    lastName: 'Valino',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Agriculture and Environment.',
    committees: ['Committee on Agriculture', 'Committee on Environment'],
    bio: 'Councilor Valino sits on the Committee on Agriculture and the Committee on Environment for the 2025-2028 term.',
    ballotName: 'FROYJAYJAY BUMANLAG VALINO',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-epifanio-posada',
    name: 'Epifanio Posada',
    firstName: 'Epifanio',
    lastName: 'Posada',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Trade and Commerce.',
    committees: ['Committee on Trade', 'Committee on Commerce'],
    bio: 'Councilor Posada sits on the Committee on Trade and the Committee on Commerce for the 2025-2028 term.',
    ballotName: 'FANNY GALICIA POSADA',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-medel-seeping',
    name: 'Medel Seeping',
    firstName: 'Medel',
    lastName: 'Seeping',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Transportation and Traffic.',
    committees: ['Committee on Transportation', 'Committee on Traffic'],
    bio: 'Councilor Seeping sits on the Committee on Transportation and the Committee on Traffic for the 2025-2028 term.',
    ballotName: 'MEDEL RAYMUNDO SEEPING',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-christian-cecilio',
    name: 'Christian Jan Cecilio',
    firstName: 'Christian Jan',
    lastName: 'Cecilio',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Sports and Culture.',
    committees: ['Committee on Sports', 'Committee on Culture'],
    bio: 'Councilor Cecilio sits on the Committee on Sports and the Committee on Culture for the 2025-2028 term.',
    ballotName: 'JAN-JAN JAN CECILIO',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-emmanuel-liwag',
    name: 'Emmanuel Liwag',
    firstName: 'Emmanuel',
    lastName: 'Liwag',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'City councilor sitting on the committees on Public Safety and Disaster Preparedness.',
    committees: [
      'Committee on Public Safety',
      'Committee on Disaster Preparedness',
    ],
    bio: 'Councilor Liwag sits on the Committee on Public Safety and the Committee on Disaster Preparedness for the 2025-2028 term.',
    ballotName: 'BONG LIWAG',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
];

export function getOfficialById(id: string): PublicOfficial | undefined {
  return publicOfficials.find(o => o.id === id);
}

export function getOfficialsByPosition(position: string): PublicOfficial[] {
  return publicOfficials.filter(o => o.position === position);
}

export function getCouncilors(): PublicOfficial[] {
  return publicOfficials.filter(o =>
    o.position.includes('Sangguniang Panlungsod')
  );
}

export function getExecutiveOfficials(): PublicOfficial[] {
  return publicOfficials.filter(
    o => o.position === 'City Mayor' || o.position === 'Vice Mayor'
  );
}

/** True when the ballot name differs from the formal name on the profile. */
export function hasBallotNameDifference(official: PublicOfficial): boolean {
  return Boolean(
    official.ballotName && official.ballotName !== official.name.toUpperCase()
  );
}

/**
 * Finds the official a COMELEC ballot entry refers to.
 *
 * Ballot entries pair a nickname with the surname (e.g. "KUYA ELLORIN
 * MATIAS" for Jo-Mario Angelo E. Matias), so matching is done on the last
 * name, which is the one part that stays stable between the two.
 */
export function getOfficialByBallotName(
  ballotName: string
): PublicOfficial | undefined {
  const normalize = (value: string) =>
    value
      .toUpperCase()
      .replace(/[^A-Z ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const target = normalize(ballotName);
  return publicOfficials.find(
    official => official.ballotName && normalize(official.ballotName) === target
  );
}

/** Every ballot name recorded in `election-results.yaml`, for cross-checking. */
export const ballotNames = publicOfficials
  .map(o => o.ballotName)
  .filter((name): name is string => Boolean(name));

export const mayor = publicOfficials.find(o => o.position === 'City Mayor');
export const viceMayor = publicOfficials.find(o => o.position === 'Vice Mayor');
export const councilors = getCouncilors();
export const totalOfficials = publicOfficials.length;

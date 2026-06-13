export interface PublicOfficial {
  id: string;
  name: string;
  position: string;
  term: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  description?: string;
  avatar?: string;
  contact?: {
    email?: string;
    phone?: string;
    office?: string;
  };
  committees?: string[];
  bio?: string;
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Education', 'Committee on Youth Affairs'],
    bio: 'Councilor Matias is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: [
      'Committee on Women and Family',
      'Committee on Social Services',
    ],
    bio: 'Councilor Cruz is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
    contact: {
      email: 'cabanatuan.lgu@gmail.com',
      office:
        'City Government Bldg., Phase 2, Kapitan Pepe Subd., Cabanatuan City',
    },
  },
  {
    id: 'councilor-marius-garcia',
    name: 'Marius Garcia',
    firstName: 'Marius',
    lastName: 'Garcia',
    position: 'Sangguniang Panlungsod Member (City Councilor)',
    term: '2025-2028',
    description:
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Infrastructure', 'Committee on Public Works'],
    bio: 'Councilor Garcia is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Finance', 'Committee on Appropriations'],
    bio: 'Councilor Diaz is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Health', 'Committee on Sanitation'],
    bio: 'Councilor Mendoza is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Agriculture', 'Committee on Environment'],
    bio: 'Councilor Valino is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Trade', 'Committee on Commerce'],
    bio: 'Councilor Posada is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Transportation', 'Committee on Traffic'],
    bio: 'Councilor Seeping is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: ['Committee on Sports', 'Committee on Culture'],
    bio: 'Councilor Cecilio is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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
      'Elected city councilor responsible for creating local ordinances and overseeing city policies.',
    committees: [
      'Committee on Public Safety',
      'Committee on Disaster Preparedness',
    ],
    bio: 'Councilor Liwag is a member of the Sangguniang Panlungsod for the 2025-2028 term.',
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

export const mayor = publicOfficials.find(o => o.position === 'City Mayor');
export const viceMayor = publicOfficials.find(o => o.position === 'Vice Mayor');
export const councilors = getCouncilors();
export const totalOfficials = publicOfficials.length;

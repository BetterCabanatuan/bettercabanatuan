import type { TopicRule } from '../facebookPosts.ts';

/**
 * Environment: City ENRO and DENR/EMB programs, environmental awards and
 * ordinances, tree planting, river and community clean-up drives, clean air,
 * climate change, plastics, and ecological solid waste (RA 9003) work that
 * residents look for under environmental protection and conservation.
 */
const rule: TopicRule = {
  topic: 'environment',
  include:
    /environmental|environment (and|&) natural resources|\b[CP]?ENRO\b|\bDENR\b|\bEMB\b|kalikasan|(pangangalaga|proteksyon|pagprotekta|pagmamahal)\w* (sa|ng) kapaligiran|tree[- ]?(planting|growing)|pagtatanim ng (mga )?puno|punong?[- ]?kahoy|mangrove|bakawan|reforest|clean[- ]?up drive|(river|coastal|creek|estero|ilog) clean[- ]?up|clean[- ]?up (of|sa|ng) (the )?(river|creek|ilog|sapa|estero)|paglilinis ng (ilog|sapa|estero)|clean (and|&) green|cleaner,? greener|clean[!,.]? ?clean[!,.]? ?clean|air quality|clean air|smoke[- ]belching|open burning|climate change|biodiversity|single[- ]use plastic|plastic ban|ecological solid waste|R\.?A\.? ?(No\.? ?)?9003|materials recovery facility|circular economy|earth (day|hour)|arbor day|wildlife|watershed/i,
  // Posts that mention nature or the environment in passing.
  exclude:
    /nutrition month|nutrisyon|digital environment|flag raising|weather update|bantay bagyo|rapid (water level )?monitoring|hiring|weekly news recap/i,
};

export default rule;

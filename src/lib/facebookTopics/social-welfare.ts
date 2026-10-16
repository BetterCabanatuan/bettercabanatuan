import type { TopicRule } from '../facebookPosts.ts';

/**
 * Social Welfare: CSWDO and DSWD programs (4Ps, social pension, UPLIFT and
 * livelihood payouts), senior citizen, PWD and solo parent services, child
 * protection (BCPC), rice aid (Benteng Bigas, 10-kilo rice distribution),
 * evacuation center aid, and the free Funeraria de Cabanatuan.
 */
const rule: TopicRule = {
  topic: 'social-welfare',
  include:
    /social welfare|\bC?SWDO?\b|\bDSWD\b|\b4Ps\b|pantawid|social pension|indigent (?:senior|famil)|UPLIFT\)? program|unified package for livelihood|livelihood assistance|social protection|senior citizens?'? (?:federation|association|ID\b|affairs)|\bOSCA\b|\bPWD (?:federation|ID\b|affairs|registration)|\bPDAO\b|solo parents?'? (?:ID\b|office|association|federation|welfare)|\bBCPC\b|protecting childhood|neurodivergent|funeraria|benteng bigas|10[- ]?(?:kilong|kilogramong|kg) (?:free )?(?:bigas|rice)|rice assistance/i,
  // Roundups, and posts that name a welfare office or sector in passing.
  exclude:
    /weekly news recap|rice processing complex|civil ?wedding|kasalang|walang ?pasok|suspension of (?:face-to-face )?classes|house bill/i,
};

export default rule;

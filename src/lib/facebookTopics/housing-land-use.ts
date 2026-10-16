import type { TopicRule } from '../facebookPosts.ts';

/**
 * Housing & Land Use: socialized housing (pabahay, NHA, SHFC, 4PH,
 * homeowners associations), land title awarding, relocation and
 * resettlement of informal settlers, zoning and land use plans, and
 * building or occupancy permits.
 */
const rule: TopicRule = {
  topic: 'housing-land-use',
  include:
    /pabahay|\bhousing\b|\bHOA\b|homeowners'? ?association|title awarding|land titl|titulo ng lupa|pamamahagi ng titulo|\bCLOA\b|community mortgage|\bNHA\b|\bSHFC\b|\bDHSUD\b|\b4PH\b|relocation (site|area|program)|resettlement|informal settler|\bISFs?\b|zoning|land use|\bCLUP\b|building permit|occupancy permit|certificate of occupancy|building official/i,
  // Posts that mention a housing word in passing.
  exclude:
    /civil ?wedding|kasalang|weekly news recap|hiring|job fair|weather update|bantay bagyo|house bill/i,
};

export default rule;

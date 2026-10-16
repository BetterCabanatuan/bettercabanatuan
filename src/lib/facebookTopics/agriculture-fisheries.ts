import type { TopicRule } from '../facebookPosts.ts';

/**
 * Agriculture & Fisheries: farmer and fisherfolk programs, the Cabanatuan
 * Agriculture and Fisheries Council (CAFC), palay buying and milling (Rice
 * Processing Complex, NFA), DA grants to farm cooperatives, seeds, fertilizer,
 * and the Agricultural and Biosystems Engineering unit's machinery support.
 * Rice handouts are Social Welfare and pet care is City Vet (Health), so both
 * stay out even though their captions name farmers or animals.
 */
const rule: TopicRule = {
  topic: 'agriculture-fisheries',
  include:
    /agricultur|agrikultura|\bCAFC\b|magsasaka|mangingisda|pangingisda|pangisdaan|fisherfolk|fisheries|\bfarmers?\b|\bpalay\b|rice processing|national food authority|\bNFA\b|biosystems|PhilMech|kadiwa|binhi|abono|fertili[sz]er|seedling|livestock/i,
  // Rice aid lists farmers among beneficiaries; recaps and flag raisings
  // mention a farm event in passing.
  exclude:
    /benteng bigas|10-kilong bigas|#BawatBayanMakikinabang|rice assistance|city ?vet|kapon|anti-rabies|weekly news recap|flag raising|nutrition month/i,
};

export default rule;

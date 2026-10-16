import type { TopicRule } from '../facebookPosts.ts';

/**
 * Health Services: City Health Office, M.V. Gallego hospital, vaccination
 * drives, free check-ups, PhilHealth, and City Vet (spay/neuter, pet
 * anti-rabies), which residents look for under health.
 */
const rule: TopicRule = {
  topic: 'health-services',
  include:
    /city health|health cent|health office|\bCHO\b|M\.?V\.? ?Gallego|MVGCCGH|city hospital|check-?up|konsulta|consultation|bakuna|vaccin|immuni[sz]|measles|tigdas|rubella|\bHPV\b|vitamin a\b|tuberculosis|\bTB\b|chest x-ray|philhealth|YAKAP|family planning|ligation|vasectomy|pre-marriage|\bPMOC\b|mental health|psycholog|CogniCare|rabies|nutrition|dental|wellness clinic|health board|health talk|ophthalm|pediatric|buntis|pre-?natal|city ?vet|veterinar|kapon|spay|neuter|deworm/i,
  // Posts that mention a health word in passing.
  exclude:
    /civil ?wedding|kasalang|weather update|bantay bagyo|memorandum circular|rapid monitoring|hiring|bigas|weekly news recap|parole|house bill/i,
};

export default rule;

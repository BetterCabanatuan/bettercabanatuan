import type { TopicRule } from '../facebookPosts.ts';

/**
 * Education: class suspensions (#WalangPasok, also tagged Disaster
 * Preparedness), schools the city built, DepEd and ALS activities, the ARAL
 * program, NEUST partnerships, scholarships, daycare enrollment, and
 * school-based programs such as Bakuna Eskwela, which parents look for under
 * education.
 */
const rule: TopicRule = {
  topic: 'education',
  include:
    /walang ?pasok|(?:suspen\w*|sinuspinde)[^\n]{0,80}(?:klase|class)|(?:klase|class)[^\n]{0,40}suspen|face-to-face classes|alternative (?:learning|delivery) mode|paaralan|karapatang matuto|classroom|silid-aralan|\blearners?\b|\bALS\b|alternative learning system|ARAL program|academic recovery and accessible learning|\bDepEd\b|\bNEUST\b|buwan ng wika|bakuna eskwela|brigada eskwela|balik[- ]?eskwela|back[- ]to[- ]school|school supplies|scholar|iskolar|\bCCSP\b|day ?care|child development cent|enrol(?:l)?ment|\b(?:teachers?|guro)\b/i,
  // Posts that mention a school in passing: schools used as evacuation
  // centers, the CSWDO seminar for parents of neurodivergent children, job
  // ads from colleges, and the weekly recap digest.
  exclude: /evacuation|neurodivergent|hiring|weekly news recap/i,
};

export default rule;

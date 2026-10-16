import type { TopicRule } from '../facebookPosts.ts';

/**
 * Infrastructure & Public Works: roads and bridges (closures, repairs),
 * drainage and manhole covers, waterway excavation and flood control, heavy
 * equipment on clearing duty, city-built schools and facilities, water
 * supply, and public markets, which residents look for under public works.
 */
const rule: TopicRule = {
  topic: 'infrastructure-public-works',
  include:
    /\bbridge (closure|repair)|\btulay\b|road approach|road (works?|repair|widening|concreting|closure|rehabilitation)|kalsada|asphalt|aspalto|concreting|drainage|manhole|excavat|waterway|declogging|desilting|flood control|heavy equipment|city engineer|\bDPWH\b|public works|street ?lights?\b|ipinatayo|nagpapatayo|classroom building|groundbreaking|inaugurat|processing complex|water (supply|service interruption|interruption)|water district|public market|pampublikong pamilihan/i,
  // Posts that mention a public-works word in passing: river-level checks
  // and weather alerts (Disaster Preparedness), store openings, art events.
  exclude:
    /rapid (water level )?monitoring|water level|bantay bagyo|rainfall warning|weather update|museums and galleries|bagong branch|walang pasok|memorandum circular|weekly news recap|hiring/i,
};

export default rule;

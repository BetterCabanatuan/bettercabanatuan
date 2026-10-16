import type { TopicRule } from '../facebookPosts.ts';

/**
 * Garbage and Waste Disposal: garbage collection schedules, segregation
 * (nabubulok / di-nabubulok), MRFs, landfill and dumpsite news, solid waste
 * ordinances (RA 9003, plastic bans, anti-littering), clean-up drives, and the
 * city's Clean! Clean! Clean! cleanliness awards, which residents look for
 * under garbage and waste.
 */
const rule: TopicRule = {
  topic: 'garbage-waste-disposal',
  include:
    /garbage|basura|\btrash\b|solid waste|waste (management|disposal|collection|segregation|workers?)|(hazardous|residual|biodegradable|household|medical|electronic) wastes?|\be-?waste\b|segregat|\bMRF\b|materials? recovery|landfill|dump ?site|open dump|compost|nabubulok|biodegradable|recycl|single-?use plastic|plastic (bag )?ban|\blitter(ing|ers?)?\b|RA ?(No\.? ?)?9003|Republic Act (No\.? ?)?9003|clean! clean! clean!|clean-?up drive/i,
  // Posts that mention waste in passing (nutrition tips, storm advisories,
  // daily weather, office-hosted ceremonies, job ads).
  exclude:
    /nutrition|nutrisyon|bantay bagyo|weather update|good morning, cabanatuan|flag raising|hiring/i,
};

export default rule;

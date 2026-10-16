import type { TopicRule } from '../facebookPosts.ts';

/**
 * Disaster Preparedness: typhoon bulletins (Bantay Bagyo), rainfall warnings,
 * river water-level monitoring, class and work suspensions for bad weather,
 * evacuation centers, flood drills and flood-control work, and CDRRMO/CDRRMC
 * activities such as Disaster Resilience Month and pre-disaster risk
 * assessments.
 */
const rule: TopicRule = {
  topic: 'disaster-preparedness',
  // No bare "CDRRMC"/"DRRM": the CDRRMC Training Center is the city's usual
  // venue for job fairs, payouts, and seminars.
  include:
    /bantay bagyo|\bbagyo(?:ng)?\b|typhoon|tropical (?:depression|storm|cyclone)|rainfall warning|habagat|southwest monsoon|water level|rapid monitoring|walang ?pasok|(?:suspen\w*|sinuspinde)(?: of| ang)? face-to-face|pagtugon sa sakuna|evacuat|inilikas|flood|pagbaha|disaster|soil erosion|landslide|lindol|earthquake/i,
  // SM's own notice to its customers during the monsoon. (Not "SM City
  // Cabanatuan" alone: the CDRRMC holds awareness events there.)
  exclude: /SM Megacenter|ating mga customer/i,
};

export default rule;

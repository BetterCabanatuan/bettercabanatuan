import type { TopicRule } from '../facebookPosts.ts';

/**
 * Business and Livelihood: City Treasurer's business-tax deadlines, business
 * permits (BPLO), BIR, PESO job fairs and recruitment, DTI/MSME programs, and
 * livelihood assistance, which residents look for under business.
 */
const rule: TopicRule = {
  topic: 'business',
  include:
    /city treasurer|business tax|may negosyo|pagnenegosyo|negosyante|business permit|mayor'?s permit|\bBPLO\b|business one ?stop|\bBIR\b|bureau of internal revenue|revenue district|\bPESO\b|public employment service|job ?fair|trabaho agad|recruitment activit|\bDTI\b|department of trade|\bMSMEs?\b|livelihood assistance|livelihood training|\bTESDA\b/i,
  // Private shops and malls, and cash aid or farm grants that other topics own.
  exclude:
    /\bUPLIFT\b|pay-?out|kadiwa|fisheries council|agricultur\w* cooperative|bagong branch|\bSM City\b|eternal plans/i,
};

export default rule;

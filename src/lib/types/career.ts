export interface SkillRelevance {
  conceptSlug: string;
  jobRelevance: string;
  companies: string[];
  importance: 'essential' | 'important' | 'nice-to-have';
}

export interface PortfolioProof {
  projectId: string;
  hiringSignals: string[];
  description: string;
}

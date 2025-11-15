// Type declarations for Canon 7.7 Revision A

export interface CanonPillar {
  stem: string;
  branch: string;
}

export interface CanonPillars {
  year: CanonPillar;
  month: CanonPillar;
  day: CanonPillar;
  hour: CanonPillar;
}

export interface CanonResult {
  json: {
    version: string;
    case: {
      id: string;
      labels: string[];
      dayMaster: string;
      fourPillars: {
        year: string;
        month: string;
        day: string;
        hour: string;
      };
      notes: string;
    };
    elements: {
      wood: { count: number; strength: string; polarity: { yang: number; yin: number } };
      fire: { count: number; strength: string; polarity: { yang: number; yin: number } };
      earth: { count: number; strength: string; polarity: { yang: number; yin: number } };
      metal: { count: number; strength: string; polarity: { yang: number; yin: number } };
      water: { count: number; strength: string; polarity: { yang: number; yin: number } };
    };
    polaritySummary: {
      yang: number;
      yin: number;
      ratio: string;
    };
    constitution: {
      type: string;
      polarity: string;
      flow: string[];
      sibling: string;
      opposite: string;
    };
    respiratoryType: string;
    scoring: {
      fiveElement: number;
      dominantConsistency: number;
      polarityGate: number;
      organFlow: number;
      pairCoherence: number;
      distributionBalance: number;
      totalStructuralConfidence: number;
    };
    audit: {
      polarityValidation: boolean;
      elementalCoherence: boolean;
      canonicalFlowIntegrity: boolean;
    };
    tables: {
      elementMatrix: any[];
      verticalTotals: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
        stemsTotal: number;
      };
    };
    stationStrengths: Array<{
      station: number;
      organ: string;
      element: string;
      count: number;
      strength: string;
      sources: Array<{
        slot: string;
        stem: string;
        visibility: string;
      }>;
    }>;
  };
  markdown: string;
}

export function analyzeCanon77(pillars: CanonPillars): CanonResult;

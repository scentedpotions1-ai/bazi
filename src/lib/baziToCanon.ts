// Adapter: BaziResult → Canon 7.7 Pillars format

import { BaziResult } from '../core/bazi';

export interface CanonPillars {
  year: { stem: string; branch: string };
  month: { stem: string; branch: string };
  day: { stem: string; branch: string };
  hour: { stem: string; branch: string };
}

export function baziToCanonPillars(baziResult: BaziResult): CanonPillars {
  return {
    year: {
      stem: baziResult.chart.year.stem.chinese,
      branch: baziResult.chart.year.branch.chinese
    },
    month: {
      stem: baziResult.chart.month.stem.chinese,
      branch: baziResult.chart.month.branch.chinese
    },
    day: {
      stem: baziResult.chart.day.stem.chinese,
      branch: baziResult.chart.day.branch.chinese
    },
    hour: {
      stem: baziResult.chart.hour.stem.chinese,
      branch: baziResult.chart.hour.branch.chinese
    }
  };
}

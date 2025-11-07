/**
 * BaZi to Canon Converter
 * Converts BaziResult format to Canon Pillars format
 */

import { BaziResult } from '../core/bazi';
import { Pillars } from '../../ecm/canon77_revA';

/**
 * Convert BaZi chart format to Canon pillars format
 * BaZi uses: { stem: { chinese, english, element }, branch: { chinese, english, element, animal } }
 * Canon needs: { stem: string, branch: string } (just the Chinese characters)
 */
export function baziToCanonPillars(baziResult: BaziResult): Pillars {
  const { chart } = baziResult;

  return {
    year: {
      stem: chart.year.stem.chinese,
      branch: chart.year.branch.chinese
    },
    month: {
      stem: chart.month.stem.chinese,
      branch: chart.month.branch.chinese
    },
    day: {
      stem: chart.day.stem.chinese,
      branch: chart.day.branch.chinese
    },
    hour: {
      stem: chart.hour.stem.chinese,
      branch: chart.hour.branch.chinese
    }
  };
}

import { BaziResult } from '../core/bazi';
import { ECMChart } from './ecmType';

/**
 * Transform BaZi result into ECM chart format
 * Pure passthrough - just restructures the data, ECM does all interpretation
 */
export function transformBaziToECM(baziResult: BaziResult): ECMChart {
  const { chart } = baziResult;
  
  // Pass pillar data directly - ECM will extract element and polarity
  const stems = [
    {
      element: chart.hour.stem.element,    // e.g., "Yin Wood"
      pillar: 'hour',
      character: chart.hour.stem.chinese,
      english: chart.hour.stem.english
    },
    {
      element: chart.day.stem.element,
      pillar: 'day',
      character: chart.day.stem.chinese,
      english: chart.day.stem.english
    },
    {
      element: chart.month.stem.element,
      pillar: 'month',
      character: chart.month.stem.chinese,
      english: chart.month.stem.english
    },
    {
      element: chart.year.stem.element,
      pillar: 'year',
      character: chart.year.stem.chinese,
      english: chart.year.stem.english
    }
  ];

  const branches = [
    {
      element: chart.hour.branch.element,    // e.g., "Yin Fire"
      pillar: 'hour',
      character: chart.hour.branch.chinese,
      english: chart.hour.branch.english,
      animal: chart.hour.branch.animal
    },
    {
      element: chart.day.branch.element,
      pillar: 'day',
      character: chart.day.branch.chinese,
      english: chart.day.branch.english,
      animal: chart.day.branch.animal
    },
    {
      element: chart.month.branch.element,
      pillar: 'month',
      character: chart.month.branch.chinese,
      english: chart.month.branch.english,
      animal: chart.month.branch.animal
    },
    {
      element: chart.year.branch.element,
      pillar: 'year',
      character: chart.year.branch.chinese,
      english: chart.year.branch.english,
      animal: chart.year.branch.animal
    }
  ];

  return { stems, branches };
}

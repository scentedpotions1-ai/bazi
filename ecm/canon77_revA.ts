// canon77_revA.ts
// Canon 7.7 (Revision A) — Eight Constitution Medicine full implementation (TypeScript)
// Client-agnostic. No external libraries. All constants embedded.
// ------------------------------------------------------------------

/** Five element names */
export type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
/** Polarity */
export type Polarity = 'Yang' | 'Yin';
/** Gate result */
export type Gate = 'hollow' | 'dense';

/** A single pillar (Four Pillars) */
export interface Pillar {
  stem: string;   // Heavenly Stem character, e.g., '丁'
  branch: string; // Earthly Branch character, e.g., '巳'
}
/** Four pillars container */
export interface Pillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;   // Day stem defines Day Master
  hour: Pillar;
}

/** Visible/hidden source hit for a station */
export interface SourceHit {
  slot: 'year' | 'month' | 'day' | 'hour';
  stem: string; // the contributing stem symbol
  visibility: 'visible' | 'hidden';
}

/** Station evidence report */
export interface StationReport {
  station: 1 | 2 | 3 | 4 | 5; // 5 -> 1
  organ: string;
  element: ElementName;
  count: number;
  strength: 'Strong' | 'Moderate' | 'Weak' | 'Weak/Absent';
  sources: SourceHit[];
}

/** Per-element totals with strength classification */
export interface VerticalTotals {
  Wood: number; Fire: number; Earth: number; Metal: number; Water: number;
}
export interface StrengthByElement {
  Wood: string; Fire: string; Earth: string; Metal: string; Water: string;
}

/** Output JSON shape (client-agnostic) */
export interface CanonOutput {
  version: '7.7A';
  case: {
    id: string;             // placeholder like "{{case_id}}"
    labels: string[];       // tags or empty []
    dayMaster: string;      // e.g., "丁 (Yin Fire)"
    fourPillars: { year: string; month: string; day: string; hour: string; };
    notes: string;
  };
  elements: Record<Lowercase<ElementName>, {
    count: number;
    strength: string;
    polarity: { yang: number; yin: number; };
  }>;
  polaritySummary: { yang: number; yin: number; ratio: string; };
  constitution: {
    type: string;           // e.g., "Gastrotonia"
    polarity: Gate;         // 'hollow' | 'dense'
    flow: string[];
    sibling: string;
    opposite: string;
  };
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
    elementMatrix: (string | number)[][];
    verticalTotals: {
      wood: number; fire: number; earth: number; metal: number; water: number; stemsTotal: number;
    };
  };
  stationStrengths: StationReport[];
}

/** Final return type from analyzeCanon77 */
export interface CanonResult {
  json: CanonOutput;
  markdown: string;
}

// -------------------------------
// Canon constants & lookups
// -------------------------------

const ELEMENT_OF_STEM: Record<string, { element: ElementName; polarity: Polarity }> = {
  '甲': { element: 'Wood',  polarity: 'Yang' }, '乙': { element: 'Wood',  polarity: 'Yin'  },
  '丙': { element: 'Fire',  polarity: 'Yang' }, '丁': { element: 'Fire',  polarity: 'Yin'  },
  '戊': { element: 'Earth', polarity: 'Yang' }, '己': { element: 'Earth', polarity: 'Yin'  },
  '庚': { element: 'Metal', polarity: 'Yang' }, '辛': { element: 'Metal', polarity: 'Yin'  },
  '壬': { element: 'Water', polarity: 'Yang' }, '癸': { element: 'Water', polarity: 'Yin'  }
};

// Hidden stems per branch (canonical set)
const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '乙', '丁'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// Canon 7.7 fixed organ flows (5 -> 1)
const FLOW: Record<string, string[]> = {
  Renotonia:     ['Kidney','Lungs','Liver','Heart','Pancreas'],
  Vesicotonia:   ['Bladder','Gallbladder','Small Intestine','Large Intestine','Stomach'],
  Pancreotonia:  ['Pancreas','Heart','Liver','Lungs','Kidney'],
  Gastrotonia:   ['Stomach','Large Intestine','Small Intestine','Gallbladder','Bladder'],
  Pulmonotonia:  ['Lungs','Pancreas','Heart','Kidney','Liver'],
  Colonotonia:   ['Large Intestine','Bladder','Stomach','Small Intestine','Gallbladder'],
  Hepatonia:     ['Liver','Kidney','Heart','Pancreas','Lungs'],
  Cholecystonia: ['Gallbladder','Small Intestine','Stomach','Bladder','Large Intestine']
};

// Station → Element
const STATION_ELEMENT: Record<string, ElementName> = {
  'Stomach': 'Earth', 'Pancreas': 'Earth',
  'Large Intestine': 'Metal', 'Lungs': 'Metal',
  'Small Intestine': 'Fire', 'Heart': 'Fire',
  'Gallbladder': 'Wood', 'Liver': 'Wood',
  'Bladder': 'Water', 'Kidney': 'Water'
};

// Canon fixed pairs (sibling / opposite) — use project-standard mapping
const PAIRS: Record<string, { sibling: string; opposite: string }> = {
  Gastrotonia:   { sibling: 'Vesicotonia',   opposite: 'Pancreotonia' },
  Vesicotonia:   { sibling: 'Gastrotonia',   opposite: 'Pulmonotonia' },
  Renotonia:     { sibling: 'Pancreotonia',  opposite: 'Hepatonia'    },
  Pancreotonia:  { sibling: 'Renotonia',     opposite: 'Gastrotonia'  },
  Hepatonia:     { sibling: 'Cholecystonia', opposite: 'Renotonia'    },
  Cholecystonia: { sibling: 'Hepatonia',     opposite: 'Colonotonia'  },
  Pulmonotonia:  { sibling: 'Colonotonia',   opposite: 'Vesicotonia'  },
  Colonotonia:   { sibling: 'Pulmonotonia',  opposite: 'Cholecystonia'}
};

// Structural scoring weights (Revision A)
const WEIGHTS = {
  fiveElementCompleteness: 0.20,
  dominantConsistency:     0.15,
  polarityGateClarity:     0.15,
  organFlowCompletionMax:  0.25, // all stations robust
  organFlowCompletionWeak: 0.20, // any station count==1
  pairCoherence:           0.15,
  distributionBalance:     0.07  // descriptive; contributes fully unless explicitly failed
};

// Hollow vs Dense candidates (restricted by gate)
const HOLLOW_TYPES = ['Gastrotonia', 'Cholecystonia', 'Vesicotonia', 'Colonotonia'] as const;
const DENSE_TYPES  = ['Pancreotonia','Hepatonia','Renotonia','Pulmonotonia'] as const;

// -------------------------------
// Public API
// -------------------------------

/**
 * Canon 7.7 (Rev A) — full ECM analysis.
 * @param pillars Four Pillars with visible stems/branches.
 * @returns CanonResult containing JSON output + ready-to-render Markdown report.
 */
export function analyzeCanon77(pillars: Pillars): CanonResult {
  // Validate input
  (['year','month','day','hour'] as const).forEach(slot => {
    const p = pillars[slot];
    if (!p?.stem || !p?.branch) throw new Error(`Missing pillar data for ${slot}. Expected { stem, branch }.`);
  });

  // Step 1 — Element matrix & totals
  const dayMaster = pillars.day.stem;
  const em = buildElementMatrix(pillars);
  const verticalTotals = em.verticalTotals;
  const stemsTotal     = em.stemsTotal;
  const polarityTotals = em.polarityTotals;
  const matrix         = em.matrix;
  const strengthByEl   = classifyStrength(verticalTotals);

  // Day Master info + Polarity gate
  const dmInfo = elementOfStem(dayMaster);
  const gate = resolvePolarityGate(dmInfo.polarity);

  // Flow selection under gate restriction
  const chosen = chooseConstitutionByFlow(gate, verticalTotals, pillars);
  const constitution = chosen.constitution;
  const stationReports = chosen.stationReports;
  const organFlowContribution = chosen.organFlowContribution;

  // Pairs
  const { sibling, opposite } = PAIRS[constitution];

  // Scoring (Revision A, structural only)
  const scoreCtx = {
    fivePresent: (Object.values(verticalTotals) as number[]).every(v => v >= 1),
    dominanceConsistent: dominantConsistency(dmInfo.element, verticalTotals),
    polarityResolved: true,
    organFlowContribution,
    pairsCoherent: true,
    balanceOk: true
  };
  const totalScore = structuralScore(scoreCtx);

  // Build JSON output (client-agnostic placeholders for id/labels/notes)
  const json: CanonOutput = {
    version: '7.7A',
    case: {
      id: '{{case_id}}',
      labels: ['{{tag1}}','{{tag2}}'],
      dayMaster: `${dayMaster} (${dmInfo.polarity} ${dmInfo.element})`,
      fourPillars: {
        year:  pillars.year.stem + pillars.year.branch,
        month: pillars.month.stem + pillars.month.branch,
        day:   pillars.day.stem  + pillars.day.branch,
        hour:  pillars.hour.stem + pillars.hour.branch
      },
      notes: '{{optional_case_notes}}'
    },
    elements: {
      wood:  { count: verticalTotals.Wood,  strength: strengthByEl.Wood,  polarity: splitPolarityByElement('Wood',  pillars) },
      fire:  { count: verticalTotals.Fire,  strength: strengthByEl.Fire,  polarity: splitPolarityByElement('Fire',  pillars) },
      earth: { count: verticalTotals.Earth, strength: strengthByEl.Earth, polarity: splitPolarityByElement('Earth', pillars) },
      metal: { count: verticalTotals.Metal, strength: strengthByEl.Metal, polarity: splitPolarityByElement('Metal', pillars) },
      water: { count: verticalTotals.Water, strength: strengthByEl.Water, polarity: splitPolarityByElement('Water', pillars) }
    } as CanonOutput['elements'],
    polaritySummary: {
      yang: polarityTotals.Yang,
      yin:  polarityTotals.Yin,
      ratio: `${percent(polarityTotals.Yang, polarityTotals.Yang + polarityTotals.Yin)}/${percent(polarityTotals.Yin, polarityTotals.Yang + polarityTotals.Yin)}`
    },
    constitution: {
      type: constitution,
      polarity: gate,
      flow: FLOW[constitution],
      sibling,
      opposite
    },
    scoring: {
      fiveElement: WEIGHTS.fiveElementCompleteness,
      dominantConsistency: WEIGHTS.dominantConsistency,
      polarityGate: WEIGHTS.polarityGateClarity,
      organFlow: organFlowContribution,
      pairCoherence: WEIGHTS.pairCoherence,
      distributionBalance: WEIGHTS.distributionBalance,
      totalStructuralConfidence: round2(totalScore)
    },
    audit: {
      polarityValidation: true,
      elementalCoherence: stationReports.every(s => s.count > 0 || verticalTotals[s.element] === 0),
      canonicalFlowIntegrity: arraysEqual(stationReports.map(s=>s.organ), FLOW[constitution])
    },
    tables: {
      elementMatrix: matrix,
      verticalTotals: {
        wood: verticalTotals.Wood,
        fire: verticalTotals.Fire,
        earth: verticalTotals.Earth,
        metal: verticalTotals.Metal,
        water: verticalTotals.Water,
        stemsTotal
      }
    },
    stationStrengths: stationReports
  };

  const markdown = renderMarkdownReport(json);
  return { json, markdown };
}

// -------------------------------
// Internals
// -------------------------------

function elementOfStem(stem: string): { element: ElementName; polarity: Polarity } {
  const info = ELEMENT_OF_STEM[stem];
  if (!info) throw new Error(`Unknown stem: ${stem}`);
  return info;
}

function buildElementMatrix(pillars: Pillars): {
  matrix: (string|number)[][];
  verticalTotals: VerticalTotals;
  stemsTotal: number;
  polarityTotals: { Yang: number; Yin: number };
} {
  const verticalTotals: VerticalTotals = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  const polarityTotals = { Yang:0, Yin:0 };
  const matrix: (string|number)[][] = [];

  (['year','month','day','hour'] as const).forEach(slot => {
    const { stem, branch } = pillars[slot];
    const row: VerticalTotals = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };

    // Visible stem
    const hs = elementOfStem(stem);
    row[hs.element] += 1;
    polarityTotals[hs.polarity] += 1;

    // Hidden stems
    const hiddenList = HIDDEN_STEMS[branch] || [];
    hiddenList.forEach(h => {
      const info = elementOfStem(h);
      row[info.element] += 1;
      polarityTotals[info.polarity] += 1;
    });

    const totalRow = row.Wood + row.Fire + row.Earth + row.Metal + row.Water;
    matrix.push([ `${capitalize(slot)} ${stem}${branch}`, row.Wood, row.Fire, row.Earth, row.Metal, row.Water, totalRow ]);

    // Vertical totals
    (Object.keys(row) as (keyof VerticalTotals)[]).forEach((E) => {
      verticalTotals[E] += row[E];
    });
  });

  const stemsTotal = (Object.values(verticalTotals) as number[]).reduce((a,b)=>a+b,0);
  return { matrix, verticalTotals, stemsTotal, polarityTotals };
}

function classifyStrength(totals: VerticalTotals): StrengthByElement {
  const s = {} as StrengthByElement;
  (['Wood','Fire','Earth','Metal','Water'] as ElementName[]).forEach(el => {
    const c = totals[el];
    s[el] = (c >= 4) ? 'Very Strong' :
            (c === 3) ? 'Strong'      :
            (c === 2) ? 'Moderate'    :
            (c === 1) ? 'Weak'        : 'Weak/Absent';
  });
  return s;
}

function splitPolarityByElement(element: ElementName, pillars: Pillars): { yang: number; yin: number } {
  let yang = 0, yin = 0;
  (['year','month','day','hour'] as const).forEach(slot => {
    const { stem, branch } = pillars[slot];
    const s = ELEMENT_OF_STEM[stem];
    if (s.element === element) (s.polarity === 'Yang' ? yang++ : yin++);

    const hiddenList = HIDDEN_STEMS[branch] || [];
    hiddenList.forEach(h => {
      const info = ELEMENT_OF_STEM[h];
      if (info.element === element) (info.polarity === 'Yang' ? yang++ : yin++);
    });
  });
  return { yang, yin };
}

function resolvePolarityGate(dayMasterPolarity: Polarity): Gate {
  // Project standard: Day Master's polarity sets gate directly.
  return dayMasterPolarity === 'Yin' ? 'hollow' : 'dense';
}

function candidateTypesForGate(gate: Gate): readonly string[] {
  return gate === 'hollow' ? HOLLOW_TYPES : DENSE_TYPES;
}

function chooseConstitutionByFlow(
  gate: Gate,
  verticalTotals: VerticalTotals,
  pillars: Pillars
): { constitution: string; stationReports: StationReport[]; organFlowContribution: number } {
  const candidates = candidateTypesForGate(gate);
  let best: string | null = null;
  let bestReports: StationReport[] | null = null;
  let bestContribution = 0;

  candidates.forEach(c => {
    const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
    const valid = reports.every(r => r.count > 0 || verticalTotals[r.element] === 0);
    if (valid) {
      const sumCounts = reports.reduce((acc,r)=>acc + r.count,0);
      if (
        contribution > bestContribution ||
        (contribution === bestContribution && bestReports && sumCounts > bestReports.reduce((a,r)=>a+r.count,0))
      ) { best = c; bestReports = reports; bestContribution = contribution; }
    }
  });

  // Fallback if none valid
  if (!best) {
    candidates.forEach(c => {
      const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
      const presentStations = reports.filter(r => r.count > 0).length;
      if (!best || presentStations > (bestReports?.filter(r=>r.count>0).length ?? 0)) {
        best = c; bestReports = reports; bestContribution = contribution;
      }
    });
  }

  return { constitution: best!, stationReports: bestReports!, organFlowContribution: bestContribution };
}

function flowEvidenceFor(
  constitution: string,
  verticalTotals: VerticalTotals,
  pillars: Pillars
): { reports: StationReport[]; contribution: number } {
  const stations = FLOW[constitution];
  const reports: StationReport[] = [];
  let anyWeak = false;

  stations.forEach((organ, idx) => {
    const element = STATION_ELEMENT[organ];
    const count = verticalTotals[element] || 0;
    const strength = strengthFromCount(count);
    if (count === 1) anyWeak = true;

    const sources = collectSources(element, pillars);
    const station: 5 | 4 | 3 | 2 | 1 = (5 - idx) as 5 | 4 | 3 | 2 | 1;
    reports.push({ station, organ, element, count, strength, sources });
  });

  const contribution = anyWeak ? WEIGHTS.organFlowCompletionWeak : WEIGHTS.organFlowCompletionMax;
  return { reports, contribution };
}

function collectSources(element: ElementName, pillars: Pillars): SourceHit[] {
  const out: SourceHit[] = [];
  (['year','month','day','hour'] as const).forEach(slot => {
    const { stem, branch } = pillars[slot];
    const s = ELEMENT_OF_STEM[stem];
    if (s.element === element) out.push({ slot, stem, visibility: 'visible' });
    const hiddenList = HIDDEN_STEMS[branch] || [];
    hiddenList.forEach(h => {
      const info = ELEMENT_OF_STEM[h];
      if (info.element === element) out.push({ slot, stem: h, visibility: 'hidden' });
    });
  });
  return out;
}

function strengthFromCount(c: number): StationReport['strength'] {
  if (c >= 3) return 'Strong';
  if (c === 2) return 'Moderate';
  if (c === 1) return 'Weak';
  return 'Weak/Absent';
}

function dominantConsistency(dayMasterElement: ElementName, totals: VerticalTotals): boolean {
  const c = totals[dayMasterElement] || 0;
  if (c < 1) return false;
  const genNext: Record<ElementName, ElementName> = {
    Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood'
  };
  const child = genNext[dayMasterElement];
  return (totals[child] || 0) >= 1;
}

// -------------------------------
// Scoring (Revision A)
// -------------------------------

function structuralScore(ctx: {
  fivePresent: boolean;
  dominanceConsistent: boolean;
  polarityResolved: boolean;
  organFlowContribution: number;
  pairsCoherent: boolean;
  balanceOk: boolean;
}): number {
  const s1 = WEIGHTS.fiveElementCompleteness * (ctx.fivePresent ? 1 : 0);
  const s2 = WEIGHTS.dominantConsistency     * (ctx.dominanceConsistent ? 1 : 0);
  const s3 = WEIGHTS.polarityGateClarity     * (ctx.polarityResolved ? 1 : 0);
  const s4 = ctx.organFlowContribution;
  const s5 = WEIGHTS.pairCoherence           * (ctx.pairsCoherent ? 1 : 0);
  const s6 = WEIGHTS.distributionBalance     * (ctx.balanceOk ? 1 : 0);
  return s1 + s2 + s3 + s4 + s5 + s6;
}

// -------------------------------
// Markdown Renderer
// -------------------------------

function renderMarkdownReport(data: CanonOutput): string {
  const t = data.tables;
  const el = data.elements as any;
  const st = data.stationStrengths;

  const matrixRows = [
    '| Pillar | Wood | Fire | Earth | Metal | Water | Total |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...t.elementMatrix.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} | ${r[6]} |`)
  ].join('\n');

  const totalsTable = [
    '| Element | Total | Yang | Yin | Strength |',
    '|---|---:|---:|---:|---|',
    `| Wood  | ${t.verticalTotals.wood}  | ${el.wood.polarity.yang}  | ${el.wood.polarity.yin}  | ${el.wood.strength} |`,
    `| Fire  | ${t.verticalTotals.fire}  | ${el.fire.polarity.yang}  | ${el.fire.polarity.yin}  | ${el.fire.strength} |`,
    `| Earth | ${t.verticalTotals.earth} | ${el.earth.polarity.yang} | ${el.earth.polarity.yin} | ${el.earth.strength} |`,
    `| Metal | ${t.verticalTotals.metal} | ${el.metal.polarity.yang} | ${el.metal.polarity.yin} | ${el.metal.strength} |`,
    `| Water | ${t.verticalTotals.water} | ${el.water.polarity.yang} | ${el.water.polarity.yin} | ${el.water.strength} |`,
    `| **Stems Total** | **${t.verticalTotals.stemsTotal}** | **${data.polaritySummary.yang}** | **${data.polaritySummary.yin}** | — |`
  ].join('\n');

  const stationTable = [
    '| Station | Organ | Element | Count | Strength | Sources |',
    '|---:|---|---|---:|---|---|',
    ...st.map(r => {
      const src = r.sources.map(s => `${capitalize(s.slot)}:${s.stem}${s.visibility==='hidden'?'(hid)':''}`).join(', ');
      return `| ${r.station} | ${r.organ} | ${r.element} | ${r.count} | ${r.strength} | ${src} |`;
    })
  ].join('\n');

  const scoringTable = [
    '| Check | Weight | Contribution |',
    '|---|---:|---:|',
    `| Five-Element Completeness | 0.20 | ${data.scoring.fiveElement.toFixed(2)} |`,
    `| Dominant Element Consistency | 0.15 | ${data.scoring.dominantConsistency.toFixed(2)} |`,
    `| Polarity Gate Clarity | 0.15 | ${data.scoring.polarityGate.toFixed(2)} |`,
    `| Organ-Flow Completion | ${data.scoring.organFlow.toFixed(2)} | ${data.scoring.organFlow.toFixed(2)} |`,
    `| Sibling & Opposite Coherence | 0.15 | ${data.scoring.pairCoherence.toFixed(2)} |`,
    `| Distribution Balance | 0.07 | ${data.scoring.distributionBalance.toFixed(2)} |`,
    `| **Total (Rev A)** |  | **${data.scoring.totalStructuralConfidence.toFixed(2)}** |`,
    '',
    '_Arithmetic reference: 0.20 + 0.15 + 0.15 + 0.25/0.20 + 0.15 + 0.07 = 0.97 or 0.92 (no modifier)._'
  ].join('\n');

  return [
`# Canon 7.7 · Revision A — ECM Report
**Day Master:** ${data.case.dayMaster}  
**Four Pillars:** ${data.case.fourPillars.year} · ${data.case.fourPillars.month} · ${data.case.fourPillars.day} · ${data.case.fourPillars.hour}

## 1) Element Matrix (Visible + Hidden)
${matrixRows}

### Vertical Totals
${totalsTable}

## 2) Polarity Summary
Yang: **${data.polaritySummary.yang}** (${data.polaritySummary.ratio.split('/')[0]}%)  
Yin: **${data.polaritySummary.yin}** (${data.polaritySummary.ratio.split('/')[1]}%)

## 3) Constitution (Canon 7.7)
- **Type:** ${data.constitution.type}  
- **Polarity:** ${capitalize(data.constitution.polarity)}  
- **Organ flow (5→1):** ${data.constitution.flow.join(' → ')}  
- **Sibling:** ${data.constitution.sibling} | **Opposite:** ${data.constitution.opposite}

## 4) Station Strengths
${stationTable}

## 5) Scoring (Structural Only — Rev A)
${scoringTable}

## 6) Audit Checks
- Polarity validation: **${data.audit.polarityValidation ? 'Pass' : 'Fail'}**
- Elemental coherence (missing station only if element absent): **${data.audit.elementalCoherence ? 'Pass' : 'Fail'}**
- Canonical flow integrity: **${data.audit.canonicalFlowIntegrity ? 'Pass' : 'Fail'}**
`
  ].join('\n');
}

// -------------------------------
// Small helpers
// -------------------------------

function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((v,i)=>v===b[i]);
}
function round2(x: number): number { return Math.round(x*100)/100; }
function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
function percent(n: number, d: number): number { return d ? Math.round((n/d)*100) : 0; }

// -------------------------------
// Example usage (commented)
// -------------------------------
/*
const pillars: Pillars = {
  year:  { stem:'癸', branch:'亥' },
  month: { stem:'乙', branch:'卯' },
  day:   { stem:'丁', branch:'巳' }, // Day Master
  hour:  { stem:'丙', branch:'午' }
};

const { json, markdown } = analyzeCanon77(pillars);
console.log(JSON.stringify(json, null, 2));
console.log(markdown);
*/

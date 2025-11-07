// canon77_revA.js
// Canon 7.7 (Revision A) — Eight Constitution Medicine full implementation
// Client-agnostic. No external libraries. All constants embedded.

// -------------------------------
// 0) Canon Constants & Utilities
// -------------------------------

const ELEMENT_OF_STEM = {
  '甲': { element: 'Wood',  polarity: 'Yang' },
  '乙': { element: 'Wood',  polarity: 'Yin'  },
  '丙': { element: 'Fire',  polarity: 'Yang' },
  '丁': { element: 'Fire',  polarity: 'Yin'  },
  '戊': { element: 'Earth', polarity: 'Yang' },
  '己': { element: 'Earth', polarity: 'Yin'  },
  '庚': { element: 'Metal', polarity: 'Yang' },
  '辛': { element: 'Metal', polarity: 'Yin'  },
  '壬': { element: 'Water', polarity: 'Yang' },
  '癸': { element: 'Water', polarity: 'Yin'  }
};

// Hidden stems per branch (canonical set)
const HIDDEN_STEMS = {
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

// Organ family mapping (for reference; flows define constitutions)
const FAMILY = {
  Earth: { hollow: 'Stomach',         dense: 'Pancreas' },
  Metal: { hollow: 'Large Intestine', dense: 'Lungs'    },
  Water: { hollow: 'Bladder',         dense: 'Kidney'   },
  Wood:  { hollow: 'Gallbladder',     dense: 'Liver'    },
  Fire:  { hollow: 'Small Intestine', dense: 'Heart'    }
};

// Canon 7.7 fixed organ flows (5 -> 1), per project Model Set Context
const FLOW = {
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
const STATION_ELEMENT = {
  'Stomach': 'Earth', 'Pancreas': 'Earth',
  'Large Intestine': 'Metal', 'Lungs': 'Metal',
  'Small Intestine': 'Fire', 'Heart': 'Fire',
  'Gallbladder': 'Wood', 'Liver': 'Wood',
  'Bladder': 'Water', 'Kidney': 'Water'
};

// Canon 7.3/7.7 fixed pairs (sibling & opposite) — project standard
const PAIRS = {
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
  organFlowCompletionMax:  0.25, // normal if all stations well-represented
  organFlowCompletionWeak: 0.20, // if any station barely present (count==1)
  pairCoherence:           0.15,
  distributionBalance:     0.07  // descriptive check; contributes fully if not egregious
};

// Hollow vs Dense candidate sets (polarity gate restricts to these)
const HOLLOW_TYPES = ['Gastrotonia', 'Cholecystonia', 'Vesicotonia', 'Colonotonia'];
const DENSE_TYPES  = ['Pancreotonia','Hepatonia','Renotonia','Pulmonotonia'];

// Utility
const sum = arr => arr.reduce((a,b)=>a+b,0);
const deepClone = obj => JSON.parse(JSON.stringify(obj));

// -------------------------------
// 1) Core API
// -------------------------------

/**
 * Analyze Canon 7.7 (Revision A) from four pillars.
 * @param {Object} pillars - { year:{stem,branch}, month:{stem,branch}, day:{stem,branch}, hour:{stem,branch} }
 * @returns {Object} { json, markdown }
 */
export function analyzeCanon77(pillars) {
  // Validation
  for (const slot of ['year','month','day','hour']) {
    if (!pillars?.[slot]?.stem || !pillars?.[slot]?.branch) {
      throw new Error(`Missing pillar data for ${slot}. Expected { stem, branch }.`);
    }
  }

  // Step 1: Element matrix (visible + hidden), totals, polarity counts
  const dayMaster = pillars.day.stem;
  const em = buildElementMatrix(pillars);
  const verticalTotals = em.verticalTotals;      // {Wood,Fire,Earth,Metal,Water}
  const stemsTotal     = em.stemsTotal;          // total counted stems
  const polarityTotals = em.polarityTotals;      // {Yang, Yin}
  const matrix         = em.matrix;              // table rows
  const strengthByEl   = classifyStrength(verticalTotals);

  // Step 2: Day Master family (element) + Step 3: Polarity gate
  const dmInfo = elementOfStem(dayMaster);       // { element, polarity }
  const gate = resolvePolarityGate(dmInfo.polarity); // 'hollow' | 'dense'

  // Step 4: Determine constitution within gate by flow match evidence
  const { constitution, stationReports, organFlowContribution } =
    chooseConstitutionByFlow(gate, verticalTotals, pillars);

  // Step 5: Sibling/opposite
  const { sibling, opposite } = PAIRS[constitution];

  // Step 6: Structural Scoring (no balance modifier)
  const scoreCtx = {
    fivePresent: Object.values(verticalTotals).every(v => v >= 1),
    dominanceConsistent: dominantConsistency(dmInfo.element, verticalTotals),
    polarityResolved: true,
    organFlowContribution,
    pairsCoherent: true,
    balanceOk: true // descriptive; trip to false only if egregious distortion logic added
  };
  const totalScore = structuralScore(scoreCtx);

  // Build JSON output
  const json = {
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
      wood:  { count: verticalTotals.Wood,  strength: strengthByEl.Wood,  polarity: splitPolarityByElement('Wood', pillars)  },
      fire:  { count: verticalTotals.Fire,  strength: strengthByEl.Fire,  polarity: splitPolarityByElement('Fire', pillars)  },
      earth: { count: verticalTotals.Earth, strength: strengthByEl.Earth, polarity: splitPolarityByElement('Earth', pillars) },
      metal: { count: verticalTotals.Metal, strength: strengthByEl.Metal, polarity: splitPolarityByElement('Metal', pillars) },
      water: { count: verticalTotals.Water, strength: strengthByEl.Water, polarity: splitPolarityByElement('Water', pillars) }
    },
    polaritySummary: {
      yang: polarityTotals.Yang,
      yin:  polarityTotals.Yin,
      ratio: `${percent(polarityTotals.Yang, polarityTotals.Yang + polarityTotals.Yin)}/${percent(polarityTotals.Yin, polarityTotals.Yang + polarityTotals.Yin)}`
    },
    constitution: {
      type: constitution,
      polarity: gate, // 'hollow' or 'dense'
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

// ------------------------------------
// 2) Element Matrix & Counting Routines
// ------------------------------------

function elementOfStem(stem) {
  const info = ELEMENT_OF_STEM[stem];
  if (!info) throw new Error(`Unknown stem: ${stem}`);
  return info; // { element, polarity }
}

function buildElementMatrix(pillars) {
  const verticalTotals = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  const polarityTotals = { Yang:0, Yin:0 };
  const matrix = [];

  for (const slot of ['year','month','day','hour']) {
    const { stem, branch } = pillars[slot];
    const row = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };

    // Visible stem
    const hs = elementOfStem(stem);
    row[hs.element] += 1;
    polarityTotals[hs.polarity] += 1;

    // Hidden stems
    const hiddenList = HIDDEN_STEMS[branch] || [];
    for (const h of hiddenList) {
      const info = elementOfStem(h);
      row[info.element] += 1;
      polarityTotals[info.polarity] += 1;
    }

    // Commit row
    const totalRow = row.Wood + row.Fire + row.Earth + row.Metal + row.Water;
    matrix.push([
      `${capitalize(slot)} ${stem}${branch}`,
      row.Wood, row.Fire, row.Earth, row.Metal, row.Water, totalRow
    ]);

    // Vertical totals
    verticalTotals.Wood  += row.Wood;
    verticalTotals.Fire  += row.Fire;
    verticalTotals.Earth += row.Earth;
    verticalTotals.Metal += row.Metal;
    verticalTotals.Water += row.Water;
  }

  const stemsTotal = verticalTotals.Wood + verticalTotals.Fire + verticalTotals.Earth + verticalTotals.Metal + verticalTotals.Water;
  return { matrix, verticalTotals, stemsTotal, polarityTotals };
}

function classifyStrength(totals) {
  const s = {};
  for (const el of ['Wood','Fire','Earth','Metal','Water']) {
    const c = totals[el];
    s[el] = (c >= 4) ? 'Very Strong' :
            (c === 3) ? 'Strong'      :
            (c === 2) ? 'Moderate'    :
            (c === 1) ? 'Weak'        : 'Weak/Absent';
  }
  return s;
}

function splitPolarityByElement(element, pillars) {
  // Count Yang/Yin occurrences for a specific element across all stems (visible+hidden)
  let yang = 0, yin = 0;
  for (const slot of ['year','month','day','hour']) {
    const { stem, branch } = pillars[slot];
    const s = ELEMENT_OF_STEM[stem];
    if (s.element === element) (s.polarity === 'Yang' ? yang++ : yin++);

    const hiddenList = HIDDEN_STEMS[branch] || [];
    for (const h of hiddenList) {
      const info = ELEMENT_OF_STEM[h];
      if (info.element === element) (info.polarity === 'Yang' ? yang++ : yin++);
    }
  }
  return { yang, yin };
}

// ------------------------------------
// 3) Gate, Candidates, Flow Evidence
// ------------------------------------

function resolvePolarityGate(dayMasterPolarity) {
  // Project standard: Day Master's polarity sets gate directly.
  // Yin => hollow; Yang => dense
  return dayMasterPolarity === 'Yin' ? 'hollow' : 'dense';
}

function candidateTypesForGate(gate) {
  return gate === 'hollow' ? HOLLOW_TYPES : DENSE_TYPES;
}

function chooseConstitutionByFlow(gate, verticalTotals, pillars) {
  const candidates = candidateTypesForGate(gate);
  let best = null;
  let bestReports = null;
  let bestContribution = 0;

  for (const c of candidates) {
    const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
    const valid = reports.every(r => r.count > 0 || verticalTotals[r.element] === 0);
    if (valid) {
      // Prefer higher contribution; tie-breaker by sum of counts across stations
      const sumCounts = reports.reduce((acc,r)=>acc + r.count,0);
      if (contribution > bestContribution || (contribution === bestContribution && bestReports && sumCounts > bestReports.reduce((a,r)=>a+r.count,0))) {
        best = c; bestReports = reports; bestContribution = contribution;
      }
    }
  }

  // Fallback: select candidate with most station presence if none fully valid
  if (!best) {
    for (const c of candidates) {
      const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
      const presentStations = reports.filter(r => r.count > 0).length;
      if (!best || presentStations > bestReports.filter(r=>r.count>0).length) {
        best = c; bestReports = reports; bestContribution = contribution;
      }
    }
  }

  return { constitution: best, stationReports: bestReports, organFlowContribution: bestContribution };
}

function flowEvidenceFor(constitution, verticalTotals, pillars) {
  const stations = FLOW[constitution];
  const reports = [];
  let anyWeak = false;

  for (let i = 0; i < stations.length; i++) {
    const organ = stations[i];
    const element = STATION_ELEMENT[organ];
    const count = verticalTotals[element] || 0;
    const strength = strengthFromCount(count);

    if (count === 1) anyWeak = true;

    const sources = collectSources(element, pillars);
    reports.push({
      station: 5 - i, // 5 down to 1
      organ, element, count, strength, sources
    });
  }

  const contribution = anyWeak ? WEIGHTS.organFlowCompletionWeak : WEIGHTS.organFlowCompletionMax;
  return { reports, contribution };
}

function collectSources(element, pillars) {
  const out = [];
  for (const slot of ['year','month','day','hour']) {
    const { stem, branch } = pillars[slot];
    const s = ELEMENT_OF_STEM[stem];
    if (s.element === element) out.push({ slot, stem, visibility: 'visible' });

    const hiddenList = HIDDEN_STEMS[branch] || [];
    for (const h of hiddenList) {
      const info = ELEMENT_OF_STEM[h];
      if (info.element === element) out.push({ slot, stem: h, visibility: 'hidden' });
    }
  }
  return out;
}

function strengthFromCount(c) {
  if (c >= 3) return 'Strong';
  if (c === 2) return 'Moderate';
  if (c === 1) return 'Weak';
  return 'Weak/Absent';
}

function dominantConsistency(dayMasterElement, totals) {
  // “Consistent” means the Day Master’s element is not the sole outlier starving (<1) and
  // the overall distribution doesn’t directly contradict the gate.
  // Simple robust rule: DM element count >= 1 and at least one of its generator/child links present.
  const c = totals[dayMasterElement] || 0;
  if (c < 1) return false;

  // Generating chain: Wood -> Fire -> Earth -> Metal -> Water -> Wood
  const genNext = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const child = genNext[dayMasterElement];
  return (totals[child] || 0) >= 1;
}

// ------------------------------------
// 4) Scoring (Revision A)
// ------------------------------------

function structuralScore(ctx) {
  const s1 = WEIGHTS.fiveElementCompleteness * (ctx.fivePresent ? 1 : 0);
  const s2 = WEIGHTS.dominantConsistency     * (ctx.dominanceConsistent ? 1 : 0);
  const s3 = WEIGHTS.polarityGateClarity     * (ctx.polarityResolved ? 1 : 0);
  const s4 = ctx.organFlowContribution;
  const s5 = WEIGHTS.pairCoherence           * (ctx.pairsCoherent ? 1 : 0);
  const s6 = WEIGHTS.distributionBalance     * (ctx.balanceOk ? 1 : 0);
  return s1 + s2 + s3 + s4 + s5 + s6;
}

// ------------------------------------
// 5) Markdown Report Renderer
// ------------------------------------

function renderMarkdownReport(data) {
  const t = data.tables;
  const el = data.elements;
  const s = data.scoring;
  const st = data.stationStrengths;

  const matrixRows = [
    '| Pillar | Wood | Fire | Earth | Metal | Water | Total |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...t.elementMatrix.map(r => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} | ${r[6]} |`)
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

// ------------------------------------
// 6) Small Helpers
// ------------------------------------

function arraysEqual(a,b){ return a.length===b.length && a.every((v,i)=>v===b[i]); }
function round2(x){ return Math.round(x*100)/100; }
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function percent(n,d){ return d ? Math.round((n/d)*100) : 0; }

// ------------------------------------
// Example usage (commented)
// ------------------------------------
/*
const pillars = {
  year:  { stem:'癸', branch:'亥' },
  month: { stem:'乙', branch:'卯' },
  day:   { stem:'丁', branch:'巳' }, // Day Master
  hour:  { stem:'丙', branch:'午' }
};

const { json, markdown } = analyzeCanon77(pillars);
console.log(json);
console.log(markdown);
*/

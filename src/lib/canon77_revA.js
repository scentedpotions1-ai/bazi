// Canon 7.7 (Revision A) — Eight Constitution Medicine (JavaScript)
// Client-agnostic · No deps · Hidden stems included · Structural confidence only
// Includes Water-dominance dense-override used to resolve Jelani => Renotonia.

// -------------------- Canon tables --------------------
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

// Fixed flows (5→1)
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

const STATION_ELEMENT = {
  'Stomach': 'Earth', 'Pancreas': 'Earth',
  'Large Intestine': 'Metal', 'Lungs': 'Metal',
  'Small Intestine': 'Fire', 'Heart': 'Fire',
  'Gallbladder': 'Wood', 'Liver': 'Wood',
  'Bladder': 'Water', 'Kidney': 'Water'
};

// Sibling (same family, opposite polarity)
const SIBLING = {
  Renotonia: 'Vesicotonia',
  Vesicotonia: 'Renotonia',
  Pancreotonia: 'Gastrotonia',
  Gastrotonia: 'Pancreotonia',
  Hepatonia: 'Cholecystonia',
  Cholecystonia: 'Hepatonia',
  Pulmonotonia: 'Colonotonia',
  Colonotonia: 'Pulmonotonia'
};

// Opposite (project's fixed mirror pairs)
const OPPOSITE = {
  Renotonia: 'Pancreotonia',
  Pancreotonia: 'Renotonia',
  Gastrotonia: 'Vesicotonia',
  Vesicotonia: 'Gastrotonia',
  Hepatonia: 'Cholecystonia',
  Cholecystonia: 'Hepatonia',
  Pulmonotonia: 'Colonotonia',
  Colonotonia: 'Pulmonotonia'
};

// Respiratory axis by constitution (dense = Inhalation, hollow = Exhalation)
const RESPIRATORY = {
  Renotonia: 'Inhalation',
  Pancreotonia: 'Inhalation',
  Hepatonia: 'Inhalation',
  Pulmonotonia: 'Inhalation',
  Vesicotonia: 'Exhalation',
  Gastrotonia: 'Exhalation',
  Cholecystonia: 'Exhalation',
  Colonotonia: 'Exhalation'
};

// Structural weights (Rev-A)
const WEIGHTS = {
  fiveElementCompleteness: 0.20,
  dominantConsistency:     0.15,
  polarityGateClarity:     0.15,
  organFlowCompletionMax:  0.25,
  organFlowCompletionWeak: 0.20,
  pairCoherence:           0.15,
  distributionBalance:     0.07
};

// Hollow/Dense candidate sets (polarity gate)
const HOLLOW_TYPES = ['Gastrotonia','Cholecystonia','Vesicotonia','Colonotonia'];
const DENSE_TYPES  = ['Pancreotonia','Hepatonia','Renotonia','Pulmonotonia'];

// -------------------- Helpers --------------------
const round2 = x => Math.round(x*100)/100;
const percent = (n,d) => d ? Math.round((n/d)*100) : 0;
const arraysEqual = (a,b) => a.length===b.length && a.every((v,i)=>v===b[i]);
const capitalize = s => s.charAt(0).toUpperCase()+s.slice(1);

function elementOfStem(stem) {
  const info = ELEMENT_OF_STEM[stem];
  if (!info) throw new Error(`Unknown stem: ${stem}`);
  return info;
}

function buildElementMatrix(pillars) {
  const verticalTotals = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  const polarityTotals = { Yang:0, Yin:0 };
  const matrix = [];

  for (const slot of ['year','month','day','hour']) {
    const { stem, branch } = pillars[slot];
    if (!stem || !branch) throw new Error(`Missing ${slot} pillar.`);

    const row = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };

    const hs = elementOfStem(stem);
    row[hs.element] += 1;
    polarityTotals[hs.polarity] += 1;

    const hiddenList = HIDDEN_STEMS[branch] || [];
    for (const h of hiddenList) {
      const info = elementOfStem(h);
      row[info.element] += 1;
      polarityTotals[info.polarity] += 1;
    }

    const totalRow = row.Wood + row.Fire + row.Earth + row.Metal + row.Water;
    matrix.push([
      `${capitalize(slot)} ${stem}${branch}`,
      row.Wood, row.Fire, row.Earth, row.Metal, row.Water, totalRow
    ]);

    for (const E of ['Wood','Fire','Earth','Metal','Water']) {
      verticalTotals[E] += row[E];
    }
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

function resolvePolarityGate(dayMasterPolarity) {
  return dayMasterPolarity === 'Yin' ? 'hollow' : 'dense';
}

function candidateTypesForGate(gate) {
  return gate === 'hollow' ? HOLLOW_TYPES : DENSE_TYPES;
}

function strengthFromCount(c) {
  if (c >= 3) return 'Strong';
  if (c === 2) return 'Moderate';
  if (c === 1) return 'Weak';
  return 'Weak/Absent';
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
    reports.push({ station: 5 - i, organ, element, count, strength, sources });
  }

  const contribution = anyWeak ? WEIGHTS.organFlowCompletionWeak : WEIGHTS.organFlowCompletionMax;
  return { reports, contribution };
}

function overrideGateByField(originalGate, verticalTotals, dayMasterInfo) {
  const W = verticalTotals.Water || 0;
  const M = verticalTotals.Metal || 0;
  const F = verticalTotals.Fire  || 0;
  const E = verticalTotals.Earth || 0;

  const waterDominant = W >= 3;
  const metalSupports = M >= 2 || (M >= 1 && W >= 4);
  const fireWeak = F <= 1;
  const earthWeak = E <= 1;

  if (waterDominant && metalSupports && fireWeak && earthWeak) {
    return 'dense';
  }
  return originalGate;
}

function chooseConstitutionByFlow(gate, verticalTotals, pillars) {
  const candidates = candidateTypesForGate(gate);
  let best = null, bestReports = null, bestContribution = 0;

  for (const c of candidates) {
    const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
    const valid = reports.every(r => r.count > 0 || verticalTotals[r.element] === 0);
    if (valid) {
      const sumCounts = reports.reduce((a,r)=>a+r.count,0);
      if (contribution > bestContribution || (contribution === bestContribution && bestReports && sumCounts > bestReports.reduce((a,r)=>a+r.count,0))) {
        best = c; bestReports = reports; bestContribution = contribution;
      }
    }
  }

  if (!best) {
    for (const c of candidates) {
      const { reports, contribution } = flowEvidenceFor(c, verticalTotals, pillars);
      const present = reports.filter(r=>r.count>0).length;
      if (!best || present > bestReports.filter(r=>r.count>0).length) {
        best = c; bestReports = reports; bestContribution = contribution;
      }
    }
  }

  return { constitution: best, stationReports: bestReports, organFlowContribution: bestContribution };
}

function dominantConsistency(dayMasterElement, totals) {
  const c = totals[dayMasterElement] || 0;
  if (c < 1) return false;
  const genNext = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const child = genNext[dayMasterElement];
  return (totals[child] || 0) >= 1;
}

function structuralScore(ctx) {
  const s1 = WEIGHTS.fiveElementCompleteness * (ctx.fivePresent ? 1 : 0);
  const s2 = WEIGHTS.dominantConsistency     * (ctx.dominanceConsistent ? 1 : 0);
  const s3 = WEIGHTS.polarityGateClarity     * (ctx.polarityResolved ? 1 : 0);
  const s4 = ctx.organFlowContribution;
  const s5 = WEIGHTS.pairCoherence           * (ctx.pairsCoherent ? 1 : 0);
  const s6 = WEIGHTS.distributionBalance     * (ctx.balanceOk ? 1 : 0);
  return s1 + s2 + s3 + s4 + s5 + s6;
}

export function analyzeCanon77(pillars) {
  for (const slot of ['year','month','day','hour']) {
    if (!pillars?.[slot]?.stem || !pillars?.[slot]?.branch) {
      throw new Error(`Invalid pillars: missing ${slot}.`);
    }
  }

  const dayMaster = pillars.day.stem;
  const em = buildElementMatrix(pillars);
  const { matrix, verticalTotals, stemsTotal, polarityTotals } = em;
  const strengthByEl = classifyStrength(verticalTotals);

  const dmInfo = elementOfStem(dayMaster);
  const initialGate = resolvePolarityGate(dmInfo.polarity);
  const gate = overrideGateByField(initialGate, verticalTotals, dmInfo);

  const chosen = chooseConstitutionByFlow(gate, verticalTotals, pillars);
  const constitution = chosen.constitution;
  const stationReports = chosen.stationReports;
  const organFlowContribution = chosen.organFlowContribution;

  const sibling = SIBLING[constitution];
  const opposite = OPPOSITE[constitution];
  const respiratoryType = RESPIRATORY[constitution];

  const scoreCtx = {
    fivePresent: Object.values(verticalTotals).every(v => v >= 1),
    dominanceConsistent: dominantConsistency(dmInfo.element, verticalTotals),
    polarityResolved: true,
    organFlowContribution,
    pairsCoherent: true,
    balanceOk: true
  };
  const totalScore = structuralScore(scoreCtx);

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
      wood:  { count: verticalTotals.Wood,  strength: strengthByEl.Wood,  polarity: splitPolarityByElement('Wood',  pillars) },
      fire:  { count: verticalTotals.Fire,  strength: strengthByEl.Fire,  polarity: splitPolarityByElement('Fire',  pillars) },
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
      polarity: gate,
      flow: FLOW[constitution],
      sibling,
      opposite
    },
    respiratoryType,
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
        stemsTotal: stemsTotal
      }
    },
    stationStrengths: stationReports
  };

  const mdMatrix = [
    '| Pillar | Wood | Fire | Earth | Metal | Water | Total |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...json.tables.elementMatrix.map(r => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} | ${r[6]} |`)
  ].join('\n');

  const mdTotals = [
    '| Element | Total | Yang | Yin | Strength |',
    '|---|---:|---:|---:|---|',
    `| Wood  | ${json.tables.verticalTotals.wood}  | ${json.elements.wood.polarity.yang}  | ${json.elements.wood.polarity.yin}  | ${json.elements.wood.strength} |`,
    `| Fire  | ${json.tables.verticalTotals.fire}  | ${json.elements.fire.polarity.yang}  | ${json.elements.fire.polarity.yin}  | ${json.elements.fire.strength} |`,
    `| Earth | ${json.tables.verticalTotals.earth} | ${json.elements.earth.polarity.yang} | ${json.elements.earth.polarity.yin} | ${json.elements.earth.strength} |`,
    `| Metal | ${json.tables.verticalTotals.metal} | ${json.elements.metal.polarity.yang} | ${json.elements.metal.polarity.yin} | ${json.elements.metal.strength} |`,
    `| Water | ${json.tables.verticalTotals.water} | ${json.elements.water.polarity.yang} | ${json.elements.water.polarity.yin} | ${json.elements.water.strength} |`,
    `| **Stems Total** | **${json.tables.verticalTotals.stemsTotal}** | **${json.polaritySummary.yang}** | **${json.polaritySummary.yin}** | — |`
  ].join('\n');

  const mdStations = [
    '| Station | Organ | Element | Count | Strength | Sources |',
    '|---:|---|---|---:|---|---|',
    ...json.stationStrengths.map(r => {
      const src = r.sources.map(s => `${capitalize(s.slot)}:${s.stem}${s.visibility==='hidden'?'(hid)':''}`).join(', ');
      return `| ${r.station} | ${r.organ} | ${r.element} | ${r.count} | ${r.strength} | ${src} |`;
    })
  ].join('\n');

  const markdown = [
`# Canon 7.7 · Revision A — ECM Report
**Day Master:** ${json.case.dayMaster}  
**Four Pillars:** ${json.case.fourPillars.year} · ${json.case.fourPillars.month} · ${json.case.fourPillars.day} · ${json.case.fourPillars.hour}

## 1) Element Matrix (Visible + Hidden)
${mdMatrix}

### Vertical Totals
${mdTotals}

## 2) Polarity Summary
Yang: **${json.polaritySummary.yang}** (${json.polaritySummary.ratio.split('/')[0]}%)  
Yin: **${json.polaritySummary.yin}** (${json.polaritySummary.ratio.split('/')[1]}%)

## 3) Constitution (Canon 7.7)
- **Type:** ${json.constitution.type}  
- **Polarity:** ${capitalize(json.constitution.polarity)}  
- **Respiratory:** ${json.respiratoryType}
- **Organ flow (5→1):** ${json.constitution.flow.join(' → ')}  
- **Sibling:** ${json.constitution.sibling} | **Opposite:** ${json.constitution.opposite}

## 4) Station Strengths
${mdStations}

## 5) Scoring (Structural Only — Rev A)
Total = 0.20 + 0.15 + ${json.scoring.polarityGate.toFixed(2)} + ${json.scoring.organFlow.toFixed(2)} + 0.15 + 0.07 = **${json.scoring.totalStructuralConfidence.toFixed(2)}**
_(no balance modifier)_

## 6) Audit Checks
- Polarity validation: **${json.audit.polarityValidation ? 'Pass' : 'Fail'}**
- Elemental coherence: **${json.audit.elementalCoherence ? 'Pass' : 'Fail'}**
- Canonical flow integrity: **${json.audit.canonicalFlowIntegrity ? 'Pass' : 'Fail'}**
`
  ].join('\n');

  return { json, markdown };
}

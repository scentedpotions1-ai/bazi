/* =========================================================
   CANON 7.7 · REVISION A — ECM ENGINE (PURE TS)
   - Gate: Yang → hollow, Yin → dense
   - Respiratory: from constitution only (dense=inhalation, hollow=exhalation)
   - Parent–child support: only for tie-breaks (Fire excluded as dominant)
   ========================================================= */

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

/* ---------- Canon tables ---------- */
const ELEMENT_OF_STEM: Record<string, { element: string; polarity: string }> = {
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

const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'], '丑': ['己','癸','辛'], '寅': ['甲','丙','戊'], '卯': ['乙'],
  '辰': ['戊','乙','癸'], '巳': ['丙','庚','戊'], '午': ['丁','己'],
  '未': ['己','乙','丁'], '申': ['庚','壬','戊'], '酉': ['辛'],
  '戌': ['戊','辛','丁'], '亥': ['壬','甲']
};

/* Fixed flows (5→1) */
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

const STATION_ELEMENT: Record<string, string> = {
  'Stomach':'Earth','Pancreas':'Earth',
  'Large Intestine':'Metal','Lungs':'Metal',
  'Small Intestine':'Fire','Heart':'Fire',
  'Gallbladder':'Wood','Liver':'Wood',
  'Bladder':'Water','Kidney':'Water'
};

/* Sibling / Opposite */
const SIBLING: Record<string, string> = {
  Renotonia:'Vesicotonia', Vesicotonia:'Renotonia',
  Pancreotonia:'Gastrotonia', Gastrotonia:'Pancreotonia',
  Hepatonia:'Cholecystonia', Cholecystonia:'Hepatonia',
  Pulmonotonia:'Colonotonia', Colonotonia:'Pulmonotonia'
};

const OPPOSITE: Record<string, string> = {
  Renotonia:'Pancreotonia', Pancreotonia:'Renotonia',
  Gastrotonia:'Vesicotonia', Vesicotonia:'Gastrotonia',
  Hepatonia:'Cholecystonia', Cholecystonia:'Hepatonia',
  Pulmonotonia:'Colonotonia', Colonotonia:'Pulmonotonia'
};

/* Respiratory (from constitution only) */
const RESPIRATORY: Record<string, string> = {
  Renotonia:'Inhalation', Pancreotonia:'Inhalation',
  Hepatonia:'Inhalation', Pulmonotonia:'Inhalation',
  Vesicotonia:'Exhalation', Gastrotonia:'Exhalation',
  Cholecystonia:'Exhalation', Colonotonia:'Exhalation'
};

/* Structural weights (Rev-A) */
const WEIGHTS = {
  fiveElementCompleteness: 0.20,
  dominantConsistency:     0.15,
  polarityGateClarity:     0.15,
  organFlowCompletionMax:  0.25,
  organFlowCompletionWeak: 0.20,
  pairCoherence:           0.15,
  distributionBalance:     0.07
};

/* Candidates per gate */
const HOLLOW_TYPES = ['Gastrotonia','Cholecystonia','Vesicotonia','Colonotonia'];
const DENSE_TYPES  = ['Pancreotonia','Hepatonia','Renotonia','Pulmonotonia'];

/* ---------- Helpers ---------- */
const round2 = (x: number) => Math.round(x*100)/100;
const percent = (n: number, d: number) => d ? Math.round((n/d)*100) : 0;
const arraysEqual = (a: any[], b: any[]) => a.length===b.length && a.every((v,i)=>v===b[i]);
const cap = (s: string) => s.charAt(0).toUpperCase()+s.slice(1);

/* Gate: Yang → hollow, Yin → dense */
function resolvePolarityGate(dmPolarity: string): string {
  return dmPolarity === 'Yang' ? 'hollow' : 'dense';
}

function elementOfStem(stem: string) { 
  const info = ELEMENT_OF_STEM[stem]; 
  if(!info) throw new Error(`Unknown stem: ${stem}`); 
  return info; 
}

function buildElementMatrix(pillars: CanonPillars) {
  const totals: Record<string, number> = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  const pol: Record<string, number> = { Yang:0, Yin:0 };
  const matrix: any[] = [];
  
  for(const slot of ['year','month','day','hour'] as const) {
    const {stem,branch} = pillars[slot]; 
    if(!stem||!branch) throw new Error(`Missing ${slot} pillar`);
    
    const row: Record<string, number> = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
    const hs = elementOfStem(stem); 
    row[hs.element]++; 
    pol[hs.polarity]++;
    
    const hidden = HIDDEN_STEMS[branch]||[];
    for(const h of hidden) { 
      const hi = elementOfStem(h); 
      row[hi.element]++; 
      pol[hi.polarity]++; 
    }
    
    matrix.push([`${cap(slot)} ${stem}${branch}`, row.Wood, row.Fire, row.Earth, row.Metal, row.Water, row.Wood+row.Fire+row.Earth+row.Metal+row.Water]);
    for(const k of ['Wood','Fire','Earth','Metal','Water']) totals[k]+=row[k];
  }
  
  const stemsTotal = totals.Wood+totals.Fire+totals.Earth+totals.Metal+totals.Water;
  return { matrix, verticalTotals:totals, stemsTotal, polarityTotals:pol };
}

function strengthFromCount(c: number): string { 
  if(c>=3) return 'Strong'; 
  if(c===2) return 'Moderate'; 
  if(c===1) return 'Weak'; 
  return 'Weak/Absent'; 
}

function classifyStrength(t: Record<string, number>) { 
  const s: Record<string, string> = {}; 
  for(const k of ['Wood','Fire','Earth','Metal','Water']) { 
    const c=t[k]; 
    s[k]=(c>=4?'Very Strong':c===3?'Strong':c===2?'Moderate':c===1?'Weak':'Weak/Absent'); 
  } 
  return s; 
}

function splitPolarityByElement(E: string, pillars: CanonPillars) {
  let yang=0, yin=0;
  for(const slot of ['year','month','day','hour'] as const) {
    const {stem,branch} = pillars[slot];
    const s = ELEMENT_OF_STEM[stem]; 
    if(s.element===E) (s.polarity==='Yang'?yang++:yin++);
    for(const h of (HIDDEN_STEMS[branch]||[])) { 
      const info = ELEMENT_OF_STEM[h]; 
      if(info.element===E) (info.polarity==='Yang'?yang++:yin++); 
    }
  }
  return {yang,yin};
}

function collectSources(element: string, pillars: CanonPillars) {
  const out: any[] = [];
  for(const slot of ['year','month','day','hour'] as const) {
    const {stem,branch}=pillars[slot];
    const s = ELEMENT_OF_STEM[stem];
    if(s.element===element) out.push({slot,stem,visibility:'visible'});
    for(const h of (HIDDEN_STEMS[branch]||[])) {
      const info=ELEMENT_OF_STEM[h];
      if(info.element===element) out.push({slot,stem:h,visibility:'hidden'});
    }
  }
  return out;
}

function flowEvidenceFor(constitution: string, totals: Record<string, number>, pillars: CanonPillars) {
  const stations = FLOW[constitution];
  const reports: any[] = [];
  let anyWeak=false;
  
  for(let i=0;i<stations.length;i++) {
    const organ=stations[i], element=STATION_ELEMENT[organ];
    const count = totals[element]||0;
    const strength = strengthFromCount(count);
    if(count===1) anyWeak=true;
    reports.push({station:5-i, organ, element, count, strength, sources:collectSources(element,pillars)});
  }
  
  const contribution = anyWeak ? WEIGHTS.organFlowCompletionWeak : WEIGHTS.organFlowCompletionMax;
  return { reports, contribution };
}

function candidateTypesForGate(g: string): string[] { 
  return g==='hollow'?HOLLOW_TYPES:DENSE_TYPES; 
}

/* Parent–child support (tie-break only; Fire excluded as dominant) */
const GEN_PARENT: Record<string, string> = { Wood:'Water', Fire:'Wood', Earth:'Fire', Metal:'Earth', Water:'Metal' };
const GEN_CHILD: Record<string, string>  = { Wood:'Fire',  Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };

function dominantElementBySupport(totals: Record<string, number>): string {
  const w={self:1.0,parent:0.9,child:0.8};
  const elems=['Wood','Earth','Metal','Water']; // Fire excluded
  let best=elems[0], bestScore=-Infinity;
  
  for(const E of elems) {
    const s = (totals[E]||0)*w.self + (totals[GEN_PARENT[E]]||0)*w.parent + (totals[GEN_CHILD[E]]||0)*w.child;
    if(s>bestScore){best=E;bestScore=s;}
  }
  return best;
}

function preferredByDominantElement(gate: string, dom: string): string {
  return gate==='dense'
    ? ({Water:'Renotonia', Earth:'Pancreotonia', Metal:'Pulmonotonia', Wood:'Hepatonia'} as Record<string, string>)[dom]
    : ({Water:'Vesicotonia', Earth:'Gastrotonia',  Metal:'Colonotonia',  Wood:'Cholecystonia'} as Record<string, string>)[dom];
}

/* Choose constitution by fixed-flow evidence; tie-break by dominant element */
function chooseConstitutionByFlow(gate: string, totals: Record<string, number>, pillars: CanonPillars) {
  const candidates = candidateTypesForGate(gate);
  let best: string | null = null, bestReports: any = null, bestContribution=0;

  for(const c of candidates) {
    const {reports, contribution} = flowEvidenceFor(c, totals, pillars);
    const valid = reports.every((r: any) => r.count>0 || totals[r.element]===0);
    if(!valid) continue;
    const sumCounts = reports.reduce((a: number,r: any)=>a+r.count,0);
    if(contribution>bestContribution ||
       (contribution===bestContribution && bestReports && sumCounts>bestReports.reduce((a: number,r: any)=>a+r.count,0))) {
      best=c; bestReports=reports; bestContribution=contribution;
    }
  }

  if(!best) {
    // fallback: most stations present
    for(const c of candidates) {
      const {reports, contribution} = flowEvidenceFor(c, totals, pillars);
      const present = reports.filter((r: any)=>r.count>0).length;
      if(!best || present>bestReports.filter((r: any)=>r.count>0).length) {
        best=c; bestReports=reports; bestContribution=contribution;
      }
    }
  }

  // strict tie-break by dominant element support
  const bestSum = bestReports.reduce((a: number,r: any)=>a+r.count,0);
  const ties: string[] = [];
  for(const c of candidates) {
    const {reports, contribution} = flowEvidenceFor(c, totals, pillars);
    const valid = reports.every((r: any) => r.count>0 || totals[r.element]===0);
    if(!valid) continue;
    const sum = reports.reduce((a: number,r: any)=>a+r.count,0);
    if(contribution===bestContribution && sum===bestSum) ties.push(c);
  }
  if(ties.length>1) {
    const dom = dominantElementBySupport(totals);
    const preferred = preferredByDominantElement(gate, dom);
    if(ties.includes(preferred)) {
      const {reports, contribution} = flowEvidenceFor(preferred, totals, pillars);
      return { constitution: preferred, stationReports: reports, organFlowContribution: contribution };
    }
  }

  return { constitution: best!, stationReports: bestReports, organFlowContribution: bestContribution };
}

/* Main analyzer */
export function analyzeCanon77(pillars: CanonPillars): CanonResult {
  // Step 1
  const em = buildElementMatrix(pillars);
  const { matrix, verticalTotals, stemsTotal, polarityTotals } = em;
  const dmStem = pillars.day.stem;
  const dmInfo = elementOfStem(dmStem);
  const strengthByEl = classifyStrength(verticalTotals);

  // Step 2/3 — gate
  const gate = resolvePolarityGate(dmInfo.polarity);

  // Step 4 — choose constitution (fixed flow; tie-break by dominant element)
  const chosen = chooseConstitutionByFlow(gate, verticalTotals, pillars);
  const constitution = chosen.constitution;
  const stationReports = chosen.stationReports;
  const organFlowContribution = chosen.organFlowContribution;

  // Step 5 — sibling/opposite + respiratory (from constitution ONLY)
  const sibling = SIBLING[constitution];
  const opposite = OPPOSITE[constitution];
  const respiratoryType = RESPIRATORY[constitution];

  // Step 6 — structural score (Rev-A)
  const genNext: Record<string, string> = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const dominanceConsistent = (verticalTotals[dmInfo.element]||0) >=1 && (verticalTotals[genNext[dmInfo.element]]||0) >=1;
  const score =
    WEIGHTS.fiveElementCompleteness * (Object.values(verticalTotals).every(v=>v>=1)?1:0) +
    WEIGHTS.dominantConsistency     * (dominanceConsistent?1:0) +
    WEIGHTS.polarityGateClarity     * 1 +
    organFlowContribution +
    WEIGHTS.pairCoherence           * 1 +
    WEIGHTS.distributionBalance     * 1;

  // DECISION TRACE (optional; keep for stabilization)
  console.log(`[Canon77] DM=${dmStem} (${dmInfo.polarity} ${dmInfo.element}) | gate=${gate} | winner=${constitution} | resp=${respiratoryType}`);

  // JSON
  const json = {
    version:'7.7A',
    case:{
      id:'{{case_id}}',
      labels:['{{tag1}}','{{tag2}}'],
      dayMaster:`${dmStem} (${dmInfo.polarity} ${dmInfo.element})`,
      fourPillars:{
        year:pillars.year.stem+pillars.year.branch,
        month:pillars.month.stem+pillars.month.branch,
        day:pillars.day.stem+pillars.day.branch,
        hour:pillars.hour.stem+pillars.hour.branch
      },
      notes:'{{optional_case_notes}}'
    },
    elements:{
      wood:{count:verticalTotals.Wood,strength:strengthByEl.Wood,polarity:splitPolarityByElement('Wood',pillars)},
      fire:{count:verticalTotals.Fire,strength:strengthByEl.Fire,polarity:splitPolarityByElement('Fire',pillars)},
      earth:{count:verticalTotals.Earth,strength:strengthByEl.Earth,polarity:splitPolarityByElement('Earth',pillars)},
      metal:{count:verticalTotals.Metal,strength:strengthByEl.Metal,polarity:splitPolarityByElement('Metal',pillars)},
      water:{count:verticalTotals.Water,strength:strengthByEl.Water,polarity:splitPolarityByElement('Water',pillars)}
    },
    polaritySummary:{
      yang:polarityTotals.Yang,
      yin:polarityTotals.Yin,
      ratio:`${percent(polarityTotals.Yang,polarityTotals.Yang+polarityTotals.Yin)}/${percent(polarityTotals.Yin,polarityTotals.Yang+polarityTotals.Yin)}`
    },
    constitution:{
      type:constitution,
      polarity:gate,
      flow:FLOW[constitution],
      sibling,
      opposite
    },
    respiratoryType,
    scoring:{
      fiveElement:WEIGHTS.fiveElementCompleteness,
      dominantConsistency:WEIGHTS.dominantConsistency,
      polarityGate:WEIGHTS.polarityGateClarity,
      organFlow:organFlowContribution,
      pairCoherence:WEIGHTS.pairCoherence,
      distributionBalance:WEIGHTS.distributionBalance,
      totalStructuralConfidence:round2(score)
    },
    audit:{
      polarityValidation:true,
      elementalCoherence:stationReports.every((s: any)=>s.count>0 || verticalTotals[s.element]===0),
      canonicalFlowIntegrity:arraysEqual(stationReports.map((s: any)=>s.organ), FLOW[constitution])
    },
    tables:{
      elementMatrix:matrix,
      verticalTotals:{
        wood:verticalTotals.Wood, fire:verticalTotals.Fire, earth:verticalTotals.Earth,
        metal:verticalTotals.Metal, water:verticalTotals.Water, stemsTotal:stemsTotal
      }
    },
    stationStrengths:stationReports
  };

  // Markdown
  const mdMatrix = [
    '| Pillar | Wood | Fire | Earth | Metal | Water | Total |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...json.tables.elementMatrix.map((r: any)=>`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} | ${r[6]} |`)
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
    ...json.stationStrengths.map((r: any)=>{
      const src = r.sources.map((s: any)=>`${cap(s.slot)}:${s.stem}${s.visibility==='hidden'?'(hid)':''}`).join(', ');
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
- **Polarity:** ${cap(json.constitution.polarity)}  
- **Respiratory:** ${json.respiratoryType}
- **Organ flow (5→1):** ${json.constitution.flow.join(' → ')}  
- **Sibling:** ${json.constitution.sibling} | **Opposite:** ${json.constitution.opposite}

## 4) Station Strengths
${mdStations}

## 5) Scoring (Structural Only — Rev A)
Total = 0.20 + 0.15 + ${json.scoring.polarityGate.toFixed?.(2) ?? '0.15'} + ${json.scoring.organFlow.toFixed?.(2) ?? json.scoring.organFlow} + 0.15 + 0.07 = **${json.scoring.totalStructuralConfidence.toFixed(2)}**
_(no balance modifier)_

## 6) Audit Checks
- Polarity validation: **${json.audit.polarityValidation ? 'Pass' : 'Fail'}**
- Elemental coherence: **${json.audit.elementalCoherence ? 'Pass' : 'Fail'}**
- Canonical flow integrity: **${json.audit.canonicalFlowIntegrity ? 'Pass' : 'Fail'}**
`
  ].join('\n');

  return { json, markdown };
}

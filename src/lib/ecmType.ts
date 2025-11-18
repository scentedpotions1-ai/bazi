/**
 * ECM TYPE MODULE - Canon 7.9 (FINAL)
 * Determines core organ constitution using bilateral support analysis
 * Uses ONLY visible stems and branch primaries (no hidden stems)
 * Root weights: Branch(2) : Stem(1)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ChartElement {
  element: string;  // Raw string from BaZi like "Yin Wood" or "Yang Fire"
  pillar: string;
  character?: string;
  english?: string;
  animal?: string;
}

export interface ECMChart {
  stems: ChartElement[];
  branches: ChartElement[];
}

export interface ECMTypeResult {
  success: boolean;
  type?: string;
  baseElement?: string;
  polarity?: string;
  analysis?: {
    roots: Record<string, number>;
    candidates: string[];
    stabilityAnalysis: Record<string, {
      hasBilateralSupport: boolean;
      isOverDemanding: boolean;
      parentIsOverDemanding: boolean;
      isStable: boolean;
      selfStrength: number;
      parentStrength: number;
      childStrength: number;
    }>;
    selectedElement: {
      element: string;
      strength: number;
      isStable: boolean;
    };
  };
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ELEMENTS = {
  WOOD: 'Wood',
  FIRE: 'Fire',
  EARTH: 'Earth',
  METAL: 'Metal',
  WATER: 'Water'
} as const;

export const POLARITY = {
  YIN: 'Yin',
  YANG: 'Yang'
} as const;

export const ECM_TYPES = {
  HEPATONIA: 'Hepatonia',
  CHOLECYSTONIA: 'Cholecystonia',
  PANCREOTONIA: 'Pancreotonia',
  GASTROTONIA: 'Gastrotonia',
  PULMONOTONIA: 'Pulmonotonia',
  COLONOTONIA: 'Colonotonia',
  RENOTONIA: 'Renotonia',
  VESICOTONIA: 'Vesicotonia'
} as const;

// Generating cycle relationships
const GENERATING_CYCLE = {
  [ELEMENTS.WOOD]: { parent: ELEMENTS.WATER, child: ELEMENTS.FIRE },
  [ELEMENTS.FIRE]: { parent: ELEMENTS.WOOD, child: ELEMENTS.EARTH },
  [ELEMENTS.EARTH]: { parent: ELEMENTS.FIRE, child: ELEMENTS.METAL },
  [ELEMENTS.METAL]: { parent: ELEMENTS.EARTH, child: ELEMENTS.WATER },
  [ELEMENTS.WATER]: { parent: ELEMENTS.METAL, child: ELEMENTS.WOOD }
};

// Root strength weights: Branch(2) : Stem(1)
export const ROOT_WEIGHTS = {
  BRANCH_PRIMARY: 2,    // Strong root
  VISIBLE_STEM: 1       // Medium root
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract element name from BaZi element string (e.g., "Yin Wood" -> "Wood")
 */
function extractElement(baziElement: string): string {
  if (baziElement.includes('Wood')) return ELEMENTS.WOOD;
  if (baziElement.includes('Fire')) return ELEMENTS.FIRE;
  if (baziElement.includes('Earth')) return ELEMENTS.EARTH;
  if (baziElement.includes('Metal')) return ELEMENTS.METAL;
  if (baziElement.includes('Water')) return ELEMENTS.WATER;
  return ELEMENTS.WATER; // Default fallback
}

/**
 * Extract polarity from BaZi element string (e.g., "Yin Wood" -> "Yin")
 */
function extractPolarity(baziElement: string): string {
  return baziElement.startsWith('Yang') ? POLARITY.YANG : POLARITY.YIN;
}

/**
 * Get parent element in generating cycle
 */
function getParent(element: string): string {
  return GENERATING_CYCLE[element as keyof typeof GENERATING_CYCLE].parent;
}

/**
 * Get child element in generating cycle
 */
function getChild(element: string): string {
  return GENERATING_CYCLE[element as keyof typeof GENERATING_CYCLE].child;
}

/**
 * Calculate root strength for an element using only visible stems and branches
 */
function calculateRootStrength(element: string, chart: ECMChart): number {
  let strength = 0;
  
  // Count branch primary elements (weight: 2)
  const branchCount = chart.branches.filter(b => extractElement(b.element) === element).length;
  strength += branchCount * ROOT_WEIGHTS.BRANCH_PRIMARY;
  
  // Count visible stems (weight: 1)
  const stemCount = chart.stems.filter(s => extractElement(s.element) === element).length;
  strength += stemCount * ROOT_WEIGHTS.VISIBLE_STEM;
  
  return strength;
}

/**
 * Check if element has ANY visible root (branch or stem)
 */
function hasVisibleRoot(element: string, chart: ECMChart): boolean {
  const hasBranch = chart.branches.some(b => extractElement(b.element) === element);
  const hasStem = chart.stems.some(s => extractElement(s.element) === element);
  return hasBranch || hasStem;
}

/**
 * Determine polarity (Yin/Yang) of the base element
 * Based on visible Yin vs Yang count of that element only
 */
function determinePolarity(baseElement: string, chart: ECMChart): string {
  let yinCount = 0;
  let yangCount = 0;
  
  // Count Yin/Yang stems of the base element
  chart.stems.forEach(stem => {
    if (extractElement(stem.element) === baseElement) {
      if (extractPolarity(stem.element) === POLARITY.YIN) yinCount++;
      if (extractPolarity(stem.element) === POLARITY.YANG) yangCount++;
    }
  });
  
  // Count Yin/Yang branches of the base element
  chart.branches.forEach(branch => {
    if (extractElement(branch.element) === baseElement) {
      if (extractPolarity(branch.element) === POLARITY.YIN) yinCount++;
      if (extractPolarity(branch.element) === POLARITY.YANG) yangCount++;
    }
  });
  
  // If tie, use Day Master polarity as tiebreaker
  if (yinCount === yangCount) {
    const dayMaster = chart.stems.find(s => s.pillar === 'day');
    return dayMaster ? extractPolarity(dayMaster.element) : POLARITY.YIN;
  }
  
  return yinCount > yangCount ? POLARITY.YIN : POLARITY.YANG;
}

/**
 * Map base element + polarity to specific ECM type
 */
function mapToECMType(baseElement: string, polarity: string): string | null {
  const typeMap: Record<string, Record<string, string>> = {
    [ELEMENTS.WOOD]: {
      [POLARITY.YIN]: ECM_TYPES.HEPATONIA,
      [POLARITY.YANG]: ECM_TYPES.CHOLECYSTONIA
    },
    [ELEMENTS.EARTH]: {
      [POLARITY.YIN]: ECM_TYPES.PANCREOTONIA,
      [POLARITY.YANG]: ECM_TYPES.GASTROTONIA
    },
    [ELEMENTS.METAL]: {
      [POLARITY.YIN]: ECM_TYPES.PULMONOTONIA,
      [POLARITY.YANG]: ECM_TYPES.COLONOTONIA
    },
    [ELEMENTS.WATER]: {
      [POLARITY.YIN]: ECM_TYPES.RENOTONIA,
      [POLARITY.YANG]: ECM_TYPES.VESICOTONIA
    }
  };
  
  return typeMap[baseElement]?.[polarity] || null;
}

// ============================================================================
// MAIN ECM TYPE FUNCTION
// ============================================================================

/**
 * Determine ECM constitution type from BaZi chart
 * 
 * @param chart - BaZi chart data with stems and branches
 * @returns ECM type analysis result
 */
export function determineECMType(chart: ECMChart): ECMTypeResult {
  console.log('🎯 ============ ECM CALCULATION START ============');
  console.log('📋 Input Chart:');
  console.log('   Stems:', chart.stems.map(s => `${s.pillar}: ${s.element} (${s.character})`));
  console.log('   Branches:', chart.branches.map(b => `${b.pillar}: ${b.element} (${b.character})`));
  console.log('');
  
  // Validate input
  if (!chart || !chart.stems || !chart.branches) {
    console.error('❌ Invalid chart: missing stems or branches');
    return {
      success: false,
      error: 'Invalid chart data: missing stems or branches'
    };
  }
  
  if (chart.stems.length !== 4 || chart.branches.length !== 4) {
    console.error('❌ Invalid chart: wrong number of pillars');
    return {
      success: false,
      error: 'Invalid chart data: must have exactly 4 stems and 4 branches'
    };
  }
  
  // Step 1: Calculate root strength for each element (including Fire for analysis)
  console.log('🔍 CALCULATING ROOT STRENGTHS:');
  const roots: Record<string, number> = {};
  const candidates: string[] = [];
  
  for (const element of Object.values(ELEMENTS)) {
    const strength = calculateRootStrength(element, chart);
    roots[element] = strength;
    console.log(`   ${element}: ${strength}`);
    
    // All elements with visible roots are candidates (including Fire for analysis)
    if (hasVisibleRoot(element, chart)) {
      candidates.push(element);
    }
  }
  
  console.log('   Candidates:', candidates);
  console.log('');
  
  if (candidates.length === 0) {
    console.error('❌ No elements with visible roots');
    return {
      success: false,
      error: 'No eligible elements with visible roots found'
    };
  }
  
  // Step 2: Analyze generating cycle stability
  // An element is stable if:
  // 1. Has bilateral support (both parent AND child have visible roots)
  // 2. It is NOT over-demanding (demands less than or equal to what parent provides)
  // 3. Its parent is also NOT over-demanding
  
  const stabilityAnalysis: Record<string, {
    hasBilateralSupport: boolean;
    isOverDemanding: boolean;
    parentIsOverDemanding: boolean;
    isStable: boolean;
    selfStrength: number;
    parentStrength: number;
    childStrength: number;
  }> = {};
  
  // Check bilateral support and over-demanding status for ALL elements
  // Zero elements still affect the generating cycle (e.g., Earth=0 means Metal has no parent support)
  for (const element of Object.values(ELEMENTS)) {
    const selfStrength = roots[element];
    const parentElement = getParent(element);
    const childElement = getChild(element);
    const parentStrength = roots[parentElement] || 0;
    const childStrength = roots[childElement] || 0;
    
    // Has bilateral support if both parent AND child have visible roots (strength > 0)
    const hasBilateralSupport = parentStrength > 0 && childStrength > 0;
    
    // An element is over-demanding if it requires more than parent can provide
    const isOverDemanding = selfStrength > parentStrength;
    
    // Check if parent is over-demanding from grandparent
    const grandparentElement = getParent(parentElement);
    const grandparentStrength = roots[grandparentElement] || 0;
    const parentIsOverDemanding = parentStrength > grandparentStrength;
    
    // Element is stable if: Has bilateral support AND NOT over-demanding AND parent not over-demanding
    const isStable = hasBilateralSupport && !isOverDemanding && !parentIsOverDemanding;
    
    stabilityAnalysis[element] = {
      hasBilateralSupport,
      isOverDemanding,
      parentIsOverDemanding,
      isStable,
      selfStrength,
      parentStrength,
      childStrength
    };
  }
  
  // Step 3: Select base element
  console.log('📊 STABILITY ANALYSIS:');
  candidates.forEach(element => {
    const s = stabilityAnalysis[element];
    console.log(`   ${element}: bilateral=${s.hasBilateralSupport}, overDemand=${s.isOverDemanding}, parentOverDemand=${s.parentIsOverDemanding} → stable=${s.isStable}`);
  });
  console.log('');
  
  // Filter to stable elements (excluding Fire)
  const stableCandidates = candidates.filter(element => {
    if (element === ELEMENTS.FIRE) return false;
    return stabilityAnalysis[element]?.isStable || false;
  });
  
  console.log('🔍 SELECTION LOGIC:');
  console.log('   Stable candidates:', stableCandidates);
  
  let baseElement: string;
  
  if (stableCandidates.length > 0) {
    // Sort stable candidates by root strength (highest first)
    stableCandidates.sort((a, b) => roots[b] - roots[a]);
    baseElement = stableCandidates[0];
    console.log(`   ✅ Selected from STABLE: ${baseElement} (strength: ${roots[baseElement]})`);
  } else {
    // Fallback: if no stable elements, choose highest root strength among non-Fire candidates
    // This handles cases where all elements have some instability
    const nonFireCandidates = candidates.filter(e => e !== ELEMENTS.FIRE);
    
    if (nonFireCandidates.length === 0) {
      console.error('   ❌ No valid candidates (only Fire)');
      return {
        success: false,
        error: 'No valid base element found: only Fire has visible roots or no elements have roots'
      };
    }
    
    // Among unstable elements, prefer those with bilateral support
    const withBilateralSupport = nonFireCandidates.filter(e => 
      stabilityAnalysis[e]?.hasBilateralSupport
    );
    
    if (withBilateralSupport.length > 0) {
      withBilateralSupport.sort((a, b) => roots[b] - roots[a]);
      baseElement = withBilateralSupport[0];
      console.log(`   ⚠️ FALLBACK (bilateral): ${baseElement} (strength: ${roots[baseElement]})`);
    } else {
      // Last resort: highest root strength
      nonFireCandidates.sort((a, b) => roots[b] - roots[a]);
      baseElement = nonFireCandidates[0];
      console.log(`   ⚠️⚠️ LAST RESORT (highest root): ${baseElement} (strength: ${roots[baseElement]})`);
    }
  }
  
  if (!baseElement) {
    console.error('❌ No base element determined');
    return {
      success: false,
      error: 'Unable to determine base element from chart'
    };
  }
  
  console.log('');
  
  // Step 4: Determine polarity
  const polarity = determinePolarity(baseElement, chart);
  console.log(`🔄 POLARITY: ${baseElement} → ${polarity}`);
  
  // Step 5: Map to specific ECM type
  const ecmType = mapToECMType(baseElement, polarity);
  console.log(`🎯 ECM TYPE: ${ecmType}`);
  console.log('');
  
  if (!ecmType) {
    console.error(`❌ Could not map ${baseElement} + ${polarity} to ECM type`);
    return {
      success: false,
      error: `Unable to map ${baseElement} + ${polarity} to ECM type`
    };
  }
  
  console.log('✅ ECM CALCULATION COMPLETE!');
  console.log(`   Result: ${ecmType} (${baseElement} ${polarity})`);
  console.log('============================================================\n');
  
  // Step 6: Return complete analysis
  return {
    success: true,
    type: ecmType,
    baseElement: baseElement,
    polarity: polarity,
    analysis: {
      roots: roots,
      candidates: candidates,
      stabilityAnalysis: stabilityAnalysis,
      selectedElement: {
        element: baseElement,
        strength: roots[baseElement],
        isStable: stabilityAnalysis[baseElement]?.isStable || false
      }
    }
  };
}

export default determineECMType;

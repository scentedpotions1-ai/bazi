import { useState, useEffect } from 'react';
import { BaziResult } from '../core/bazi';
import { transformBaziToECM } from '../lib/baziToEcm';
import { determineECMType, ECMTypeResult } from '../lib/ecmType';

interface ECMResultsProps {
  baziResult: BaziResult;
}

export function ECMResults({ baziResult }: ECMResultsProps) {
  const [ecmResult, setEcmResult] = useState<ECMTypeResult | null>(null);

  useEffect(() => {
    // Step 1: Transform BaZi to ECM format
    const ecmChart = transformBaziToECM(baziResult);
    
    // Step 2: Calculate ECM type
    const result = determineECMType(ecmChart);
    
    // Step 3: Set result for display
    setEcmResult(result);
  }, [baziResult]);

  if (!ecmResult) {
    return <div style={{ marginTop: '2rem' }}>Loading ECM analysis...</div>;
  }

  if (ecmResult.error || !ecmResult.success) {
    return (
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fee', border: '1px solid #c33', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0, color: '#c33' }}>ECM Analysis Error</h3>
        <p>{ecmResult.error || 'Analysis failed'}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '1.5rem' }}>
        Eight Constitution Medicine Analysis
      </h2>
      
      {/* Constitution Type */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'white', borderRadius: '6px', border: '2px solid #27ae60' }}>
        <h3 style={{ marginTop: 0, color: '#34495e', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          Constitution Type
        </h3>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60', marginBottom: '0.75rem' }}>
          {ecmResult.type}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <strong>Base Element:</strong>
          <span>{ecmResult.baseElement}</span>
          
          <strong>Polarity:</strong>
          <span>{ecmResult.polarity}</span>
        </div>
      </div>

      {/* Root Strength Analysis */}
      {ecmResult.analysis && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#34495e', fontSize: '1rem', marginBottom: '0.75rem' }}>
            Element Root Strength
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#34495e', color: 'white' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Element</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Root Strength</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ecmResult.analysis.roots)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([element, strength], idx) => {
                  const isBase = element === ecmResult.baseElement;
                  return (
                    <tr key={element} style={{ 
                      background: isBase ? '#d5f4e6' : (idx % 2 === 0 ? 'white' : '#f5f5f5'),
                      fontWeight: isBase ? 'bold' : 'normal'
                    }}>
                      <td style={{ padding: '0.5rem' }}>
                        {element} {isBase && '⭐'}
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {(strength as number).toFixed(1)}
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {isBase ? 'Base Element' : ecmResult.analysis?.candidates.includes(element) ? 'Candidate' : 'Not Rooted'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
            Root weights: Branch = 2.0, Visible Stem = 1.0
          </div>
        </div>
      )}

      {/* Generating Cycle Stability Analysis */}
      {ecmResult.analysis && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#34495e', fontSize: '1rem', marginBottom: '0.75rem' }}>
            Generating Cycle Stability Analysis
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#34495e', color: 'white' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Element</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Self</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Parent</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Child</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Bilateral?</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Over-demanding?</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ecmResult.analysis.candidates.map((element, idx) => {
                const stability = ecmResult.analysis!.stabilityAnalysis[element];
                const isSelected = element === ecmResult.baseElement;
                return (
                  <tr key={element} style={{ 
                    background: isSelected ? '#d5f4e6' : (idx % 2 === 0 ? 'white' : '#f5f5f5'),
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}>
                    <td style={{ padding: '0.5rem' }}>
                      {element} {isSelected && '⭐'}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      {stability.selfStrength.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      {stability.parentStrength.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      {stability.childStrength.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', color: stability.hasBilateralSupport ? '#27ae60' : '#e74c3c' }}>
                      {stability.hasBilateralSupport ? 'Yes ✓' : 'No ❌'}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      <div style={{ color: stability.isOverDemanding ? '#e74c3c' : '#27ae60' }}>
                        Self: {stability.isOverDemanding ? 'Yes ❌' : 'No ✓'}
                      </div>
                      <div style={{ color: stability.parentIsOverDemanding ? '#e74c3c' : '#27ae60', fontSize: '0.8em' }}>
                        Parent: {stability.parentIsOverDemanding ? 'Yes ❌' : 'No ✓'}
                      </div>
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: stability.isStable ? '#27ae60' : '#95a5a6' }}>
                      {stability.isStable ? 'STABLE ✓' : 'Unstable'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
            <strong>Stable elements must have:</strong> (1) Bilateral support (parent & child both exist), 
            (2) NOT over-demanding from parent, (3) Parent is also NOT over-demanding
          </div>
        </div>
      )}

      {/* Chart Visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e', fontSize: '1rem', marginBottom: '0.75rem' }}>
          Four Pillars Chart
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
          {(['hour', 'day', 'month', 'year'] as const).map((pillarKey) => {
            const pillar = pillarKey.charAt(0).toUpperCase() + pillarKey.slice(1);
            const stemData = baziResult.chart[pillarKey].stem;
            const branchData = baziResult.chart[pillarKey].branch;
            
            return (
              <div key={pillar} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '0.5rem',
                background: 'white'
              }}>
                <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#34495e' }}>
                  {pillar}
                </div>
                <div style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {stemData.chinese}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                  {stemData.element}
                </div>
                <div style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {branchData.chinese}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#7f8c8d' }}>
                  {branchData.element}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Info Summary */}
      <div style={{ padding: '1rem', background: '#ecf0f1', borderRadius: '6px', fontSize: '0.85rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem' }}>
          <strong>Name:</strong>
          <span>{baziResult.personalInfo.name}</span>
          
          <strong>Birth Date:</strong>
          <span>{baziResult.personalInfo.dateOfBirth}</span>
          
          <strong>Birth Time:</strong>
          <span>{baziResult.personalInfo.timeOfBirth} (Solar: {baziResult.personalInfo.solarTime})</span>
          
          <strong>Location:</strong>
          <span>{baziResult.personalInfo.locationDisplayName}</span>
          
          <strong>Timezone:</strong>
          <span>{baziResult.personalInfo.timezone} {baziResult.personalInfo.isDST ? '(DST)' : ''}</span>
        </div>
      </div>
    </div>
  );
}

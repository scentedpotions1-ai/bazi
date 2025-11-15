import { useState, useEffect } from 'react';
import { BaziResult } from '../core/bazi';
import { baziToCanonPillars } from '../lib/baziToCanon';
import { analyzeCanon77 } from '../lib/ecm';

interface CanonAnalyzerProps {
  baziResult: BaziResult;
}

export function CanonAnalyzer({ baziResult }: CanonAnalyzerProps) {
  const [canonResult, setCanonResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const pillars = baziToCanonPillars(baziResult);
      const result = analyzeCanon77(pillars);
      setCanonResult(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Canon analysis failed');
      setCanonResult(null);
    }
  }, [baziResult]);

  if (error) {
    return (
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fee', border: '1px solid #c33', borderRadius: '4px' }}>
        <h3>Canon Analysis Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!canonResult) {
    return <div style={{ marginTop: '2rem' }}>Analyzing constitution...</div>;
  }

  const { json, markdown } = canonResult;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canon-${json.constitution.type}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canon-${json.constitution.type}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Canon 7.7 · Eight Constitution Medicine</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e' }}>Constitution Type</h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60', marginBottom: '0.5rem' }}>
          {json.constitution.type}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.95rem' }}>
          <strong>Polarity:</strong>
          <span>{json.constitution.polarity.charAt(0).toUpperCase() + json.constitution.polarity.slice(1)}</span>
          
          <strong>Respiratory Type:</strong>
          <span>{json.respiratoryType}</span>
          
          <strong>Organ Flow (5→1):</strong>
          <span>{json.constitution.flow.join(' → ')}</span>
          
          <strong>Sibling:</strong>
          <span>{json.constitution.sibling}</span>
          
          <strong>Opposite:</strong>
          <span>{json.constitution.opposite}</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e' }}>Element Distribution</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#34495e', color: 'white' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Element</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Total</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Yang</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Yin</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Strength</th>
            </tr>
          </thead>
          <tbody>
            {['wood', 'fire', 'earth', 'metal', 'water'].map((el, idx) => (
              <tr key={el} style={{ background: idx % 2 === 0 ? 'white' : '#f5f5f5' }}>
                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{el.charAt(0).toUpperCase() + el.slice(1)}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{json.elements[el].count}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{json.elements[el].polarity.yang}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{json.elements[el].polarity.yin}</td>
                <td style={{ padding: '0.5rem' }}>{json.elements[el].strength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e' }}>Station Strengths</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#34495e', color: 'white' }}>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Station</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Organ</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Element</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Count</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Strength</th>
            </tr>
          </thead>
          <tbody>
            {json.stationStrengths.map((station: any, idx: number) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : '#f5f5f5' }}>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{station.station}</td>
                <td style={{ padding: '0.5rem' }}>{station.organ}</td>
                <td style={{ padding: '0.5rem' }}>{station.element}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{station.count}</td>
                <td style={{ padding: '0.5rem' }}>{station.strength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e' }}>Structural Confidence</h3>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2980b9' }}>
          {json.scoring.totalStructuralConfidence.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
          Based on: Five Element Completeness, Dominant Consistency, Polarity Gate Clarity, 
          Organ Flow Completion, Pair Coherence, Distribution Balance
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#34495e' }}>Audit Checks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.5rem', fontSize: '0.9rem' }}>
          <span>Polarity Validation:</span>
          <span style={{ color: json.audit.polarityValidation ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>
            {json.audit.polarityValidation ? '✓ Pass' : '✗ Fail'}
          </span>
          
          <span>Elemental Coherence:</span>
          <span style={{ color: json.audit.elementalCoherence ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>
            {json.audit.elementalCoherence ? '✓ Pass' : '✗ Fail'}
          </span>
          
          <span>Canonical Flow Integrity:</span>
          <span style={{ color: json.audit.canonicalFlowIntegrity ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>
            {json.audit.canonicalFlowIntegrity ? '✓ Pass' : '✗ Fail'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={downloadJSON}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Download JSON
        </button>
        <button
          onClick={downloadMarkdown}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Download Markdown
        </button>
      </div>
    </div>
  );
}

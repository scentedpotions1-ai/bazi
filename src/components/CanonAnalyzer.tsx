import { useState, useMemo } from 'react';
import { BaziResult } from '../core/bazi';
import { analyzeCanon77, CanonResult } from '../../ecm/canon77_revA';
import { baziToCanonPillars } from '../lib/baziToCanon';

interface CanonAnalyzerProps {
  baziResult: BaziResult;
}

export function CanonAnalyzer({ baziResult }: CanonAnalyzerProps) {
  const [canonResult, setCanonResult] = useState<CanonResult | null>(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      // Convert BaZi format to Canon format
      const pillars = baziToCanonPillars(baziResult);
      
      console.log('Running Canon 7.7 analysis with pillars:', pillars);
      
      // Run Canon 7.7 analysis directly (matching client's implementation)
      const result = analyzeCanon77(pillars);
      
      console.log('Canon 7.7 result:', result);
      
      setCanonResult(result);
      setShowMarkdown(false);
    } catch (error) {
      console.error('Canon analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      alert(`Error running Canon analysis: ${errorMessage}\n\nPlease check the console for details.`);
    }
  };

  function DownloadButton({ filename, data, mime }: { filename: string; data: string; mime: string }) {
    const href = useMemo(() => {
      const blob = new Blob([data], { type: mime });
      return URL.createObjectURL(blob);
    }, [data, mime]);
    
    return (
      <a
        href={href}
        download={filename}
        style={{
          padding: '10px 15px',
          fontSize: '14px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        📥 {filename}
      </a>
    );
  }

  const handleReset = () => {
    setCanonResult(null);
    setShowMarkdown(false);
    setError(null);
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      border: '1px solid #ddd'
    }}>
      <h2 style={{ 
        marginTop: 0,
        fontSize: '24px',
        marginBottom: '10px'
      }}>
        🜂 Canon 7.7 · Revision A — Runner
      </h2>
      
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px', opacity: 0.8 }}>
        Enter BaZi Four Pillars (Heavenly Stem & Earthly Branch). Hidden stems are computed internally.
      </p>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!canonResult ? (
        <button
          onClick={handleAnalyze}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Run Canon 7.7 Rev A
        </button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {/* Download Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
            <DownloadButton
              filename="canon77_revA_output.json"
              data={JSON.stringify(canonResult.json, null, 2)}
              mime="application/json"
            />
            <DownloadButton
              filename="canon77_revA_report.md"
              data={canonResult.markdown}
              mime="text/markdown"
            />
          </div>

          {/* Summary Section - Matching client's exact format */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Summary</h2>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Day Master:</strong> {canonResult.json.case.dayMaster}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Constitution:</strong> {canonResult.json.constitution.type} — {canonResult.json.constitution.polarity}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Organ Flow (5→1):</strong> {canonResult.json.constitution.flow.join(' → ')}
              </div>
              <div>
                <strong>Confidence (structural):</strong> {canonResult.json.scoring.totalStructuralConfidence}
              </div>
            </div>
          </div>

          {/* Element Matrix Section */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Element Matrix</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '640px', border: '1px solid #ddd', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {['Pillar', 'Wood', 'Fire', 'Earth', 'Metal', 'Water', 'Total'].map(h => (
                      <th key={h} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {canonResult.json.tables.elementMatrix.map((r: any, i: number) => (
                    <tr key={i}>
                      {r.map((c: any, j: number) => (
                        <td key={j} style={{ border: '1px solid #ddd', padding: '8px' }}>
                          {String(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vertical Totals Table */}
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ minWidth: '480px', border: '1px solid #ddd', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {['Element', 'Total', 'Yang', 'Yin', 'Strength'].map(h => (
                      <th key={h} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(el => (
                    <tr key={el}>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textTransform: 'capitalize' }}>{el}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{canonResult.json.tables.verticalTotals[el]}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{canonResult.json.elements[el].polarity.yang}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{canonResult.json.elements[el].polarity.yin}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{canonResult.json.elements[el].strength}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '600' }}>Stems Total</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '600' }}>{canonResult.json.tables.verticalTotals.stemsTotal}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '600' }}>{canonResult.json.polaritySummary.yang}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '600' }}>{canonResult.json.polaritySummary.yin}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Station Strengths Section */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Station Strengths</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '720px', border: '1px solid #ddd', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {['Station', 'Organ', 'Element', 'Count', 'Strength', 'Sources'].map(h => (
                      <th key={h} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {canonResult.json.stationStrengths.map((s: any, i: number) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{s.station}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{s.organ}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{s.element}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{s.count}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{s.strength}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {s.sources.map((x: any) => `${x.slot}:${x.stem}${x.visibility === 'hidden' ? '(hid)' : ''}`).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Markdown Report Section */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Markdown Report (raw)</h2>
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              {showMarkdown ? '▼ Hide Report' : '▶ Show Report'}
            </button>
            
            {showMarkdown && (
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                maxHeight: '400px',
                overflowY: 'auto',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {canonResult.markdown}
              </pre>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#9E9E9E',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 New Analysis
          </button>
        </div>
      )}
    </div>
  );
}

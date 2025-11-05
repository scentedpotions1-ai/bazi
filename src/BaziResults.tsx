import 'react';
import { BaziResult, Pillar } from './bazi';

interface BaziResultsProps {
  result: BaziResult;
  onReset: () => void;
}

function PillarDisplay({ pillar, title }: { pillar: Pillar; title: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '2px solid #ddd'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>{title}</h3>
      
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>
        {pillar.stem.chinese}{pillar.branch.chinese}
      </div>
      
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
        {pillar.stem.english} {pillar.branch.english}
      </div>
      
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>
        {pillar.stem.element}
      </div>
      
      <div style={{ fontSize: '13px', color: '#888' }}>
        {pillar.branch.element} ({pillar.branch.animal})
      </div>
    </div>
  );
}

export function BaziResults({ result, onReset }: BaziResultsProps) {
  const { personalInfo, chart, analysis } = result;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        BaZi Chart for {personalInfo.name}
      </h1>

      {/* Personal Info */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ marginTop: 0 }}>Birth Information</h2>
        <p><strong>Date of Birth:</strong> {personalInfo.dateOfBirth}</p>
        <p><strong>Time of Birth:</strong> {personalInfo.timeOfBirth}</p>
        <p><strong>Place of Birth:</strong> {personalInfo.locationDisplayName}</p>
        <p><strong>Coordinates:</strong> {personalInfo.coordinates.latitude.toFixed(4)}°N, {personalInfo.coordinates.longitude.toFixed(4)}°E</p>
        <p><strong>Timezone:</strong> {personalInfo.timezone}</p>
        <p><strong>DST Applied:</strong> {personalInfo.isDST ? 'Yes' : 'No'}</p>
        <p><strong>Solar Time:</strong> {personalInfo.solarTime} (correction: {personalInfo.solarCorrection > 0 ? '+' : ''}{personalInfo.solarCorrection} min)</p>
      </div>

      {/* Four Pillars Chart */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Four Pillars (八字)</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <PillarDisplay pillar={chart.hour} title="Hour Pillar (时柱)" />
          <PillarDisplay pillar={chart.day} title="Day Pillar (日柱)" />
          <PillarDisplay pillar={chart.month} title="Month Pillar (月柱)" />
          <PillarDisplay pillar={chart.year} title="Year Pillar (年柱)" />
        </div>
      </div>

      {/* Analysis */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ marginTop: 0 }}>Analysis</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Personal Element (Day Master)</h3>
          <p style={{ fontSize: '24px', margin: '10px 0' }}>
            {analysis.personalElement.chinese} ({analysis.personalElement.english})
          </p>
          <p style={{ color: '#666' }}>{analysis.personalElement.element}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Element Distribution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {Object.entries(analysis.elements).map(([element, count]) => (
              <div key={element} style={{
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{element}</div>
                <div style={{ fontSize: '24px', color: '#4CAF50' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Element Details</h3>
          {Object.entries(analysis.elementDetails).map(([element, details]) => (
            details.length > 0 && (
              <div key={element} style={{ marginBottom: '10px' }}>
                <strong>{element}:</strong>{' '}
                {details.map((d, i) => (
                  <span key={i}>
                    {d.character} ({d.fullElement}, {d.type}, {d.pillar})
                    {i < details.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )
          ))}
        </div>

        <div>
          <h3>Constitution</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            {analysis.constitution}
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Calculate Another Chart
      </button>
    </div>
  );
}

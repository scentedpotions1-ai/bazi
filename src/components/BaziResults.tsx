import { BaziResult, Pillar } from '../core/bazi';
import { ECMResults } from './ECMResults';
import { useNavigate } from 'react-router-dom';

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
  const { personalInfo, chart } = result;
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        BaZi Chart for {personalInfo.name}
      </h1>

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

      <ECMResults baziResult={result} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: 'hsl(262 83% 58%)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          View Health Profile
        </button>
        <button
          onClick={onReset}
          style={{
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
    </div>
  );
}

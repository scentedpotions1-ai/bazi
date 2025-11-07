import { useState } from 'react';
import { BaziForm } from './components/BaziForm';
import { BaziResults } from './components/BaziResults';
import { calculateBazi, BaziResult } from './core/bazi';

function App() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  }) => {
    setIsCalculating(true);
    setError(null);

    try {
      const baziResult = await calculateBazi(
        data.name,
        data.dateOfBirth,
        data.timeOfBirth,
        data.placeOfBirth
      );
      setResult(baziResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error calculating BaZi:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      {error && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ef5350'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={handleReset}
            style={{
              marginLeft: '15px',
              padding: '5px 10px',
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!result ? (
        <BaziForm onCalculate={handleCalculate} isCalculating={isCalculating} />
      ) : (
        <BaziResults result={result} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;

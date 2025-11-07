import { useState } from 'react';

interface BaziFormProps {
  onCalculate: (data: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  }) => void;
  isCalculating: boolean;
}

export function BaziForm({ onCalculate, isCalculating }: BaziFormProps) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({ name, dateOfBirth, timeOfBirth, placeOfBirth });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        BaZi Four Pillars Calculator
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Date of Birth:
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Time of Birth (24-hour format):
          </label>
          <input
            type="time"
            value={timeOfBirth}
            onChange={(e) => setTimeOfBirth(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Place of Birth:
          </label>
          <input
            type="text"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="e.g., Mumbai, India or New York, USA"
          />
          <small style={{ color: '#666', fontSize: '14px', marginTop: '4px', display: 'block' }}>
            Include city and country for accurate timezone detection
          </small>
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          style={{
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: isCalculating ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isCalculating ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {isCalculating ? 'Calculating...' : 'Calculate BaZi'}
        </button>
      </form>
    </div>
  );
}

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

// Test users data
const TEST_USERS = [
  {
    name: 'Jelani',
    dateOfBirth: '1963-08-12',
    timeOfBirth: '06:20',
    placeOfBirth: 'New York, New York USA'
  },
  {
    name: 'Jani',
    dateOfBirth: '1983-03-30',
    timeOfBirth: '12:05',
    placeOfBirth: 'Panama City, Panama'
  }
];

export function BaziForm({ onCalculate, isCalculating }: BaziFormProps) {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate({ name, dateOfBirth, timeOfBirth, placeOfBirth });
  };

  const loadTestUser = (index: number) => {
    const user = TEST_USERS[index];
    setName(user.name);
    setDateOfBirth(user.dateOfBirth);
    setTimeOfBirth(user.timeOfBirth);
    setPlaceOfBirth(user.placeOfBirth);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        BaZi Four Pillars Calculator
      </h1>

      {/* Test Users Buttons */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#555' }}>
          Quick Test Users:
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadTestUser(0)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Jelani
          </button>
          <button
            type="button"
            onClick={() => loadTestUser(1)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Jani
          </button>
        </div>
      </div>
      
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

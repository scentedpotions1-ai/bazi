import { useState } from 'react';
import { BaziForm } from '../components/BaziForm';
import { BaziResults } from '../components/BaziResults';
import { BaziResult } from '../core/bazi';
import { Card } from '../components/ui/card';

export function Calculator() {
  const [result, setResult] = useState<BaziResult | null>(null);

  const handleCalculate = (newResult: BaziResult) => {
    setResult(newResult);
    
    // Save to localStorage for Profile page
    const dataToSave = {
      bazi: newResult.bazi,
      ecm: newResult.ecm,
      input: newResult.input,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lastBaziCalculation', JSON.stringify(dataToSave));
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">BaZi Calculator</h1>
          <p className="mt-2 text-gray-600">
            Enter your birth information to calculate your Four Pillars and ECM constitution type.
          </p>
        </div>

        <Card className="p-6">
          {!result ? (
            <BaziForm onCalculate={handleCalculate} />
          ) : (
            <BaziResults result={result} onReset={handleReset} />
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';
import React from 'react';

type Pillar = { stem: string; branch: string };
type Pillars = { year: Pillar; month: Pillar; day: Pillar; hour: Pillar };

export default function CanonRunner() {
  const [pillars, setPillars] = React.useState<Pillars>({
    year:  { stem: '', branch: '' },
    month: { stem: '', branch: '' },
    day:   { stem: '', branch: '' },
    hour:  { stem: '', branch: '' },
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ json: any; markdown: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function update(slot: keyof Pillars, field: keyof Pillar, value: string) {
    setPillars(p => ({ ...p, [slot]: { ...p[slot], [field]: value } }));
  }

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/canon77', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pillars })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function DownloadButton({ filename, data, mime }: { filename: string; data: string; mime: string }) {
    const href = React.useMemo(() => {
      const blob = new Blob([data], { type: mime });
      return URL.createObjectURL(blob);
    }, [data, mime]);
    return (
      <a
        href={href}
        download={filename}
        className="px-3 py-2 rounded-xl shadow border inline-block"
      >
        Download {filename}
      </a>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Canon 7.7 · Revision A — Runner</h1>
      <p className="text-sm opacity-80">Enter BaZi Four Pillars (Heavenly Stem & Earthly Branch). Hidden stems are computed internally.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['year','month','day','hour'] as const).map(slot => (
          <div key={slot} className="border rounded-xl p-3">
            <div className="font-medium capitalize">{slot}</div>
            <label className="block text-xs mt-2">Heavenly Stem</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={pillars[slot].stem}
              onChange={e => update(slot,'stem', e.target.value.trim())}
              placeholder="e.g., 丁"
            />
            <label className="block text-xs mt-2">Earthly Branch</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={pillars[slot].branch}
              onChange={e => update(slot,'branch', e.target.value.trim())}
              placeholder="e.g., 巳"
            />
          </div>
        ))}
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
      >
        {loading ? 'Running…' : 'Run Canon 7.7 Rev A'}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <DownloadButton
              filename="canon77_revA_output.json"
              data={JSON.stringify(result.json, null, 2)}
              mime="application/json"
            />
            <DownloadButton
              filename="canon77_revA_report.md"
              data={result.markdown}
              mime="text/markdown"
            />
          </div>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div className="text-sm">
              <div><b>Day Master:</b> {result.json.case.dayMaster}</div>
              <div><b>Constitution:</b> {result.json.constitution.type} — {result.json.constitution.polarity}</div>
              <div><b>Organ Flow (5→1):</b> {result.json.constitution.flow.join(' → ')}</div>
              <div><b>Confidence (structural):</b> {result.json.scoring.totalStructuralConfidence}</div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Element Matrix</h2>
            <div className="overflow-auto">
              <table className="min-w-[640px] border">
                <thead>
                  <tr>
                    {['Pillar','Wood','Fire','Earth','Metal','Water','Total'].map(h=>(
                      <th key={h} className="border px-2 py-1 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.json.tables.elementMatrix.map((r: any, i: number) => (
                    <tr key={i}>
                      {r.map((c: any, j: number) => (
                        <td key={j} className="border px-2 py-1">{String(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-auto">
              <table className="min-w-[480px] border mt-3">
                <thead>
                  <tr>
                    {['Element','Total','Yang','Yin','Strength'].map(h=>(
                      <th key={h} className="border px-2 py-1 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['wood','fire','earth','metal','water'] as const).map(el => (
                    <tr key={el}>
                      <td className="border px-2 py-1 capitalize">{el}</td>
                      <td className="border px-2 py-1">{result.json.tables.verticalTotals[el]}</td>
                      <td className="border px-2 py-1">{result.json.elements[el].polarity.yang}</td>
                      <td className="border px-2 py-1">{result.json.elements[el].polarity.yin}</td>
                      <td className="border px-2 py-1">{result.json.elements[el].strength}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="border px-2 py-1 font-semibold">Stems Total</td>
                    <td className="border px-2 py-1 font-semibold">{result.json.tables.verticalTotals.stemsTotal}</td>
                    <td className="border px-2 py-1 font-semibold">{result.json.polaritySummary.yang}</td>
                    <td className="border px-2 py-1 font-semibold">{result.json.polaritySummary.yin}</td>
                    <td className="border px-2 py-1">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Station Strengths</h2>
            <div className="overflow-auto">
              <table className="min-w-[720px] border">
                <thead>
                  <tr>
                    {['Station','Organ','Element','Count','Strength','Sources'].map(h=>(
                      <th key={h} className="border px-2 py-1 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.json.stationStrengths.map((s: any, i: number) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{s.station}</td>
                      <td className="border px-2 py-1">{s.organ}</td>
                      <td className="border px-2 py-1">{s.element}</td>
                      <td className="border px-2 py-1">{s.count}</td>
                      <td className="border px-2 py-1">{s.strength}</td>
                      <td className="border px-2 py-1">
                        {s.sources.map((x: any) => `${x.slot}:${x.stem}${x.visibility==='hidden'?'(hid)':''}`).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Markdown Report (raw)</h2>
            <pre className="bg-neutral-100 p-3 rounded max-h-96 overflow-auto text-sm whitespace-pre-wrap">
{result.markdown}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}

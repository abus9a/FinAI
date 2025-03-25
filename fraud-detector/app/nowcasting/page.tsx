"use client"
import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';

interface NowcastResult {
  gdpGrowth: number;
  recessionRisk: number;
  regime: string;
  trendData: any[];
}

export default function Nowcasting() {
  const [inflation, setInflation] = useState('4.5');
  const [interestRate, setInterestRate] = useState('5.25');
  const [pmi, setPmi] = useState('48.5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NowcastResult | null>(null);

  const calculateNowcast = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const inf = parseFloat(inflation);
      const rate = parseFloat(interestRate);
      const pmiVal = parseFloat(pmi);

      const pmiEffect = (pmiVal - 50) * 0.15;
      const rateEffect = (2.5 - rate) * 0.2;
      const infEffect = (2.0 - inf) * 0.1;

      const baseGDP = 2.0;
      const currentGdp = baseGDP + pmiEffect + rateEffect + infEffect;

      let risk = 15;
      if (pmiVal < 50) risk += (50 - pmiVal) * 4;
      if (rate > 4.0) risk += (rate - 4.0) * 5;
      if (inf > 3.0) risk += (inf - 3.0) * 2;
      
      const finalRisk = Math.min(99, Math.max(1, risk));

      let currentRegime = 'Expansion';
      if (currentGdp < 0 && inf > 4.0) currentRegime = 'Stagflation';
      else if (currentGdp < 0) currentRegime = 'Contraction';
      else if (currentGdp > 0 && currentGdp < 1.5) currentRegime = 'Slowdown';

      const historicalData = [
        { quarter: 'Q1 2025', gdp: 2.4 },
        { quarter: 'Q2 2025', gdp: 2.1 },
        { quarter: 'Q3 2025', gdp: 1.8 },
        { quarter: 'Q4 2025', gdp: 1.2 },
        { quarter: 'Q1 2026', gdp: 0.8 },
        { quarter: 'Nowcast', gdp: Number(currentGdp.toFixed(2)) }
      ];

      setResult({
        gdpGrowth: Number(currentGdp.toFixed(2)),
        recessionRisk: Number(finalRisk.toFixed(0)),
        regime: currentRegime,
        trendData: historicalData
      });

      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-1 h-fit">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Macro Nowcast</h1>
          <p className="text-sm text-gray-500 mb-8">Real-time GDP & Risk estimation.</p>
          
          <form onSubmit={calculateNowcast} className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Inflation (CPI %)</label>
                <span className="text-sm font-bold text-indigo-600">{inflation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                <span className="text-sm font-bold text-indigo-600">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Manuf. PMI</label>
                <span className={`text-sm font-bold ${parseFloat(pmi) >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {pmi}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                step="0.5"
                value={pmi}
                onChange={(e) => setPmi(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-gray-400 mt-1">&gt; 50 indicates expansion</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 mt-4"
            >
              {loading ? 'Computing Matrix...' : 'Update Nowcast'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Real GDP Growth Tracker</h2>
            {result && (
              <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-md uppercase tracking-wide">
                Live Estimate
              </span>
            )}
          </div>
          
          {result ? (
            <>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="quarter" 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      dy={10}
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`${value}%`, 'GDP Growth']}
                    />
                    <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="gdp" 
                      stroke="#4F46E5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorGdp)" 
                      activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className={`p-5 rounded-xl border ${result.gdpGrowth >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${result.gdpGrowth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    Nowcast GDP Growth
                  </p>
                  <p className={`text-3xl font-bold ${result.gdpGrowth >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {result.gdpGrowth > 0 ? '+' : ''}{result.gdpGrowth}%
                  </p>
                </div>
                
                <div className={`p-5 rounded-xl border ${result.recessionRisk > 50 ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${result.recessionRisk > 50 ? 'text-orange-700' : 'text-blue-700'}`}>
                    Recession Probability
                  </p>
                  <p className={`text-3xl font-bold ${result.recessionRisk > 50 ? 'text-orange-900' : 'text-blue-900'}`}>
                    {result.recessionRisk}%
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Economic Regime</p>
                  <p className="text-xl font-bold text-gray-900">{result.regime}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <p>Adjust macroeconomic indicators to generate real-time Nowcast.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
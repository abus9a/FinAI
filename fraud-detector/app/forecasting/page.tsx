"use client"
import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';

interface ForecastData {
  month: string;
  historical: number | null;
  forecast: number | null;
  lowerBound: number | null;
  upperBound: number | null;
}

interface ForecastResult {
  data: ForecastData[];
  growthRate: number;
  totalVolume: number;
  confidence: number;
}

export default function Forecasting() {
  const [category, setCategory] = useState('electronics');
  const [horizon, setHorizon] = useState('6');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);

  const generateForecast = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIndex = 5; 
      const forecastHorizon = parseInt(horizon);
      
      const newData: ForecastData[] = [];
      let lastValue = Math.floor(Math.random() * 5000) + 10000;
      let totalPredicted = 0;

      for (let i = 0; i <= currentMonthIndex; i++) {
        lastValue = lastValue + (Math.random() * 2000 - 800);
        newData.push({
          month: months[i],
          historical: Math.round(lastValue),
          forecast: null,
          lowerBound: null,
          upperBound: null
        });
      }

      const connectionPoint = { ...newData[currentMonthIndex] };
      connectionPoint.forecast = connectionPoint.historical;
      newData[currentMonthIndex] = connectionPoint;

      let trend = category === 'electronics' ? 1.05 : category === 'clothing' ? 1.02 : 1.08;

      for (let i = 1; i <= forecastHorizon; i++) {
        const targetIndex = (currentMonthIndex + i) % 12;
        lastValue = lastValue * trend + (Math.random() * 1000 - 500);
        
        const variance = lastValue * 0.08 * (i * 0.5);
        
        totalPredicted += lastValue;

        newData.push({
          month: months[targetIndex],
          historical: null,
          forecast: Math.round(lastValue),
          lowerBound: Math.round(lastValue - variance),
          upperBound: Math.round(lastValue + variance)
        });
      }

      const firstHistorical = newData[0].historical || 1;
      const lastForecast = newData[newData.length - 1].forecast || 1;
      const growth = ((lastForecast - firstHistorical) / firstHistorical) * 100;

      setResult({
        data: newData,
        growthRate: growth,
        totalVolume: Math.round(totalPredicted),
        confidence: Math.max(75, 95 - (forecastHorizon * 2))
      });
      
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-1 h-fit">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Predictive Sales</h1>
          <p className="text-sm text-gray-500 mb-8">Time-series forecasting engine.</p>
          
          <form onSubmit={generateForecast} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Apparel & Clothing</option>
                <option value="software">Software Subscriptions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Horizon</label>
              <select
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="9">9 Months</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 mt-2"
            >
              {loading ? 'Analyzing Data...' : 'Run Forecast Model'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Projection Curve</h2>
            {result && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wide">
                Prophet AI Model
              </span>
            )}
          </div>
          
          {result ? (
            <>
              <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={result.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      dy={10}
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any, name: any) => {
                        const formattedValue = typeof value === 'number' ? `${value.toLocaleString()} KZT` : value;
                        const names: Record<string, string> = {
                          historical: 'Historical Sales',
                          forecast: 'Projected Sales',
                          upperBound: 'Optimistic Scenario',
                          lowerBound: 'Pessimistic Scenario'
                        };
                        return [formattedValue, typeof name === 'string' ? names[name] || name : name];
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    
                    <Area 
                      type="monotone" 
                      dataKey="upperBound" 
                      stroke="none" 
                      fill="#818CF8" 
                      fillOpacity={0.1} 
                      activeDot={false}
                      name="Confidence Interval"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lowerBound" 
                      stroke="none" 
                      fill="#fff" 
                      fillOpacity={1} 
                      activeDot={false}
                      legendType="none"
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="#111827" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#111827' }} 
                      name="Historical"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#4F46E5" 
                      strokeWidth={3} 
                      strokeDasharray="5 5" 
                      dot={{ r: 4, fill: '#4F46E5' }} 
                      name="Forecast"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Projected Trend</p>
                  <p className={`text-xl font-bold ${result.growthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.growthRate > 0 ? '+' : ''}{result.growthRate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Forecast Vol.</p>
                  <p className="text-xl font-bold text-gray-900">{result.totalVolume.toLocaleString()} KZT</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Model Confidence</p>
                  <p className="text-xl font-bold text-gray-900">{result.confidence}%</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>Select parameters to generate future sales projection.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
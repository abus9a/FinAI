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

interface PricingResult {
  optimalPrice: number;
  expectedDemand: number;
  projectedRevenue: number;
  margin: number;
}

export default function Pricing() {
  const [productId, setProductId] = useState('');
  const [basePrice, setBasePrice] = useState('10000');
  const [cost, setCost] = useState('6000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);

  const calculateOptimalPrice = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const p = parseFloat(basePrice);
      const c = parseFloat(cost);
      
      const optimal = (p + c) / 2 + (p * 0.1); 
      const demand = Math.max(10, 500 - (optimal * 0.02)); 
      
      setResult({
        optimalPrice: optimal,
        expectedDemand: Math.round(demand),
        projectedRevenue: optimal * Math.round(demand),
        margin: ((optimal - c) / optimal) * 100
      });
      setLoading(false);
    }, 600);
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    const data = [];
    const c = parseFloat(cost);
    const minPrice = c;
    const maxPrice = parseFloat(basePrice) * 1.5;
    const step = (maxPrice - minPrice) / 20;

    for (let price = minPrice; price <= maxPrice; price += step) {
      const simulatedDemand = Math.max(0, 500 - (price * 0.02));
      const revenue = price * simulatedDemand;
      data.push({
        price: Math.round(price),
        revenue: Math.round(revenue),
        demand: Math.round(simulatedDemand)
      });
    }
    return data;
  }, [result, basePrice, cost]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-1 h-fit">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Dynamic Pricing AI</h1>
          <p className="text-sm text-gray-500 mb-8">Revenue optimization engine.</p>
          
          <form onSubmit={calculateOptimalPrice} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product SKU / ID</label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="PROD-992"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Base Price (KZT)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Cost (KZT)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 mt-2"
            >
              {loading ? 'Optimizing...' : 'Calculate Optimal Price'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-2 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Price Elasticity & Revenue Curve</h2>
          
          {result ? (
            <>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="price" 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      name="Price (KZT)"
                    />
                    <YAxis 
                      tick={{fontSize: 12}} 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
  formatter={(value: any, name: any) => {
    const formattedValue = name === 'revenue' && typeof value === 'number' 
      ? `${value.toLocaleString()} KZT` 
      : value;
    const formattedName = typeof name === 'string' 
      ? name.charAt(0).toUpperCase() + name.slice(1) 
      : name;
    return [formattedValue, formattedName];
  }}
  labelFormatter={(label) => `Price: ${label} KZT`}
/>
                    <ReferenceLine 
                      x={Math.round(result.optimalPrice)} 
                      stroke="#4F46E5" 
                      strokeDasharray="3 3"
                      label={{ position: 'top', value: 'Optimal', fill: '#4F46E5', fontSize: 12, fontWeight: 'bold' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Optimal Price</p>
                  <p className="text-xl font-bold text-indigo-900">{Math.round(result.optimalPrice).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Max Revenue</p>
                  <p className="text-xl font-bold text-green-900">{result.projectedRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Est. Demand</p>
                  <p className="text-xl font-bold text-blue-900">{result.expectedDemand} units</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Profit Margin</p>
                  <p className="text-xl font-bold text-amber-900">{result.margin.toFixed(1)}%</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              Enter product details to generate pricing model.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
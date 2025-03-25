"use client"
import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface TransactionRecord {
  index: number;
  amount: number;
  is_anomaly: boolean;
}

interface DetectionResult {
  is_anomaly: boolean;
  status: string;
  model_used: string;
  history_length: number;
  history: TransactionRecord[];
}

export default function Home() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: userId,
          amount: parseFloat(amount) 
        }),
      });
      const data = await response.json();
      setResult(data);
      setAmount('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!result || result.history.length === 0) return;

    const headers = ['Transaction ID', 'Amount (KZT)', 'Is Anomaly'];
    const rows = result.history.map(record => [
      record.index.toString(),
      record.amount.toString(),
      record.is_anomaly ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${userId}_audit_log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = useMemo(() => {
    return result?.history.map(item => ({
      ...item,
      anomalyValue: item.is_anomaly ? item.amount : null,
      normalValue: item.amount
    })) || [];
  }, [result]);

  const metrics = useMemo(() => {
    if (!result || result.history.length === 0) return { avg: 0, stdDev: 0 };
    const amounts = result.history.map(item => item.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    return { avg: avg.toFixed(2), stdDev: stdDev.toFixed(2) };
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-1 h-fit">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Fraud AI</h1>
          <p className="text-sm text-gray-500 mb-8">Behavioral time-series analysis.</p>
          
          <form onSubmit={checkTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="client_01"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KZT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 mt-4"
            >
              {loading ? 'Processing...' : 'Analyze'}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-4 rounded-xl border ${result.is_anomaly ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${result.is_anomaly ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <h3 className={`font-bold ${result.is_anomaly ? 'text-red-900' : 'text-green-900'}`}>
                  {result.status}
                </h3>
              </div>
              <div className="text-xs space-y-1 text-gray-700">
                <p>Engine: <span className="font-semibold">{result.model_used}</span></p>
                <p>Total Tx: <span className="font-semibold">{result.history_length}</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 md:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            {result && result.history.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-200"
              >
                Export CSV
              </button>
            )}
          </div>
          
          {chartData.length > 0 ? (
            <>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="index" tick={{fontSize: 12}} stroke="#9CA3AF" />
                    <YAxis tick={{fontSize: 12}} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="normalValue" 
                      stroke="#4F46E5" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#4F46E5' }} 
                      name="Amount"
                    />
                    <Scatter 
                      dataKey="anomalyValue" 
                      fill="#EF4444" 
                      name="Anomaly"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Average Value</p>
                  <p className="text-2xl font-bold text-indigo-900">{metrics.avg} <span className="text-sm font-medium opacity-70">KZT</span></p>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-1">Standard Deviation</p>
                  <p className="text-2xl font-bold text-purple-900">±{metrics.stdDev} <span className="text-sm font-medium opacity-70">KZT</span></p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No transactions yet. Enter data to generate chart.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
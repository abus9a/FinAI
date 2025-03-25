import React from 'react';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-5xl w-full space-y-8">
        
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">FinAI Suite Architecture</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              A comprehensive analytical platform integrating advanced machine learning algorithms for real-time financial monitoring, predictive modeling, and macroeconomic evaluation.
            </p>
          </div>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
              <p className="mb-4">
                The FinAI Suite is engineered to bridge the gap between complex data science methodologies and actionable financial insights. Built as a full-stack distributed system, it provides high-throughput processing for transaction screening alongside deep-dive analytical tools for enterprise resource planning. 
              </p>
              <p>
                The primary research objective of this suite is to demonstrate the efficacy of modular AI integration within financial systems, ensuring low-latency inference while maintaining high accuracy in anomaly detection and trend forecasting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Analytical Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Fraud Detection Engine</h3>
                  </div>
                  <p className="text-sm">
                    Utilizes an unsupervised learning algorithm (Isolation Forest) to identify multivariate anomalies in behavioral time-series data. The engine implements a dual-layer evaluation system: deploying a global baseline model for cold-starts and dynamically transitioning to a personalized user-profile model once sufficient historical data is aggregated.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Dynamic Pricing</h3>
                  </div>
                  <p className="text-sm">
                    A simulation-based optimization engine that models price elasticity of demand. It calculates the theoretical apex of the revenue parabola by computing the intersection of projected sales volume and per-unit profit margins, delivering data-driven pricing strategies.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Predictive Sales Forecast</h3>
                  </div>
                  <p className="text-sm">
                    Projects future revenue streams by analyzing historical trend data. The module generates forward-looking estimates bounded by confidence intervals (upper and lower bounds), providing a visual representation of systemic variance and optimistic/pessimistic growth scenarios.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Macroeconomic Nowcasting</h3>
                  </div>
                  <p className="text-sm">
                    Aggregates high-frequency indicators (CPI Inflation, Interest Rates, Manufacturing PMI) to establish a real-time estimate of Gross Domestic Product (GDP) growth. It quantitatively assesses the probability of recessionary environments, assigning deterministic economic regimes based on input matrices.
                  </p>
                </div>

              </div>
            </section>

            <section className="bg-indigo-900 text-white p-8 rounded-2xl shadow-inner mt-12">
              <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 border-b border-indigo-700 pb-2 mb-4">Backend Infrastructure</h3>
                  <ul className="space-y-2 opacity-90">
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Python & FastAPI for high-performance API routing</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Scikit-learn & NumPy for matrix operations & ML modeling</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> SQLite for lightweight, persistent data storage</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Pydantic for strict schema validation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 border-b border-indigo-700 pb-2 mb-4">Frontend Architecture</h3>
                  <ul className="space-y-2 opacity-90">
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Next.js (App Router) with React Server Components</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> TypeScript for strict client-side typing</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Tailwind CSS for responsive, utility-first styling</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span> Recharts for dynamic, hardware-accelerated SVG rendering</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </div>
        
      </div>
    </div>
  );
}
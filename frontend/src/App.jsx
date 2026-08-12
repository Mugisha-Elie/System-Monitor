import { useState, useEffect } from "react";

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    let isMounted = true;

    const getMetrics = async () => {
      try {
        const response = await fetch('http://localhost:5000');
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          setMetrics(data)
          setError(null)
        }
      } catch (err) {
        setError(err.message);
      }
    }

    getMetrics()
    const interval = setInterval(getMetrics, 3000);
    return() => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-emerald-400">System Status Monitor</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          <p className="fong-semibold">Connection Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-sm font-medium uppercase">Platfrom</p>
            <p className="text-2xl font-bold mt-1 text-slate-100">{ metrics.platform } ({metrics.architecture})</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-sm font-medium uppercase">Uptime</p>
            <p className="text-2xl font-bold mt-1 text-slate-100">{ metrics.uptimeSeconds } seconds</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-sm font-medium uppercase">Total Memory</p>
            <p className="text-2xl font-bold mt-1 text-slate-100">{metrics.totalMemoryGB} GB</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <p className="text-slate-400 text-sm font-medium uppercase">Free Memory</p>
            <p className="text-2xl font-bold mt-1 text-slate-100">{ metrics.freeMemoryGB } GB</p>
          </div>
        </div>
        
      ) : (
          !error && <p className="text-slate-400 animate-pulse">Loading System Metrics...</p>
      )}
      
    </div>
  )
}
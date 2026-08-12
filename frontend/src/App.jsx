import { useState, useEffect } from "react";

export default function App() {
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [processMetrics, setProcessMetrics] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    let isMounted = true;

    const getMetrics = async () => {
      try {
        const [statusRes, processRes] = await Promise.all([
          fetch('http://localhost:5000/api/status'),
          fetch('http://localhost:5000/api/process')
        ])

        if (!statusRes.ok || !processRes.ok) {
          throw new Error('Failed to fetch one or more metrics')
        }

        const statusData = await statusRes.json();
        const processData = await processRes.json();

        if (isMounted) {
          setSystemMetrics(statusData);
          setProcessMetrics(processData);
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

      {systemMetrics && processMetrics ? (
        <div className="w-full max-w-4xl space-y-8">
          <section>
            <h2 className="text-4xl font-semibold mb-4 text-slate-300 border-b border-slate-700 pb-2">Operating System Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm font-medium uppercase">Platfrom</p>
                <p className="text-xl font-bold mt-1">{ systemMetrics.platform } ({systemMetrics.architecture})</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">OS Uptime</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{ systemMetrics.uptimeSeconds } seconds</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Total Memory</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{systemMetrics.totalMemoryGB} GB</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Free Memory</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{ systemMetrics.freeMemoryGB } GB</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-4xl font-semibold mb-4 text-slate-300 border-b border-slate-700 pb-2">Nodejs Process Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <p className="text-slate-400 text-sm font-medium uppercase">Process ID (PID)</p>
                <p className="text-xl font-bold mt-1">{processMetrics.pid}</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Node version</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{processMetrics.nodeVersion}</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Process Uptime</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{processMetrics.processUptimeSeconds}s</p>
              </div>
    
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">Heap Used</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{processMetrics.memoryUsageMB.heapUsed} MB</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <p className="text-slate-400 text-sm font-medium uppercase">RSS Memory</p>
                <p className="text-2xl font-bold mt-1 text-slate-100">{processMetrics.memoryUsageMB.rss} MB</p>
              </div>
            </div>
          </section>
        </div>
        
      ) : (
          !error && <p className="text-slate-400 animate-pulse">Loading System Metrics...</p>
      )}
      
    </div>
  )
}
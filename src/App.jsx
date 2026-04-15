import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ShieldAlert, Cpu, Radio, Flame, Menu, Bell, Smartphone } from 'lucide-react';
import { fetchTelemetry } from './services/monitor';

const App = () => {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(null);
  const audioLocked = useRef(false);

  useEffect(() => {
    const stream = setInterval(async () => {
      const result = await fetchTelemetry(data);
      setCurrent(result);
      setData(prev => [...prev.slice(-14), result]);
      
      if (result.aiRisk === 'DANGER' && !audioLocked.current) {
        const speech = new SpeechSynthesisUtterance("Warning. Fire risk detected.");
        window.speechSynthesis.speak(speech);
        audioLocked.current = true;
        setTimeout(() => audioLocked.current = false, 6000);
      }
    }, 2000);
    return () => clearInterval(stream);
  }, [data]);

  if (!current) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500 font-mono text-[10px] tracking-[0.3em] animate-pulse uppercase">Syncing Neural Link</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ${current.aiRisk === 'DANGER' ? 'bg-red-950/20' : 'bg-[#020617]'}`}>
      
      {/* BACKGROUND DECOR (Neural Pulse) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${current.aiRisk === 'DANGER' ? 'bg-red-600/20' : 'bg-blue-600/10'}`}></div>
        <div className={`absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000 ${current.aiRisk === 'DANGER' ? 'bg-red-500/10' : 'bg-emerald-600/5'}`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:p-10 pb-24 md:pb-10">
        
        {/* RESPONSIVE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group cursor-pointer overflow-hidden relative">
              <ShieldAlert className="text-white relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase leading-none">Aegis <span className="text-blue-500 font-light">Sentinel</span></h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em]">Neural Intelligence v4.0</span>
                <span className="h-px w-4 bg-slate-800"></span>
                <span className="text-[9px] text-blue-500 font-mono font-bold tracking-widest">ENCRYPTED</span>
              </div>
            </div>
          </div>

          {/* ENHANCED STATUS LABEL */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Uplink Protocol</span>
              <span className="text-[10px] font-mono text-slate-300">BLYNK_IOT_SECURE</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-500
                ${current.status === 'SIMULATION_ACTIVE' || current.status === 'Online' 
                  ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}
            >
              <div className="relative">
                <div className={`w-2 h-2 rounded-full transition-colors duration-500
                  ${current.status === 'Online' || current.status === 'SIMULATION_ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} 
                />
                {(current.status === 'Online' || current.status === 'SIMULATION_ACTIVE') && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-wider leading-none">
                  {current.status.replace('_', ' ')}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
                  Latency: 42ms
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* AI STATUS (Full width on mobile, 4-cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`lg:col-span-4 glass-panel rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden ${current.aiRisk === 'DANGER' ? 'danger-glow' : ''}`}
          >
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-8 relative z-10">Neural Risk Analysis</p>
            
            {/* Visual Gauge */}
            <div className="relative flex items-center justify-center">
                <svg className="w-44 h-44 md:w-56 md:h-56 transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" class="text-slate-900" />
                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="100 100" 
                        className={`transition-all duration-1000 ${current.aiRisk === 'DANGER' ? 'text-red-500' : current.aiRisk === 'WARNING' ? 'text-yellow-500' : 'text-emerald-500'}`} 
                        style={{ strokeDasharray: '280', strokeDashoffset: '0' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span key={current.aiRisk} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black">{current.aiRisk}</motion.span>
                    <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-1">Confidence 99%</span>
                </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center gap-3 relative z-10">
              <div className="px-4 py-1.5 bg-blue-500/10 rounded-full flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Monitoring</span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 italic text-center px-4 leading-relaxed">System analyzing thermal patterns for fire-risk signatures.</p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (Stats & Graphs) */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Horizontal Stats for Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              <StatCard title="Thermal" value={current.temp} unit="°C" icon={<Flame size={20} className="text-orange-500" />} />
              <StatCard title="Load" value={current.current} unit="A" icon={<Zap size={20} className="text-blue-500" />} />
            </div>

            {/* Neural Graph (Responsive Height) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 h-[250px] md:h-[350px]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[9px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Historical Telemetry</h3>
                <span className="text-[8px] md:text-[9px] text-blue-400 font-mono px-2 py-0.5 border border-blue-400/30 rounded">SECURE_LINK</span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{background: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                  <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (The "App" feel) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 p-4 md:hidden z-50 flex justify-around items-center">
        <div className="text-blue-500 flex flex-col items-center gap-1">
          <Activity size={20} />
          <span className="text-[8px] uppercase font-bold">Monitor</span>
        </div>
        <div className="text-slate-500 flex flex-col items-center gap-1">
          <Smartphone size={20} />
          <span className="text-[8px] uppercase font-bold">Devices</span>
        </div>
        <div className="text-slate-500 flex flex-col items-center gap-1">
          <Bell size={20} />
          <span className="text-[8px] uppercase font-bold">Alerts</span>
        </div>
        <div className="text-slate-500 flex flex-col items-center gap-1">
          <Menu size={20} />
          <span className="text-[8px] uppercase font-bold">More</span>
        </div>
      </nav>
    </div>
  );
};

const StatCard = ({ title, value, unit, icon }) => (
  <motion.div 
    whileTap={{ scale: 0.95 }}
    className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center group transition-all"
  >
    <div>
      <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 md:mb-2">{title}</p>
      <div className="flex items-baseline gap-1">
        <h2 className="text-3xl md:text-5xl font-light tracking-tighter">{value}</h2>
        <span className="text-xs md:text-lg text-slate-600 font-medium">{unit}</span>
      </div>
    </div>
    <div className="mt-4 md:mt-0 p-3 md:p-4 rounded-xl bg-slate-900 shadow-inner">
      {icon}
    </div>
  </motion.div>
);

export default App;
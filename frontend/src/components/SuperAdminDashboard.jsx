import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, ScatterChart, Scatter, ZAxis } from 'recharts';
import { ShieldCheck, Cpu, Key, Database, Activity, ToggleLeft, ToggleRight, Fingerprint, RefreshCcw, LayoutGrid, Server, Terminal, Radio, Zap, Lock, Unlock } from 'lucide-react';
import axios from 'axios';

const SuperAdminDashboard = ({ addToast }) => {
    const [modelActive, setModelActive] = useState(true);
    const [sysConfig, setSysConfig] = useState(null);
    const [isReindexing, setIsReindexing] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/admin/identity-config', {
                    headers: { 'x-role': 'Super Admin' }
                });
                setSysConfig(res.data);
            } catch (e) {
                console.error("SuperAdmin Fetch Error:", e);
            }
        };
        fetchConfig();
    }, []);

    const handleReindex = () => {
        setIsReindexing(true);
        if (addToast) addToast("Master Reindex", "Initializing deep neural re-scan of all 1.2M nodes...", "info");
        setTimeout(() => {
            setIsReindexing(false);
            if (addToast) addToast("Re-index Success", "System brain has successfully optimized the identity matrix.", "success");
        }, 3000);
    };

    const roleUsage = [
        { name: 'Super Admin', value: 12 },
        { name: 'Admin', value: 45 },
        { name: 'CSM', value: 120 },
        { name: 'Sales', value: 85 },
        { name: 'Viewer', value: 210 }
    ];

    const featureAdoption = [
        { name: 'AI Churn Sync', value: 75, color: '#6366f1' },
        { name: 'Expansion Scout', value: 55, color: '#10b981' },
        { name: 'Recovery Bot', value: 42, color: '#f59e0b' },
        { name: 'Audit Shield', value: 95, color: '#ef4444' }
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    return (
        <div className="p-8 space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 lg:w-32 bg-rose-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] italic">SECURE_ACCESS_LEVEL: 05</span>
                    </div>
                    <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <Fingerprint className="text-rose-500" size={60} /> System <span className="text-rose-500">Brain</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-4 italic">Global Control Center — Kernel V5.0.2-Build_7x</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleReindex}
                        disabled={isReindexing}
                        className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-4 hover:border-rose-500/40 transition-all text-slate-500 hover:text-white group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-rose-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        {isReindexing ? <RefreshCcw className="animate-spin text-rose-500" size={20} /> : <Database className="group-hover:text-rose-500 transition-colors" size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-widest relative z-10">{isReindexing ? 'RE-INDEXING...' : 'MASTER_REINDEX'}</span>
                    </button>
                    <div className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4 shadow-2xl shadow-emerald-500/10">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">CORE_SYNC: OPTIMIZED</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ControlCard icon={<Lock />} label="RBAC Encryption" value="AES-4096" color="text-indigo-400" />
                <ControlCard icon={<Activity />} label="Neural Uptime" value={sysConfig?.system_stats?.uptime || '98.4h'} color="text-emerald-400" />
                <ControlCard icon={<Radio />} label="Network Latency" value="0.42ms" color="text-blue-400" />
                <ControlCard icon={<Server />} label="Active Containers" value="14/24" color="text-rose-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Neural System Matrix */}
                <div className="lg:col-span-12 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><Radio size={250} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Cpu size={18} className="text-rose-500" /> Neural fleet System Matrix (Risk vs Potential)
                    </h3>
                    <div className="h-[500px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="10 10" stroke="#1e293b" />
                                <XAxis type="number" dataKey="risk" name="Risk Score" domain={[0, 100]} stroke="#475569" fontSize={10} fontStyle="italic" />
                                <YAxis type="number" dataKey="potential" name="Growth Potential" domain={[0, 100]} stroke="#475569" fontSize={10} fontStyle="italic" />
                                <ZAxis type="number" dataKey="arr" range={[100, 1000]} name="Account ARR" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Scatter name="Accounts" data={[
                                    { risk: 12, potential: 85, arr: 500, name: 'EcoFlow' },
                                    { risk: 45, potential: 60, arr: 300, name: 'Alpha Tech' },
                                    { risk: 78, potential: 20, arr: 750, name: 'Gamma Corp' },
                                    { risk: 30, potential: 45, arr: 120, name: 'Delta Soft' },
                                    { risk: 92, potential: 10, arr: 900, name: 'Epsilon Inc' },
                                    { risk: 55, potential: 75, arr: 420, name: 'Beta Labs' },
                                    { risk: 10, potential: 95, arr: 600, name: 'Zeta Sync' },
                                ]} fill="#ef4444">
                                    {[0, 1, 2, 3, 4, 5, 6].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Identity Distribution */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-6 pointer-events-none transition-all group-hover:opacity-10"><Terminal size={150} /></div>
                    <h3 className="text-[10px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] italic flex items-center gap-3">
                        <ShieldCheck className="text-indigo-400" size={18} /> Global Identity Distribution Registry
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleUsage}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={6}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {roleUsage.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {roleUsage.map((r, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-950/40 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{r.name}</span>
                                </div>
                                <span className="text-xs font-black text-white italic">{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Weights & Simulation */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] pointer-events-none"></div>
                    <div>
                        <div className="flex justify-between items-start mb-14">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                                <Cpu className="text-rose-500" size={18} /> Neural Kernel Configuration Override
                            </h3>
                            <button
                                onClick={() => setModelActive(!modelActive)}
                                className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest italic shadow-2xl ${modelActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/40 shadow-rose-500/10' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
                            >
                                {modelActive ? <Unlock size={18} /> : <Lock size={18} />}
                                {modelActive ? 'KERNEL_ACTIVE: V5.1' : 'KERNEL_LOCKED: RULES_ONLY'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {featureAdoption.map((f, i) => (
                                <FeatureSlider key={i} f={f} />
                            ))}
                        </div>
                    </div>

                    <div className="mt-14 p-10 bg-slate-950/60 rounded-[3rem] border border-slate-800 border-dashed relative group">
                        <div className="absolute top-10 right-10 text-emerald-500/10 group-hover:text-emerald-500/30 transition-all"><Radio size={60} /></div>
                        <div className="flex items-center gap-4 text-emerald-500 mb-6 font-black text-[10px] uppercase tracking-[0.4em] italic">
                            <Terminal size={18} /> Live Kernel Transaction stream
                        </div>
                        <div className="space-y-4 font-mono text-[11px] text-slate-500">
                            <p className="flex items-center gap-4"><span className="text-emerald-500/40 font-black">2026-02-07 14:40:01</span> <span className="text-slate-200">System Brain Initialized Kernel v5.0.2</span></p>
                            <p className="flex items-center gap-4"><span className="text-emerald-500/40 font-black">2026-02-07 14:40:05</span> <span className="text-slate-400 italic">"Security Audit" Module Synced with Super Admin authority...</span></p>
                            <p className="flex items-center gap-4"><span className="text-rose-500/50 font-black">2026-02-07 14:40:12</span> <span className="text-rose-400 font-bold uppercase tracking-widest">ALERT: Unauthorized port probe detected from Node_X [REJECTED]</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureSlider = ({ f }) => (
    <div className="space-y-4">
        <div className="flex justify-between font-black text-[10px] uppercase tracking-widest italic">
            <span className="text-slate-500">{f.name}</span>
            <span className="text-white">{f.value}% STABILITY</span>
        </div>
        <div className="h-2.5 w-full bg-slate-850 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div
                className="h-full rounded-full transition-all duration-[2000ms] shadow-2xl"
                style={{ width: `${f.value}%`, backgroundColor: f.color, boxShadow: `0 0 20px ${f.color}40` }}
            ></div>
        </div>
    </div>
);

const ControlCard = ({ icon, label, value, color }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-850/40 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-10 border border-slate-800 group-hover:bg-slate-900 group-hover:rotate-6 transition-all shadow-2xl shadow-slate-950 relative z-10">
            <div className="text-slate-600 group-hover:text-indigo-400 transition-colors">{icon}</div>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 relative z-10 italic">{label}</p>
        <p className={`text-3xl font-black italic tracking-tighter ${color} uppercase relative z-10`}>{value}</p>
    </div>
);

export default SuperAdminDashboard;

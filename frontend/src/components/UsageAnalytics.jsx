import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell } from 'recharts';
import { Activity, BarChart3, TrendingUp, Users, Zap, Clock, MousePointer2, LogIn, LayoutGrid, Filter, Search, Loader2, PlayCircle, Signal } from 'lucide-react';
import axios from 'axios';

const UsageAnalytics = ({ userRole }) => {
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('7D');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const featureUsage = [
        { name: 'Dashboard', usage: 850, color: '#6366f1' },
        { name: 'Audit Hub', usage: 620, color: '#10b981' },
        { name: 'Neuro Sync', usage: 450, color: '#3b82f6' },
        { name: 'Expansion AI', usage: 380, color: '#f59e0b' },
        { name: 'Growth Lab', usage: 290, color: '#ef4444' }
    ];

    const adoptionTrend = [
        { date: '2025-01', adoption: 42 },
        { date: '2025-02', adoption: 48 },
        { date: '2025-03', adoption: 62 },
        { date: '2025-04', adoption: 58 },
        { date: '2025-05', adoption: 75 },
        { date: '2025-06', adoption: 82 }
    ];

    const engagementHeatmap = [
        { hour: '00:00', intensity: 20 }, { hour: '04:00', intensity: 10 },
        { hour: '08:00', intensity: 45 }, { hour: '12:00', intensity: 90 },
        { hour: '16:00', intensity: 75 }, { hour: '20:00', intensity: 40 }
    ];

    if (loading) return <div className="p-12 text-blue-500 font-black animate-pulse uppercase tracking-[0.5em] text-center italic">Synching Adoption Telemetry...</div>;

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <BarChart3 className="text-indigo-500" size={50} /> Usage <span className="text-indigo-500">Analytics</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Feature Adoption & Session Dynamics — <span className="text-indigo-400">Live Telemetry Feed</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    {['24H', '7D', '30D', '90D'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border ${timeframe === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricSection label="Login Velocity" value="1,240" trend="+12%" icon={<LogIn className="text-indigo-500" />} />
                <MetricSection label="Feature Depth" value="8.4" trend="+0.5" icon={<MousePointer2 className="text-emerald-500" />} />
                <MetricSection label="Session Persistence" value="42m" trend="+4m" icon={<Clock className="text-blue-500" />} />
                <MetricSection label="Churn Sensitivity" value="0.21" trend="-0.04" icon={<Signal className="text-rose-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Feature Usage Bar Chart */}
                <section className="lg:col-span-12 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><BarChart3 size={200} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Activity size={18} className="text-indigo-400" /> Core Feature Utilization Depth
                    </h3>
                    <div className="h-96 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={featureUsage} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="10 10" stroke="#1e293b" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#475569"
                                    fontSize={10}
                                    fontWeight="bold"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tickFormatter={(val) => val.toUpperCase()}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="usage" radius={[0, 20, 20, 0]} barSize={40}>
                                    {featureUsage.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none transition-transform group-hover:scale-110 mb-8"><TrendingUp size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Zap size={18} className="text-emerald-400" /> Platform Adoption Velocity
                    </h3>
                    <div className="h-72 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={adoptionTrend}>
                                <defs>
                                    <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="italic" />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="adoption" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorAdoption)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <section className="lg:col-span-4 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <Clock size={18} className="text-blue-400" /> Engagement Heat-Map
                    </h3>
                    <div className="space-y-6">
                        {engagementHeatmap.map((h, i) => (
                            <div key={i} className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-500 w-12 italic uppercase">{h.hour}</span>
                                <div className="flex-1 h-10 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-1.5">
                                    <div
                                        className="h-full rounded-xl transition-all duration-1000 bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${h.intensity}%`, opacity: h.intensity / 100 + 0.2 }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-black text-white italic">{h.intensity}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const MetricSection = ({ label, value, trend, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-16 h-16 p-4 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-all shadow-2xl">{icon}</div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-500 italic uppercase tracking-widest">{trend}</span>
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-1 italic">V_DELTA</span>
            </div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 italic relative z-10">{label}</p>
            <p className="text-4xl font-black text-white italic tracking-tighter relative z-10">{value}</p>
        </div>
    </div>
);

export default UsageAnalytics;

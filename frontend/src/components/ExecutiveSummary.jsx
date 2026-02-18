import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, BarChart, Bar, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Users, PieChart as PieIcon, Briefcase, Globe, Activity, ShieldCheck, Fingerprint, Map, Award } from 'lucide-react';
import axios from 'axios';

const ExecutiveSummary = () => {
    const healthDist = [
        { name: 'Healthy', value: 72 },
        { name: 'At-Risk', value: 18 },
        { name: 'Churned', value: 10 }
    ];

    const revenueData = [
        { month: 'Oct', arr: 850 },
        { month: 'Nov', arr: 920 },
        { month: 'Dec', arr: 980 },
        { month: 'Jan', arr: 1050 }
    ];

    const riskMatrix = [
        { x: 10, y: 30, z: 200, name: 'SaaS Alpha' },
        { x: 45, y: 80, z: 150, name: 'Beta Tech' },
        { x: 70, y: 20, z: 300, name: 'Gamma Corp' },
        { x: 30, y: 50, z: 100, name: 'Delta Soft' },
        { x: 90, y: 90, z: 50, name: 'Epsilon Inc' },
    ];

    const teamPerformance = [
        { name: 'Alex M.', conversion: 85, leads: 120 },
        { name: 'Sarah J.', conversion: 92, leads: 95 },
        { name: 'David K.', conversion: 78, leads: 150 },
        { name: 'Elena R.', conversion: 88, leads: 110 }
    ];

    const heatmapData = Array.from({ length: 48 }, (_, i) => ({
        id: i,
        intensity: Math.floor(Math.random() * 5), // 0 to 4
        region: ['NA', 'EMEA', 'APAC', 'LATAM'][i % 4]
    }));

    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="p-8 space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <Briefcase className="text-slate-500" size={50} /> Global <span className="text-slate-500">Governance</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-3 italic">Executive Observer Portal — Central Command</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-950 shadow-2xl">
                        <Globe className="text-indigo-500" size={20} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Inter-Regional Data Sync: 99.8%</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KpiCard title="Consolidated ARR" value="$1.05M" icon={<TrendingUp className="text-emerald-500" />} trend="+12.4%" />
                <KpiCard title="Strategic Health" value="84%" icon={<Activity className="text-indigo-500" />} trend="+5.2%" />
                <KpiCard title="Active Segments" value="12" icon={<ShieldCheck className="text-blue-500" />} trend="Stable" />
                <KpiCard title="Neural Uptime" value="99.9%" icon={<Fingerprint className="text-rose-500" />} trend="+0.1%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Team Performance */}
                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative">
                    <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.3em] flex items-center gap-3 italic font-['Outfit']">
                        <Award className="text-amber-400" size={18} /> Team Conversion Velocity
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={teamPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={9} fontWeight="bold" />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Bar dataKey="conversion" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Regional Heatmap */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        <Map className="text-emerald-400" size={18} /> Regional Engagement Heatmap (Live)
                    </h3>
                    <div className="grid grid-cols-12 gap-2 h-64">
                        {heatmapData.map((cell) => (
                            <div
                                key={cell.id}
                                className={`rounded-lg transition-all hover:scale-110 cursor-alias shadow-inner ${cell.intensity === 0 ? 'bg-slate-950 border border-slate-800 opacity-20' :
                                        cell.intensity === 1 ? 'bg-indigo-950/40 border border-indigo-500/10' :
                                            cell.intensity === 2 ? 'bg-indigo-800/60 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
                                                cell.intensity === 3 ? 'bg-indigo-600/80 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]' :
                                                    'bg-indigo-400 border border-white/20 shadow-[0_0_20px_rgba(165,180,252,0.6)]'
                                    }`}
                                title={`${cell.region}: Grade ${cell.intensity}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded bg-slate-950 border border-slate-800"></div> Low Activity
                        </span>
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded bg-indigo-400"></div> Peak Performance
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Revenue Velocity */}
                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none transition-all group-hover:opacity-10"><TrendingUp size={150} /></div>
                    <h3 className="text-[10px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] flex items-center gap-3 italic font-['Outfit']">
                        Strategic Revenue Velocity (ARR Log)
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="arr" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorArr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution Matrix */}
                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[4rem] shadow-2xl overflow-hidden relative group">
                    <h3 className="text-[10px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        Risk Velocity Matrix (Scatter Control)
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <XAxis type="number" dataKey="x" name="Risk" hide />
                                <YAxis type="number" dataKey="y" name="Health" hide />
                                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Account Size" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Scatter name="Accounts" data={riskMatrix} fill="#fbbf24" clipPath="" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-6 px-4">
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">High Potential Risk</span>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Optimized Growth Zone</span>
                    </div>
                </div>
            </div>

            {/* AI Governance Insights */}
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
                <h3 className="text-[10px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                    <ShieldCheck className="text-emerald-500" size={18} /> High-Level AI Governance Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InsightCard
                        title="Retention Stability"
                        text="Governance models confirm a 14% increase in fleet resilience since the implementation of CHED V5.0."
                        status="positive"
                    />
                    <InsightCard
                        title="Expansion Propensity"
                        text="Neural scanners detect a $420k expansion pocket within the Mid-Market segment, peaking in late Q4."
                        status="info"
                    />
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, icon, trend }) => (
    <div className="p-10 bg-slate-950 border border-slate-800 rounded-[3rem] hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/40 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl">{icon}</div>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic ${trend.includes('+') ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-500 bg-slate-500/5'}`}>{trend}</span>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 relative z-10 italic">{title}</p>
        <p className="text-4xl font-black text-white italic tracking-tighter uppercase relative z-10">{value}</p>
    </div>
);

const InsightCard = ({ title, text, status }) => (
    <div className="flex items-start gap-6 p-8 bg-slate-950/40 rounded-[2.5rem] border border-slate-800/60 hover:border-indigo-500/20 transition-all group">
        <div className={`mt-2 w-3 h-3 rounded-full shrink-0 shadow-lg ${status === 'positive' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-blue-500 shadow-blue-500/30'}`}></div>
        <div>
            <p className="text-xs font-black text-white uppercase tracking-widest mb-2 italic group-hover:text-indigo-400 transition-colors">{title}</p>
            <p className="text-sm font-bold text-slate-500 leading-relaxed italic group-hover:text-slate-300 transition-colors">"{text}"</p>
        </div>
    </div>
);

export default ExecutiveSummary;

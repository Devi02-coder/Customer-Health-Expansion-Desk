import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { Shield, Users, Activity, TrendingUp, AlertTriangle, Target, DollarSign, Award, Layers, Filter, Zap, Globe, Cpu, Terminal, ShieldCheck } from 'lucide-react';
import ExportButtons from './ExportButtons';
import axios from 'axios';

const AdminDashboard = ({ userRole }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/dashboard/stats', {
                    headers: { 'x-role': userRole }
                });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setData({
                    health: [
                        { name: 'Healthy', value: 65 },
                        { name: 'At-Risk', value: 25 },
                        { name: 'Churned', value: 10 }
                    ],
                    revenue: [
                        { month: 'Sep', arr: 820000, new: 45000 },
                        { month: 'Oct', arr: 865000, new: 52000 },
                        { month: 'Nov', arr: 912000, new: 61000 },
                        { month: 'Dec', arr: 980000, new: 85000 },
                        { month: 'Jan', arr: 1050000, new: 92000 },
                    ],
                    funnel: [
                        { name: 'Trial', value: 450, color: '#6366f1' },
                        { name: 'Active', value: 320, color: '#3b82f6' },
                        { name: 'Expansion', value: 85, color: '#10b981' }
                    ],
                    kpis: [{ avg_health: 78.5, pipeline_value: 127500, new_leads: 5 }]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userRole]);

    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#3b82f6'];

    if (loading) return <div className="p-12 text-blue-500 font-black animate-pulse uppercase tracking-[0.5em] text-center italic">Synching Strategic Ops Control...</div>;

    return (
        <div className="p-8 space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-10">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-1 lg:w-40 bg-blue-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] italic">OPERATIONS_COMMAND: ALPHA_INIT</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <Layers className="text-blue-500" size={50} /> Strategic <span className="text-blue-500">Ops</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Segmentation & Neural Revenue Engine — <span className="text-blue-400">AUTH: {userRole.toUpperCase()}</span>
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <ExportButtons userRole={userRole} />
                    <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-4 group cursor-default">
                        <Activity className="text-emerald-500 animate-pulse" size={18} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">SYSTEM_LOAD: 12%</span>
                    </div>
                    <div className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] flex items-center gap-5 shadow-[0_20px_40px_rgba(37,99,235,0.2)] transition-all cursor-pointer">
                        <DollarSign size={24} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-[0.1em] italic mt-0.5">${(data.revenue[4].arr / 1000000).toFixed(1)}M ARR SYNCHRONIZED</span>
                    </div>
                </div>
            </header>

            {/* Command Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricBox label="Global Retention" value="94.2%" trend="+2.4%" icon={<ShieldCheck className="text-emerald-400" />} />
                <MetricBox label="Expansion Pipeline" value="$1.2M" trend="+18%" icon={<TrendingUp className="text-blue-400" />} />
                <MetricBox label="Active Clusters" value="12" trend="Nominal" icon={<Globe className="text-indigo-400" />} />
                <MetricBox label="Neural Accuracy" value="98.8%" trend="+0.2%" icon={<Cpu className="text-rose-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Revenue Velocity Section */}
                <section className="lg:col-span-8 bg-slate-900 border border-slate-800 p-10 rounded-[4rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 group-hover:opacity-10 transition-opacity pointer-events-none"><TrendingUp size={200} /></div>
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            <Activity size={18} className="text-indigo-400" /> Neural Revenue Velocity
                        </h3>
                        <div className="px-5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">REAL-TIME_FEED_V4</div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenue}>
                                <defs>
                                    <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="italic" />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '24px', fontWeight: '900', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="arr" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorArr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Health Segmentation */}
                <section className="lg:col-span-4 bg-slate-900 border border-slate-800 p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45 pointer-events-none"><Zap size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        <AlertTriangle size={18} className="text-amber-500" /> Cluster Health Matrix
                    </h3>
                    <div className="h-72 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.health}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.health.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-2xl font-black text-white italic">82%</p>
                        </div>
                    </div>
                    <div className="mt-10 space-y-4">
                        {data.health.map((h, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800/60 rounded-2xl hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h.name}</p>
                                </div>
                                <p className="text-base font-black text-white italic">{h.value}%</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Strategic Lifecycle Funnel */}
                <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 pointer-events-none"><Target size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 mb-12 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        <Target size={18} className="text-rose-500" /> Global Revenue Funnel
                    </h3>
                    <div className="space-y-8">
                        {data.funnel.map((item, i) => (
                            <div key={i} className="flex items-center gap-8">
                                <div className="w-28 text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.name}</p>
                                    <p className="text-2xl font-black text-white italic tracking-tighter">{item.value}</p>
                                </div>
                                <div className="flex-1 h-14 bg-slate-950 rounded-[1.5rem] overflow-hidden border border-slate-800 p-2">
                                    <div
                                        className="h-full rounded-2xl transition-all duration-1000 ease-out flex items-center justify-end pr-6 shadow-2xl"
                                        style={{ width: `${(item.value / data.funnel[0].value) * 100}%`, backgroundColor: item.color }}
                                    >
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{((item.value / data.funnel[0].value) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tactical Actions */}
                <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform group-hover:rotate-12"><Terminal size={120} /></div>
                    <h3 className="text-base font-black text-slate-500 uppercase tracking-[0.4em] italic text-center mb-10">Strategy Deployment Hub</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <ActionButton icon={<DollarSign className="text-emerald-500" />} label="Revenue Audit" />
                        <ActionButton icon={<Users className="text-blue-500" />} label="Cluster Analysis" />
                        <ActionButton icon={<Shield className="text-indigo-500" />} label="Compliance Core" />
                        <ActionButton icon={<TrendingUp className="text-rose-500" />} label="Growth Matrix" />
                    </div>
                    <button className="w-full py-6 mt-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] italic transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 group flex items-center justify-center gap-4">
                        <Zap size={20} className="animate-pulse" /> Initialize Global Sequence
                    </button>
                    <div className="mt-8 flex justify-center items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] italic">Linked to Neural_Node_Alpha_7</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value, trend, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-blue-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-18 h-18 p-4 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-all shadow-2xl shadow-slate-950">{icon}</div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-500 italic uppercase tracking-widest">{trend}</span>
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-1">24H_DELTA</span>
            </div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 italic relative z-10">{label}</p>
            <p className="text-4xl font-black text-white italic tracking-tighter relative z-10">{value}</p>
        </div>
    </div>
);

const ActionButton = ({ icon, label }) => (
    <button className="p-10 bg-slate-950 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/40 transition-all flex flex-col items-center gap-6 active:scale-95 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-indigo-500/40 transition-colors"></div>
        <div className="group-hover:scale-125 group-hover:rotate-12 transition-transform">{icon}</div>
        <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-[0.2em] italic transition-colors text-center">{label}</span>
    </button>
);

export default AdminDashboard;

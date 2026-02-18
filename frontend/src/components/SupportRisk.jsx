import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { AlertTriangle, MessageSquare, Heart, ShieldAlert, Zap, Clock, TrendingUp, Filter, Search, Loader2, BrainCircuit, Activity, Flag, Smile, Frown, Meh } from 'lucide-react';
import axios from 'axios';

const SupportRisk = ({ userRole }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    const ticketTypes = [
        { name: 'Technical', value: 45, color: '#6366f1' },
        { name: 'Billing', value: 25, color: '#f59e0b' },
        { name: 'Feature Req', value: 30, color: '#10b981' }
    ];

    const sentimentTrend = [
        { month: 'Jan', sentiment: 85 },
        { month: 'Feb', sentiment: 82 },
        { month: 'Mar', sentiment: 78 },
        { month: 'Apr', sentiment: 65 },
        { month: 'May', sentiment: 72 },
        { month: 'Jun', sentiment: 70 }
    ];

    const riskTickets = [
        { id: 'TKT-820', company: 'EcoFlow', priority: 'CRITICAL', sentiment: 'NEGATIVE', age: '14h', desc: 'Integration failure causing downtime in production node.' },
        { id: 'TKT-915', company: 'CloudScale', priority: 'HIGH', sentiment: 'NEUTRAL', age: '2h', desc: 'API rate limits acting inconsistent with enterprise plan.' },
        { id: 'TKT-744', company: 'HealthBridge', priority: 'MEDIUM', sentiment: 'POSITIVE', age: '5d', desc: 'Request for roadmap visibility on neural-link updates.' }
    ];

    if (loading) return <div className="p-12 text-rose-500 font-black animate-pulse uppercase tracking-[0.5em] text-center italic">Scanning Support Sentiment Matrix...</div>;

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <ShieldAlert className="text-rose-500" size={50} /> Support <span className="text-rose-500">Risk</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Sentiment Analysis & Churn Prediction — <span className="text-rose-400">Threat Level: NOMINAL</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-8 py-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4">
                        <AlertTriangle className="text-rose-500 animate-pulse" size={18} />
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic mt-0.5">3 CRITICAL BREACHES DETECTED</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <RiskMetric label="Avg Sentiment" value="72%" trend="-8.4%" icon={<Smile className="text-emerald-500" />} />
                <MetricSection label="SLA Compliance" value="98.2%" trend="+0.2%" icon={<ShieldAlert className="text-blue-500" />} />
                <MetricSection label="Ticket Velocity" value="14/Day" trend="+3" icon={<Activity className="text-indigo-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sentiment Trend Area Chart */}
                <section className="lg:col-span-8 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><TrendingUp size={200} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Heart size={18} className="text-rose-400" /> Aggregate Sentiment Velocity (6-Month)
                    </h3>
                    <div className="h-[400px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sentimentTrend}>
                                <defs>
                                    <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="italic" />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="sentiment" stroke="#ef4444" strokeWidth={6} fillOpacity={1} fill="url(#colorSentiment)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Ticket Dist Pie */}
                <section className="lg:col-span-4 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <MessageSquare size={18} className="text-blue-400" /> Conflict Clustering
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={ticketTypes} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                    {ticketTypes.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-10 space-y-4">
                        {ticketTypes.map((t, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800/60 rounded-2xl hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t.name}</p>
                                </div>
                                <p className="text-base font-black text-white italic">{t.value}%</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Critical Tickets registry */}
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl overflow-hidden">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                    <Flag size={18} className="text-amber-500" /> High-Risk Conflict Ledger
                </h3>
                <div className="space-y-8">
                    {riskTickets.map(ticket => (
                        <div key={ticket.id} className="group p-10 bg-slate-950/40 border border-slate-800/60 rounded-[3rem] hover:bg-slate-900/40 hover:border-rose-500/20 transition-all flex flex-col lg:flex-row lg:items-center gap-10">
                            <div className="flex items-center gap-8 min-w-[300px]">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-2xl transition-all ${ticket.priority === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 group-hover:bg-slate-800'}`}>
                                    {ticket.company[0]}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-rose-400 transition-colors uppercase">{ticket.company}</h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${ticket.priority === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>{ticket.priority}</span>
                                        <span className="text-slate-800 font-bold opacity-20">•</span>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{ticket.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-900/30 p-8 rounded-3xl border border-slate-800 group-hover:border-rose-500/10 transition-all">
                                <p className="text-xs font-bold text-slate-400 group-hover:text-slate-300 italic leading-relaxed uppercase">"{ticket.desc}"</p>
                            </div>

                            <div className="flex items-center gap-10 min-w-[250px] justify-end">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">Vocal Sentiment</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        {ticket.sentiment === 'NEGATIVE' ? <Frown className="text-rose-500" size={16} /> : ticket.sentiment === 'POSITIVE' ? <Smile className="text-emerald-500" size={16} /> : <Meh className="text-amber-500" size={16} />}
                                        <p className={`text-[10px] font-black italic tracking-widest ${ticket.sentiment === 'NEGATIVE' ? 'text-rose-500' : 'text-emerald-500'}`}>{ticket.sentiment}</p>
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-slate-800 opacity-20"></div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">Ticket Age</p>
                                    <p className="text-xl font-black text-white italic tracking-tighter uppercase">{ticket.age}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RiskMetric = ({ label, value, trend, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-rose-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-16 h-16 p-4 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-all shadow-2xl">{icon}</div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-rose-500 italic uppercase tracking-widest">{trend}</span>
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-1 italic">SEN_DELTA</span>
            </div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 italic relative z-10">{label}</p>
            <p className="text-4xl font-black text-white italic tracking-tighter relative z-10">{value}</p>
        </div>
    </div>
);

const MetricSection = ({ label, value, trend, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-blue-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
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

export default SupportRisk;

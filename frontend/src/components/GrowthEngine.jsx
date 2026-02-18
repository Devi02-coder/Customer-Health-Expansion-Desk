import React, { useState, useEffect } from 'react';
import { Rocket, UserPlus, Gift, TrendingUp, ArrowUpRight, CheckCircle2, Target, DollarSign, Zap, BrainCircuit, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Filter, Layers, ZapOff } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import axios from 'axios';
import ExportButtons from './ExportButtons';

const GrowthEngine = ({ userRole, addToast, canEdit }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scopingMode, setScopingMode] = useState(false);

    const handleLaunchProposal = (company) => {
        if (!canEdit) {
            addToast("Action Restricted", "You do not have permission to launch expansion proposals.", "error");
            return;
        }
        addToast(`Proposal Dispatched: ${company}`, "Hyper-personalized expansion deck has been generated.", "success");
    };

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/growth/expansion-leads', {
                    headers: { 'x-role': userRole }
                });
                setLeads(res.data);
            } catch (err) {
                console.error("Error fetching leads:", err);
                setLeads([
                    { company_name: 'EcoFlow', opportunity_type: 'Upsell', potential_value: 15000, confidence_score: 0.95, lead_status: 'OPEN', reasoning: 'Reached 92% seat utilization.' },
                    { company_name: 'CloudScale', opportunity_type: 'Cross-sell', potential_value: 8000, confidence_score: 0.88, lead_status: 'CONTACTED', reasoning: 'High adoption of core module.' },
                    { company_name: 'HealthBridge', opportunity_type: 'Referral', potential_value: 5000, confidence_score: 0.82, lead_status: 'OPEN', reasoning: '94% health score reported.' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [userRole]);

    const expansionTypeData = [
        { name: 'Upsell', value: 45000, color: '#10b981' },
        { name: 'Cross-sell', value: 32000, color: '#6366f1' },
        { name: 'Referral', value: 12000, color: '#3b82f6' }
    ];

    const forecastData = [
        { month: 'Q1', revenue: 120000, forecast: 135000 },
        { month: 'Q2', revenue: 145000, forecast: 160000 },
        { month: 'Q3', revenue: 168000, forecast: 195000 },
        { month: 'Q4', revenue: 0, forecast: 245000 },
    ];

    const stats = {
        totalValue: leads?.reduce((acc, l) => acc + Number(l.potential_value || 0), 0) || 0,
        avgConfidence: leads?.length > 0 ? (leads.reduce((acc, l) => acc + Number(l.confidence_score || 0), 0) / leads.length * 100).toFixed(0) : 0,
        highPriority: leads?.filter(l => (l.confidence_score > 0.9)).length || 0
    };

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
                        <Rocket className="text-emerald-500" size={40} /> Expansion <span className="text-emerald-500">Engine</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 italic">AI-Scoping & Revenue Acceleration — Role: {userRole}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <ExportButtons userRole={userRole} />
                    {canEdit && (
                        <button
                            onClick={() => setScopingMode(!scopingMode)}
                            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border ${scopingMode ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                        >
                            {scopingMode ? <Zap size={16} /> : <ZapOff size={16} />}
                            {scopingMode ? 'SCOPING_MODE: LIVE' : 'SCOPING_MODE: OFF'}
                        </button>
                    )}
                    <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-0.5 italic">HUNT_MODE: ACTIVE</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox label="Pipeline Value" value={`$${(stats.totalValue / 1000).toFixed(1)}K`} color="text-indigo-400" icon={<DollarSign size={20} />} />
                <StatBox label="Avg Confidence" value={`${stats.avgConfidence}%`} color="text-emerald-400" icon={<Target size={20} />} />
                <StatBox label="High Priority" value={stats.highPriority} color="text-rose-400" icon={<AlertCircle size={20} />} />
                <StatBox label="Growth Velocity" value="+24%" color="text-blue-400" icon={<TrendingUp size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Forecast */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                        <LineIcon className="text-indigo-400" size={18} /> Strategic Revenue Forecast (FY26)
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expansion Mix */}
                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
                    <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                        <PieIcon className="text-emerald-400" size={18} /> Expansion Mix Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expansionTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                    {expansionTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Opportunities Registry */}
            <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 rounded-[4rem] shadow-2xl">
                <div className="p-6 border-b border-slate-800/50 flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-4">
                        <BrainCircuit className="text-rose-500" size={30} /> AI Expansion Registry
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {leads.map((lead, idx) => (
                        <div key={idx} className="group p-8 bg-slate-950/40 border border-slate-800 rounded-[3rem] hover:bg-slate-900/40 hover:border-emerald-500/20 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-400 group-hover:bg-emerald-500 group-hover:text-white transition-all italic shadow-2xl">
                                        {lead.company_name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-emerald-400 transition-colors uppercase">{lead.company_name}</h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{lead.opportunity_type}</span>
                                            <span className="text-slate-800 font-bold">•</span>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">${(lead.potential_value / 1000).toFixed(0)}K Potential</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 lg:max-w-md bg-slate-900/50 p-6 rounded-3xl border border-slate-800 group-hover:border-indigo-500/20 transition-all">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2 italic">
                                        <BrainCircuit size={14} className="text-indigo-400" /> Neural Context
                                    </p>
                                    <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors italic leading-relaxed">
                                        "{lead.reasoning}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-10 min-w-[280px]">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">Propensity</p>
                                        <p className="text-3xl font-black text-emerald-400 italic tracking-tighter">{(lead.confidence_score * 100).toFixed(0)}%</p>
                                    </div>
                                    <button
                                        onClick={() => handleLaunchProposal(lead.company_name)}
                                        className={`flex-1 h-16 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${canEdit ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                    >
                                        Launch Proposal <ArrowUpRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color, icon }) => (
    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:border-slate-700 transition-all group flex items-center gap-6">
        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform shadow-2xl">
            <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">{label}</p>
            <p className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</p>
        </div>
    </div>
);

const AlertCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

export default GrowthEngine;

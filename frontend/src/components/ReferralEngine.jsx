import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2, Rocket, Users, Target, ArrowUpRight, Gift, Loader2, Search, Filter, Globe, MousePointer2, Send, Zap, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

const ReferralEngine = ({ userRole }) => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCampaign, setActiveCampaign] = useState('Global Expansion');

    // Chart Data
    const funnelData = [
        { value: 100, name: 'Sent', fill: '#6366f1' },
        { value: 80, name: 'Clicked', fill: '#818cf8' },
        { value: 50, name: 'Signed Up', fill: '#a5b4fc' },
        { value: 20, name: 'Converted', fill: '#c7d2fe' }
    ];

    const sourceData = [
        { name: 'Email', value: 45, color: '#10b981' },
        { name: 'Social', value: 30, color: '#6366f1' },
        { name: 'Direct', value: 15, color: '#f59e0b' },
        { name: 'Partner', value: 10, color: '#ec4899' }
    ];

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/growth/referrals', {
                    headers: { 'x-role': userRole }
                });
                setReferrals(res.data);
            } catch (e) {
                console.error("Referral Error:", e);
                setReferrals([
                    { id: 1, referrer_name: 'EcoFlow', referee_email: 'ceo@green-tech.com', status: 'Pending', potential_value: 12000, confidence: 85 },
                    { id: 2, referrer_name: 'Pulse AI', referee_email: 'ops@neural-box.io', status: 'Converted', potential_value: 45000, confidence: 99 },
                    { id: 3, referrer_name: 'Gamma Labs', referee_email: 'it@gamma.co', status: 'Negotiating', potential_value: 28000, confidence: 72 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, [userRole]);

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 lg:w-32 bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">REVENUE_MULTIPLIER: ACTIVE</span>
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <Share2 className="text-emerald-400" size={50} /> Referral <span className="text-emerald-400">Scout</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-4 italic">Neural Networking & Expansion Incentives — Phase V</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-[1.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 italic">
                        Launch Campaign <Rocket size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Total Pipeline" value="$124.8K" icon={<Users className="text-blue-400" />} trend="+15%" />
                <StatCard label="Avg Confidence" value="94.2%" icon={<Target className="text-rose-400" />} trend="+2.1%" />
                <StatCard label="Active Scouts" value="12" icon={<ArrowUpRight className="text-indigo-400" />} trend="Stable" />
                <StatCard label="Rewards Pool" value="$15.2K" icon={<Gift className="text-emerald-400" />} trend="$3k Used" />
            </div>

            {/* Visualizations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Conversion Funnel */}
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-8 flex items-center gap-3">
                        <Filter className="text-indigo-400" size={18} /> Conversion Funnel
                    </h3>
                    <div className="h-72 w-full">
                        {/* Using BarChart as horizontal bar/funnel approx since FunnelChart component can be tricky with some versions */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Bar dataKey="value" radius={[0, 20, 20, 0]} barSize={40}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sources Pie */}
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-8 flex items-center gap-3">
                        <Globe className="text-emerald-400" size={18} /> Referral Sources
                    </h3>
                    <div className="h-72 w-full flex">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Referral Registry */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 pointer-events-none"><Globe size={150} /></div>
                    <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                            <MousePointer2 className="text-emerald-400" size={18} /> Synaptic Expansion Registry
                        </h2>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                <input type="text" placeholder="QUERY_ACCOUNT..." className="bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase text-white outline-none focus:border-emerald-500/40 w-64 transition-all italic" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/10 text-slate-600 uppercase text-[10px] tracking-[0.2em] font-black italic">
                                    <th className="py-8 px-10">Scout Account</th>
                                    <th className="py-8 px-10">Primary Vector</th>
                                    <th className="py-8 px-10 text-center">Confidence</th>
                                    <th className="py-8 px-10 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/20">
                                {referrals.map((r) => (
                                    <tr key={r.id} className="group hover:bg-slate-800/50 transition-all cursor-default">
                                        <td className="py-10 px-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center font-black text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl italic text-xl">
                                                    {r.referrer_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white italic text-base group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{r.referrer_name}</p>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Tier-V Strategic Partner</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-10 px-10 font-black text-slate-400 italic text-xs uppercase tracking-wider">{r.referee_email}</td>
                                        <td className="py-10 px-10">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-2 w-32 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000" style={{ width: `${r.confidence || 80}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-500 italic uppercase tracking-widest">{r.confidence || 80}% SCORE</span>
                                            </div>
                                        </td>
                                        <td className="py-10 px-10">
                                            <div className="flex items-center justify-end gap-6">
                                                <p className="font-black text-white italic text-base">${(r.potential_value || 0).toLocaleString()}</p>
                                                <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border italic ${r.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}>
                                                    {r.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Top SCOUTS */}
                    <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 transition-transform group-hover:opacity-10 pointer-events-none"><Award size={120} /></div>
                        <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.3em] italic flex items-center gap-3">
                            <Award className="text-amber-500" size={18} /> Elite Scouts Leaderboard
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'EcoFlow', val: '$145K', color: 'bg-emerald-500' },
                                { name: 'Pulse AI', val: '$92K', color: 'bg-indigo-500' },
                                { name: 'Gamma Labs', val: '$64K', color: 'bg-rose-500' }
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center p-5 bg-slate-950/60 rounded-[2rem] border border-slate-800 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-600">0{i + 1}</span>
                                        <p className="text-sm font-black text-white italic uppercase">{s.name}</p>
                                    </div>
                                    <p className="text-sm font-black text-emerald-400 italic">{s.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick scout Link */}
                    <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <h3 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em] italic flex items-center gap-3">
                            <Send className="text-indigo-400" size={18} /> Instant Scout Deployment
                        </h3>
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 mb-6 group-hover:border-indigo-500/30 transition-colors">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Autonomous Link Generator</p>
                            <p className="text-xs font-black text-indigo-400 italic truncate tracking-tight">app.ched.intelligence/ref/scout_042...</p>
                        </div>
                        <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-4 italic group-hover:rotate-1">
                            Deploy Link <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:rotate-6 transition-all shadow-2xl shadow-slate-950">{icon}</div>
            <span className="text-[10px] font-black text-emerald-500 italic uppercase tracking-widest">{trend}</span>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 italic relative z-10">{label}</p>
            <p className="text-4xl font-black text-white italic tracking-tighter relative z-10">{value}</p>
        </div>
    </div>
);

export default ReferralEngine;

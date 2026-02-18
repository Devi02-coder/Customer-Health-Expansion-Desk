import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Calendar, CreditCard, Layers, Activity, Clock, ShieldCheck, ExternalLink, ChevronRight, LayoutGrid, List, Search, Filter, Loader2, Star, MessageSquare, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import axios from 'axios';

const Customer360 = ({ userRole }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/customers', {
                    headers: { 'x-role': userRole }
                });
                setCustomers(res.data);
                if (res.data.length > 0) setSelectedCustomer(res.data[0]);
            } catch (err) {
                console.error("Error fetching customers:", err);
                // Fallback mock
                const mockCustomers = [
                    { id: 1, company_name: 'EcoFlow', plan: 'Enterprise', arr: 120000, lifecycle_stage: 'Active', created_at: '2025-01-12', industry: 'Energy', owner: 'Sarah Chen' },
                    { id: 2, company_name: 'CloudScale', plan: 'Scale', arr: 85000, lifecycle_stage: 'Onboarding', created_at: '2025-05-20', industry: 'SaaS', owner: 'Mike Ross' },
                    { id: 3, company_name: 'HealthBridge', plan: 'Enterprise', arr: 250000, lifecycle_stage: 'Renewal', created_at: '2024-11-05', industry: 'Healthcare', owner: 'Sarah Chen' }
                ];
                setCustomers(mockCustomers);
                setSelectedCustomer(mockCustomers[0]);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [userRole]);

    const engagementData = [
        { day: 'Mon', usage: 45, support: 10 },
        { day: 'Tue', usage: 52, support: 5 },
        { day: 'Wed', usage: 48, support: 15 },
        { day: 'Thu', usage: 61, support: 8 },
        { day: 'Fri', usage: 55, support: 12 },
        { day: 'Sat', usage: 30, support: 2 },
        { day: 'Sun', usage: 25, support: 1 }
    ];

    const radarData = [
        { subject: 'Usage', A: 120, fullMark: 150 },
        { subject: 'Support', A: 98, fullMark: 150 },
        { subject: 'Sentiment', A: 86, fullMark: 150 },
        { subject: 'Billing', A: 99, fullMark: 150 },
        { subject: 'NPS', A: 85, fullMark: 150 },
    ];

    const filteredCustomers = customers.filter(c =>
        c.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-12 text-blue-500 font-black animate-pulse uppercase tracking-[0.5em] text-center italic">Initializing 360° Matrix...</div>;

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <Globe className="text-blue-500" size={50} /> Customer <span className="text-blue-500">360°</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Unified Entity Intelligence — <span className="text-blue-400">Total Entities: {customers.length}</span>
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH_ENTITIES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl py-5 pl-16 pr-8 text-[11px] font-black uppercase text-white outline-none focus:border-blue-500/30 italic transition-all shadow-2xl"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Entity List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl max-h-[800px] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-10 px-4">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Strategic Registry</h3>
                            <Filter size={16} className="text-slate-700 cursor-pointer hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-4">
                            {filteredCustomers.map(customer => (
                                <button
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className={`w-full p-8 rounded-[2rem] border transition-all flex items-center gap-6 text-left group relative overflow-hidden ${selectedCustomer?.id === customer.id ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/20 translate-x-2' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-2xl transition-all ${selectedCustomer?.id === customer.id ? 'bg-white text-blue-600' : 'bg-slate-900 text-slate-400 group-hover:bg-blue-500 group-hover:text-white'}`}>
                                        {customer.company_name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-black uppercase italic tracking-tighter text-lg leading-none mb-1 transition-colors ${selectedCustomer?.id === customer.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{customer.company_name}</p>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${selectedCustomer?.id === customer.id ? 'text-blue-100' : 'text-slate-600'}`}>{customer.plan}</span>
                                            <span className="text-slate-800 font-bold opacity-20">•</span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${selectedCustomer?.id === customer.id ? 'text-blue-100' : 'text-slate-600'}`}>${(customer.arr / 1000).toFixed(0)}K ARR</span>
                                        </div>
                                    </div>
                                    {selectedCustomer?.id === customer.id && (
                                        <div className="absolute right-8">
                                            <ChevronRight className="text-white animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Entity Details Overlay */}
                <div className="lg:col-span-8 space-y-12">
                    {selectedCustomer ? (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-12">
                            {/* Profile Header */}
                            <section className="bg-slate-900 border border-slate-800 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-45">
                                    <Layers size={250} />
                                </div>
                                <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                    <div className="w-40 h-40 bg-slate-950 border border-slate-800 rounded-[3rem] flex items-center justify-center font-black text-6xl text-blue-500 italic shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-50"></div>
                                        {selectedCustomer.company_name[0]}
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">{selectedCustomer.company_name}</h2>
                                            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">STATUS: {selectedCustomer.lifecycle_stage.toUpperCase()}</div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                            <DetailItem icon={<GridIcon className="text-blue-400" />} label="Entity Plan" value={selectedCustomer.plan} />
                                            <DetailItem icon={<DollarSignIcon className="text-indigo-400" />} label="Annual Revenue" value={`$${(selectedCustomer.arr / 1000).toFixed(0)}K`} />
                                            <DetailItem icon={<Activity className="text-rose-400" />} label="Growth Index" value="+12.4%" />
                                            <DetailItem icon={<ShieldCheck className="text-emerald-400" />} label="Security Level" value="Level-4" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Telemetry & Engagement */}
                                <section className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                                        <Activity size={18} className="text-blue-400" /> Usage Telemetry
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={engagementData}>
                                                <defs>
                                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="italic" />
                                                <YAxis hide />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                                                />
                                                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>

                                {/* Sentiment Radar */}
                                <section className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                                        <Star size={18} className="text-indigo-400" /> Sentiment Matrix
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                                <PolarGrid stroke="#1e293b" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                                                <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </section>
                            </div>

                            {/* Engagement Timeline */}
                            <section className="bg-slate-900 border border-slate-800 rounded-[4rem] p-12 shadow-2xl relative group">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                                    <Clock size={18} className="text-rose-400" /> Strategic Timeline
                                </h3>
                                <div className="space-y-10">
                                    <TimelineItem icon={<MessageSquare size={16} className="text-indigo-400" />} date="OCT 24, 2025" title="Executive Business Review" desc="Q3 Alignment session completed via Neuro-Link." />
                                    <TimelineItem icon={<AlertCircle size={16} className="text-rose-400" />} date="SEP 12, 2025" title="Support Threshold Breach" desc="Ticket #820 — Resolved in 42 minutes by AI Agent." />
                                    <TimelineItem icon={<Star size={16} className="text-emerald-400" />} date="AUG 05, 2025" title="Entity Milestone" desc="Reached 85% feature adoption velocity." />
                                </div>
                            </section>

                            {/* Contact & Meta */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="bg-slate-950/60 border border-slate-800 rounded-[3rem] p-10 flex items-center gap-6 group hover:border-blue-500/20 transition-all cursor-default">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform"><User size={24} className="text-blue-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-1">Account Custodian</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedCustomer.owner}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-950/60 border border-slate-800 rounded-[3rem] p-10 flex items-center gap-6 group hover:border-emerald-500/20 transition-all cursor-default">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform"><Calendar size={24} className="text-emerald-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-1">Neural Integration Date</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedCustomer.created_at}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-20 group">
                            <Globe size={150} className="text-slate-600 mb-10 transition-transform group-hover:rotate-12 duration-1000" />
                            <h2 className="text-5xl font-black text-slate-500 uppercase tracking-tighter italic">Select an Entity</h2>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-[0.4em] mt-5">Initialize 360° Matrix Connection</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="space-y-2 group cursor-default">
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-400 transition-colors">{label}</span>
        </div>
        <p className="text-xl font-black text-white italic tracking-tighter group-hover:text-blue-400 transition-colors uppercase">{value}</p>
    </div>
);

const TimelineItem = ({ icon, date, title, desc }) => (
    <div className="flex gap-8 group relative">
        <div className="absolute left-[23px] top-12 bottom-[-40px] w-px bg-slate-800 group-last:hidden opacity-30"></div>
        <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-all group-hover:border-slate-700 shadow-2xl">
            {icon}
        </div>
        <div>
            <div className="flex items-center gap-4 mb-2">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">{date}</span>
                <div className="h-px w-8 bg-slate-800"></div>
                <h4 className="text-sm font-black text-white uppercase italic tracking-widest transition-colors group-hover:text-blue-400">{title}</h4>
            </div>
            <p className="text-xs font-bold text-slate-500 italic max-w-xl group-hover:text-slate-400 transition-colors leading-relaxed">"{desc}"</p>
        </div>
    </div>
);

const GridIcon = ({ className }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);

const DollarSignIcon = ({ className }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);

export default Customer360;

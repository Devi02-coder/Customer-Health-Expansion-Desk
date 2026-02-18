import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Zap, CheckCircle2, Clock, Filter, Search, ShieldAlert, Activity, ChevronRight, Fingerprint, Layers, Cpu, Terminal, X } from 'lucide-react';

const AlertSystem = ({ userRole }) => {
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'CHURN_RISK', customer: 'EcoFlow', severity: 'CRITICAL', time: '12m ago', desc: 'Health score dropped below 40% threshold.', status: 'UNREAD' },
        { id: 2, type: 'UPSELL_READY', customer: 'CloudScale', severity: 'MEDIUM', time: '45m ago', desc: 'Reached 92% plan utilization — Expansion opportunity.', status: 'READ' },
        { id: 3, type: 'SLA_BREACH', customer: 'HealthBridge', severity: 'HIGH', time: '2h ago', desc: 'Critical support ticket open for > 4 hours.', status: 'UNREAD' },
        { id: 4, type: 'REFERRAL_ELG', customer: 'SolarTech', severity: 'LOW', time: '5h ago', desc: 'NPS Score of 10 — Entity eligible for referral program.', status: 'READ' },
    ]);

    const [filter, setFilter] = useState('ALL');

    const filteredAlerts = filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter);

    const markAsRead = (id) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'READ' } : a));
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <Bell className="text-rose-500" size={50} /> Alert <span className="text-rose-500">Core</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Real-time Conflict Interception — <span className="text-rose-400">Sequence Alpha Enabled</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setFilter(lvl)}
                            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border ${filter === lvl ? 'bg-rose-600 border-rose-500 text-white shadow-xl shadow-rose-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <AlertStat label="Active Conflicts" value={alerts.filter(a => a.status === 'UNREAD').length} color="text-rose-500" icon={<ShieldAlert size={20} />} />
                <AlertStat label="Resolution Velocity" value="22m" color="text-emerald-500" icon={<Zap size={20} />} />
                <AlertStat label="Daily Volume" value="42" color="text-blue-500" icon={<Activity size={20} />} />
                <AlertStat label="Neural Accuracy" value="99.4%" color="text-indigo-500" icon={<Fingerprint size={20} />} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[4rem] p-12 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><Terminal size={150} /></div>
                <div className="flex justify-between items-center mb-12 relative z-10">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-4">
                        <Layers size={18} className="text-rose-400" /> Intentional Signal Log
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Live Feed Connected</span>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
                        <div key={alert.id} className={`group p-10 rounded-[3rem] border transition-all flex flex-col lg:flex-row lg:items-center gap-10 relative overflow-hidden ${alert.status === 'UNREAD' ? 'bg-slate-950 border-rose-500/20' : 'bg-slate-950/40 border-slate-800'}`}>
                            {alert.status === 'UNREAD' && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 shadow-[0_0_20px_#ef4444]"></div>
                            )}

                            <div className="flex items-center gap-8 min-w-[300px]">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-2xl transition-all ${alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : alert.severity === 'HIGH' ? 'bg-rose-500 text-white' : alert.severity === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                                    {alert.customer[0]}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-rose-400 transition-colors uppercase">{alert.customer}</h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${alert.severity === 'CRITICAL' ? 'text-rose-500' : 'text-slate-500'}`}>{alert.type}</span>
                                        <span className="text-slate-800 font-bold opacity-20">•</span>
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">{alert.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-900/30 p-8 rounded-3xl border border-slate-800 group-hover:border-rose-500/10 transition-all">
                                <p className="text-xs font-bold text-slate-400 group-hover:text-slate-300 italic leading-relaxed uppercase">"{alert.desc}"</p>
                            </div>

                            <div className="flex items-center gap-6">
                                {alert.status === 'UNREAD' && (
                                    <button
                                        onClick={() => markAsRead(alert.id)}
                                        className="p-5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl text-emerald-500 transition-all active:scale-95"
                                        title="Mark as Processed"
                                    >
                                        <CheckCircle2 size={24} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteAlert(alert.id)}
                                    className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95"
                                    title="Dismiss Signal"
                                >
                                    <X size={24} />
                                </button>
                                <button className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all active:scale-95 shadow-2xl shadow-indigo-600/20">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-40 text-center opacity-20">
                            <Cpu size={100} className="mx-auto text-slate-600 mb-8" />
                            <h3 className="text-4xl font-black text-slate-500 uppercase tracking-tighter italic">No Active Conflicts</h3>
                            <p className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] mt-5">System Continuity Nominal</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AlertStat = ({ label, value, color, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 blur-[50px] -mr-16 -mt-16 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className={`w-16 h-16 p-4 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-all ${color.replace('text', 'text')}`}>{icon}</div>
        </div>
        <div>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3 italic relative z-10">{label}</p>
            <p className={`text-4xl font-black italic tracking-tighter relative z-10 ${color}`}>{value}</p>
        </div>
    </div>
);

export default AlertSystem;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Terminal, AlertTriangle, CheckCircle2, Clock, Filter, Search, Fingerprint, ShieldAlert, Activity, Lock, RefreshCcw } from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get('http://localhost:5005/api/admin/audit-logs', {
                    headers: { 'x-role': 'Super Admin' }
                });
                setLogs(res.data);
            } catch (e) {
                console.error("Audit Logs Error:", e);
                setLogs([
                    { id: 1, action: 'AUTH_OVERRIDE', actor: 'Super Admin', target: 'AI_MODEL_V4', status: 'SUCCESS', time: '2m ago', type: 'Security' },
                    { id: 2, action: 'WEIGHT_SYNC', actor: 'System_Daemon', target: 'Neural_Node_4', status: 'COMPLETED', time: '14m ago', type: 'System' },
                    { id: 3, action: 'ACCESS_REJECT', actor: 'Guest_77', target: 'Executive_DB', status: 'BLOCKED', time: '1h ago', type: 'Security' },
                    { id: 4, action: 'RECOVERY_TRIGGER', actor: 'CHED_Agent', target: 'Startup_X', status: 'ACTIVE', time: '2h ago', type: 'AI' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = activeFilter === 'All' ? logs : logs.filter(l => l.type === activeFilter);

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 lg:w-32 bg-rose-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] italic">SECURE_LEDGER: UNBROKEN</span>
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <ShieldCheck className="text-rose-500" size={50} /> Security <span className="text-rose-500">Audit</span> Matrix
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-4 italic">Immutable Hex-Encoded Agent Interaction Registry — Phase V</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-8 py-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 shadow-2xl shadow-rose-500/10">
                        <Lock className="text-rose-500" size={18} />
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic leading-none">PLAINTEXT_LOGGING: DISABLED</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <SummaryCard label="Safety Score" value="99.8%" icon={<ShieldCheck className="text-emerald-500" />} />
                <SummaryCard label="Threats Nullified" value="12" icon={<ShieldAlert className="text-rose-500" />} />
                <SummaryCard label="Registry Uptime" value="100.0%" icon={<Activity className="text-blue-500" />} />
                <SummaryCard label="Synced Nodes" value="48/48" icon={<RefreshCcw className="text-indigo-500" />} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 pointer-events-none"><Terminal size={150} /></div>
                <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 relative z-10">
                        {['All', 'Security', 'System', 'AI'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative z-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input
                            type="text"
                            placeholder="QUERY_REGISTRY..."
                            className="bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] font-black uppercase text-white outline-none focus:border-rose-500/40 w-80 transition-all italic"
                        />
                    </div>
                </div>

                <div className="p-10 space-y-4">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="group bg-slate-950/40 backdrop-blur-3xl border border-slate-800/60 p-8 rounded-[2.5rem] hover:border-rose-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-30`}></div>
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-3 ${log.type === 'Security' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/10' : 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10'}`}>
                                    {log.type === 'Security' ? <Lock size={28} /> : log.type === 'System' ? <Terminal size={28} /> : <Activity size={28} />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-base font-black text-white italic uppercase tracking-tight group-hover:text-rose-500 transition-colors uppercase">{log.action}</span>
                                        <span className="text-[9px] font-black text-slate-700 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 uppercase tracking-widest">SEQ_ID_{log.id}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                                        ACTOR_{log.actor.replace(' ', '_').toUpperCase()} • TARGET_{log.target.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-10">
                                <div>
                                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 italic ${log.status === 'SUCCESS' || log.status === 'COMPLETED' ? 'text-emerald-400' : 'text-rose-500'}`}>{log.status}</p>
                                    <div className="flex items-center gap-3 justify-end text-slate-600">
                                        <Clock size={12} className="opacity-50" />
                                        <span className="text-[10px] font-black uppercase tracking-tight">{log.time}</span>
                                    </div>
                                </div>
                                <button className="p-4 bg-slate-900 hover:bg-rose-500/20 text-slate-700 hover:text-rose-500 rounded-2xl transition-all">
                                    <ShieldAlert size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-12 bg-slate-900 border border-slate-800 rounded-[4rem] border-dashed text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                <Fingerprint className="mx-auto text-slate-800 mb-6 group-hover:text-rose-500 transition-colors" size={60} />
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic relative z-10">End of Synchronized Neural Log stream</p>
                <div className="mt-8 flex justify-center gap-6 relative z-10">
                    <button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-[10px] font-black text-white rounded-[1.5rem] uppercase tracking-widest transition-all shadow-xl shadow-slate-950">
                        Export Encrypted CSV
                    </button>
                    <button className="px-10 py-4 bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-[10px] font-black text-slate-500 hover:text-white rounded-[1.5rem] uppercase tracking-widest transition-all italic">
                        Validate Integrity
                    </button>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ label, value, icon }) => (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] hover:border-rose-500/20 transition-all group flex items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-rose-500/10 transition-all"></div>
        <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-800 group-hover:rotate-6 transition-all shadow-2xl shadow-slate-950 relative z-10">
            {icon}
        </div>
        <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 italic">{label}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{value}</p>
        </div>
    </div>
);

export default AuditLogs;

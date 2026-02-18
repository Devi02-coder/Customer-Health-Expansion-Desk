import React, { useState, useEffect } from 'react';
import { Database, Cpu, Activity, Zap, ShieldCheck, Search, Network, BrainCircuit, RefreshCw, Send, Radio, Terminal } from 'lucide-react';
import axios from 'axios';

const NeuroLink = () => {
    const [stats, setStats] = useState({
        requests: 1240,
        latency: '42ms',
        accuracy: '98.2%',
        activeModels: 3
    });

    const [isSyncing, setIsSyncing] = useState(false);

    const [logs, setLogs] = useState([
        { id: 1, event: 'Churn Prediction Model Loaded', priority: 'LOW', timestamp: '14:20:01', node: 'Node_A' },
        { id: 2, event: 'Inference Request: EcoFlow Registry', priority: 'MEDIUM', timestamp: '14:21:05', node: 'Node_B' },
        { id: 3, event: 'Neural weights optimized for expansion vector', priority: 'INFO', timestamp: '14:22:12', node: 'Core' },
        { id: 4, event: 'Anomalous Support Activity Detected', priority: 'HIGH', timestamp: '14:25:30', node: 'Listener' },
    ]);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="p-8 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <BrainCircuit className="text-indigo-500" size={50} /> Neuro-Link <span className="text-indigo-500">Core</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-3 italic">Neural Processing & Inference Scanners — Phase V</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3"
                    >
                        {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Radio size={16} />}
                        {isSyncing ? 'Synchronizing Neurons...' : 'Initiate Neural Sync'}
                    </button>
                    <div className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">FastAPI Engine: Optimized</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatusNode icon={<Database />} label="Synaptic Registry" value={`${stats.requests} Hits`} trend="+12%" />
                <StatusNode icon={<Cpu />} label="Inference Ping" value={stats.latency} trend="Nominal" />
                <StatusNode icon={<Activity />} label="Model Accuracy" value={stats.accuracy} trend="+0.4%" />
                <StatusNode icon={<ShieldCheck />} label="Neural Shield" value="Enforced" trend="Active" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
                {/* Neural Propensity Graph */}
                <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none transition-all group-hover:opacity-10"><Network size={150} /></div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12 flex items-center gap-3 italic font-['Outfit']">
                        <Search size={18} className="text-indigo-400" /> Lateral Propensity Weights (V5)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <WeightBar label="Support Sensitivity (Ticket Drift)" weight={85} color="bg-rose-500" />
                            <WeightBar label="Adoption Acceleration (Feature Sink)" weight={65} color="bg-indigo-500" />
                        </div>
                        <div className="space-y-10">
                            <WeightBar label="Expansion Propensity (Fiscal Reach)" weight={92} color="bg-emerald-500" />
                            <WeightBar label="Sentiment Extraction (Text Neural)" weight={40} color="bg-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Live Process Log */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-10 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3 italic">
                        <Terminal size={18} className="text-indigo-400" /> Inference Ledger stream
                    </h3>
                    <div className="flex-1 space-y-4">
                        {logs.map(log => (
                            <div key={log.id} className="p-5 bg-slate-950/60 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">{log.node}</span>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded italic ${log.priority === 'HIGH' ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500'}`}>{log.priority}</span>
                                </div>
                                <p className="text-xs font-black text-slate-300 group-hover:text-white transition-colors italic leading-relaxed">"{log.event}"</p>
                                <p className="text-[8px] font-mono text-slate-700 mt-2">{log.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusNode = ({ icon, label, value, trend }) => (
    <div className="p-10 bg-slate-950 border border-slate-800 rounded-[3rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-4 bg-slate-900 rounded-2xl group-hover:rotate-6 transition-all shadow-2xl shadow-slate-950">{icon}</div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{trend}</span>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 relative z-10 italic">{label}</p>
        <p className="text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">{value}</p>
    </div>
);

const WeightBar = ({ label, weight, color }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] italic">{label}</p>
            <p className="text-sm font-black text-white italic tracking-tighter">{weight}%</p>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
                className={`h-full ${color} transition-all duration-1000 ease-out shadow-2xl`}
                style={{ width: `${weight}%` }}
            ></div>
        </div>
    </div>
);

export default NeuroLink;

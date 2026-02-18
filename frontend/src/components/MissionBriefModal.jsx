import React from 'react';
import { ShieldAlert, Zap, Target, ArrowRight, X, Activity, Cpu, Layers } from 'lucide-react';

const MissionBriefModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-indigo-600 to-emerald-500"></div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-slate-800/80 rounded-2xl text-slate-400 hover:text-white transition-all hover:rotate-90"
                >
                    <X size={18} />
                </button>

                <div className="p-12">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-2xl shadow-rose-500/20">
                            <ShieldAlert size={40} className="text-rose-500" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">Intelligence <span className="text-rose-500">Brief</span></h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                                <Activity size={10} className="text-rose-500" /> PRIORITY: {data.priority}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-950/50 rounded-[2.5rem] p-8 border border-slate-800 shadow-inner">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target size={12} /> Strategic Objective
                            </h3>
                            <p className="text-2xl font-black text-white leading-tight italic tracking-tight">"{data.objective}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <MetricBox label="Churn Probability" value={data.churn_risk} color="text-rose-500" />
                            <MetricBox label="AI Confidence" value="98.2%" color="text-emerald-400" />
                        </div>

                        {data.diagnostics && (
                            <div className="grid grid-cols-3 gap-6 py-8 border-y border-slate-800/50">
                                <DiagStat label="Adoption" value={`${data.diagnostics.adoption}%`} />
                                <DiagStat label="Active Tkts" value={data.diagnostics.tickets} />
                                <DiagStat label="Utilization" value={`${data.diagnostics.seats}%`} />
                            </div>
                        )}

                        <div className="bg-indigo-600/10 rounded-[2rem] p-8 border border-indigo-500/20 relative group">
                            <div className="absolute top-4 right-4 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors"><Cpu size={40} /></div>
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} /> Recommended Recovery Vector
                            </h3>
                            <div className="flex items-start gap-4">
                                <p className="text-lg font-bold text-slate-300 italic group-hover:text-white transition-colors">
                                    "{data.suggestedAction}"
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-16 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-4"
                            >
                                Execute Mission <Target size={20} />
                            </button>
                            <button className="px-10 h-16 border border-slate-800 rounded-[1.5rem] text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-slate-800 transition-all flex items-center gap-3">
                                <Layers size={18} /> Delegate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value, color }) => (
    <div className="bg-slate-800/20 p-8 rounded-[2rem] border border-slate-800/40">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
);

const DiagStat = ({ label, value }) => (
    <div className="text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

export default MissionBriefModal;

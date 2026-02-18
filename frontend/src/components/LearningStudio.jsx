import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrainCircuit, Cpu, Settings2, Sliders, ToggleLeft, ToggleRight, Sparkles, RefreshCcw, Save, Zap, AlertCircle, Microscope, Terminal, Activity, FlaskConical } from 'lucide-react';

const LearningStudio = ({ addToast }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [trainingPhase, setTrainingPhase] = useState('Inference'); // Inference, Optimization, Training
    const [thresholds, setThresholds] = useState({
        churn: 75,
        expansion: 85,
        sensitivity: 40
    });

    const [isExperimenting, setIsExperimenting] = useState(false);

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            await axios.post('http://localhost:5005/api/ai/tune-thresholds', { thresholds });
            setTimeout(() => {
                setIsUpdating(false);
                if (addToast) addToast("Neural Sync Executed", "Synaptic thresholds have been updated in the global kernel.", "success");
            }, 1500);
        } catch (e) {
            console.error(e);
            setIsUpdating(false);
            if (addToast) addToast("Sync Failed", "Structural error in threshold propagation.", "warning");
        }
    };

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 lg:w-32 bg-indigo-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] italic">LAB_ENVIRONMENT: SECURE_V5</span>
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <Microscope className="text-indigo-400" size={50} /> Learning <span className="text-indigo-400">Studio</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-4 italic">Neural Architecture & Threshold Calibration Lab</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsExperimenting(!isExperimenting)}
                        className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-3 ${isExperimenting ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white'}`}
                    >
                        <FlaskConical size={16} />
                        {isExperimenting ? 'EXPERIMENTAL_MODE: ON' : 'EXPERIMENTAL_MODE: OFF'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest italic shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-4"
                    >
                        {isUpdating ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                        {isUpdating ? 'CALIBRATING...' : 'EXECUTE NEURAL SYNC'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Parameter Tuning */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-6 pointer-events-none transition-all group-hover:opacity-10"><Sliders size={150} /></div>
                    <div className="flex justify-between items-center mb-14 relative z-10">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                            <Activity className="text-indigo-400" size={18} /> Synaptic Threshold Controls
                        </h3>
                        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                            {['Inference', 'Optimization', 'Training'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setTrainingPhase(p)}
                                    className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${trainingPhase === p ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-400'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12 relative z-10">
                        <TuningSlider
                            label="Churn Detection Sensitivity"
                            value={thresholds.churn}
                            onChange={(v) => setThresholds({ ...thresholds, churn: v })}
                            desc="Recursive Flagging Matrix Aggression for at-risk identifying."
                        />

                        <TuningSlider
                            label="Expansion Propensity Guardrail"
                            value={thresholds.expansion}
                            onChange={(v) => setThresholds({ ...thresholds, expansion: v })}
                            desc="Lead Generation threshold — Inverse correlation to Accuracy."
                        />

                        <TuningSlider
                            label="Autonomous Agent Confidence"
                            value={thresholds.sensitivity}
                            onChange={(v) => setThresholds({ ...thresholds, sensitivity: v })}
                            desc="Neural gate for self-guided recovery task execution."
                        />
                    </div>
                </div>

                {/* Training Telemetry & Visualizer */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
                        <h3 className="text-[10px] font-black text-slate-500 mb-10 uppercase tracking-[0.3em] italic flex items-center gap-3">
                            <BrainCircuit className="text-rose-500" size={18} /> Neural Node Status
                        </h3>

                        {/* Simplified Neural Visualizer */}
                        <div className="flex justify-center items-center py-10 relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <div className="w-48 h-48 border border-white/20 rounded-full animate-ping"></div>
                            </div>
                            <div className="flex gap-12 relative z-10">
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-rose-500 shadow-lg shadow-rose-500' : 'bg-slate-800'} animate-pulse`}></div>)}
                                </div>
                                <div className="space-y-4 pt-4">
                                    {[1, 2].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-indigo-500 shadow-lg shadow-indigo-500' : 'bg-slate-800'} animate-pulse`}></div>)}
                                </div>
                                <div className="space-y-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <TelemetryCard label="Accuracy" value="98.42%" color="text-emerald-400" />
                            <TelemetryCard label="Loss" value="0.0124" color="text-indigo-400" />
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-10 rounded-[3rem] relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform"><AlertCircle size={80} /></div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 italic flex items-center gap-3"><Zap size={14} /> Structural Advisory</p>
                        <p className="text-xs text-amber-200/50 font-black leading-relaxed italic uppercase tracking-[0.05em] relative z-10">
                            MODIFICATION_PENDING: SENSITIVITY OVERRIDE WILL RE-INDEX {thresholds.churn * 12} NODES IN LIVE REAL-TIME ENVIRONMENTS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TuningSlider = ({ label, value, onChange, desc }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest italic">{label}</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 italic">{desc}</p>
            </div>
            <span className="text-2xl font-black text-indigo-400 italic tracking-tighter">{value}%</span>
        </div>
        <div className="relative group">
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-full appearance-none cursor-pointer accent-indigo-500 border border-slate-800 transition-all"
            />
            <div className="absolute top-1/2 left-0 h-1 bg-indigo-500/10 rounded-full pointer-events-none -translate-y-1/2" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const TelemetryCard = ({ label, value, color }) => (
    <div className="bg-slate-950/60 p-6 rounded-[2rem] border border-slate-800/60 hover:border-slate-700 transition-all group overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-1 h-full ${color.replace('text', 'bg')} opacity-40`}></div>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">{label}</p>
        <p className={`text-xl font-black italic tracking-tighter ${color} uppercase`}>{value}</p>
    </div>
);

export default LearningStudio;

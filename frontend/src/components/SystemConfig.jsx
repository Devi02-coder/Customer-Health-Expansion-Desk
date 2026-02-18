import React, { useState } from 'react';
import { Settings, Shield, Sliders, ToggleLeft, ToggleRight, Save, Zap, AlertCircle, Database, Bell, Lock, Users, Key, Terminal, RefreshCcw, Globe, MessageSquare, CreditCard } from 'lucide-react';

const SystemConfig = ({ userRole, addToast }) => {
    const [config, setConfig] = useState({
        scoreWeights: { usage: 40, support: 30, billing: 20, nps: 10 },
        thresholds: { healthy: 80, atRisk: 50 },
        features: { aiExplainability: true, autoPlaybooks: false, slackIntegrations: true },
        security: { mfaRequired: true, sessionTimeout: 60 }
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            if (addToast) addToast("System Sync", "Global configuration matrix committed successfully.", "success");
        }, 1000);
    };

    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                        <Settings className="text-slate-500" size={50} /> System <span className="text-slate-500">Core</span>
                    </h2>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-5 italic">
                        Threshold Management & Neural Calibration — <span className="text-blue-400">Auth: Super_Admin</span>
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] italic transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-4 active:scale-95"
                >
                    {isSaving ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
                    Commit System Changes
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Health Scoring Rules */}
                <section className="lg:col-span-8 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><Terminal size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Zap size={18} className="text-indigo-400" /> Neural Health Weight Matrix
                    </h3>
                    <div className="space-y-12 relative z-10">
                        {Object.entries(config.scoreWeights).map(([key, value]) => (
                            <div key={key} className="space-y-6">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-black text-white uppercase italic tracking-widest">{key} Intensity</span>
                                    <span className="text-lg font-black text-indigo-400 italic">{value}%</span>
                                </div>
                                <div className="relative h-2.5 bg-slate-950 rounded-full border border-slate-800 p-0.5">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-500"
                                        style={{ width: `${value}%` }}
                                    ></div>
                                    <input
                                        type="range"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        value={value}
                                        onChange={(e) => setConfig({ ...config, scoreWeights: { ...config.scoreWeights, [key]: parseInt(e.target.value) } })}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* System Toggles */}
                <section className="lg:col-span-4 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <Lock size={18} className="text-blue-400" /> Operational Overrides
                    </h3>
                    <div className="space-y-8">
                        {Object.entries(config.features).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-6 bg-slate-950/60 border border-slate-800/60 rounded-[2rem] hover:border-slate-700 transition-all cursor-pointer group" onClick={() => setConfig({ ...config, features: { ...config.features, [key]: !value } })}>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic transition-colors group-hover:text-white">{key.replace(/([A-Z])/g, ' $1')}</span>
                                {value ? <ToggleRight className="text-indigo-500" size={32} /> : <ToggleLeft className="text-slate-700" size={32} />}
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] flex flex-col items-center text-center">
                        <Shield className="text-indigo-400 mb-4" size={30} />
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] italic">Encryption: AES-256 Enabled</p>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Integration Core */}
                <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl group relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><Database size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4 relative z-10">
                        <Database size={18} className="text-emerald-400" /> Inbound Data Ingestion
                    </h3>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <IntegrationCard name="Salesforce" status="Synced" icon={<Globe className="text-blue-400" />} />
                        <IntegrationCard name="Zendesk" status="Active" icon={<MessageSquare className="text-emerald-400" />} />
                        <IntegrationCard name="Stripe Core" status="Polling" icon={<CreditCard className="text-indigo-400" />} />
                        <IntegrationCard name="Slack Bot" status="Disconnected" icon={<Zap className="text-slate-600" />} />
                    </div>
                </section>

                {/* Alerts Rules */}
                <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <Bell size={18} className="text-rose-400" /> Threshold Trigger Matrix
                    </h3>
                    <div className="space-y-6">
                        <ThresholdInput label="Healthy" value={config.thresholds.healthy} color="text-emerald-400" />
                        <ThresholdInput label="At Risk" value={config.thresholds.atRisk} color="text-rose-400" />
                    </div>
                    <div className="mt-12 p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center gap-6">
                        <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20"><AlertCircle className="text-rose-500" size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-1">Global Churn Alert</p>
                            <p className="text-sm font-black text-white italic tracking-tighter uppercase">Broadcast to HQ Slack Channel</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const IntegrationCard = ({ name, status, icon }) => (
    <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/20 transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform shadow-2xl">{icon}</div>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-1">Integration</p>
        <p className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">{name}</p>
        <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${status === 'Synced' || status === 'Active' ? 'bg-emerald-500' : status === 'Polling' ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{status}</span>
        </div>
    </div>
);

const ThresholdInput = ({ label, value, color }) => (
    <div className="flex items-center justify-between p-6 bg-slate-950/60 border border-slate-800/60 rounded-3xl">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{label} Threshold</span>
        <div className="flex items-center gap-6">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-3 h-8 rounded-full ${i <= value / 20 ? (color === 'text-emerald-400' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-slate-800 opacity-20'}`}></div>)}
            </div>
            <span className={`text-2xl font-black italic tracking-tighter uppercase ${color}`}>{value}%</span>
        </div>
    </div>
);


export default SystemConfig;

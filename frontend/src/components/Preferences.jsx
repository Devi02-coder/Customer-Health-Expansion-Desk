import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Globe, Zap, Save, RefreshCw, Cpu, Fingerprint, Command } from 'lucide-react';

const Preferences = ({ userRole, addToast, settings, toggleSetting }) => {
    // State is now managed globally in MissionControl for cross-module reflection

    return (
        <div className="p-10 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic flex items-center gap-4">
                        <Settings className="text-indigo-500 shadow-[0_0_15px_#4f46e5]" size={40} /> SYSTEM <span className="text-indigo-500">PREFERENCES</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic flex items-center gap-3">
                        <Command size={14} className="text-emerald-500" /> Kernel Configuration Mode — Role: {userRole}
                    </p>
                </div>
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest italic transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20">
                    <Save size={16} /> Persist Changes
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><User size={80} /></div>
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/30 p-1">
                                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-2xl font-black text-white italic">MS</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Muthu SuperAdmin</h3>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 italic">Level 05 Authority</p>
                            </div>
                            <div className="w-full h-px bg-slate-800/50"></div>
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Node Connectivity</span>
                                    <span className="text-emerald-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Established</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">Kernel Version</span>
                                    <span className="text-white italic">v5.4.2-Stable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex flex-col items-center text-center group transition-all hover:border-indigo-500/30">
                        <Cpu className="text-indigo-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Neural Sync Status</p>
                        <p className="text-xl font-black text-white italic tracking-tighter uppercase">99.8% Accuracy</p>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <Zap className="text-amber-400" size={18} /> Functional Switches
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { id: 'notifications', label: 'Neural Alerts', icon: <Bell size={18} className="text-indigo-400" />, desc: 'Enable real-time push-sync for critical churn events.' },
                            { id: 'biometricAuth', label: 'Identity Lock', icon: <Fingerprint size={18} className="text-emerald-400" />, desc: 'Require fingerprint verification for kernel-level changes.' },
                            { id: 'neuralSync', label: 'Deep Stream Sync', icon: <RefreshCw size={18} className="text-indigo-400" />, desc: 'Maintain live connection with remote neural nodes.' },
                            { id: 'autoDeploy', label: 'Autonomous Agents', icon: <Zap size={18} className="text-amber-400" />, desc: 'Allow AI agents to auto-deploy recovery playbooks.' }
                        ].map((s) => (
                            <div key={s.id} onClick={() => toggleSetting(s.id)} className="p-8 bg-slate-950/40 border border-slate-800 rounded-3xl hover:border-indigo-500/20 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">{s.icon}</div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings[s.id] ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings[s.id] ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <h4 className="text-sm font-black text-white italic uppercase mb-2">{s.label}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl flex items-center gap-6">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl"><Shield className="text-indigo-400" size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Security Protocol</p>
                            <p className="text-sm text-slate-400 font-medium italic">All system modifications are logged in the 64-bit encryption matrix and dispatched to the <span className="text-indigo-400 font-black">Security Audit</span> module.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preferences;

import React, { useState } from 'react';
import { Database, Link2, Plus, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Zap, Globe, Github, Slack, MessageSquare, Briefcase, Code, Cloud, Server, X, Activity } from 'lucide-react';

const IntegrationHub = ({ addToast }) => {
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Salesforce', type: 'CRM', status: 'Connected', icon: <Database className="text-blue-500" />, lastSync: '10m ago', health: 98 },
        { id: 2, name: 'HubSpot', type: 'CRM', status: 'Active', icon: <Database className="text-orange-500" />, lastSync: '2h ago', health: 100 },
        { id: 3, name: 'Zendesk', type: 'Support', status: 'Connected', icon: <MessageSquare className="text-emerald-500" />, lastSync: '15m ago', health: 95 },
        { id: 4, name: 'Stripe', type: 'Billing', status: 'Pending', icon: <Zap className="text-indigo-500" />, lastSync: 'Never', health: 0 },
        { id: 5, name: 'Slack', type: 'Notifications', status: 'Connected', icon: <Slack className="text-rose-500" />, lastSync: '1m ago', health: 99 },
        { id: 6, name: 'GitHub', type: 'Engineering', status: 'Connected', icon: <Github className="text-slate-400" />, lastSync: '5m ago', health: 97 },
        { id: 7, name: 'Intercom', type: 'Chat', status: 'Connected', icon: <MessageSquare className="text-blue-400" />, lastSync: '12m ago', health: 91 },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIntegration, setNewIntegration] = useState({ name: '', type: 'CRM', apiKey: '' });

    const handleNewIntegration = () => {
        setIsModalOpen(true);
    };

    const handleSaveIntegration = () => {
        if (!newIntegration.name || !newIntegration.apiKey) {
            addToast("Integration Protocol Failed", "All Neural Fields must be populated.", "error");
            return;
        }

        const newId = integrations.length + 1;
        const iconMap = {
            'CRM': <Database className="text-blue-500" />,
            'Support': <MessageSquare className="text-emerald-500" />,
            'Billing': <Zap className="text-indigo-500" />,
            'Engineering': <Code className="text-slate-400" />,
            'Cloud': <Cloud className="text-sky-500" />
        };

        const integrationToAdd = {
            id: newId,
            name: newIntegration.name,
            type: newIntegration.type,
            status: 'Initializing',
            icon: iconMap[newIntegration.type] || <Server className="text-slate-500" />,
            lastSync: 'Syncing...',
            health: 100
        };

        setIntegrations([...integrations, integrationToAdd]);
        addToast("Integration Protocol", `Opening neural tunnel for ${newIntegration.name}...`, "success");
        setIsModalOpen(false);
        setNewIntegration({ name: '', type: 'CRM', apiKey: '' });

        // Simulate async connection
        setTimeout(() => {
            setIntegrations(prev => prev.map(i => i.id === newId ? { ...i, status: 'Connected', lastSync: 'Just now' } : i));
            addToast("Neural Link Established", `${newIntegration.name} is now streaming live data.`, "success");
        }, 3000);
    };

    return (
        <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 lg:w-32 bg-indigo-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] italic">EXTERNAL_CONNECTORS: ACTIVE</span>
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase flex items-center gap-6">
                        <Link2 className="text-indigo-400" size={50} /> Integration <span className="text-indigo-400">Hub</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm uppercase tracking-[0.4em] mt-4 italic">Neural Sync & Data Ingestion Pipeline — V5</p>
                </div>
                <button
                    onClick={handleNewIntegration}
                    className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-4 italic font-['Outfit']">
                    New Integration <Plus size={18} />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatusCard label="Active Tunnels" value={integrations.length} icon={<Globe className="text-blue-400" />} trend="Nominal" />
                <StatusCard label="Data Velocity" value="2.4 GB/s" icon={<Layers className="text-emerald-400" />} trend="+14%" />
                <StatusCard label="Security Mesh" value="Enforced" icon={<ShieldCheck className="text-indigo-400" />} trend="Secure" />
                <StatusCard label="Ingestion Ping" value="44ms" icon={<Zap className="text-amber-400" />} trend="Fast" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none"><Database size={150} /></div>
                <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                        <RefreshCw className="text-indigo-400" size={18} /> Central Synchronicity Matrix
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/10 text-slate-600 uppercase text-[10px] tracking-widest font-black italic">
                                <th className="py-8 px-10">Application Entity</th>
                                <th className="py-8 px-10">Vector Type</th>
                                <th className="py-8 px-10">Stream Status</th>
                                <th className="py-8 px-10">Neural Health</th>
                                <th className="py-8 px-10 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/20">
                            {integrations.map((app) => (
                                <tr key={app.id} className="group hover:bg-slate-800/40 transition-all cursor-default relative overflow-hidden">
                                    <td className="py-10 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition-all shadow-xl">
                                                {app.icon}
                                            </div>
                                            <div>
                                                <p className="font-black text-white italic text-base group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{app.name}</p>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Last Sync: {app.lastSync}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10">
                                        <span className="text-[10px] font-black text-slate-400 italic uppercase tracking-widest border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-950/40">{app.type}</span>
                                    </td>
                                    <td className="py-10 px-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${app.status === 'Connected' || app.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : app.status === 'Initializing' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-ping' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} animate-pulse`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest italic ${app.status === 'Connected' || app.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{app.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10">
                                        <div className="flex flex-col gap-2">
                                            <div className="h-1.5 w-32 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${app.health > 90 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${app.health}%` }}></div>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-500 italic uppercase tracking-widest">{app.health}% INTEGRITY</span>
                                        </div>
                                    </td>
                                    <td className="py-10 px-10 text-right">
                                        <button
                                            onClick={() => addToast(`Sync Initiated: ${app.name}`, "Re-calibrating neural weights for this vector.", "success")}
                                            className="p-4 bg-slate-950 hover:bg-indigo-600 text-slate-500 hover:text-white rounded-2xl transition-all border border-slate-800 active:scale-90 shadow-xl">
                                            <RefreshCw size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none group-hover:opacity-10 transition-all"><Radio className="text-white" size={150} /></div>
                    <h3 className="text-[11px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em] italic flex items-center gap-3">
                        <Github className="text-white" size={18} /> API Webhooks & Listeners
                    </h3>
                    <div className="space-y-4">
                        <WebhookCard label="Churn_Stream_V1" status="Active" url="https://ched.ai/hooks/churn-v1" />
                        <WebhookCard label="Financial_Sync" status="Active" url="https://ched.ai/hooks/f-sync" />
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 group">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="text-indigo-500" size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Automated Data Ingestion</h3>
                        <p className="text-xs font-black text-slate-600 uppercase tracking-widest leading-relaxed">System is currently ingestive from 14 source nodes.<br />Next Global Refresh in 4m 12s.</p>
                    </div>
                </div>
            </div>

            {/* INTEGRATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 text-slate-600 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                <Link2 className="text-indigo-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">New Integration</h3>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Configure new neural data stream</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Application Name</label>
                                <input
                                    type="text"
                                    value={newIntegration.name}
                                    onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                                    placeholder="E.g. JIRA, MAILCHIMP..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-indigo-500 transition-colors italic"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Vector Type</label>
                                <select
                                    value={newIntegration.type}
                                    onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-indigo-500 transition-colors cursor-pointer italic appearance-none"
                                >
                                    <option value="CRM">CRM</option>
                                    <option value="Support">Support</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Cloud">Cloud Infrastructure</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">API Secret Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={newIntegration.apiKey}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                                        placeholder="••••••••••••••••••••••••"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase tracking-widest outline-none focus:border-indigo-500 transition-colors italic"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                        <Activity size={16} className="text-slate-700" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveIntegration}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-4 italic mt-4"
                            >
                                Ingest Stream <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusCard = ({ label, value, icon, trend }) => (
    <div className="p-10 bg-slate-950 border border-slate-800 rounded-[3.5rem] hover:border-slate-700 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900 opacity-20 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-4 bg-slate-900 rounded-2xl group-hover:rotate-6 transition-transform shadow-2xl">{icon}</div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{trend}</span>
        </div>
        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 relative z-10 italic">{label}</p>
        <p className="text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">{value}</p>
    </div>
);

const WebhookCard = ({ label, status, url }) => (
    <div className="p-6 bg-slate-950/60 rounded-3xl border border-slate-800 hover:border-indigo-500/20 transition-all">
        <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-white italic uppercase tracking-widest">{label}</span>
            <span className="text-[8px] font-black text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">{status}</span>
        </div>
        <code className="text-[10px] text-slate-600 truncate block font-mono bg-slate-900/40 p-2 rounded-lg italic">{url}</code>
    </div>
);

const Radio = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 7.76a6 6 0 0 0 0 8.49" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>
);

export default IntegrationHub;

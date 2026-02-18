import React from 'react';
import { Layers, Shield, Cpu, Target, Rocket, Share2, LayoutGrid, Info, Globe, Database, ArrowRight, CheckCircle2, Zap, Activity } from 'lucide-react';

const ProjectOverview = () => {
    return (
        <div className="p-8 space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto">
            <header className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-5 bg-indigo-600/10 rounded-full border border-indigo-600/20 shadow-2xl">
                        <Info size={40} className="text-indigo-500" />
                    </div>
                </div>
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase">
                    Mission <span className="text-indigo-500">Manifesto</span>
                </h1>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.5em] italic">Project Intelligence & Architecture Documentation</p>
                <div className="flex justify-center gap-4 mt-8">
                    <span className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest italic">VERSION: 5.0.2</span>
                    <span className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">STATUS: DEPLOYED</span>
                </div>
            </header>

            {/* Core Project Info */}
            <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none transition-transform group-hover:rotate-0"><Globe size={200} /></div>
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
                            <Rocket className="text-indigo-500" size={30} /> Project Identity
                        </h2>
                        <div className="h-1 lg:w-40 bg-indigo-500 rounded-full mb-6"></div>
                        <p className="text-2xl font-black text-slate-400 italic uppercase tracking-tighter leading-tight">
                            Project Name: <span className="text-white">Customer Health & Expansion Desk (CHED)</span>
                        </p>
                        <p className="text-lg font-bold text-slate-500 italic leading-relaxed max-w-3xl">
                            Purpose: Monitor customer health, track upsell/cross-sell opportunities, manage referrals, and provide actionable insights in real-time for different user roles within the enterprise ecosystem.
                        </p>
                    </div>
                </div>
            </section>

            {/* Role-Based Access Matrix */}
            <section className="space-y-8">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-4">
                    <Shield className="text-rose-500" size={18} /> Role-Based Access Matrix (RBAC-V)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <RoleCard
                        role="Super Admin"
                        access="Full Access"
                        features="Manage users, assign roles, view all dashboards, configure modules, real-time alerts"
                        color="border-rose-500/30"
                        bg="bg-rose-500/5"
                    />
                    <RoleCard
                        role="Admin"
                        access="High-Level Access"
                        features="Manage teams, approve cross-sell/upsell, generate reports, view charts"
                        color="border-indigo-500/30"
                        bg="bg-indigo-500/5"
                    />
                    <RoleCard
                        role="Manager"
                        access="Mid-Level"
                        features="Track team performance, customer health scores, visualize trends"
                        color="border-blue-500/30"
                        bg="bg-blue-500/5"
                    />
                    <RoleCard
                        role="CSM / Sales"
                        access="Operational"
                        features="Update interactions, view assigned accounts, suggest upsell/cross-sell"
                        color="border-emerald-500/30"
                        bg="bg-emerald-500/5"
                    />
                    <RoleCard
                        role="Analyst"
                        access="Read-Only"
                        features="Access dashboards, generate reports, export data, view visualizations"
                        color="border-slate-500/30"
                        bg="bg-slate-500/5"
                    />
                </div>
            </section>

            {/* Modules Deep Dive */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ModuleDetail
                    icon={<Activity className="text-emerald-500" />}
                    title="Customer Health Score"
                    desc="Calculate real-time health scores using AI sentiment from emails/calls and activity frequency."
                    features={["Real-time update of health scores", "Alerts for 'at-risk' customers", "Region/Industry/Manager filters"]}
                />
                <ModuleDetail
                    icon={<Zap className="text-indigo-500" />}
                    title="Expanding Intelligence"
                    desc="AI predicts opportunities using historical sales, engagement, and usage patterns."
                    features={["Opportunity scoring", "Suggested products/services", "High-value notifications"]}
                />
                <ModuleDetail
                    icon={<Share2 className="text-blue-500" />}
                    title="Referral Scout"
                    desc="Track referrals in real-time through the entire conversion funnel."
                    features={["Track referral stage & status", "Reward point management", "Real-time scout alerts"]}
                />
                <ModuleDetail
                    icon={<LayoutGrid className="text-rose-500" />}
                    title="Dashboard & Viz"
                    desc="Unified dashboard with role-based components and real-time WebSocket synchronization."
                    features={["Live Health Trends (Line charts)", "Opportunity Mix (Pie charts)", "Regional Heatmaps"]}
                />
            </section>

            {/* Neural Agent Module */}
            <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="flex flex-col md:flex-row gap-12 relative z-10">
                    <div className="w-24 h-24 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                        <Cpu className="text-indigo-400" size={40} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Real-Time AI Agent Module</h3>
                        <p className="text-lg font-bold text-slate-500 italic leading-relaxed mb-8">
                            Proactive customer engagement engine that recommends actions for at-risk accounts and suggests fiscal expansion vectors in real-time.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Automatic AI Suggestions</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Neural Feedback Integration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Matrix */}
            <section className="bg-slate-950/40 border border-slate-800 p-12 rounded-[4rem] shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none transition-transform"><Database size={150} /></div>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-4 mb-12">
                    <Database className="text-amber-500" size={18} /> Technology Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <StackItem layer="Frontend" tech="React + TailwindCSS + Recharts" />
                    <StackItem layer="Backend" tech="Node.js + Express" />
                    <StackItem layer="Database" tech="MySQL / PostgreSQL (SQLite Preview)" />
                    <StackItem layer="Real-Time" tech="Socket.io for Live Sync" />
                    <StackItem layer="AI Microservice" tech="FastAPI + Python / Node.js" />
                    <StackItem layer="Authentication" tech="JWT-based Role-Access (RBAC)" />
                </div>
            </section>
        </div>
    );
};

const RoleCard = ({ role, access, features, color, bg }) => (
    <div className={`p-8 border rounded-[2.5rem] ${bg} ${color} transition-all hover:scale-105 group cursor-default`}>
        <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic underline decoration-indigo-500/50 underline-offset-8">Role Identity</span>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Shield size={14} className="text-slate-500" />
            </div>
        </div>
        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">{role}</h4>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 opacity-80">{access}</p>
        <p className="text-xs font-bold text-slate-500 italic leading-relaxed group-hover:text-slate-300 transition-colors">
            "{features}"
        </p>
    </div>
);

const ModuleDetail = ({ icon, title, desc, features }) => (
    <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl hover:border-indigo-500/20 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-6 transition-transform group-hover:rotate-0 pointer-events-none">{icon}</div>
        <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">{title}</h4>
        </div>
        <p className="text-sm font-bold text-slate-500 italic leading-relaxed mb-8 relative z-10">
            {desc}
        </p>
        <ul className="space-y-4 relative z-10">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 group/item">
                    <ArrowRight size={14} className="text-indigo-500 group-hover/item:translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black text-slate-400 group-hover/item:text-slate-200 uppercase tracking-widest italic transition-colors">{f}</span>
                </li>
            ))}
        </ul>
    </div>
);

const StackItem = ({ layer, tech }) => (
    <div className="space-y-2 group cursor-default">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1 italic group-hover:text-indigo-400 transition-colors">{layer}</p>
        <p className="text-lg font-black text-white italic tracking-tighter uppercase group-hover:text-slate-200 transition-colors">{tech}</p>
        <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden mt-2">
            <div className="h-full w-0 group-hover:w-full bg-indigo-500 transition-all duration-700"></div>
        </div>
    </div>
);

export default ProjectOverview;

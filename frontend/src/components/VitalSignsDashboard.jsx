import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, UserCheck, Share2, HeartPulse, Activity, Rocket, Zap, ExternalLink, Loader2, BrainCircuit, ShieldCheck, PlayCircle, BookOpen, SlidersHorizontal, Calculator, Users } from 'lucide-react';
import axios from 'axios';
import MissionBriefModal from './MissionBriefModal';
import ExportButtons from './ExportButtons';

const ManualOverrideModal = ({ isOpen, onClose, startup, onSubmit }) => {
    const [score, setScore] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !startup) return null;

    const handleSubmit = async () => {
        if (score < 0 || score > 100) {
            setError("Score must be between 0 and 100");
            return;
        }
        setError(""); // Clear error if valid
        await onSubmit(startup.id, score);
        onClose();
    };

    return (
        <React.Fragment>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-96 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4">Manual Health Override</h3>
                    <p className="text-sm text-slate-400 mb-6">Update health score for {startup.company_name}</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Health Score</label>
                            <input
                                type="number"
                                name="health_score"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                                placeholder="0-100"
                            />
                            {error && <p className="text-rose-500 text-xs mt-2 validation-error">{error}</p>}
                        </div>

                        <button
                            id="submit-update"
                            onClick={handleSubmit}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold uppercase tracking-wider transition-all"
                        >
                            Update Score
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const MetricCard = ({ title, value, icon, trend, color }) => (
    <div className={`p-8 rounded-[2rem] border backdrop-blur-3xl transition-all hover:-translate-y-1 hover:shadow-2xl cursor-default group ${color}`}>
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-slate-900/80 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">{icon}</div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {trend}
            </span>
        </div>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{title}</p>
        <p className="text-4xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
);

const HealthGauge = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r={radius} stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle
                    cx="48" cy="48" r={radius} stroke={color} strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-white italic">{Math.round(score)}%</span>
                <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest mt-0.5 italic">Score</span>
            </div>
        </div>
    );
};

const HealthBadge = ({ score, riskLevel }) => {
    const color = score > 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : score > 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return (
        <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest italic flex items-center justify-between gap-4 ${color}`}>
            <span>{riskLevel}</span>
            <span className="opacity-40">{score}%</span>
        </div>
    );
};

const VitalSignsDashboard = ({ userRole, userId, addToast, canEdit }) => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMission, setSelectedMission] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFetchingBrief, setIsFetchingBrief] = useState(false);

    // Manual Override State
    const [isOverrideOpen, setIsOverrideOpen] = useState(false);
    const [selectedOverrideStartup, setSelectedOverrideStartup] = useState(null);

    // What-If Simulation State
    const [simAdoption, setSimAdoption] = useState(65);
    const [simSeats, setSimSeats] = useState(72);
    const [simHealth, setSimHealth] = useState(75);

    useEffect(() => {
        const fetchStartups = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('http://localhost:5005/api/startups', {
                    headers: { 'x-role': userRole, 'x-user-id': userId }
                });
                setStartups(res.data);
            } catch (err) {
                console.error("Error fetching startups:", err);
                if (err.response?.status === 403) {
                    setError("ACCESS_DENIED: Authority Level Insufficient for Neural Scan.");
                } else {
                    setError("NEURAL_SYNC_FAILED: Data Stream Interrupted.");
                    // Emergency local cache/fallback
                    setStartups([{ id: 1, company_name: 'EcoFlow', feature_adoption_rate: 85, active_support_tickets: 1, seat_utilization: 92, risk_level: 'Healthy' }]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, [userRole]);

    useEffect(() => {
        // Simple Simulation Logic: Health = (Adoption * 0.6) + (Seats * 0.4)
        const calculated = (simAdoption * 0.6) + (simSeats * 0.4);
        setSimHealth(calculated.toFixed(1));
    }, [simAdoption, simSeats]);

    const handleLaunchMission = async (startup) => {
        if (addToast) addToast("Mission Briefing", `Initializing deep scan for ${startup.company_name}...`, "info");
        setIsFetchingBrief(true);
        try {
            const res = await axios.get(`http://localhost:5005/api/ai/diagnose/${startup.id}`, {
                headers: { 'x-role': userRole }
            });
            setSelectedMission(res.data);
            setIsModalOpen(true);
            if (addToast) addToast("Node Analyzed", `Inference complete for ${startup.company_name}.`, "success");
        } catch (err) {
            console.error("Diagnostic error:", err);
            setSelectedMission({
                priority: startup.risk_level === 'Healthy' ? 'MEDIUM' : 'CRITICAL',
                objective: `Autonomous Engagement: ${startup.company_name}`,
                churn_risk: `${(100 - (startup.final_health_score || 70)).toFixed(0)}%`,
                suggestedAction: "Trigger re-onboarding sequence via CHED AI browser agent."
            });
            setIsModalOpen(true);
            if (addToast) addToast("Offline Diagnosis", "Displaying structural fallback analysis.", "warning");
        } finally {
            setIsFetchingBrief(false);
        }
    };

    const handleOpenOverride = (col) => {
        if (!canEdit) {
            addToast("Access Denied", "You do not have permission to modify health scores.", "error");
            return;
        }
        setSelectedOverrideStartup(col);
        setIsOverrideOpen(true);
    };

    const submitOverride = async (id, score) => {
        try {
            await axios.post('http://localhost:5005/api/health/update', { startupId: id, score: Number(score) });
            if (addToast) addToast("Health Updated", "Manual override applied successfully.", "success");
            // Refresh logic would go here
        } catch (e) {
            if (addToast) addToast("Update Failed", e.response?.data?.error || "Unknown error", "error");
        }
    };

    const healthDist = [
        { name: '90-100', value: 35, color: '#10b981' },
        { name: '70-90', value: 45, color: '#6366f1' },
        { name: '50-70', value: 15, color: '#f59e0b' },
        { name: '<50', value: 5, color: '#ef4444' }
    ];

    const radarData = [
        { subject: 'Adoption', actual: 65, sim: simAdoption },
        { subject: 'Utilization', actual: 72, sim: simSeats },
        { subject: 'Support', actual: 50, sim: 50 },
        { subject: 'Sentiment', actual: 88, sim: 88 },
        { subject: 'Engagement', actual: 45, sim: 45 },
    ];

    const playbooks = [
        { id: 1, title: 'Early Attrition Bot', goal: 'Re-engage trial users', impact: 'HIGH' },
        { id: 2, title: 'Executive Sync AI', goal: 'Secure renewal commitments', impact: 'MEDIUM' },
        { id: 3, title: 'Adoption Accelerator', goal: 'Drive feature utilization', impact: 'URGENT' }
    ];

    const stats = {
        avgHealth: startups?.length > 0 ? Number(startups.reduce((acc, s) => acc + Number(s.health_score || s.final_health_score || 0), 0) / startups.length).toFixed(0) : 0,
        atRiskCount: startups?.length > 0 ? startups.filter(s => s.risk_level !== 'Healthy').length : 0
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="text-emerald-500 animate-spin" size={40} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse italic">Scanning Health Matrix...</p>
        </div>
    );

    if (error && startups.length === 0) return (
        <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="text-rose-500" size={32} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Sync Error</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed max-w-sm mx-auto">{error}</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700">
            <MissionBriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedMission} />
            <ManualOverrideModal
                isOpen={isOverrideOpen}
                onClose={() => setIsOverrideOpen(false)}
                startup={selectedOverrideStartup}
                onSubmit={submitOverride}
            />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic flex items-center gap-4">
                        <ShieldCheck className="text-emerald-500" size={40} /> CHED <span className="text-emerald-500">Retention</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-none">AI Health Monitor — Role: {userRole}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <ExportButtons userRole={userRole} />
                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">NEURAL DATA STREAM ACTIVE</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
                    <HealthGauge score={stats.avgHealth} />
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 italic">Fleet Pulse</p>
                        <p className="text-2xl font-black text-white italic uppercase">{stats.avgHealth > 80 ? 'OPTIMIZED' : 'WATCH'}</p>
                    </div>
                </div>
                <MetricCard title="At-Risk Accounts" value={stats.atRiskCount} icon={<AlertCircle className="text-rose-500" />} trend="-4.2%" color="bg-rose-500/5 border-rose-500/20" />
                <MetricCard title="Avg Sentiment" value="Neutral+" icon={<HeartPulse className="text-indigo-500" />} trend="+2.4%" color="bg-indigo-500/5 border-indigo-500/20" />
                <MetricCard title="Wait Velocity" value="2.4m" icon={<Zap className="text-amber-500" />} trend="-15%" color="bg-amber-500/5 border-amber-500/20" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Health Distribution & Trend */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform pointer-events-none group-hover:rotate-0 mb-8"><Activity size={200} /></div>
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic flex items-center gap-4">
                            <TrendingUp size={18} className="text-emerald-400" /> Health Velocity Trend (Weekly)
                        </h3>
                    </div>
                    <div className="h-80 relative z-10 w-full">
                        {startups.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                    { date: 'MON', score: 72 },
                                    { date: 'TUE', score: 75 },
                                    { date: 'WED', score: 82 },
                                    { date: 'THU', score: 78 },
                                    { date: 'FRI', score: 85 },
                                    { date: 'SAT', score: 88 },
                                    { date: 'SUN', score: 84 }
                                ]}>
                                    <CartesianGrid strokeDasharray="10 10" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="italic" />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={5} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 10, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">No Trend Data Available</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-12 flex items-center gap-4">
                        <Activity size={18} className="text-indigo-400" /> Health Distribution
                    </h3>
                    <div className="h-64 w-full">
                        {startups.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={healthDist} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                        {healthDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Distribution Null</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 space-y-3">
                        {healthDist.map((h, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800/60 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }}></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">{h.name} SCORE</span>
                                </div>
                                <span className="text-sm font-black text-white italic">{h.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Advanced What-If Analysis */}
                <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10"><Calculator size={120} /></div>
                    <div className="flex justify-between items-center mb-12">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            <SlidersHorizontal className="text-indigo-400" size={18} /> Predictive "What-If" Analysis
                        </h3>
                        <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Projection Health: {simHealth}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-slate-400">
                                    <span>Simulate Adoption</span>
                                    <span className="text-white">{simAdoption}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                    value={simAdoption}
                                    onChange={(e) => setSimAdoption(parseInt(e.target.value))}
                                />
                                <p className="text-[9px] font-medium text-slate-600 uppercase tracking-tighter leading-relaxed">
                                    Predicting impact of mass platform feature rollout on customer resilience.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-slate-400">
                                    <span>Simulate Utilization</span>
                                    <span className="text-white">{simSeats}%</span>
                                </div>
                                <input
                                    type="range"
                                    className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    value={simSeats}
                                    onChange={(e) => setSimSeats(parseInt(e.target.value))}
                                />
                                <p className="text-[9px] font-medium text-slate-600 uppercase tracking-tighter leading-relaxed">
                                    Forecasting expansion probability when license usage exceeds 85%.
                                </p>
                            </div>
                        </div>

                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                    <Radar name="Baseline" dataKey="actual" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                                    <Radar name="Simulation" dataKey="sim" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Playbook Recommendations */}
                    <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
                        <h3 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                            <BookOpen className="text-emerald-400" size={18} /> Recommended Recovery Playbooks
                        </h3>
                        <div className="space-y-4">
                            {playbooks.map(pb => (
                                <div key={pb.id} className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800 hover:border-emerald-500/20 transition-all group flex gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl h-fit group-hover:bg-emerald-500/20 transition-all">
                                        <PlayCircle size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-black text-white italic tracking-tight">{pb.title}</p>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{pb.goal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex flex-col justify-center items-center text-center">
                        <BrainCircuit className="text-indigo-500 mb-4" size={40} />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Neural Sync Status</p>
                        <p className="text-xl font-black text-white italic tracking-tighter uppercase">Fully Synced</p>
                    </div>
                </div>
            </div>

            {/* Main Table Layer */}
            <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-10 rounded-[4rem] shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-black text-slate-400 mb-2 italic tracking-tight uppercase flex items-center gap-4">
                        <Users className="text-indigo-400" /> Account Health Registry
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/10 text-slate-600 uppercase text-[10px] tracking-widest font-black">
                                <th className="py-6 px-8">Startup</th>
                                <th className="py-6 px-8">Strategic Health</th>
                                <th className="py-6 px-8 text-center">Adoption</th>
                                <th className="py-6 px-8 text-center">Seats</th>
                                <th className="py-6 px-8 text-right">Mission Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {startups.map((s, i) => (
                                <tr key={s.id} className="group hover:bg-slate-800/30 transition-all border-b border-slate-800/20 last:border-0 cursor-default">
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center font-black text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg italic text-lg">
                                                {s.company_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-white italic text-base group-hover:text-indigo-400 transition-colors uppercase">{s.company_name}</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{s.industry || 'Tech'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8"><HealthBadge score={s.final_health_score || 70} riskLevel={s.risk_level || 'At-Risk'} /></td>
                                    <td className="py-8 px-8 text-center font-black text-slate-300 italic text-sm">{s.feature_adoption_rate}%</td>
                                    <td className="py-8 px-8 text-center font-black text-slate-300 italic text-sm">{s.seat_utilization}%</td>
                                    <td className="py-8 px-8 text-right">
                                        <button
                                            onClick={() => handleLaunchMission(s)}
                                            disabled={isFetchingBrief}
                                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            {isFetchingBrief ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
                                            Analyze Node
                                        </button>
                                        {canEdit && (
                                            <button
                                                onClick={() => handleOpenOverride(s)}
                                                className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ml-2"
                                            >
                                                Override
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VitalSignsDashboard;

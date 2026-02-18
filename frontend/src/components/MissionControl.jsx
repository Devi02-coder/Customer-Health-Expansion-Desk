import React, { useState, useEffect } from 'react';
import VitalSignsDashboard from './VitalSignsDashboard';
import GrowthEngine from './GrowthEngine';
import AdminDashboard from './AdminDashboard';
import NeuroLink from './NeuroLink';
import SuperAdminDashboard from './SuperAdminDashboard';
import ExecutiveSummary from './ExecutiveSummary';
import ReferralEngine from './ReferralEngine';
import AuditLogs from './AuditLogs';
import LearningStudio from './LearningStudio';
import Customer360 from './Customer360';
import UsageAnalytics from './UsageAnalytics';
import SupportRisk from './SupportRisk';
import SystemConfig from './SystemConfig';
import AlertSystem from './AlertSystem';
import IntegrationHub from './IntegrationHub';
import AgentConsole from './AgentConsole';
import Preferences from './Preferences';

import axios from 'axios';
import { LayoutDashboard, Rocket, LifeBuoy, Settings, ShieldAlert, LogOut, BarChart3, Database, BrainCircuit, Activity, Eye, Zap, Fingerprint, Layers, TrendingUp, Cpu, Share2, ShieldCheck, Microscope, ChevronRight, Bell, Command, Search, Globe, AlertTriangle, Sliders, Heart, Info, Loader2, Lock, ShieldX, RefreshCw } from 'lucide-react';

// STABILITY FIX: React Error Boundary to prevent total app crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("MISSION_CRITICAL_FAILURE:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 bg-slate-950/50 rounded-[3rem] border border-rose-500/20 shadow-2xl animate-in fade-in duration-500">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/30">
                        <ShieldX className="text-rose-500 animate-pulse" size={48} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Neural Link Severed</h2>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                            The requested module encountered a terminal logic error. Structural integrity maintained.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest italic transition-all flex items-center gap-4"
                    >
                        <RefreshCw size={18} /> Re-Initialize Kernel
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// STABILITY FIX: Access Denied Fallback UI
const AccessDenied = ({ moduleLabel }) => (
    <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30">
            <Lock className="text-amber-500" size={48} />
        </div>
        <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Authority Restricted</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                Your current role does not possess the level 05 clearance required for the <span className="text-amber-500">"{moduleLabel}"</span> module.
            </p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl">
            <ShieldAlert size={16} className="text-slate-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol CHED-RBAC-403 Active</span>
        </div>
    </div>
);

// STABILITY FIX: Route/Module Guard
const ProtectedModule = ({ isAllowed, moduleLabel, children }) => {
    if (!isAllowed) return <AccessDenied moduleLabel={moduleLabel} />;
    return children;
};

const ROLE_DEFAULTS = {
    'Super Admin': 'SYSTEM_BRAIN',
    'Admin': 'ADMIN_OPS',
    'Manager': 'HEALTH_MATRIX',
    'Sales / Success': 'HEALTH_MATRIX',
    'Observer': 'CUSTOMER_360'
};

// Moved ALL_MODULES outside to ensure reference stability during re-renders
const ALL_MODULES = (addToast, userRole) => [
    { id: 'SYSTEM_BRAIN', label: 'System Brain', icon: <Fingerprint size={20} />, component: <SuperAdminDashboard addToast={addToast} /> },
    { id: 'HEALTH_MATRIX', label: 'Health Matrix', icon: <Activity size={20} />, component: <VitalSignsDashboard userRole={userRole} addToast={addToast} /> },
    { id: 'EXPANSION_AI', label: 'Expansion AI', icon: <Rocket size={20} />, component: <GrowthEngine userRole={userRole} addToast={addToast} /> },
    { id: 'REFERRAL_SCOUT', label: 'Referral Scout', icon: <Share2 size={20} />, component: <ReferralEngine userRole={userRole} addToast={addToast} /> },
    { id: 'CUSTOMER_360', label: 'Customer 360', icon: <Globe size={20} />, component: <Customer360 userRole={userRole} addToast={addToast} /> },
    { id: 'USAGE_DEPTH', label: 'Usage Depth', icon: <BarChart3 size={20} />, component: <UsageAnalytics userRole={userRole} addToast={addToast} /> },
    { id: 'SENTIMENT_AI', label: 'Sentiment AI', icon: <Heart size={20} />, component: <SupportRisk userRole={userRole} addToast={addToast} /> },
    { id: 'INTEGRATION_HUB', label: 'Integration Hub', icon: <Database size={20} />, component: <IntegrationHub addToast={addToast} /> },
    { id: 'NEURO_LINK', label: 'Neuro-Link', icon: <BrainCircuit size={20} />, component: <NeuroLink addToast={addToast} /> },
    { id: 'AI_STUDIO', label: 'AI Studio', icon: <Microscope size={20} />, component: <LearningStudio addToast={addToast} /> },
    { id: 'SECURITY_AUDIT', label: 'Security Audit', icon: <ShieldCheck size={20} />, component: <AuditLogs addToast={addToast} /> },
    { id: 'ALERT_CENTER', label: 'Alert Center', icon: <ShieldAlert size={20} />, component: <AlertSystem userRole={userRole} addToast={addToast} /> },
    { id: 'EXECUTIVE_LENS', label: 'Executive Lens', icon: <Eye size={20} />, component: <ExecutiveSummary addToast={addToast} /> },
    { id: 'AGENT_CONSOLE', label: 'Agent Console', icon: <Cpu size={20} />, component: <AgentConsole userRole={userRole} addToast={addToast} /> },
    { id: 'SYSTEM_CORE', label: 'System Core', icon: <Sliders size={20} />, component: <SystemConfig userRole={userRole} addToast={addToast} /> },
    { id: 'ADMIN_OPS', label: 'Admin Ops', icon: <Layers size={20} />, component: <AdminDashboard userRole={userRole} addToast={addToast} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={20} />, component: <Preferences userRole={userRole} addToast={addToast} /> }
];

const MissionControl = () => {
    const [userRole, setUserRole] = useState('Super Admin');
    const [activeTab, setActiveTab] = useState('SYSTEM_BRAIN');
    const [toasts, setToasts] = useState([]);

    const addToast = React.useCallback((title, message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const modules = React.useMemo(() => ALL_MODULES(addToast, userRole), [userRole, addToast]);
    const [grantedModules, setGrantedModules] = useState([]);
    const [sysInfo, setSysInfo] = useState({ connectivity: 'Syncing...', uptime: '0.0h' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [isInitialSync, setIsInitialSync] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: true,
        neuralSync: true,
        autoDeploy: false,
        biometricAuth: true
    });

    const toggleSetting = React.useCallback((key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        addToast("Setting Updated", `${key.charAt(0).toUpperCase() + key.slice(1)} modified successfully.`, "success");
    }, [addToast]);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'AI Model Drift Detected', desc: 'Pulse AI health score dropped 12% in last 2h.', time: 'Just Now', type: 'warning' },
        { id: 2, title: 'Expansion Trigger', desc: 'EcoFlow reached 85% utilization threshold.', time: '14m ago', type: 'success' },
        { id: 3, title: 'Security Protocol Updated', desc: 'New RSA-4096 keys deployed to edge nodes.', time: '1h ago', type: 'info' }
    ]);

    const ROLES_LIST = ['Super Admin', 'Admin', 'Manager', 'Sales / Success', 'Observer'];

    // Unified fetch logic
    useEffect(() => {
        setIsInitialSync(true); // Re-activate sync state for role changes
        fetchPermissions();
        if (userRole === 'Super Admin') {
            fetchSysInfo();
        }
    }, [userRole]);

    const fetchPermissions = async () => {
        const roleMap = { 'Super Admin': 1, 'Admin': 2, 'Manager': 3, 'Sales / Success': 4, 'Observer': 5 };
        const userId = roleMap[userRole] || 1;

        try {
            const res = await axios.get('http://localhost:5005/api/user/permissions', {
                headers: { 'x-role': userRole, 'x-user-id': userId }
            });

            // Stable Modules Logic
            let allowedModules = res.data.modules || [];
            if (allowedModules.length === 0 && userRole === 'Super Admin') {
                // If API returns empty but role is SA, grant all
                allowedModules = ALL_MODULES(addToast, userRole).map(m => ({ key: m.id, can_edit: true }));
            }

            setGrantedModules(allowedModules);

            const allowedKeys = allowedModules.map(m => m.key);
            if (allowedKeys.length > 0 && !allowedKeys.includes(activeTab)) {
                setActiveTab(allowedKeys[0]);
            }
        } catch (e) {
            console.error("Permission Sync Error:", e);
            // Emergency Fallback: If Super Admin, show everything.
            if (userRole === 'Super Admin') {
                const allMods = ALL_MODULES(addToast, userRole).map(m => ({ key: m.id, can_edit: true }));
                setGrantedModules(allMods);
                // Reset active tab if needed
                if (!allMods.find(m => m.key === activeTab)) setActiveTab(allMods[0].key);
            } else {
                setGrantedModules([]);
            }
        } finally {
            setIsInitialSync(false);
        }
    };

    const fetchSysInfo = async () => {
        try {
            const res = await axios.get('http://localhost:5005/api/admin/identity-config', {
                headers: { 'x-role': userRole }
            });
            setSysInfo(res.data.system_stats);
        } catch (e) {
            setSysInfo({ connectivity: 'Local-Only', uptime: 'N/A' });
        }
    };

    const handleSearch = (val) => {
        setSearchQuery(val);
        if (val.length === 0) {
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    // Real-Time Debounced Search Effect
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const roleMap = { 'Super Admin': 1, 'Admin': 2, 'Manager': 3, 'Sales / Success': 4, 'Observer': 5 };
        const userId = roleMap[userRole] || 1;

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await axios.get(`http://localhost:5005/api/search?q=${searchQuery}`, {
                    headers: { 'x-role': userRole, 'x-user-id': userId }
                });
                setSearchResults(res.data);
            } catch (e) {
                console.error("Search Error:", e);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms Debounce

        return () => clearTimeout(timer);
    }, [searchQuery, userRole]);

    const navigateFromSearch = (result) => {
        setSearchQuery('');
        setSearchResults([]);
        if (result.type === 'Startup') setActiveTab('HEALTH_MATRIX');
        else if (result.type === 'Opportunity') setActiveTab('EXPANSION_AI');
        else if (result.type === 'Referral') setActiveTab('REFERRAL_SCOUT');
        addToast("Warp Active", `Navigating to ${result.title} context.`, "success");
    };

    const roleMap = React.useMemo(() => ({ 'Super Admin': 1, 'Admin': 2, 'Manager': 3, 'Sales / Success': 4, 'Observer': 5 }), []);
    const userId = roleMap[userRole] || 1;

    const accessibleModules = modules.filter(m => {
        // Fallback: If modules list is empty but role is SA, allow all (client-side override)
        if (grantedModules.length === 0 && userRole === 'Super Admin') return true;

        return grantedModules.some(gm => gm.key === m.id) || m.id === 'preferences';
    });

    const activeModule = accessibleModules.find(m => m.id === activeTab) || accessibleModules[0] || modules[0];
    const activeTabLabel = activeModule?.label || 'Mission Control';

    // Find permission for the CURRENT active module
    const currentPermission = grantedModules.find(gm => gm.key === (activeModule?.id));
    const canEdit = userRole === 'Super Admin' ? true : (currentPermission ? currentPermission.can_edit : false);

    // Inject props with safety check & Wrap with Guards
    // If SA, always allowed. If waiting for sync (grantedModules empty), wait unless SA fallback logic above handles it.
    const isAllowed = userRole === 'Super Admin' || grantedModules.some(gm => gm.key === activeModule?.id);

    const renderedComponent = (
        <ErrorBoundary key={activeTab}>
            <React.Suspense fallback={
                <div className="p-20 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="text-indigo-500 animate-spin" size={32} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Loading Neural Module...</p>
                </div>
            }>
                <ProtectedModule isAllowed={isAllowed} moduleLabel={activeTabLabel}>
                    {activeModule?.component ? React.cloneElement(activeModule.component, {
                        userRole,
                        userId,
                        addToast,
                        canEdit,
                        settings,
                        toggleSetting
                    }) : <div className="p-20 text-slate-500 font-black italic uppercase tracking-widest text-center">Neural Link Synchronizing...</div>}
                </ProtectedModule>
            </React.Suspense>
        </ErrorBoundary>
    );

    return (
        <div className="flex h-screen bg-[#020617] overflow-hidden font-['Outfit'] select-none">
            {/* Sidebar */}
            <aside className="w-20 lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col items-center lg:items-start py-10 transition-all relative z-50 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
                <div className="px-10 mb-16 space-y-8 w-full">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(79,70,229,0.3)] transform -rotate-6 hover:rotate-0 transition-all cursor-pointer group">
                            <Zap className="text-white group-hover:scale-125 transition-transform" size={28} />
                        </div>
                        <div className="hidden lg:block">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] italic mb-1 block">CHED: CORE</span>
                            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">MISSION <span className="text-indigo-400">CONTROL</span></span>
                        </div>
                    </div>

                    {/* Role Switcher (Demo Context) */}
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 hidden lg:block">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 italic flex items-center gap-2">
                            <Command size={10} /> Kernel Authority Context
                        </p>
                        <select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="w-full bg-transparent text-white font-black italic text-xs uppercase tracking-tighter outline-none cursor-pointer hover:text-indigo-400 transition-colors"
                        >
                            {ROLES_LIST.map(r => (
                                <option key={r} value={r} className="bg-slate-900 border-none">{r}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <nav className="flex-1 w-full px-8 space-y-4 overflow-y-auto no-scrollbar pb-10">
                    {accessibleModules.map(tab => (
                        <NavItem
                            key={tab.id}
                            icon={tab.icon}
                            label={tab.label}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                    <div className="pt-10 opacity-10"><div className="h-0.5 bg-slate-500 w-full rounded-full" /></div>
                </nav>

                <div className="px-8 w-full mt-auto mb-10 space-y-6">
                    {sysInfo && userRole === 'Super Admin' && (
                        <div className="hidden lg:block mb-6 px-6 py-4 bg-slate-950/60 rounded-3xl border border-slate-800/60 transition-all hover:border-indigo-500/20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural Continuity</span>
                                <span className={`text-[9px] font-black uppercase flex items-center gap-2 ${settings.neuralSync ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${settings.neuralSync ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                    {settings.neuralSync ? (sysInfo.connectivity || 'Active') : 'Offline-Mode'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${settings.neuralSync ? 'bg-indigo-600 w-[94%] shadow-[0_0_10px_#4f46e5]' : 'bg-slate-800 w-[5%]'}`}></div>
                            </div>
                        </div>
                    )}
                    <NavItem icon={<LogOut size={20} />} label="Disconnect" active={false} onClick={() => { }} danger />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-950 relative custom-scrollbar">
                {/* Top Glass Header */}
                <header className="sticky top-0 w-full h-24 bg-slate-950/40 backdrop-blur-3xl border-b border-slate-800/10 z-40 px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Command className="text-slate-700" size={18} />
                        <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-widest italic leading-none">
                            <span>CHED_ROOT</span>
                            <ChevronRight size={14} className="opacity-30" />
                            <span>{userRole.replace(' ', '_').toUpperCase()}</span>
                            <ChevronRight size={14} className="opacity-30" />
                            <span className="text-indigo-400">{activeTabLabel?.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-hover:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="GLOBAL_SEARCH..."
                                className="bg-slate-900/60 border border-slate-800/40 rounded-2xl py-3 pl-12 pr-12 text-[10px] font-black uppercase text-white outline-none focus:border-indigo-500/30 w-72 transition-all italic"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <RefreshCw className="text-indigo-500 animate-spin" size={14} />
                                </div>
                            )}
                            {searchResults.length > 0 && (
                                <div className="absolute top-16 left-0 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                                    <div className="p-4 bg-slate-950/40 border-b border-white/5">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Inference Results</p>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                        {searchResults.length > 0 ? searchResults.map((r, i) => (
                                            <div
                                                key={i}
                                                onClick={() => navigateFromSearch(r)}
                                                className="p-5 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-xs font-black text-white italic transition-colors group-hover:text-indigo-400">{r.title}</p>
                                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-500/20 px-2 py-0.5 rounded-full">{r.type}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate">{r.subtitle}</p>
                                            </div>
                                        )) : (
                                            <div className="p-10 text-center">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Inference Null: Restricted or Non-Existent</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-10 w-px bg-slate-800/40 hidden lg:block"></div>
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={`p-4 hover:bg-slate-800 border rounded-2xl transition-all relative ${isNotificationOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800/40 text-slate-500'}`}
                        >
                            <Bell size={20} />
                            {settings.notifications && notifications.length > 0 && (
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950"></span>
                            )}
                        </button>
                    </div>

                    {/* Notification Drawer */}
                    {isNotificationOpen && (
                        <div className="absolute top-28 right-10 w-96 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Neural Notifications</h3>
                                <button onClick={() => setNotifications([])} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Clear All</button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div key={n.id} className="p-8 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'}`}>{n.title}</p>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-white transition-colors uppercase italic">{n.desc}</p>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">No active threats detected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <div className="fixed top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08),transparent_70%)] pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto pb-32 pt-10 px-10 relative z-10 font-['Outfit']">
                    {isInitialSync ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-6">
                            <Loader2 className="text-indigo-500 animate-spin" size={40} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Neural Permissions...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                            {renderedComponent}
                        </div>
                    )}
                </div>
            </main>

            {/* Toast System */}
            <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`w-80 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex gap-4 animate-in slide-in-from-right-10 duration-500 pointer-events-auto`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {t.type === 'success' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white italic uppercase tracking-widest">{t.title}</p>
                            <p className="text-[11px] font-bold text-slate-500 italic mt-1 leading-tight">{t.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

const NavItem = ({ icon, label, active, onClick, danger, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={disabled ? "Restricted: Contact Super Admin for access" : ""}
        className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${active
            ? 'bg-indigo-600 text-white shadow-[0_20px_40px_rgba(79,70,229,0.25)] translate-x-2'
            : disabled
                ? 'opacity-30 grayscale cursor-not-allowed pointer-events-none'
                : danger
                    ? 'text-slate-600 hover:bg-rose-500/10 hover:text-rose-400'
                    : 'text-slate-600 hover:bg-slate-800/40 hover:text-white'
            }`}
    >
        {active && <div className="absolute top-0 left-0 w-2 h-full bg-white/30"></div>}
        <div className={`transition-all duration-300 ${active ? 'scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
            {icon}
        </div>
        <div className="flex-1 flex items-center justify-between overflow-hidden">
            <span className={`hidden lg:block font-black text-[12px] uppercase tracking-[0.2em] italic truncate ${active ? 'text-white' : 'group-hover:translate-x-2 transition-transform'}`}>
                {label}
            </span>
            {disabled && <ShieldCheck size={12} className="text-slate-600 ml-2 hidden lg:block" />}
        </div>
        {active && (
            <div className="hidden lg:block ml-auto">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff] animate-pulse" />
            </div>
        )}
    </button>
);


export default MissionControl;

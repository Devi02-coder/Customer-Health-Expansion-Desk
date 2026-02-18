import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Cpu, Bot, User, Sparkles, Zap, ShieldAlert, Loader2, Command, Layers, Search } from 'lucide-react';
import axios from 'axios';

const AgentConsole = ({ userRole, userId, addToast }) => {
    const [messages, setMessages] = useState([
        { id: '1', sender: 'ai', text: 'Neural Link Established. System Brain Online.', timestamp: 'SYSTEM_START' },
        { id: '2', sender: 'ai', text: 'I am your autonomous CHED assistant. I can analyze churn risks, expansion opportunities, and dispatch communication sequences. How shall we proceed?', timestamp: 'INIT' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [systemStatus, setSystemStatus] = useState('online');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                await axios.get('http://localhost:5005/api/user/permissions', {
                    headers: { 'x-role': userRole, 'x-user-id': userId }
                });
                setSystemStatus('online');
            } catch (e) {
                setSystemStatus('offline');
            }
        };
        checkConnection();
        const interval = setInterval(checkConnection, 10000);
        return () => clearInterval(interval);
    }, [userRole]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        if (systemStatus === 'offline') {
            addToast("Neural Breach", "Cannot transmit: Deep Stream connectivity lost.", "error");
            return;
        }

        const userMsg = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5005/api/ai/chat', {
                message: input,
                context: { role: userRole }
            }, {
                headers: { 'x-role': userRole, 'x-user-id': userId }
            });

            const aiMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: res.data.reply, timestamp: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            addToast("Inference Error", "AI kernel failed to respond. Retrying sync...", "error");
            setSystemStatus('offline');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700 h-[calc(100vh-160px)] flex flex-col">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic flex items-center gap-4">
                        <Cpu className="text-indigo-500 shadow-[0_0_15px_#4f46e5]" size={40} /> AGENT <span className="text-indigo-500">CONSOLE</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic flex items-center gap-3">
                        <Terminal size={14} className="text-emerald-500" /> Autonomous Neural Interface — Role: {userRole}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 transition-all ${systemStatus === 'online' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${systemStatus === 'online' ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                        <span className={`text-xs font-black uppercase tracking-widest italic ${systemStatus === 'online' ? 'text-indigo-400' : 'text-rose-500'}`}>
                            {systemStatus === 'online' ? 'NEURAL LINK ACTIVE' : 'NEURAL LINK SEVERED'}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-10 min-h-0">
                {/* Chat Interface */}
                <div className="lg:col-span-8 flex-1 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Bot className="text-indigo-400" size={20} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic tracking-[0.2em]">Neural Stream Log</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700 uppercase italic">RSA-4096 Encrypted</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                <div className={`flex gap-4 max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${m.sender === 'user' ? 'bg-slate-950 border-indigo-500/30 text-indigo-400' : 'bg-slate-950 border-emerald-500/30 text-emerald-400'}`}>
                                        {m.sender === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                                    </div>
                                    <div className={`p-6 rounded-3xl border ${m.sender === 'user' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'} shadow-xl`}>
                                        <p className="text-sm font-medium leading-relaxed italic">{m.text}</p>
                                        <p className={`text-[8px] font-black uppercase mt-3 tracking-widest opacity-40 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.timestamp}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-in fade-in">
                                <div className="flex gap-4 items-center p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
                                    <Loader2 className="text-indigo-500 animate-spin" size={20} />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">AI is computing response...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-8 bg-slate-950/60 border-t border-slate-800">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="QUERY SYSTEM_BRAIN (e.g. 'Show high risk accounts')..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-5 pl-8 pr-20 text-xs font-black uppercase text-white outline-none focus:border-indigo-500 transition-all italic tracking-tight"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Stats/Shortcuts */}
                <div className="lg:w-80 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
                        <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <Layers size={16} className="text-amber-400" /> Active Context
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Revenue Pulse', val: 'POSITIVE' },
                                { label: 'Risk Threshold', val: '40%' },
                                { label: 'Sync Accuracy', val: '99.8%' }
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                    <span className="text-[9px] font-black text-slate-600 uppercase italic">{s.label}</span>
                                    <span className="text-[10px] font-black text-white italic">{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl group transition-all hover:border-indigo-500/30">
                        <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <Zap size={16} className="text-indigo-400" /> Quick Commands
                        </h3>
                        <div className="space-y-3">
                            {[
                                'Analyze Churn Risks',
                                'Check Upsell Leads',
                                'System Status Report',
                                'Dispatch Referrals'
                            ].map((cmd, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(cmd)}
                                    className="w-full text-left p-4 bg-slate-950/60 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-indigo-400 transition-all italic flex justify-between items-center"
                                >
                                    {cmd}
                                    <Command size={12} className="opacity-30" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 border border-indigo-500 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12"><Search size={80} /></div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 italic">Knowledge Base</p>
                        <p className="text-xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">Global Index</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Open Neural Docs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentConsole;

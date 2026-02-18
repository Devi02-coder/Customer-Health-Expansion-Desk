import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2, CheckCircle2, Database } from 'lucide-react';

const ExportButtons = ({ allowedRoles = ['Super Admin', 'Admin', 'CS Manager', 'Sales Engine'], userRole }) => {
    const [exporting, setExporting] = useState(null); // 'csv' | 'pdf' | null

    const handleDownload = (type) => {
        setExporting(type);
        // Using window.open for demo, but in a real app you might use axios to handle auth headers if the endpoint is protected
        window.open(`http://localhost:8000/export/${type}`, "_blank");

        setTimeout(() => {
            setExporting(null);
        }, 3000);
    };

    if (!allowedRoles.includes(userRole)) return null;

    return (
        <div className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <button
                onClick={() => handleDownload('csv')}
                disabled={exporting !== null}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border shadow-2xl ${exporting === 'csv' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'}`}
            >
                {exporting === 'csv' ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : exporting === null ? (
                    <FileSpreadsheet size={16} />
                ) : (
                    <CheckCircle2 size={16} />
                )}
                {exporting === 'csv' ? 'Synthesizing...' : 'Export_CSV'}
            </button>

            <button
                onClick={() => handleDownload('pdf')}
                disabled={exporting !== null}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border shadow-2xl ${exporting === 'pdf' ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'}`}
            >
                {exporting === 'pdf' ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : exporting === null ? (
                    <FileText size={16} />
                ) : (
                    <CheckCircle2 size={16} />
                )}
                {exporting === 'pdf' ? 'Generating...' : 'Export_PDF'}
            </button>

            <button
                onClick={() => handleDownload('streaming-large')}
                disabled={exporting !== null}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border shadow-2xl ${exporting === 'streaming-large' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30'}`}
            >
                {exporting === 'streaming-large' ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : exporting === null ? (
                    <Database size={16} />
                ) : (
                    <CheckCircle2 size={16} />
                )}
                {exporting === 'streaming-large' ? 'Streaming...' : 'Neural_Dump'}
            </button>
        </div>
    );
};

export default ExportButtons;

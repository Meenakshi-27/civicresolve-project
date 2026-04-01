import React from 'react';
import { Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

const StatusTracker = ({ complaints }) => {
  if (complaints.length === 0) return null;

  const getStatusStep = (status) => {
    switch(status) {
      case 'Resolved': return 4;
      case 'Action Taken': return 3;
      case 'In Progress': return 2;
      case 'Pending': return 1;
      default: return 1;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Clock className="text-primary" size={32} />
        Live Tracking Dashboard
      </h2>
      <div className="grid gap-8">
        {complaints.map((c, i) => {
          const step = getStatusStep(c.status);
          return (
            <div key={c.id} className="glass p-8 border-l-8 border-primary bg-white/60 dark:bg-slate-900/40 relative shadow-xl hover:scale-[1.01] transition-transform">
              <div className="absolute top-0 right-0 p-6">
                 <span className={`badge priority-${c.priority.toLowerCase()} shadow-sm`}>{c.status}</span>
              </div>
              
              <div className="flex gap-5 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                   <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Report #{c.id}</h3>
                  <p className="text-sm font-semibold opacity-50 uppercase tracking-widest">{c.category}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 italic text-lg text-slate-700 dark:text-slate-300">
                "{c.originalText}"
              </div>

              {/* Enhanced Timeline View */}
              <div className="mt-8 mb-10 flex justify-between relative px-2">
                <div className="absolute top-[20px] left-[10%] right-[10%] h-[4px] bg-slate-200 dark:bg-slate-800 -z-10 rounded-full">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(step-1)*33.33}%` }}></div>
                </div>
                
                {[
                    { icon: Send, label: 'Reported', s: 1 },
                    { icon: ShieldCheck, label: 'A.I. Routed', s: 2 },
                    { icon: Clock, label: 'Processing', s: 3 },
                    { icon: CheckCircle2, label: 'Resolved', s: 4 }
                ].map((item, idx) => {
                    const isActive = step >= item.s;
                    return (
                        <div key={idx} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${isActive ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'}`}>
                                <item.icon size={20} />
                            </div>
                            <span className={`text-[10px] uppercase font-black tracking-tighter ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-40'}`}>{item.label}</span>
                        </div>
                    );
                })}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-transparent dark:from-emerald-900/20 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
                 <p className="text-xs uppercase font-black text-emerald-600 dark:text-emerald-400 mb-2 tracking-[0.2em]">Official AI-Enhanced Response</p>
                 <p className="text-lg font-bold leading-relaxed">{c.response}</p>
                 <div className="mt-3 flex gap-3 text-xs opacity-50 font-bold uppercase">
                    <span>Department: {c.department}</span>
                    <span>•</span>
                    <span>Priority: {c.priority}</span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;

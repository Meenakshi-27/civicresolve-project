import React, { useState, useEffect } from 'react';
import ReportForm from './components/ReportForm';
import AdminDashboard from './components/AdminDashboard';
import StatusTracker from './components/StatusTracker';
import { User, Shield, Info, LogOut, Heart, Globe } from 'lucide-react';

function App() {
  const [view, setView] = useState('citizen'); // 'citizen' or 'admin'
  const [complaints, setComplaints] = useState([
    {
      id: 'z9k2m1l',
      originalText: 'മാലിന്യം കുമിഞ്ഞുകൂടുന്നു (Garbage near market)',
      translatedText: 'garbage accumulation',
      detectedLang: 'Malayalam',
      category: 'Waste Management',
      department: 'Municipality',
      priority: 'High',
      reasoning: 'High priority due to repeat reports in market area.',
      action: 'Schedule emergency cleanup',
      status: 'In Progress',
      timestamp: new Date().toISOString(),
      response: 'നിങ്ങളുടെ പരാതി കൈമാറി. മാലിന്യം നീക്കം ചെയ്യാൻ നടപടി എടുത്തു.'
    },
    {
      id: 'w4n5o6p',
      originalText: 'Water leak on MG road',
      translatedText: 'water leak on mg road',
      detectedLang: 'English',
      category: 'Water Authority',
      department: 'Water Board',
      priority: 'Medium',
      reasoning: 'Standard leak report.',
      action: 'Dispatch repair plumbing team',
      status: 'Pending',
      timestamp: new Date().toISOString(),
      response: 'Your complaint regarding Water Authority has been routed to Water Board.'
    }
  ]);

  const handleNewComplaint = (newComplaint) => {
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('civic-resolve-complaints', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Enhanced Navigation Bar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8 mx-6 mt-6 flex justify-between items-center bg-white/20 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-sm overflow-hidden border border-slate-100">
             <img src="/logo.png" alt="CIVICRESOLVE Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-blue-900">CIVICRESOLVE</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Where citizens are heard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('citizen')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'citizen' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            <User size={18} />
            <span className="font-semibold">Citizen Portal</span>
          </button>
          <button 
             onClick={() => setView('admin')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            <Shield size={18} />
            <span className="font-semibold">Admin Panel</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="animate-in fade-in zoom-in-95 duration-500">
        {view === 'citizen' ? (
          <div className="container">
            <div className="text-center mb-12">
               <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                 Solve Issues. Together.
               </h2>
               <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                 Report environmental concerns in your native language. Our AI handles the translation & routing instantly.
               </p>
            </div>

            <ReportForm onSubmitted={handleNewComplaint} />
            
            {complaints.length > 0 && <StatusTracker complaints={complaints} />}
            
            {complaints.length === 0 && (
              <div className="text-center py-20 opacity-30">
                 <Heart size={64} className="mx-auto mb-4" />
                 <p className="text-xl">Be the change your city needs. Report an issue above.</p>
              </div>
            )}
          </div>
        ) : (
          <AdminDashboard complaints={complaints} />
        )}
      </main>

      {/* Simplified Footer for Inclusivity */}
      <footer className="mt-20 border-t border-glass pt-10 pb-10 text-center opacity-50 text-sm">
        <p>© 2026 CIVICRESOLVE Smart City initiative | Built for All Citizens</p>
        <div className="flex justify-center gap-4 mt-4">
           <span className="flex items-center gap-1"><Info size={14} /> Help</span>
           <span className="flex items-center gap-1"><LogOut size={14} /> Logout</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

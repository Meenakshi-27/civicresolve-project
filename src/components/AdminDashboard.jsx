import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  AlertCircle, Clock, CheckCircle2, TrendingUp, Filter, Search, MoreVertical, 
  Map as MapIcon, Calendar, CheckSquare, Zap
} from 'lucide-react';

const AdminDashboard = ({ complaints }) => {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filtering Logic
  const filteredComplaints = complaints.filter(c => {
    const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch = c.originalText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesCategory && matchesSearch;
  });

  // 2. Chart Data Calculations
  const categoryData = [
    { name: 'Waste', value: complaints.filter(c => c.category === 'Waste Management').length },
    { name: 'Water', value: complaints.filter(c => c.category === 'Water Authority').length },
    { name: 'Air', value: complaints.filter(c => c.category === 'Pollution Control').length },
    { name: 'Noise', value: complaints.filter(c => c.category === 'Noise Control').length },
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'High', value: complaints.filter(c => c.priority === 'High').length },
    { name: 'Medium', value: complaints.filter(c => c.priority === 'Medium').length },
    { name: 'Low', value: complaints.filter(c => c.priority === 'Low').length },
  ];

  const resolutionData = [
    { day: 'Mon', resolved: 12, pending: 5 },
    { day: 'Tue', resolved: 19, pending: 8 },
    { day: 'Wed', resolved: 15, pending: 12 },
    { day: 'Thu', resolved: 22, pending: 6 },
    { day: 'Fri', resolved: 30, pending: 4 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="container animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-800 dark:text-white">Authority Command</h1>
          <p className="text-xl text-slate-500 font-medium">EcoResolve Intelligent Management System</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="glass p-4 flex items-center gap-3 bg-primary/5 border-primary/20">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Zap size={24} />
            </div>
            <div>
                <span className="block font-bold text-2xl leading-none">{complaints.length}</span>
                <span className="text-xs uppercase font-bold opacity-50">Total Intake</span>
            </div>
          </div>
          <div className="glass p-4 flex items-center gap-3 bg-emerald-500/5 border-emerald-500/20">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600">
                <CheckSquare size={24} />
            </div>
            <div>
                <span className="block font-bold text-2xl leading-none">84%</span>
                <span className="text-xs uppercase font-bold opacity-50">Resolution Rate</span>
            </div>
          </div>
        </div>
      </header>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 shadow-xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Incident Trends (Weekly)
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={4} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 shadow-xl flex flex-col">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> Priority Pulse
          </h3>
          <div className="h-[200px] flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {priorityData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs font-bold uppercase opacity-70">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    {d.name} ({d.value})
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass p-6 lg:col-span-1 shadow-xl bg-slate-900 border-slate-700 text-white overflow-hidden relative min-h-[300px]">
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <MapIcon size={20} className="text-primary" /> Live Hotspots
                </h3>
                <p className="text-xs opacity-60 mb-6 uppercase font-bold tracking-widest">Real-time geographic clustering</p>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-sm">Central Square</span>
                        <span className="badge priority-high text-[10px]">Critical</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-sm">Metro Station B</span>
                        <span className="badge priority-medium text-[10px]">Active</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-sm">Public Garden</span>
                        <span className="badge priority-low text-[10px]">Cleared</span>
                    </div>
                </div>
            </div>
            
            {/* Heatmap Visual Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-orange-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>
          </div>

          <div className="glass p-6 lg:col-span-3 shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-500" /> Departmental Load
            </h3>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
      </div>

      {/* Complaint Table Control Center */}
      <section className="glass overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-glass flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/40">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <Filter size={16} className="opacity-40" />
                <select 
                    className="bg-transparent text-sm font-bold focus:outline-none"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                >
                    <option value="All">All Priority</option>
                    <option value="High">High Only</option>
                    <option value="Medium">Medium Only</option>
                    <option value="Low">Low Only</option>
                </select>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <select 
                    className="bg-transparent text-sm font-bold focus:outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Waste Management">Waste</option>
                    <option value="Water Authority">Water</option>
                    <option value="Pollution Control">Air/Pollution</option>
                    <option value="Noise Control">Noise</option>
                </select>
            </div>

            <div className="relative flex-grow md:flex-grow-0">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="text" 
                placeholder="Search by ID, text, or dept..." 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2 font-bold px-6 py-2.5 shadow-lg">
            <Calendar size={18} /> Export Reports
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-slate-500 font-bold bg-slate-50/50 dark:bg-slate-900/20">
                <th className="p-6">Submission Details</th>
                <th className="p-6">Content Intelligence</th>
                <th className="p-6">Priority & Reasoning</th>
                <th className="p-6">Recommended Action</th>
                <th className="p-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="opacity-30">
                        <Zap size={64} className="mx-auto mb-4" />
                        <h4 className="text-xl font-bold">No Records Found</h4>
                        <p>Adjust your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="border-t border-glass hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-6 font-mono text-xs">
                     <span className="block opacity-40 mb-1">ID: #{complaint.id}</span>
                     <span className="block font-bold text-slate-800 dark:text-slate-300">
                        {new Date(complaint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                     <span className="opacity-40">{new Date(complaint.timestamp).toLocaleDateString()}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full uppercase font-bold">{complaint.detectedLang}</span>
                      <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase font-bold">{complaint.category}</span>
                    </div>
                    <div className="text-sm font-bold mb-1 line-clamp-1">{complaint.originalText}</div>
                    <div className="text-xs opacity-50 italic">AI: "{complaint.translatedText}"</div>
                  </td>
                  <td className="p-6">
                    <span className={`badge priority-${complaint.priority.toLowerCase()} mb-2 inline-block px-3 py-1 text-[10px]`}>{complaint.priority}</span>
                    <p className="text-[11px] opacity-70 leading-relaxed font-medium bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        {complaint.reasoning}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3 text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                      <Zap size={18} className="text-emerald-500" />
                      {complaint.action}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-transform hover:scale-110"><MoreVertical size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;


import React, { useMemo, useState } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CalendarRange, 
  Activity, 
  ArrowRightCircle,
  Euro,
  TrendingUp,
  Briefcase,
  Filter,
  X,
  Calendar,
  ChevronRight,
  Target
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0); 
  const [filterCollab, setFilterCollab] = useState<string>('all');
  const [filterSeller, setFilterSeller] = useState<string>('all');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');

  const STATUS_COLORS: Record<string, string> = {
    'En Curso': '#3B82F6',
    'Gestionando': '#F59E0B',
    'Gestionado': '#669900',
    'Anulado': '#EF4444'
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCollab = filterCollab === 'all' || p.ldapCollaborator === filterCollab;
      const matchSeller = filterSeller === 'all' || p.step2Collaborator === filterSeller;
      const date = p.receptionDate ? new Date(p.receptionDate) : null;
      const matchStart = !filterStart || (date && date >= new Date(filterStart));
      const matchEnd = !filterEnd || (date && date <= new Date(filterEnd));
      return matchCollab && matchSeller && matchStart && matchEnd;
    });
  }, [projects, filterCollab, filterSeller, filterStart, filterEnd]);

  // ANÁLISIS FASE 1: ACOGIDA Y CONVERSIÓN
  const acogidaStats = useMemo(() => {
    return COLLABORATORS.map(collab => {
      const name = collab.split(' ')[1];
      const collProjs = filteredProjects.filter(p => p.ldapCollaborator === collab);
      const reachedP3 = collProjs.filter(p => p.currentStep >= 3).length;
      return {
        name,
        registrados: collProjs.length,
        convertidosP3: reachedP3,
        ratio: collProjs.length > 0 ? ((reachedP3 / collProjs.length) * 100).toFixed(1) : 0
      };
    }).filter(s => s.registrados > 0);
  }, [filteredProjects]);

  // ANÁLISIS FASE 2: PRESUPUESTOS (IMPORTES Y %)
  const budgetStats = useMemo(() => {
    const p2Projs = filteredProjects.filter(p => p.currentStep >= 2);
    const totalP2Amount = p2Projs.reduce((sum, p) => sum + (Number(p.totalAmount) || Number(p.approxBudget) || 0), 0);
    
    const byStatus = STATUS_OPTIONS.map(status => {
      const statusProjs = p2Projs.filter(p => p.status === status);
      const amount = statusProjs.reduce((sum, p) => sum + (Number(p.totalAmount) || Number(p.approxBudget) || 0), 0);
      return {
        name: status,
        value: amount,
        percent: totalP2Amount > 0 ? ((amount / totalP2Amount) * 100).toFixed(1) : 0
      };
    }).filter(s => s.value > 0);

    const bySeller = COLLABORATORS.map(collab => {
      const name = collab.split(' ')[1];
      const sellerProjs = p2Projs.filter(p => p.step2Collaborator === collab);
      const sellerTotal = sellerProjs.reduce((sum, p) => sum + (Number(p.totalAmount) || Number(p.approxBudget) || 0), 0);
      
      const entry: any = { name, total: sellerTotal };
      STATUS_OPTIONS.forEach(status => {
        const amt = sellerProjs.filter(p => p.status === status).reduce((sum, p) => sum + (Number(p.totalAmount) || Number(p.approxBudget) || 0), 0);
        entry[status] = amt;
        entry[`${status}_%`] = sellerTotal > 0 ? ((amt / sellerTotal) * 100).toFixed(1) : 0;
      });
      return entry;
    }).filter(s => s.total > 0);

    return { byStatus, bySeller, totalP2Amount };
  }, [filteredProjects]);

  // ANÁLISIS FASE 3: CIERRE (ESTADOS POR VENDEDOR P2)
  const cierreStats = useMemo(() => {
    const p3Projs = filteredProjects.filter(p => p.currentStep >= 3);
    return COLLABORATORS.map(collab => {
      const name = collab.split(' ')[1];
      const sellerProjs = p3Projs.filter(p => p.step2Collaborator === collab);
      const entry: any = { name, total: sellerProjs.length };
      STATUS_OPTIONS.forEach(status => {
        entry[status] = sellerProjs.filter(p => p.status === status).length;
      });
      return entry;
    }).filter(s => s.total > 0);
  }, [filteredProjects]);

  const funnelData = useMemo(() => [
    { name: 'Acogida', value: filteredProjects.filter(p => p.currentStep === 1).length, color: '#669900' },
    { name: 'Presupuesto', value: filteredProjects.filter(p => p.currentStep === 2).length, color: '#3B82F6' },
    { name: 'Cierre', value: filteredProjects.filter(p => p.currentStep === 3).length, color: '#F59E0B' },
    { name: 'Seguimiento', value: filteredProjects.filter(p => p.currentStep === 4).length, color: '#EF4444' }
  ], [filteredProjects]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Barra de Filtros Integrada */}
      <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-wrap items-center gap-6 animate-fade-in sticky top-[72px] z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-xl">
             <Filter className="w-5 h-5 text-[#669900]" />
          </div>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Filtros:</span>
        </div>
        
        <select 
          value={filterCollab} 
          onChange={e => setFilterCollab(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-[#669900]/20 min-w-[180px]"
        >
          <option value="all">COLAB. ALTA (TODOS)</option>
          {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={filterSeller} 
          onChange={e => setFilterSeller(e.target.value)}
          className="bg-gray-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[180px]"
        >
          <option value="all">VENDEDOR P2 (TODOS)</option>
          {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase border border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <input type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} className="bg-transparent outline-none" />
            <ChevronRight className="w-3 h-3 text-gray-200" />
            <input type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} className="bg-transparent outline-none" />
          </div>
        </div>

        {(filterCollab !== 'all' || filterSeller !== 'all' || filterStart || filterEnd) && (
          <button 
            onClick={() => { setFilterCollab('all'); setFilterSeller('all'); setFilterStart(''); setFilterEnd(''); }}
            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase"
          >
            <X className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Tabs de Dashboard */}
      <div className="bg-gray-200/50 p-1.5 rounded-[2rem] flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {[
          { id: 0, label: 'RESUMEN GLOBAL', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 1, label: 'ACOGIDA Y CONVERSIÓN', icon: <Users className="w-4 h-4" /> },
          { id: 2, label: 'ANÁLISIS PRESUPUESTOS', icon: <FileText className="w-4 h-4" /> },
          { id: 3, label: 'CIERRE Y VENDEDORES', icon: <CalendarRange className="w-4 h-4" /> }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              selectedTab === tab.id 
                ? 'bg-white text-[#669900] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {/* TAB 0: RESUMEN GLOBAL */}
        {selectedTab === 0 && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {funnelData.map((s, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:shadow-xl transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}}></div>
                       Fase {i+1}: {s.name}
                    </p>
                    <div className="flex items-end justify-between">
                       <span className="text-4xl font-black italic" style={{ color: s.color }}>{s.value}</span>
                       <span className="text-[10px] font-black text-gray-300 uppercase">Proyectos</span>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm h-96">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10 text-center italic">Embudo de Operaciones Activas</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={funnelData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                   <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tick={{fontSize: 10}} />
                   <Tooltip cursor={{fill: '#F9FAFB'}} />
                   <Bar dataKey="value" name="Proyectos" radius={[15, 15, 0, 0]} barSize={60}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 1: ACOGIDA Y CONVERSIÓN */}
        {selectedTab === 1 && (
          <div className="space-y-10 animate-fade-in">
             <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                   <Target className="w-5 h-5 text-[#669900]" /> Conversión: Registrados vs Llegan a Paso 3
                </h4>
                <div className="h-96">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={acogidaStats}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                         <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10, fontWeight: 'black'}} />
                         <YAxis axisLine={false} tick={{fontSize: 10}} />
                         <Tooltip />
                         <Legend verticalAlign="top" align="right" />
                         <Bar dataKey="registrados" name="Clientes Registrados (P1)" fill="#E5E7EB" radius={[10, 10, 0, 0]} />
                         <Bar dataKey="convertidosP3" name="Llegan a Cierre (P3)" fill="#669900" radius={[10, 10, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {acogidaStats.map(s => (
                   <div key={s.name} className="bg-white p-6 rounded-3xl border shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-4">{s.name}</p>
                      <div className="flex justify-between items-center">
                         <span className="text-2xl font-black text-gray-900">{s.ratio}%</span>
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Éxito Conversión</span>
                      </div>
                      <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                         <div className="bg-[#669900] h-full transition-all duration-500" style={{width: `${s.ratio}%`}}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 2: ANÁLISIS PRESUPUESTOS */}
        {selectedTab === 2 && (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border shadow-sm flex flex-col items-center">
                 <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2 w-full">
                   <TrendingUp className="w-4 h-4 text-blue-500" /> Distribución por Estado (Importe y %)
                 </h4>
                 <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                         data={budgetStats.byStatus} 
                         innerRadius={70} 
                         outerRadius={110} 
                         paddingAngle={5} 
                         dataKey="value"
                         label={({ name, percent, value }) => `${name}: ${percent}% (${(value/1000).toFixed(1)}k€)`}
                       >
                         {budgetStats.byStatus.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                         ))}
                       </Pie>
                       <Tooltip formatter={(val) => `${Number(val).toLocaleString()} €`} />
                       <Legend verticalAlign="bottom" />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                 <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                   <Briefcase className="w-4 h-4 text-[#669900]" /> Carga de Venta por Vendedor (P2)
                 </h4>
                 <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={budgetStats.bySeller} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tick={{fontSize: 11, fontWeight: 'black'}} width={80} />
                       <Tooltip 
                         formatter={(value, name, props) => {
                           const pct = props.payload[`${name}_%`];
                           return [`${Number(value).toLocaleString()} € (${pct}%)`, name];
                         }}
                       />
                       {STATUS_OPTIONS.map((status) => (
                         <Bar key={status} dataKey={status} stackId="a" fill={STATUS_COLORS[status]} barSize={35} />
                       ))}
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                   <Euro className="w-5 h-5 text-[#669900]" /> Volumen Económico por Estado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {STATUS_OPTIONS.map(status => {
                      const data = budgetStats.byStatus.find(s => s.name === status);
                      const amount = data ? data.value : 0;
                      const pct = data ? data.percent : 0;
                      return (
                        <div key={status} className="p-6 bg-gray-50 rounded-3xl border hover:border-[#669900]/30 transition-all">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-black text-gray-400 uppercase">{status}</span>
                              <span className="text-[9px] font-black text-[#669900] bg-[#669900]/10 px-2 py-0.5 rounded-full">{pct}%</span>
                           </div>
                           <p className="text-2xl font-black italic" style={{color: STATUS_COLORS[status]}}>{amount.toLocaleString()} €</p>
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* TAB 3: CIERRE Y VENDEDORES */}
        {selectedTab === 3 && (
           <div className="space-y-10 animate-fade-in">
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                 <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-amber-500" /> Resumen de Estados por Vendedor P2 (Cantidades)
                 </h4>
                 <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={cierreStats}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10, fontWeight: 'black'}} />
                          <YAxis axisLine={false} tick={{fontSize: 10}} />
                          <Tooltip />
                          <Legend />
                          {STATUS_OPTIONS.map(status => (
                             <Bar key={status} dataKey={status} stackId="a" fill={STATUS_COLORS[status]} />
                          ))}
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {cierreStats.map(s => (
                    <div key={s.name} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col items-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{s.name}</p>
                       <p className="text-3xl font-black text-[#669900] italic">{s.Gestionado || 0}</p>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cierres OK</p>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

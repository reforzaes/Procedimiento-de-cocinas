
import React, { useState, useMemo } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Filter, Calendar, User, Search, FileText, ClipboardList, Wallet, TrendingUp } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [filterVendor, setFilterVendor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateStart, setFilterDateStart] = useState<string>('');
  const [filterDateEnd, setFilterDateEnd] = useState<string>('');

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Step filter
      const matchesStep = p.currentStep === selectedStep;
      
      // Vendor filter
      const matchesVendor = filterVendor === 'all' || 
        p.ldapCollaborator === filterVendor || 
        p.step2Collaborator === filterVendor;
      
      // Status filter (only for Step 2)
      const matchesStatus = selectedStep !== 2 || filterStatus === 'all' || p.status === filterStatus;
      
      // Date filter (using receptionDate or budgetDate depending on context)
      const dateToCheck = selectedStep === 1 ? p.receptionDate : (p.budgetDate || p.receptionDate);
      const matchesDate = (!filterDateStart || dateToCheck >= filterDateStart) &&
                          (!filterDateEnd || dateToCheck <= filterDateEnd);
      
      return matchesStep && matchesVendor && matchesStatus && matchesDate;
    });
  }, [projects, selectedStep, filterVendor, filterStatus, filterDateStart, filterDateEnd]);

  // Step 2 specific stats
  const step2Stats = useMemo(() => {
    return STATUS_OPTIONS.map(status => ({
      name: status,
      value: filteredProjects.filter(p => p.status === status).length
    })).filter(s => s.value > 0);
  }, [filteredProjects]);

  const COLORS = ['#669900', '#A3CFBB', '#FF8042', '#3B82F6'];

  const totalAmount = useMemo(() => 
    filteredProjects.reduce((sum, p) => sum + (p.totalAmount || p.approxBudget || 0), 0)
  , [filteredProjects]);

  const avgAmount = useMemo(() => 
    filteredProjects.length > 0 ? totalAmount / filteredProjects.length : 0
  , [totalAmount, filteredProjects]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Control Panel / Filter Header */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Step Selector */}
          <div className="lg:col-span-4 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Seleccionar Fase</label>
            <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
              {[1, 2, 3, 4].map(step => (
                <button
                  key={step}
                  onClick={() => {
                    setSelectedStep(step);
                    setFilterStatus('all'); // Reset status filter when changing steps
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedStep === step 
                      ? 'bg-white text-[#669900] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Paso {step}
                </button>
              ))}
            </div>
          </div>

          {/* Collaborator Filter */}
          <div className="lg:col-span-3 w-full">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-1 tracking-wider">
              <User className="w-3 h-3" /> Colaborador
            </label>
            <select 
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-medium"
            >
              <option value="all">Todos</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter (Step 2 only) */}
          {selectedStep === 2 && (
            <div className="lg:col-span-2 w-full">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-1 tracking-wider">
                <FileText className="w-3 h-3" /> Estado
              </label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-medium"
              >
                <option value="all">Todos</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className={`${selectedStep === 2 ? 'lg:col-span-3' : 'lg:col-span-5'} flex gap-3 w-full`}>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-1 tracking-wider">
                <Calendar className="w-3 h-3" /> Desde
              </label>
              <input 
                type="date"
                value={filterDateStart}
                onChange={(e) => setFilterDateStart(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-1 tracking-wider">
                <Calendar className="w-3 h-3" /> Hasta
              </label>
              <input 
                type="date"
                value={filterDateEnd}
                onChange={(e) => setFilterDateEnd(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Shown before the list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter Summary Card */}
        <div className={`bg-white rounded-3xl border shadow-sm p-6 ${selectedStep === 2 ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className="w-5 h-5 text-[#669900]" />
            <h3 className="font-black text-gray-800 tracking-tight italic uppercase">Resumen del Filtro</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {selectedStep === 1 ? 'Total Acogidas' : 'Total Proyectos'}
                </span>
              </div>
              <p className="text-2xl font-black text-gray-800">{filteredProjects.length}</p>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Importe Total</span>
              </div>
              <p className="text-2xl font-black text-[#669900]">{totalAmount.toLocaleString()} €</p>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket Medio</span>
              </div>
              <p className="text-2xl font-black text-gray-800">
                {avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} €
              </p>
            </div>
          </div>
        </div>

        {/* Chart Card (Step 2 specific) */}
        {selectedStep === 2 && (
          <div className="lg:col-span-7 bg-white rounded-3xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-[#669900]" />
              <h3 className="font-black text-gray-800 tracking-tight italic uppercase">Seguimiento de Estados</h3>
            </div>
            <div className="h-48">
              {step2Stats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={step2Stats}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {step2Stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                  Sin datos de estados para mostrar
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project List Section - Bottom */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black text-gray-800 tracking-tight italic uppercase flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Listado de Resultados
          </h3>
          <span className="bg-white px-3 py-1 rounded-full border text-[10px] font-black text-gray-500 uppercase">
            {filteredProjects.length} REGISTROS
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Cliente / ID</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Fecha</th>
                {selectedStep === 2 && <th className="px-6 py-4">Estado</th>}
                <th className="px-6 py-4 text-right">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={selectedStep === 2 ? 5 : 4} className="px-6 py-12 text-center text-gray-400 italic">
                    No se han encontrado registros con los filtros actuales
                  </td>
                </tr>
              ) : (
                filteredProjects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{p.clientName || 'Sin Nombre'}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {p.id}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {selectedStep === 1 ? p.ldapCollaborator : p.step2Collaborator}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {selectedStep === 1 ? p.receptionDate : (p.budgetDate || p.receptionDate)}
                    </td>
                    {selectedStep === 2 && (
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                          p.status === 'Gestionado' ? 'bg-green-100 text-green-700' :
                          p.status === 'Anulado' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status || 'En Curso'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right font-black text-[#669900]">
                      {(p.totalAmount || p.approxBudget || 0).toLocaleString()} €
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useMemo, useState } from 'react';
import { Project, STATUS_OPTIONS, COLLABORATORS, INSTALLERS } from '../types';
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
  UserCheck, 
  Truck, 
  ArrowRightCircle,
  Clock,
  // Added missing CheckCircle2 import
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const [selectedStep, setSelectedStep] = useState<number>(0); // 0 = Global
  const COLORS = ['#669900', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // --- MÉTRICAS GLOBAL (Paso 0) ---
  const globalStepCounts = useMemo(() => [
    { name: 'Paso 1 (Acogida)', value: projects.filter(p => p.currentStep === 1).length, color: '#669900' },
    { name: 'Paso 2 (Presupuesto)', value: projects.filter(p => p.currentStep === 2).length, color: '#3B82F6' },
    { name: 'Paso 3 (Cierre)', value: projects.filter(p => p.currentStep === 3).length, color: '#F59E0B' },
    { name: 'Paso 4 (Seguimiento)', value: projects.filter(p => p.currentStep === 4).length, color: '#EF4444' },
  ], [projects]);

  // --- MÉTRICAS PASO 1 (Acogida) ---
  const step1CollabData = useMemo(() => {
    const step1Projects = projects.filter(p => p.currentStep >= 1);
    return COLLABORATORS.map(col => ({
      name: col.split(' ')[1],
      total: step1Projects.filter(p => p.ldapCollaborator === col).length,
      reformas: step1Projects.filter(p => p.ldapCollaborator === col && p.willReform).length,
      instalaciones: step1Projects.filter(p => p.ldapCollaborator === col && p.willInstall).length
    })).filter(d => d.total > 0);
  }, [projects]);

  // --- MÉTRICAS PASO 2 (Presupuesto) ---
  const step2StatusData = useMemo(() => {
    const step2Projects = projects.filter(p => p.currentStep >= 2);
    const statuses = ['En Curso', 'Gestionando', 'Gestionado'];
    return statuses.map(s => ({
      name: s,
      value: step2Projects.filter(p => (p.status || 'En Curso') === s).length
    }));
  }, [projects]);

  // --- MÉTRICAS PASO 3 (Cierre) ---
  const step3VendedorData = useMemo(() => {
    const step3Projects = projects.filter(p => p.currentStep >= 3);
    return COLLABORATORS.map(col => ({
      name: col.split(' ')[1],
      value: step3Projects.filter(p => p.step2Collaborator === col).length
    })).filter(d => d.value > 0);
  }, [projects]);

  const step3InstallerData = useMemo(() => {
    const step3Projects = projects.filter(p => p.currentStep >= 3);
    return INSTALLERS.map(ins => ({
      name: ins,
      value: step3Projects.filter(p => p.installer === ins).length
    })).filter(d => d.value > 0);
  }, [projects]);

  const step3VsStep4Data = useMemo(() => {
    return [
      { name: 'En Paso 3', value: projects.filter(p => p.currentStep === 3).length },
      { name: 'Pasadas a Paso 4', value: projects.filter(p => p.currentStep >= 4).length }
    ];
  }, [projects]);

  // --- MÉTRICAS PASO 4 (Seguimiento) ---
  const step4StatusData = useMemo(() => {
    const step4Projects = projects.filter(p => p.currentStep === 4);
    return [
      { name: 'En Curso (Montaje)', value: step4Projects.filter(p => p.status !== 'Gestionado').length },
      { name: 'Terminadas OK', value: step4Projects.filter(p => p.status === 'Gestionado').length }
    ];
  }, [projects]);

  const renderContent = () => {
    switch(selectedStep) {
      case 0: // GLOBAL
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {globalStepCounts.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm group hover:scale-[1.02] transition-all">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.name}</p>
                  <p className="text-4xl font-black italic tracking-tighter" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Cocinas pendientes</p>
                </div>
              ))}
            </div>
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm h-96">
               <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                 <LayoutDashboard className="w-6 h-6 text-[#669900]" /> Distribución Global de Carga
               </h3>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={globalStepCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tickLine={false} hide />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '20px', border:'none', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="value" radius={[15, 15, 0, 0]}>
                     {globalStepCounts.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                     <LabelList dataKey="value" position="top" style={{ fontWeight: 'black', fontSize: '14px' }} />
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        );

      case 1: // PASO 1 (Acogida)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#669900]" /> Acogidas por Colaborador
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={step1CollabData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border:'none'}} />
                    <Bar dataKey="total" fill="#669900" radius={[0, 10, 10, 0]} name="Acogidas Realizadas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm flex flex-col justify-center text-center">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10">Datos Recogidos en Acogida</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border">
                  <p className="text-3xl font-black text-[#669900] italic leading-none">{step1CollabData.reduce((acc, curr) => acc + curr.reformas, 0)}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-2">Con Reforma</p>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border">
                  <p className="text-3xl font-black text-blue-500 italic leading-none">{step1CollabData.reduce((acc, curr) => acc + curr.instalaciones, 0)}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-2">Con Instalación</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // PASO 2 (Presupuesto)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" /> Estados de Presupuestos
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={step2StatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={10} dataKey="value">
                      {step2StatusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '25px', border:'none'}} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm grid grid-cols-1 gap-4">
              {step2StatusData.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-sm font-black text-gray-700 uppercase italic tracking-tighter">{s.name}</span>
                  </div>
                  <span className="text-2xl font-black italic text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // PASO 3 (Cierre)
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-80">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-500" /> Por Vendedor (Paso 2)
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={step3VendedorData}>
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-80">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" /> Por Instalador
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={step3InstallerData}>
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm h-80">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <ArrowRightCircle className="w-4 h-4 text-[#669900]" /> Avance de Obra
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={step3VsStep4Data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                       <Cell fill="#e5e7eb" />
                       <Cell fill="#669900" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 4: // PASO 4 (Seguimiento)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10 flex items-center gap-3">
                <Activity className="w-6 h-6 text-red-500" /> Estado de Ejecución
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={step4StatusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={10} dataKey="value">
                      <Cell fill="#EF4444" />
                      <Cell fill="#669900" />
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '25px', border:'none'}} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6">
               <div className="p-8 bg-white rounded-[2.5rem] border shadow-sm flex items-center justify-between border-l-8 border-l-red-500">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Curso / Montaje</p>
                    <p className="text-3xl font-black text-gray-800 italic">{step4StatusData[0].value}</p>
                  </div>
                  <Clock className="w-10 h-10 text-red-100" />
               </div>
               <div className="p-8 bg-white rounded-[2.5rem] border shadow-sm flex items-center justify-between border-l-8 border-l-[#669900]">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Terminadas OK</p>
                    <p className="text-3xl font-black text-gray-800 italic">{step4StatusData[1].value}</p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-100" />
               </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Selector de Fase Premium */}
      <div className="bg-white p-2 rounded-[2.5rem] border shadow-sm flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide sticky top-[188px] z-30">
        {[
          { id: 0, label: 'GLOBAL', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 1, label: 'PASO 1', icon: <Users className="w-4 h-4" /> },
          { id: 2, label: 'PASO 2', icon: <FileText className="w-4 h-4" /> },
          { id: 3, label: 'PASO 3', icon: <CalendarRange className="w-4 h-4" /> },
          { id: 4, label: 'PASO 4', icon: <Activity className="w-4 h-4" /> }
        ].map(s => (
          <button 
            key={s.id} 
            onClick={() => setSelectedStep(s.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
              selectedStep === s.id 
                ? 'bg-[#669900] text-white shadow-lg shadow-[#669900]/20 scale-95' 
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            {s.icon}
            <span className="hidden md:inline">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
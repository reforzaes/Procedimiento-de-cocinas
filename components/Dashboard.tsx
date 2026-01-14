
import React, { useMemo, useState } from 'react';
import { Project, COLLABORATORS, INSTALLERS } from '../types';
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
  const step1Data = useMemo(() => {
    const step1Projects = projects.filter(p => p.currentStep >= 1);
    const collabRecap = COLLABORATORS.map(col => ({
      name: col.split(' ')[1],
      count: step1Projects.filter(p => p.ldapCollaborator === col).length,
    })).filter(d => d.count > 0);

    const totals = {
      reformas: step1Projects.filter(p => p.willReform).length,
      instalaciones: step1Projects.filter(p => p.willInstall).length,
      total: step1Projects.length
    };

    return { collabRecap, totals };
  }, [projects]);

  // --- MÉTRICAS PASO 2 (Presupuesto) ---
  const step2Data = useMemo(() => {
    const step2Projects = projects.filter(p => p.currentStep >= 2);
    const statuses = ['En Curso', 'Gestionando', 'Gestionado'];
    return statuses.map(s => ({
      name: s,
      value: step2Projects.filter(p => (p.status || 'En Curso') === s).length
    }));
  }, [projects]);

  // --- MÉTRICAS PASO 3 (Cierre) ---
  const step3Data = useMemo(() => {
    const step3Projects = projects.filter(p => p.currentStep >= 3);
    const sellerRecap = COLLABORATORS.map(col => ({
      name: col.split(' ')[1],
      value: step3Projects.filter(p => p.step2Collaborator === col).length
    })).filter(d => d.value > 0);

    const installerRecap = INSTALLERS.map(ins => ({
      name: ins,
      value: step3Projects.filter(p => p.installer === ins).length
    })).filter(d => d.value > 0);

    const flowCompare = [
      { name: 'Pendientes Paso 3', value: projects.filter(p => p.currentStep === 3).length },
      { name: 'Pasadas a Paso 4', value: projects.filter(p => p.currentStep >= 4).length }
    ];

    return { sellerRecap, installerRecap, flowCompare };
  }, [projects]);

  // --- MÉTRICAS PASO 4 (Seguimiento) ---
  const step4Data = useMemo(() => {
    const step4Projects = projects.filter(p => p.currentStep === 4);
    return [
      { name: 'En Curso / Montaje', value: step4Projects.filter(p => p.status !== 'Gestionado').length },
      { name: 'Terminadas OK', value: step4Projects.filter(p => p.status === 'Gestionado').length }
    ];
  }, [projects]);

  const renderContent = () => {
    switch(selectedStep) {
      case 0: // GLOBAL
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="text-xl font-black text-gray-800 italic uppercase flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-[#669900]" /> Cocinas Pendientes por Fase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {globalStepCounts.map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:scale-[1.02] transition-all flex flex-col items-center text-center">
                  <div className="p-4 rounded-3xl mb-4" style={{ backgroundColor: `${s.color}15` }}>
                     <Activity className="w-8 h-8" style={{ color: s.color }} />
                  </div>
                  <p className="text-4xl font-black italic tracking-tighter leading-none" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">{s.name}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: // PASO 1 (Acogida)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#669900]" /> Acogidas por Colaborador
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={step1Data.collabRecap} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" fill="#669900" radius={[10, 10, 0, 0]}>
                      <LabelList dataKey="count" position="top" style={{ fontWeight: 'black', fontSize: '12px' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm flex flex-col justify-center gap-8">
              <h3 className="text-xl font-black text-gray-800 italic uppercase text-center">Datos de Recogida</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border">
                  <span className="text-sm font-black text-gray-500 uppercase italic">Total Cocinas con Reforma</span>
                  <span className="text-4xl font-black text-[#669900] italic">{step1Data.totals.reformas}</span>
                </div>
                <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border">
                  <span className="text-sm font-black text-gray-500 uppercase italic">Total Cocinas con Instalación</span>
                  <span className="text-4xl font-black text-blue-500 italic">{step1Data.totals.instalaciones}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // PASO 2 (Presupuesto)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" /> Estadísticas de Presupuestos
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={step2Data} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={10} dataKey="value">
                      {step2Data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '25px', border:'none'}} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6">
              {step2Data.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border shadow-sm" style={{ borderLeft: `8px solid ${COLORS[i]}` }}>
                  <span className="text-sm font-black text-gray-700 uppercase italic">{s.name}</span>
                  <span className="text-4xl font-black italic text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // PASO 3 (Cierre)
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-500" /> Cocinas por Vendedor (Paso 2)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={step3Data.sellerRecap}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                      <Bar dataKey="value" fill="#F59E0B" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" /> Cocinas por Instalador
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={step3Data.installerRecap}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                      <Bar dataKey="value" fill="#3B82F6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10 flex items-center gap-3">
                <ArrowRightCircle className="w-6 h-6 text-[#669900]" /> Comparativa de Avance (Paso 3 vs Paso 4)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={step3Data.flowCompare} margin={{ top: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Bar dataKey="value" radius={[20, 20, 0, 0]}>
                       <Cell fill="#F59E0B" />
                       <Cell fill="#669900" />
                       <LabelList dataKey="value" position="top" style={{ fontWeight: 'black', fontSize: '18px' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 4: // PASO 4 (Seguimiento)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-800 italic uppercase mb-10 flex items-center gap-3">
                <Activity className="w-6 h-6 text-red-500" /> Estado de Ejecución en Seguimiento
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={step4Data} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={10} dataKey="value">
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
               <div className="p-10 bg-white rounded-[2.5rem] border shadow-sm flex items-center justify-between border-l-[12px] border-l-red-500 transition-transform hover:translate-x-2">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Curso / Montaje</p>
                    <p className="text-5xl font-black text-gray-800 italic">{step4Data[0].value}</p>
                  </div>
                  <Clock className="w-12 h-12 text-red-100" />
               </div>
               <div className="p-10 bg-white rounded-[2.5rem] border shadow-sm flex items-center justify-between border-l-[12px] border-l-[#669900] transition-transform hover:translate-x-2">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cocinas Terminadas OK</p>
                    <p className="text-5xl font-black text-gray-800 italic">{step4Data[1].value}</p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-100" />
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
            className={`flex-1 flex items-center justify-center gap-2 py-5 px-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
              selectedStep === s.id 
                ? 'bg-[#669900] text-white shadow-xl shadow-[#669900]/20 scale-95' 
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

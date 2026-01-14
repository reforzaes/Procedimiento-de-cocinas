
import React, { useMemo } from 'react';
import { Project, STATUS_OPTIONS } from '../types';
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
  CartesianGrid
} from 'recharts';
import { Wallet, TrendingUp, Users, Target, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const COLORS = ['#669900', '#3B82F6', '#F59E0B', '#EF4444'];

  const statsByStatus = useMemo(() => {
    return STATUS_OPTIONS.map(status => ({
      name: status,
      value: projects.filter(p => (p.status || 'En Curso') === status).length,
      amount: projects.filter(p => (p.status || 'En Curso') === status).reduce((sum, p) => sum + (p.totalAmount || p.approxBudget || 0), 0)
    }));
  }, [projects]);

  const totalGlobalAmount = useMemo(() => projects.reduce((sum, p) => sum + (p.totalAmount || p.approxBudget || 0), 0), [projects]);
  const avgGlobalAmount = projects.length > 0 ? totalGlobalAmount / projects.length : 0;
  
  const totalClosed = projects.filter(p => p.status === 'Gestionado').length;
  const conversionRate = projects.length > 0 ? (totalClosed / projects.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-green-50 rounded-2xl"><Wallet className="w-6 h-6 text-[#669900]" /></div>
             <span className="text-[10px] font-black text-gray-300 uppercase italic">Cartera Total</span>
          </div>
          <p className="text-3xl font-black text-gray-800 tracking-tighter italic">{totalGlobalAmount.toLocaleString()} €</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Presupuestos registrados</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 rounded-2xl"><TrendingUp className="w-6 h-6 text-blue-500" /></div>
             <span className="text-[10px] font-black text-gray-300 uppercase italic">Ticket Medio</span>
          </div>
          <p className="text-3xl font-black text-gray-800 tracking-tighter italic">{avgGlobalAmount.toLocaleString(undefined, {maximumFractionDigits:0})} €</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Media por proyecto</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-50 rounded-2xl"><Target className="w-6 h-6 text-amber-500" /></div>
             <span className="text-[10px] font-black text-gray-300 uppercase italic">Conversión</span>
          </div>
          <p className="text-3xl font-black text-gray-800 tracking-tighter italic">{conversionRate.toFixed(1)} %</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Ventas cerradas / Leads</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border shadow-sm group hover:scale-[1.02] transition-all">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-gray-50 rounded-2xl"><Users className="w-6 h-6 text-gray-400" /></div>
             <span className="text-[10px] font-black text-gray-300 uppercase italic">Proyectos</span>
          </div>
          <p className="text-3xl font-black text-gray-800 tracking-tighter italic">{projects.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Total base de datos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
           <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-2">
             <Target className="w-5 h-5 text-[#669900]" /> Distribución de Estados
           </h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={statsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                   {statsByStatus.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '20px', border:'none', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Legend verticalAlign="bottom" height={36} />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
           <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-2">
             <Wallet className="w-5 h-5 text-blue-500" /> Volumen Económico por Estado
           </h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statsByStatus} layout="vertical" margin={{ left: 40, right: 40 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '15px', border:'none'}} formatter={(val) => [`${val.toLocaleString()} €`, 'Importe']} />
                 <Bar dataKey="amount" radius={[0, 10, 10, 0]}>
                    {statsByStatus.map((_, index) => <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />)}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b bg-gray-50/50 flex justify-between items-center">
           <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Resumen Global de Presupuestos</h3>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{projects.length} PROYECTOS EN TOTAL</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
           {statsByStatus.map((stat, i) => (
             <div key={stat.name} className="p-8 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: `${COLORS[i]}20`, color: COLORS[i]}}>
                   {i === 0 && <Clock className="w-5 h-5" />}
                   {i === 1 && <Target className="w-5 h-5" />}
                   {i === 2 && <CheckCircle2 className="w-5 h-5" />}
                   {i === 3 && <AlertCircle className="w-5 h-5" />}
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.name}</h4>
                <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                <p className="text-sm font-bold text-[#669900] mt-1 italic">{stat.amount.toLocaleString()} €</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

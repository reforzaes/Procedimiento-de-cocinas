
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Activity, CheckCircle2, Eye, MessageSquare, Send, Calendar, PencilLine, Info } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepFourProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string) => void;
}

const StepFour: React.FC<StepFourProps> = ({ project, projects, onUpdate, onSelect }) => {
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setNotes(project?.followUpNotes || '');
  }, [project]);

  const handleStatusChange = (status: any) => {
    if (project) onUpdate(project.id, { status });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-[#669900]/10 p-5 rounded-3xl">
            <Activity className="w-10 h-10 text-[#669900]" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">SEGUIMIENTO PROYECTO</h2>
            <p className="text-gray-400 font-bold italic text-sm mt-1 uppercase">Paso 4: Control de Montajes y Post-Venta</p>
          </div>
        </div>
        
        {project && (
          <button 
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-bold text-xs uppercase tracking-widest shadow-xl"
          >
            <Eye className="w-4 h-4" /> VER FICHA INTEGRAL
          </button>
        )}
      </div>
      
      {project ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter">{project.clientName}</h3>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1.5 text-[#669900] text-[10px] font-black uppercase">
                     <Calendar className="w-3 h-3" /> Instalación: {project.installationDate || 'No definida'}
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase mr-2">Estado del Proyecto:</span>
                <select 
                  value={project.status || 'En Curso'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-[#669900]/20"
                >
                  <option value="En Curso">En Curso / Montaje</option>
                  <option value="Gestionado">Finalizado OK</option>
                  <option value="Anulado">Incidencia / Anulado</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
                <MessageSquare className="w-3 h-3 text-red-500" /> Bitácora de Seguimiento e Incidencias
              </label>
              <div className="relative">
                <textarea 
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (project) onUpdate(project.id, { followUpNotes: e.target.value });
                  }}
                  placeholder="Describe el estado de la obra, incidencias con el transporte o montaje..."
                  className="w-full h-48 p-6 border-2 border-gray-50 rounded-[2rem] bg-gray-50/50 outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-300 italic">Guardado automático activo</span>
                  <div className="p-2 bg-[#669900] text-white rounded-xl shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
          <Activity className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-gray-400 font-black italic uppercase tracking-widest text-sm">Selecciona un proyecto del listado inferior para gestionar el seguimiento</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 px-4 italic uppercase tracking-tight">
          PROYECTOS EN SEGUIMIENTO <span className="text-gray-300 font-medium">({projects.length})</span>
        </h3>
        <div className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Instalador</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">F. Instalación</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-400 italic font-bold uppercase tracking-widest">No hay proyectos activos para seguimiento</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-gray-900 group-hover:text-[#669900] transition-colors">{p.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">ID: {p.id}</div>
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-gray-600 uppercase italic">{p.installer || 'Sin asignar'}</td>
                    <td className="px-8 py-6 text-xs font-black text-gray-400">{p.installationDate || '---'}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${
                        p.status === 'Gestionado' ? 'bg-green-50 text-green-700 border-green-100' :
                        p.status === 'Anulado' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {p.status || 'En Curso'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => onSelect(p.id)} className="p-3 bg-white text-gray-300 hover:text-[#669900] rounded-2xl border border-gray-100 hover:border-[#669900]/30 transition-all"><PencilLine className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showDetails && project && <DetailsModal project={project} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default StepFour;


import React, { useState, useEffect } from 'react';
import { Project, INSTALLERS } from '../types';
import { CheckCircle2, AlertCircle, CalendarRange, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepThreeProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string, step: number) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ project, projects, onUpdate, onSelect }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    installer: INSTALLERS[0],
    closingDate: new Date().toISOString().split('T')[0],
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // AUTO-GRABADO
    if (project) {
      onUpdate(project.id, { [name]: value });
    }
  };

  const isFormComplete = (data: Partial<Project>) => {
    return !!(
      data.driveLink && 
      data.closingDate && 
      data.woMeasurement && 
      data.installer && 
      data.installationDate
    );
  };

  const handlePassToStepFour = () => {
    if (project && isFormComplete(formData)) {
      onUpdate(project.id, { ...formData, step3Completed: true, currentStep: 4 });
      onSelect(project.id, 4);
    }
  };

  if (!project) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <CalendarRange className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-black text-gray-800 italic uppercase">3. 2ª VISITA Y CIERRE</h2>
        <p className="text-gray-400 max-w-sm mx-auto mt-2 text-sm font-medium italic">Selecciona un proyecto desde el buscador para gestionar su cierre.</p>
        
        <div className="mt-12 max-w-5xl mx-auto px-4">
           <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">WO Medición</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instalador</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-800">{p.clientName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-amber-600">{p.woMeasurement || 'PENDIENTE'}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{p.installer || 'SIN ASIGNAR'}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => onSelect(p.id, 3)} className="p-2 text-gray-300 hover:text-[#669900] bg-gray-50 rounded-xl transition-all"><CalendarRange className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <CalendarRange className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">3. 2ª VISITA Y CIERRE</h2>
              <p className="text-xs text-gray-400 font-bold uppercase">Gestionando: <span className="text-amber-600">{project.clientName}</span></p>
            </div>
          </div>
          <button 
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Eye className="w-4 h-4" /> Ver Ficha Completa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enlace Carpeta Drive</label>
            <div className="relative">
              <input 
                type="url"
                name="driveLink"
                placeholder="https://drive.google.com/..."
                value={formData.driveLink || ''}
                onChange={handleChange}
                className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium"
              />
              {formData.driveLink && (
                <a href={formData.driveLink} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:scale-110 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha Visita Cierre</label>
            <input 
              type="date"
              name="closingDate"
              value={formData.closingDate || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nº WO Medición</label>
            <input 
              type="text"
              name="woMeasurement"
              placeholder="WO-XXXXXXX"
              value={formData.woMeasurement || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-bold uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Instalador Asignado</label>
            <select 
              name="installer"
              value={formData.installer || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm font-medium"
            >
              {INSTALLERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha Instalación</label>
            <input 
              type="date"
              name="installationDate"
              value={formData.installationDate || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-amber-500 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            {isFormComplete(formData) ? (
              <div className="flex items-center space-x-2 text-[#669900] bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Cierre Validado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Pendiente de completar cierre</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handlePassToStepFour}
            disabled={!isFormComplete(formData)}
            className="px-10 py-4 bg-[#669900] text-white rounded-2xl hover:bg-[#558000] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all font-black text-sm shadow-xl shadow-green-100 uppercase tracking-widest flex items-center gap-3 group"
          >
            Finalizar y Seguimiento <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      {showDetails && project && <DetailsModal project={project} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default StepThree;

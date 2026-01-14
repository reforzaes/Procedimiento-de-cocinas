
import React, { useState, useEffect } from 'react';
import { Project, INSTALLERS } from '../types';
import { AlertCircle, CalendarRange, ExternalLink, Eye, ArrowRight, PencilLine, Info } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepThreeProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ project, projects, onUpdate, onSelect }) => {
  const emptyForm: Partial<Project> = {
    driveLink: '',
    closingDate: new Date().toISOString().split('T')[0],
    woMeasurement: '',
    installer: INSTALLERS[0],
    installationDate: '',
  };

  const [formData, setFormData] = useState<Partial<Project>>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    setFormData(project || emptyForm);
    setErrors([]);
  }, [project]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.driveLink) newErrors.push('driveLink');
    if (!formData.woMeasurement) newErrors.push('woMeasurement');
    if (!formData.installer) newErrors.push('installer');
    if (!formData.installationDate) newErrors.push('installationDate');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (errors.includes(name)) setErrors(errors.filter(err => err !== name));
    if (project) onUpdate(project.id, { [name]: value });
  };

  const handleSaveAndAdvance = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, step3Completed: true, currentStep: 4 });
    }
  };

  const openDetails = (p: Project) => {
    setModalProject(p);
    setShowDetails(true);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 rounded-3xl">
               <CalendarRange className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
                {project ? 'GESTIÓN DE CIERRE' : 'NUEVO CIERRE'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">2ª Visita, Medición y Agenda</p>
            </div>
          </div>
          {project && (
            <div className="flex gap-3">
              <button 
                onClick={() => openDetails(project)} 
                className="flex items-center gap-3 px-8 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-500/20"
              >
                <Eye className="w-5 h-5" /> VER FICHA INTEGRAL
              </button>
              <button onClick={() => onSelect('')} className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                NUEVA AGENDA
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('driveLink') ? 'text-red-500' : 'text-gray-400'}`}>Carpeta Drive *</label>
            <div className="relative">
              <input type="url" name="driveLink" value={formData.driveLink || ''} onChange={handleChange} placeholder="https://drive.google.com/..." className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('driveLink') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-amber-500/20'}`} />
              {formData.driveLink && <a href={formData.driveLink} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"><ExternalLink className="w-4 h-4" /></a>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('woMeasurement') ? 'text-red-500' : 'text-gray-400'}`}>WO Medición *</label>
            <input type="text" name="woMeasurement" value={formData.woMeasurement || ''} onChange={handleChange} placeholder="WO-XXXXXXX" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold uppercase ${errors.includes('woMeasurement') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-amber-500/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha 2ª Visita</label>
            <input type="date" name="closingDate" value={formData.closingDate || ''} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-amber-500/20 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('installer') ? 'text-red-500' : 'text-gray-400'}`}>Instalador Asignado *</label>
            <select name="installer" value={formData.installer || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold uppercase ${errors.includes('installer') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-amber-500/20'}`}>
              <option value="">Selecciona instalador...</option>
              {INSTALLERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('installationDate') ? 'text-red-500' : 'text-gray-400'}`}>Fecha de Montaje *</label>
            <input type="date" name="installationDate" value={formData.installationDate || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm ${errors.includes('installationDate') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-amber-500/20'}`} />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-bounce">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-black text-red-600 uppercase">Debes completar la agenda técnica para avanzar</span>
          </div>
        )}

        <div className="mt-12 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <Info className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">(*) Requeridos para agendar montaje</span>
          </div>
          
          <button 
            onClick={handleSaveAndAdvance}
            className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-4 group hover:bg-[#558000] shadow-[#669900]/20"
          >
            GUARDAR Y PASAR A SEGUIMIENTO
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-800 italic uppercase px-4 flex items-center gap-3">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-xl not-italic">{projects.length}</span>
          COCINAS EN ESTA FASE
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">WO Medición</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Instalador</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">F. Montaje</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-bold uppercase italic text-sm">No hay agendas de cierre pendientes</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6 font-black text-gray-900 group-hover:text-amber-600 transition-colors">{p.clientName}</td>
                    <td className="px-8 py-6 text-xs font-bold text-amber-600">{p.woMeasurement || 'PENDIENTE'}</td>
                    <td className="px-8 py-6 text-xs font-bold text-gray-600 uppercase italic">{p.installer || 'Sin asignar'}</td>
                    <td className="px-8 py-6 text-xs font-black text-[#669900]">{p.installationDate || '---'}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button onClick={() => openDetails(p)} title="Ver Ficha Integral" className="p-3 bg-white text-amber-600 hover:bg-amber-500 hover:text-white rounded-2xl border border-amber-500/20 transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
                       <button onClick={() => onSelect(p.id)} title="Editar Expediente" className="p-3 bg-white text-gray-300 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all"><PencilLine className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showDetails && modalProject && <DetailsModal project={modalProject} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default StepThree;

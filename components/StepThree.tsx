
import React, { useState, useEffect } from 'react';
import { Project, INSTALLERS, Step } from '../types';
import { AlertCircle, CalendarRange, ExternalLink, Eye, ArrowRight, PencilLine, Info, MessageSquare, CheckCircle2 } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepThreeProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string) => void;
  onStepChange: (step: Step) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ project, projects, onUpdate, onSelect, onStepChange }) => {
  const emptyForm: Partial<Project> = {
    driveLink: '',
    closingDate: new Date().toISOString().split('T')[0],
    woMeasurement: '',
    installer: INSTALLERS[0],
    installationDate: '',
    budgetNotes: ''
  };

  const [formData, setFormData] = useState<Partial<Project>>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [hideFinished, setHideFinished] = useState(true);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData(emptyForm);
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (project) onUpdate(project.id, { [name]: value });

    if (value && errors.includes(name)) {
      setErrors(prev => prev.filter(err => err !== name));
    }
  };

  const handleSaveAndAdvance = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, currentStep: 4 });
    }
    onStepChange(Step.SEGUIMIENTO);
  };

  const filteredList = projects.filter(p => !hideFinished || p.currentStep === 3);

  const openDetails = (p: Project) => {
    setModalProject(p);
    setShowDetails(true);
  };

  const getErrorClass = (fieldName: string) => 
    errors.includes(fieldName) ? "ring-2 ring-red-500 shadow-[0_0_15px_#ef4444]" : "focus:ring-amber-500/20";

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase flex items-center gap-4">
            <CalendarRange className="text-amber-600 w-10 h-10" /> 
            3. 2ª VISITA / CIERRE
          </h2>
          {project && (
             <button 
               onClick={() => openDetails(project)}
               className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm border border-amber-500/20"
             >
               <Eye className="w-4 h-4" /> Ver Ficha Integral
             </button>
          )}
        </div>

        {project ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('driveLink') ? 'text-red-500' : 'text-gray-400'}`}>Carpeta Drive *</label>
              <div className="relative">
                <input type="url" name="driveLink" value={formData.driveLink || ''} onChange={handleChange} placeholder="URL Drive" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('driveLink')}`} />
                {formData.driveLink && <a href={formData.driveLink} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('installer') ? 'text-red-500' : 'text-gray-400'}`}>Instalador *</label>
              <select name="installer" value={formData.installer} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold uppercase transition-all ${getErrorClass('installer')}`}>
                {INSTALLERS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('installationDate') ? 'text-red-500' : 'text-gray-400'}`}>Fecha Montaje *</label>
              <input type="date" name="installationDate" value={formData.installationDate || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('installationDate')}`} />
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('woMeasurement') ? 'text-red-500' : 'text-gray-400'}`}>WO Medición *</label>
              <input type="text" name="woMeasurement" value={formData.woMeasurement || ''} onChange={handleChange} placeholder="WO-XXXXXXX" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('woMeasurement')}`} />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-amber-500" /> Observaciones (Todos los pasos)
              </label>
              <textarea name="budgetNotes" value={formData.budgetNotes} onChange={handleChange} placeholder="Anotaciones importantes para el montaje..." className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-medium h-14 resize-none transition-all" />
            </div>
          </div>
        ) : (
          <div className="p-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase italic text-sm">Selecciona una cocina del listado inferior para gestionar el cierre</p>
          </div>
        )}

        <div className="mt-10 pt-10 border-t flex justify-between items-center">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <Info className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">(*) Requeridos para agendar montaje</span>
          </div>
          {project && (
            <button onClick={handleSaveAndAdvance} className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-4 group">
              GUARDAR Y PASAR A SEGUIMIENTO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-black text-gray-800 italic uppercase flex items-center gap-3">
             <span className="bg-amber-500 text-white w-8 h-8 flex items-center justify-center rounded-lg not-italic text-sm">{filteredList.length}</span>
             COCINAS EN ESTA FASE
          </h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 cursor-pointer">
            <input type="checkbox" checked={hideFinished} onChange={e => setHideFinished(e.target.checked)} className="accent-amber-500" />
            Solo pendientes de este paso
          </label>
        </div>
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">WO Medición</th>
                <th className="px-8 py-5">Instalador</th>
                <th className="px-8 py-5">F. Montaje</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-gray-400 italic font-bold uppercase tracking-widest">No hay cocinas para cierre en esta vista</td>
                </tr>
              ) : (
                filteredList.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6 font-black text-gray-900">{p.clientName}</td>
                    <td className="px-8 py-6 text-xs font-bold text-amber-600 uppercase">{p.woMeasurement || 'PENDIENTE'}</td>
                    <td className="px-8 py-6 text-xs font-black text-gray-500 uppercase italic">{p.installer || 'SIN ASIGNAR'}</td>
                    <td className="px-8 py-6 text-xs font-black text-[#669900]">{p.installationDate || '---'}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button onClick={() => openDetails(p)} className="p-3 bg-white text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl border border-amber-500/20 transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
                       <button onClick={() => onSelect(p.id)} className="p-3 bg-white text-gray-300 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all"><PencilLine className="w-5 h-5" /></button>
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

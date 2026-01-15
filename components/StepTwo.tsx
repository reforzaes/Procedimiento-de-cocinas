
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS, Step } from '../types';
import { AlertCircle, FilePlus, Eye, ArrowRight, PencilLine, Info, MessageSquare } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepTwoProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onCreate: (p: Project) => void;
  onSelect: (id: string) => void;
  onStepChange: (step: Step) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ project, projects, onUpdate, onCreate, onSelect, onStepChange }) => {
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [hideFinished, setHideFinished] = useState(true);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({});
    }
    setErrors([]);
  }, [project]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.budgetNumber) newErrors.push('budgetNumber');
    if (!formData.budgetDate) newErrors.push('budgetDate');
    if (!formData.budgetType) newErrors.push('budgetType');
    if (!formData.totalAmount || (formData.totalAmount || 0) <= 0) newErrors.push('totalAmount');
    if (!formData.step2Collaborator) newErrors.push('step2Collaborator');
    if (formData.status !== 'Gestionado') newErrors.push('statusNotManaged');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    if (project) onUpdate(project.id, { [name]: val });

    if (value && errors.includes(name)) {
      setErrors(prev => prev.filter(err => err !== name));
    }
  };

  const handleSaveAndAdvance = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, currentStep: 3 });
      onStepChange(Step.VISITA);
    }
  };

  const filteredList = projects.filter(p => !hideFinished || p.currentStep === 2);

  const openDetails = (p: Project) => {
    setModalProject(p);
    setShowDetails(true);
  };

  const getErrorClass = (fieldName: string) => 
    errors.includes(fieldName) ? "ring-2 ring-red-500 shadow-[0_0_15px_#ef4444]" : "focus:ring-blue-500/20";

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase flex items-center gap-4">
            <FilePlus className="text-blue-500 w-10 h-10" /> 
            DISEÑO Y PRESUPUESTO
          </h2>
          {project && (
             <button 
               onClick={() => openDetails(project)}
               className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-500/20"
             >
               <Eye className="w-4 h-4" /> Ver Ficha Integral
             </button>
          )}
        </div>

        {project ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cliente</label>
              <input type="text" readOnly value={project.clientName} className="w-full p-4 bg-gray-100 rounded-2xl border-none text-sm font-black text-gray-400" />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetNumber') ? 'text-red-500' : 'text-gray-400'}`}>Nº Presupuesto *</label>
              <input type="text" name="budgetNumber" value={formData.budgetNumber || ''} onChange={handleChange} placeholder="Ej: 2025/123" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('budgetNumber')}`} />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('totalAmount') ? 'text-red-500' : 'text-gray-400'}`}>Importe Final (€) *</label>
              <input type="number" name="totalAmount" value={formData.totalAmount || ''} onChange={handleChange} placeholder="0.00" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-black text-blue-600 transition-all ${getErrorClass('totalAmount')}`} />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetDate') ? 'text-red-500' : 'text-gray-400'}`}>Fecha Presupuesto *</label>
              <input type="date" name="budgetDate" value={formData.budgetDate || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('budgetDate')}`} />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetType') ? 'text-red-500' : 'text-gray-400'}`}>Gama / Modelo *</label>
              <input type="text" name="budgetType" value={formData.budgetType || ''} onChange={handleChange} placeholder="Ej: Delinia iD Roble" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('budgetType')}`} />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('statusNotManaged') ? 'text-red-500' : 'text-gray-400'}`}>Estado *</label>
              <select name="status" value={formData.status || 'En Curso'} onChange={handleChange} className={`w-full p-4 rounded-2xl border-none outline-none focus:ring-2 text-sm font-black uppercase transition-all ${formData.status === 'Gestionado' ? 'bg-[#669900]/10 text-[#669900]' : errors.includes('statusNotManaged') ? 'ring-2 ring-red-500 shadow-[0_0_15px_#ef4444] bg-red-50' : 'bg-gray-50 text-gray-700 focus:ring-blue-500/20'}`}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="lg:col-span-3 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-blue-500" /> Observaciones (Todos los pasos)
              </label>
              <textarea name="budgetNotes" value={formData.budgetNotes} onChange={handleChange} placeholder="Añade notas sobre el diseño, cambios solicitados, etc..." className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium h-24 resize-none transition-all" />
            </div>
          </div>
        ) : (
          <div className="p-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase italic text-sm">Selecciona una cocina del listado inferior para completar los datos técnicos</p>
          </div>
        )}

        {project && (
          <div className="mt-10 pt-10 border-t flex flex-col items-end gap-4">
            {errors.length > 0 && (
              <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4" /> 
                {errors.includes('statusNotManaged') ? 'El proyecto debe estar en estado GESTIONADO para pasar al Paso 3' : 'Faltan campos obligatorios destacados en rojo neón'}
              </p>
            )}
            <button onClick={handleSaveAndAdvance} className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-4 group">
              PASAR AL PASO 3 (CIERRE) <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-black text-gray-800 italic uppercase">Proyectos en Diseño / Presupuesto</h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 cursor-pointer">
            <input type="checkbox" checked={hideFinished} onChange={e => setHideFinished(e.target.checked)} className="accent-blue-500" />
            Solo pendientes (Fase 2)
          </label>
        </div>
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Nº Presupuesto</th>
                <th className="px-8 py-5">Importe</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 italic font-bold uppercase tracking-widest">No hay cocinas activas en Fase 2</td></tr>
              ) : (
                filteredList.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.status === 'Gestionado' ? 'bg-green-50/20' : ''}`}>
                    <td className="px-8 py-6 font-black text-gray-900">{p.clientName}</td>
                    <td className="px-8 py-6 text-xs text-blue-600 font-bold">{p.budgetNumber || 'PENDIENTE'}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#669900]">{p.totalAmount ? `${p.totalAmount.toLocaleString()} €` : '---'}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full border uppercase ${
                          p.status === 'Gestionado' ? 'bg-green-50 text-[#669900] border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                          {p.status || 'En Curso'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button onClick={() => openDetails(p)} className="p-3 bg-white text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl border border-blue-500/20 transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
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

export default StepTwo;

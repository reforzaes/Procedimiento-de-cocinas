
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STORES, Step } from '../types';
import { AlertCircle, PlusCircle, ArrowRight, Eye, PencilLine, Info, MessageSquare, Euro, Calendar } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepOneProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onCreate: (p: Project) => void;
  onSelect: (id: string) => void;
  onStepChange: (step: Step) => void;
}

const StepOne: React.FC<StepOneProps> = ({ project, projects, onUpdate, onCreate, onSelect, onStepChange }) => {
  const emptyForm: Partial<Project> = {
    ldapCollaborator: COLLABORATORS[0],
    store: STORES[0],
    receptionDate: new Date().toISOString().split('T')[0],
    willReform: false,
    willInstall: false,
    clientName: '',
    phone: '',
    kitchenDatePrediction: '',
    approxBudget: 0,
    step2Collaborator: '',
    budgetNotes: '',
    currentStep: 1
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
    if (!formData.clientName) newErrors.push('clientName');
    if (!formData.phone) newErrors.push('phone');
    if (!formData.step2Collaborator) newErrors.push('step2Collaborator');
    if (!formData.approxBudget || formData.approxBudget <= 0) newErrors.push('approxBudget');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    if (project) onUpdate(project.id, { [name]: val });
    
    // Quitar error visual si se completa el campo
    if (value && errors.includes(name)) {
      setErrors(prev => prev.filter(err => err !== name));
    }
  };

  const handleSaveAndAdvance = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, currentStep: 2 });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      onCreate({ ...(formData as Project), id: newId, currentStep: 2 });
    }
    onStepChange(Step.PRESUPUESTO);
  };

  const openDetails = (p: Project) => {
    setModalProject(p);
    setShowDetails(true);
  };

  const filteredList = projects.filter(p => !hideFinished || p.currentStep === 1);

  const getErrorClass = (fieldName: string) => 
    errors.includes(fieldName) ? "ring-2 ring-red-500 shadow-[0_0_15px_#ef4444]" : "focus:ring-[#669900]/20";

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase flex items-center gap-4">
            <PlusCircle className="text-[#669900] w-10 h-10" /> 
            {project ? 'EDITAR ALTA' : 'NUEVA ACOGIDA'}
          </h2>
          {project && (
             <button 
               onClick={() => openDetails(project)}
               className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#669900] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#669900] hover:text-white transition-all shadow-sm border border-[#669900]/20"
             >
               <Eye className="w-4 h-4" /> Ver Ficha Integral
             </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Colaborador Alta</label>
            <select name="ldapCollaborator" value={formData.ldapCollaborator} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold uppercase">
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('clientName') ? 'text-red-500' : 'text-gray-400'}`}>Cliente *</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nombre completo" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('clientName')}`} />
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('phone') ? 'text-red-500' : 'text-gray-400'}`}>Teléfono *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold transition-all ${getErrorClass('phone')}`} />
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('approxBudget') ? 'text-red-500' : 'text-gray-400'}`}>Presupuesto Aproximado *</label>
            <div className="relative">
              <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="number" name="approxBudget" value={formData.approxBudget || ''} onChange={handleChange} placeholder="0.00" className={`w-full pl-10 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold text-[#669900] transition-all ${getErrorClass('approxBudget')}`} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha aprox. Instalación</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="date" name="kitchenDatePrediction" value={formData.kitchenDatePrediction || ''} onChange={handleChange} className="w-full pl-10 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('step2Collaborator') ? 'text-red-500' : 'text-gray-400'}`}>Asignar a Vendedor (P2) *</label>
            <select name="step2Collaborator" value={formData.step2Collaborator} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 text-sm font-bold uppercase transition-all ${getErrorClass('step2Collaborator')}`}>
              <option value="">Seleccionar...</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="lg:col-span-3 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MessageSquare className="w-3 h-3 text-[#669900]" /> Observaciones Generales
            </label>
            <textarea name="budgetNotes" value={formData.budgetNotes} onChange={handleChange} placeholder="Detalles importantes para el diseño o presupuesto..." className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-medium h-24 resize-none" />
          </div>
        </div>

        <div className="mt-10 pt-10 border-t flex justify-between items-center">
          <div className="flex gap-6">
             <label className="flex items-center gap-2 cursor-pointer group">
               <input type="checkbox" name="willReform" checked={!!formData.willReform} onChange={handleChange} className="accent-[#669900] w-4 h-4" />
               <span className="text-[10px] font-black text-gray-400 uppercase">Reforma</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer group">
               <input type="checkbox" name="willInstall" checked={!!formData.willInstall} onChange={handleChange} className="accent-[#669900] w-4 h-4" />
               <span className="text-[10px] font-black text-gray-400 uppercase">Instalación LM</span>
             </label>
          </div>
          <button onClick={handleSaveAndAdvance} className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-4">
            GUARDAR Y PASAR AL PASO 2 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-black text-gray-800 italic uppercase">Listado de Acogidas</h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 cursor-pointer">
            <input type="checkbox" checked={hideFinished} onChange={e => setHideFinished(e.target.checked)} className="accent-[#669900]" />
            Solo pendientes de este paso
          </label>
        </div>
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Colaborador</th>
                <th className="px-8 py-5">Vendedor P2</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-black text-gray-900">{p.clientName}</td>
                  <td className="px-8 py-6 text-xs text-gray-500 uppercase italic">{p.ldapCollaborator}</td>
                  <td className="px-8 py-6 text-xs text-gray-500 uppercase">{p.step2Collaborator}</td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => openDetails(p)} className="p-3 bg-white text-[#669900] hover:bg-[#669900] hover:text-white rounded-2xl border border-[#669900]/20 transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
                    <button onClick={() => onSelect(p.id)} className="p-3 bg-white text-gray-300 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all"><PencilLine className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDetails && modalProject && <DetailsModal project={modalProject} onClose={() => setShowDetails(false)} />}
    </div>
  );
};

export default StepOne;

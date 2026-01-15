
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STORES, Step } from '../types';
import { AlertCircle, PlusCircle, ArrowRight, Eye, PencilLine, Info, CheckCircle2, MessageSquare } from 'lucide-react';
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
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    if (project) onUpdate(project.id, { [name]: val });
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

  const filteredList = projects.filter(p => !hideFinished || p.currentStep === 1);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase mb-10 flex items-center gap-4">
          <PlusCircle className="text-[#669900] w-10 h-10" /> 
          {project ? 'EDITAR ALTA' : 'NUEVA ACOGIDA'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Colaborador Alta</label>
            <select name="ldapCollaborator" value={formData.ldapCollaborator} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold uppercase">
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('clientName') ? 'text-red-500' : 'text-gray-400'}`}>Cliente *</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Nombre completo" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold" />
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('phone') ? 'text-red-500' : 'text-gray-400'}`}>Teléfono *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold" />
          </div>

          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('step2Collaborator') ? 'text-red-500' : 'text-gray-400'}`}>Asignar a Vendedor (P2) *</label>
            <select name="step2Collaborator" value={formData.step2Collaborator} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold uppercase">
              <option value="">Seleccionar...</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="lg:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notas para el Paso 2</label>
            <textarea name="budgetNotes" value={formData.budgetNotes} onChange={handleChange} placeholder="Detalles, gustos del cliente, advertencias..." className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-medium h-14 resize-none" />
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
          <h3 className="text-xl font-black text-gray-800 italic uppercase">Proyectos en Acogida</h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 cursor-pointer">
            <input type="checkbox" checked={hideFinished} onChange={e => setHideFinished(e.target.checked)} className="accent-[#669900]" />
            Solo pendientes de este paso
          </label>
        </div>
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase">
              <tr>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Colaborador</th>
                <th className="px-8 py-5">Vendedor P2</th>
                <th className="px-8 py-5">Paso Actual</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredList.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-black">{p.clientName}</td>
                  <td className="px-8 py-6 text-xs text-gray-500 uppercase italic">{p.ldapCollaborator}</td>
                  <td className="px-8 py-6 text-xs text-gray-500 uppercase">{p.step2Collaborator}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-50 text-[#669900] text-[9px] font-black rounded-full border border-green-100 uppercase">Paso {p.currentStep}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => onSelect(p.id)} className="p-2 text-gray-300 hover:text-gray-900"><PencilLine className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StepOne;

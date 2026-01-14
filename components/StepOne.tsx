
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STORES, Step } from '../types';
import { AlertCircle, PlusCircle, ArrowRight, Eye, PencilLine, Info, CheckCircle2 } from 'lucide-react';
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
    step1Completed: false,
    currentStep: 1
  };

  const [formData, setFormData] = useState<Partial<Project>>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);

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
    if (!formData.kitchenDatePrediction) newErrors.push('kitchenDatePrediction');
    if (!formData.approxBudget || (formData.approxBudget || 0) <= 0) newErrors.push('approxBudget');
    if (!formData.step2Collaborator) newErrors.push('step2Collaborator');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    if (errors.includes(name)) setErrors(errors.filter(err => err !== name));
    if (project) onUpdate(project.id, { [name]: val });
  };

  const handleSaveAndAdvance = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, step1Completed: true, currentStep: 2 });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      onCreate({
        ...(formData as Project),
        id: newId,
        currentStep: 2,
        step1Completed: true,
      });
    }
    onStepChange(Step.PRESUPUESTO);
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
            <div className="p-4 bg-[#669900]/10 rounded-3xl">
               <PlusCircle className="w-8 h-8 text-[#669900]" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
                {project ? 'EDITAR ACOGIDA' : 'NUEVA ACOGIDA'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Paso 1: Captación inicial</p>
            </div>
          </div>
          {project && (
            <div className="flex gap-3">
              <button 
                onClick={() => openDetails(project)} 
                className="flex items-center gap-3 px-8 py-3.5 bg-[#669900] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#669900]/20"
              >
                <Eye className="w-5 h-5" /> VER FICHA INTEGRAL
              </button>
              <button onClick={() => onSelect('')} className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                CANCELAR EDICIÓN
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Colaborador Alta</label>
            <select name="ldapCollaborator" value={formData.ldapCollaborator || ''} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#669900]/20 text-sm font-bold uppercase">
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('clientName') ? 'text-red-500' : 'text-gray-400'}`}>Nombre Completo *</label>
            <input type="text" name="clientName" value={formData.clientName || ''} onChange={handleChange} placeholder="Nombre y Apellidos" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('clientName') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('phone') ? 'text-red-500' : 'text-gray-400'}`}>Teléfono *</label>
            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="600 000 000" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('phone') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('approxBudget') ? 'text-red-500' : 'text-gray-400'}`}>Presupuesto Aprox (€) *</label>
            <input type="number" name="approxBudget" value={formData.approxBudget || ''} onChange={handleChange} placeholder="0.00" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-black text-[#669900] ${errors.includes('approxBudget') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('kitchenDatePrediction') ? 'text-red-500' : 'text-gray-400'}`}>Previsión Cocina *</label>
            <input type="date" name="kitchenDatePrediction" value={formData.kitchenDatePrediction || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm ${errors.includes('kitchenDatePrediction') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('step2Collaborator') ? 'text-red-500' : 'text-gray-400'}`}>Responsable Paso 2 *</label>
            <select name="step2Collaborator" value={formData.step2Collaborator || ''} onChange={handleChange} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold uppercase italic ${errors.includes('step2Collaborator') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`}>
              <option value="">SELECCIONA VENDEDOR...</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-10 pt-4 lg:col-span-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="willReform" checked={!!formData.willReform} onChange={handleChange} className="peer sr-only" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg border-2 border-transparent peer-checked:bg-[#669900] transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 left-1.5 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Requiere Reforma</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="willInstall" checked={!!formData.willInstall} onChange={handleChange} className="peer sr-only" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg border-2 border-transparent peer-checked:bg-[#669900] transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 left-1.5 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Instalación LM</span>
            </label>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-black text-red-600 uppercase italic">Completa todos los campos obligatorios para avanzar al Paso 2</span>
          </div>
        )}

        <div className="mt-12 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <Info className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Los datos se guardan en el Excel del Paso 1</span>
          </div>
          
          <button 
            onClick={handleSaveAndAdvance}
            className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-4 group hover:bg-[#558000]"
          >
            GUARDAR Y PASAR AL PASO 2 (PRESUPUESTO)
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-800 italic uppercase px-4 flex items-center gap-3">
          <span className="bg-[#669900] text-white px-3 py-1 rounded-xl not-italic">{projects.length}</span>
          COCINAS ESPERANDO ACOGIDA
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Cliente / Tel</th>
                <th className="px-8 py-5">Colaborador Alta</th>
                <th className="px-8 py-5">Presupuesto</th>
                <th className="px-8 py-5">Vendedor Paso 2</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-bold uppercase italic text-sm">No hay proyectos retenidos en el Paso 1</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-gray-900 group-hover:text-[#669900]">{p.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-bold italic">{p.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase italic">{p.ldapCollaborator}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#669900] italic">{p.approxBudget?.toLocaleString()} €</td>
                    <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase">{p.step2Collaborator || 'Sin asignar'}</td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button onClick={() => openDetails(p)} className="p-3 bg-white text-[#669900] hover:bg-[#669900] hover:text-white rounded-2xl border border-[#669900]/20 transition-all shadow-sm"><Eye className="w-5 h-5" /></button>
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

export default StepOne;

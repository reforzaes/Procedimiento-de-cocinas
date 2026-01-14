
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STORES } from '../types';
import { CheckCircle2, AlertCircle, PlusCircle, ArrowRight, Eye, PencilLine, Info } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepOneProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onCreate: (p: Project) => void;
  onSelect: (id: string) => void;
}

const StepOne: React.FC<StepOneProps> = ({ project, projects, onUpdate, onCreate, onSelect }) => {
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
    step2Collaborator: ''
  };

  const [formData, setFormData] = useState<Partial<Project>>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setFormData(project || emptyForm);
    setErrors([]);
  }, [project]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.clientName) newErrors.push('clientName');
    if (!formData.phone) newErrors.push('phone');
    if (!formData.kitchenDatePrediction) newErrors.push('kitchenDatePrediction');
    if (!formData.approxBudget || formData.approxBudget <= 0) newErrors.push('approxBudget');
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

  const handleSave = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, step1Completed: true });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      onCreate({
        ...(formData as Project),
        id: newId,
        currentStep: 1,
        step1Completed: true,
        step2Completed: false,
        step3Completed: false,
      });
      setFormData(emptyForm);
    }
  };

  const handlePassToStepTwo = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, step1Completed: true, currentStep: Math.max(project.currentStep, 2) });
    } else {
      handleSave();
    }
    // Opcionalmente podrías forzar el cambio de tab en App.tsx pero aquí cumplimos la lógica de datos
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
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Paso 1: Primer contacto con el cliente</p>
            </div>
          </div>
          {project && (
            <div className="flex gap-3">
              <button onClick={() => setShowDetails(true)} className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                <Eye className="w-4 h-4" /> VER FICHA
              </button>
              <button onClick={() => onSelect('')} className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                LIMPIAR / NUEVA
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
            <input type="text" name="clientName" value={formData.clientName || ''} onChange={handleChange} placeholder="Ej: Juan Pérez..." className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('clientName') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-[#669900]/20'}`} />
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
              <option value="">SELECCIONA RESPONSABLE...</option>
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
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Requiere Reforma (Opcional)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="willInstall" checked={!!formData.willInstall} onChange={handleChange} className="peer sr-only" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg border-2 border-transparent peer-checked:bg-[#669900] transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 left-1.5 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Instalación LM (Opcional)</span>
            </label>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-bounce">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-black text-red-600 uppercase">Debes completar los campos resaltados para continuar</span>
          </div>
        )}

        <div className="mt-12 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <Info className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Los campos con (*) son obligatorios para el avance de fase</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
            >
              SOLO GUARDAR
            </button>
            <button 
              onClick={handlePassToStepTwo}
              className="px-12 py-4 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 group hover:bg-[#558000] shadow-[#669900]/20"
            >
              PASAR A PRESUPUESTO
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-800 italic uppercase px-4 flex items-center gap-3">
          <span className="bg-[#669900] text-white px-3 py-1 rounded-xl not-italic">{projects.length}</span>
          COOCINAS EN ESTA FASE
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Importe Aprox</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado Paso 1</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-bold uppercase italic text-sm">No hay registros en esta fase</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-gray-900 group-hover:text-[#669900] transition-colors">{p.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{p.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase italic">{p.ldapCollaborator}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#669900] italic">{p.approxBudget?.toLocaleString()} €</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${
                        p.step1Completed ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {p.step1Completed ? 'COMPLETO' : 'PENDIENTE DATOS'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
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

export default StepOne;


import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STORES } from '../types';
import { CheckCircle2, AlertCircle, PlusCircle, ArrowRight, Lock, Eye } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepOneProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onCreate: (p: Project) => void;
  onSelect: (id: string, step: number) => void;
}

const StepOne: React.FC<StepOneProps> = ({ project, projects, onUpdate, onCreate, onSelect }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
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
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
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
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const updatedData = { ...formData, [name]: val };
    setFormData(updatedData);
    
    // Auto-grabado si el proyecto ya existe
    if (project) {
      onUpdate(project.id, { [name]: val });
    }
  };

  const isFormComplete = (data: Partial<Project>) => {
    return !!(
      data.clientName && 
      data.phone && 
      data.kitchenDatePrediction && 
      (data.approxBudget !== undefined && data.approxBudget > 0) &&
      data.ldapCollaborator &&
      data.store &&
      data.step2Collaborator
    );
  };

  const handleSave = () => {
    const completed = isFormComplete(formData);
    if (project) {
      onUpdate(project.id, { ...formData, step1Completed: completed });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      onCreate({
        ...(formData as Project),
        id: newId,
        currentStep: 1,
        step1Completed: completed,
        step2Completed: false,
        step3Completed: false,
      });
    }
  };

  const handlePassToStepTwo = () => {
    const completed = isFormComplete(formData);
    if (!completed) return;

    if (project) {
      onUpdate(project.id, { ...formData, step1Completed: true, currentStep: 2 });
      onSelect(project.id, 2);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      const newProject: Project = {
        ...(formData as Project),
        id: newId,
        currentStep: 2,
        step1Completed: true,
        step2Completed: false,
        step3Completed: false,
      };
      onCreate(newProject);
      onSelect(newId, 2);
    }
  };

  const complete = isFormComplete(formData);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-xl">
               <PlusCircle className="w-6 h-6 text-[#669900]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">ACOGIDA CLIENTE</h2>
              {project && (
                 <p className="text-xs text-gray-400 font-bold uppercase">Editando: <span className="text-green-600">{project.clientName}</span></p>
              )}
            </div>
          </div>
          {project && (
            <button 
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <Eye className="w-4 h-4" /> VER FICHA COMPLETA
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colaborador LDAP</label>
            <select 
              name="ldapCollaborator"
              value={formData.ldapCollaborator || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-medium"
            >
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tienda</label>
            <select 
              name="store"
              value={formData.store || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-medium"
            >
              {STORES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha Acogida</label>
            <input 
              type="date"
              name="receptionDate"
              readOnly
              value={formData.receptionDate || ''}
              className="w-full p-3 bg-gray-100 rounded-xl cursor-not-allowed outline-none text-sm text-gray-400 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre Cliente</label>
            <input 
              type="text"
              name="clientName"
              placeholder="Nombre y apellidos..."
              value={formData.clientName || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono (Buscador)</label>
            <input 
              type="tel"
              name="phone"
              placeholder="Ej: 600000000"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previsión Cocina</label>
            <input 
              type="date"
              name="kitchenDatePrediction"
              value={formData.kitchenDatePrediction || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presupuesto Aprox.</label>
            <div className="relative">
              <input 
                type="number"
                name="approxBudget"
                placeholder="0"
                value={formData.approxBudget || ''}
                onChange={handleChange}
                className="w-full p-3 pl-8 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-black"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Agenda Paso 2 a:</label>
            <select 
              name="step2Collaborator"
              value={formData.step2Collaborator || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-medium"
            >
              <option value="">Seleccionar responsable...</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center space-x-8 h-full pt-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="willReform" checked={!!formData.willReform} onChange={handleChange} className="peer sr-only" />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-[#669900] transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Reforma</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="willInstall" checked={!!formData.willInstall} onChange={handleChange} className="peer sr-only" />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-[#669900] transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Instalación</span>
            </label>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            {complete ? (
              <div className="flex items-center space-x-2 text-[#669900] bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Paso 1 Validado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Faltan datos obligatorios</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {!project && (
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-gray-100 uppercase tracking-widest"
              >
                Grabar Proyecto
              </button>
            )}
            <button 
              onClick={handlePassToStepTwo}
              disabled={!complete}
              className={`px-8 py-3 rounded-2xl transition-all font-bold text-sm flex items-center gap-2 group shadow-xl uppercase tracking-widest ${
                complete 
                  ? 'bg-[#669900] text-white hover:bg-[#558000] shadow-green-100' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {!complete && <Lock className="w-4 h-4" />}
              Pasar al Paso 2
              {complete && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 px-2 italic uppercase tracking-tight">
          Listado Clientes Acogida <span className="text-gray-300 font-medium">({projects.length})</span>
        </h3>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tienda</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic font-medium">No hay acogidas pendientes</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900 group-hover:text-[#669900]">{p.clientName}</div>
                      <div className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">{p.phone}</div>
                    </td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-600">{p.ldapCollaborator}</td>
                    <td className="px-6 py-5 text-xs font-medium text-gray-600">{p.store}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                        p.step1Completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.step1Completed ? 'COMPLETO' : 'INCOMPLETO'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onSelect(p.id, 1)} className="p-2 text-gray-300 hover:text-[#669900] bg-gray-50 hover:bg-green-50 rounded-xl transition-all"><ArrowRight className="w-5 h-5" /></button>
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

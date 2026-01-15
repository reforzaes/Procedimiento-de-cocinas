
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS, Step } from '../types';
import { AlertCircle, FilePlus, Eye, ArrowRight, PencilLine, Info, CheckCircle2 } from 'lucide-react';
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
    // VALIDACIÓN ESTRICTA
    if (!formData.budgetNumber) newErrors.push('budgetNumber');
    if (!formData.budgetDate) newErrors.push('budgetDate');
    if (!formData.budgetType) newErrors.push('budgetType');
    if (!formData.totalAmount || (formData.totalAmount || 0) <= 0) newErrors.push('totalAmount');
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
      onUpdate(project.id, { ...formData, currentStep: 3 });
      onStepChange(Step.VISITA);
    }
  };

  const filteredList = projects.filter(p => !hideFinished || p.currentStep === 2);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase mb-10 flex items-center gap-4">
          <FilePlus className="text-blue-500 w-10 h-10" /> 
          DISEÑO Y PRESUPUESTO
        </h2>

        {project ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cliente</label>
              <input type="text" readOnly value={project.clientName} className="w-full p-4 bg-gray-100 rounded-2xl border-none text-sm font-black text-gray-400" />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetNumber') ? 'text-red-500' : 'text-gray-400'}`}>Nº Presupuesto *</label>
              <input type="text" name="budgetNumber" value={formData.budgetNumber || ''} onChange={handleChange} placeholder="Ej: 2025/123" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold" />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('totalAmount') ? 'text-red-500' : 'text-gray-400'}`}>Importe Final (€) *</label>
              <input type="number" name="totalAmount" value={formData.totalAmount || ''} onChange={handleChange} placeholder="0.00" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-black text-blue-600" />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetDate') ? 'text-red-500' : 'text-gray-400'}`}>Fecha Presupuesto *</label>
              <input type="date" name="budgetDate" value={formData.budgetDate || ''} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold" />
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetType') ? 'text-red-500' : 'text-gray-400'}`}>Gama / Modelo *</label>
              <input type="text" name="budgetType" value={formData.budgetType || ''} onChange={handleChange} placeholder="Ej: Delinia iD Roble" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
              <select name="status" value={formData.status || 'En Curso'} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold uppercase">
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="lg:col-span-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Notas de Acogida:</p>
                 <p className="text-xs font-medium text-blue-700 italic">{project.budgetNotes || 'Sin notas previas'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase italic text-sm">Selecciona una cocina del listado inferior para completar los datos técnicos</p>
          </div>
        )}

        {project && (
          <div className="mt-10 pt-10 border-t flex justify-between items-center">
            {errors.length > 0 && (
              <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Faltan campos obligatorios para agendar la medición
              </p>
            )}
            <div className="flex-1"></div>
            <button onClick={handleSaveAndAdvance} className="px-12 py-5 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-4 group">
              GUARDAR Y PASAR AL PASO 3 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-black text-gray-800 italic uppercase">Proyectos en Diseño</h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 cursor-pointer">
            <input type="checkbox" checked={hideFinished} onChange={e => setHideFinished(e.target.checked)} className="accent-blue-500" />
            Solo pendientes de este paso
          </label>
        </div>
        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase">
              <tr>
                <th className="px-8 py-5">Cliente</th>
                <th className="px-8 py-5">Nº Presupuesto</th>
                <th className="px-8 py-5">Importe</th>
                <th className="px-8 py-5">Paso Actual</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredList.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-black">{p.clientName}</td>
                  <td className="px-8 py-6 text-xs text-blue-600 font-bold">{p.budgetNumber || 'PENDIENTE'}</td>
                  <td className="px-8 py-6 text-sm font-black text-[#669900]">{p.totalAmount ? `${p.totalAmount.toLocaleString()} €` : '---'}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full border border-blue-100 uppercase">Paso {p.currentStep}</span>
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

export default StepTwo;

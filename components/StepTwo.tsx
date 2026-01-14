
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS, BudgetNote } from '../types';
import { CheckCircle2, AlertCircle, FilePlus, Eye, MessageSquare, Send, ArrowRight, PencilLine, Info } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepTwoProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onCreate: (p: Project) => void;
  onSelect: (id: string) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ project, projects, onUpdate, onCreate, onSelect }) => {
  const emptyForm: Partial<Project> = {
    budgetNumber: '',
    budgetDate: new Date().toISOString().split('T')[0],
    budgetType: '',
    status: 'En Curso',
    totalAmount: 0,
    handDrawnPlan: false,
    measurementSent: false,
    step2Completed: false,
    // Datos básicos por si es creación directa
    clientName: '',
    phone: '',
    ldapCollaborator: COLLABORATORS[0],
    receptionDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Partial<Project>>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setFormData(project || emptyForm);
    setErrors([]);
  }, [project]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!formData.clientName) newErrors.push('clientName');
    if (!formData.budgetNumber) newErrors.push('budgetNumber');
    if (!formData.budgetType) newErrors.push('budgetType');
    if (!formData.totalAmount || formData.totalAmount <= 0) newErrors.push('totalAmount');
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
      onUpdate(project.id, { ...formData, step2Completed: true });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      onCreate({
        ...(formData as Project),
        id: newId,
        currentStep: 2,
        step1Completed: false, // Creación directa
        step2Completed: true,
        step3Completed: false,
      });
      setFormData(emptyForm);
    }
  };

  const handlePassToStepThree = () => {
    if (!validate()) return;
    if (project) {
      onUpdate(project.id, { ...formData, step2Completed: true, currentStep: Math.max(project.currentStep, 3) });
    } else {
      handleSave();
    }
  };

  const handleAddNote = () => {
    if (project && newNote.trim()) {
      const note: BudgetNote = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        author: project.ldapCollaborator || 'Gestor',
        text: newNote.trim()
      };
      const updatedNotes = [...(project.budgetNotes || []), note];
      onUpdate(project.id, { budgetNotes: updatedNotes });
      setNewNote('');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-3xl">
               <FilePlus className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">
                {project ? 'EDITAR PRESUPUESTO' : 'NUEVO PRESUPUESTO'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Paso 2: Elaboración técnica y económica</p>
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
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('clientName') ? 'text-red-500' : 'text-gray-400'}`}>Cliente *</label>
            <input type="text" name="clientName" value={formData.clientName || ''} onChange={handleChange} placeholder="Nombre del cliente..." className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('clientName') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-blue-500/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetNumber') ? 'text-red-500' : 'text-gray-400'}`}>Nº Presupuesto *</label>
            <input type="text" name="budgetNumber" value={formData.budgetNumber || ''} onChange={handleChange} placeholder="2025-XXXXX" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-bold ${errors.includes('budgetNumber') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-blue-500/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('totalAmount') ? 'text-red-500' : 'text-gray-400'}`}>Importe Final (€) *</label>
            <input type="number" name="totalAmount" value={formData.totalAmount || ''} onChange={handleChange} placeholder="0.00" className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm font-black text-blue-600 ${errors.includes('totalAmount') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-blue-500/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.includes('budgetType') ? 'text-red-500' : 'text-gray-400'}`}>Gama / Tipo *</label>
            <input type="text" name="budgetType" value={formData.budgetType || ''} onChange={handleChange} placeholder="Delinia iD / Roble..." className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none transition-all text-sm ${errors.includes('budgetType') ? 'border-red-500 bg-red-50' : 'border-transparent focus:ring-2 focus:ring-blue-500/20'}`} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado Presupuesto</label>
            <select name="status" value={formData.status || 'En Curso'} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-bold uppercase">
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha Elaboración</label>
            <input type="date" name="budgetDate" value={formData.budgetDate || ''} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
          </div>

          <div className="flex items-center gap-10 pt-4 lg:col-span-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="handDrawnPlan" checked={!!formData.handDrawnPlan} onChange={handleChange} className="peer sr-only" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg border-2 border-transparent peer-checked:bg-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 left-1.5 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plano Mano Alzada</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="measurementSent" checked={!!formData.measurementSent} onChange={handleChange} className="peer sr-only" />
                <div className="w-7 h-7 bg-gray-100 rounded-lg border-2 border-transparent peer-checked:bg-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1.5 left-1.5 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medición Enviada</span>
            </label>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 animate-bounce">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-xs font-black text-red-600 uppercase">Faltan campos críticos resaltados en rojo</span>
          </div>
        )}

        <div className="mt-12 pt-10 border-t grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-800 italic uppercase flex items-center gap-2"><MessageSquare className="w-5 h-5 text-gray-400" /> Notas de Gestión</h3>
              <div className="relative">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Añadir comentario sobre el avance del diseño..."
                  className="w-full h-32 p-4 border-2 border-gray-100 rounded-3xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm resize-none font-medium shadow-inner"
                />
                <button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || !project}
                  className="absolute bottom-4 right-4 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[2rem] p-6 max-h-[160px] overflow-y-auto space-y-4 border border-gray-100 shadow-inner">
              {project?.budgetNotes && project.budgetNotes.length > 0 ? (
                [...project.budgetNotes].reverse().map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.01]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.author}</span>
                      <span className="text-[9px] font-bold text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{note.text}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs italic py-4">No hay anotaciones de diseño</div>
              )}
            </div>
        </div>

        <div className="mt-12 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
             <Info className="w-4 h-4 text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">(*) Requeridos para validación de presupuesto</span>
          </div>
          
          <div className="flex gap-4">
             <button 
                onClick={handleSave}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
              >
                SOLO GUARDAR
              </button>
              <button 
                onClick={handlePassToStepThree}
                className="px-12 py-4 bg-[#669900] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 group hover:bg-[#558000] shadow-[#669900]/20"
              >
                FINALIZAR Y PASAR A CIERRE
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-800 italic uppercase px-4 flex items-center gap-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-xl not-italic">{projects.length}</span>
          COOCINAS EN DISEÑO / PRESUPUESTO
        </h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº Presu</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Importe Final</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-16 text-center text-gray-400 font-bold uppercase italic text-sm">No hay presupuestos activos</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{p.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase italic">{p.budgetType || 'Sin definir gama'}</div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-blue-600">{p.budgetNumber || 'PENDIENTE'}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#669900] italic">{p.totalAmount?.toLocaleString()} €</td>
                    <td className="px-8 py-6">
                       <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                          p.status === 'Gestionado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status || 'En Curso'}
                        </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                       <button onClick={() => onSelect(p.id)} className="p-3 bg-white text-gray-300 hover:text-blue-600 rounded-2xl border border-gray-100 hover:border-blue-600/30 transition-all"><PencilLine className="w-5 h-5" /></button>
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

export default StepTwo;

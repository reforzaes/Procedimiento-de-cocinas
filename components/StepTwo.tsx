
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS, BudgetNote } from '../types';
import { CheckCircle2, AlertCircle, FilePlus, Eye, MessageSquare, Send, ArrowRight } from 'lucide-react';
import DetailsModal from './DetailsModal';

interface StepTwoProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string, step: number) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ project, projects, onUpdate, onSelect }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    status: 'En Curso',
    handDrawnPlan: false,
    measurementSent: false,
    budgetDate: new Date().toISOString().split('T')[0],
  });
  const [newNote, setNewNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // AUTO-GRABADO AL CAMBIAR CAMPO
    if (project) {
      onUpdate(project.id, { [name]: val });
    }
  };

  const isFormComplete = (data: Partial<Project>) => {
    return !!(
      data.budgetNumber && 
      data.totalAmount && 
      data.status && 
      data.budgetType
    );
  };

  const handleAddNote = () => {
    if (project && newNote.trim()) {
      const note: BudgetNote = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        author: formData.step2Collaborator || 'Colaborador',
        text: newNote.trim()
      };
      const updatedNotes = [...(project.budgetNotes || []), note];
      onUpdate(project.id, { budgetNotes: updatedNotes });
      setNewNote('');
    }
  };

  const handlePassToStepThree = () => {
    if (project && isFormComplete(formData)) {
      onUpdate(project.id, { ...formData, step2Completed: true, currentStep: 3 });
      onSelect(project.id, 3);
    }
  };

  const openDetails = (p: Project) => {
    setModalProject(p);
    setShowModal(true);
  };

  if (!project) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <FilePlus className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-black text-gray-800 italic">BANDEJA DE PRESUPUESTOS</h2>
        <p className="text-gray-400 max-w-sm mx-auto mt-2 text-sm font-medium italic">Selecciona un proyecto desde el buscador o el listado inferior.</p>
        
        <div className="mt-12 max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nº Presupuesto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-800">{p.clientName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-blue-600">{p.budgetNumber || 'PENDIENTE'}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                          p.status === 'Gestionado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status || 'En Curso'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => openDetails(p)} className="p-2 text-gray-400 hover:text-blue-500 bg-gray-50 rounded-xl transition-all"><Eye className="w-5 h-5" /></button>
                       <button onClick={() => onSelect(p.id, 2)} className="p-2 text-gray-400 hover:text-[#669900] bg-gray-50 rounded-xl transition-all"><FilePlus className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && modalProject && <DetailsModal project={modalProject} onClose={() => setShowModal(false)} />}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <FilePlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">2. PRESUPUESTO</h2>
              <p className="text-xs text-gray-400 font-bold tracking-tight uppercase">Cliente: <span className="text-blue-600">{project.clientName}</span></p>
            </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Eye className="w-4 h-4" /> Ver Ficha Completa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número Presupuesto</label>
            <input 
              type="text"
              name="budgetNumber"
              placeholder="Ej: 2024/Cocina/001"
              value={formData.budgetNumber || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsable Presupuesto</label>
            <select 
              name="step2Collaborator"
              value={formData.step2Collaborator || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
            >
              <option value="">Seleccionar...</option>
              {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha Elaboración</label>
            <input 
              type="date"
              name="budgetDate"
              value={formData.budgetDate || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo / Gama</label>
            <input 
              type="text"
              name="budgetType"
              placeholder="Ej: Delinia iD Roble"
              value={formData.budgetType || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</label>
            <select 
              name="status"
              value={formData.status || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold uppercase"
            >
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Importe Final (€)</label>
            <input 
              type="number"
              name="totalAmount"
              placeholder="0.00"
              value={formData.totalAmount || ''}
              onChange={handleChange}
              className="w-full p-3 border-b-2 border-transparent bg-gray-50 rounded-xl outline-none focus:border-[#669900] focus:bg-white transition-all text-sm font-black"
            />
          </div>

          <div className="flex items-center space-x-6 h-full pt-4 lg:col-span-3">
             <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="handDrawnPlan" checked={!!formData.handDrawnPlan} onChange={handleChange} className="peer sr-only" />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Plano Mano Alzada</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="measurementSent" checked={!!formData.measurementSent} onChange={handleChange} className="peer sr-only" />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Envío Medición</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-12 pt-8 border-t grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-800 italic uppercase flex items-center gap-2"><MessageSquare className="w-5 h-5 text-gray-400" /> Notas de Gestión</h3>
              <div className="relative">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Añadir comentario sobre el avance..."
                  className="w-full h-32 p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm resize-none font-medium"
                />
                <button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="absolute bottom-4 right-4 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 max-h-[250px] overflow-y-auto space-y-4">
              {project.budgetNotes && project.budgetNotes.length > 0 ? (
                [...project.budgetNotes].reverse().map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.01]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.author}</span>
                      <span className="text-[9px] font-bold text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{note.text}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 text-sm italic py-8">No hay notas todavía</div>
              )}
            </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            {isFormComplete(formData) ? (
              <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Presupuesto Cerrado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Pendiente de Datos Finales</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handlePassToStepThree}
            disabled={!isFormComplete(formData)}
            className="px-10 py-4 bg-[#669900] text-white rounded-2xl hover:bg-[#558000] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all font-black text-sm shadow-xl shadow-green-100 uppercase tracking-widest flex items-center gap-3 group"
          >
            Pasar al Paso 3 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      {showModal && project && <DetailsModal project={project} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default StepTwo;

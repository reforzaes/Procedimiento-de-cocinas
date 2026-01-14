
import React, { useState, useEffect } from 'react';
import { Project, COLLABORATORS, STATUS_OPTIONS, BudgetNote } from '../types';
import { CheckCircle2, AlertCircle, FilePlus, Eye, X, MessageSquare, Send, Calendar, User, CreditCard, Tag } from 'lucide-react';

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
  };

  const isFormComplete = (data: Partial<Project>) => {
    return !!(
      data.budgetNumber && 
      data.totalAmount && 
      data.status && 
      data.budgetType
    );
  };

  const handleSave = () => {
    if (project) {
      const completed = isFormComplete(formData);
      onUpdate(project.id, { ...formData, step2Completed: completed });
    }
  };

  const handleAddNote = () => {
    if (project && newNote.trim()) {
      const note: BudgetNote = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        author: formData.step2Collaborator || 'Sistema',
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
        <h2 className="text-xl font-bold text-gray-800">Selecciona un presupuesto</h2>
        <p className="text-gray-500 max-w-sm mx-auto mt-2">Busca un presupuesto arriba o selecciona uno del listado inferior.</p>
        
        <div className="mt-12 max-w-4xl mx-auto px-4">
          <h3 className="text-left text-lg font-black text-gray-800 mb-4 px-2 uppercase italic tracking-tight">Presupuestos Activos</h3>
          <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
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
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{p.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.budgetNumber || '---'}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${
                          p.status === 'Gestionado' ? 'bg-green-100 text-green-700' :
                          p.status === 'Anulado' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status || 'En Curso'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => openDetails(p)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Eye className="w-5 h-5" /></button>
                       <button onClick={() => onSelect(p.id, 2)} className="p-2 text-gray-400 hover:text-[#669900] transition-colors"><FilePlus className="w-5 h-5" /></button>
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
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <FilePlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">2. PRESUPUESTO</h2>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Gestionando proyecto de: <span className="text-blue-600 font-bold">{project.clientName}</span></p>
            </div>
          </div>
          <button 
            onClick={() => openDetails(project)}
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
                <input 
                  type="checkbox" 
                  name="handDrawnPlan"
                  checked={!!formData.handDrawnPlan}
                  onChange={handleChange}
                  className="peer sr-only" 
                />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Plano Mano Alzada</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="measurementSent"
                  checked={!!formData.measurementSent}
                  onChange={handleChange}
                  className="peer sr-only" 
                />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                <CheckCircle2 className="w-4 h-4 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-all" />
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase group-hover:text-blue-600 transition-colors">Envío Medición</span>
            </label>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-black text-gray-800 tracking-tight italic uppercase">Notas de Gestión</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Añadir una nota sobre la gestión del presupuesto..."
                  className="w-full h-32 p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm resize-none"
                />
                <button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 max-h-64 overflow-y-auto space-y-4">
              {project.budgetNotes && project.budgetNotes.length > 0 ? (
                [...project.budgetNotes].reverse().map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.author}</span>
                      <span className="text-[9px] font-bold text-gray-400">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic py-8">
                  <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                  No hay notas registradas
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-4">
            {isFormComplete(formData) ? (
              <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight">Presupuesto Elaborado</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-tight italic">Pendiente de completar datos</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-gray-100"
            >
              Guardar Cambios
            </button>
            <button 
              onClick={handlePassToStepThree}
              disabled={!isFormComplete(formData)}
              className="px-8 py-3 bg-[#669900] text-white rounded-2xl hover:bg-[#558000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-xl shadow-green-100"
            >
              Cerrar y Pasar al Paso 3
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 px-2 uppercase italic tracking-tight">
          BANDEJA DE PRESUPUESTOS <span className="text-gray-300 font-medium">({projects.length})</span>
        </h3>
        <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nº Presupuesto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Importe</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic font-medium">No hay presupuestos en esta fase</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">{p.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{p.phone}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">{p.budgetNumber || 'Pendiente'}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#669900]">{p.totalAmount ? `${p.totalAmount.toLocaleString()} €` : '---'}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                        p.status === 'Gestionado' ? 'bg-green-100 text-green-700' :
                        p.status === 'Anulado' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status || 'En Curso'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                       <button 
                        onClick={() => openDetails(p)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Ver Ficha"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onSelect(p.id, 2)}
                        className="p-2 text-gray-400 hover:text-[#669900] hover:bg-green-50 rounded-xl transition-all"
                        title="Editar"
                      >
                        <FilePlus className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && modalProject && <DetailsModal project={modalProject} onClose={() => setShowModal(false)} />}
    </div>
  );
};

interface DetailsModalProps {
  project: Project;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="px-8 py-6 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <CreditCard className="w-6 h-6 text-[#669900]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase italic">Ficha del Presupuesto</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{project.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-gray-100 rounded-full hover:bg-gray-100 transition-all shadow-sm">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Client & Basic Info */}
            <div className="space-y-6">
              <section className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Información del Cliente</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-800">{project.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{project.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Alta: {project.receptionDate}</span>
                  </div>
                </div>
              </section>

              <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Detalles del Proyecto</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Paso Actual</span>
                    <span className="font-black text-blue-600">Paso {project.currentStep}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gama Cocina</span>
                    <span className="font-bold">{project.budgetType || '---'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tienda</span>
                    <span className="font-bold">{project.store}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Middle Column: Budget Financials */}
            <div className="space-y-6">
              <section className="bg-green-50 p-8 rounded-[2.5rem] border border-green-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-[#669900] uppercase tracking-[0.2em] mb-2">Importe Presupuestado</h4>
                  <p className="text-4xl font-black text-gray-800">{project.totalAmount?.toLocaleString() || '---'} €</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      project.status === 'Gestionado' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'
                    }`}>
                      {project.status || 'En Curso'}
                    </span>
                  </div>
                </div>
                <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 text-green-200/50 group-hover:scale-110 transition-transform duration-500" />
              </section>

              <section className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Checklist Gestión</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Plano Mano Alzada</span>
                    {project.handDrawnPlan ? <CheckCircle2 className="w-5 h-5 text-[#669900]" /> : <AlertCircle className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Envío Medición</span>
                    {project.measurementSent ? <CheckCircle2 className="w-5 h-5 text-[#669900]" /> : <AlertCircle className="w-5 h-5 text-gray-300" />}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Historical Notes */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Historial de Gestión</h4>
              <div className="space-y-4 bg-gray-50 rounded-3xl p-6 h-[400px] overflow-y-auto border border-gray-100">
                {project.budgetNotes && project.budgetNotes.length > 0 ? (
                  [...project.budgetNotes].reverse().map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{note.author}</span>
                        <span className="text-[8px] font-bold text-gray-400">{note.date}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic opacity-50">
                    No hay anotaciones registradas
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-100"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;

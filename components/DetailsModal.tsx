
import React from 'react';
import { Project } from '../types';
import { X, User, Tag, Calendar, CreditCard, CheckCircle2, AlertCircle, MessageSquare, MapPin, Link } from 'lucide-react';

interface DetailsModalProps {
  project: Project;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="px-8 py-6 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <User className="w-6 h-6 text-[#669900]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase italic">Ficha Integral del Proyecto</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">ID: {project.id} • Paso Actual: {project.currentStep}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-gray-100 rounded-full hover:bg-gray-100 transition-all shadow-sm">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna 1: Datos del Cliente y Acogida */}
            <div className="space-y-6">
              <section className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Información de Acogida</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#669900]" />
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
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{project.store}</span>
                  </div>
                </div>
              </section>

              <section className="bg-green-50/30 p-6 rounded-3xl border border-green-100">
                <h4 className="text-[10px] font-black text-[#669900] uppercase tracking-[0.2em] mb-4">Servicios Seleccionados</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span>Reforma</span>
                    {project.willReform ? <CheckCircle2 className="w-4 h-4 text-[#669900]" /> : <AlertCircle className="w-4 h-4 text-gray-300" />}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span>Instalación LM</span>
                    {project.willInstall ? <CheckCircle2 className="w-4 h-4 text-[#669900]" /> : <AlertCircle className="w-4 h-4 text-gray-300" />}
                  </div>
                </div>
              </section>
            </div>

            {/* Columna 2: Presupuesto y Visita */}
            <div className="space-y-6">
              <section className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Datos Presupuesto</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Nº Presupuesto</span>
                    <span className="font-black text-gray-800">{project.budgetNumber || '---'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Importe Final</span>
                    <span className="font-black text-[#669900]">{project.totalAmount ? `${project.totalAmount.toLocaleString()} €` : '0 €'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Estado</span>
                    <span className="px-2 py-0.5 bg-white rounded-full text-[9px] font-black border uppercase">{project.status || 'En Curso'}</span>
                  </div>
                </div>
              </section>

              <section className="bg-amber-50/30 p-6 rounded-3xl border border-amber-100">
                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Cierre y Visita</h4>
                <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">WO Medición</span>
                    <span className="font-bold">{project.woMeasurement || 'Pendiente'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Instalador</span>
                    <span className="font-bold">{project.installer || 'Sin asignar'}</span>
                  </div>
                  {project.driveLink && (
                    <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 text-xs font-bold mt-2">
                      <Link className="w-3 h-3" /> CARPETA DRIVE PROYECTO
                    </a>
                  )}
                </div>
              </section>
            </div>

            {/* Columna 3: Notas de Gestión */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Notas del Presupuesto</h4>
              <div className="space-y-4 bg-gray-50 rounded-3xl p-6 h-[350px] overflow-y-auto border border-gray-100">
                {project.budgetNotes && project.budgetNotes.length > 0 ? (
                  [...project.budgetNotes].reverse().map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-blue-600 uppercase">{note.author}</span>
                        <span className="text-[8px] font-bold text-gray-400">{note.date}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic opacity-50">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
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
            Cerrar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

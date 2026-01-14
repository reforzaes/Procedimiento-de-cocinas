
import React from 'react';
import { Project } from '../types';
import { X, User, Phone, Calendar, Euro, MapPin, ClipboardList, FileText, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface DetailsModalProps {
  project: Project;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        {/* Header */}
        <div className="px-10 py-8 bg-gray-50/50 border-b flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#669900] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-[#669900]/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">{project.clientName}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border">ID: {project.id}</span>
                <span className="text-[10px] font-black text-[#669900] uppercase tracking-widest bg-[#669900]/10 px-3 py-1 rounded-full">Fase Actual: Paso {project.currentStep}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all shadow-sm">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Bloque 1: Acogida */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <ClipboardList className="w-3 h-3 text-[#669900]" /> 1. Datos Acogida
              </h4>
              <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Contacto</span>
                  <span className="text-sm font-black text-gray-700">{project.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Colaborador</span>
                  <span className="text-sm font-bold text-gray-700">{project.ldapCollaborator}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Fecha Alta</span>
                  <span className="text-sm font-bold text-gray-700">{project.receptionDate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Tienda</span>
                  <span className="text-sm font-bold text-gray-700 italic">{project.store}</span>
                </div>
              </div>
            </div>

            {/* Bloque 2: Presupuesto */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <FileText className="w-3 h-3 text-blue-500" /> 2. Presupuesto
              </h4>
              <div className="bg-blue-50/30 rounded-[2rem] p-6 space-y-4 border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Nº Presu</span>
                  <span className="text-sm font-black text-blue-600 italic">{project.budgetNumber || '---'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Importe</span>
                  <span className="text-sm font-black text-[#669900]">{project.totalAmount ? `${project.totalAmount.toLocaleString()} €` : `${project.approxBudget?.toLocaleString()} €`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase">Estado</span>
                  <span className="px-2 py-1 bg-white rounded-lg text-[8px] font-black border uppercase">{project.status || 'En Curso'}</span>
                </div>
                <div className="pt-2 border-t border-blue-100 mt-2">
                   <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Responsable Paso 2:</p>
                   <p className="text-xs font-bold text-gray-600 italic">{project.step2Collaborator}</p>
                </div>
              </div>
            </div>

            {/* Bloque 3: Cierre/Visita */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <Calendar className="w-3 h-3 text-amber-500" /> 3. Cierre y Obra
              </h4>
              <div className="bg-amber-50/30 rounded-[2rem] p-6 space-y-4 border border-amber-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-amber-400 uppercase">WO Medición</span>
                  <span className="text-sm font-black text-amber-700">{project.woMeasurement || 'Pendiente'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-amber-400 uppercase">Instalador</span>
                  <span className="text-sm font-bold text-gray-700">{project.installer || 'Sin asignar'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-amber-400 uppercase">F. Instalación</span>
                  <span className="text-sm font-bold text-gray-700">{project.installationDate || 'No agendada'}</span>
                </div>
              </div>
            </div>

            {/* Bloque 4: Notas / Seguimiento */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                <MessageSquare className="w-3 h-3 text-red-400" /> 4. Seguimiento
              </h4>
              <div className="bg-gray-50 rounded-[2rem] p-6 h-[220px] overflow-y-auto border border-gray-100">
                {project.followUpNotes ? (
                   <p className="text-xs font-medium text-gray-600 leading-relaxed italic">"{project.followUpNotes}"</p>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-30">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Sin anotaciones</span>
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200"
          >
            Cerrar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

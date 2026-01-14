
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Construction, CheckCircle2 } from 'lucide-react';

interface StepFourProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
}

const StepFour: React.FC<StepFourProps> = ({ project, projects, onUpdate }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (project?.followUpNotes) {
      setNotes(project.followUpNotes);
    }
  }, [project]);

  const handleSave = () => {
    if (project) {
      onUpdate(project.id, { followUpNotes: notes });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
      <div className="bg-amber-100 p-6 rounded-full mb-6">
        <Construction className="w-16 h-16 text-amber-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Paso 4: Seguimiento Proyecto</h2>
      <p className="text-gray-500 mb-8 text-lg max-w-md italic">Esta sección se encuentra actualmente en construcción.</p>
      
      {project ? (
        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl border shadow-sm">
          <div className="text-left mb-6">
            <h3 className="text-xl font-bold text-gray-800">{project.clientName}</h3>
            <p className="text-sm text-gray-500">Estado de instalación: <span className="text-[#669900] font-bold">Programada para {project.installationDate}</span></p>
          </div>
          
          <div className="text-left space-y-2 mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase">Notas de Seguimiento</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anota cualquier incidencia o comentario sobre el progreso de la instalación..."
              className="w-full h-40 p-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900] resize-none"
            />
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-bold"
          >
            Guardar Comentarios
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-dashed text-gray-400">
          Selecciona un proyecto finalizado del paso 3 para realizar el seguimiento
        </div>
      )}

      <div className="mt-12 w-full">
        <h3 className="text-left text-lg font-bold text-gray-800 mb-4 px-2">Proyectos en Instalación / Post-Venta</h3>
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Instalador</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha Inicio</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Seguimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">No hay proyectos en fase de seguimiento</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.installer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.installationDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#669900]" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">75%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StepFour;

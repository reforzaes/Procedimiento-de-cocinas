
import React, { useState, useEffect } from 'react';
import { Project, INSTALLERS } from '../types';
import { CheckCircle2, AlertCircle, CalendarRange, ExternalLink } from 'lucide-react';

interface StepThreeProps {
  project: Project | null;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onSelect: (id: string, step: number) => void;
}

const StepThree: React.FC<StepThreeProps> = ({ project, projects, onUpdate, onSelect }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    installer: INSTALLERS[0],
    closingDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormComplete = (data: Partial<Project>) => {
    return !!(
      data.driveLink && 
      data.closingDate && 
      data.woMeasurement && 
      data.installer && 
      data.installationDate
    );
  };

  const handleSave = () => {
    if (project) {
      const completed = isFormComplete(formData);
      onUpdate(project.id, { ...formData, step3Completed: completed });
    }
  };

  const handlePassToStepFour = () => {
    if (project && isFormComplete(formData)) {
      onUpdate(project.id, { ...formData, step3Completed: true, currentStep: 4 });
      onSelect(project.id, 4);
    }
  };

  if (!project) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
        <CalendarRange className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Selecciona un proyecto desde el buscador o el paso 2</h2>
        <p className="text-gray-500 max-w-sm mx-auto mt-2">Accede aquí una vez el presupuesto haya sido gestionado y se prepare la visita de cierre.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">3. 2ª Visita y Cierre</h2>
            <p className="text-sm text-gray-500">Proyecto: <span className="font-bold text-gray-800">{project.clientName}</span> | Presupuesto: <span className="font-bold text-[#669900]">{project.budgetNumber}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Enlace Carpeta Drive</label>
            <div className="relative">
              <input 
                type="url"
                name="driveLink"
                placeholder="https://drive.google.com/..."
                value={formData.driveLink || ''}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900]"
              />
              {formData.driveLink && (
                <a href={formData.driveLink} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Fecha Visita Cierre</label>
            <input 
              type="date"
              name="closingDate"
              value={formData.closingDate || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Nº WO Medición</label>
            <input 
              type="text"
              name="woMeasurement"
              placeholder="WO-XXXXXXX"
              value={formData.woMeasurement || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Instalador Asignado</label>
            <select 
              name="installer"
              value={formData.installer || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900]"
            >
              {INSTALLERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Fecha Instalación</label>
            <input 
              type="date"
              name="installationDate"
              value={formData.installationDate || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#669900]/20 focus:border-[#669900]"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center space-x-2 text-sm">
            {isFormComplete(formData) ? (
              <span className="flex items-center space-x-1 text-[#669900] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cierre completado</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-600 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Pendiente de datos de cierre</span>
              </span>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
            >
              Guardar Cierre
            </button>
            <button 
              onClick={handlePassToStepFour}
              disabled={!isFormComplete(formData)}
              className="px-6 py-2 bg-[#669900] text-white rounded-lg hover:bg-[#558000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              A Seguimiento
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <span>Visitas Pendientes</span>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{projects.length}</span>
        </h3>
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">WO Medición</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Instalador</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha Inst.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">No hay visitas de cierre programadas</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.woMeasurement || 'Pendiente'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.installer || 'Sin asignar'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.installationDate || 'Pendiente'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSelect(p.id, 3)}
                        className="text-[#669900] opacity-0 group-hover:opacity-100 font-bold text-sm transition-opacity"
                      >
                        Gestionar
                      </button>
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

export default StepThree;

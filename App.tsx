
import React, { useState, useEffect, useMemo } from 'react';
import { Project, Step } from './types';
import Header from './components/Header';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import Dashboard from './components/Dashboard';
import { STEP_ICONS } from './constants';
import { RefreshCw, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';

// NUEVA URL PROPORCIONADA POR EL USUARIO
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycIG428mdwrOxhd9MMee-qoPHZeguYsPFkgswAZjxh6DJazHkghYHp0bvkpa7hjykd/exec'; 

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeStep, setActiveStep] = useState<Step>(Step.ACOGIDA);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lm-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
    fetchDataFromSheets();
  }, []);

  const fetchDataFromSheets = async () => {
    if (!APPS_SCRIPT_URL) return;
    setIsSyncing(true);
    setAuthError(false);
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) setAuthError(true);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const remoteData = await response.json();
      if (Array.isArray(remoteData)) {
        setProjects(remoteData);
        localStorage.setItem('lm-projects', JSON.stringify(remoteData));
        showSyncSuccess();
      }
    } catch (error) {
      console.error("Error fetching from Sheets:", error);
      setAuthError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const showSyncSuccess = () => {
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const syncProjectToSheets = async (project: Project) => {
    if (!APPS_SCRIPT_URL) return;
    try {
      // Enviamos como text/plain para evitar problemas de CORS pre-flight
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(project),
      });
      showSyncSuccess();
    } catch (error) {
      console.error("Error syncing to Sheets:", error);
    }
  };

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('lm-projects', JSON.stringify(updated));
  };

  const handleProjectSelect = (id: string, step: number) => {
    setSelectedProjectId(id);
    setActiveStep(step as Step);
  };

  const currentProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || null
  , [projects, selectedProjectId]);

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const newProj = { ...p, ...updates };
        syncProjectToSheets(newProj);
        return newProj;
      }
      return p;
    });
    saveProjects(updated);
  };

  const createProject = (newProject: Project) => {
    const updated = [...projects, newProject];
    saveProjects(updated);
    syncProjectToSheets(newProject);
    setSelectedProjectId(newProject.id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header projects={projects} onSelectProject={handleProjectSelect} />

      <nav className="bg-white border-b shadow-sm sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { id: Step.ACOGIDA, label: 'Paso 1: Acogida' },
              { id: Step.PRESUPUESTO, label: 'Paso 2: Presupuesto' },
              { id: Step.VISITA, label: 'Paso 3: 2ª Visita' },
              { id: Step.SEGUIMIENTO, label: 'Paso 4: Seguimiento' },
              { id: Step.DASHBOARD, label: 'Dashboard' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  activeStep === tab.id 
                    ? 'border-[#669900] text-[#669900]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {STEP_ICONS[tab.id as keyof typeof STEP_ICONS]}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {syncSuccess && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-[#669900] bg-green-50 px-3 py-1 rounded-full border border-green-100 animate-fade-in">
                <CheckCircle2 className="w-3 h-3" /> DATOS SINCRONIZADOS
              </div>
            )}
            {authError && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> REVISA ACCESO AL EXCEL
              </div>
            )}
            <button 
              onClick={fetchDataFromSheets}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-[#669900] hover:bg-green-100'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'ACTUALIZANDO...' : 'SINCRONIZAR'}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in">
        {activeStep === Step.ACOGIDA && (
          <StepOne 
            project={currentProject} 
            projects={projects.filter(p => p.currentStep === 1)}
            onUpdate={updateProject}
            onCreate={createProject}
            onSelect={handleProjectSelect}
          />
        )}
        {activeStep === Step.PRESUPUESTO && (
          <StepTwo 
            project={currentProject} 
            projects={projects.filter(p => p.currentStep === 2)}
            onUpdate={updateProject}
            onSelect={handleProjectSelect}
          />
        )}
        {activeStep === Step.VISITA && (
          <StepThree 
            project={currentProject} 
            projects={projects.filter(p => p.currentStep === 3)}
            onUpdate={updateProject}
            onSelect={handleProjectSelect}
          />
        )}
        {activeStep === Step.SEGUIMIENTO && (
          <StepFour 
            project={currentProject} 
            projects={projects.filter(p => p.currentStep === 4)}
            onUpdate={updateProject}
          />
        )}
        {activeStep === Step.DASHBOARD && (
          <Dashboard projects={projects} />
        )}
      </main>
    </div>
  );
};

export default App;

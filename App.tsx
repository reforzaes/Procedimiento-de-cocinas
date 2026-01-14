
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, Step } from './types';
import Header from './components/Header';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import Dashboard from './components/Dashboard';
import { STEP_ICONS } from './constants';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycIG428mdwrOxhd9MMee-qoPHZeguYsPFkgswAZjxh6DJazHkghYHp0bvkpa7hjykd/exec'; 

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeStep, setActiveStep] = useState<Step>(Step.ACOGIDA);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Filtros Globales de Cabecera
  const [filterCollab, setFilterCollab] = useState<string>('all');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('lm-projects');
    if (saved) setProjects(JSON.parse(saved));
    fetchDataFromSheets();
  }, []);

  const fetchDataFromSheets = async () => {
    if (!APPS_SCRIPT_URL) return;
    setIsSyncing(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      if (!response.ok) throw new Error('Error al leer datos');
      const remoteData = await response.json();
      if (Array.isArray(remoteData)) {
        setProjects(remoteData);
        localStorage.setItem('lm-projects', JSON.stringify(remoteData));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToSheets = useCallback(async (project: Project) => {
    setSyncStatus('saving');
    try {
      // Preparamos el objeto para que coincida exactamente con las columnas de Excel
      // Convertimos arrays a strings para evitar problemas en Sheets
      const payload = {
        ...project,
        budgetNotes: project.budgetNotes ? JSON.stringify(project.budgetNotes) : ''
      };

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncStatus('error');
    }
  }, []);

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const newProj = { ...p, ...updates };
          syncToSheets(newProj);
          return newProj;
        }
        return p;
      });
      localStorage.setItem('lm-projects', JSON.stringify(updated));
      return updated;
    });
  };

  const createProject = (newProject: Project) => {
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('lm-projects', JSON.stringify(updated));
    syncToSheets(newProject);
    setSelectedProjectId(null); 
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCollab = filterCollab === 'all' || p.ldapCollaborator === filterCollab || p.step2Collaborator === filterCollab;
      const date = new Date(p.receptionDate);
      const start = filterStart ? new Date(filterStart) : null;
      const end = filterEnd ? new Date(filterEnd) : null;
      const matchDate = (!start || date >= start) && (!end || date <= end);
      return matchCollab && matchDate;
    });
  }, [projects, filterCollab, filterStart, filterEnd]);

  const currentProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || null
  , [projects, selectedProjectId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header 
        projects={projects} 
        onSelectProject={(id, step) => { setSelectedProjectId(id); setActiveStep(step); }}
        filterCollab={filterCollab}
        setFilterCollab={setFilterCollab}
        filterStart={filterStart}
        setFilterStart={setFilterStart}
        filterEnd={filterEnd}
        setFilterEnd={setFilterEnd}
      />

      <nav className="bg-white border-b shadow-sm sticky top-[130px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { id: Step.ACOGIDA, label: '1. Acogida' },
              { id: Step.PRESUPUESTO, label: '2. Presupuesto' },
              { id: Step.VISITA, label: '3. 2ª Visita' },
              { id: Step.SEGUIMIENTO, label: '4. Seguimiento' },
              { id: Step.DASHBOARD, label: 'Dashboard' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveStep(tab.id); setSelectedProjectId(null); }}
                className={`flex items-center space-x-2 py-4 border-b-2 font-black transition-all whitespace-nowrap text-xs md:text-sm uppercase tracking-tighter italic ${
                  activeStep === tab.id 
                    ? 'border-[#669900] text-[#669900]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {STEP_ICONS[tab.id as keyof typeof STEP_ICONS]}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {syncStatus === 'saving' && <span className="text-[9px] font-black text-blue-500 animate-pulse uppercase">Guardando...</span>}
            {syncStatus === 'success' && <span className="text-[9px] font-black text-[#669900] flex items-center gap-1 uppercase"><CheckCircle2 className="w-3 h-3"/> Excel OK</span>}
            <button 
              onClick={fetchDataFromSheets}
              disabled={isSyncing}
              title="Actualizar desde Google Sheets"
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-[#669900] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in">
        {activeStep === Step.ACOGIDA && (
          <StepOne 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep >= 1)}
            onUpdate={updateProject}
            onCreate={createProject}
            onSelect={(id) => setSelectedProjectId(id)}
          />
        )}
        {activeStep === Step.PRESUPUESTO && (
          <StepTwo 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep >= 2)}
            onUpdate={updateProject}
            onCreate={createProject}
            onSelect={(id) => setSelectedProjectId(id)}
          />
        )}
        {activeStep === Step.VISITA && (
          <StepThree 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep >= 3)}
            onUpdate={updateProject}
            onSelect={(id) => setSelectedProjectId(id)}
          />
        )}
        {activeStep === Step.SEGUIMIENTO && (
          <StepFour 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep >= 4)}
            onUpdate={updateProject}
            onSelect={(id) => setSelectedProjectId(id)}
          />
        )}
        {activeStep === Step.DASHBOARD && (
          <Dashboard projects={filteredProjects} />
        )}
      </main>
    </div>
  );
};

export default App;

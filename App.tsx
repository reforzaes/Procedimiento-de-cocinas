
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
        // Normalizamos datos para que funcionen con la lógica de la app
        const parsedData = remoteData.map((p: any) => ({
          ...p,
          willReform: p.willReform === 'TRUE' || p.willReform === true,
          willInstall: p.willInstall === 'TRUE' || p.willInstall === true,
          handDrawnPlan: p.handDrawnPlan === 'TRUE' || p.handDrawnPlan === true,
          measurementSent: p.measurementSent === 'TRUE' || p.measurementSent === true,
          budgetNotes: typeof p.budgetNotes === 'string' && p.budgetNotes ? JSON.parse(p.budgetNotes) : (p.budgetNotes || [])
        }));
        setProjects(parsedData);
        localStorage.setItem('lm-projects', JSON.stringify(parsedData));
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
      // Estructura EXACTA de 26 campos según tu definición
      const payload = {
        id: project.id,
        currentStep: project.currentStep,
        ldapCollaborator: project.ldapCollaborator,
        store: project.store,
        receptionDate: project.receptionDate,
        clientName: project.clientName,
        phone: project.phone,
        kitchenDatePrediction: project.kitchenDatePrediction,
        approxBudget: project.approxBudget,
        willReform: project.willReform ? 'TRUE' : 'FALSE',
        willInstall: project.willInstall ? 'TRUE' : 'FALSE',
        step2Collaborator: project.step2Collaborator,
        budgetNumber: project.budgetNumber || '',
        budgetDate: project.budgetDate || '',
        budgetType: project.budgetType || '',
        status: project.status || 'En Curso',
        totalAmount: project.totalAmount || 0,
        handDrawnPlan: project.handDrawnPlan ? 'TRUE' : 'FALSE',
        measurementSent: project.measurementSent ? 'TRUE' : 'FALSE',
        budgetNotes: project.budgetNotes ? JSON.stringify(project.budgetNotes) : '[]',
        driveLink: project.driveLink || '',
        closingDate: project.closingDate || '',
        woMeasurement: project.woMeasurement || '',
        installer: project.installer || '',
        installationDate: project.installationDate || '',
        followUpNotes: project.followUpNotes || ''
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

      <nav className="bg-white border-b shadow-sm sticky top-[125px] z-40 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-1 items-stretch">
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
                className={`flex-1 flex items-center justify-center space-x-3 py-6 border-b-2 font-black transition-all whitespace-nowrap text-xs md:text-sm uppercase tracking-tighter italic border-r last:border-r-0 ${
                  activeStep === tab.id 
                    ? 'border-[#669900] text-[#669900] bg-green-50/50' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {STEP_ICONS[tab.id as keyof typeof STEP_ICONS]}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 px-6 border-l h-14">
             {syncStatus === 'saving' && <span className="text-[9px] font-black text-blue-500 animate-pulse">SINC...</span>}
             {syncStatus === 'success' && <span className="text-[9px] font-black text-[#669900]"><CheckCircle2 className="w-3 h-3 inline mr-1"/>OK</span>}
             <button onClick={fetchDataFromSheets} disabled={isSyncing} className="p-2 rounded-xl bg-gray-100 text-gray-400 hover:text-[#669900] transition-all">
               <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {activeStep === Step.ACOGIDA && (
          <StepOne 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep === 1)}
            onUpdate={updateProject}
            onCreate={createProject}
            onSelect={(id) => setSelectedProjectId(id)}
            onStepChange={setActiveStep}
          />
        )}
        {activeStep === Step.PRESUPUESTO && (
          <StepTwo 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep === 2)}
            onUpdate={updateProject}
            onCreate={createProject}
            onSelect={(id) => setSelectedProjectId(id)}
            onStepChange={setActiveStep}
          />
        )}
        {activeStep === Step.VISITA && (
          <StepThree 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep === 3)}
            onUpdate={updateProject}
            onSelect={(id) => setSelectedProjectId(id)}
            onStepChange={setActiveStep}
          />
        )}
        {activeStep === Step.SEGUIMIENTO && (
          <StepFour 
            project={currentProject} 
            projects={filteredProjects.filter(p => p.currentStep === 4)}
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

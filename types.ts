
export enum Step {
  ACOGIDA = 1,
  PRESUPUESTO = 2,
  VISITA = 3,
  SEGUIMIENTO = 4,
  DASHBOARD = 5
}

export type ProjectStatus = 'En Curso' | 'Gestionando' | 'Gestionado' | 'Anulado';

export interface BudgetNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface Project {
  id: string;
  currentStep: number;
  
  // Step 1: Acogida
  ldapCollaborator: string;
  store: string;
  receptionDate: string;
  clientName: string;
  kitchenDatePrediction: string;
  willReform: boolean;
  willInstall: boolean;
  approxBudget: number;
  phone: string;
  step2Collaborator: string;
  step1Completed: boolean;

  // Step 2: Presupuesto
  budgetNumber?: string;
  budgetDate?: string;
  budgetType?: string;
  status?: ProjectStatus;
  totalAmount?: number;
  handDrawnPlan?: boolean;
  measurementSent?: boolean;
  budgetNotes?: BudgetNote[];
  step2Completed: boolean;

  // Step 3: 2nd Visita
  driveLink?: string;
  closingDate?: string;
  woMeasurement?: string;
  installer?: string;
  installationDate?: string;
  step3Completed: boolean;

  // Step 4: Seguimiento
  followUpNotes?: string;
}

export const COLLABORATORS = [
  "30000001 Silvia",
  "30000002 Dani",
  "30000003 Laura",
  "30000004 Maybeth",
  "30000005 Raquel",
  "30000006 Jorge"
];

export const STORES = [
  "047 Gandia",
  "001 Tienda B"
];

export const INSTALLERS = [
  "Instalador A",
  "Instalador B",
  "Instalador C"
];

export const STATUS_OPTIONS: ProjectStatus[] = [
  'En Curso',
  'Gestionando',
  'Gestionado',
  'Anulado'
];

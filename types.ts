
export enum Step {
  ACOGIDA = 1,
  PRESUPUESTO = 2,
  VISITA = 3,
  SEGUIMIENTO = 4,
  DASHBOARD = 5
}

export type ProjectStatus = 'En Curso' | 'Gestionando' | 'Gestionado' | 'Anulado';

export interface Project {
  // Columnas 1-26 para Excel
  id: string;                               // 1
  currentStep: number;                      // 2
  ldapCollaborator: string;                 // 3
  store: string;                            // 4
  receptionDate: string;                    // 5
  clientName: string;                       // 6
  phone: string;                            // 7
  kitchenDatePrediction: string;            // 8: Fecha aprox Instalación (P1)
  approxBudget: number;                     // 9: Presupuesto aprox (P1)
  willReform: boolean | string;             // 10
  willInstall: boolean | string;            // 11
  step2Collaborator: string;                // 12
  budgetNumber: string;                     // 13
  budgetDate: string;                       // 14
  budgetType: string;                       // 15
  status: ProjectStatus;                    // 16
  totalAmount: number;                      // 17
  handDrawnPlan: boolean | string;          // 18
  measurementSent: boolean | string;        // 19
  budgetNotes: string;                      // 20: Observaciones Generales
  driveLink: string;                        // 21
  closingDate: string;                      // 22
  woMeasurement: string;                    // 23
  installer: string;                        // 24
  installationDate: string;                 // 25
  followUpNotes: string;                    // 26: Seguimiento Final
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

export const STATUS_OPTIONS: ProjectStatus[] = [
  'En Curso',
  'Gestionando',
  'Gestionado',
  'Anulado'
];

export const INSTALLERS = [
  "Instalador A",
  "Instalador B",
  "Instalador C"
];

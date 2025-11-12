import { Tab, EmployeeData, ContractType } from './types';

export const TABS = [
  { id: Tab.DATA_INPUT, label: 'Entrada de Datos' },
  { id: Tab.COST_SUMMARY, label: 'Resumen de Costes' },
  { id: Tab.ANNUAL_COMPARISON, label: 'Comparativa Visual' },
];

// Options for the economic activity dropdown, mapping to AT/EP contribution rates
export const CNAE_RISK_OPTIONS = [
    { value: '0.0150', label: 'Oficinas, Despachos, Educación (Ej: CNAE 82, 85)' },
    { value: '0.0180', label: 'Comercio Minorista no Alimenticio (Ej: CNAE 47)' },
    { value: '0.0220', label: 'Hostelería y Restauración (Ej: CNAE 56)' },
    { value: '0.0360', label: 'Transporte y Almacenamiento (Ej: CNAE 49)' },
    { value: '0.0670', label: 'Construcción y Agricultura (Ej: CNAE 41, 01)' },
];

const initialGrossAnnualSalary = 30000;
const initialNumberOfPayments = 12;

export const INITIAL_EMPLOYEE_DATA: EmployeeData = {
  grossAnnualSalary: initialGrossAnnualSalary,
  monthlySalary: initialGrossAnnualSalary / initialNumberOfPayments,
  contractType: ContractType.PERMANENT,
  riskLevel: CNAE_RISK_OPTIONS[0].value, // Default to lowest risk
  numberOfPayments: initialNumberOfPayments as 12 | 14,
  contributionGroup: 1,
  irpfPercentage: 15,
};

export const CONTRIBUTION_GROUP_OPTIONS = [
    { value: 1, label: 'Grupo 1: Ingenieros y Licenciados' },
    { value: 2, label: 'Grupo 2: Ing. Técnicos, Peritos y Ayudantes Titulados' },
    { value: 3, label: 'Grupo 3: Jefes Administrativos y de Taller' },
    { value: 4, label: 'Grupo 4: Ayudantes no Titulados' },
    { value: 5, label: 'Grupo 5: Oficiales Administrativos' },
    { value: 6, label: 'Grupo 6: Subalternos' },
    { value: 7, label: 'Grupo 7: Auxiliares Administrativos' },
    { value: 8, label: 'Grupo 8: Oficiales de Primera y Segunda' },
    { value: 9, label: 'Grupo 9: Oficiales de Tercera y Especialistas' },
    { value: 10, label: 'Grupo 10: Peones' },
    { value: 11, label: 'Grupo 11: Trabajadores menores de 18 años' },
];

// Simplified rates for 2024. These are for demonstration purposes.
export const SPAIN_PAYROLL_CONSTANTS = {
  CONTRIBUTION_BASES: { // Annualized for 2024
    1: { min: 22168.80, max: 56646.00 },
    2: { min: 18385.20, max: 56646.00 },
    3: { min: 15994.80, max: 56646.00 },
    4: { min: 15876.00, max: 56646.00 },
    5: { min: 15876.00, max: 56646.00 },
    6: { min: 15876.00, max: 56646.00 },
    7: { min: 15876.00, max: 56646.00 },
    8: { min: 15876.00, max: 56646.00 },
    9: { min: 15876.00, max: 56646.00 },
    10: { min: 15876.00, max: 56646.00 },
    11: { min: 15876.00, max: 56646.00 },
  },
  EMPLOYER_CONTRIBUTIONS: {
    COMMON_CONTINGENCIES: 0.2360,
    UNEMPLOYMENT: {
      [ContractType.PERMANENT]: 0.0550,
      [ContractType.TEMPORARY]: 0.0670,
    },
    PROFESSIONAL_TRAINING: 0.0060,
    FOGASA: 0.0020,
    MEI: 0.0058, // Mecanismo de Equidad Intergeneracional
    // WORK_ACCIDENTS is now based on CNAE and passed directly from the form
  },
  EMPLOYEE_DEDUCTIONS: {
    COMMON_CONTINGENCIES: 0.0470,
    UNEMPLOYMENT: {
      [ContractType.PERMANENT]: 0.0155,
      [ContractType.TEMPORARY]: 0.0160,
    },
    PROFESSIONAL_TRAINING: 0.0010,
    MEI: 0.0012, // Mecanismo de Equidad Intergeneracional
  }
};

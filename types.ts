export enum Tab {
  DATA_INPUT = 'Entrada de Datos',
  COST_SUMMARY = 'Resumen de Costes',
  ANNUAL_COMPARISON = 'Comparativa Visual',
}

export enum ContractType {
  PERMANENT = 'indefinido',
  TEMPORARY = 'temporal',
}

export interface EmployeeData {
  grossAnnualSalary: number;
  monthlySalary: number;
  contractType: ContractType;
  riskLevel: string; // Now a string to hold the contribution rate directly
  numberOfPayments: 12 | 14;
  contributionGroup: number;
  irpfPercentage: number;
}

export interface CostSummary {
  grossAnnualSalary: number;
  netAnnualSalary: number;
  totalEmployerCost: number;
  totalEmployerContributions: number;
  breakdown: {
    employer: {
      commonContingencies: number;
      unemployment: number;
      professionalTraining: number;
      fogasa: number;
      workAccidents: number;
      mei: number;
    };
    employee: {
      commonContingencies: number;
      unemployment: number;
      professionalTraining: number;
      mei: number;
      irpf: number;
    };
  };
}

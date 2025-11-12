
import React, { useState, useCallback } from 'react';
import { Tab, EmployeeData, CostSummary } from './types';
import { TABS, INITIAL_EMPLOYEE_DATA, SPAIN_PAYROLL_CONSTANTS } from './constants';
import DataInputForm from './components/DataInputForm';
import CostSummaryDisplay from './components/CostSummaryDisplay';
import AnnualComparison from './components/AnnualComparison';
import Tabs from './components/ui/Tabs';
import InstructionsModal from './components/InstructionsModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DATA_INPUT);
  const [employeeData, setEmployeeData] = useState<EmployeeData>(INITIAL_EMPLOYEE_DATA);
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const calculateTotalCost = useCallback((data: EmployeeData): CostSummary => {
    const grossAnnualSalary = data.grossAnnualSalary;
    
    const ER_RATES = SPAIN_PAYROLL_CONSTANTS.EMPLOYER_CONTRIBUTIONS;
    const EE_RATES = SPAIN_PAYROLL_CONSTANTS.EMPLOYEE_DEDUCTIONS;

    const groupBases = SPAIN_PAYROLL_CONSTANTS.CONTRIBUTION_BASES[data.contributionGroup as keyof typeof SPAIN_PAYROLL_CONSTANTS.CONTRIBUTION_BASES] 
      || SPAIN_PAYROLL_CONSTANTS.CONTRIBUTION_BASES[7];

    const contributionBase = Math.min(
        Math.max(grossAnnualSalary, groupBases.min), 
        groupBases.max
    );

    // Employer Costs
    const commonContingenciesER = contributionBase * ER_RATES.COMMON_CONTINGENCIES;
    const unemploymentER = contributionBase * ER_RATES.UNEMPLOYMENT[data.contractType];
    const trainingER = contributionBase * ER_RATES.PROFESSIONAL_TRAINING;
    const fogasaER = contributionBase * ER_RATES.FOGASA;
    const accidentsER = contributionBase * Number(data.riskLevel);
    const meiER = contributionBase * ER_RATES.MEI;
    
    const totalEmployerContributions = commonContingenciesER + unemploymentER + trainingER + fogasaER + accidentsER + meiER;
    const totalEmployerCost = grossAnnualSalary + totalEmployerContributions;

    // Employee Deductions (for net salary calculation)
    const commonContingenciesEE = contributionBase * EE_RATES.COMMON_CONTINGENCIES;
    const unemploymentEE = contributionBase * EE_RATES.UNEMPLOYMENT[data.contractType];
    const trainingEE = contributionBase * EE_RATES.PROFESSIONAL_TRAINING;
    const meiEE = contributionBase * EE_RATES.MEI;
    const totalEmployeeContributions = commonContingenciesEE + unemploymentEE + trainingEE + meiEE;

    // IRPF based on user input
    const irpfDeduction = grossAnnualSalary * (data.irpfPercentage / 100);

    const totalDeductions = totalEmployeeContributions + irpfDeduction;
    const netAnnualSalary = grossAnnualSalary - totalDeductions;
    
    return {
      grossAnnualSalary,
      netAnnualSalary,
      totalEmployerCost,
      totalEmployerContributions,
      breakdown: {
        employer: {
          commonContingencies: commonContingenciesER,
          unemployment: unemploymentER,
          professionalTraining: trainingER,
          fogasa: fogasaER,
          workAccidents: accidentsER,
          mei: meiER,
        },
        employee: {
          commonContingencies: commonContingenciesEE,
          unemployment: unemploymentEE,
          professionalTraining: trainingEE,
          mei: meiEE,
          irpf: irpfDeduction,
        }
      }
    };
  }, []);

  const handleCalculate = (data: EmployeeData) => {
    const summary = calculateTotalCost(data);
    setCostSummary(summary);
    setEmployeeData(data);
    setActiveTab(Tab.COST_SUMMARY);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case Tab.DATA_INPUT:
        return <DataInputForm initialData={employeeData} onCalculate={handleCalculate} />;
      case Tab.COST_SUMMARY:
        return costSummary ? <CostSummaryDisplay summary={costSummary} employeeData={employeeData} /> : <div className="text-center p-8">Por favor, introduce los datos primero para ver el resumen.</div>;
      case Tab.ANNUAL_COMPARISON:
        return costSummary ? <AnnualComparison summary={costSummary} /> : <div className="text-center p-8">Por favor, introduce los datos primero para ver la comparativa.</div>;
      default:
        return <DataInputForm initialData={employeeData} onCalculate={handleCalculate} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de Coste Salarial Total</h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">Estima el coste total de un empleado según la legislación de España.</p>
            </div>
            <button
              onClick={() => setShowInstructions(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instrucciones
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-2 bg-white rounded-b-lg shadow-lg overflow-hidden">
          {renderContent()}
        </div>
      </main>
      
      <footer className="text-center py-4 mt-8">
        <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} - Diseñado por un experto en Gemini. Los cálculos son una estimación.</p>
      </footer>
    </div>
  );
};

export default App;

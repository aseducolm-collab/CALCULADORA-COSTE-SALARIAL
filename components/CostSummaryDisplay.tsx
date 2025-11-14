import React from 'react';
import { CostSummary, EmployeeData } from '../types';
import Card from './ui/Card';
import PdfDownloader from './PdfDownloader';

interface CostSummaryDisplayProps {
  summary: CostSummary;
  employeeData: EmployeeData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const CostSummaryDisplay: React.FC<CostSummaryDisplayProps> = ({ summary, employeeData }) => {
  const { breakdown, totalEmployerCost, grossAnnualSalary, netAnnualSalary, totalEmployerContributions } = summary;
  const { numberOfPayments } = employeeData;

  const monthlyTotalCost = totalEmployerCost / numberOfPayments;
  const monthlyGrossSalary = grossAnnualSalary / numberOfPayments;
  const monthlyNetSalary = netAnnualSalary / numberOfPayments;

  return (
    <div className="p-6 md:p-8 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Coste Total Anual para la Empresa</h3>
              <p className="mt-2 text-5xl font-bold text-indigo-600 tracking-tight">{formatCurrency(totalEmployerCost)}</p>
            </div>
          </Card>
           <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Coste Total Mensual para la Empresa</h3>
              <p className="mt-2 text-5xl font-bold text-indigo-500 tracking-tight">{formatCurrency(monthlyTotalCost)}</p>
            </div>
          </Card>
        </div>

        <Card title="Desglose del Coste Empresa (Anual)">
          <ul className="space-y-3">
            <li className="flex justify-between"><span>Salario Bruto Anual</span> <span className="font-medium">{formatCurrency(grossAnnualSalary)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>├ Contingencias Comunes</span> <span>{formatCurrency(breakdown.employer.commonContingencies)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>├ Desempleo</span> <span>{formatCurrency(breakdown.employer.unemployment)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>├ Formación Profesional</span> <span>{formatCurrency(breakdown.employer.professionalTraining)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>├ FOGASA</span> <span>{formatCurrency(breakdown.employer.fogasa)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>├ AT y EP</span> <span>{formatCurrency(breakdown.employer.workAccidents)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200"><span>└ MEI (0.58%)</span> <span>{formatCurrency(breakdown.employer.mei)}</span></li>
            <li className="flex justify-between font-semibold border-t pt-2 mt-2"><span>Total Cargas Sociales</span> <span>{formatCurrency(totalEmployerContributions)}</span></li>
          </ul>
        </Card>

        <Card title="Salario del Trabajador">
           <h4 className="font-semibold text-gray-800 mb-2">Resumen Anual</h4>
          <ul className="space-y-3 mb-6">
            <li className="flex justify-between"><span>Salario Bruto Anual</span> <span className="font-medium">{formatCurrency(grossAnnualSalary)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>├ S.S. (Conting. + Desempleo + FP)</span> <span>- {formatCurrency(breakdown.employee.commonContingencies + breakdown.employee.unemployment + breakdown.employee.professionalTraining)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>├ MEI (0.12%)</span> <span>- {formatCurrency(breakdown.employee.mei)}</span></li>
            <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>└ IRPF (Estimado)</span> <span>- {formatCurrency(breakdown.employee.irpf)}</span></li>
            <li className="flex justify-between font-semibold border-t pt-2 mt-2 text-green-700"><span>Salario Neto Anual (Estimado)</span> <span>{formatCurrency(netAnnualSalary)}</span></li>
          </ul>

          <h4 className="font-semibold text-gray-800 mb-2 border-t pt-4">Desglose Mensual (en {numberOfPayments} pagas)</h4>
            <ul className="space-y-3">
              <li className="flex justify-between"><span>Salario Bruto Mensual</span> <span className="font-medium">{formatCurrency(monthlyGrossSalary)}</span></li>
              <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>├ S.S. (Conting. + Desempleo + FP)</span> <span>- {formatCurrency((breakdown.employee.commonContingencies + breakdown.employee.unemployment + breakdown.employee.professionalTraining) / numberOfPayments)}</span></li>
              <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>├ MEI (0.12%)</span> <span>- {formatCurrency(breakdown.employee.mei / numberOfPayments)}</span></li>
              <li className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-red-200"><span>└ IRPF (Estimado)</span> <span>- {formatCurrency(breakdown.employee.irpf / numberOfPayments)}</span></li>
              <li className="flex justify-between font-semibold border-t pt-2 mt-2 text-green-700"><span>Salario Neto Mensual (Estimado)</span> <span>{formatCurrency(monthlyNetSalary)}</span></li>
            </ul>

          <p className="mt-4 text-xs text-gray-500 italic">La retención de IRPF es una estimación simplificada y no considera la situación personal (estado civil, hijos, etc.).</p>
        </Card>

        <div className="lg:col-span-1">
          <PdfDownloader summary={summary} employeeData={employeeData} />
        </div>

      </div>
    </div>
  );
};

export default CostSummaryDisplay;
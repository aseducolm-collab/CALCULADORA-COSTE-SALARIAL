
import jsPDF from 'jspdf';
import { CostSummary, EmployeeData } from '../types';

// Se crea una función de formato de moneda segura para PDF para evitar problemas con el símbolo € en las fuentes predeterminadas.
const formatCurrencyForPDF = (value: number) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace('€', 'EUR');
};

export const downloadCostSummaryPDF = (summary: CostSummary, employeeData: EmployeeData) => {
  const doc = new jsPDF();
  const { 
    grossAnnualSalary, 
    netAnnualSalary, 
    totalEmployerCost, 
    totalEmployerContributions, 
    breakdown 
  } = summary;
  const { numberOfPayments } = employeeData;
  
  const margin = 15;
  let yPos = 20;

  // Encabezado
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen de Coste Salarial Anual', margin, yPos);
  yPos += 15;

  // Resumen Principal
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Coste Total Anual para la Empresa:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrencyForPDF(totalEmployerCost), 120, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(`Salario Bruto Anual:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrencyForPDF(grossAnnualSalary), 120, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  doc.text(`Salario Neto Anual (Estimado):`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrencyForPDF(netAnnualSalary), 120, yPos);
  yPos += 10;
  
  // Separador de línea
  doc.setDrawColor(200);
  doc.line(margin, yPos, 195, yPos);
  yPos += 10;

  // Desglose de Costes del Empleador
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose del Coste Empresa (Anual)', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const employerItems = [
    { label: 'Salario Bruto Anual', value: grossAnnualSalary },
    // Se reemplazaron los caracteres de dibujo de cajas y las tildes por alternativas seguras en ASCII
    { label: '  - Contingencias Comunes', value: breakdown.employer.commonContingencies },
    { label: '  - Desempleo', value: breakdown.employer.unemployment },
    { label: '  - Formacion Profesional', value: breakdown.employer.professionalTraining },
    { label: '  - FOGASA', value: breakdown.employer.fogasa },
    { label: '  - AT y EP', value: breakdown.employer.workAccidents },
    { label: '  - MEI (0.58%)', value: breakdown.employer.mei },
    { label: 'Total Cargas Sociales', value: totalEmployerContributions, isBold: true },
  ];

  employerItems.forEach(item => {
    doc.setFont('helvetica', item.isBold ? 'bold' : 'normal');
    doc.text(item.label, margin, yPos);
    doc.text(formatCurrencyForPDF(item.value), 120, yPos);
    yPos += 6;
  });
  
  yPos += 5;

  // Desglose del Salario del Trabajador
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose Salario del Trabajador (Anual)', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const employeeTotalContributions = breakdown.employee.commonContingencies + breakdown.employee.unemployment + breakdown.employee.professionalTraining;
  const totalDeductions = employeeTotalContributions + breakdown.employee.mei + breakdown.employee.irpf;

  const employeeItems = [
    { label: 'Salario Bruto Anual', value: grossAnnualSalary },
    { label: '  - S.S. (Conting. + Desempleo + FP)', value: -employeeTotalContributions },
    { label: '  - MEI (0.12%)', value: -breakdown.employee.mei },
    { label: '  - IRPF (Estimado)', value: -breakdown.employee.irpf },
    { label: 'Total Deducciones', value: -totalDeductions, isBold: true },
    { label: 'Salario Neto Anual (Estimado)', value: netAnnualSalary, isBold: true, isTotal: true },
  ];

  employeeItems.forEach(item => {
    if (item.isTotal) doc.setTextColor(34, 139, 34); // Color verde para el salario neto
    doc.setFont('helvetica', item.isBold ? 'bold' : 'normal');
    doc.text(item.label, margin, yPos);
    doc.text(formatCurrencyForPDF(item.value), 120, yPos);
    yPos += 6;
    if (item.isTotal) doc.setTextColor(0); // Restablecer color
  });
  
  yPos += 5;
  
  // Separador de línea
  doc.setDrawColor(200);
  doc.line(margin, yPos, 195, yPos);
  yPos += 10;

  // Desglose Mensual
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Desglose Mensual Estimado (en ${numberOfPayments} pagas)`, margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const monthlyTotalEmployerCost = totalEmployerCost / numberOfPayments;

  const monthlyItems = [
    { label: 'Coste Total Empresa Mensual', value: monthlyTotalEmployerCost },
    { label: 'Salario Bruto Mensual', value: grossAnnualSalary / numberOfPayments },
    { label: 'Total Deducciones Mensuales', value: -(totalDeductions / numberOfPayments) },
    { label: 'Salario Neto Mensual (Estimado)', value: netAnnualSalary / numberOfPayments, isBold: true, isTotal: true },
  ];

  monthlyItems.forEach(item => {
    if (item.isTotal) doc.setTextColor(34, 139, 34); // Color verde para el salario neto
    doc.setFont('helvetica', item.isBold ? 'bold' : 'normal');
    doc.text(item.label, margin, yPos);
    doc.text(formatCurrencyForPDF(item.value), 120, yPos);
    yPos += 6;
    if (item.isTotal) doc.setTextColor(0); // Restablecer color
  });
  
  yPos += 10;

  // Nota al pie de página
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  // Se actualizó la nota para reflejar la entrada del usuario
  doc.text('La retencion de IRPF se calcula segun el porcentaje introducido. El calculo global es una estimacion.', margin, yPos);

  doc.save('resumen-coste-salarial.pdf');
};

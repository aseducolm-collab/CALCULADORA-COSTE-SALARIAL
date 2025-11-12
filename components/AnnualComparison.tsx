
import React from 'react';
import { CostSummary } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './ui/Card';

interface AnnualComparisonProps {
  summary: CostSummary;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-indigo-600">{`${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const AnnualComparison: React.FC<AnnualComparisonProps> = ({ summary }) => {
  const data = [
    { name: 'Salario Bruto', value: summary.grossAnnualSalary },
    { name: 'Cargas Sociales Empresa', value: summary.totalEmployerContributions },
  ];
  const COLORS = ['#4f46e5', '#a5b4fc'];

  return (
    <div className="p-6 md:p-8">
      <Card title="Comparativa Visual del Coste Total Anual">
        <p className="text-center text-gray-600 mb-6">Desglose del coste total de la empresa: {formatCurrency(summary.totalEmployerCost)}</p>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnnualComparison;

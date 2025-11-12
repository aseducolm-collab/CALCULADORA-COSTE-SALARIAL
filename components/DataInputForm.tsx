
import React, { useState, useEffect } from 'react';
import { EmployeeData, ContractType } from '../types';
import { CONTRIBUTION_GROUP_OPTIONS, CNAE_RISK_OPTIONS } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface DataInputFormProps {
  initialData: EmployeeData;
  onCalculate: (data: EmployeeData) => void;
}

const DataInputForm: React.FC<DataInputFormProps> = ({ initialData, onCalculate }) => {
  const [formData, setFormData] = useState<EmployeeData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [salaryMode, setSalaryMode] = useState<'annual' | 'monthly'>('annual');

  useEffect(() => {
    if (salaryMode === 'monthly') {
      setFormData(prev => ({
        ...prev,
        grossAnnualSalary: prev.monthlySalary * prev.numberOfPayments,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        monthlySalary: prev.grossAnnualSalary / prev.numberOfPayments
      }));
    }
  }, [formData.numberOfPayments, salaryMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'salaryInput') {
        const salaryValue = Number(value) || 0;
        if (salaryMode === 'annual') {
            setFormData(prev => ({
                ...prev,
                grossAnnualSalary: salaryValue,
                monthlySalary: salaryValue / prev.numberOfPayments
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                monthlySalary: salaryValue,
                grossAnnualSalary: salaryValue * prev.numberOfPayments
            }));
        }
        return;
    }

    const numericFields = ['contributionGroup', 'numberOfPayments', 'irpfPercentage'];
    if (numericFields.includes(name)) {
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value as ContractType | string }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.grossAnnualSalary <= 0) {
      newErrors.salaryInput = 'El salario debe ser un número positivo.';
    }
    if (formData.irpfPercentage < 0 || formData.irpfPercentage > 100) {
        newErrors.irpfPercentage = 'El IRPF debe estar entre 0 y 100.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate(formData);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="bg-black rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="text-xl font-semibold text-white col-span-1 md:col-span-2 border-b border-gray-700 pb-3 mb-4">Datos del Empleado</h2>
            
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Introducir Salario Como</label>
                <div className="flex items-center space-x-4 bg-gray-800 border border-gray-600 rounded-md p-2">
                    <label className="flex-1 flex items-center justify-center text-white cursor-pointer">
                        <input type="radio" name="salaryMode" value="annual" checked={salaryMode === 'annual'} onChange={() => setSalaryMode('annual')} className="sr-only"/>
                        <span className={`px-4 py-1 text-sm rounded-md transition-colors ${salaryMode === 'annual' ? 'bg-indigo-600' : 'bg-transparent'}`}>Anual</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center text-white cursor-pointer">
                        <input type="radio" name="salaryMode" value="monthly" checked={salaryMode === 'monthly'} onChange={() => setSalaryMode('monthly')} className="sr-only"/>
                        <span className={`px-4 py-1 text-sm rounded-md transition-colors ${salaryMode === 'monthly' ? 'bg-indigo-600' : 'bg-transparent'}`}>Mensual</span>
                    </label>
                </div>
            </div>

            <Input
              label={salaryMode === 'annual' ? "Salario Bruto Anual (€)" : "Salario Bruto Mensual (€)"}
              id="salaryInput"
              name="salaryInput"
              type="number"
              value={String(salaryMode === 'annual' ? Math.round(formData.grossAnnualSalary) : formData.monthlySalary)}
              onChange={handleChange}
              error={errors.salaryInput}
              placeholder={salaryMode === 'annual' ? "Ej: 30000" : "Ej: 2500"}
              step="any"
              required
            />

            <Select
              label="Tipo de Contrato"
              id="contractType"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
            >
              <option value={ContractType.PERMANENT}>Indefinido</option>
              <option value={ContractType.TEMPORARY}>Temporal</option>
            </Select>

            <div className="col-span-1 md:col-span-2">
                <Select
                    label="Grupo de Cotización"
                    id="contributionGroup"
                    name="contributionGroup"
                    value={String(formData.contributionGroup)}
                    onChange={handleChange}
                >
                    {CONTRIBUTION_GROUP_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
                <p className="mt-1 text-xs text-gray-400">Determina las bases mínimas y máximas de cotización a la Seguridad Social.</p>
            </div>

            <div className="col-span-1 md:col-span-2">
                <Select
                    label="Actividad Económica de la Empresa (AT/EP)"
                    id="riskLevel"
                    name="riskLevel"
                    value={formData.riskLevel}
                    onChange={handleChange}
                >
                    {CNAE_RISK_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
                <p className="mt-1 text-xs text-gray-400">La actividad de la empresa define el tipo de cotización por accidentes de trabajo.</p>
            </div>
            
            <Select
              label="Número de Pagas"
              id="numberOfPayments"
              name="numberOfPayments"
              value={String(formData.numberOfPayments)}
              onChange={handleChange}
            >
              <option value="12">12 Pagas</option>
              <option value="14">14 Pagas</option>
            </Select>
            
            <div>
              <Input
                label="Retención de IRPF (%)"
                id="irpfPercentage"
                name="irpfPercentage"
                type="number"
                value={String(formData.irpfPercentage)}
                onChange={handleChange}
                error={errors.irpfPercentage}
                placeholder="Ej: 15"
                step="0.1"
                min="0"
                max="100"
                required
              />
              <p className="mt-1 text-xs text-gray-400">Porcentaje de retención a cuenta del IRPF.</p>
            </div>


          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit" >
                Calcular Coste
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DataInputForm;

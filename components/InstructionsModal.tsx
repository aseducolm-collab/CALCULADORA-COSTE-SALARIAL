
import React from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Guía de Uso de la Calculadora</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div className="p-6 text-gray-700 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">¿Qué hace esta herramienta?</h3>
            <p>Esta calculadora te permite estimar el <strong>coste salarial total anual</strong> que una empresa asume por un empleado en España. El cálculo incluye no solo el salario bruto, sino también todas las cotizaciones obligatorias a la Seguridad Social que corren a cargo de la empresa.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-indigo-600">Paso 1: Introduce los Datos del Empleado</h3>
            <ul className="space-y-4 list-disc list-inside">
              <li>
                <strong>Salario Bruto Anual (€):</strong> Es el importe total que el empleado percibe antes de aplicar cualquier tipo de retención o cotización. Incluye el salario base, complementos y las pagas extraordinarias.
              </li>
              <li>
                <strong>Tipo de Contrato:</strong> Selecciona si el contrato es indefinido o temporal. Esto afecta directamente al porcentaje de cotización por desempleo.
              </li>
              <li>
                <strong>Grupo de Cotización:</strong> Elige el grupo profesional al que pertenece el puesto. Este dato define las bases mínimas y máximas sobre las que se calculan las cotizaciones. El listado incluye tanto los grupos de cotización mensual (1-7) como los de cotización diaria (8-11).
              </li>
              <li>
                <strong>Actividad Económica de la Empresa (AT/EP):</strong> Selecciona el sector que mejor describa la actividad de tu empresa. Esto determina el tipo de cotización por Accidentes de Trabajo y Enfermedades Profesionales.
              </li>
              <li>
                <strong>Número de Pagas:</strong> Indica si el salario anual se distribuye en 12 o 14 pagas. Este dato es informativo y no afecta al cálculo total anual.
              </li>
               <li>
                <strong>Retención de IRPF (%):</strong> Introduce el porcentaje de retención que se aplica en la nómina del empleado. Este valor es clave para estimar el salario neto.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-indigo-600">Paso 2: Analiza los Resultados</h3>
            <p className="mb-4">Una vez pulses "Calcular Coste", la aplicación te mostrará los resultados en tres pestañas:</p>
            <ul className="space-y-3">
              <li><strong>Resumen de Costes:</strong> Aquí verás el coste total para la empresa, un desglose detallado de las cargas sociales y una estimación del salario neto que percibiría el empleado.</li>
              <li><strong>Comparativa Visual:</strong> Un gráfico circular te mostrará de forma muy visual qué proporción del coste total corresponde al salario bruto y qué parte a las cotizaciones de la empresa.</li>
              <li><strong>Exportar Resumen:</strong> Puedes descargar un informe en PDF con todo el desglose, ideal para guardar o compartir.</li>
            </ul>
          </section>
          
          <div className="!mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h4 className="font-bold">Aviso Importante</h4>
            <p className="text-sm">Los resultados de esta calculadora son una <strong>estimación</strong>. Los cálculos reales pueden variar ligeramente debido a convenios colectivos específicos, bonificaciones o la situación personal del empleado (que afecta al IRPF). Consulta siempre a un asesor profesional para obtener cifras exactas.</p>
          </div>
        </div>
         <div className="p-4 bg-gray-50 border-t text-right sticky bottom-0 z-10">
            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Entendido
            </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
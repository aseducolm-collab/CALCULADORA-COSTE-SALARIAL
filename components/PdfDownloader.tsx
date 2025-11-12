
import React from 'react';
import { downloadCostSummaryPDF } from '../services/pdfService';
import { CostSummary, EmployeeData } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

interface PdfDownloaderProps {
    summary: CostSummary;
    employeeData: EmployeeData;
}

const PdfDownloader: React.FC<PdfDownloaderProps> = ({ summary, employeeData }) => {
    const handleDownload = () => {
        downloadCostSummaryPDF(summary, employeeData);
    };

    return (
        <Card title="Exportar Resumen">
            <p className="text-sm text-gray-600 mb-4">
                Descarga un resumen detallado de los costes en formato PDF para tus registros.
            </p>
            <Button onClick={handleDownload} fullWidth>
                Descargar PDF
            </Button>
        </Card>
    );
};

export default PdfDownloader;

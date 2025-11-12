
import React, { useState } from 'react';
import { generateCostVisual } from '../services/geminiService';
import { CostSummary } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

interface ImageGeneratorProps {
    costSummary: CostSummary;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ costSummary }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        const prompt = `Crea una infografía abstracta y profesional para un informe de RRHH. Debe representar visualmente la proporción entre el salario de un empleado y los costes adicionales para la empresa. Utiliza un gran bloque central para simbolizar el 'Salario Bruto', y varios bloques más pequeños a su alrededor para simbolizar las 'Cargas Sociales'. La proporción visual debe reflejar que el Salario Bruto es la parte más grande del coste total. Usa una paleta de colores corporativa (azules, grises, verdes). Estilo limpio, minimalista, sin texto ni números.`;

        try {
            const base64Image = await generateCostVisual(prompt);
            setImageUrl(`data:image/jpeg;base64,${base64Image}`);
        } catch (e) {
            console.error(e);
            setError('No se pudo generar la imagen. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Resumen Visual (IA)">
            <p className="text-sm text-gray-600 mb-4">Genera una infografía con la IA de Gemini para resumir visualmente los costes.</p>
            <Button onClick={handleGenerateImage} disabled={isLoading} fullWidth>
                {isLoading ? 'Generando...' : 'Generar Infografía'}
            </Button>

            {isLoading && (
                <div className="mt-4 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
            
            {imageUrl && (
                 <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
                    <img src={imageUrl} alt="Resumen visual del coste salarial" className="w-full h-auto" />
                </div>
            )}
        </Card>
    );
};

export default ImageGenerator;
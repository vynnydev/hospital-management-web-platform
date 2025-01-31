import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { IPatient } from '@/types/hospital-network-types';
import { getPatientVitals } from '@/utils/patientDataUtils';

interface VitalsChartProps {
  patientData: IPatient;
}

export const VitalsChart: React.FC<VitalsChartProps> = ({ patientData }) => {
    const generateProgressData = () => {
        if (!patientData) return [];
        
        // Usar a função getPatientVitals para obter os dados de sinais vitais
        const vitals = getPatientVitals(patientData);
        
        // Criar dados para o gráfico
        return [{
            date: new Date().toLocaleDateString(),
            heartRate: vitals.heartRate,
            temperature: vitals.temperature,
            oxygenSaturation: vitals.oxygenSaturation
        }];
    };

    const data = generateProgressData();

    return (
        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4'>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Sinais Vitais
        </h3>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc'
                }}
                />
                <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                name="Freq. Cardíaca"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                />
                <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#f97316" 
                name="Temperatura"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                />
                <Line 
                type="monotone" 
                dataKey="oxygenSaturation" 
                stroke="#0ea5e9" 
                name="Saturação"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};
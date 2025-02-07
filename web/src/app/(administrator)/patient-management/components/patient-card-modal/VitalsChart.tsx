import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import type { IPatient } from '@/types/hospital-network-types';
import { getPatientVitals } from '@/utils/patientDataUtils';

interface VitalsChartProps {
  patientData: IPatient;
}

const vitalSigns = [
  {
    id: 'heartRate',
    name: 'FC',
    color: '#f87171',
    unit: 'bpm'
  },
  {
    id: 'temperature',
    name: 'Temp',
    color: '#fb923c',
    unit: '°C'
  },
  {
    id: 'oxygenSaturation',
    name: 'SpO2',
    color: '#60a5fa',
    unit: '%'
  }
];

export const VitalsChart: React.FC<VitalsChartProps> = ({ patientData }) => {
  const [timeRange] = useState('24h');

  const generateProgressData = () => {
    if (!patientData) return [];
    
    const vitals = getPatientVitals(patientData);
    const now = new Date();
    const data = [];
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      const baseHeartRate = Number(vitals.heartRate);
      const baseTemperature = Number(vitals.temperature);
      const baseOxygenSaturation = Number(vitals.oxygenSaturation);

      data.push({
        date: date.toLocaleTimeString([], { 
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        heartRate: baseHeartRate + (Math.sin(i * 0.5) * 3),
        temperature: baseTemperature + (Math.sin(i * 0.3) * 0.2),
        oxygenSaturation: baseOxygenSaturation + (Math.sin(i * 0.4) * 1)
      });
    }
    
    return data;
  };

  const data = useMemo(generateProgressData, [patientData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-sm backdrop-blur-sm 
                    border border-gray-100 dark:border-gray-700 text-xs">
        <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-700 dark:text-gray-300">
              {entry.value.toFixed(1)}
              {vitalSigns.find(v => v.id === entry.dataKey)?.unit}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const lastReadings = {
    heartRate: data[data.length - 1]?.heartRate.toFixed(1),
    temperature: data[data.length - 1]?.temperature.toFixed(1),
    oxygenSaturation: data[data.length - 1]?.oxygenSaturation.toFixed(1)
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Sinais Vitais
        </h3>

        <div className="flex items-center justify-between mb-6 mt-4">
            <div className="flex items-center gap-6">
            {vitalSigns.map(vital => (
                <div key={vital.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: vital.color }} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{vital.name}</span>
                    <span className="text-sm font-medium">
                        {lastReadings[vital.id as keyof typeof lastReadings]}
                        {vital.unit}
                    </span>
                </div>
            ))}
            </div>
        </div>

        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                    />
                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    {vitalSigns.map(vital => (
                        <Line
                            key={vital.id}
                            type="monotone"
                            dataKey={vital.id}
                            stroke={vital.color}
                            strokeWidth={1.5}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};
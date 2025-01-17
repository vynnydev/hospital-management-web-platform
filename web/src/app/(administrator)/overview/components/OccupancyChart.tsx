import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HospitalData } from '../types/hospital-network-types';

interface HospitalListProps {
    data: HospitalData[];
}

export const OccupancyChart: React.FC<HospitalListProps> = ({ data }) => {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Taxa de Ocupação</h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">UTI</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-teal-600"></span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Enfermaria</span>
          </span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)',
                border: 'none',
                borderRadius: '0.5rem',
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="utiOccupancy"
              stroke="#2563eb"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="wardOccupancy"
              stroke="#0d9488"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
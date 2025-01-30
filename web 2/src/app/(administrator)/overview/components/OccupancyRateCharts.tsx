/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/organisms/card";
import { IHospital } from "@/types/hospital-network-types";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer
} from "recharts";

interface IOccupancyRateChartsProps {
    filteredHospitals: IHospital[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const currentYear = new Date().getFullYear();
        
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {`${currentMonth} ${currentYear}`}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                    {label}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {`${payload[0].value}%`}
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +5.2% em relação ao mês anterior
                </div>
            </div>
        );
    }
    return null;
};

export const OccupancyRateCharts: React.FC<IOccupancyRateChartsProps> = ({
    filteredHospitals,
}) => {
    const [chartWidth, setChartWidth] = useState(0);
    const minWidthPerBar = 100; // Largura mínima para cada barra

    useEffect(() => {
        // Calcula a largura necessária com base no número de hospitais
        const newWidth = Math.max(500, filteredHospitals.length * minWidthPerBar);
        setChartWidth(newWidth);
    }, [filteredHospitals]);

    const data = filteredHospitals.map(h => ({
        name: h.name.replace('Hospital ', ''),
        ocupacao: h.metrics.overall.occupancyRate,
        meta: 85 // Meta de ocupação (exemplo)
    }));

    return (
        <Card className="w-full p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Taxa de Ocupação
                </h3>
            </div>
            
            <div className="overflow-x-auto">
                <div style={{ width: `${chartWidth}px`, minWidth: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#2dd4bf" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5e7eb"
                                className="dark:stroke-gray-700"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                className="dark:text-gray-400"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                className="dark:text-gray-400"
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar
                                dataKey="ocupacao"
                                fill="url(#occupancyGradient)"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                name=""
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};
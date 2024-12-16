// pages/DashboardMetrics.tsx
'use client'
import React from 'react';
import MetricCard from './MetricCard';
import {
  HomeModernIcon,
  UserGroupIcon, // ao invés de PatientIcon
  ClockIcon,
  BuildingOffice2Icon, // ao invés de BedAvailableIcon
  ArrowPathIcon // ao invés de RotationIcon
} from '@heroicons/react/24/outline';

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Taxa de Ocupação Total */}
        <MetricCard
          title="Taxa de Ocupação Total"
          value={85.5}
          unit="%"
          trend={{
            value: 2.3,
            direction: 'up'
          }}
          status="warning"
          timestamp={new Date()}
          details={{
            subtitle: "Ocupação por setor",
            breakdown: [
              { label: "UTI", value: "92%" },
              { label: "Enfermaria", value: "78%" }
            ]
          }}
          icon={<HomeModernIcon className="w-5 h-5 text-gray-500" />}
        />

        {/* Total de Pacientes */}
        <MetricCard
          title="Total de Pacientes"
          value={324}
          unit="pacientes"
          trend={{
            value: 12,
            direction: 'up'
          }}
          status="normal"
          timestamp={new Date()}
          details={{
            subtitle: "Por tipo de internação",
            breakdown: [
              { label: "Clínica", value: "185" },
              { label: "Cirúrgica", value: "139" }
            ]
          }}
          icon={<UserGroupIcon className="w-5 h-5 text-gray-500" />}
        />

        {/* Leitos Disponíveis */}
        <MetricCard
          title="Leitos Disponíveis"
          value={45}
          unit="leitos"
          trend={{
            value: 5,
            direction: 'down'
          }}
          status="critical"
          timestamp={new Date()}
          details={{
            subtitle: "Por categoria",
            breakdown: [
              { label: "UTI", value: "8" },
              { label: "Enfermaria", value: "37" }
            ]
          }}
          icon={<BuildingOffice2Icon className="w-5 h-5 text-gray-500" />}
        />

        {/* Tempo Médio Internação */}
        <MetricCard
          title="Tempo Médio Internação"
          value={5.2}
          unit="dias"
          trend={{
            value: 0.3,
            direction: 'down'
          }}
          status="normal"
          timestamp={new Date()}
          details={{
            subtitle: "Por especialidade",
            breakdown: [
              { label: "Clínica", value: "4.8d" },
              { label: "Cirúrgica", value: "5.6d" }
            ]
          }}
          icon={<ClockIcon className="w-5 h-5 text-gray-500" />}
        />

        {/* Taxa de Rotatividade */}
        <MetricCard
          title="Taxa de Rotatividade"
          value={12.3}
          unit="pacientes/dia"
          trend={{
            value: 1.5,
            direction: 'up'
          }}
          status="normal"
          timestamp={new Date()}
          details={{
            subtitle: "Últimas 24h",
            breakdown: [
              { label: "Admissões", value: "28" },
              { label: "Altas", value: "25" }
            ]
          }}
          icon={<ArrowPathIcon className="w-5 h-5 text-gray-500" />}
        />
      </div>
  );
};

export default DashboardMetrics;
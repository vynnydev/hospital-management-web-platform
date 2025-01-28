/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { BedDouble, ChevronRight, ChevronLeft, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { IBed, IPatient } from '@/types/hospital-network-types';

// Types
interface IBedModelProps {
  patient?: IPatient;
  isSelected: boolean;
  status?: 'occupied' | 'available' | 'maintenance';
}

interface IBedSpaceProps {
  bed: IBed;
  isSelected: boolean;
  onClick: () => void;
}

// Componente para renderizar o modelo 3D da cama
export const BedModelCanva: React.FC<IBedModelProps> = ({ 
  patient, 
  isSelected, 
  status = 'available' 
}) => {
  // Cores baseadas no status do leito
  const colors = {
    occupied: {
      base: "#f8fafc",
      blanket: "#60a5fa", // Azul mais claro para camas ocupadas
      pillow: "#e2e8f0",
      rails: "#f1f5f9"
    },
    available: {
      base: "#f8fafc",
      blanket: "#86efac", // Verde suave para camas disponíveis
      pillow: "#cbd5e1",
      rails: "#e2e8f0"
    },
    maintenance: {
      base: "#f8fafc",
      blanket: "#fcd34d", // Amarelo para manutenção
      pillow: "#cbd5e1",
      rails: "#e2e8f0"
    }
  };

  const currentColors = colors[patient ? 'occupied' : status];

  return (
    <Canvas style={{ width: '100%', height: '100%', minHeight: '150px' }}>
      <PerspectiveCamera makeDefault position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 6, 0]} intensity={0.6} />
      
      {/* Base da cama */}
      <mesh>
        <boxGeometry args={[2.2, 0.1, 2.8]} />
        <meshStandardMaterial color={currentColors.base} />
      </mesh>

      {/* Cobertor com gradiente */}
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[2.0, 0.05, 2.2]} />
        <meshStandardMaterial color={currentColors.blanket} />
      </mesh>

      {/* Travesseiro com sombra suave */}
      <mesh position={[0, 0.1, -1]}>
        <boxGeometry args={[1.6, 0.15, 0.7]} />
        <meshStandardMaterial color={currentColors.pillow} />
      </mesh>

      {/* Grades laterais com detalhes */}
      <mesh position={[-1.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.6]} />
        <meshStandardMaterial color={currentColors.rails} />
      </mesh>
      <mesh position={[1.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.6]} />
        <meshStandardMaterial color={currentColors.rails} />
      </mesh>

      {/* Indicador de seleção */}
      {isSelected && (
        <mesh position={[0, -0.1, 0]}>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshStandardMaterial color="#3b82f6" opacity={0.5} transparent />
        </mesh>
      )}
    </Canvas>
  );
};

// Componente para renderizar um espaço de leito
export const BedSpace: React.FC<IBedSpaceProps> = ({ bed, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer relative transition-all h-48 bg-gray-800/50
      ${bed.patient ? 'ring-1 ring-blue-500/20' : ''}
      ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      hover:bg-gray-700/50 rounded-xl backdrop-blur-sm
    `}
  >
    <div className="p-2 h-full flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <BedModelCanva
            patient={bed.patient}
            isSelected={isSelected}
            status={bed.status}
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-100">
          {bed.number}
        </div>
        {bed.patient && (
          <div className="text-xs text-blue-400 mt-1 truncate">
            {bed.patient.name}
          </div>
        )}
        <BedStatus status={bed.status} />
      </div>
    </div>
  </div>
);

// Componente para o status do leito
export const BedStatus: React.FC<{ status: IBed['status'] }> = ({ status }) => {
  const statusConfig = {
    occupied: { color: 'text-blue-400', label: 'Ocupado' },
    available: { color: 'text-green-400', label: 'Disponível' },
    maintenance: { color: 'text-yellow-400', label: 'Manutenção' }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center justify-center gap-1.5 mt-1.5 ${config.color} text-xs`}>
      <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
      {config.label}
    </div>
  );
};

// Componente para espaço vazio de cama
export const EmptyBedSpace: React.FC<{ number: string }> = ({ number }) => (
  <div className="h-48 bg-gray-900/20 rounded-xl flex flex-col items-center justify-center group transition-all hover:bg-gray-800/20">
    <div className="flex flex-col items-center">
      <BedDouble className="h-8 w-8 text-gray-600/30 group-hover:text-gray-500/50 transition-colors" />
      <span className="text-gray-500 text-sm mt-2">{number}</span>
      <div className="flex items-center gap-1.5 mt-1.5 text-gray-400 text-xs">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-600/30" />
        Disponível
      </div>
    </div>
  </div>
);

// Componente para o corredor central
export const CorridorIndicator: React.FC = () => (
  <div className="h-8 flex items-center justify-center w-full">
    <div className="flex items-center justify-center bg-gray-800/10 rounded-lg px-3 py-1 border border-gray-700/10 w-full">
      <ArrowRight className="h-4 w-4 text-gray-500/50" />
      <span className="text-xs text-gray-500/50 mx-2">Corredor</span>
      <ArrowRight className="h-4 w-4 text-gray-500/50 transform rotate-180" />
    </div>
  </div>
);
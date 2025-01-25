import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

interface BedModelProps {
  patient?: {
    id: string;
    name: string;
    admissionDate: string;
    diagnosis: string;
    expectedDischarge: string;
  };
  isSelected: boolean;
}

export const BedModelCanva: React.FC<BedModelProps> = ({ patient, isSelected }) => {
  return (
    <Canvas style={{ width: '100%', height: '100%', minHeight: '150px' }}>
      <PerspectiveCamera makeDefault position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 6, 0]} intensity={0.6} />
      
      {/* Base da cama (branca) */}
      <mesh>
        <boxGeometry args={[2.2, 0.1, 2.8]} />
        <meshStandardMaterial color={patient ? "#f8fafc" : "#e2e8f0"} />
      </mesh>

      {/* Cobertor */}
      <mesh position={[0, 0.1, 0.2]}>
        <boxGeometry args={[2.0, 0.05, 2.2]} />
        <meshStandardMaterial color={patient ? "#1e3a8a" : "#1f2937"} />
      </mesh>

      {/* Travesseiro */}
      <mesh position={[0, 0.1, -1]}>
        <boxGeometry args={[1.6, 0.15, 0.7]} />
        <meshStandardMaterial color={patient ? "#e2e8f0" : "#cbd5e1"} />
      </mesh>

      {/* Grades laterais (brancas) */}
      <mesh position={[-1.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.6]} />
        <meshStandardMaterial color={patient ? "#f1f5f9" : "#e2e8f0"} />
      </mesh>
      <mesh position={[1.05, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, 2.6]} />
        <meshStandardMaterial color={patient ? "#f1f5f9" : "#e2e8f0"} />
      </mesh>

      {isSelected && (
        <mesh position={[0, -0.1, 0]}>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshStandardMaterial color="#3b82f6" opacity={0.5} transparent />
        </mesh>
      )}
    </Canvas>
  );
};
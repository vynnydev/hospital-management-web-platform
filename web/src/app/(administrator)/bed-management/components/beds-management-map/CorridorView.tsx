/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBed } from "@/types/hospital-network-types";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import React from "react";
import { BedModelCanva, BedSpace, BedStatus, CorridorIndicator, EmptyBedSpace } from "./BedModelCanva";

interface ICorridorViewProps {
  beds: IBed[];
  onBedSelect: (bed: IBed) => void;
  selectedBed: IBed | null;
  departmentName: string;
}

export const CorridorView: React.FC<ICorridorViewProps> = ({ 
  beds, 
  onBedSelect, 
  selectedBed,
  departmentName
}) => {
  // Função para gerar número do leito baseado na posição
  const getEmptyBedNumber = (row: number, position: number): string => {
    const rowPrefix = row === 0 ? '1' : '2';
    return `${rowPrefix}${position.toString().padStart(2, '0')}`;
  };

  // Criar array de 12 posições (6 por fileira) com numeração sequencial
  const allPositions = Array(12).fill(null).map((_, index) => {
    const row = Math.floor(index / 6);
    const position = (index % 6) + 1;
    const bedNumber = getEmptyBedNumber(row, position);
    const existingBed = beds.find(bed => bed.number === bedNumber);
    
    return existingBed || {
      id: `empty-${departmentName}-${bedNumber}`,
      number: bedNumber,
      department: departmentName,
      floor: '1',
      specialty: '',
      hospital: '',
      status: 'available' as const
    };
  });

  // Dividir em duas fileiras
  const row1 = allPositions.slice(0, 6);
  const row2 = allPositions.slice(6, 12);

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl">
      <div className="text-gray-400 text-sm mb-6">
        Leitos
      </div>

      <div className="space-y-4">
        {/* Primeira fileira */}
        <div className="grid grid-cols-6 gap-4">
          {row1.map((bed) => (
            <BedSpace
              key={bed.id}
              bed={bed}
              isSelected={selectedBed?.id === bed.id}
              onClick={() => onBedSelect(bed)}
            />
          ))}
        </div>

        {/* Corredor central */}
        <CorridorIndicator />

        {/* Segunda fileira */}
        <div className="grid grid-cols-6 gap-4">
          {row2.map((bed) => (
            <BedSpace
              key={bed.id}
              bed={bed}
              isSelected={selectedBed?.id === bed.id}
              onClick={() => onBedSelect(bed)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
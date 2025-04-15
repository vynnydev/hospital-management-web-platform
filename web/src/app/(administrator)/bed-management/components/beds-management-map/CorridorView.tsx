/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Users, AlertCircle, ArrowRight } from 'lucide-react';
import type { IBed, IRoom } from '@/types/hospital-network-types';
import { BedSpace, EmptyBedSpace, CorridorIndicator } from './BedModelCanva';
import { ThermalOverlayToggle } from '@/components/ui/templates/thermal-camera/thermal-overlay/ThermalOverlayToggle';
import { BedThermalOverlay } from '@/components/ui/templates/thermal-camera/thermal-overlay/BedThermalOverlay';
import { Button } from '@/components/ui/organisms/button';

interface CorridorViewProps {
  beds: IBed[];
  onBedSelect: (bed: IBed) => void;
  selectedBed: IBed | null;
  departmentName: string;
  hospitalId: string;
  rooms: IRoom[];
  selectedRoom?: string;
  selectedFloor: string;
}

export const CorridorView: React.FC<CorridorViewProps> = ({
  beds,
  onBedSelect,
  selectedBed,
  departmentName,
  hospitalId,
  rooms,
  selectedRoom,
  selectedFloor
}) => {
  const [thermalOverlayActive, setThermalOverlayActive] = useState(false);
  const [thermalOpacity, setThermalOpacity] = useState(50);
  const [thermalColorMode, setThermalColorMode] = useState<'rainbow' | 'heat' | 'cool'>('rainbow');

  const toggleThermalOverlay = (active: boolean) => {
    setThermalOverlayActive(active);
  };

  // Função para organizar os leitos em lados do corredor
  const organizeBedsInCorridor = () => {
    // Se temos filtro de quarto, mostramos apenas os leitos desse quarto
    const filteredBeds = selectedRoom 
      ? beds.filter(bed => bed.number.startsWith(selectedRoom))
      : beds;
      
    // Dividir os leitos entre os dois lados do corredor
    const leftSideBeds: IBed[] = [];
    const rightSideBeds: IBed[] = [];
    
    filteredBeds.forEach(bed => {
      const bedNumber = parseInt(bed.number);
      // Leitos com números ímpares vão para a esquerda, pares para a direita
      // Essa é uma lógica simplificada, pode ser ajustada conforme necessário
      if (bedNumber % 2 === 0) {
        rightSideBeds.push(bed);
      } else {
        leftSideBeds.push(bed);
      }
    });
    
    // Ordenar os leitos por número
    leftSideBeds.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    rightSideBeds.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    return { leftSideBeds, rightSideBeds };
  };
  
  const { leftSideBeds, rightSideBeds } = organizeBedsInCorridor();
  
  // Renderiza um lado do corredor com os leitos
  const renderCorridorSide = (sideBeds: IBed[], isRight: boolean = false) => (
    <div className="grid grid-cols-2 gap-4">
      {sideBeds.map(bed => (
        <div key={bed.id} className="relative">
          <BedSpace
            bed={bed}
            isSelected={selectedBed?.id === bed.id}
            onClick={() => onBedSelect(bed)}
          />
          
          {/* Sobreposição térmica, visível apenas quando ativada */}
          {thermalOverlayActive && (
            <BedThermalOverlay
              bed={bed}
              isVisible={thermalOverlayActive}
              colorMode={thermalColorMode}
              opacity={thermalOpacity}
            />
          )}
        </div>
      ))}
      {/* Preenchimento com espaços vazios se necessário para manter o layout */}
      {Array.from({ length: Math.max(0, 4 - sideBeds.length) }).map((_, i) => (
        <EmptyBedSpace key={`empty-${isRight ? 'right' : 'left'}-${i}`} number={`${isRight ? 'D' : 'E'}${i + 1}`} />
      ))}
    </div>
  );
  
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Leitos por Corredor
          {selectedRoom && (
            <span className="ml-2 text-gray-400">- Quarto {selectedRoom}</span>
          )}
        </h3>
        
        <div className="flex items-center gap-2">
          <ThermalOverlayToggle 
            hospitalId={hospitalId}
            departmentName={departmentName}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {beds.length === 0 ? (
        <div className="bg-gray-800/30 rounded-xl p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">
            Nenhum leito encontrado
          </h3>
          <p className="text-gray-500 text-sm">
            Não há leitos configurados para este departamento e andar.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lado esquerdo do corredor */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              {renderCorridorSide(leftSideBeds)}
            </div>
            
            {/* Corredor central */}
            <div className="col-span-2 flex items-center">
              <CorridorIndicator />
            </div>
            
            {/* Lado direito do corredor */}
            <div className="col-span-5">
              {renderCorridorSide(rightSideBeds, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
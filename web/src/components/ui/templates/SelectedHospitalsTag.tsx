import React from 'react';
import { MapPin, X, Building2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/organisms/card';
import type { IHospital } from '@/types/hospital-network-types';

interface SelectedHospitalsTagProps {
  hospitals: IHospital[];
  selectedHospitals: IHospital[];
  onRemove: (hospitalId: string) => void;
}

export const SelectedHospitalsTag: React.FC<SelectedHospitalsTagProps> = ({ 
  selectedHospitals,
  onRemove 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Componente é sempre renderizado, mas com diferentes estados visuais
  return (
    <div className='pt-8'>
      <Card 
        className={`${
          selectedHospitals.length === 0
            ? 'bg-gradient-to-r from-gray-600/90 to-gray-700/90'
            : 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90'
        } text-white`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedHospitals.length === 0 ? (
                <>
                  <AlertCircle className="w-5 h-5 text-gray-300" />
                  <div>
                    <h4 className="font-medium">Hospitais para envio de alertas</h4>
                    <p className="text-sm text-gray-300 mt-0.5">
                      Selecione os hospitais nos cards abaixo
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  {/* Header com contador */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <h4 className="font-medium">
                        {selectedHospitals.length} {selectedHospitals.length === 1 ? 'hospital selecionado' : 'hospitais selecionados'}
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 px-2 text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Recolher lista <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Expandir lista <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Lista compacta (não expandida) */}
                  {!isExpanded && (
                    <div className="flex flex-wrap gap-2">
                      {selectedHospitals.map(hospital => (
                        <div
                          key={hospital.id}
                          className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5"
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{hospital.name}</span>
                          <span className="text-sm text-white/80">
                            {hospital.metrics.overall.occupancyRate}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(hospital.id);
                            }}
                            className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lista detalhada (expandida) */}
                  {isExpanded && (
                    <div className="space-y-2">
                      {selectedHospitals.map(hospital => (
                        <div
                          key={hospital.id}
                          className="flex items-center justify-between bg-white/10 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5" />
                            <div>
                              <p className="text-sm font-medium">{hospital.name}</p>
                              <p className="text-xs text-white/80">
                                {hospital.unit.city}, {hospital.unit.state}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4 px-4 border-r border-white/20">
                              <div className="text-sm">
                                <span className="text-white/80">Ocupação:</span>
                                <span className="ml-1 font-medium">
                                  {hospital.metrics.overall.occupancyRate}%
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-white/80">Leitos Livres:</span>
                                <span className="ml-1 font-medium">
                                  {hospital.metrics.overall.availableBeds}
                                </span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => onRemove(hospital.id)}
                              className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
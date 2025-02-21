// components/resources/transfers/TransferResourcesModal.tsx
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Truck, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IHospitalResources } from "@/types/resources-types";
import { IResourceRouteAnalysis } from '@/types/resource-route-analysis-types';

interface ITransferResourcesModalProps {
  sourceHospital: IHospital | undefined;
  targetHospitals: IHospital[];
  sourceResources: IHospitalResources | null;
  resourcesData: Record<string, IHospitalResources>;
  preselectedResource?: {
    resourceType: string;
    category: 'equipment' | 'supplies';
  } | null;
  resourceRouteAnalysis: IResourceRouteAnalysis;  // Adicionado
  onClose: () => void;
  onTransfer: (data: ITransferRequest) => void;
}

export interface ITransferRequest {
  sourceId: string | undefined;
  targetId: string;
  resourceType: string;
  resourceCategory: 'equipment' | 'supplies';
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

const calculateRouteInfo = (source: IHospital | undefined, target: IHospital) => {
  if (!source) return null
  // Cálculo de distância usando a fórmula de Haversine
  const R = 6371; // Raio da Terra em km
  const dLat = (target.unit.coordinates.lat - source.unit.coordinates.lat) * Math.PI / 180;
  const dLon = (target.unit.coordinates.lng - source.unit.coordinates.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(source.unit.coordinates.lat * Math.PI / 180) * Math.cos(target.unit.coordinates.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Estimativa de tempo baseada na distância (velocidade média 60km/h)
  const estimatedTime = Math.round(distance / 60 * 60);
  
  // Custo estimado baseado na distância
  const estimatedCost = Math.round(distance * 10); // R$10 por km
  
  return {
    distance: Math.round(distance * 10) / 10,
    estimatedTime,
    estimatedCost
  };
};

export const TransferResourcesModal: React.FC<ITransferResourcesModalProps> = ({
    sourceHospital,
    targetHospitals,
    sourceResources,
    resourcesData,
    preselectedResource,
    onClose,
    onTransfer
}) => {
    const [targetId, setTargetId] = useState(targetHospitals[0]?.id || '');
    const [resourceType, setResourceType] = useState(preselectedResource?.resourceType || 'respirators');
    const [resourceCategory, setResourceCategory] = useState<'equipment' | 'supplies'>(
      preselectedResource?.category || 'equipment'
    );
    const [quantity, setQuantity] = useState(1);
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  const targetHospital = targetHospitals.find(h => h.id === targetId);
  const targetResources = targetId ? resourcesData[targetId] : undefined;
  
  const routeInfo = targetHospital ? calculateRouteInfo(sourceHospital, targetHospital) : null;
  
  const getResourceTypeOptions = () => {
    if (resourceCategory === 'equipment') {
      return [
        { value: 'respirators', label: 'Respiradores' },
        { value: 'monitors', label: 'Monitores' },
        { value: 'defibrillators', label: 'Desfibriladores' }
      ];
    } else {
      return [
        { value: 'medications', label: 'Medicamentos' },
        { value: 'bloodBank', label: 'Banco de Sangue' },
        { value: 'ppe', label: 'EPIs' }
      ];
    }
  };
  
  const getMaximumTransferQuantity = () => {
    if (!sourceResources) return 5; // Valor padrão para teste
    
    try {
      if (resourceCategory === 'equipment') {
        return Math.max(1, sourceResources.equipmentStatus[resourceType as keyof typeof sourceResources.equipmentStatus].available);
      } else {
        return Math.max(1, sourceResources.suppliesStatus[resourceType as keyof typeof sourceResources.suppliesStatus].normal);
      }
    } catch (error) {
      console.error('Erro ao calcular quantidade máxima:', error);
      return 5; // Valor de fallback
    }
  };
  
  const getResourceNeedLevel = () => {
    if (!targetResources) return 'medium';
    
    if (resourceCategory === 'equipment') {
      const resource = targetResources.equipmentStatus[resourceType as keyof typeof targetResources.equipmentStatus];
      const availabilityRate = resource.available / resource.total;
      
      if (availabilityRate < 0.2) return 'high';
      if (availabilityRate < 0.5) return 'medium';
      return 'low';
    } else {
      const resource = targetResources.suppliesStatus[resourceType as keyof typeof targetResources.suppliesStatus];
      if (resource.criticalLow > 0) return 'high';
      if (resource.lowStock > 0) return 'medium';
      return 'low';
    }
  };
  
  const handleSubmit = () => {
    if (!targetHospital || !routeInfo) return;
    
    onTransfer({
      sourceId: sourceHospital?.id,
      targetId: targetHospital.id,
      resourceType,
      resourceCategory,
      quantity,
      priority,
      estimatedTime: routeInfo.estimatedTime
    });
    onClose();
  };
  
  const needLevel = getResourceNeedLevel();
  const maxQuantity = getMaximumTransferQuantity();
  
  const transferEfficiencyScore = () => {
    if (!targetHospital) return 5;
    
    // Pontuação baseada na necessidade do destino
    let score = needLevel === 'high' ? 10 : needLevel === 'medium' ? 5 : 1;
    
    // Bônus se o hospital de origem tiver excesso
    const sourceAvailability = maxQuantity / 
      (sourceResources?.equipmentStatus[resourceType as keyof typeof sourceResources.equipmentStatus]?.total || 10);
    if (sourceAvailability > 0.3) score += 3;
    
    // Penalidade baseada na distância/tempo
    if (routeInfo && routeInfo.estimatedTime > 120) score -= 3;
    else if (routeInfo && routeInfo.estimatedTime > 60) score -= 1;
    
    return Math.max(1, Math.min(10, score));
  };
  
  useEffect(() => {
    // Ajustar quantidade quando o tipo de recurso mudar
    setQuantity(1);
  }, [resourceType, resourceCategory]);

  useEffect(() => {
    console.log('Recursos selecionados:', {
      resourceCategory,
      resourceType,
      maxQuantity: getMaximumTransferQuantity()
    });
  }, [resourceCategory, resourceType, sourceResources]);

  console.log('Recursos disponíveis:', sourceResources);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-white mb-6">
          Transferência de Recursos
        </h2>
        
        <div className="space-y-5">
          <div className="flex space-x-3 items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">De</p>
              <p className="text-white font-medium">{sourceHospital?.name}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-gray-500 mx-2" />
            <div>
              <p className="text-gray-300 text-sm">Para</p>
              <select
                className="bg-gray-700 text-white rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                {targetHospitals.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Categoria</label>
              <select
                className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value as 'equipment' | 'supplies')}
              >
                <option value="equipment">Equipamentos</option>
                <option value="supplies">Suprimentos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tipo de Recurso</label>
              <select
                className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                {getResourceTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantidade</label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-400">/ {maxQuantity} disponíveis</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Prioridade</label>
            <select
              className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
            >
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          
          {routeInfo && (
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <h3 className="text-white font-medium">Análise da Transferência</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-600/50 p-3 rounded-md text-center">
                  <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-gray-200 text-xs">Tempo Estimado</p>
                  <p className="text-white font-medium">{routeInfo.estimatedTime} min</p>
                </div>
                
                <div className="bg-gray-600/50 p-3 rounded-md text-center">
                  <DollarSign className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <p className="text-gray-200 text-xs">Custo Estimado</p>
                  <p className="text-white font-medium">R$ {routeInfo.estimatedCost}</p>
                </div>
                
                <div className="bg-gray-600/50 p-3 rounded-md text-center">
                  <div className="relative mx-auto mb-1 h-5 w-5">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    {needLevel === 'high' && (
                      <span className="absolute -top-1 -right-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      </span>
                    )}
                  </div>
                  <p className="text-gray-200 text-xs">Eficiência</p>
                  <div className="flex items-center justify-center space-x-1">
                    {Array.from({length: 10}).map((_, i) => (
                      <div 
                        key={i}
                        className={`h-1 w-1 rounded-full ${
                          i < transferEfficiencyScore() 
                            ? 'bg-green-400' 
                            : 'bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  needLevel === 'high' ? 'bg-red-500' :
                  needLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-300">
                  Nível de necessidade no destino: 
                  <span className={
                    needLevel === 'high' ? 'text-red-400 ml-1' :
                    needLevel === 'medium' ? 'text-yellow-400 ml-1' : 'text-green-400 ml-1'
                  }>
                    {needLevel === 'high' ? 'Alta' :
                     needLevel === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!targetHospital || quantity <= 0 || quantity > maxQuantity}
              className={`flex-1 py-2 px-4 rounded-md ${
                !targetHospital || quantity <= 0 || quantity > maxQuantity
                  ? 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              Iniciar Transferência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
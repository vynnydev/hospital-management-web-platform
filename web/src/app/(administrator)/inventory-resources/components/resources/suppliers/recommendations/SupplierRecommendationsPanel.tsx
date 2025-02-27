import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Building, Clock, Star, Truck, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';

// Definição de tipos detalhada
interface ISupplierCoordinates {
  lat: number;
  lng: number;
}

interface ISupplierContactInfo {
  phone: string;
  email: string;
  website?: string;
}

interface ISupplier {
  id: string;
  name: string;
  coordinates: ISupplierCoordinates;
  distance: number;
  contactInfo: ISupplierContactInfo;
  rating: 1 | 2 | 3 | 4 | 5;
}

interface ISupplierRecommendation {
  supplier: ISupplier;
  resourceType: string;
  category: 'equipment' | 'supplies';
  inStock: boolean;
  estimatedDelivery: number;
  price: number;
  priorityScore: number;
}

interface ISupplierRecommendationsPanelProps {
  recommendations: ISupplierRecommendation[];
  loading: boolean;
  onContactSupplier: (supplierId: string, resourceType: string) => void;
  onShowRoute?: (supplierId: string, coordinates: ISupplierCoordinates) => void;
  selectedSupplierId?: string | null;
  className?: string;
  hospitalId?: string;
  hospitalName?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const SupplierRecommendationsPanel: React.FC<ISupplierRecommendationsPanelProps> = ({
  recommendations,
  loading,
  onContactSupplier,
  onShowRoute,
  selectedSupplierId,
  className = '',
  hospitalId,
  hospitalName
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Não expandido por padrão
  
  // Agrupar recomendações por tipo de recurso com tipos explícitos
  const groupedRecommendations = recommendations.reduce<Record<string, ISupplierRecommendation[]>>((acc, rec) => {
    if (!acc[rec.resourceType]) {
      acc[rec.resourceType] = [];
    }
    acc[rec.resourceType].push(rec);
    return acc;
  }, {});
  
  if (loading) {
    return (
      <div className={`w-full bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 ${className}`}>
        <div className="p-3 cursor-pointer flex justify-between items-center bg-gray-800 dark:bg-gray-700 text-white">
          <h3 className="text-sm font-semibold flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Recomendações de Fornecedores
            {hospitalName && (
              <span className="ml-2 text-xs text-gray-400">
                {hospitalName}
              </span>
            )}
          </h3>
          <div className="animate-pulse bg-gray-700 h-5 w-5 rounded-full"></div>
        </div>
        <div className="p-4 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`w-full bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 ${className}`}>
        <div className="p-3 cursor-pointer flex justify-between items-center bg-gray-800 dark:bg-gray-700 text-white">
          <h3 className="text-sm font-semibold flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Recomendações de Fornecedores
            {hospitalName && (
              <span className="ml-2 text-xs text-gray-400">
                {hospitalName}
              </span>
            )}
          </h3>
          <div className="flex items-center">
            <span className="text-xs bg-gray-600 rounded-full px-2 py-0.5 mr-2">
              0
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4 text-center text-sm text-gray-400">
          Nenhum fornecedor encontrado para os recursos necessários.
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 ${className}`}>
      <div 
        className="p-3 cursor-pointer flex justify-between items-center bg-gray-800 dark:bg-gray-700 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-semibold flex items-center">
          <Building className="h-4 w-4 mr-2" />
          Recomendações de Fornecedores
          {hospitalName && (
            <span className="ml-2 text-xs text-gray-400">
              {hospitalName}
            </span>
          )}
        </h3>
        <div className="flex items-center">
          <span className="text-xs bg-red-600 rounded-full px-2 py-0.5 mr-2">
            {recommendations.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="max-h-[400px] overflow-y-auto">
          {Object.entries(groupedRecommendations).map(([resourceType, groupRecommendations]) => (
            <div key={resourceType} className="border-b border-gray-700 last:border-b-0">
              <div className="p-2 bg-gray-800 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm font-medium text-white capitalize">
                  {resourceType.replace('_', ' ')}
                </span>
                <span className="ml-auto text-xs bg-gray-700 rounded px-2 py-0.5">
                  {groupRecommendations.length}
                </span>
              </div>
              
              {groupRecommendations.map((rec: ISupplierRecommendation, index: number) => (
                <div 
                  key={`${rec.supplier.id}-${index}`}
                  className={`p-3 hover:bg-gray-800/50 transition-colors cursor-pointer
                    ${selectedSupplierId === rec.supplier.id ? 'bg-gray-800/70 border-l-4 border-purple-500' : ''}`}
                  onClick={() => onShowRoute && onShowRoute(rec.supplier.id, rec.supplier.coordinates)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">{rec.supplier.name}</h4>
                    <div className="flex items-center">
                      {[...Array(rec.supplier.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-gray-400 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{rec.supplier.distance} km</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{rec.estimatedDelivery}h</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Truck className="h-3 w-3 mr-1" />
                      <span>{rec.inStock ? 'Em estoque' : 'Sob encomenda'}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <span className="font-medium text-white">{formatCurrency(rec.price)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex space-x-2">
                    <button 
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${rec.supplier.contactInfo.phone}`);
                      }}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Ligar
                    </button>
                    <button 
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${rec.supplier.contactInfo.email}`);
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </button>
                    <button 
                      className={`text-xs ${
                        selectedSupplierId === rec.supplier.id 
                          ? 'bg-purple-700 hover:bg-purple-800' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white py-1 px-2 rounded flex items-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowRoute && onShowRoute(rec.supplier.id, rec.supplier.coordinates);
                      }}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Rota
                    </button>
                    <button 
                      className="text-xs ml-auto bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactSupplier(rec.supplier.id, rec.resourceType);
                      }}
                    >
                      Contatar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
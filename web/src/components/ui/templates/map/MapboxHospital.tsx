/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building2 } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { IResourceRouteAnalysis, IResourceRouteRecommendation, IRouteDetails, TEquipmentType } from '@/types/resource-route-analysis-types';
import { calculateDistance } from '@/utils/calculateDistance';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface IMapboxHospitalProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  currentUser: IAppUser | null;
  activeRoute: { sourceId: string; targetId: string; } | null;
  resourceRouteAnalysis: IResourceRouteAnalysis;
}

export const MapboxHospital: React.FC<IMapboxHospitalProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  activeRoute,
  resourceRouteAnalysis
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routeSource = useRef<mapboxgl.GeoJSONSource | null>(null);
  const alternativeRoutes = useRef<{[key: string]: mapboxgl.GeoJSONSource}>({});
  const [mapLoaded, setMapLoaded] = useState(false);


  const clearRoutes = useCallback(() => {
    if (!map.current?.isStyleLoaded()) return;
  
    try {
      // Remove layers primeiro
      const layers = map.current.getStyle()?.layers || [];
      layers.forEach(layer => {
        if (layer.id.startsWith('route-line-')) {
          map.current?.removeLayer(layer.id);
        }
      });
  
      // Depois remove sources
      const sources = Object.keys(map.current.getStyle()?.sources || {});
      sources.forEach(sourceId => {
        if (sourceId.startsWith('route-')) {
          map.current?.removeSource(sourceId);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar rotas:', error);
    }
  }, []);

  // Lógca motor principal que renderiza as rotas entre os hospitais
  const renderHospitalRoutes = useCallback(async () => {
    if (!map.current || !selectedHospital) return;
  
    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (!selectedHospitalData) return;
  
    // Limpa rotas existentes
    clearRoutes();
  
    // Verifica os recursos do hospital selecionado
    const selectedHospitalResources = resourceRouteAnalysis.getHospitalResources(selectedHospital);
    if (!selectedHospitalResources) return;
  
    // Verifica equipamentos críticos
    const criticalResources: Array<{type: TEquipmentType; available: number; total: number}> = [];
    
    Object.entries(selectedHospitalResources.equipmentStatus).forEach(([type, status]) => {
      const availabilityRate = status.available / status.total;
      if (availabilityRate < 0.3) { // Menos de 30% disponível é considerado crítico
        criticalResources.push({
          type: type as TEquipmentType,
          available: status.available,
          total: status.total
        });
      }
    });
  
    // Para cada recurso crítico, busca o hospital mais próximo com disponibilidade
    for (const resource of criticalResources) {
      // Encontra hospitais com disponibilidade do recurso
      const availableHospitals = hospitals.filter(h => {
        if (h.id === selectedHospital) return false;
  
        const hospitalResources = resourceRouteAnalysis.getHospitalResources(h.id);
        if (!hospitalResources) return false;
  
        const equipStatus = hospitalResources.equipmentStatus[resource.type];
        const availabilityRate = equipStatus.available / equipStatus.total;
        
        return availabilityRate > 0.5; // Hospital deve ter mais de 50% disponível para transferir
      });
  
      // Ordena por distância
      const sortedHospitals = availableHospitals.sort((a, b) => {
        const distA = calculateDistance(
          selectedHospitalData.unit.coordinates.lat,
          selectedHospitalData.unit.coordinates.lng,
          a.unit.coordinates.lat,
          a.unit.coordinates.lng
        );
        const distB = calculateDistance(
          selectedHospitalData.unit.coordinates.lat,
          selectedHospitalData.unit.coordinates.lng,
          b.unit.coordinates.lat,
          b.unit.coordinates.lng
        );
        return distA - distB;
      });
  
      if (sortedHospitals.length > 0) {
        const nearestHospital = sortedHospitals[0];
        const routeId = `route-${resource.type}-${nearestHospital.id}-${selectedHospital}`;
  
        try {
          // Busca a rota do Mapbox
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/` +
            `${nearestHospital.unit.coordinates.lng},${nearestHospital.unit.coordinates.lat};` +
            `${selectedHospitalData.unit.coordinates.lng},${selectedHospitalData.unit.coordinates.lat}` +
            `?geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
  
          const data = await response.json();
  
          if (data.routes?.[0]?.geometry) {
            // Adiciona a fonte
            map.current.addSource(routeId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {
                  resourceType: resource.type,
                  severity: 'critical'
                },
                geometry: data.routes[0].geometry
              }
            });
  
            // Adiciona a camada com estilo mais visível
            map.current.addLayer({
              id: `route-line-${routeId}`,
              type: 'line',
              source: routeId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
                'visibility': 'visible'
              },
              paint: {
                'line-color': '#EF4444', // Vermelho para rotas críticas
                'line-width': 5,
                'line-opacity': 0.8,
                'line-dasharray': [2, 1]
              }
            });
  
            // Ajusta a visualização para mostrar a rota completa
            const bounds = new mapboxgl.LngLatBounds();
            data.routes[0].geometry.coordinates.forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
  
            map.current.fitBounds(bounds, {
              padding: 100,
              maxZoom: 12,
              duration: 1000
            });
          }
        } catch (error) {
          console.error('Erro ao buscar rota:', error);
        }
      }
    }
  }, [selectedHospital, hospitals, resourceRouteAnalysis, clearRoutes]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;
  
    // Pequeno delay para garantir que o mapa está pronto
    setTimeout(() => {
      renderHospitalRoutes();
    }, 500);
    
  }, [selectedHospital, mapLoaded, renderHospitalRoutes]);
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Modifique o useEffect que inicializa o mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = () => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-46.6388, -23.5489],
        zoom: 10,
        dragPan: true,
        scrollZoom: true,
        dragRotate: true,
        interactive: true,
        doubleClickZoom: true
      });

      // Aguarda o estilo carregar antes de adicionar sources e layers
      map.current.on('style.load', () => {
        setMapLoaded(true);

        // Adiciona a fonte da rota principal
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Adiciona a camada da rota
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'routeType'],
              'hospital', '#3182CE',
              'supplier', '#48BB78',
              '#3182CE'
            ],
            'line-width': 4,
            'line-opacity': [
              'match',
              ['get', 'priority'],
              'high', 1,
              'medium', 0.7,
              0.5
            ]
          }
        });

        // Adiciona a fonte de range
        map.current?.addSource('range', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [-46.6388, -23.5489]
            }
          }
        });

        // Adiciona a camada de range
        map.current?.addLayer({
          id: 'range',
          type: 'circle',
          source: 'range',
          paint: {
            'circle-radius': 50,
            'circle-color': '#3182CE',
            'circle-opacity': 0.1,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#3182CE'
          }
        });

        routeSource.current = map.current?.getSource('route') as mapboxgl.GeoJSONSource;
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    };

    // Inicializa o mapa com tratamento de erro
    try {
      initializeMap();
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }

    return () => {
      try {
        markers.current.forEach(marker => marker.remove());
        map.current?.remove();
        map.current = null;
      } catch (error) {
        console.error('Erro ao limpar mapa:', error);
      }
    };
  }, []);

  // Função para criar o HTML do marcador do hospital
  const createHospitalMarker = useCallback((hospital: IHospital) => {
    const el = document.createElement('div');
    el.className = 'hospital-marker';
    
    // Adiciona z-index mais alto para garantir que fique sobre outras camadas
    el.style.zIndex = '999';
    
    // Verifica recursos críticos
    const resourceStatus = resourceRouteAnalysis.getPriorityLevel(hospital.id);
    const statusColors = {
      critical: 'bg-red-500',
      warning: 'bg-yellow-500',
      normal: 'bg-green-500'
    };
    
    // Atualiza o HTML para garantir que o card fique visível
    el.innerHTML = `
      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max">
        <div class="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 ${statusColors[resourceStatus]} rounded-full flex items-center justify-center">
                <Building2 class="h-6 w-6 text-white" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">${hospital.name}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">${hospital.unit.address}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">${hospital.unit.city}, ${hospital.unit.state}</p>
              <div class="mt-2 flex items-center">
                <div class="px-2 py-1 ${statusColors[resourceStatus]} bg-opacity-20 rounded-full">
                  <span class="text-sm font-medium ${resourceStatus === 'critical' ? 'text-red-700' : 
                    resourceStatus === 'warning' ? 'text-yellow-700' : 'text-green-700'}">
                    ${hospital.metrics.overall.occupancyRate}% Ocupação
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return el;
  }, [resourceRouteAnalysis]);

  // Adiciona marcadores dos hospitais
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    hospitals.forEach(hospital => {
      const el = createHospitalMarker(hospital);

      el.addEventListener('click', () => {
        setSelectedHospital(hospital.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hospital.unit.coordinates.lng, hospital.unit.coordinates.lat])
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Ajusta o mapa para mostrar todos os hospitais
    if (hospitals.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      hospitals.forEach(hospital => {
        bounds.extend([
          hospital.unit.coordinates.lng,
          hospital.unit.coordinates.lat
        ]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [hospitals, mapLoaded, setSelectedHospital, createHospitalMarker]);

  // Atualiza visualização e rotas quando um hospital é selecionado
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) {
      clearRoutes();
      return;
    }

    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (!selectedHospitalData) return;

    // Centraliza no hospital selecionado primeiro
    map.current.easeTo({
      center: [
        selectedHospitalData.unit.coordinates.lng, 
        selectedHospitalData.unit.coordinates.lat
      ],
      zoom: 13,
      duration: 800
    });

    // Aguarda a animação terminar antes de renderizar as rotas
    setTimeout(() => {
      renderHospitalRoutes();
    }, 800);

  }, [selectedHospital, hospitals, mapLoaded, renderHospitalRoutes, clearRoutes]);


  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden shadow-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Carregando mapa...</span>
        </div>
      )}
    </div>
  );
};

/* Para o componente de mapa de recursos */
const globalStyles = `
  .hospital-marker {
    position: relative;
    z-index: 1;
  }

  .hospital-marker:hover {
    z-index: 2;
  }

  .mapboxgl-marker {
    z-index: 1;
  }

  .mapboxgl-marker:hover {
    z-index: 2;
  }
`;
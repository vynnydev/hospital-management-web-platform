/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building2 } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { IResourceRouteAnalysis, IResourceRouteRecommendation, IRouteDetails } from '@/types/resource-route-analysis-types';
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

  // Função para buscar e renderizar rotas no mapa
  const getDirections = useCallback(async (
    source: IHospital,
    target: IHospital,
    primaryRoute: IResourceRouteRecommendation
  ) => {
    if (!map.current || !routeSource.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${source.unit.coordinates.lng},${source.unit.coordinates.lat};` +
        `${target.unit.coordinates.lng},${target.unit.coordinates.lat}` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        // Atualiza rota principal
        routeSource.current.setData({
          type: 'Feature',
          properties: {
            routeType: 'hospital',
            priority: primaryRoute.priority,
            trafficLevel: primaryRoute.routeDetails.trafficLevel
          },
          geometry: data.routes[0].geometry
        });

        // Renderiza rotas alternativas se existirem
        if (primaryRoute.routeDetails.alternativeRoutes.length > 0) {
          renderAlternativeRoutes(primaryRoute.routeDetails.alternativeRoutes);
        }

        // Ajusta a visualização do mapa
        const bounds = new mapboxgl.LngLatBounds();
        data.routes[0].geometry.coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
        
        map.current.fitBounds(bounds, {
          padding: 80,
          maxZoom: 14
        });
      }
    } catch (error) {
      console.error('Erro ao buscar direções:', error);
      
      // Fallback: renderiza linha reta entre os pontos
      routeSource.current.setData({
        type: 'Feature',
        properties: {
          routeType: 'hospital',
          priority: primaryRoute.priority,
          trafficLevel: primaryRoute.routeDetails.trafficLevel
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [source.unit.coordinates.lng, source.unit.coordinates.lat],
            [target.unit.coordinates.lng, target.unit.coordinates.lat]
          ]
        }
      });

      // Mesmo com o erro, ainda renderiza rotas alternativas
      if (primaryRoute.routeDetails.alternativeRoutes.length > 0) {
        renderAlternativeRoutes(primaryRoute.routeDetails.alternativeRoutes);
      }
    }
  }, []);

  // Lógca motor principal que renderiza as rotas entre os hospitais
  const renderRoutes = useCallback(async () => {
    if (!map.current || !selectedHospital) return;
  
    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (!selectedHospitalData) return;
  
    // 1. Primeiro verifica recursos críticos do hospital selecionado
    const hospitalStatus = resourceRouteAnalysis.getPriorityLevel(selectedHospital);
    const criticalShortages = resourceRouteAnalysis.getHospitalShortages(selectedHospital)
      .filter(shortage => shortage.severity === 'critical');
  
    if (criticalShortages.length > 0) {
      // 2. Para cada recurso crítico, encontra o hospital mais próximo com disponibilidade
      for (const shortage of criticalShortages) {
        // Encontra hospitais com recursos disponíveis
        const availableHospitals = hospitals.filter(h => {
          if (h.id === selectedHospital) return false;
  
          const resources = resourceRouteAnalysis.getHospitalResources?.(h.id);
          if (!resources) return false;
  
          // Verifica se tem disponibilidade do recurso necessário
          const equipmentStatus = resources.equipmentStatus[shortage.resourceRouteType];
          return equipmentStatus && (equipmentStatus.available / equipmentStatus.total) > 0.3;
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
  
        // Renderiza rota para o hospital mais próximo com recursos
        if (sortedHospitals.length > 0) {
          const nearestHospital = sortedHospitals[0];
          
          try {
            const response = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/` +
              `${nearestHospital.unit.coordinates.lng},${nearestHospital.unit.coordinates.lat};` +
              `${selectedHospitalData.unit.coordinates.lng},${selectedHospitalData.unit.coordinates.lat}` +
              `?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
            
            const data = await response.json();
            
            if (data.routes?.[0]?.geometry?.coordinates) {
              const routeId = `route-${selectedHospital}-${nearestHospital.id}-${shortage.resourceRouteType}`;
              
              // Adiciona a fonte da rota
              if (!map.current?.getSource(routeId)) {
                map.current?.addSource(routeId, {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {
                      type: 'hospital',
                      priority: 'high',
                      resourceType: shortage.resourceRouteType
                    },
                    geometry: data.routes[0].geometry
                  }
                });
  
                // Adiciona a camada da rota
                map.current?.addLayer({
                  id: `route-line-${routeId}`,
                  type: 'line',
                  source: routeId,
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': [
                      'match',
                      ['get', 'resourceType'],
                      'respirators', '#EF4444', // Vermelho para respiradores
                      'monitors', '#F59E0B',    // Amarelo para monitores
                      'defibrillators', '#3B82F6', // Azul para desfibriladores
                      '#10B981' // Verde para outros
                    ],
                    'line-width': 4,
                    'line-opacity': 0.8,
                    'line-dasharray': [1, 1]
                  }
                });
  
                // Ajusta a visualização para mostrar a rota completa
                const bounds = new mapboxgl.LngLatBounds();
                data.routes[0].geometry.coordinates.forEach((coord: [number, number]) => {
                  bounds.extend(coord);
                });
  
                map.current?.fitBounds(bounds, {
                  padding: 100,
                  maxZoom: 12
                });
              }
            }
          } catch (error) {
            console.error('Erro ao buscar rota:', error);
          }
        }
      }
    }
  }, [selectedHospital, hospitals, resourceRouteAnalysis]);

  // Função para renderizar rotas alternativas
  const renderAlternativeRoutes = useCallback((routes: Array<{
    hospitalId: string;
    coordinates: [number, number][];
    distance: number;
    estimatedTime: number;
  }>) => {
    if (!map.current) return;

    // Remove rotas alternativas antigas
    Object.keys(alternativeRoutes.current).forEach(key => {
      if (map.current?.getLayer(`route-alt-${key}`)) {
        map.current.removeLayer(`route-alt-${key}`);
      }
      if (map.current?.getSource(`route-alt-${key}`)) {
        map.current.removeSource(`route-alt-${key}`);
      }
    });
    alternativeRoutes.current = {};

    // Adiciona novas rotas alternativas
    routes.forEach((route, index) => {
      const sourceId = `route-alt-${index}`;

      // Adiciona fonte
      map.current?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates
          }
        }
      });

      // Adiciona camada
      map.current?.addLayer({
        id: `route-alt-${index}`,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#718096',
          'line-width': 2,
          'line-opacity': 0.5,
          'line-dasharray': [2, 2]
        }
      });

      // Armazena referência da fonte
      alternativeRoutes.current[index] = map.current?.getSource(sourceId) as mapboxgl.GeoJSONSource;
    });
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Inicializa o mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-46.6388, -23.5489], // São Paulo
      zoom: 10
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Adiciona fonte e camada para rota principal
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
            'hospital', '#3182CE',  // Azul para rotas entre hospitais
            'supplier', '#48BB78',  // Verde para rotas de fornecedores
            '#3182CE'  // Cor padrão
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

      // Adiciona camada para área de alcance
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

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
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

  const clearRoutes = useCallback(() => {
    if (!map.current) return;
  
    // Primeiro, obter todas as layers
    const layers = map.current.getStyle()?.layers;
    if (!layers) return;
  
    // Remover layers de rota
    layers.forEach(layer => {
      if (layer.id.startsWith('route-line-')) {
        try {
          map.current?.removeLayer(layer.id);
        } catch (error) {
          console.warn(`Failed to remove layer ${layer.id}:`, error);
        }
      }
    });
  
    // Remover sources de rota
    const sources = map.current.getStyle()?.sources;
    if (!sources) return;
  
    Object.keys(sources).forEach(sourceId => {
      if (sourceId.startsWith('route-')) {
        try {
          map.current?.removeSource(sourceId);
        } catch (error) {
          console.warn(`Failed to remove source ${sourceId}:`, error);
        }
      }
    });
  }, []);

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

  // Atualiza visualização quando um hospital é selecionado
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;

    clearRoutes();
  
    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (!selectedHospitalData) return;
  
    // Primeiro centraliza no hospital selecionado
    map.current.easeTo({
      center: [
        selectedHospitalData.unit.coordinates.lng, 
        selectedHospitalData.unit.coordinates.lat
      ],
      zoom: 14,
      duration: 1500
    });
  
    // Verifica se o hospital tem recursos críticos
    const hospitalStatus = resourceRouteAnalysis.getPriorityLevel(selectedHospital);
    
    if (hospitalStatus === 'critical') {
      // Busca recomendações de transferência
      const recommendations = resourceRouteAnalysis.getRecommendedTransfers(selectedHospital);
      
      // Renderiza rotas para hospitais e fornecedores após a animação de zoom
      setTimeout(async () => {
        // Array para armazenar todas as coordenadas das rotas
        const allRouteCoords: [number, number][] = [];
  
        // Renderiza rotas para hospitais próximos com recursos
        if (recommendations.length > 0) {
          for (const route of recommendations) {
            const source = hospitals.find(h => h.id === route.sourceHospitalId);
            const target = hospitals.find(h => h.id === route.targetHospitalId);
            
            if (source && target) {
              try {
                // Busca rota do Mapbox
                const response = await fetch(
                  `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                  `${source.unit.coordinates.lng},${source.unit.coordinates.lat};` +
                  `${target.unit.coordinates.lng},${target.unit.coordinates.lat}` +
                  `?geometries=geojson&access_token=${mapboxgl.accessToken}`
                );
                
                const data = await response.json();
                
                if (data.routes?.[0]?.geometry?.coordinates) {
                  // Adiciona coordenadas da rota
                  allRouteCoords.push(...data.routes[0].geometry.coordinates);
                  
                  // Adiciona fonte e camada para esta rota
                  const routeId = `route-${source.id}-${target.id}`;
                  
                  if (!map.current?.getSource(routeId)) {
                    map.current?.addSource(routeId, {
                      type: 'geojson',
                      data: {
                        type: 'Feature',
                        properties: {
                          type: 'hospital',
                          priority: route.priority,
                          trafficLevel: route.routeDetails.trafficLevel
                        },
                        geometry: data.routes[0].geometry
                      }
                    });
  
                    map.current?.addLayer({
                      id: `route-line-${routeId}`,
                      type: 'line',
                      source: routeId,
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                      },
                      paint: {
                        'line-color': route.priority === 'high' ? '#EF4444' : '#3B82F6',
                        'line-width': 3,
                        'line-opacity': 0.8
                      }
                    });
                  }
                }
              } catch (error) {
                console.error('Erro ao buscar rota:', error);
              }
            }
          }
        }
  
        // Adiciona rotas para fornecedores próximos
        const supplierRecommendations = resourceRouteAnalysis.getSupplierRecommendations?.(selectedHospital);
        
        if (supplierRecommendations?.length > 0) {
          for (const supplier of supplierRecommendations) {
            try {
              const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                `${supplier.coordinates[0]},${supplier.coordinates[1]};` +
                `${selectedHospitalData.unit.coordinates.lng},${selectedHospitalData.unit.coordinates.lat}` +
                `?geometries=geojson&access_token=${mapboxgl.accessToken}`
              );
              
              const data = await response.json();
              
              if (data.routes?.[0]?.geometry?.coordinates) {
                allRouteCoords.push(...data.routes[0].geometry.coordinates);
                
                const routeId = `route-supplier-${supplier.id}`;
                
                if (!map.current?.getSource(routeId)) {
                  map.current?.addSource(routeId, {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      properties: {
                        type: 'supplier',
                        availability: supplier.availability
                      },
                      geometry: data.routes[0].geometry
                    }
                  });
  
                  map.current?.addLayer({
                    id: `route-line-${routeId}`,
                    type: 'line',
                    source: routeId,
                    layout: {
                      'line-join': 'round',
                      'line-cap': 'round'
                    },
                    paint: {
                      'line-color': '#10B981', // Verde para fornecedores
                      'line-width': 3,
                      'line-opacity': 0.8,
                      'line-dasharray': [2, 1] // Linha tracejada
                    }
                  });
                }
              }
            } catch (error) {
              console.error('Erro ao buscar rota do fornecedor:', error);
            }
          }
        }
  
        // Ajusta a visualização para mostrar todas as rotas
        if (allRouteCoords.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          allRouteCoords.forEach(coord => bounds.extend(coord));
          
          map.current?.fitBounds(bounds, {
            padding: 100,
            maxZoom: 13
          });
        }
      }, 1500); // Aguarda a animação inicial
    }
  }, [selectedHospital, hospitals, mapLoaded, resourceRouteAnalysis]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;
  
    clearRoutes();
  
    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (!selectedHospitalData) return;
  
    // Primeiro centraliza no hospital selecionado
    map.current.easeTo({
      center: [
        selectedHospitalData.unit.coordinates.lng, 
        selectedHospitalData.unit.coordinates.lat
      ],
      zoom: 14,
      duration: 1500
    });
  
    // Aguarda a animação e então renderiza as rotas
    setTimeout(() => {
      if (map.current?.isStyleLoaded()) {
        renderRoutes();
      } else {
        // Se o estilo ainda não estiver carregado, aguarda
        const checkStyle = setInterval(() => {
          if (map.current?.isStyleLoaded()) {
            clearInterval(checkStyle);
            renderRoutes();
          }
        }, 100);
      }
    }, 1500);
  
  }, [selectedHospital, hospitals, mapLoaded, resourceRouteAnalysis, renderRoutes, clearRoutes]);

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
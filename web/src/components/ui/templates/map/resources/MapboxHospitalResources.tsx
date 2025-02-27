/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Building2, Store } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { IResourceRouteAnalysis, IResourceRouteRecommendation, IRouteDetails, TEquipmentType } from '@/types/resource-route-analysis-types';
import { calculateDistance } from '@/utils/calculateDistance';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface IMapboxHospitalResourcesProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  currentUser: IAppUser | null;
  activeRoute: { sourceId: string; targetId: string } | null;
  resourceRouteAnalysis: IResourceRouteAnalysis;
  // Propriedades para rotas de fornecedores
  supplierRoute: {
    supplierId: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    distance?: number;
    duration?: number;
    supplierName?: string;
  } | null;
  onClearSupplierRoute: () => void;
  onRouteCalculated?: (distance: number, duration: number) => void;
  showBothRoutes?: boolean;
}

export const MapboxHospitalResouces: React.FC<IMapboxHospitalResourcesProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  activeRoute,
  resourceRouteAnalysis,
  supplierRoute,
  onClearSupplierRoute,
  onRouteCalculated,
  showBothRoutes
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const supplierMarker = useRef<mapboxgl.Marker | null>(null);
  const routeSource = useRef<mapboxgl.GeoJSONSource | null>(null);
  const supplierRouteSource = useRef<mapboxgl.GeoJSONSource | null>(null);
  const alternativeRoutes = useRef<{[key: string]: mapboxgl.GeoJSONSource}>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Estado para controlar quando o zoom já foi ajustado
  const [mapViewAdjusted, setMapViewAdjusted] = useState(false);

  // Função para limpar apenas a rota do fornecedor sem afetar as rotas de transferência
  const clearSupplierRoute = useCallback(() => {
    if (!map.current?.isStyleLoaded()) return;
  
    try {
      // Limpar apenas a fonte de dados da rota do fornecedor
      if (map.current.getSource('supplier-route')) {
        (map.current.getSource('supplier-route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });
      }
      
      // Remover o marcador do fornecedor se existir
      if (supplierMarker.current) {
        supplierMarker.current.remove();
        supplierMarker.current = null;
      }
    } catch (error) {
      console.warn('Erro ao limpar rota do fornecedor:', error);
    }
  }, []);

  // Função para limpar rotas de transferência sem afetar a rota do fornecedor
  const clearRoutes = useCallback(() => {
    if (!map.current?.isStyleLoaded()) return;
  
    try {
      // Remove layers primeiro, mas apenas aqueles que começam com 'route-line-'
      // deixando 'supplier-route-line' intacto
      const layers = map.current.getStyle()?.layers || [];
      layers.forEach(layer => {
        if (layer.id.startsWith('route-line-') && !layer.id.includes('supplier')) {
          map.current?.removeLayer(layer.id);
        }
      });
  
      // Depois remove sources, mas apenas aqueles que NÃO são para fornecedores
      const sources = Object.keys(map.current.getStyle()?.sources || {});
      sources.forEach(sourceId => {
        if (sourceId.startsWith('route-') && !sourceId.includes('supplier')) {
          map.current?.removeSource(sourceId);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar rotas:', error);
    }
  }, []);

  // Lógica do motor principal que renderiza as rotas entre os hospitais
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
            // Quando for ajustar o zoom, verifique se já foi ajustado
            if (!mapViewAdjusted) {
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
              
              // Marca que o zoom já foi ajustado
              setMapViewAdjusted(true);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar rota:', error);
        }
      }
    }
  }, [selectedHospital, hospitals, resourceRouteAnalysis, clearRoutes, mapViewAdjusted]);

  // Função para renderizar rota até o fornecedor
  const renderSupplierRoute = useCallback(async () => {
    if (!map.current || !map.current.isStyleLoaded() || !selectedHospital || !supplierRoute) {
      return;
    }

    // Limpa apenas a rota anterior do fornecedor, sem afetar rotas de transferência
    clearSupplierRoute();

    // Encontra o hospital selecionado
    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return;

    // Verifica se a fonte da rota do fornecedor já existe
    if (!map.current.getSource('supplier-route')) {
      // Adiciona a fonte se não existir
      map.current.addSource('supplier-route', {
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

      // Adiciona camada para a rota do fornecedor
      map.current.addLayer({
        id: 'supplier-route-line',
        type: 'line',
        source: 'supplier-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#9C27B0', // Roxo para rotas de fornecedores
          'line-width': 5,
          'line-opacity': 0.8
        }
      });

      supplierRouteSource.current = map.current.getSource('supplier-route') as mapboxgl.GeoJSONSource;
    }

    try {
      // Tenta obter a rota real usando a API do Mapbox
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${hospital.unit.coordinates.lng},${hospital.unit.coordinates.lat};` +
        `${supplierRoute.coordinates.lng},${supplierRoute.coordinates.lat}` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Atualiza a fonte com a rota
        (map.current.getSource('supplier-route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {
            routeType: 'supplier'
          },
          geometry: route.geometry
        });

        // Calcula distância e duração
        const distance = route.distance / 1000; // metros para km
        const duration = Math.round(route.duration / 60); // segundos para minutos

        // Notifica o componente pai sobre a distância e duração calculadas
        if (onRouteCalculated) {
          onRouteCalculated(distance, duration);
        }

        // Ajusta o mapa para mostrar toda a rota
        // Quando for ajustar o zoom, verifique se já foi ajustado
        if (!mapViewAdjusted) {
          // Ajusta o mapa para mostrar toda a rota
          const bounds = new mapboxgl.LngLatBounds();
          route.geometry.coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });

          map.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 12,
            duration: 1000
          });
          
          // Marca que o zoom já foi ajustado
          setMapViewAdjusted(true);
        }

        // Adiciona o marcador do fornecedor
        const el = document.createElement('div');
        el.className = 'supplier-marker';
        el.innerHTML = `
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max">
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                      <path d="M3 9V6a2 2 0 0 1 2-2h2"></path>
                      <path d="M15 4h2a2 2 0 0 1 2 2v3"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 dark:text-white">${supplierRoute.supplierName || 'Fornecedor'}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">${distance.toFixed(1)} km - ${duration} min</p>
                  <div class="mt-2">
                    <button class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 clear-route-btn">
                      Limpar Rota
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        // Adiciona evento ao botão dentro do marcador
        setTimeout(() => {
          const button = el.querySelector('.clear-route-btn');
          if (button) {
            button.addEventListener('click', () => {
              onClearSupplierRoute();
            });
          }
        }, 100);

        supplierMarker.current = new mapboxgl.Marker(el)
          .setLngLat([supplierRoute.coordinates.lng, supplierRoute.coordinates.lat])
          .addTo(map.current);
      }
    } catch (error) {
      console.error('Erro ao buscar rota para fornecedor:', error);
      
      // Fallback: usar linha reta se a API falhar
      const startPoint = [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat];
      const endPoint = [supplierRoute.coordinates.lng, supplierRoute.coordinates.lat];
      
      (map.current.getSource('supplier-route') as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {
          routeType: 'supplier'
        },
        geometry: {
          type: 'LineString',
          coordinates: [startPoint, endPoint]
        }
      });

      // Calcular distância aproximada (fórmula de Haversine)
      const R = 6371; // Raio da Terra em km
      const dLat = (supplierRoute.coordinates.lat - hospital.unit.coordinates.lat) * Math.PI / 180;
      const dLon = (supplierRoute.coordinates.lng - hospital.unit.coordinates.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(hospital.unit.coordinates.lat * Math.PI / 180) * 
        Math.cos(supplierRoute.coordinates.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Estimar duração (assumindo velocidade média de 50 km/h)
      const duration = Math.round(distance / 50 * 60);
      
      if (onRouteCalculated) {
        onRouteCalculated(parseFloat(distance.toFixed(1)), duration);
      }

      // Criar um marcador simples para o fornecedor
      const el = document.createElement('div');
      el.className = 'supplier-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
            <path d="M3 9V6a2 2 0 0 1 2-2h2"></path>
            <path d="M15 4h2a2 2 0 0 1 2 2v3"></path>
          </svg>
        </div>
      `;

      supplierMarker.current = new mapboxgl.Marker(el)
        .setLngLat([supplierRoute.coordinates.lng, supplierRoute.coordinates.lat])
        .addTo(map.current);

      // Ajustar a visualização do mapa
      const bounds = new mapboxgl.LngLatBounds(
        [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat],
        [supplierRoute.coordinates.lng, supplierRoute.coordinates.lat]
      );

      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 12,
        duration: 1000
      });
    }
  }, [selectedHospital, hospitals, supplierRoute, clearSupplierRoute, onRouteCalculated, mapViewAdjusted]);

  // Resete o estado de zoom quando o hospital selecionado mudar
  useEffect(() => {
    // Reset o estado de ajuste de zoom quando o hospital selecionado mudar
    setMapViewAdjusted(false);
  }, [selectedHospital]);

  // Crie um efeito único para ajustar a visualização do mapa uma única vez
  // quando tanto as rotas de hospital quanto de fornecedor forem renderizadas
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;
    
    // Só ajuste a visualização se tivermos tanto uma rota de hospital quanto uma rota de fornecedor
    if (supplierRoute && activeRoute && !mapViewAdjusted) {
      // Encontre o hospital selecionado e o hospital de origem
      const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
      const sourceHospitalData = hospitals.find(h => h.id === activeRoute.sourceId);
      
      if (selectedHospitalData && sourceHospitalData && supplierRoute) {
        // Crie um bounds que inclua todos os pontos relevantes
        const bounds = new mapboxgl.LngLatBounds();
        
        // Adicione o hospital selecionado
        bounds.extend([
          selectedHospitalData.unit.coordinates.lng,
          selectedHospitalData.unit.coordinates.lat
        ]);
        
        // Adicione o hospital de origem
        bounds.extend([
          sourceHospitalData.unit.coordinates.lng,
          sourceHospitalData.unit.coordinates.lat
        ]);
        
        // Adicione o fornecedor
        bounds.extend([
          supplierRoute.coordinates.lng,
          supplierRoute.coordinates.lat
        ]);
        
        // Ajuste a visualização uma única vez para mostrar todos os pontos
        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 11,
          duration: 1000
        });
        
        // Marca que o zoom já foi ajustado
        setMapViewAdjusted(true);
      }
    }
  }, [mapLoaded, selectedHospital, hospitals, supplierRoute, activeRoute, mapViewAdjusted]);

  // Efeito para renderizar rotas de hospital quando o hospital selecionado muda
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;
    
    setTimeout(() => {
      // Se tiver uma rota de fornecedor e não estivermos mostrando ambas, não renderizar as rotas de hospital
      if (supplierRoute && !showBothRoutes) return;
      
      renderHospitalRoutes();
    }, 500);
    
  }, [selectedHospital, mapLoaded, renderHospitalRoutes, supplierRoute, showBothRoutes]);

  // Efeito para renderizar rota do fornecedor quando o supplierRoute muda
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
  
    if (supplierRoute) {
      // NÃO limpar as rotas de hospital se showBothRoutes for true
      if (!showBothRoutes) {
        clearRoutes();
      }
      renderSupplierRoute();
    } else {
      // Limpa a rota do fornecedor
      clearSupplierRoute();
      
      // Reexibe as rotas do hospital se um hospital estiver selecionado
      if (selectedHospital) {
        renderHospitalRoutes();
      }
    }
  }, [supplierRoute, mapLoaded, renderSupplierRoute, clearSupplierRoute, selectedHospital, renderHospitalRoutes, clearRoutes, showBothRoutes]);
  
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

        // Adiciona fonte para a rota do fornecedor
        map.current?.addSource('supplier-route', {
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

        // Adiciona camada para a rota do fornecedor
        map.current?.addLayer({
          id: 'supplier-route-line',
          type: 'line',
          source: 'supplier-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#9C27B0', // Roxo para rotas de fornecedores
            'line-width': 5,
            'line-opacity': 0.8
          }
        });

        routeSource.current = map.current?.getSource('route') as mapboxgl.GeoJSONSource;
        supplierRouteSource.current = map.current?.getSource('supplier-route') as mapboxgl.GeoJSONSource;
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
        if (supplierMarker.current) {
          supplierMarker.current.remove();
        }
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
    if (!mapLoaded || !map.current || !selectedHospital) return;
    
    // Centraliza no hospital selecionado primeiro
    const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
    if (selectedHospitalData) {
      map.current.easeTo({
        center: [
          selectedHospitalData.unit.coordinates.lng, 
          selectedHospitalData.unit.coordinates.lat
        ],
        zoom: 13,
        duration: 800
      });
    }
  
    // Importante: Use setTimeout para garantir que as ações ocorram na ordem correta
    const timer = setTimeout(() => {
      console.log("Inicializando rotas:", { 
        selectedHospital, 
        supplierRoute: !!supplierRoute 
      });
      
      // Primeiro renderiza as rotas de transferência entre hospitais
      renderHospitalRoutes();
      
      // Depois renderiza a rota do fornecedor, se houver
      if (supplierRoute) {
        setTimeout(() => renderSupplierRoute(), 300);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedHospital, hospitals, mapLoaded, renderHospitalRoutes, renderSupplierRoute, supplierRoute]);

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
  
  .supplier-marker {
    position: relative;
    z-index: 3;
  }
  
  .supplier-marker:hover {
    z-index: 4;
  }

  .mapboxgl-marker {
    z-index: 1;
  }

  .mapboxgl-marker:hover {
    z-index: 2;
  }
`;
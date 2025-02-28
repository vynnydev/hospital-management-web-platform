/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Ambulance, LocateFixed, Navigation, Phone, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { IAmbulance, IAmbulanceRoute, IAmbulanceRequest, TRouteStatus, TEmergengyLevel } from '@/types/ambulance-types';
import { calculateDistance } from '@/utils/calculateDistance';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Cores para diferentes níveis de emergência
const emergencyColors = {
  low: '#60A5FA', // blue-400
  medium: '#FBBF24', // amber-400
  high: '#F59E0B', // amber-500
  critical: '#EF4444' // red-500
};

// Cores para status das ambulâncias
const ambulanceStatusColors = {
  available: '#10B981', // emerald-500
  dispatched: '#F59E0B', // amber-500
  returning: '#3B82F6', // blue-500
  maintenance: '#6B7280' // gray-500
};

export interface IMapboxAmbulancesProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  currentUser: IAppUser | null;
  ambulances: IAmbulance[];
  activeRoutes: IAmbulanceRoute[];
  pendingRequests: IAmbulanceRequest[];
  onUpdateRoute: (routeId: string, status: TRouteStatus) => void;
  onCreateRoute?: () => void;
}

export const MapboxAmbulances: React.FC<IMapboxAmbulancesProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  ambulances,
  activeRoutes,
  pendingRequests,
  onUpdateRoute,
  onCreateRoute
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hospitalMarkers = useRef<mapboxgl.Marker[]>([]);
  const ambulanceMarkers = useRef<{[id: string]: mapboxgl.Marker}>({});
  const requestMarkers = useRef<{[id: string]: mapboxgl.Marker}>({});
  const routeSources = useRef<{[id: string]: mapboxgl.GeoJSONSource}>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [visibleRequests, setVisibleRequests] = useState(true);
  const [visibleAmbulances, setVisibleAmbulances] = useState(true);
  const [visibleRoutes, setVisibleRoutes] = useState(true);

  // Função para criar HTML do marcador de hospital
  const createHospitalMarker = useCallback((hospital: IHospital) => {
    const el = document.createElement('div');
    el.className = 'hospital-marker';
    el.style.zIndex = '5';
    
    // Verifica se o hospital está selecionado
    const isSelected = hospital.id === selectedHospital;
    
    el.innerHTML = `
      <div class="fixed-marker">
        <div class="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 ${
          isSelected ? 'border-white scale-125' : 'border-blue-400'
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z"></path>
            <path d="M9 12h6"></path>
            <path d="M12 9v6"></path>
          </svg>
        </div>
        ${isSelected ? `
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max">
          <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-sm font-medium text-gray-900 dark:text-white">
            ${hospital.name}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    return el;
  }, [selectedHospital]);

  // Função para criar HTML do marcador de ambulância
  const createAmbulanceMarker = useCallback((ambulance: IAmbulance) => {
    const el = document.createElement('div');
    el.className = 'ambulance-marker';
    el.style.zIndex = '10';
    
    const statusColor = ambulanceStatusColors[ambulance.status];
    const activeRoute = activeRoutes.find(r => r.ambulanceId === ambulance.id);
    
    el.innerHTML = `
      <div class="fixed-marker">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${statusColor}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 10h18"></path>
            <path d="m15 4 2 6"></path>
            <path d="M9 4 7 10"></path>
            <path d="M5 18a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"></path>
            <path d="M15 18a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"></path>
            <path d="M19 10h2v6.5a2.5 2.5 0 0 1-2.5 2.5H15"></path>
            <path d="M5 10H3v6.5A2.5 2.5 0 0 0 5.5 19H9"></path>
          </svg>
        </div>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max">
          <div class="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg text-xs font-medium text-gray-900 dark:text-white">
            ${ambulance.vehicleId}
          </div>
        </div>
      </div>
    `;

    return el;
  }, [activeRoutes]);

  // Função para criar HTML do marcador de solicitação pendente
  const createRequestMarker = useCallback((request: IAmbulanceRequest) => {
    const el = document.createElement('div');
    el.className = 'request-marker';
    el.style.zIndex = '15';
    
    const emergencyColor = emergencyColors[request.patientInfo.emergencyLevel];
    
    el.innerHTML = `
      <div class="fixed-marker pulse-animation">
        <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${emergencyColor}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m8 2 4 4 4-4"></path>
            <path d="M12 12V6"></path>
            <circle cx="12" cy="18" r="4"></circle>
          </svg>
        </div>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max">
          <div class="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg text-xs font-medium" style="color: ${emergencyColor}">
            ${request.patientInfo.emergencyLevel === 'low' ? 'Baixa' : 
              request.patientInfo.emergencyLevel === 'medium' ? 'Média' : 
              request.patientInfo.emergencyLevel === 'high' ? 'Alta' : 'Crítica'}
          </div>
        </div>
      </div>
    `;

    // Adicionar evento para o botão de despacho
    setTimeout(() => {
      el.addEventListener('click', () => {
        onCreateRoute && onCreateRoute();
      });
    }, 100);

    return el;
  }, [onCreateRoute]);

  // Função para criar popup de rota
  const createRoutePopup = useCallback((route: IAmbulanceRoute) => {
    // Encontrar a ambulância associada a esta rota
    const ambulance = ambulances.find(a => a.id === route.ambulanceId);
    if (!ambulance) return null;
    
    const emergencyColor = route.patient ? emergencyColors[route.patient.emergencyLevel] : '#3B82F6';
    
    const content = document.createElement('div');
    content.className = 'route-popup p-4 max-w-sm';
    content.innerHTML = `
      <div class="flex flex-col space-y-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: ${emergencyColor}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="M3 10h18"></path>
              <path d="m15 4 2 6"></path>
              <path d="M9 4 7 10"></path>
              <path d="M5 18a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"></path>
              <path d="M15 18a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"></path>
              <path d="M19 10h2v6.5a2.5 2.5 0 0 1-2.5 2.5H15"></path>
              <path d="M5 10H3v6.5A2.5 2.5 0 0 0 5.5 19H9"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">Ambulância ${ambulance.vehicleId}</h3>
            <p class="text-xs text-gray-500">${ambulance.type.toUpperCase()} - ${ambulance.plateNumber}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${route.distance.toFixed(1)} km</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${route.duration} min</span>
          </div>
        </div>
        
        <div class="border-t border-gray-200 my-1 pt-2">
          <div class="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <p class="font-medium">Origem</p>
              <p class="text-sm text-gray-600">${route.origin.name}</p>
            </div>
          </div>
          <div class="h-6 border-l border-dashed border-gray-300 ml-2"></div>
          <div class="flex items-start space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-1">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            <div>
              <p class="font-medium">Destino</p>
              <p class="text-sm text-gray-600">${route.destination.name}</p>
              <p class="text-xs text-gray-500">${route.destination.address}</p>
            </div>
          </div>
        </div>
        
        ${route.patient ? `
        <div class="border-t border-gray-200 my-1 pt-2">
          <h4 class="font-medium">Paciente</h4>
          <p class="text-sm">${route.patient.name}, ${route.patient.age} anos</p>
          <p class="text-sm text-gray-600">${route.patient.condition}</p>
          <div class="mt-1">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full" style="background-color: ${emergencyColor}20; color: ${emergencyColor}">
              ${route.patient.emergencyLevel === 'low' ? 'Baixa Urgência' : 
                route.patient.emergencyLevel === 'medium' ? 'Média Urgência' : 
                route.patient.emergencyLevel === 'high' ? 'Alta Urgência' : 'Emergência Crítica'}
            </span>
          </div>
        </div>
        ` : ''}
        
        <div class="border-t border-gray-200 my-1 pt-2 flex justify-between">
          <button class="route-update-btn px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition" data-route-id="${route.id}" data-action="complete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Completar
          </button>
          <button class="route-update-btn px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition" data-route-id="${route.id}" data-action="cancel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    `;
    
    // Adicionar eventos aos botões
    setTimeout(() => {
      const completeButton = content.querySelector('[data-action="complete"]');
      const cancelButton = content.querySelector('[data-action="cancel"]');
      
      if (completeButton) {
        completeButton.addEventListener('click', () => {
          onUpdateRoute(route.id, 'completed');
          // Fechar popup após ação
          if (map.current) {
            const popups = document.getElementsByClassName('mapboxgl-popup');
            if (popups.length) {
              Array.from(popups).forEach(popup => popup.remove());
            }
          }
        });
      }
      
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          onUpdateRoute(route.id, 'cancelled');
          // Fechar popup após ação
          if (map.current) {
            const popups = document.getElementsByClassName('mapboxgl-popup');
            if (popups.length) {
              Array.from(popups).forEach(popup => popup.remove());
            }
          }
        });
      }
    }, 100);
    
    return content;
  }, [ambulances, onUpdateRoute]);

    // Função para renderizar rotas no mapa
    const renderRoutes = useCallback(async () => {
        if (!map.current || !mapLoaded || !activeRoutes.length) return;
        
        for (const route of activeRoutes) {
          try {
            // Verifica se a rota já tem uma camada
            const routeId = `route-${route.id}`;
            if (map.current.getSource(routeId)) {
              continue; // Pula se a rota já está renderizada
            }
            
            // Buscar rota real usando a API do Mapbox
            const response = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/` +
              `${route.origin.coordinates.lng},${route.origin.coordinates.lat};` +
              `${route.destination.coordinates.lng},${route.destination.coordinates.lat}` +
              `?geometries=geojson&access_token=${mapboxgl.accessToken}`
            );
    
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
              // Determinar cor com base no nível de emergência
              let routeColor = '#3B82F6'; // Padrão azul
              if (route.patient) {
                routeColor = emergencyColors[route.patient.emergencyLevel];
              }
              
              // Adicionar fonte
              map.current.addSource(routeId, {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {
                    routeId: route.id,
                    emergencyLevel: route.patient?.emergencyLevel || 'low'
                  },
                  geometry: data.routes[0].geometry
                }
              });
              
              // Adicionar camada para a linha principal
              map.current.addLayer({
                id: `${routeId}-line`,
                type: 'line',
                source: routeId,
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                  'visibility': visibleRoutes ? 'visible' : 'none'
                },
                paint: {
                  'line-color': routeColor,
                  'line-width': 4,
                  'line-opacity': 0.8,
                  'line-dasharray': [0, 2, 1]
                }
              });
              
              // Armazenar a referência para a fonte
              routeSources.current[route.id] = map.current.getSource(routeId) as mapboxgl.GeoJSONSource;
              
              // Adicionar evento de clique na rota
              map.current.on('click', `${routeId}-line`, (e) => {
                if (e.features && e.features[0]) {
                  const routeId = e.features[0].properties?.routeId;
                  const clickedRoute = activeRoutes.find(r => r.id === routeId);
                  
                  if (clickedRoute) {
                    const popupContent = createRoutePopup(clickedRoute);
                    if (popupContent) {
                      new mapboxgl.Popup({closeButton: true, maxWidth: '300px'})
                        .setLngLat(e.lngLat)
                        .setDOMContent(popupContent)
                        .addTo(map.current!);
                    }
                  }
                }
              });
              
              // Mudar cursor ao passar sobre a rota
              map.current.on('mouseenter', `${routeId}-line`, () => {
                if (map.current) {
                  map.current.getCanvas().style.cursor = 'pointer';
                }
              });
              
              map.current.on('mouseleave', `${routeId}-line`, () => {
                if (map.current) {
                  map.current.getCanvas().style.cursor = '';
                }
              });
            }
          } catch (error) {
            console.error('Erro ao renderizar rota:', error);
          }
        }
      }, [activeRoutes, mapLoaded, visibleRoutes, createRoutePopup]);
    
      // Efeito para inicializar o mapa
      useEffect(() => {
        if (!mapContainer.current || map.current) return;
      
        console.log("Tentando inicializar o mapa...");
      
        // Verifica se o token está disponível
        if (!mapboxgl.accessToken) {
          console.error("Token do Mapbox não configurado");
          mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
          
          if (!mapboxgl.accessToken) {
            console.error("ERRO CRÍTICO: Token do Mapbox não disponível");
            return;
          }
        }
      
        try {
          // Certifique-se que o contêiner existe e tem dimensões
          if (mapContainer.current.clientWidth === 0 || mapContainer.current.clientHeight === 0) {
            console.warn("Container do mapa tem dimensão zero", {
              width: mapContainer.current.clientWidth,
              height: mapContainer.current.clientHeight
            });
            // Force uma dimensão mínima
            mapContainer.current.style.width = "100%";
            mapContainer.current.style.height = "500px";
          }
      
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-46.6388, -23.5489], // São Paulo
            zoom: 11,
            attributionControl: true,
            failIfMajorPerformanceCaveat: false
          });
      
          // Adicione evento para detectar quando o mapa falha
          map.current.on('error', (e) => {
            console.error("Erro no mapa:", e);
          });
      
          // Adicione evento para confirmar quando o mapa carregou
          map.current.on('load', () => {
            console.log("Mapa carregado com sucesso!");
            setMapLoaded(true);
          });
      
        } catch (error) {
          console.error('Erro fatal ao inicializar mapa:', error);
        }
      
        return () => {
          if (map.current) {
            try {
              map.current.remove();
            } catch (e) {
              console.error("Erro ao remover mapa:", e);
            }
            map.current = null;
          }
        };
      }, []);
    
      // Efeito para adicionar marcadores dos hospitais
      useEffect(() => {
        if (!mapLoaded || !map.current || !hospitals.length) return;
    
        console.log("Adicionando marcadores de hospitais ao mapa");
    
        // Limpar marcadores existentes
        hospitalMarkers.current.forEach(marker => marker.remove());
        hospitalMarkers.current = [];
    
        // Adicionar novos marcadores
        hospitals.forEach(hospital => {
          const el = createHospitalMarker(hospital);
    
          // Adicionar evento de clique
          el.addEventListener('click', () => {
            setSelectedHospital(hospital.id);
          });
    
          // Adicionar marcador fixo
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center'
          })
            .setLngLat([hospital.unit.coordinates.lng, hospital.unit.coordinates.lat])
            .addTo(map.current!);
    
          hospitalMarkers.current.push(marker);
        });
    
        // Ajustar o mapa para mostrar todos os hospitais se nenhum estiver selecionado
        if (hospitals.length > 0 && !selectedHospital) {
          const bounds = new mapboxgl.LngLatBounds();
          hospitals.forEach(hospital => {
            bounds.extend([
              hospital.unit.coordinates.lng,
              hospital.unit.coordinates.lat
            ]);
          });
    
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 12
          });
        }
      }, [hospitals, mapLoaded, createHospitalMarker, setSelectedHospital, selectedHospital]);
    
    // Efeito para atualizar marcadores de ambulâncias
    useEffect(() => {
        if (!mapLoaded || !map.current || !selectedHospital) return;
    
        // Limpar marcadores existentes
        Object.values(ambulanceMarkers.current).forEach(marker => marker.remove());
        ambulanceMarkers.current = {};
    
        // Buscar todas as ambulâncias do hospital selecionado, incluindo as em rota
        const hospitalAmbulances = ambulances;
        
        console.log("Renderizando ambulâncias:", hospitalAmbulances.length);
    
        // Atualizar marcadores de ambulâncias
        hospitalAmbulances.forEach(ambulance => {
        const el = createAmbulanceMarker(ambulance);
        
        // Para ambulâncias em rota, encontre a rota atual para posicionar corretamente
        let coordinates = ambulance.currentLocation;
        
        // Se a ambulância estiver em atendimento, verifique se há uma rota ativa
        if (ambulance.status === 'dispatched' && ambulance.currentRoute) {
            const route = activeRoutes.find(r => r.id === ambulance.currentRoute);
            if (route) {
            // Posicionar a ambulância ao longo da rota (por exemplo, a 70% do caminho entre origem e destino)
            // Esta é uma simplificação - em um sistema real, você teria a posição atual via GPS
            const progress = 0.7; // 70% do caminho entre origem e destino
            
            coordinates = {
                lat: route.origin.coordinates.lat + (route.destination.coordinates.lat - route.origin.coordinates.lat) * progress,
                lng: route.origin.coordinates.lng + (route.destination.coordinates.lng - route.origin.coordinates.lng) * progress
            };
            }
        }
        
        const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center'
        })
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map.current!);
        
        // Tornar visível ou não dependendo da configuração
        if (!visibleAmbulances) {
            marker.getElement().style.display = 'none';
        }
        
        // Armazenar referência ao marcador
        ambulanceMarkers.current[ambulance.id] = marker;
        });
    }, [ambulances, mapLoaded, createAmbulanceMarker, visibleAmbulances, selectedHospital, activeRoutes]);
    
      // Efeito para atualizar marcadores de solicitações
      useEffect(() => {
        if (!mapLoaded || !map.current || !selectedHospital) return;
    
        // Limpar marcadores existentes
        Object.values(requestMarkers.current).forEach(marker => marker.remove());
        requestMarkers.current = {};
    
        // Atualizar marcadores de solicitações
        pendingRequests.forEach(request => {
          if (!request.location.coordinates) return;
          
          const el = createRequestMarker(request);
          
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center'
          })
            .setLngLat([request.location.coordinates.lng, request.location.coordinates.lat])
            .addTo(map.current!);
          
          // Ocultar se configurado
          if (!visibleRequests) {
            marker.getElement().style.display = 'none';
          }
          
          // Armazenar referência ao marcador
          requestMarkers.current[request.id] = marker;
        });
      }, [pendingRequests, mapLoaded, createRequestMarker, visibleRequests, selectedHospital]);
    
      // Efeito para renderizar rotas
      useEffect(() => {
        if (mapLoaded && map.current) {
          renderRoutes();
        }
      }, [mapLoaded, renderRoutes]);
    
      // Efeito para atualizar visibilidade das rotas
      useEffect(() => {
        if (!mapLoaded || !map.current) return;
        
        try {
          // Verificar se o estilo está carregado
          if (!map.current.isStyleLoaded()) {
            console.warn('Estilo do mapa ainda não carregado completamente');
            return;
          }
          
          const style = map.current.getStyle();
          // Verificação adicional para garantir que style e layers existem
          if (!style || !style.layers) {
            console.warn('Estilo do mapa ou camadas não disponíveis');
            return;
          }
          
          const layers = style.layers || [];
          
          layers.forEach(layer => {
            // Atualiza apenas camadas de rota
            if (layer.id && layer.id.includes('route-') && layer.id.includes('-line')) {
              map.current!.setLayoutProperty(
                layer.id,
                'visibility',
                visibleRoutes ? 'visible' : 'none'
              );
            }
          });
        } catch (error) {
          console.error('Erro ao atualizar visibilidade das rotas:', error);
        }
      }, [visibleRoutes, mapLoaded]);
    
      // Efeito para atualizar visibilidade das ambulâncias
      useEffect(() => {
        // Atualiza a visibilidade dos marcadores de ambulância
        Object.values(ambulanceMarkers.current).forEach(marker => {
          marker.getElement().style.display = visibleAmbulances ? 'block' : 'none';
        });
      }, [visibleAmbulances]);
    
      // Efeito para atualizar visibilidade das solicitações
      useEffect(() => {
        // Atualiza a visibilidade dos marcadores de solicitação
        Object.values(requestMarkers.current).forEach(marker => {
          marker.getElement().style.display = visibleRequests ? 'block' : 'none';
        });
      }, [visibleRequests]);
    
      // Efeito para centralizar no hospital selecionado
      useEffect(() => {
        if (!mapLoaded || !map.current || !selectedHospital) return;
        
        const selectedHospitalData = hospitals.find(h => h.id === selectedHospital);
        if (selectedHospitalData) {
          map.current.flyTo({
            center: [
              selectedHospitalData.unit.coordinates.lng,
              selectedHospitalData.unit.coordinates.lat
            ],
            zoom: 13,
            speed: 1.2,
            curve: 1,
            easing(t) {
              return t;
            }
          });
        }
      }, [selectedHospital, hospitals, mapLoaded]);
    
      // Função para ajustar limites para todos os elementos relevantes
      const fitAllElements = useCallback(() => {
        if (!mapLoaded || !map.current) return;
        
        const bounds = new mapboxgl.LngLatBounds();
        let hasPoints = false;
        
        // Adicionar hospitais
        hospitals.forEach(hospital => {
          bounds.extend([
            hospital.unit.coordinates.lng,
            hospital.unit.coordinates.lat
          ]);
          hasPoints = true;
        });
        
        // Adicionar ambulâncias
        ambulances.forEach(ambulance => {
          bounds.extend([
            ambulance.currentLocation.lng,
            ambulance.currentLocation.lat
          ]);
          hasPoints = true;
        });
        
        // Adicionar solicitações
        pendingRequests.forEach(request => {
          if (request.location.coordinates) {
            bounds.extend([
              request.location.coordinates.lng,
              request.location.coordinates.lat
            ]);
            hasPoints = true;
          }
        });
        
        // Adicionar destinos de rotas
        activeRoutes.forEach(route => {
          bounds.extend([
            route.destination.coordinates.lng,
            route.destination.coordinates.lat
          ]);
          bounds.extend([
            route.origin.coordinates.lng,
            route.origin.coordinates.lat
          ]);
          hasPoints = true;
        });
        
        // Verificar se existem coordenadas antes de ajustar
        if (hasPoints) {
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 12
          });
        }
      }, [hospitals, ambulances, pendingRequests, activeRoutes, mapLoaded]);
    
      // Componente de controles de visualização
      const renderViewControls = () => (
        <div className="absolute top-4 left-80 flex flex-col space-y-2 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
            <h3 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Visualização</h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={visibleAmbulances}
                  onChange={() => setVisibleAmbulances(!visibleAmbulances)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ambulâncias</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={visibleRoutes}
                  onChange={() => setVisibleRoutes(!visibleRoutes)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rotas</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={visibleRequests}
                  onChange={() => setVisibleRequests(!visibleRequests)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Solicitações</span>
              </label>
            </div>
            <button
              onClick={fitAllElements}
              className="mt-3 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition flex items-center justify-center"
            >
              <LocateFixed size={14} className="mr-1" />
              Ver Tudo
            </button>
          </div>
        </div>
      );
    
      // Componente de status/legenda
      const renderStatus = () => (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-20">
          <h3 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Legenda</h3>
          
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <div className="mb-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Nível de Emergência</h4>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: emergencyColors.low}}></div>
                  <span>Baixa</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: emergencyColors.medium}}></div>
                  <span>Média</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: emergencyColors.high}}></div>
                  <span>Alta</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: emergencyColors.critical}}></div>
                  <span>Crítica</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Status da Ambulância</h4>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: ambulanceStatusColors.available}}></div>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: ambulanceStatusColors.dispatched}}></div>
                  <span>Em atendimento</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: ambulanceStatusColors.returning}}></div>
                  <span>Retornando</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: ambulanceStatusColors.maintenance}}></div>
                  <span>Manutenção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
      // Componente para mostrar estatísticas
      const renderStats = () => {
        const ambulancesDispatched = ambulances.filter(a => a.status === 'dispatched').length;
        const ambulancesAvailable = ambulances.filter(a => a.status === 'available').length;
        
        return (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-56 z-20">
            <h3 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Status Operacional</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Ambulâncias:</span>
                <span className="text-sm font-medium">{ambulances.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Em atendimento:</span>
                <span className="text-sm font-medium">{ambulancesDispatched}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Disponíveis:</span>
                <span className="text-sm font-medium">{ambulancesAvailable}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Solicitações pendentes:</span>
                <span className="text-sm font-medium">{pendingRequests.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Rotas ativas:</span>
                <span className="text-sm font-medium">{activeRoutes.length}</span>
              </div>
            </div>
            
            <button
              onClick={onCreateRoute}
              className="mt-3 w-full px-2 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition flex items-center justify-center"
            >
              <Phone size={14} className="mr-1" />
              Nova Solicitação
            </button>
          </div>
        );
      };
    
    return (
        <div className="relative w-full h-full p-1">
            {/* Borda gradiente */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700/90 to-cyan-700/90 shadow-lg">
            {/* Esta div cria o efeito de borda */}
            </div>
            
            {/* Título do componente posicionado no topo do mapa */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
            <h1 className="font-semibold text-lg text-blue-700 dark:text-blue-400 flex items-center">
                <Ambulance className="mr-2 h-5 w-5" />
                Sistema de Gerenciamento de Ambulâncias
            </h1>
            </div>
            
            {/* Contêiner do mapa com fundo branco para funcionar como "padding" interno */}
            <div className="absolute inset-0.5 rounded-xl overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
            </div>
          
          {/* Controles de visualização */}
          {renderViewControls()}
          
          {/* Status e legenda */}
          {renderStatus()}
          
          {/* Estatísticas */}
          {renderStats()}
          
          {/* Indicador de carregamento */}
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-75 z-10 flex items-center justify-center rounded-xl">
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white">Carregando mapa...</p>
              </div>
            </div>
          )}
      
          {/* Estilos globais para marcadores e animações */}
          <style jsx global>{`
            .pulse-animation {
              animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
              0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
              }
              
              70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
              }
              
              100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
              }
            }
            
            .fixed-marker {
              position: relative;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1;
              transition: transform 0.2s ease-out;
            }
            
            .fixed-marker:hover {
              transform: scale(1.1);
              z-index: 1000;
            }
            
            .hospital-marker,
            .ambulance-marker,
            .request-marker {
              position: relative;
              z-index: 1;
            }
            
            .hospital-marker:hover,
            .ambulance-marker:hover,
            .request-marker:hover {
              z-index: 1000;
            }
            
            .mapboxgl-popup-content {
              padding: 0;
              border-radius: 0.5rem;
              overflow: hidden;
            }
            
            /* Certifique-se de que os controles do mapa fiquem dentro das bordas arredondadas */
            .mapboxgl-ctrl-bottom-left, 
            .mapboxgl-ctrl-bottom-right {
              margin: 0 10px 10px 0;
            }
          `}</style>
        </div>
    );
};
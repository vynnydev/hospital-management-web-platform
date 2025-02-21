/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Modificação em MapboxHospital.tsx - adicionando suporte a rotas
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { Building2 } from 'lucide-react';
import { IResourceRouteAnalysis } from '@/types/resource-route-analysis-types';

// Atualizando a interface para usar sourceId/targetId
interface IMapboxHospitalProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  currentUser: null;
  activeRoute: { sourceId: string; targetId: string; } | null;
  resourceRouteAnalysis: IResourceRouteAnalysis;  // Adicionado
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MapboxHospital: React.FC<IMapboxHospitalProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser,
  activeRoute
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const routeLine = useRef<mapboxgl.GeoJSONSource | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/vynnydev/cm635y92t005b01s63twr70pl',
      center: [-46.6388, -23.5489],
      zoom: 10
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
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
          'line-color': '#3182CE',
          'line-width': 4,
          'line-opacity': 0.8,
          'line-dasharray': [1, 2]
        }
      });
      
      routeLine.current = map.current?.getSource('route') as mapboxgl.GeoJSONSource;
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    hospitals.forEach(hospital => {
      const el = document.createElement('div');
      el.className = 'hospital-marker';
      
      el.innerHTML = `
        <div class="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105 min-w-[250px]">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Building2 class="h-6 w-6 text-white" />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">${hospital.name}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">${hospital.unit.address}</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">${hospital.unit.city}, ${hospital.unit.state}</p>
              <div class="mt-2 flex items-center">
                <div class="px-2 py-1 bg-blue-100 dark:bg-blue-400 rounded-full">
                  <span class="text-blue-700 font-medium">${hospital.metrics.overall.occupancyRate}% Ocupação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedHospital(hospital.id);
      });

      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([hospital.unit.coordinates.lng, hospital.unit.coordinates.lat])
          .addTo(map.current!);

        markers.current.push(marker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

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
  }, [hospitals, mapLoaded, setSelectedHospital]);

  // Handle selected hospital
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedHospital) return;

    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (hospital) {
      map.current.flyTo({
        center: [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat],
        zoom: 15,
        duration: 1500
      });
    }
  }, [selectedHospital, hospitals, mapLoaded]);
  
  // Update route
  useEffect(() => {
    if (!mapLoaded || !map.current || !routeLine.current || !activeRoute) {
      // Limpar a rota quando não houver rota ativa
      if (routeLine.current) {
        routeLine.current.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });
      }
      return;
    }
    
    const sourceHospital = hospitals.find(h => h.id === activeRoute.sourceId);
    const targetHospital = hospitals.find(h => h.id === activeRoute.targetId);
    
    if (!sourceHospital || !targetHospital) return;
    
    const getDirections = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${sourceHospital.unit.coordinates.lng},${sourceHospital.unit.coordinates.lat};` +
          `${targetHospital.unit.coordinates.lng},${targetHospital.unit.coordinates.lat}` +
          `?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          routeLine.current?.setData({
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          });
          
          const bounds = new mapboxgl.LngLatBounds();
          data.routes[0].geometry.coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
          
          map.current?.fitBounds(bounds, {
            padding: 80,
            maxZoom: 14
          });
        }
      } catch (error) {
        console.error('Erro ao buscar direções:', error);
        
        routeLine.current?.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [sourceHospital.unit.coordinates.lng, sourceHospital.unit.coordinates.lat],
              [targetHospital.unit.coordinates.lng, targetHospital.unit.coordinates.lat]
            ]
          }
        });
      }
    };
    
    getDirections();
  }, [activeRoute, hospitals, mapLoaded]);

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
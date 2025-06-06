/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IHospital } from "@/types/hospital-network-types";
import { IAppUser } from "@/types/auth-types";
import { Building2 } from 'lucide-react';

interface IMapboxHospitalOverviewProps {
  hospitals: IHospital[];
  selectedHospital: string | null;
  setSelectedHospital: (id: string | null) => void;
  currentUser: IAppUser | null;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MapboxHospitalOverview: React.FC<IMapboxHospitalOverviewProps> = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  currentUser
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-46.6388, -23.5489], // São Paulo coordinates as default
      zoom: 10
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Adiciona controles de navegação no canto superior direito (dentro do mapa)
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Adiciona controle de zoom no canto inferior direito (dentro do mapa)
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      'bottom-right'
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers after map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each hospital
    hospitals.forEach(hospital => {
      const el = document.createElement('div');
      el.className = 'hospital-marker';
      
      el.innerHTML = `
        <div class="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105 max-w-[250px]">
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

    // Fit map to show all markers
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

    if (mapLoaded && map.current && selectedHospital) {
      // Aplica estilos aos controles após o mapa ser carregado
      const rightControls = document.querySelectorAll('.mapboxgl-ctrl-top-right');
      rightControls.forEach(control => {
        if (control instanceof HTMLElement) {
          control.style.marginTop = '80px';
          control.style.marginRight = '20px';
        }
      });

      
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (hospital) {
        map.current.flyTo({
          center: [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat],
          zoom: 15,
          duration: 1500
        });
      }
    }
  }, [selectedHospital, hospitals, mapLoaded]);

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
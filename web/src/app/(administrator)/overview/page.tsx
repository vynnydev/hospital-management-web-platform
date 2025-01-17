/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { Card } from '@/components/ui/organisms/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/organisms/select';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Calendar } from '@/components/ui/organisms/calendar';
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import { Building2, Users, Bed, Activity, Map, TrendingUp, Clock, Heart, Brain, 
         Stethoscope, Thermometer, Plus, CalendarDays } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Hospital } from '@/types/hospital-network-types';

// Add department status interface
interface DepartmentStatus {
  name: string;
  status: 'normal' | 'attention' | 'critical';
  occupancy: number;
  waitingList: number;
  icon: React.ElementType;
}

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Overview: React.FC = () => {
  const { networkData, currentUser, loading, error } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'dashboard' | 'tv'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  console.log("Usuário atual logado:", currentUser)

  // Status color mapping
  const getStatusColor = (status: 'normal' | 'attention' | 'critical'): string => {
    const colors = {
      normal: 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white',
      attention: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white',
      critical: 'bg-gradient-to-r from-red-700 to-pink-700 text-white'
    };
    return colors[status];
  };

  const getOccupancyStatus = (occupancy: number): 'normal' | 'attention' | 'critical' => {
    if (occupancy < 80) return 'normal';
    if (occupancy < 90) return 'attention';
    return 'critical';
  };

  // Initialize and update map
  useEffect(() => {
    if (!mapContainer.current || !networkData || selectedRegion !== 'all') return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // or your custom style URL
        center: [-46.6333, -23.5505], // São Paulo coordinates
        zoom: 8
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Add markers for each hospital
    networkData.hospitals.forEach(hospital => {
      const { coordinates } = hospital.unit;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'hospital-marker';
      el.style.backgroundColor = '#3b82f6';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${hospital.name}</h3>
            <p class="text-sm">Ocupação: ${hospital.metrics.overall.occupancyRate}%</p>
            <p class="text-sm">Leitos disponíveis: ${hospital.metrics.overall.availableBeds}</p>
          </div>
        `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [networkData, selectedRegion]);

  // AI Discharge Date Prediction Component
  const DischargePrediction: React.FC = () => (
    <Card className="p-4 bg-gray-200 dark:bg-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Previsão de Alta
        </h3>
        <Badge className="bg-gradient-to-r from-blue-700 to-cyan-700">
          IA Prediction
        </Badge>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />
      <div className="mt-4 text-sm text-muted-foreground">
        Previsão baseada em análise do Gemini AI
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !networkData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-gray-200 dark:bg-gray-700">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error || 'Dados não disponíveis'}</p>
        </Card>
      </div>
    );
  }

  // Rest of the component remains the same, just remove the NetworkDashboardProps interface
  // and all props references since we're now getting data from the hook

  // Get unique regions using Array.reduce
  const regions = networkData.hospitals
    .reduce<string[]>((acc, hospital) => {
      if (!acc.includes(hospital.unit.state)) {
        acc.push(hospital.unit.state);
      }
      return acc;
    }, []);

  // Filter hospitals based on selected region
  const filteredHospitals = selectedRegion === 'all' 
    ? networkData.hospitals 
    : networkData.hospitals.filter(h => h.unit.state === selectedRegion);

  // Get region-specific metrics if a region is selected
  const getCurrentRegionMetrics = () => {
    if (selectedRegion === 'all') {
      return {
        totalBeds: networkData.networkInfo.networkMetrics.totalBeds,
        totalPatients: networkData.networkInfo.networkMetrics.totalPatients,
        averageOccupancy: networkData.networkInfo.networkMetrics.averageOccupancy,
      };
    }

    const regionMetrics = networkData.networkInfo.networkMetrics.regionalMetrics[selectedRegion];
    return {
      totalBeds: regionMetrics.totalBeds,
      totalPatients: filteredHospitals.reduce((acc, h) => acc + h.metrics.overall.totalPatients, 0),
      averageOccupancy: regionMetrics.avgOccupancy,
    };
  };

  const currentMetrics = getCurrentRegionMetrics();

  return (
    <div className="space-y-6 p-6 -mt-20">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image 
            src={`/${networkData.networkInfo.logo}` || '/images/default-avatar.png'} 
            alt="Network Logo" 
            className="h-12 w-12" 
            width={12}
            height={12}
          />
          <div>
            <h1 className="text-2xl font-bold">{networkData.networkInfo.name}</h1>
            <p className="text-muted-foreground">
              {filteredHospitals.length} Hospitais • {currentMetrics.totalBeds} Leitos
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Regiões</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setDisplayMode(prev => prev === 'dashboard' ? 'tv' : 'dashboard')}
          >
            {displayMode === 'dashboard' ? 'Modo TV' : 'Modo Dashboard'}
          </Button>
        </div>
      </div>

      {/* Network Overview Cards with updated background */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4 bg-gray-200 dark:bg-gray-700">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Hospitais</p>
            <h3 className="text-2xl font-bold">
              {selectedRegion === 'all' 
                ? networkData.networkInfo.totalHospitals 
                : networkData.networkInfo.networkMetrics.regionalMetrics[selectedRegion].hospitals}
            </h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pacientes Internados</p>
            <h3 className="text-2xl font-bold">{currentMetrics.totalPatients}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Bed className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Leitos</p>
            <h3 className="text-2xl font-bold">{currentMetrics.totalBeds}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ocupação Média</p>
            <h3 className="text-2xl font-bold">
              {currentMetrics.averageOccupancy.toFixed(1)}%
            </h3>
          </div>
        </Card>
      </div>

      {/* Department Status Section */}
      <Card className="p-4 bg-gray-200 dark:bg-gray-700">
        <h3 className="text-lg font-semibold mb-4">Status dos Departamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedHospital &&
            (() => {
              const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
              if (!hospital?.metrics?.departmental) return <p>Nenhum dado disponível.</p>;

              return Object.entries(hospital.metrics.departmental).map(([deptName, dept]) => (
                <div key={deptName} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Removido o uso de `dept.icon` pois a API não o fornece */}
                      <h4 className="font-medium">{deptName}</h4>
                    </div>
                    <Badge className={getStatusColor(dept.occupancy)}>
                      {dept.occupancy}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ocupação:</span>
                      <span className="font-medium">{dept.occupancy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos:</span>
                      <span className="font-medium">{dept.beds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pacientes:</span>
                      <span className="font-medium">{dept.patients}</span>
                    </div>
                  </div>
                </div>
              ));
            })()}
        </div>
      </Card>

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          <TabsTrigger value="discharge">Previsão de Alta</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hospital List */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Hospitais da Rede</h3>
              <div className="space-y-4">
                {filteredHospitals.map(hospital => (
                  <div
                    key={hospital.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                    onClick={() => setSelectedHospital(hospital.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {hospital.unit.city}, {hospital.unit.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{hospital.metrics.overall.occupancyRate}%</p>
                      <p className="text-sm text-muted-foreground">Ocupação</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Occupancy Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Taxa de Ocupação</h3>
              <BarChart
                width={500}
                height={300}
                data={filteredHospitals.map(h => ({
                  name: h.name.replace('Hospital ', ''),
                  ocupacao: h.metrics.overall.occupancyRate
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ocupacao" fill="#3b82f6" name="Ocupação %" />
              </BarChart>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          {/* Performance content */}
        </TabsContent>

        <TabsContent value="comparison">
          {/* Comparison content */}
        </TabsContent>

        {/* Existing TabsContent for overview, performance, and comparison */}
        <TabsContent value="discharge" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DischargePrediction />
            
            {/* Additional discharge-related information card */}
            <Card className="p-4 bg-gray-200 dark:bg-gray-700">
              <h3 className="text-lg font-semibold mb-4">Informações do Paciente</h3>
              <div className="space-y-4">
                {/* Add patient-specific information here */}
                <Button className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 text-white">
                  Solicitar Nova Análise
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Overview
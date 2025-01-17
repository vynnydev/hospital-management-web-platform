/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/organisms/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/organisms/select';
import { Button } from '@/components/ui/organisms/button';
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import { Building2, Users, Bed, Activity, Map, TrendingUp, Clock } from 'lucide-react';

export const NetworkDashboard = ({ networkData }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [displayMode, setDisplayMode] = useState('dashboard');

  // Get unique regions from hospitals
  const regions = [...new Set(networkData.hospitals.map(h => h.unit.state))];
  
  // Filter hospitals based on selected region
  const filteredHospitals = selectedRegion === 'all' 
    ? networkData.hospitals 
    : networkData.hospitals.filter(h => h.unit.state === selectedRegion);

  const calculateNetworkMetrics = () => {
    const metrics = filteredHospitals.reduce((acc, hospital) => ({
      totalPatients: acc.totalPatients + hospital.metrics.overall.totalPatients,
      totalBeds: acc.totalBeds + hospital.metrics.capacity.total.maxBeds,
      avgOccupancy: acc.avgOccupancy + hospital.metrics.overall.occupancyRate,
    }), { totalPatients: 0, totalBeds: 0, avgOccupancy: 0 });

    metrics.avgOccupancy = metrics.avgOccupancy / filteredHospitals.length;
    return metrics;
  };

  const networkMetrics = calculateNetworkMetrics();

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={networkData.logo} alt="Network Logo" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold">{networkData.name}</h1>
            <p className="text-muted-foreground">
              {filteredHospitals.length} Hospitais • {networkMetrics.totalBeds} Leitos
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

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Hospitais</p>
            <h3 className="text-2xl font-bold">{filteredHospitals.length}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pacientes Internados</p>
            <h3 className="text-2xl font-bold">{networkMetrics.totalPatients}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Bed className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de Leitos</p>
            <h3 className="text-2xl font-bold">{networkMetrics.totalBeds}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Activity className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ocupação Média</p>
            <h3 className="text-2xl font-bold">
              {networkMetrics.avgOccupancy.toFixed(1)}%
            </h3>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
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
          {/* Add performance-specific content */}
        </TabsContent>

        <TabsContent value="comparison">
          {/* Add comparison-specific content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
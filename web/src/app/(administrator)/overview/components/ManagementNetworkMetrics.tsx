import React from 'react';
import { Button } from "@/components/ui/organisms/button";
import { Card, CardContent } from "@/components/ui/organisms/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/organisms/select";
import { 
  Monitor, 
  Users, 
  Building2, 
  Bed, 
  ChevronDown,
  Activity,
  Map,
  Settings 
} from 'lucide-react';

interface Hospital {
  unit: {
    state: string;
    name?: string;
  };
}

interface NetworkInfo {
  name: string;
  logo?: string;
}

interface NetworkData {
  networkInfo: NetworkInfo;
  hospitals: Hospital[];
}

interface CurrentMetrics {
  totalBeds: number;
  totalPatients: number;
  averageOccupancy: number;
}

interface ManagementNetworkMetricsProps {
  networkData: NetworkData;
  filteredHospitals: Hospital[];
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<"dashboard" | "tv">>;
  displayMode: "dashboard" | "tv";
  currentMetrics: CurrentMetrics;
  canChangeRegion: boolean | undefined;
}

export const ManagementNetworkMetrics: React.FC<ManagementNetworkMetricsProps> = ({
  networkData,
  selectedRegion,
  setSelectedRegion,
  setDisplayMode,
  displayMode,
  currentMetrics,
  filteredHospitals,
  canChangeRegion
}) => {
  const regions = React.useMemo(() => {
    if (!networkData?.hospitals?.length) return [];
    
    return networkData.hospitals.reduce<string[]>((acc: string[], hospital: { unit: { state: string } }) => {
      if (!acc.includes(hospital?.unit?.state)) {
        acc.push(hospital.unit.state);
      }
      return acc;
    }, [] as string[]);
  }, [networkData?.hospitals]);

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
      <CardContent className="p-0">
        <div className="flex flex-col space-y-6">
          {/* Network Info Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{networkData?.networkInfo?.name || 'Rede Hospitalar'}</h1>
              <p className="text-gray-500 text-sm">
                {filteredHospitals?.length || 0} Hospitais • {currentMetrics?.totalBeds || 0} Leitos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {canChangeRegion && (
                <div className="relative">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-64 bg-gray-50 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Map size={18} className="text-gray-500" />
                        <SelectValue placeholder="Selecione a região" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center space-x-2">
                          <Users size={18} className="text-gray-500" />
                          <span>Todas Regiões</span>
                        </div>
                      </SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          <div className="flex items-center space-x-2">
                            <Map size={18} className="text-gray-500" />
                            <span>{region}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setDisplayMode(prev => prev === 'dashboard' ? 'tv' : 'dashboard')}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100"
              >
                <Monitor size={18} />
                <span>Modo TV</span>
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Hospitais</p>
                  <h3 className="text-2xl font-bold">{filteredHospitals.length}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bed size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Leitos</p>
                  <h3 className="text-2xl font-bold">{currentMetrics.totalBeds}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pacientes Internados</p>
                  <h3 className="text-2xl font-bold">{currentMetrics.totalPatients}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ocupação Média</p>
                  <h3 className="text-2xl font-bold">{currentMetrics.averageOccupancy}%</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
              <Map className="mr-2 h-4 w-4" />
              Ver Mapa de Leitos
            </Button>
            <Button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200">
              <Settings className="mr-2 h-4 w-4" />
              Configurações da Rede
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementNetworkMetrics;
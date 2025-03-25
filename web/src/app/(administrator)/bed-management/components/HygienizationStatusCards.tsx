import React, { useState, useEffect } from 'react';
import { 
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Droplets,
  BarChart3,
  Plus,
  ArrowRight,
  FileText,
  ChevronDown,
  History,
  Users,
  CalendarClock,
  BedDouble
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/organisms/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/organisms/dropdown-menu';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { countBedsByStatus } from '@/utils/countBeds';
import { IBed, IHospital } from '@/types/hospital-network-types';
import { Badge } from '@/components/ui/organisms/badge';
import { Input } from '@/components/ui/organisms/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';

interface HygienizationStatusCardsProps {
  className?: string;
  selectedHospitalId?: string;
}

// Interface para o histórico de higienização
interface IHygienizationHistory {
  id: string;
  bedId: string;
  type: 'preventive' | 'corrective';
  date: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  technician?: string;
  description: string;
  notes?: string;
  parts?: {
    name: string;
    quantity: number;
    replaced: boolean;
  }[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Mock de histórico de manutenções
const mockHygienizationHistory: IHygienizationHistory[] = [
  {
    id: 'maint-001',
    bedId: 'UTI-103',
    type: 'preventive',
    date: '2025-02-15',
    completedDate: '2025-02-20',
    status: 'completed',
    technician: 'Carlos Silva',
    description: 'Higienização preventiva periódica',
    notes: 'Equipamento em boas condições',
    parts: [
      { name: 'Filtro de ar', quantity: 1, replaced: true },
      { name: 'Cabos de energia', quantity: 2, replaced: false }
    ],
    priority: 'medium'
  },
  {
    id: 'maint-002',
    bedId: 'UTI-105',
    type: 'corrective',
    date: '2025-03-10',
    status: 'in_progress',
    technician: 'Ana Martins',
    description: 'Monitor cardíaco apresentando falhas intermitentes',
    parts: [
      { name: 'Placa principal', quantity: 1, replaced: false },
      { name: 'Sensor', quantity: 1, replaced: true }
    ],
    priority: 'high'
  },
  {
    id: 'maint-003',
    bedId: 'ENF-202',
    type: 'preventive',
    date: '2025-03-15',
    status: 'pending',
    description: 'Checagem de rotina dos equipamentos',
    priority: 'low'
  },
  {
    id: 'maint-004',
    bedId: 'UTI-101',
    type: 'corrective',
    date: '2025-02-28',
    completedDate: '2025-03-01',
    status: 'completed',
    technician: 'Roberto Almeida',
    description: 'Substituição do painel de controle do respirador',
    notes: 'Equipamento substituído e testado',
    parts: [
      { name: 'Painel de controle', quantity: 1, replaced: true }
    ],
    priority: 'critical'
  }
];

// Função para predição de higienização baseada em IA
const predictHygienizationNeeds = (beds: IBed[]): IBed[] => {
  // Em um sistema real, isso seria baseado em um modelo de ML
  // Para este exemplo, usaremos uma lógica simples
  return beds
    .filter(bed => bed.status === 'available')
    .map(bed => {
      // Gerar um score aleatório para simular predição
      const predictionScore = Math.random();
      return {
        ...bed,
        hygienizationPrediction: {
          score: predictionScore,
          urgent: predictionScore > 0.8,
          recommendedDate: addDays(new Date(), Math.floor(10 + Math.random() * 20)).toISOString(),
          reason: predictionScore > 0.8 
            ? 'Desgaste acelerado detectado' 
            : 'Higienização preventiva recomendada'
        }
      };
    })
    .sort((a, b) => 
      (b.hygienizationPrediction?.score || 0) - (a.hygienizationPrediction?.score || 0)
    )
    .slice(0, 10); // Top 10 leitos que precisam de higienização
};

// Função auxiliar para adicionar dias a uma data
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Componente Principal
export const HygienizationStatusCards: React.FC<HygienizationStatusCardsProps> = ({ 
  className,
  selectedHospitalId 
}) => {
  const { networkData, currentUser, beds } = useNetworkData();
  
  const hasAllHospitalsPermission = currentUser?.permissions?.includes('VIEW_ALL_HOSPITALS');
  const defaultHospital = hasAllHospitalsPermission ? 'all' : currentUser?.hospitalId || '';
  const [selectedHospital, setSelectedHospital] = useState(selectedHospitalId || defaultHospital);
  const [showNewHygienizationDialog, setShowNewHygienizationDialog] = useState(false);
  const [newHygienization, setNewHygienization] = useState<Partial<IHygienizationHistory>>({
    type: 'preventive',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    description: ''
  });
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [maintenanceHistory, setHygienizationHistory] = useState<IHygienizationHistory[]>(mockHygienizationHistory);
  const [activeTab, setActiveTab] = useState<string>('current');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado separado para cada card
  const [maintenanceHospital, setHygienizationHospital] = useState('all');
  const [pendingHospital, setPendingHospital] = useState('all');

  // Main functions using the utility function
  const getHygienizationBedsCount = () => {
    return countBedsByStatus(networkData, 'hygienization', maintenanceHospital);
  };

  const getPendingHygienizationBedsCount = () => {
    return countBedsByStatus(networkData, 'available', pendingHospital);
  };
  
  // Obter camas em higienização
  const getHygienizationBeds = () => {
    return beds.filter(bed => 
      bed.status === 'hygienization' && 
      (maintenanceHospital === 'all' || bed.hospital === getHospitalName(maintenanceHospital))
    );
  };
  
  // Obter camas com higienização prevista (usando IA)
  const getPredictedHygienizationBeds = () => {
    const availableBeds = beds.filter(bed => 
      bed.status === 'available' && 
      (pendingHospital === 'all' || bed.hospital === getHospitalName(pendingHospital))
    );
    
    return predictHygienizationNeeds(availableBeds);
  };
  
  // Obter nome do hospital pelo ID
  const getHospitalName = (hospitalId: string): string => {
    if (hospitalId === 'all') return '';
    const hospital = networkData?.hospitals.find(h => h.id === hospitalId);
    return hospital?.name || '';
  };
  
  // Função para lidar com criação de nova higienização
  const handleCreateHygienization = () => {
    setIsSubmitting(true);
    
    // Simular tempo de processamento
    setTimeout(() => {
      // Criar nova entrada de higienização
      const newEntry: IHygienizationHistory = {
        id: `maint-${Date.now().toString(36)}`,
        bedId: selectedBedId,
        type: newHygienization.type as 'preventive' | 'corrective',
        date: newHygienization.date || new Date().toISOString().split('T')[0],
        status: 'pending',
        description: newHygienization.description || '',
        priority: newHygienization.priority as 'low' | 'medium' | 'high' | 'critical'
      };
      
      // Atualizar histórico
      setHygienizationHistory([newEntry, ...maintenanceHistory]);
      
      // Resetar form
      setNewHygienization({
        type: 'preventive',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        description: ''
      });
      setSelectedBedId('');
      setShowNewHygienizationDialog(false);
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Função para obter cor baseada na prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };
  
  // Função para obter cor baseada no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'cancelled': return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };
  
  // Função para atualizar status de higienização
  const updateHygienizationStatus = (id: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    setHygienizationHistory(prev => 
      prev.map(item => 
        item.id === id 
          ? {
              ...item, 
              status: newStatus,
              completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : item.completedDate
            }
          : item
      )
    );
  };

  // Componente para cada card de higienização
  const HygienizationCard: React.FC<{
    title: string;
    subtitle: string;
    count: number;
    selectedHospital: string;
    onHospitalChange: (hospital: string) => void;
    hasAllHospitalsPermission: boolean | undefined;
    hospitals: IHospital[];
    className?: string;
    cardType: 'current' | 'pending';
  }> = ({
    title,
    subtitle,
    count,
    selectedHospital,
    onHospitalChange,
    hasAllHospitalsPermission,
    hospitals,
    className,
    cardType
  }) => {
    const HospitalSelect = () => (
      <Select 
        value={selectedHospital}
        onValueChange={onHospitalChange}
        disabled={!hasAllHospitalsPermission}
      >
        <SelectTrigger className="w-52 bg-gray-700/40 border-gray-600/50 rounded-2xl">
          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {hasAllHospitalsPermission && (
            <SelectItem value="all">Todos</SelectItem>
          )}
          {hospitals.map(hospital => (
            <SelectItem key={hospital.id} value={hospital.id}>
              {hospital.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    return (
      <div className={`p-6 rounded-3xl space-y-4 ${className}`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-semibold text-gray-100 mt-4 flex items-center gap-2">
            {cardType === 'current' ? (
              <Droplets className="h-5 w-5 text-amber-400" />
            ) : (
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            )}
            {title}
          </h3>
          <HospitalSelect />
        </div>

        <div className="flex items-center text-sm text-gray-400 mb-4 pt-2">
          <Calendar className="w-4 h-4 mr-2" />
          {subtitle}
        </div>

        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 dark:hover:bg-white/10 transition-colors">
          <div className="text-sm text-gray-400 mb-2">Quantidade de Leitos</div>
          <div className="text-4xl font-bold text-gray-100">
            {count} <span className="text-gray-400 text-2xl">leitos</span>
          </div>
        </div>

        {/* Adicionar botão de nova higienização apenas no card de leitos pendentes */}
        {cardType === 'pending' && (
          <Button 
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowNewHygienizationDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agendar Nova Higienização
          </Button>
        )}
      </div>
    );
  };
  
  // Componente para lista de camas em higienização
  const HygienizationList: React.FC<{
    beds: IBed[];
    type: 'current' | 'predicted';
  }> = ({ beds, type }) => {
    if (beds.length === 0) {
      return (
        <div className="bg-gray-800/50 p-6 rounded-xl text-center">
          <Droplets className="h-12 w-12 mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">
            {type === 'current' 
              ? 'Nenhum leito em higienização no momento.'
              : 'Nenhuma higienização prevista.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {beds.map(bed => (
          <div 
            key={bed.id}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex items-start gap-4"
          >
            <div className={`
              p-3 rounded-lg 
              ${type === 'current' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}
            `}>
              {type === 'current' 
                ? <Droplets className="h-6 w-6" />
                : <Calendar className="h-6 w-6" />
              }
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-100">
                    Leito {bed.number}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {bed.department} - {bed.hospital}
                  </p>
                </div>
                
                {type === 'current' ? (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    Em Higienização
                  </Badge>
                ) : bed.hygienizationPrediction?.urgent ? (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/30 animate-pulse">
                    Higienização Urgente
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    Higienização Preventiva
                  </Badge>
                )}
              </div>
              
              {type === 'predicted' && bed.hygienizationPrediction && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">
                      Data recomendada: {new Date(bed.hygienizationPrediction.recommendedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-300">
                      {bed.hygienizationPrediction.reason}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => {
                        setNewHygienization({
                          ...newHygienization,
                          date: new Date(bed.hygienizationPrediction?.recommendedDate || '').toISOString().split('T')[0],
                          description: bed.hygienizationPrediction?.reason || 'Higienização preventiva',
                          type: 'preventive',
                          priority: bed.hygienizationPrediction?.urgent ? 'high' : 'medium'
                        });
                        setSelectedBedId(bed.id);
                        setShowNewHygienizationDialog(true);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Higienização
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Componente para histórico de higienização
  const HygienizationHistory: React.FC = () => {
    // Filtrar histórico baseado no status
    const filteredHistory = maintenanceHistory.filter(item => 
      activeTab === 'all' || 
      (activeTab === 'current' && (item.status === 'pending' || item.status === 'in_progress')) ||
      (activeTab === 'completed' && item.status === 'completed') ||
      (activeTab === 'cancelled' && item.status === 'cancelled')
    );

    // Funções de validação de tipo
    const isValidHygienizationType = (type: string): type is ('preventive' | 'corrective') => {
      return type === 'preventive' || type === 'corrective';
    };

    const isValidPriorityType = (priority: string): priority is ('low' | 'medium' | 'high' | 'critical') => {
      return ['low', 'medium', 'high', 'critical'].includes(priority);
    };

    const handleTypeChange = (value: string) => {
      setNewHygienization({
        ...newHygienization,
        type: isValidHygienizationType(value) ? value : 'preventive'
      });
    };
    
    const handlePriorityChange = (value: string) => {
      setNewHygienization({
        ...newHygienization,
        priority: isValidPriorityType(value) ? value : 'medium'
      });
    };
    
    if (filteredHistory.length === 0) {
      return (
        <div className="bg-gray-800/50 p-6 rounded-xl text-center">
          <History className="h-12 w-12 mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">
            Nenhum registro de higienização encontrado.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredHistory.map(item => (
          <div 
            key={item.id}
            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-lg 
                  ${item.type === 'preventive' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-orange-500/20 text-orange-400'}
                `}>
                  {item.type === 'preventive' 
                    ? <Calendar className="h-5 w-5" />
                    : <Droplets className="h-5 w-5" />
                  }
                </div>
                <div>
                  <h4 className="font-medium text-gray-100">
                    Leito {item.bedId}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <Badge className={getPriorityColor(item.priority)}>
                  {item.priority === 'critical' ? 'Crítica' :
                   item.priority === 'high' ? 'Alta' :
                   item.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
                
                <Badge className={`mt-2 ${getStatusColor(item.status)}`}>
                  {item.status === 'completed' ? 'Concluída' :
                   item.status === 'in_progress' ? 'Em Andamento' :
                   item.status === 'pending' ? 'Pendente' : 'Cancelada'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-3 border-t border-gray-700/50 pt-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Agendada: {item.date}</span>
                
                {item.completedDate && (
                  <>
                    <ArrowRight className="h-4 w-4 mx-1" />
                    <span>Concluída: {item.completedDate}</span>
                  </>
                )}
              </div>
              
              {item.technician && (
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Users className="h-4 w-4" />
                  <span>Técnico: {item.technician}</span>
                </div>
              )}
            </div>
            
            {(item.status === 'pending' || item.status === 'in_progress') && (
              <div className="mt-3 flex gap-2">
                {item.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => updateHygienizationStatus(item.id, 'in_progress')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                )}
                
                {item.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => updateHygienizationStatus(item.id, 'completed')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Concluir
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => updateHygienizationStatus(item.id, 'cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Cards de status de higienização */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <HygienizationCard 
          title="Leitos em Higienização"
          subtitle="Previsão de conclusão: 7 dias"
          count={getHygienizationBedsCount()}
          selectedHospital={maintenanceHospital}
          onHospitalChange={setHygienizationHospital}
          hasAllHospitalsPermission={hasAllHospitalsPermission}
          hospitals={networkData?.hospitals || []}
          className="bg-gradient-to-br from-amber-400/20 to-orange-300/20 hover:from-amber-400/30 hover:to-orange-300/30 dark:from-amber-600/20 dark:to-orange-500/20 border border-amber-200/20 dark:border-amber-400/20"
          cardType="current"
        />
        
        <HygienizationCard 
          title="Leitos para Higienização" 
          subtitle="Previsão para início: 15 dias"
          count={getPendingHygienizationBedsCount()}
          selectedHospital={pendingHospital}
          onHospitalChange={setPendingHospital}
          hasAllHospitalsPermission={hasAllHospitalsPermission}
          hospitals={networkData?.hospitals || []}
          className="bg-gradient-to-br from-emerald-400/20 to-teal-300/20 hover:from-emerald-400/30 hover:to-teal-300/30 dark:from-emerald-600/20 dark:to-teal-500/20 border border-emerald-200/20 dark:border-emerald-400/20"
          cardType="pending"
        />
      </div>
      
      {/* Abas para diferentes visualizações */}
      <Tabs defaultValue="current" className="mt-6">
        <TabsList className="bg-gray-800/60 border-gray-700/50 p-1 mb-6">
          <TabsTrigger
            value="current"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Droplets className="h-4 w-4 mr-2" />
            Em Higienização
          </TabsTrigger>
          <TabsTrigger
            value="predicted"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Previsões de IA
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-amber-400" />
            Leitos Atualmente em Higienização
          </h3>
          
          <HygienizationList beds={getHygienizationBeds()} type="current" />
        </TabsContent>
        
        <TabsContent value="predicted" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              Previsões de Higienização (IA)
            </h3>
            
            <Button 
              onClick={() => setShowNewHygienizationDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Higienização
            </Button>
          </div>
          
          <HygienizationList beds={getPredictedHygienizationBeds()} type="predicted" />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <History className="h-5 w-5 text-purple-400" />
              Histórico de Manutenções
            </h3>
            
            <div className="flex items-center gap-2">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="bg-gray-800/60 border-gray-700/50">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="current">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para criar nova higienização */}
      <Dialog open={showNewHygienizationDialog} onOpenChange={setShowNewHygienizationDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Agendar Nova Higienização</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os detalhes para agendar uma nova higienização para um leito.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Leito</label>
              <Select 
                value={selectedBedId} 
                onValueChange={setSelectedBedId}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <BedDouble className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Selecione um leito" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-56">
                  {beds
                    .filter(bed => bed.status !== 'hygienization')
                    .sort((a, b) => a.number.localeCompare(b.number))
                    .map(bed => (
                      <SelectItem key={bed.id} value={bed.id}>
                        Leito {bed.number} - {bed.department} - {bed.hospital}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Tipo de Higienização</label>
                <Select 
                    value={newHygienization.type} 
                    onValueChange={(value) => setNewHygienization({
                      ...newHygienization, 
                      type: value as 'preventive' | 'corrective'
                    })}
                  >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="preventive">Preventiva</SelectItem>
                    <SelectItem value="corrective">Corretiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Prioridade</label>
                <Select 
                  value={newHygienization.priority} 
                  onValueChange={value => setNewHygienization({
                    ...newHygienization, 
                    priority: ['low', 'medium', 'high', 'critical'].includes(value) ? 
                      value as 'low' | 'medium' | 'high' | 'critical' : 
                      'medium' // valor padrão
                  })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Data Programada</label>
              <Input 
                type="date" 
                value={newHygienization.date} 
                onChange={e => setNewHygienization({...newHygienization, date: e.target.value})}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Descrição</label>
              <Input 
                value={newHygienization.description} 
                onChange={e => setNewHygienization({...newHygienization, description: e.target.value})}
                placeholder="Descreva o motivo da higienização"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Notificações</h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notify-team" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="notify-team" className="ml-2 text-sm text-gray-300">
                    Notificar equipe de higienização
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notify-managers" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="notify-managers" className="ml-2 text-sm text-gray-300">
                    Notificar gerentes do departamento
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="add-calendar" 
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <label htmlFor="add-calendar" className="ml-2 text-sm text-gray-300">
                    Adicionar ao calendário de higienização
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700"
              onClick={() => setShowNewHygienizationDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              disabled={!selectedBedId || !newHygienization.description || isSubmitting}
              onClick={handleCreateHygienization}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  Agendando...
                </>
              ) : (
                <>
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Agendar Higienização
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
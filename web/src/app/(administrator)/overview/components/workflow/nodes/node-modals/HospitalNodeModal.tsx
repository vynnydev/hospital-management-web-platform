import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/organisms/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { NodeHeader } from '../NodeHeader';
import { Building2, BedDouble, Users, Clock, Activity, Brain, AlertTriangle,
  TrendingUp, HeartPulse, LineChart, BarChart, Settings2 } from 'lucide-react';
import { TaskType } from '@/types/workflow/task';
import { AppNodeData } from '@/types/workflow/appNode';
import { HospitalFlowAutomationMenu } from '../../HospitalFlowAutomationMenu';
// import { HospitalAutomationFields } from '../../HospitalAutomationFields';

interface HospitalNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AppNodeData;
  nodeId: string;
}

export const HospitalNodeModal: React.FC<HospitalNodeModalProps> = ({ 
  isOpen, 
  onClose, 
  data, 
  nodeId 
}) => {
  const renderDetailCard = (
    icon: React.ReactNode, 
    title: string, 
    value: string | number,
    trend?: { value: number; isPositive: boolean }
  ) => (
    <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 transform rotate-180" />}
              {trend.value}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <NodeHeader taskType={TaskType.NETWORK} nodeId={nodeId} />
        
        <DialogHeader className="pb-2 -mt-8">
          <DialogTitle className="flex items-center gap-2 -mt-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            {data.label}
            <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-800">
              ID: {nodeId}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Visualização e automação detalhada do hospital
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {renderDetailCard(
              <BedDouble className="h-5 w-5 text-blue-500" />, 
              "Total de Leitos", 
              data.metrics?.beds || 400,
              { value: 5, isPositive: true }
            )}
            {renderDetailCard(
              <Users className="h-5 w-5 text-purple-500" />, 
              "Pacientes Ativos", 
              data.metrics?.patients || 324,
              { value: 2.5, isPositive: true }
            )}
            {renderDetailCard(
              <Clock className="h-5 w-5 text-orange-500" />, 
              "Média Permanência", 
              `${data.metrics?.avgStay || 5.2} dias`,
              { value: 0.8, isPositive: false }
            )}
            {renderDetailCard(
              <Activity className="h-5 w-5 text-green-500" />, 
              "Taxa Rotatividade", 
              data.metrics?.turnover || 12.3,
              { value: 3.2, isPositive: true }
            )}
          </div>

          {/* <HospitalAutomationFields nodeId={nodeId} /> */}

          <div className="h-[calc(100vh-200px)] mt-8">
            <HospitalFlowAutomationMenu />
          </div>

          <Card className="mt-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-500" />
                Análise Preditiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Probabilidade de Saturação (48h)
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.aiMetrics?.saturation || 15}%
                      </p>
                      <LineChart className="h-5 w-5 text-blue-500 mb-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Taxa de Ocupação Prevista
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.metrics?.occupancy || 85.5}%
                      </p>
                      <BarChart className="h-5 w-5 text-green-500 mb-1" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Previsão de Altas (7 dias)
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.aiMetrics?.discharges || 45}
                      </p>
                      <HeartPulse className="h-5 w-5 text-purple-500 mb-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tempo Médio de Espera
                    </p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.metrics?.waitTime || "2.5h"}
                      </p>
                      <Clock className="h-5 w-5 text-orange-500 mb-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {(data.alert || data.metrics?.highDemand) && (
            <Card className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="pt-4 flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                <p>Alta demanda prevista nas próximas 24 horas</p>
              </CardContent>
            </Card>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300"
          >
            Fechar
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
            <Settings2 className="h-4 w-4" />
            Configurar Automação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
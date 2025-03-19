/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Database, Code, RefreshCw, Clock, Percent, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Button } from '@/components/ui/organisms/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/organisms/tooltip';
import { MetricFormState } from './MetricEditor';
import { INetworkData } from '@/types/hospital-network-types';

// Fontes de dados disponíveis
const dataSources = [
  { id: 'beds', name: 'Leitos', description: 'Ocupação e disponibilidade de leitos' },
  { id: 'patients', name: 'Pacientes', description: 'Dados demográficos e clínicos de pacientes' },
  { id: 'admissions', name: 'Admissões', description: 'Registros de entrada e saída de pacientes' },
  { id: 'billing', name: 'Faturamento', description: 'Receitas, despesas e indicadores financeiros' },
  { id: 'staff', name: 'Equipe', description: 'Dados de recursos humanos e produtividade' },
  { id: 'infections', name: 'Infecções', description: 'Indicadores de infecção hospitalar' },
  { id: 'surveys', name: 'Pesquisas', description: 'Resultados de pesquisas de satisfação' },
  { id: 'custom', name: 'Personalizado', description: 'Fonte de dados manual ou personalizada' }
];

// Períodos de atualização
const refreshIntervals = [
  { id: 'realtime', name: 'Tempo real', description: 'Atualização contínua' },
  { id: 'hourly', name: 'A cada hora', description: 'Atualização horária' },
  { id: 'daily', name: 'Diário', description: 'Atualização uma vez por dia' },
  { id: 'weekly', name: 'Semanal', description: 'Atualização uma vez por semana' },
  { id: 'monthly', name: 'Mensal', description: 'Atualização uma vez por mês' }
];

// Unidades de medida comuns
const commonUnits = [
  '%', 'R$', 'min', 'hr', 'dias', 'und', 'pts'
];

interface MetricDataSettingsProps {
  formState: MetricFormState;
  updateFormState: (field: string, value: any) => void;
  networkData: INetworkData | null;
}

export const MetricDataSettings: React.FC<MetricDataSettingsProps> = ({
  formState,
  updateFormState,
  networkData
}) => {
  // Gerar variáveis disponíveis com base na fonte de dados selecionada
  const getAvailableVariables = () => {
    switch (formState.dataSource) {
      case 'beds':
        return [
          { name: 'total_leitos', description: 'Número total de leitos disponíveis' },
          { name: 'leitos_ocupados', description: 'Número de leitos atualmente ocupados' },
          { name: 'leitos_disponiveis', description: 'Número de leitos atualmente disponíveis' },
          { name: 'leitos_manutencao', description: 'Número de leitos em manutenção' },
          { name: 'taxa_ocupacao', description: 'Porcentagem de leitos ocupados' }
        ];
      case 'patients':
        return [
          { name: 'total_pacientes', description: 'Número total de pacientes' },
          { name: 'pacientes_internados', description: 'Número de pacientes internados' },
          { name: 'pacientes_ambulatoriais', description: 'Número de pacientes ambulatoriais' },
          { name: 'idade_media', description: 'Idade média dos pacientes' },
          { name: 'tempo_medio_permanencia', description: 'Tempo médio de permanência dos pacientes' }
        ];
      case 'admissions':
        return [
          { name: 'admissoes_totais', description: 'Número total de admissões' },
          { name: 'altas_totais', description: 'Número total de altas' },
          { name: 'admissoes_emergencia', description: 'Número de admissões via emergência' },
          { name: 'readmissoes_30_dias', description: 'Número de readmissões em 30 dias' },
          { name: 'tempo_medio_internacao', description: 'Tempo médio de internação' }
        ];
      case 'billing':
        return [
          { name: 'receita_total', description: 'Receita total' },
          { name: 'custos_totais', description: 'Custos totais' },
          { name: 'receita_por_paciente', description: 'Receita média por paciente' },
          { name: 'custos_por_paciente', description: 'Custo médio por paciente' },
          { name: 'margem_lucro', description: 'Margem de lucro percentual' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
        <Label className="flex items-center gap-1 text-gray-300">
          <Code className="h-4 w-4 text-blue-500" />
          <span>Fórmula de Cálculo</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 ml-1 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 border-gray-700 text-white">
                <p className="max-w-xs">
                  Use variáveis disponíveis para compor a fórmula. Operadores suportados: +, -, *, /, (, ), %, ^
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Textarea 
          value={formState.formula}
          onChange={(e) => updateFormState('formula', e.target.value)}
          placeholder="Ex: (leitos_ocupados / total_leitos) * 100"
          rows={2}
          className="bg-gray-800 border-gray-700 text-white resize-none font-mono text-sm"
        />
        
        <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
          <span>Use operadores matemáticos e variáveis disponíveis</span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
            onClick={() => {
              // Código para validar a fórmula
            }}
          >
            Validar Fórmula
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1 text-gray-300">
            <Percent className="h-4 w-4 text-blue-500" />
            <span>Unidade de Medida</span>
          </Label>
          <div className="flex">
            <Select 
              value={formState.unit}
              onValueChange={(value) => updateFormState('unit', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white rounded-r-none border-r-0 min-w-[80px]">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {commonUnits.map(unit => (
                  <SelectItem 
                    key={unit} 
                    value={unit}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                  >
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Personalizada" 
              className="bg-gray-800 border-gray-700 text-white rounded-l-none flex-1"
              value={!commonUnits.includes(formState.unit) ? formState.unit : ''}
              onChange={(e) => {
                if (e.target.value) {
                  updateFormState('unit', e.target.value);
                }
              }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-1 text-gray-300">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Período de Agregação</span>
          </Label>
          <Select defaultValue="day">
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="hour" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                Por Hora
              </SelectItem>
              <SelectItem value="day" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                Por Dia
              </SelectItem>
              <SelectItem value="week" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                Por Semana
              </SelectItem>
              <SelectItem value="month" className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
                Por Mês
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Variáveis disponíveis */}
      <div className="bg-gray-900 border border-gray-700 rounded-md p-4 mt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-500" />
          Variáveis Disponíveis para {dataSources.find(src => src.id === formState.dataSource)?.name || 'esta fonte de dados'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getAvailableVariables().map((variable) => (
            <div 
              key={variable.name} 
              className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center gap-2 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => {
                // Código para inserir a variável na fórmula
                const currentFormula = formState.formula;
                const updatedFormula = currentFormula ? `${currentFormula} ${variable.name}` : variable.name;
                updateFormState('formula', updatedFormula);
              }}
            >
              <div className="rounded-full bg-blue-900/30 p-1 flex items-center justify-center">
                <Code className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-blue-400">{variable.name}</div>
                <div className="text-xs text-gray-400 truncate">{variable.description}</div>
              </div>
            </div>
          ))}
          
          {getAvailableVariables().length === 0 && (
            <div className="col-span-2 p-3 bg-gray-800 rounded-md text-center text-gray-400 text-sm">
              Nenhuma variável pré-definida disponível para esta fonte de dados.
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-400">
          Clique em uma variável para adicioná-la à fórmula. Você também pode usar constantes numéricas diretamente.
        </div>
      </div>
    </div>
    </div>
  );
};
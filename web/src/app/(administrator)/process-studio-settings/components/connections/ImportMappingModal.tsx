import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/organisms/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/organisms/select';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { HelpCircle, ArrowRight, Check, AlertTriangle } from 'lucide-react';

import { IImportValidationResult } from '@/types/connectors-types';

interface ImportMappingModalProps {
  validation: IImportValidationResult;
  onConfirm: (mappings: Array<{ source: string; target: string }>) => void;
  onCancel: () => void;
}

// Lista fixa de campos do sistema (isto seria recuperado da API em um ambiente real)
const systemFields = [
  'name', 'url', 'authMethod', 'clientId', 'clientSecret', 'apiKey', 
  'syncInterval', 'apiVersion', 'dataSource', 'dataTarget', 
  'description', 'priority', 'department', 'secure', 'version'
];

export const ImportMappingModal: React.FC<ImportMappingModalProps> = ({
  validation,
  onConfirm,
  onCancel
}) => {
  // Estado para armazenar os mapeamentos
  const [mappings, setMappings] = useState<Record<string, string>>({});
  
  // Preencher mapeamentos iniciais com sugestões
  useEffect(() => {
    if (validation.suggestedMappings) {
      const initialMappings: Record<string, string> = {};
      validation.suggestedMappings.forEach(suggestion => {
        if (suggestion.confidence > 0.7) {
          initialMappings[suggestion.sourceField] = suggestion.suggestedTargetField;
        }
      });
      setMappings(initialMappings);
    }
  }, [validation]);
  
  // Manipulador para alteração de seleção
  const handleSelectChange = (sourceField: string, targetField: string) => {
    setMappings(prev => ({
      ...prev,
      [sourceField]: targetField
    }));
  };
  
  // Manipulador para confirmação
  const handleConfirm = () => {
    const mappingArray = Object.entries(mappings).map(([source, target]) => ({
      source,
      target
    }));
    onConfirm(mappingArray);
  };
  
  // Calcular estatísticas
  const totalMapped = Object.keys(mappings).length;
  const percentMapped = validation.totalFields > 0 
    ? Math.round((totalMapped / validation.totalFields) * 100) 
    : 0;
  
  // Determinar status de compatibilidade
  let compatibilityStatus: 'high' | 'medium' | 'low' = 'low';
  if (percentMapped >= 80) {
    compatibilityStatus = 'high';
  } else if (percentMapped >= 40) {
    compatibilityStatus = 'medium';
  }
  
  // Campos a mapear (campos não mapeados do arquivo de importação)
  const fieldsToMap = validation.unmatchedFields || [];

  return (
    <Dialog open onOpenChange={open => !open && onCancel()}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapeamento de Campos para Importação</DialogTitle>
          <DialogDescription>
            Mapeie os campos do arquivo importado para os campos do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Estatísticas de compatibilidade */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Compatibilidade</h3>
              <Badge 
                variant={
                  compatibilityStatus === 'high' 
                    ? 'success' 
                    : compatibilityStatus === 'medium' 
                    ? 'warning' 
                    : 'destructive'
                }
                className="px-2 py-1"
              >
                {compatibilityStatus === 'high' 
                  ? 'Alta' 
                  : compatibilityStatus === 'medium' 
                  ? 'Média' 
                  : 'Baixa'
                }
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Campos mapeados</span>
                <span>{totalMapped} de {validation.totalFields}</span>
              </div>
              
              {/* Barra de progresso */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    compatibilityStatus === 'high' 
                      ? 'bg-green-500' 
                      : compatibilityStatus === 'medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${percentMapped}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Instruções */}
          <div className="flex items-start space-x-2 mb-5 text-sm text-gray-600 dark:text-gray-400">
            <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              Selecione os campos do sistema que correspondem a cada campo do arquivo importado. 
              Os campos com alta confiança já estão pré-mapeados.
            </p>
          </div>
          
          {/* Tabela de mapeamento */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campo de Origem
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                    
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campo do Sistema
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Confiança
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {/* Campos já mapeados com alta confiança */}
                {validation.suggestedMappings?.filter(s => s.confidence > 0.7).map(suggestion => (
                  <tr key={suggestion.sourceField} className="bg-green-50 dark:bg-green-900/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {suggestion.sourceField}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ArrowRight className="h-4 w-4 mx-auto text-gray-400" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{suggestion.suggestedTargetField}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
                
                {/* Campos a serem mapeados (não mapeados ou com baixa confiança) */}
                {fieldsToMap.map(field => (
                  <tr key={field}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {field}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ArrowRight className="h-4 w-4 mx-auto text-gray-400" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Select 
                        value={mappings[field] || ''}
                        onValueChange={(value) => handleSelectChange(field, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar campo" />
                        </SelectTrigger>
                        <SelectContent>
                          {systemFields
                            .filter(f => !Object.values(mappings).includes(f) || mappings[field] === f)
                            .map(targetField => (
                              <SelectItem key={targetField} value={targetField}>
                                {targetField}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {validation.suggestedMappings?.find(s => s.sourceField === field)?.confidence ? (
                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                          {Math.round((validation.suggestedMappings?.find(s => s.sourceField === field)?.confidence || 0) * 100)}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">
                          0%
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Campos não mapeáveis */}
                {validation.unmatchedFields && validation.unmatchedFields.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Check className="h-8 w-8 text-green-500 mb-2" />
                        <p>Todos os campos foram mapeados com sucesso!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Aviso de campos não mapeados */}
          {fieldsToMap.length > 0 && totalMapped < validation.totalFields && (
            <div className="mt-4 flex items-start space-x-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>
                Há {validation.totalFields - totalMapped} campos não mapeados. Os dados destes campos não serão importados.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={totalMapped === 0}
          >
            Confirmar Importação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
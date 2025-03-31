/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/organisms/table';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { AlertCircle, CheckCircle, FileSpreadsheet, Brain, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/organisms/spinner';
import AIMappingConnectorsService from '@/services/general/connectors/AIMappingConnectorsService';
  
  interface DataPreviewProps {
    data: any[];
    mappings: Array<{ sourceField: string; targetField: string }>;
    onApprove: () => void;
    onCancel: () => void;
    sourceFileName?: string;
  }
  
  export const DataPreview: React.FC<DataPreviewProps> = ({
    data,
    mappings,
    onApprove,
    onCancel,
    sourceFileName
  }) => {
    const [activeTab, setActiveTab] = useState<'source' | 'mapped'>('source');
    const [aiAnalysis, setAiAnalysis] = useState<{
      completed: boolean;
      loading: boolean;
      issues: Array<{ field: string; issue: string; severity: 'critical' | 'warning' | 'info' }>;
      recommendations: string[];
      compatibilityScore: number;
    }>({
      completed: false,
      loading: false,
      issues: [],
      recommendations: [],
      compatibilityScore: 0
    });
  
    // Colunas para o modo de origem
    const sourceColumns = data.length > 0 ? Object.keys(data[0]) : [];
    
    // Colunas mapeadas
    const mappedColumns = mappings.map(m => m.targetField);
    
    // Dados transformados com base nos mapeamentos
    const mappedData = data.map(row => {
      const mappedRow: Record<string, any> = {};
      mappings.forEach(({ sourceField, targetField }) => {
        mappedRow[targetField] = row[sourceField];
      });
      return mappedRow;
    });
  
    // Iniciar análise de IA quando a visualização for montada
    useEffect(() => {
      const runAiAnalysis = async () => {
        if (data.length === 0 || !mappings.length) return;
        
        setAiAnalysis(prev => ({ ...prev, loading: true }));
        
        try {
          // Em um cenário real, isso chamaria a API real do AWS Bedrock
          // Aqui estamos simulando uma chamada de API para fins de demonstração
          const compatibilityReport = await AIMappingConnectorsService.generateCompatibilityReport(
            data,
            mappings.reduce((acc, { targetField }) => {
              acc[targetField] = '';
              return acc;
            }, {} as Record<string, string>)
          );
          
          setAiAnalysis({
            completed: true,
            loading: false,
            issues: compatibilityReport.issues,
            recommendations: compatibilityReport.recommendations,
            compatibilityScore: compatibilityReport.compatibilityScore
          });
        } catch (error) {
          console.error('Erro ao analisar dados com IA:', error);
          setAiAnalysis(prev => ({ 
            ...prev, 
            loading: false,
            completed: true,
            issues: [{ field: 'general', issue: 'Falha ao analisar com IA', severity: 'warning' }]
          }));
        }
      };
      
      runAiAnalysis();
    }, [data, mappings]);
  
    // Determina se há problemas críticos que impediriam a importação
    const hasCriticalIssues = aiAnalysis.issues.some(issue => issue.severity === 'critical');
    
    // Renderiza um indicador de severidade para os problemas
    const renderSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
      switch (severity) {
        case 'critical':
          return <Badge variant="destructive">Crítico</Badge>;
        case 'warning':
          return <Badge variant="warning">Atenção</Badge>;
        case 'info':
          return <Badge variant="secondary">Info</Badge>;
        default:
          return null;
      }
    };
    
    // Renderiza uma cor de status com base na pontuação de compatibilidade
    const getCompatibilityColor = () => {
      if (aiAnalysis.compatibilityScore >= 80) return 'text-green-500';
      if (aiAnalysis.compatibilityScore >= 60) return 'text-amber-500';
      return 'text-red-500';
    };
  
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            Prévia de Dados
          </CardTitle>
          <CardDescription>
            {sourceFileName ? `Arquivo: ${sourceFileName}` : 'Verificação de dados antes da importação'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Campos Mapeados</div>
                <div className="font-bold text-xl">{mappedColumns.length}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Compatibilidade</div>
                <div className={`font-bold text-xl ${getCompatibilityColor()}`}>
                  {aiAnalysis.loading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    `${aiAnalysis.compatibilityScore}%`
                  )}
                </div>
              </div>
            </div>
            
            {/* Análise de IA */}
            {!aiAnalysis.loading && aiAnalysis.completed && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-purple-500" />
                    Análise de IA
                  </h3>
                  <Badge 
                    variant={hasCriticalIssues ? "destructive" : "success"}
                    className="px-2 py-1"
                  >
                    {hasCriticalIssues ? 'Problemas Detectados' : 'Dados Compatíveis'}
                  </Badge>
                </div>
                
                {aiAnalysis.issues.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <h4 className="text-sm font-medium">Problemas Encontrados:</h4>
                    {aiAnalysis.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        {renderSeverityBadge(issue.severity)}
                        <span className="font-medium">
                          {issue.field !== 'general' ? `${issue.field}:` : ''}
                        </span>
                        <span>{issue.issue}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {aiAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recomendações:</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside pl-1">
                      {aiAnalysis.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {aiAnalysis.loading && (
              <div className="flex items-center justify-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <Spinner className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Analisando dados com IA...
                  </p>
                </div>
              </div>
            )}
            
            {/* Tabs para alternar entre visualização original e mapeada */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'source' | 'mapped')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="source">Dados Originais</TabsTrigger>
                <TabsTrigger value="mapped">Dados Mapeados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="source" className="mt-3">
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {sourceColumns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.slice(0, 10).map((row, rowIdx) => (
                          <TableRow key={rowIdx}>
                            {sourceColumns.map((column) => (
                              <TableCell key={column}>
                                {typeof row[column] === 'object' 
                                  ? JSON.stringify(row[column]) 
                                  : String(row[column] ?? '')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {data.length > 10 && (
                    <div className="p-2 text-center text-sm text-gray-500 border-t">
                      Mostrando 10 de {data.length} registros
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="mapped" className="mt-3">
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {mappedColumns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappedData.slice(0, 10).map((row, rowIdx) => (
                          <TableRow key={rowIdx}>
                            {mappedColumns.map((column) => (
                              <TableCell key={column}>
                                {typeof row[column] === 'object' 
                                  ? JSON.stringify(row[column]) 
                                  : String(row[column] ?? '')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {mappedData.length > 10 && (
                    <div className="p-2 text-center text-sm text-gray-500 border-t">
                      Mostrando 10 de {mappedData.length} registros
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Resumo do mapeamento */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resumo do Mapeamento de Campos</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {mappings.map((mapping, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <span className="font-medium">{mapping.sourceField}</span>
                    <ArrowRight className="h-3 w-3 mx-2 text-gray-500" />
                    <span>{mapping.targetField}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Alertas e avisos */}
            {hasCriticalIssues && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Foram detectados problemas críticos que podem impedir a importação correta dos dados.
                  Revise os problemas indicados antes de prosseguir.
                </AlertDescription>
              </Alert>
            )}
            
            {!hasCriticalIssues && aiAnalysis.completed && (
              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Pronto para importar</AlertTitle>
                <AlertDescription>
                  Os dados foram analisados e estão prontos para importação. Revise as recomendações
                  para otimizar o processo.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Botões de ação */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={onApprove}
                disabled={hasCriticalIssues || aiAnalysis.loading}
              >
                {aiAnalysis.loading ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Analisando...
                  </>
                ) : (
                  'Confirmar Importação'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};
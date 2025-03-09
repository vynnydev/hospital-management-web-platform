/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  AlertTriangle,
  ArrowUpCircle,
  BadgePercent,
  BarChart3, 
  Brain, 
  Clock, 
  FileText, 
  Microscope,
  Shield, 
  ThumbsUp, 
  Zap 
} from 'lucide-react';
import { IPatient, IPatientCareHistory } from '@/types/hospital-network-types';
import { Progress } from '../../organisms/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../organisms/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../organisms/card';
import { Badge } from '../../organisms/badge';
import { Alert, AlertDescription, AlertTitle } from '../../organisms/alert';
import { Button } from '../../organisms/button';

interface RiskAnalysisPanelProps {
  patient: IPatient;
  careHistory: IPatientCareHistory | null;
}

// Simulação de análise preditiva baseada em IA
const simulateRiskAnalysis = (patient: IPatient, careHistory: IPatientCareHistory | null) => {
  // Esta função simula um modelo de IA para análise de risco
  // Em um cenário real, isso chamaria um endpoint de backend ou usaria um modelo treinado
  
  // Pontuação de risco base (0-100)
  let riskScore = 0;
  
  // Fatores de risco detectados
  const riskFactors: string[] = [];
  
  // Recomendações baseadas no perfil
  const recommendations: string[] = [];
  
  // Especialidades médicas possivelmente necessárias
  const suggestedSpecialties: string[] = [];
  
  // Estimar tempo de internação restante (em dias)
  let estimatedRemainingLOS = 0;
  
  // Adicionar pontos baseados na idade (pacientes mais velhos tendem a ter maior risco)
  if (patient.age > 70) {
    riskScore += 25;
    riskFactors.push("Idade avançada (>70 anos)");
    recommendations.push("Monitoramento intensivo de sinais vitais");
  } else if (patient.age > 55) {
    riskScore += 15;
    riskFactors.push("Idade elevada (>55 anos)");
  }
  
  // Analisar diagnóstico
  if (patient.diagnosis.toLowerCase().includes("cardiac") || 
      patient.diagnosis.toLowerCase().includes("cardíaco")) {
    riskScore += 20;
    riskFactors.push("Condição cardíaca");
    suggestedSpecialties.push("Cardiologia");
    recommendations.push("Monitoramento cardíaco contínuo");
    estimatedRemainingLOS += 3;
  }
  
  if (patient.diagnosis.toLowerCase().includes("cancer") || 
      patient.diagnosis.toLowerCase().includes("câncer") ||
      patient.diagnosis.toLowerCase().includes("oncol")) {
    riskScore += 30;
    riskFactors.push("Condição oncológica");
    suggestedSpecialties.push("Oncologia");
    recommendations.push("Verificar potenciais complicações relacionadas à quimioterapia");
    estimatedRemainingLOS += 5;
  }
  
  if (patient.diagnosis.toLowerCase().includes("surgery") || 
      patient.diagnosis.toLowerCase().includes("cirurg")) {
    riskScore += 15;
    riskFactors.push("Pós-cirúrgico");
    recommendations.push("Monitoramento da ferida cirúrgica para sinais de infecção");
    estimatedRemainingLOS += 2;
  }
  
  // Analisar histórico de cuidados
  if (careHistory) {
    // Se houver muitos eventos em um curto período
    if (careHistory.events.length > 5 && careHistory.totalLOS < 3) {
      riskScore += 15;
      riskFactors.push("Muitos procedimentos em curto período");
      recommendations.push("Revisar sequência de intervenções");
    }
    
    // Verificar se houve transferência para UTI
    if (careHistory.events.some(event => 
      event.type === 'transfer' && 
      event.details?.toDepartment?.toLowerCase().includes('uti')
    )) {
      riskScore += 25;
      riskFactors.push("Histórico de internação em UTI");
      recommendations.push("Monitorar potenciais recaídas");
      estimatedRemainingLOS += 3;
    }
    
    // Verificar medicações
    if (careHistory.events.some(event => 
      event.type === 'medication' && 
      event.details?.medicationName?.toLowerCase().includes('antibiotic')
    )) {
      riskScore += 10;
      riskFactors.push("Uso de antibióticos");
      recommendations.push("Monitorar eficácia do tratamento antibiótico");
    }
    
    // Verificar tipos de exames realizados
    const labExams = careHistory.events.filter(event => 
      event.type === 'exam' && 
      event.details?.examType?.toLowerCase().includes('lab')
    );
    
    if (labExams.length > 2) {
      riskScore += 5;
      riskFactors.push("Múltiplos exames laboratoriais");
      suggestedSpecialties.push("Medicina Laboratorial");
    }
  }
  
  // Adicionar pontos baseados no tempo de internação atual
  if (careHistory && careHistory.totalLOS > 7) {
    riskScore += 15;
    riskFactors.push("Internação prolongada (>7 dias)");
    recommendations.push("Avaliar possíveis infecções hospitalares");
    recommendations.push("Considerar mobilização precoce para evitar complicações");
  }
  
  // Cálculos adicionais baseados no status atual
  let currentDept = '';
  let currentStatus = '';
  
  if (careHistory && careHistory.statusHistory.length > 0) {
    const lastStatus = careHistory.statusHistory[careHistory.statusHistory.length - 1];
    currentDept = lastStatus.department;
    currentStatus = lastStatus.status;
    
    if (currentDept === 'UTI') {
      riskScore += 30;
      riskFactors.push("Internação atual em UTI");
      estimatedRemainingLOS += 5;
    }
    
    if (currentStatus === 'Em Procedimento') {
      riskScore += 10;
      estimatedRemainingLOS += 1;
    }
  }
  
  // Limitar o score a 100
  riskScore = Math.min(riskScore, 100);
  
  // Calcular nível de risco
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  if (riskScore < 20) riskLevel = 'low';
  else if (riskScore < 40) riskLevel = 'moderate';
  else if (riskScore < 70) riskLevel = 'high';
  else riskLevel = 'critical';
  
  // Se não há fatores de risco específicos, adicionar mensagem padrão
  if (riskFactors.length === 0) {
    riskFactors.push("Nenhum fator de risco específico identificado");
  }
  
  // Se não há recomendações específicas, adicionar mensagem padrão
  if (recommendations.length === 0) {
    if (riskLevel === 'low') {
      recommendations.push("Seguir protocolo padrão de atendimento");
      recommendations.push("Monitorar sinais vitais conforme rotina hospitalar");
    } else {
      recommendations.push("Realizar avaliação médica detalhada");
    }
  }
  
  // Adicionar recomendações baseadas no nível de risco
  if (riskLevel === 'high' || riskLevel === 'critical') {
    recommendations.push("Considerar avaliação por equipe multidisciplinar");
    recommendations.push("Aumentar frequência de monitoramento de sinais vitais");
  }
  
  // Adicionar especialidade médica baseada no diagnóstico
  if (suggestedSpecialties.length === 0) {
    suggestedSpecialties.push("Clínica Geral");
  }
  
  // Estimar tempo de internação total (dias já internados + estimativa restante)
  const totalEstimatedLOS = (careHistory?.totalLOS || 0) + estimatedRemainingLOS;
  
  // Calcular potencial de readmissão
  let readmissionRisk = 0;
  if (riskScore > 70) readmissionRisk = 0.35;
  else if (riskScore > 40) readmissionRisk = 0.20;
  else if (riskScore > 20) readmissionRisk = 0.10;
  else readmissionRisk = 0.05;
  
  return {
    riskScore,
    riskLevel,
    riskFactors,
    recommendations,
    suggestedSpecialties,
    estimatedDaysRemaining: estimatedRemainingLOS,
    totalEstimatedLOS,
    readmissionRisk: Math.round(readmissionRisk * 100)
  };
};

export const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({ patient, careHistory }) => {
    const [analysisLoading, setAnalysisLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState<any>(null);
    
    useEffect(() => {
      // Simular tempo de processamento do modelo de IA
      const timer = setTimeout(() => {
        const analysis = simulateRiskAnalysis(patient, careHistory);
        setAnalysisData(analysis);
        setAnalysisLoading(false);
      }, 1200);
      
      return () => clearTimeout(timer);
    }, [patient, careHistory]);
    
    if (analysisLoading) {
      return (
        <div className="p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Brain className="h-10 w-10 animate-pulse text-indigo-600 dark:text-indigo-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Analisando dados do paciente com IA...</p>
          <Progress className="w-48 mt-4 bg-gray-200 dark:bg-gray-700" value={65} />
        </div>
      );
    }
    
    if (!analysisData) {
      return (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <AlertCircle className="h-10 w-10 mx-auto text-red-500 dark:text-red-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Não foi possível gerar a análise de risco para este paciente.
          </p>
        </div>
      );
    }
    
    // Função para obter a cor da barra de risco
    const getRiskColor = (level: string) => {
      switch (level) {
        case 'low': return 'bg-green-500 dark:bg-green-600';
        case 'moderate': return 'bg-amber-500 dark:bg-amber-600';
        case 'high': return 'bg-orange-500 dark:bg-orange-600';
        case 'critical': return 'bg-red-500 dark:bg-red-600';
        default: return 'bg-gray-500 dark:bg-gray-600';
      }
    };
    
    // Função para obter o texto do nível de risco
    const getRiskText = (level: string) => {
      switch (level) {
        case 'low': return 'Baixo';
        case 'moderate': return 'Moderado';
        case 'high': return 'Alto';
        case 'critical': return 'Crítico';
        default: return 'Desconhecido';
      }
    };
  
    return (
      <div className="space-y-4 text-gray-800 dark:text-gray-200">
        <Tabs defaultValue="risk" className="w-full">
          <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white dark:data-[state=active]:bg-red-800"
            >
              Análise de Risco
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-800"
            >
              Recomendações
            </TabsTrigger>
            <TabsTrigger 
              value="prediction"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-800"
            >
              Previsões
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/30 dark:to-amber-900/30 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                  Pontuação de Risco do Paciente
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Avaliação baseada em IA do estado do paciente
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
                  <div className="flex-1">
                    <Progress 
                      value={analysisData.riskScore} 
                      className="h-4 bg-gray-200 dark:bg-gray-700"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{analysisData.riskScore}%</span>
                    <span className="ml-2 text-md text-gray-600 dark:text-gray-400">
                      Risco {getRiskText(analysisData.riskLevel)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-3 text-gray-800 dark:text-gray-200">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                      Fatores de Risco Identificados
                    </h3>
                    <ul className="space-y-2 ml-6 list-disc text-gray-600 dark:text-gray-400">
                      {analysisData.riskFactors.map((factor: string, index: number) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-3 text-gray-800 dark:text-gray-200">
                      <Microscope className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Especialidades Médicas Sugeridas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.suggestedSpecialties.map((specialty: string, index: number) => (
                        <Badge key={index} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {analysisData.riskLevel === 'high' || analysisData.riskLevel === 'critical' ? (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção necessária</AlertTitle>
                <AlertDescription>
                  O paciente apresenta alto risco e requer monitoramento intensivo.
                </AlertDescription>
              </Alert>
            ) : null}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Recomendações Baseadas em IA
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Sugestões geradas por análise de casos semelhantes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {analysisData.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                      <div className="shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prediction" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Previsão de Tempo de Internação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-2">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analysisData.totalEstimatedLOS} dias</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Já internado: {careHistory?.totalLOS || 0} dias
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Restante previsto: {analysisData.estimatedDaysRemaining} dias
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-base flex items-center">
                    <ArrowUpCircle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                    Risco de Readmissão em 30 dias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-2">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{analysisData.readmissionRisk}%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Chance de retorno após alta
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Análise Comparativa
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Comparação com pacientes similares em nosso banco de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Tempo de internação</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Média: {Math.round(analysisData.totalEstimatedLOS * 0.8)} dias
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <div 
                          className="h-2 bg-blue-500 dark:bg-blue-600 rounded"
                          style={{ width: `${Math.min(100, (analysisData.totalEstimatedLOS / (analysisData.totalEstimatedLOS * 1.5)) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="absolute top-0 h-2" style={{ left: `${Math.min(95, (analysisData.totalEstimatedLOS * 0.8) / (analysisData.totalEstimatedLOS * 1.5) * 100)}%` }}>
                        <div className="w-1 h-4 -mt-1 bg-indigo-600 dark:bg-indigo-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Risco</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Média: {Math.round(analysisData.riskScore * 0.85)}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <div 
                          className="h-2 bg-red-500 dark:bg-red-600 rounded"
                          style={{ width: `${analysisData.riskScore}%` }}
                        ></div>
                      </div>
                      <div className="absolute top-0 h-2" style={{ left: `${Math.round(analysisData.riskScore * 0.85)}%` }}>
                        <div className="w-1 h-4 -mt-1 bg-indigo-600 dark:bg-indigo-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Readmissão</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Média: {Math.round(analysisData.readmissionRisk * 0.9)}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <div 
                          className="h-2 bg-amber-500 dark:bg-amber-600 rounded"
                          style={{ width: `${analysisData.readmissionRisk}%` }}
                        ></div>
                      </div>
                      <div className="absolute top-0 h-2" style={{ left: `${Math.round(analysisData.readmissionRisk * 0.9)}%` }}>
                        <div className="w-1 h-4 -mt-1 bg-indigo-600 dark:bg-indigo-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <BadgePercent className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Análise baseada em {analysisData.riskScore > 50 ? '1,286' : '2,143'} casos similares
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-2 items-center bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700"
          >
            <Brain className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Solicitar segunda opinião</span>
          </Button>
        </div>
      </div>
    );
};
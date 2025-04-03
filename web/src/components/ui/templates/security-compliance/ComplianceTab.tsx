/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/organisms/toggle-group';
import { Progress } from '@/components/ui/organisms/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Switch } from '@/components/ui/organisms/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { CalendarIcon, CheckCircle, ChevronRight, FileCheck, FileText, FileClock, FileWarning, HelpCircle, Info, ListChecks, RefreshCw, ShieldCheck, XCircle, Users } from 'lucide-react';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { useToast } from '@/components/ui/hooks/use-toast';
import { IComplianceConfig } from '@/types/security-compliance-types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/organisms/popover';

export const ComplianceTab = () => {
  const { securityData, updateComplianceConfig, runComplianceAssessment, generateComplianceReport, loading } = useSecurityCompliance();
  const [activeRegulation, setActiveRegulation] = useState<string>("LGPD");
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  // Get the selected regulation config
  const selectedConfig = securityData?.complianceConfigs.find(
    config => config.regulation === activeRegulation
  ) || null;

  const handleRunAssessment = async () => {
    if (!selectedConfig) return;
    
    try {
      setRunning(true);
      await runComplianceAssessment(activeRegulation);
      toast({
        title: "Avaliação concluída",
        description: `A avaliação de compliance ${activeRegulation} foi concluída com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao executar a avaliação de compliance.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const handleGenerateReport = async (format: 'pdf' | 'html' | 'csv' | 'json') => {
    if (!selectedConfig) return;
    
    try {
      await generateComplianceReport(activeRegulation, format);
      toast({
        title: "Relatório gerado",
        description: `O relatório de compliance ${activeRegulation} foi gerado com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o relatório de compliance.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEnforcement = async (value: 'strict' | 'balanced' | 'permissive') => {
    if (!selectedConfig) return;
    
    try {
      const updatedConfig = {
        ...selectedConfig,
        enforcementLevel: value
      };
      
      await updateComplianceConfig(updatedConfig);
      toast({
        title: "Nível de enforcement atualizado",
        description: `O nível de enforcement para ${activeRegulation} foi atualizado com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o nível de enforcement.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    if (!selectedConfig) return;
    
    try {
      const updatedConfig = {
        ...selectedConfig,
        enabled
      };
      
      await updateComplianceConfig(updatedConfig);
      toast({
        title: enabled ? "Compliance ativado" : "Compliance desativado",
        description: `O módulo de compliance ${activeRegulation} foi ${enabled ? 'ativado' : 'desativado'} com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do módulo.",
        variant: "destructive",
      });
    }
  };

  // Helper to get regulation name
  const getRegulationName = (code: string) => {
    const names: Record<string, string> = {
      'LGPD': 'Lei Geral de Proteção de Dados',
      'HIPAA': 'Health Insurance Portability and Accountability Act',
      'GDPR': 'General Data Protection Regulation',
      'ISO27001': 'ISO 27001',
      'CFR21Part11': 'CFR 21 Part 11'
    };
    return names[code] || code;
  };

  // Helper to get compliance status badge and color
  const getComplianceStatus = (config: IComplianceConfig | null) => {
    if (!config) return { label: 'Não disponível', color: 'bg-gray-200' };
    
    const { requirementsStatus } = config;
    const compliancePercentage = requirementsStatus 
      ? (requirementsStatus.compliant / requirementsStatus.total) * 100 
      : 0;
    
    if (compliancePercentage >= 95) {
      return { label: 'Compliant', color: 'bg-green-500' };
    } else if (compliancePercentage >= 80) {
      return { label: 'Quase Compliant', color: 'bg-yellow-500' };
    } else if (compliancePercentage >= 60) {
      return { label: 'Parcial', color: 'bg-orange-500' };
    } else {
      return { label: 'Não Compliant', color: 'bg-red-500' };
    }
  };

  // Format date from ISO string or return 'Nunca' if null/undefined
  const formatDate = (date?: string | null) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };
  
  const { label: statusLabel, color: statusColor } = getComplianceStatus(selectedConfig);
  
  // Calculate compliance percentage
  const getCompliancePercentage = (config: IComplianceConfig | null) => {
    if (!config || !config.requirementsStatus || config.requirementsStatus.total === 0) return 0;
    return Math.round((config.requirementsStatus.compliant / config.requirementsStatus.total) * 100);
  };
  
  const compliancePercentage = getCompliancePercentage(selectedConfig);

  // Sample requirements data
  const sampleRequirements = [
    { 
      id: 'req-001', 
      title: 'Consentimento explícito', 
      description: 'Obter consentimento explícito do paciente antes de coletar e processar dados pessoais sensíveis', 
      status: 'compliant' 
    },
    { 
      id: 'req-002', 
      title: 'Direito de acesso', 
      description: 'Fornecer aos pacientes o direito de acessar seus dados pessoais', 
      status: 'compliant' 
    },
    { 
      id: 'req-003', 
      title: 'Direito à retificação', 
      description: 'Permitir que pacientes retifiquem dados incorretos', 
      status: 'compliant' 
    },
    { 
      id: 'req-004', 
      title: 'Direito ao esquecimento', 
      description: 'Implementar processo para apagar dados pessoais mediante solicitação', 
      status: 'compliant' 
    },
    { 
      id: 'req-005', 
      title: 'Segurança dos dados', 
      description: 'Implementar medidas técnicas e organizacionais para proteger dados pessoais', 
      status: 'compliant' 
    },
    { 
      id: 'req-006', 
      title: 'Notificação de violação', 
      description: 'Notificar autoridades e titulares de dados em caso de violação de dados', 
      status: 'non_compliant' 
    },
    { 
      id: 'req-007', 
      title: 'Avaliação de impacto', 
      description: 'Realizar avaliação de impacto na proteção de dados para processamentos de alto risco', 
      status: 'in_progress' 
    },
    { 
      id: 'req-008', 
      title: 'Privacy by Design', 
      description: 'Implementar medidas de privacidade desde a concepção e por padrão', 
      status: 'in_progress' 
    },
    { 
      id: 'req-009', 
      title: 'DPO designado', 
      description: 'Designar um Encarregado de Proteção de Dados (DPO)', 
      status: 'compliant' 
    },
    { 
      id: 'req-010', 
      title: 'Transferências internacionais', 
      description: 'Controles para transferências internacionais de dados', 
      status: 'not_applicable' 
    }
  ];

  // Render status icon based on requirement status
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non_compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'not_applicable':
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Compliance Regulatório</h3>
          <p className="text-sm text-gray-500">
            Gerencie a conformidade com regulamentações de proteção de dados e segurança
          </p>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <ToggleGroup 
            type="single" 
            value={activeRegulation}
            onValueChange={(value) => {
              if (value) setActiveRegulation(value);
            }}
          >
            <ToggleGroupItem value="LGPD">LGPD</ToggleGroupItem>
            <ToggleGroupItem value="HIPAA">HIPAA</ToggleGroupItem>
            <ToggleGroupItem value="ISO27001">ISO 27001</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Status Overview Card */}
      <Card className="overflow-hidden">
        <div className={`w-full h-2 ${statusColor}`}></div>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                {getRegulationName(activeRegulation)}
                {selectedConfig?.enabled ? (
                  <Badge variant="outline" className="bg-green-50 text-green-600 ml-2">Ativo</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-600 ml-2">Inativo</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Status de conformidade e requisitos regulatórios
              </CardDescription>
            </div>
            
            <div className="mt-2 sm:mt-0 flex items-center">
              <span className="text-sm mr-2">
                {selectedConfig?.enabled ? 'Ativado' : 'Desativado'}
              </span>
              <Switch
                checked={selectedConfig?.enabled || false}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Status de Conformidade</div>
              <div className="flex items-center justify-between">
                <Badge 
                  className={`${statusColor.replace('bg', 'text')} bg-opacity-10 ${statusColor.replace('bg', 'bg')}`}
                >
                  {statusLabel}
                </Badge>
                <span className="text-2xl font-bold">{compliancePercentage}%</span>
              </div>
              <Progress value={compliancePercentage} className="h-2 mt-2" />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Última Avaliação</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{formatDate(selectedConfig?.lastAudit)}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRunAssessment}
                  disabled={running || !selectedConfig?.enabled}
                >
                  {running ? 'Executando...' : 'Executar Avaliação'}
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Nível de Enforcement</div>
              <Select 
                value={selectedConfig?.enforcementLevel || 'balanced'} 
                onValueChange={(value: 'strict' | 'balanced' | 'permissive') => handleToggleEnforcement(value)}
                disabled={!selectedConfig?.enabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Estrito</SelectItem>
                  <SelectItem value="balanced">Balanceado</SelectItem>
                  <SelectItem value="permissive">Permissivo</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-400 mt-1">
                {selectedConfig?.enforcementLevel === 'strict' ? 
                  'Bloqueia operações não-conformes' : 
                  selectedConfig?.enforcementLevel === 'balanced' ? 
                  'Alerta mas permite operações' : 
                  'Apenas registra operações não-conformes'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Requisitos</h4>
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2 bg-gray-100 font-medium text-sm">
                  <div>Status</div>
                  <div>Requisito</div>
                  <div></div>
                </div>
                <div className="divide-y max-h-[250px] overflow-y-auto">
                  {sampleRequirements.map((req) => (
                    <div key={req.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2">
                      <div>{renderStatusIcon(req.status)}</div>
                      <div className="text-sm">
                        <div className="font-medium">{req.title}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{req.description}</div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">{req.title}</h4>
                            <p className="text-sm">{req.description}</p>
                            <h5 className="text-sm font-medium">Status: 
                              <span className={
                                req.status === 'compliant' ? 'text-green-500' :
                                req.status === 'non_compliant' ? 'text-red-500' :
                                req.status === 'in_progress' ? 'text-yellow-500' :
                                'text-gray-500'
                              }> {req.status}</span>
                            </h5>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Resumo de Conformidade</h4>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-green-500">
                          {selectedConfig?.requirementsStatus?.compliant || 0}
                        </div>
                        <div className="text-xs text-gray-500">Conformes</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-red-500">
                          {selectedConfig?.requirementsStatus?.nonCompliant || 0}
                        </div>
                        <div className="text-xs text-gray-500">Não Conformes</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-yellow-500">
                          {selectedConfig?.requirementsStatus?.inProgress || 0}
                        </div>
                        <div className="text-xs text-gray-500">Em Progresso</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-gray-500">
                          {selectedConfig?.requirementsStatus?.total || 0}
                        </div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Próximas Auditorias</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">Auditoria Interna</div>
                            <div className="text-xs text-gray-500">Equipe de Compliance</div>
                          </div>
                        </div>
                        <Badge variant="outline">30 dias</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">Auditoria Externa</div>
                            <div className="text-xs text-gray-500">Certificação LGPD</div>
                          </div>
                        </div>
                        <Badge variant="outline">90 dias</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Exportar Relatório</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={!selectedConfig?.enabled}
                    >
                      PDF
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('html')}
                      disabled={!selectedConfig?.enabled}
                    >
                      HTML
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={!selectedConfig?.enabled}
                    >
                      CSV
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('json')}
                      disabled={!selectedConfig?.enabled}
                    >
                      JSON
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention and Policy Tabs */}
      <Tabs defaultValue="data-retention" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data-retention">
            <FileClock className="h-4 w-4 mr-2" />
            Retenção de Dados
          </TabsTrigger>
          <TabsTrigger value="compliance-policies">
            <ListChecks className="h-4 w-4 mr-2" />
            Políticas
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-retention" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Política de Retenção de Dados</CardTitle>
              <CardDescription>
                Configure períodos de retenção em conformidade com requisitos regulatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Dados do Paciente</h4>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Dados Médicos</div>
                      <div className="text-xs text-gray-500">Prontuários, exames, histórico</div>
                    </div>
                    <Badge variant="outline">
                      {selectedConfig?.dataRetentionPolicy?.patientData || 20} anos
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Dados de Autenticação</div>
                      <div className="text-xs text-gray-500">Credenciais, tokens, atividade</div>
                    </div>
                    <Badge variant="outline">5 anos</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Registros Financeiros</div>
                      <div className="text-xs text-gray-500">Transações, faturamento</div>
                    </div>
                    <Badge variant="outline">10 anos</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Dados Operacionais</h4>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Logs de Auditoria</div>
                      <div className="text-xs text-gray-500">Registros de atividade e acesso</div>
                    </div>
                    <Badge variant="outline">
                      {selectedConfig?.dataRetentionPolicy?.auditLogs || 5} anos
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Dados de Consentimento</div>
                      <div className="text-xs text-gray-500">Termos, políticas aceitas</div>
                    </div>
                    <Badge variant="outline">Permanente</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="text-sm font-medium">Dados Operacionais</div>
                      <div className="text-xs text-gray-500">Métricas, relatórios</div>
                    </div>
                    <Badge variant="outline">
                      {selectedConfig?.dataRetentionPolicy?.operationalData || 2} anos
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Requisitos regulatórios</p>
                  <p className="text-xs text-blue-600">
                    De acordo com a {activeRegulation}, os dados médicos devem ser mantidos por no mínimo {activeRegulation === 'LGPD' ? '20' : activeRegulation === 'HIPAA' ? '6' : '5'} anos.
                    Certifique-se de que as políticas de retenção estejam alinhadas com esses requisitos.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Editar Políticas de Retenção
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance-policies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Políticas de Compliance</CardTitle>
              <CardDescription>
                Políticas internas relacionadas à conformidade regulatória
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Política de Privacidade</div>
                      <div className="text-xs text-gray-500">Última atualização: 15/03/2025</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100">
                      <FileCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Procedimentos de Consentimento</div>
                      <div className="text-xs text-gray-500">Última atualização: 10/02/2025</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-yellow-100">
                      <FileWarning className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Procedimento de Incidente de Segurança</div>
                      <div className="text-xs text-gray-500">Última atualização: 05/01/2025</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Política de Acesso a Dados</div>
                      <div className="text-xs text-gray-500">Última atualização: 20/12/2024</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Gerenciar Políticas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de Compliance</CardTitle>
              <CardDescription>
                Registro de avaliações e atualizações de conformidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-5 pb-5 border-l border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Avaliação de compliance concluída</span>
                    <span className="text-xs text-gray-500 ml-2">22/03/2025</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Avaliação de compliance {activeRegulation} concluída com 92% de conformidade.
                    2 requisitos não conformes identificados.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Política de privacidade atualizada</span>
                    <span className="text-xs text-gray-500 ml-2">15/03/2025</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Atualização da política de privacidade para incluir novas diretrizes de consentimento.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Alerta de compliance</span>
                    <span className="text-xs text-gray-500 ml-2">28/02/2025</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Alerta de não conformidade identificado: Processo de notificação de violação de dados incompleto.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Avaliação de compliance concluída</span>
                    <span className="text-xs text-gray-500 ml-2">15/01/2025</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Avaliação de compliance {activeRegulation} concluída com 85% de conformidade.
                    3 requisitos não conformes identificados.
                  </p>
                </div>
                
                <div className="relative pl-5 border-l border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-purple-500"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Módulo de compliance ativado</span>
                    <span className="text-xs text-gray-500 ml-2">01/01/2025</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Módulo de compliance {activeRegulation} ativado e configurado inicialmente.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                Ver todos os registros
              </Button>
              <Button variant="outline" size="sm">
                Exportar histórico
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
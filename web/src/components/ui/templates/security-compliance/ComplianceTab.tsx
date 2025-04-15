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
import { useSecurityCompliance } from '@/hooks/security-compliance/useSecurityCompliance';
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
    if (!config) return { label: 'Não disponível', color: 'bg-gray-200 dark:bg-gray-700' };
    
    const { requirementsStatus } = config;
    const compliancePercentage = requirementsStatus 
      ? (requirementsStatus.compliant / requirementsStatus.total) * 100 
      : 0;
    
    if (compliancePercentage >= 95) {
      return { label: 'Compliant', color: 'bg-green-500 dark:bg-green-400' };
    } else if (compliancePercentage >= 80) {
      return { label: 'Quase Compliant', color: 'bg-yellow-500 dark:bg-yellow-400' };
    } else if (compliancePercentage >= 60) {
      return { label: 'Parcial', color: 'bg-orange-500 dark:bg-orange-400' };
    } else {
      return { label: 'Não Compliant', color: 'bg-red-500 dark:bg-red-400' };
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
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case 'non_compliant':
        return <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case 'not_applicable':
        return <HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Regulatório</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md"
          >
            <ToggleGroupItem 
              value="LGPD" 
              className="data-[state=on]:bg-white data-[state=on]:text-primary dark:data-[state=on]:bg-gray-700 dark:data-[state=on]:text-primary-400 text-gray-700 dark:text-gray-300"
            >
              LGPD
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="HIPAA" 
              className="data-[state=on]:bg-white data-[state=on]:text-primary dark:data-[state=on]:bg-gray-700 dark:data-[state=on]:text-primary-400 text-gray-700 dark:text-gray-300"
            >
              HIPAA
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="ISO27001" 
              className="data-[state=on]:bg-white data-[state=on]:text-primary dark:data-[state=on]:bg-gray-700 dark:data-[state=on]:text-primary-400 text-gray-700 dark:text-gray-300"
            >
              ISO 27001
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Status Overview Card */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className={`w-full h-2 ${statusColor}`}></div>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <FileCheck className="h-5 w-5 text-primary dark:text-primary-400" />
                {getRegulationName(activeRegulation)}
                {selectedConfig?.enabled ? (
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 ml-2">Ativo</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 ml-2">Inativo</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Status de conformidade e requisitos regulatórios
              </CardDescription>
            </div>
            
            <div className="mt-2 sm:mt-0 flex items-center">
              <span className="text-sm mr-2 text-gray-700 dark:text-gray-300">
                {selectedConfig?.enabled ? 'Ativado' : 'Desativado'}
              </span>
              <Switch
                checked={selectedConfig?.enabled || false}
                onCheckedChange={handleToggleEnabled}
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status de Conformidade</div>
              <div className="flex items-center justify-between">
                <Badge 
                  className={`${statusColor.replace('bg', 'text')} bg-opacity-10 dark:bg-opacity-20 ${statusColor.replace('bg', 'bg')}`}
                >
                  {statusLabel}
                </Badge>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{compliancePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${statusColor}`}
                  style={{ width: `${compliancePercentage}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Última Avaliação</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(selectedConfig?.lastAudit)}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRunAssessment}
                  disabled={running || !selectedConfig?.enabled}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
                >
                  {running ? 'Executando...' : 'Executar Avaliação'}
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nível de Enforcement</div>
              <Select 
                value={selectedConfig?.enforcementLevel || 'balanced'} 
                onValueChange={(value: 'strict' | 'balanced' | 'permissive') => handleToggleEnforcement(value)}
                disabled={!selectedConfig?.enabled}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="strict" className="text-gray-900 dark:text-white">Estrito</SelectItem>
                  <SelectItem value="balanced" className="text-gray-900 dark:text-white">Balanceado</SelectItem>
                  <SelectItem value="permissive" className="text-gray-900 dark:text-white">Permissivo</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Requisitos</h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 font-medium text-sm text-gray-700 dark:text-gray-300">
                  <div>Status</div>
                  <div>Requisito</div>
                  <div></div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[250px] overflow-y-auto">
                  {sampleRequirements.map((req) => (
                    <div key={req.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2 bg-white dark:bg-gray-900">
                      <div>{renderStatusIcon(req.status)}</div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">{req.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{req.description}</div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{req.title}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{req.description}</p>
                            <h5 className="text-sm font-medium">Status: 
                              <span className={
                                req.status === 'compliant' ? 'text-green-500 dark:text-green-400' :
                                req.status === 'non_compliant' ? 'text-red-500 dark:text-red-400' :
                                req.status === 'in_progress' ? 'text-yellow-500 dark:text-yellow-400' :
                                'text-gray-500 dark:text-gray-400'
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
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Resumo de Conformidade</h4>
              <div className="space-y-4">
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-gray-900 dark:text-white">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                          {selectedConfig?.requirementsStatus?.compliant || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Conformes</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                          {selectedConfig?.requirementsStatus?.nonCompliant || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Não Conformes</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                          {selectedConfig?.requirementsStatus?.inProgress || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Em Progresso</div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                          {selectedConfig?.requirementsStatus?.total || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-gray-900 dark:text-white">Próximas Auditorias</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Auditoria Interna</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Equipe de Compliance</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">30 dias</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Auditoria Externa</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Certificação LGPD</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">90 dias</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Exportar Relatório</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={!selectedConfig?.enabled}
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
                    >
                      PDF
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('html')}
                      disabled={!selectedConfig?.enabled}
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
                    >
                      HTML
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={!selectedConfig?.enabled}
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
                    >
                      CSV
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateReport('json')}
                      disabled={!selectedConfig?.enabled}
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="data-retention" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <FileClock className="h-4 w-4 mr-2" />
            Retenção de Dados
          </TabsTrigger>
          <TabsTrigger value="compliance-policies" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <ListChecks className="h-4 w-4 mr-2" />
            Políticas
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <FileText className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-retention" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Política de Retenção de Dados</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Configure períodos de retenção em conformidade com requisitos regulatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dados do Paciente</h4>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Dados Médicos</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Prontuários, exames, histórico</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {selectedConfig?.dataRetentionPolicy?.patientData || 20} anos
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Dados de Autenticação</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Credenciais, tokens, atividade</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">5 anos</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Registros Financeiros</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Transações, faturamento</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">10 anos</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dados Operacionais</h4>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Logs de Auditoria</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Registros de atividade e acesso</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {selectedConfig?.dataRetentionPolicy?.auditLogs || 5} anos
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Dados de Consentimento</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Termos, políticas aceitas</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Permanente</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Dados Operacionais</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Métricas, relatórios</div>
                    </div>
                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {selectedConfig?.dataRetentionPolicy?.operationalData || 2} anos
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800 flex items-start">
                <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Requisitos regulatórios</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    De acordo com a {activeRegulation}, os dados médicos devem ser mantidos por no mínimo {activeRegulation === 'LGPD' ? '20' : activeRegulation === 'HIPAA' ? '6' : '5'} anos.
                    Certifique-se de que as políticas de retenção estejam alinhadas com esses requisitos.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Editar Políticas de Retenção
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance-policies" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Políticas de Compliance</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Políticas internas relacionadas à conformidade regulatória
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Política de Privacidade</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Última atualização: 15/03/2025</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                      <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Procedimentos de Consentimento</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Última atualização: 10/02/2025</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                      <FileWarning className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Procedimento de Incidente de Segurança</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Última atualização: 05/01/2025</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                      <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Política de Acesso a Dados</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Última atualização: 20/12/2024</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Gerenciar Políticas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-base text-gray-900 dark:text-white">Histórico de Compliance</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Registro de avaliações e atualizações de conformidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-5 pb-5 border-l border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Avaliação de compliance concluída</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">22/03/2025</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Avaliação de compliance {activeRegulation} concluída com 92% de conformidade.
                    2 requisitos não conformes identificados.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Política de privacidade atualizada</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">15/03/2025</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Atualização da política de privacidade para incluir novas diretrizes de consentimento.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Alerta de compliance</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">28/02/2025</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Alerta de não conformidade identificado: Processo de notificação de violação de dados incompleto.
                  </p>
                </div>
                
                <div className="relative pl-5 pb-5 border-l border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Avaliação de compliance concluída</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">15/01/2025</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Avaliação de compliance {activeRegulation} concluída com 85% de conformidade.
                    3 requisitos não conformes identificados.
                  </p>
                </div>
                
                <div className="relative pl-5 border-l border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-purple-500 dark:bg-purple-400"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Módulo de compliance ativado</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">01/01/2025</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Módulo de compliance {activeRegulation} ativado e configurado inicialmente.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Ver todos os registros
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Exportar histórico
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
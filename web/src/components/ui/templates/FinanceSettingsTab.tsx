/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useFinanceData } from '@/services/hooks/finance/useFinanceData';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/organisms/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { Separator } from '@/components/ui/organisms/Separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/organisms/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/organisms/dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { 
  CreditCard, 
  DollarSign, 
  PieChart, 
  FileText, 
  RefreshCcw, 
  Settings, 
  Shield, 
  Database, 
  Save, 
  AlertTriangle, 
  InfoIcon, 
  Check,
  Clock,
  Globe,
  Building2,
  AlertCircle,
  Link,
  Percent
} from 'lucide-react';
import { useToast } from '@/components/ui/hooks/use-toast';
import { IFinanceSettings } from '@/types/finance-types';

// Importar componentes das abas
import { CurrencySettings } from './finance/CurrencySettings';
import { FinancialReportsSettings } from './finance/FinancialReportsSettings';
import { BillingSettings } from './finance/BillingSettings';
import { TaxSettings } from './finance/TaxSettings';
import { BudgetSettings } from './finance/BudgetSettings';
import { InsuranceSettings } from './finance/InsuranceSettings';
import { IntegrationSettings } from './finance/IntegrationSettings';
import { PaymentManager } from './PaymentManager';

export const FinanceSettingsTab: React.FC = () => {
  const { networkData, currentUser } = useNetworkData();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const { 
    financeData, 
    loading, 
    error, 
    getHospitalSettings, 
    updateFinanceSettings,
    setNetworkDefaults,
    applyHospitalSettingsToNetwork,
    usesNetworkDefaults,
    resetToNetworkDefaults,
    currentSettings
  } = useFinanceData(selectedHospitalId);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isDefaultsMode, setIsDefaultsMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [currentEdits, setCurrentEdits] = useState<Partial<IFinanceSettings>>({});
  const [isApplyingToNetwork, setIsApplyingToNetwork] = useState(false);
  
  const { toast } = useToast();
  
  // Efeito para definir o hospital padrão
  useEffect(() => {
    if (networkData?.hospitals && networkData.hospitals.length > 0) {
      // Se o usuário tiver um hospital atribuído, use-o como padrão
      if (currentUser?.hospitalId) {
        setSelectedHospitalId(currentUser.hospitalId);
      } else {
        // Caso contrário, use o primeiro hospital da lista
        setSelectedHospitalId(networkData.hospitals[0].id);
      }
    }
  }, [networkData, currentUser]);
  
  // Função para trocar entre configurações hospitalares e de rede
  const toggleDefaultsMode = () => {
    if (unsavedChanges) {
      setShowSavePrompt(true);
    } else {
      setIsDefaultsMode(!isDefaultsMode);
      // Resetar edições ao trocar o modo
      setCurrentEdits({});
    }
  };
  
  // Função para atualizar edições locais
  const updateLocalEdits = (path: string, value: any) => {
    setCurrentEdits(prev => {
      // Constrói um objeto aninhado a partir do caminho
      const keys = path.split('.');
      const result = { ...prev };
      
      let current: any = result;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return result;
    });
    
    setUnsavedChanges(true);
  };
  
  // Função para salvar configurações
  const saveSettings = async () => {
    try {
      if (isDefaultsMode) {
        await setNetworkDefaults(currentEdits);
        toast({
          title: "Configurações padrão atualizadas",
          description: "As configurações padrão da rede foram atualizadas com sucesso.",
          variant: "default",
        });
      } else {
        await updateFinanceSettings(selectedHospitalId, currentEdits);
        toast({
          title: "Configurações atualizadas",
          description: "As configurações financeiras do hospital foram atualizadas com sucesso.",
          variant: "default",
        });
      }
      
      setUnsavedChanges(false);
      setCurrentEdits({});
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: error || "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };
  
  // Função para aplicar configurações do hospital à rede
  const handleApplyToNetwork = async () => {
    try {
      setIsApplyingToNetwork(true);
      await applyHospitalSettingsToNetwork(selectedHospitalId);
      
      toast({
        title: "Configurações aplicadas à rede",
        description: "As configurações deste hospital foram aplicadas como padrão para toda a rede.",
        variant: "default",
      });
      
      setIsApplyingToNetwork(false);
    } catch (err) {
      toast({
        title: "Erro ao aplicar configurações",
        description: "Ocorreu um erro ao aplicar as configurações à rede.",
        variant: "destructive",
      });
      
      setIsApplyingToNetwork(false);
    }
  };
  
  // Função para resetar as configurações do hospital para o padrão da rede
  const handleResetToDefaults = async () => {
    try {
      await resetToNetworkDefaults(selectedHospitalId);
      
      toast({
        title: "Configurações redefinidas",
        description: "As configurações foram redefinidas para o padrão da rede.",
        variant: "default",
      });
      
      setCurrentEdits({});
      setUnsavedChanges(false);
    } catch (err) {
      toast({
        title: "Erro ao redefinir configurações",
        description: "Ocorreu um erro ao redefinir as configurações.",
        variant: "destructive",
      });
    }
  };
  
  // Obter as configurações atuais (rede ou hospital específico)
  const settings = isDefaultsMode 
    ? financeData?.networkDefaults 
    : currentSettings;
  
  // Se estiver carregando, mostrar indicador
  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="flex flex-col items-center">
          <RefreshCcw className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Carregando configurações financeiras</h3>
          <p className="text-gray-500 dark:text-gray-400">Aguarde enquanto carregamos os dados...</p>
        </div>
      </div>
    );
  }
  
  // Se ocorrer um erro, mostrar mensagem
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar configurações</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // Renderizar a interface de configurações
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center text-gray-800 dark:text-gray-100">
            <DollarSign className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Configurações Financeiras
            {isDefaultsMode && (
              <Badge className="ml-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Configurações Padrão da Rede
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie todas as configurações financeiras para sua operação hospitalar.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isDefaultsMode && (
            <div className="flex items-center mr-4">
              <Select
                value={selectedHospitalId}
                onValueChange={setSelectedHospitalId}
              >
                <SelectTrigger className="w-[240px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Selecionar hospital" className="text-gray-800 dark:text-gray-200" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  {networkData?.hospitals.map(hospital => (
                    <SelectItem key={hospital.id} value={hospital.id} className="text-gray-800 dark:text-gray-200">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        {hospital.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {!isDefaultsMode && selectedHospitalId && usesNetworkDefaults(selectedHospitalId) && (
            <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800">
              <InfoIcon className="h-3 w-3 mr-1" /> Usando configurações padrão da rede
            </Badge>
          )}
          
          <Button 
            variant={isDefaultsMode ? "default" : "outline"} 
            onClick={toggleDefaultsMode}
            className={`flex items-center ${isDefaultsMode ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
          >
            <Globe className="h-4 w-4 mr-2" />
            {isDefaultsMode ? "Ver Hospital Específico" : "Ver Padrões da Rede"}
          </Button>
          
          {unsavedChanges && (
            <Button 
              onClick={saveSettings} 
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          )}
        </div>
      </div>
      
      {!isDefaultsMode && (
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Aplicar para Rede
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-gray-100">Aplicar configurações à rede</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Esta ação substituirá as configurações padrão da rede pelas configurações deste hospital.
                        Outros hospitais que usam o padrão da rede serão afetados.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <Alert variant="warning" className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="text-amber-800 dark:text-amber-300">Atenção</AlertTitle>
                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                          Esta ação não pode ser desfeita. Certifique-se de que as configurações deste hospital
                          são adequadas para toda a rede hospitalar.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleApplyToNetwork}
                        disabled={isApplyingToNetwork}
                        className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600"
                      >
                        {isApplyingToNetwork ? (
                          <>
                            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                            Aplicando...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Confirmar
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20 bg-white dark:bg-gray-700"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Resetar Configurações
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-gray-100">Resetar para padrões da rede</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Esta ação removerá todas as configurações personalizadas deste hospital,
                        fazendo com que ele utilize o padrão da rede.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <Alert variant="destructive" className="mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-300">Atenção</AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-400">
                          Esta ação não pode ser desfeita. Todas as configurações personalizadas serão perdidas.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button"
                        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleResetToDefaults}
                        className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Confirmar Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Diálogo para salvar alterações não salvas */}
      <Dialog open={showSavePrompt} onOpenChange={setShowSavePrompt}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100">Alterações não salvas</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Você tem alterações não salvas que serão perdidas. O que deseja fazer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSavePrompt(false);
                setIsDefaultsMode(!isDefaultsMode);
                setCurrentEdits({});
                setUnsavedChanges(false);
              }}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Descartar alterações
            </Button>
            <Button 
              onClick={async () => {
                await saveSettings();
                setShowSavePrompt(false);
                setIsDefaultsMode(!isDefaultsMode);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Salvar e continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs navigation - estilizado com bordas suaves e highlight ativo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="grid grid-cols-6 w-full bg-transparent h-auto p-0">
              <TabsTrigger 
                value="general" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'general' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Geral
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'billing' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Faturamento
              </TabsTrigger>
              <TabsTrigger 
                value="tax" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'tax' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Percent className="h-4 w-4 mr-2" />
                Impostos
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'budget' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Orçamento
              </TabsTrigger>
              <TabsTrigger 
                value="insurance" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'insurance' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Seguros
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'integrations' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Database className="h-4 w-4 mr-2" />
                Integrações
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className={`flex items-center justify-center py-4 px-2 border-b-2 transition-all ${
                  activeTab === 'transactions' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Database className="h-4 w-4 mr-2" />
                Transações
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="general" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CurrencySettings 
                  settings={{...settings.currency, ...currentEdits.currency}}
                  onSettingChange={updateLocalEdits} 
                />
                <FinancialReportsSettings 
                  settings={{...settings.financialReports, ...currentEdits.financialReports}} 
                  onSettingChange={updateLocalEdits} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4 mt-0">
              <BillingSettings 
                billingSettings={{...settings.patientBilling, ...currentEdits.patientBilling}}
                costSettings={{...settings.serviceCost, ...currentEdits.serviceCost}}
                onSettingChange={updateLocalEdits} 
              />
            </TabsContent>
            
            <TabsContent value="tax" className="space-y-4 mt-0">
              <TaxSettings 
                settings={{...settings.tax, ...currentEdits.tax}} 
                onSettingChange={updateLocalEdits} 
              />
            </TabsContent>
            
            <TabsContent value="budget" className="space-y-4 mt-0">
              <BudgetSettings 
                settings={{...settings.budget, ...currentEdits.budget}} 
                onSettingChange={updateLocalEdits} 
              />
            </TabsContent>
            
            <TabsContent value="insurance" className="space-y-4 mt-0">
              <InsuranceSettings 
                settings={{...settings.insurance, ...currentEdits.insurance}} 
                onSettingChange={updateLocalEdits} 
              />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4 mt-0">
              <IntegrationSettings 
                settings={{...settings.integrations, ...currentEdits.integrations}} 
                onSettingChange={updateLocalEdits} 
              />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 mt-0">
              <PaymentManager userId={currentUser ? currentUser?.id : ''} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
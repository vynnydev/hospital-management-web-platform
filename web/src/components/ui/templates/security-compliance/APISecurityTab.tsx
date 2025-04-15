import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { useSecurityCompliance } from '@/hooks/security-compliance/useSecurityCompliance';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Shield, LockKeyhole, Timer, Globe, RefreshCw } from 'lucide-react';

import { APIAuthenticationPanel } from './api-security/APIAuthenticationPanel';
import { RateLimitingPanel } from './api-security/RateLimitingPanel';
import { WebhookSecurityPanel } from './api-security/WebhookSecurityPanel';

export const APISecurityTab: React.FC = () => {
  const { securityData, updateAPISecurityConfig, loading } = useSecurityCompliance();
  const [selectedTab, setSelectedTab] = useState('authentication');
  const { toast } = useToast();
  
  // Verificar se há configuração da API e usar default se não houver
  const apiSecurityConfig = securityData?.apiSecurityConfig || {
    id: 'api-security-config',
    authMethod: 'jwt',
    tokenExpiration: 60,
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      burstLimit: 250
    },
    ipWhitelisting: {
      enabled: false,
      allowedIPs: []
    },
    webhookConfig: {
      enabled: true,
      signingSecret: true,
      retryPolicy: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleSaveConfig = async (updatedConfig: any) => {
    try {
      await updateAPISecurityConfig(updatedConfig);
      
      toast({
        title: "Configuração salva",
        description: "As configurações de segurança da API foram atualizadas com sucesso.",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações de segurança da API.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Segurança da API</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure a segurança para integrações externas e APIs
          </p>
        </div>
      </div>

      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="authentication" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <LockKeyhole size={16} />
            <span>Autenticação</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rate-limiting" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Timer size={16} />
            <span>Rate Limiting</span>
          </TabsTrigger>
          <TabsTrigger 
            value="webhooks" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            <Globe size={16} />
            <span>Webhooks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="mt-4">
          <APIAuthenticationPanel 
            config={apiSecurityConfig} 
            onSave={handleSaveConfig}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="rate-limiting" className="mt-4">
          <RateLimitingPanel 
            config={apiSecurityConfig} 
            onSave={handleSaveConfig}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4">
          <WebhookSecurityPanel 
            config={apiSecurityConfig}
            onSave={handleSaveConfig}
            loading={loading} webhookConfig={{
              enabled: true,
              signingSecret: false,
              signingKey: '',
              retryPolicy: false,
              maxRetries: 3,
              retryDelay: 5000,
              allowedIps: [],
              ipRestriction: false,
              endpoints: [],
              securityLevel: 'high'
            }} updateWebhookConfig={function (config: any): Promise<any> {
              throw new Error('Function not implemented.');
            }}
          />
        </TabsContent>
      </Tabs>

      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 dark:text-white">Status da API</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Visão geral do uso e segurança da API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requisições (24h)</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">124,532</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">+12% em relação à semana passada</div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rejeições de segurança</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">127</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">2.3% das requisições</div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">API Tokens ativos</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">43</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">9 expirando em 30 dias</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Estatísticas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { Database, Shield, FileCheck, UserCheck } from 'lucide-react';

import { ConsentManagement } from './data-protection/ConsentManagement';
import { DataEncryptionConfig } from './data-protection/DataEncryptionConfig';
import { AnonymizationConfig } from './data-protection/AnonymizationConfig';
import { DataRequestsManagement } from './data-protection/DataRequestsManagement';

export const DataProtectionTab = () => {
  const [activeTab, setActiveTab] = useState('consent');
  const { securityData, updateConsentConfig, loading } = useSecurityCompliance();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proteção de Dados</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie a proteção, privacidade e consentimento de dados pessoais em conformidade com LGPD/HIPAA
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="consent" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <UserCheck size={16} />
            <span className="hidden md:inline">Consentimento</span>
          </TabsTrigger>
          <TabsTrigger value="encryption" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <Shield size={16} />
            <span className="hidden md:inline">Criptografia</span>
          </TabsTrigger>
          <TabsTrigger value="anonymization" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <Database size={16} />
            <span className="hidden md:inline">Anonimização</span>
          </TabsTrigger>
          <TabsTrigger value="data-requests" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400">
            <FileCheck size={16} />
            <span className="hidden md:inline">Solicitações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-4 mt-4">
          <ConsentManagement 
            consentConfig={securityData?.consentConfig} 
            updateConsentConfig={updateConsentConfig}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4 mt-4">
          <DataEncryptionConfig />
        </TabsContent>

        <TabsContent value="anonymization" className="space-y-4 mt-4">
          <AnonymizationConfig />
        </TabsContent>

        <TabsContent value="data-requests" className="space-y-4 mt-4">
          <DataRequestsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
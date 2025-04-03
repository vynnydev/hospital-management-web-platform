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
        <h3 className="text-lg font-semibold">Proteção de Dados</h3>
        <p className="text-sm text-gray-500">
          Gerencie a proteção, privacidade e consentimento de dados pessoais em conformidade com LGPD/HIPAA
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <UserCheck size={16} />
            <span className="hidden md:inline">Consentimento</span>
          </TabsTrigger>
          <TabsTrigger value="encryption" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden md:inline">Criptografia</span>
          </TabsTrigger>
          <TabsTrigger value="anonymization" className="flex items-center gap-2">
            <Database size={16} />
            <span className="hidden md:inline">Anonimização</span>
          </TabsTrigger>
          <TabsTrigger value="data-requests" className="flex items-center gap-2">
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
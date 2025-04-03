import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Key, Timer } from 'lucide-react';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';

import { MFAConfigTab } from './auth/MFAConfigTab';
import { SessionManagementTab } from './auth/SessionManagementTab';

export const AuthenticationTab = () => {
  const [selectedTab, setSelectedTab] = useState('mfa');
  const { securityData, updateMFAConfig, updateSessionConfig, loading } = useSecurityCompliance();
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={selectedTab} 
        value={selectedTab} 
        onValueChange={setSelectedTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mfa" className="flex items-center gap-2">
            <Key size={16} />
            <span>Autenticação Multi-Fator (MFA)</span>
          </TabsTrigger>
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Timer size={16} />
            <span>Gerenciamento de Sessão</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mfa" className="space-y-4 mt-4">
          <MFAConfigTab 
            mfaConfig={securityData?.mfaConfig}
            updateMFAConfig={updateMFAConfig}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="session" className="space-y-4 mt-4">
          <SessionManagementTab 
            sessionConfig={securityData?.sessionConfig}
            updateSessionConfig={updateSessionConfig}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
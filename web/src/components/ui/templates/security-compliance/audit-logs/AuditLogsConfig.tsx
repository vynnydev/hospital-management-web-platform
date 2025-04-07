/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { RetentionPolicyConfig } from '../RetentionPolicyConfig';
import { ExportConfig } from '../ExportConfig';

interface AuditLogsConfigProps {
  logRetentionPolicy: any;
  logExportConfig: any;
  updateLogRetentionPolicy: (config: any) => Promise<any>;
  updateLogExportConfig: (config: any) => Promise<any>;
  loading: boolean;
}

export const AuditLogsConfig: React.FC<AuditLogsConfigProps> = ({
  logRetentionPolicy,
  logExportConfig,
  updateLogRetentionPolicy,
  updateLogExportConfig,
  loading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações de Auditoria</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Configure como os logs de auditoria são gerenciados e retidos no sistema
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RetentionPolicyConfig 
          retentionPolicy={logRetentionPolicy} 
          updateRetentionPolicy={updateLogRetentionPolicy}
          loading={loading}
        />
        
        <ExportConfig 
          exportConfig={logExportConfig} 
          updateExportConfig={updateLogExportConfig}
          loading={loading}
        />
      </div>
    </div>
  );
};
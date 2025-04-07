/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { Separator } from '@/components/ui/organisms/Separator';
import { IAuditLog, TLogCategory, TLogSeverity } from '@/types/security-compliance-types';
import { 
  Clock, 
  User, 
  MousePointer, 
  Terminal, 
  Server, 
  Hash, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Tag,
  FileText,
  Laptop,
  Building
} from 'lucide-react';

interface AuditLogDetailDialogProps {
  log: IAuditLog;
  onClose: () => void;
}

export const AuditLogDetailDialog: React.FC<AuditLogDetailDialogProps> = ({ log, onClose }) => {
  // Helper function to format ISO date
  const formatDateTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString();
  };

  // Helper functions for badge styling
  const getStatusBadgeVariant = (result: string) => {
    switch (result) {
      case 'success':
        return 'success';
      case 'failure':
        return 'destructive';
      case 'denied':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getSeverityBadgeVariant = (severity: TLogSeverity) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'secondary';
    }
  };

  const getCategoryBadgeVariant = (category: TLogCategory) => {
    switch (category) {
      case 'security':
        return 'default';
      case 'authentication':
        return 'secondary';
      case 'data_access':
        return 'outline';
      case 'patient_data':
        return 'warning';
      case 'admin_action':
        return 'destructive';
      case 'system_config':
      default:
        return 'secondary';
    }
  };

  // Decide which icon to show based on the result
  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case 'denied':
        return <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <span>Detalhes do Log de Auditoria</span>
          <Badge 
            variant={getStatusBadgeVariant(log.result)}
            className={`ml-2 ${
              log.result === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
              log.result === 'failure' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 
              'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
            }`}
          >
            {log.result}
          </Badge>
        </DialogTitle>
        <DialogDescription className="text-gray-500 dark:text-gray-400">
          {log.action} por {log.userName} ({log.userRole})
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* General information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{formatDateTime(log.timestamp)}</div>
            </div>
            
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Usuário:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{log.userName} (ID: {log.userId})</div>
            </div>
            
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Papel:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{log.userRole}</div>
            </div>
            
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria:</div>
              <Badge 
                variant={getCategoryBadgeVariant(log.category)}
                className={`ml-2 ${
                  log.category === 'security' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                  log.category === 'authentication' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 
                  log.category === 'data_access' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                  log.category === 'patient_data' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 
                  log.category === 'admin_action' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : 
                  'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                {log.category.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Severidade:</div>
              <Badge 
                variant={getSeverityBadgeVariant(log.severity)}
                className={`ml-2 ${
                  log.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : 
                  log.severity === 'error' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' : 
                  log.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' : 
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                }`}
              >
                {log.severity}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Ação:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{log.action}</div>
            </div>
            
            <div className="flex items-start">
              <Server className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurso:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{log.resource} 
                {log.resourceId && <span className="text-gray-500 dark:text-gray-400"> (ID: {log.resourceId})</span>}
              </div>
            </div>
            
            <div className="flex items-center">
              <Hash className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">{log.resourceType}</div>
            </div>
            
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Hospital:</div>
              <div className="text-sm ml-2 text-gray-900 dark:text-white">
                {log.hospitalId || 'N/A'}
                {log.departmentId && <span className="text-gray-500 dark:text-gray-400"> / Dept: {log.departmentId}</span>}
              </div>
            </div>
            
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessão:</div>
              <div className="text-sm ml-2 font-mono text-gray-900 dark:text-white">{log.sessionId}</div>
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        
        {/* Connection information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">IP:</div>
            <div className="text-sm ml-2 font-mono text-gray-900 dark:text-white">{log.ipAddress}</div>
          </div>
          
          <div className="flex items-center">
            <Laptop className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">User Agent:</div>
            <div className="text-sm ml-2 truncate text-gray-900 dark:text-white" title={log.userAgent}>
              {log.userAgent}
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        
        {/* Details */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Detalhes:</div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {log.details}
          </div>
        </div>
        
        {/* Metadata (if exists) */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <>
            <Separator className="bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Metadados:</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-mono overflow-auto border border-gray-200 dark:border-gray-700">
                <pre className="text-xs text-gray-700 dark:text-gray-300">{JSON.stringify(log.metadata, null, 2)}</pre>
              </div>
            </div>
          </>
        )}
        
        {/* Related entity (if exists) */}
        {log.relatedEntityId && (
          <>
            <Separator className="bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-start">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Entidade relacionada:</div>
              <div className="text-sm text-gray-900 dark:text-white">
                {log.relatedEntityType}: {log.relatedEntityId}
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button 
          onClick={onClose}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
        >
          Fechar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
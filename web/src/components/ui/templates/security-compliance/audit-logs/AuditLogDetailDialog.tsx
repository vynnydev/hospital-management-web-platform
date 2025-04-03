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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'denied':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <span>Detalhes do Log de Auditoria</span>
          <Badge 
            variant={getStatusBadgeVariant(log.result)}
            className="ml-2"
          >
            {log.result}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          {log.action} por {log.userName} ({log.userRole})
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* General information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Timestamp:</div>
              <div className="text-sm ml-2">{formatDateTime(log.timestamp)}</div>
            </div>
            
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Usuário:</div>
              <div className="text-sm ml-2">{log.userName} (ID: {log.userId})</div>
            </div>
            
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Papel:</div>
              <div className="text-sm ml-2">{log.userRole}</div>
            </div>
            
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Categoria:</div>
              <Badge 
                variant={getCategoryBadgeVariant(log.category)}
                className="ml-2"
              >
                {log.category.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Severidade:</div>
              <Badge 
                variant={getSeverityBadgeVariant(log.severity)}
                className="ml-2"
              >
                {log.severity}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Ação:</div>
              <div className="text-sm ml-2">{log.action}</div>
            </div>
            
            <div className="flex items-start">
              <Server className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
              <div className="text-sm font-medium">Recurso:</div>
              <div className="text-sm ml-2">{log.resource} 
                {log.resourceId && <span className="text-gray-500"> (ID: {log.resourceId})</span>}
              </div>
            </div>
            
            <div className="flex items-center">
              <Hash className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Tipo:</div>
              <div className="text-sm ml-2">{log.resourceType}</div>
            </div>
            
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Hospital:</div>
              <div className="text-sm ml-2">
                {log.hospitalId || 'N/A'}
                {log.departmentId && <span> / Dept: {log.departmentId}</span>}
              </div>
            </div>
            
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-gray-500" />
              <div className="text-sm font-medium">Sessão:</div>
              <div className="text-sm ml-2 font-mono">{log.sessionId}</div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Connection information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            <div className="text-sm font-medium">IP:</div>
            <div className="text-sm ml-2 font-mono">{log.ipAddress}</div>
          </div>
          
          <div className="flex items-center">
            <Laptop className="h-4 w-4 mr-2 text-gray-500" />
            <div className="text-sm font-medium">User Agent:</div>
            <div className="text-sm ml-2 truncate" title={log.userAgent}>
              {log.userAgent}
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Details */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Detalhes:</div>
          <div className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
            {log.details}
          </div>
        </div>
        
        {/* Metadata (if exists) */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm font-medium">Metadados:</div>
              <div className="p-3 bg-gray-50 rounded-md text-sm font-mono overflow-auto">
                <pre className="text-xs">{JSON.stringify(log.metadata, null, 2)}</pre>
              </div>
            </div>
          </>
        )}
        
        {/* Related entity (if exists) */}
        {log.relatedEntityId && (
          <>
            <Separator />
            <div className="flex items-start">
              <div className="text-sm font-medium mr-2">Entidade relacionada:</div>
              <div className="text-sm">
                {log.relatedEntityType}: {log.relatedEntityId}
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button onClick={onClose}>Fechar</Button>
      </DialogFooter>
    </DialogContent>
  );
};
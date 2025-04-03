import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Badge } from '@/components/ui/organisms/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/organisms/pagination';
import { Button } from '@/components/ui/organisms/button';
import { Eye } from 'lucide-react';
import { IAuditLog, TLogCategory, TLogSeverity } from '@/types/security-compliance-types';

interface AuditLogsTableProps {
  logs: IAuditLog[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onViewLog: (log: IAuditLog) => void;
  loading: boolean;
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  pagination,
  onPageChange,
  onViewLog,
  loading
}) => {
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

  // Render pagination buttons
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const { page, totalPages } = pagination;
    
    // Calculate range of page numbers to show
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page if not in range
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink onClick={() => onPageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if there's a gap
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Add numbered pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={page === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page if not in range
    if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Format date or time from ISO string
  const formatDateTime = (isoString: string, format: 'date' | 'time' | 'datetime' = 'datetime') => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    
    if (format === 'date') {
      return date.toLocaleDateString();
    } else if (format === 'time') {
      return date.toLocaleTimeString();
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Severidade</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead className="text-right">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={7} className="h-12 animate-pulse bg-gray-100"></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum log encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              // Logs data
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="whitespace-nowrap">{formatDateTime(log.timestamp, 'date')}</div>
                    <div className="text-gray-500">{formatDateTime(log.timestamp, 'time')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-xs text-gray-500">{log.userRole}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate" title={log.action}>
                      {log.action}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={log.resource}>
                      {log.resource}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={getCategoryBadgeVariant(log.category)}>
                      {log.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={getSeverityBadgeVariant(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(log.result)}
                      className={`${log.result === 'success' ? 'bg-green-100 text-green-800' : 
                                log.result === 'failure' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}
                    >
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                aria-disabled={pagination.page === 1}
                className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                aria-disabled={pagination.page === pagination.totalPages}
                className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
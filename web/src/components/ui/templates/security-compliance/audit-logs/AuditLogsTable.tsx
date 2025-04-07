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
          <PaginationLink 
            onClick={() => onPageChange(1)}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if there's a gap
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
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
            className={page === i 
              ? "bg-primary text-white dark:bg-primary dark:text-white" 
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
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
            <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => onPageChange(totalPages)}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
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
      <div className="rounded-md border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="w-[180px] text-gray-700 dark:text-gray-300">Timestamp</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Usuário</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Ação</TableHead>
              <TableHead className="hidden md:table-cell text-gray-700 dark:text-gray-300">Categoria</TableHead>
              <TableHead className="hidden md:table-cell text-gray-700 dark:text-gray-300">Severidade</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Resultado</TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-300">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`loading-${index}`} className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell colSpan={7} className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800/30"></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              // Empty state
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableCell colSpan={7} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  Nenhum log encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              // Logs data
              logs.map((log) => (
                <TableRow key={log.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    <div className="whitespace-nowrap">{formatDateTime(log.timestamp, 'date')}</div>
                    <div className="text-gray-500 dark:text-gray-400">{formatDateTime(log.timestamp, 'time')}</div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{log.userRole}</div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    <div className="max-w-[180px] truncate" title={log.action}>
                      {log.action}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={log.resource}>
                      {log.resource}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge 
                      variant={getCategoryBadgeVariant(log.category)}
                      className={`
                        ${log.category === 'security' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : ''}
                        ${log.category === 'authentication' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : ''}
                        ${log.category === 'data_access' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : ''}
                        ${log.category === 'patient_data' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' : ''}
                        ${log.category === 'admin_action' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : ''}
                        ${log.category === 'system_config' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700' : ''}
                      `}
                    >
                      {log.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge 
                      variant={getSeverityBadgeVariant(log.severity)}
                      className={`
                        ${log.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : ''}
                        ${log.severity === 'error' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' : ''}
                        ${log.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' : ''}
                        ${log.severity === 'info' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : ''}
                      `}
                    >
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(log.result)}
                      className={`
                        ${log.result === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : ''}
                        ${log.result === 'failure' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : ''}
                        ${log.result === 'denied' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' : ''}
                      `}
                    >
                      {log.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewLog(log)}
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
                className={`
                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700
                  ${pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                `}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                aria-disabled={pagination.page === pagination.totalPages}
                className={`
                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700
                  ${pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                `}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
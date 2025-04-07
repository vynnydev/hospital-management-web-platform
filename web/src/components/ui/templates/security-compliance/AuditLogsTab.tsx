import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Dialog, DialogTrigger } from '@/components/ui/organisms/dialog';
import { Badge } from '@/components/ui/organisms/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { IAuditLog } from '@/types/security-compliance-types';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { Filter, FileSpreadsheet, FileJson, FileType, Search } from 'lucide-react';

import { AuditLogsTable } from './audit-logs/AuditLogsTable';
import { AuditLogsFilterDialog } from './audit-logs/AuditLogsFilterDialog';
import { AuditLogDetailDialog } from './audit-logs/AuditLogDetailDialog';
import { AuditLogsStats } from './audit-logs/AuditLogsStats';
import { AuditLogsConfig } from './audit-logs/AuditLogsConfig';

export const AuditLogsTab = () => {
  const { 
    auditLogs, 
    logsPagination, 
    fetchAuditLogs, 
    exportAuditLogs, 
    getAuditLogStats,
    loading, 
    logsFilter, 
    setLogsFilter,
    securityData,
    updateLogRetentionPolicy,
    updateLogExportConfig
  } = useSecurityCompliance();
  
  const [selectedTab, setSelectedTab] = useState('logs');
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showLogDetailDialog, setShowLogDetailDialog] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [logStats, setLogStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Fetch initial logs
  useEffect(() => {
    fetchAuditLogs(1, 20, logsFilter);
  }, [fetchAuditLogs, logsFilter]);

  // Fetch stats when tab changes
  useEffect(() => {
    if (selectedTab === 'stats' && !logStats) {
      setStatsLoading(true);
      getAuditLogStats('week')
        .then(data => {
          setLogStats(data);
          setStatsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load audit log stats:', error);
          setStatsLoading(false);
        });
    }
  }, [selectedTab, getAuditLogStats, logStats]);

  const handlePageChange = (page: number) => {
    fetchAuditLogs(page, logsPagination.perPage, logsFilter);
  };

  const handleExportLogs = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      await exportAuditLogs(format, logsFilter);
    } catch (error) {
      console.error('Error exporting logs', error);
    }
  };

  const handleApplyFilters = () => {
    // Convert date range to ISO strings for filter
    const updatedFilter = { ...logsFilter };
    
    if (dateRange.from) {
      updatedFilter.startDate = dateRange.from.toISOString();
    } else {
      updatedFilter.startDate = '';
    }
    
    if (dateRange.to) {
      updatedFilter.endDate = dateRange.to.toISOString();
    } else {
      updatedFilter.endDate = '';
    }
    
    setLogsFilter(updatedFilter);
    setShowFilterDialog(false);
    
    // Refresh logs with new filters
    fetchAuditLogs(1, logsPagination.perPage, updatedFilter);
  };

  const handleClearFilters = () => {
    setLogsFilter({
      startDate: '',
      endDate: '',
      userId: '',
      action: '',
      severity: '',
      category: '',
      result: '',
      search: ''
    });
    
    setDateRange({
      from: undefined,
      to: undefined,
    });
    
    // Refresh logs with cleared filters
    fetchAuditLogs(1, logsPagination.perPage, {
      startDate: '',
      endDate: '',
      userId: '',
      action: '',
      severity: '',
      category: '',
      result: '',
      search: ''
    });
    
    setShowFilterDialog(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogsFilter({ ...logsFilter, search: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAuditLogs(1, logsPagination.perPage, logsFilter);
  };

  const handleViewLog = (log: IAuditLog) => {
    setSelectedLog(log);
    setShowLogDetailDialog(true);
  };

  const handleRefreshStats = (timeframe: string) => {
    setStatsLoading(true);
    getAuditLogStats(timeframe as 'day' | 'week' | 'month' | 'year')
      .then(data => {
        setLogStats(data);
        setStatsLoading(false);
      })
      .catch(error => {
        console.error('Failed to refresh audit log stats:', error);
        setStatsLoading(false);
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logs de Auditoria e Rastreamento</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitore todas as atividades do sistema para fins de segurança e compliance
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="logs" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            Logs de Auditoria
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            Estatísticas
          </TabsTrigger>
          <TabsTrigger 
            value="config" 
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
          >
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4 mt-4">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="text-xl text-gray-900 dark:text-white">Logs de Auditoria</CardTitle>
                
                <div className="flex flex-wrap gap-2">
                  <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 border-gray"
                      >
                        <Filter size={14} />
                        <span>Filtros</span>
                        {Object.values(logsFilter).some(v => v !== '') && (
                          <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {Object.values(logsFilter).filter(v => v !== '').length}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <AuditLogsFilterDialog
                      logsFilter={logsFilter}
                      setLogsFilter={setLogsFilter}
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      onApplyFilters={handleApplyFilters}
                      onClearFilters={handleClearFilters}
                      onCancel={() => setShowFilterDialog(false)}
                    />
                  </Dialog>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleExportLogs('csv')}
                      title="Exportar como CSV"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <FileSpreadsheet size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleExportLogs('json')}
                      title="Exportar como JSON"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <FileJson size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleExportLogs('pdf')}
                      title="Exportar como PDF"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <FileType size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Search bar */}
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg items-center space-x-2 mt-3">
                <Input
                  type="text"
                  placeholder="Pesquisar logs..."
                  value={logsFilter.search}
                  onChange={handleSearchChange}
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <Button 
                  type="submit" 
                  variant="secondary" 
                  size="icon"
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </CardHeader>
            
            <CardContent>
              <AuditLogsTable
                logs={auditLogs}
                pagination={logsPagination}
                onPageChange={handlePageChange}
                onViewLog={handleViewLog}
                loading={loading}
              />
            </CardContent>
          </Card>
          
          {/* Log detail dialog */}
          <Dialog open={showLogDetailDialog} onOpenChange={setShowLogDetailDialog}>
            {selectedLog && (
              <AuditLogDetailDialog
                log={selectedLog}
                onClose={() => setShowLogDetailDialog(false)}
              />
            )}
          </Dialog>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <AuditLogsStats
            stats={logStats}
            loading={statsLoading}
            onRefresh={handleRefreshStats}
          />
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <AuditLogsConfig
            logRetentionPolicy={securityData?.logRetentionPolicy || {}}
            logExportConfig={securityData?.logExportConfig || {}}
            updateLogRetentionPolicy={updateLogRetentionPolicy}
            updateLogExportConfig={updateLogExportConfig}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
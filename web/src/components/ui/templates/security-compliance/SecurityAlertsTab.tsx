/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Badge } from '@/components/ui/organisms/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
import { useToast } from '@/components/ui/hooks/use-toast';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  FileText, 
  Filter, 
  Bell, 
  ShieldAlert, 
  UserCheck, 
  Database, 
  Globe,
  RefreshCw
} from 'lucide-react';
import { ISecurityAlert } from '@/types/security-compliance-types';
import { Label } from '../../organisms/label';

export const SecurityAlertsTab = () => {
  const { securityAlerts, fetchSecurityAlerts, updateAlertStatus, loading } = useSecurityCompliance();
  const [selectedTab, setSelectedTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<ISecurityAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch alerts when the tab first loads
    fetchSecurityAlerts();
  }, [fetchSecurityAlerts]);

  const handleUpdateStatus = async (alertId: string, status: 'new' | 'investigating' | 'resolved' | 'false_positive') => {
    try {
      await updateAlertStatus(alertId, status);
      
      toast({
        title: "Status atualizado",
        description: `O alerta foi marcado como ${getStatusLabel(status)}.`,
        variant: "default",
      });
      
      setShowResolveDialog(false);
      setResolutionNotes('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do alerta.",
        variant: "destructive",
      });
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlert) return;
    
    try {
      await updateAlertStatus(selectedAlert.id, 'resolved', resolutionNotes);
      
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido e documentado.",
        variant: "default",
      });
      
      setShowResolveDialog(false);
      setResolutionNotes('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao resolver o alerta.",
        variant: "destructive",
      });
    }
  };

  // Helper function to filter alerts based on tab and status filter
  const getFilteredAlerts = () => {
    if (!securityAlerts) return [];
    
    let filtered = [...securityAlerts];
    
    // Apply tab filter
    if (selectedTab !== 'all') {
      if (selectedTab === 'new-critical') {
        filtered = filtered.filter(alert => 
          (alert.status === 'new' && alert.severity === 'critical')
        );
      } else if (selectedTab === 'investigating') {
        filtered = filtered.filter(alert => alert.status === 'investigating');
      } else if (selectedTab === 'resolved') {
        filtered = filtered.filter(alert => 
          alert.status === 'resolved' || alert.status === 'false_positive'
        );
      }
    }
    
    // Apply status dropdown filter if active
    if (statusFilter) {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }
    
    return filtered;
  };

  // Helper function to get a human-readable status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'investigating': return 'Em investigação';
      case 'resolved': return 'Resolvido';
      case 'false_positive': return 'Falso positivo';
      default: return status;
    }
  };

  // Helper function to get severity badge variant
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-red-400">Alto</Badge>;
      case 'medium':
        return <Badge variant="warning">Médio</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixo</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive" className="bg-red-500">Novo</Badge>;
      case 'investigating':
        return <Badge variant="warning" className="bg-yellow-500">Em investigação</Badge>;
      case 'resolved':
        return <Badge variant="success" className="bg-green-500">Resolvido</Badge>;
      case 'false_positive':
        return <Badge variant="outline">Falso positivo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to render alert type icon
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'authentication':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'data_access':
        return <Database className="h-5 w-5 text-purple-500" />;
      case 'vulnerability':
        return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case 'compliance':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'breach':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Alertas de Segurança</h3>
          <p className="text-sm text-gray-500">
            Monitore e responda a alertas e incidentes de segurança
          </p>
        </div>
        
        <div className="mt-2 sm:mt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => fetchSecurityAlerts()}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="investigating">Em investigação</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
              <SelectItem value="false_positive">Falsos positivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="new-critical">
            Novos & Críticos 
            {securityAlerts && securityAlerts.filter(a => a.status === 'new' && a.severity === 'critical').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {securityAlerts.filter(a => a.status === 'new' && a.severity === 'critical').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="investigating">Em Investigação</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Alertas de Segurança</CardTitle>
              <CardDescription>
                {filteredAlerts.length > 0 
                  ? `Mostrando ${filteredAlerts.length} alerta${filteredAlerts.length > 1 ? 's' : ''}`
                  : 'Nenhum alerta encontrado para os filtros selecionados'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                  <h3 className="text-lg font-semibold">Nenhum alerta encontrado</h3>
                  <p className="text-sm text-gray-500">
                    Não existem alertas com os filtros atuais
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map(alert => (
                    <Card key={alert.id} className={`overflow-hidden ${
                      alert.status === 'new' && alert.severity === 'critical' 
                        ? 'border-red-500 bg-red-50' 
                        : ''
                    }`}>
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex items-start gap-3">
                            {getAlertTypeIcon(alert.type)}
                            <div>
                              <h4 className="text-sm font-semibold">{alert.title}</h4>
                              <p className="text-xs text-gray-500">{alert.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                            
                            {alert.sourceIp && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3.5 w-3.5" />
                                <span>{alert.sourceIp}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {alert.status === 'new' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleUpdateStatus(alert.id, 'investigating')}
                              >
                                Iniciar Investigação
                              </Button>
                            )}
                            
                            {alert.status === 'investigating' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    setSelectedAlert(alert);
                                    setShowResolveDialog(true);
                                  }}
                                >
                                  Resolver
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleUpdateStatus(alert.id, 'false_positive')}
                                >
                                  Falso Positivo
                                </Button>
                              </>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 text-xs"
                            >
                              Detalhes
                            </Button>
                          </div>
                        </div>
                        
                        {alert.resolutionNotes && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-md border text-xs">
                            <div className="font-medium">Notas de resolução:</div>
                            <p className="mt-1 text-gray-600">{alert.resolutionNotes}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert resolution dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Alerta de Segurança</DialogTitle>
            <DialogDescription>
              {selectedAlert?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Descrição</h4>
              <p className="text-sm text-gray-500">{selectedAlert?.description}</p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="resolution-notes">Notas de Resolução</Label>
              <Textarea 
                id="resolution-notes"
                placeholder="Descreva como o problema foi resolvido..."
                rows={5}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Adicione detalhes sobre como o problema foi resolvido, medidas tomadas e recomendações futuras.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowResolveDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              onClick={handleResolveAlert}
              disabled={!resolutionNotes.trim()}
            >
              Marcar como Resolvido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
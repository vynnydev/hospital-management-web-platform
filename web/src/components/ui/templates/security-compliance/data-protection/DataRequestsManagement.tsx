/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Label } from '@/components/ui/organisms/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { useToast } from '@/components/ui/hooks/use-toast';
import { 
  FileCheck, Download, FileX, Clock, Search, Eye, 
  UserCircle, Calendar, ArrowDownCircle, CheckCircle, 
  XCircle, AlertTriangle, Trash2, FileText 
} from 'lucide-react';

export const DataRequestsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('access');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  // Dados simulados para solicitações de acesso
  const accessRequests = [
    {
      id: 'REQ-ACC-001',
      patientId: 'P1052',
      patientName: 'Maria Silva',
      requestDate: '2025-03-20T10:15:00',
      status: 'pending',
      type: 'access',
      scope: 'full',
      requesterType: 'patient',
      requestReason: 'Acesso aos meus dados médicos completos'
    },
    {
      id: 'REQ-ACC-002',
      patientId: 'P1108',
      patientName: 'João Santos',
      requestDate: '2025-03-18T09:30:00',
      status: 'approved',
      type: 'access',
      scope: 'partial',
      requesterType: 'legal_guardian',
      requestReason: 'Acesso a prontuário médico do meu filho menor de idade'
    },
    {
      id: 'REQ-ACC-003',
      patientId: 'P1079',
      patientName: 'Carlos Oliveira',
      requestDate: '2025-03-15T14:45:00',
      status: 'rejected',
      type: 'access',
      scope: 'specific',
      requesterType: 'third_party',
      requestReason: 'Acesso a exames específicos com autorização do paciente',
      rejectionReason: 'Documentação de autorização insuficiente'
    }
  ];

  // Dados simulados para solicitações de exclusão
  const deletionRequests = [
    {
      id: 'REQ-DEL-001',
      patientId: 'P1067',
      patientName: 'Ana Costa',
      requestDate: '2025-03-19T11:20:00',
      status: 'pending',
      type: 'deletion',
      scope: 'specific',
      requesterType: 'patient',
      requestReason: 'Remoção de dados não clínicos conforme direito à exclusão LGPD'
    },
    {
      id: 'REQ-DEL-002',
      patientId: 'P1045',
      patientName: 'Roberto Almeida',
      requestDate: '2025-03-14T10:10:00',
      status: 'approved',
      type: 'deletion',
      scope: 'partial',
      requesterType: 'patient',
      requestReason: 'Remoção de dados de contato e marketing'
    },
    {
      id: 'REQ-DEL-003',
      patientId: 'P1032',
      patientName: 'Carla Pereira',
      requestDate: '2025-03-10T16:30:00',
      status: 'rejected',
      type: 'deletion',
      scope: 'full',
      requesterType: 'patient',
      requestReason: 'Remoção de todos os meus dados',
      rejectionReason: 'Período de retenção legal obrigatório em vigor para dados médicos'
    }
  ];

  // Dados simulados para solicitações de correção
  const correctionRequests = [
    {
      id: 'REQ-COR-001',
      patientId: 'P1089',
      patientName: 'Luiz Ferreira',
      requestDate: '2025-03-21T08:45:00',
      status: 'pending',
      type: 'correction',
      scope: 'specific',
      requesterType: 'patient',
      requestReason: 'Correção de informações incorretas no histórico médico'
    },
    {
      id: 'REQ-COR-002',
      patientId: 'P1104',
      patientName: 'Fernanda Lima',
      requestDate: '2025-03-17T13:15:00',
      status: 'approved',
      type: 'correction',
      scope: 'specific',
      requesterType: 'patient',
      requestReason: 'Atualização de informações de contato e endereço'
    }
  ];

  // Obter solicitações com base na aba ativa
  const getRequests = () => {
    switch (activeTab) {
      case 'access':
        return accessRequests;
      case 'deletion':
        return deletionRequests;
      case 'correction':
        return correctionRequests;
      default:
        return [];
    }
  };

  // Obter badge e cor para o status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800">Negado</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">Processando</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300">{status}</Badge>;
    }
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Lidar com a aprovação da solicitação
  const handleApproveRequest = () => {
    if (!selectedRequest) return;
    
    toast({
      title: "Solicitação aprovada",
      description: `A solicitação ${selectedRequest.id} foi aprovada com sucesso.`,
      variant: "default",
    });
    
    setShowResponseDialog(false);
    setApprovalNote('');
  };

  // Lidar com a rejeição da solicitação
  const handleRejectRequest = () => {
    if (!selectedRequest || !rejectionReason) return;
    
    toast({
      title: "Solicitação rejeitada",
      description: `A solicitação ${selectedRequest.id} foi rejeitada.`,
      variant: "default",
    });
    
    setShowResponseDialog(false);
    setRejectionReason('');
  };

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FileCheck className="h-5 w-5 text-primary dark:text-primary-400" />
            Solicitações de Dados
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Gerencie solicitações de acesso, exclusão e correção de dados conforme LGPD/HIPAA
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger 
                value="access" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
              >
                <Download className="h-4 w-4" />
                <span>Acesso</span>
                <Badge 
                  variant="secondary" 
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                >
                  {accessRequests.filter(r => r.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="deletion" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Exclusão</span>
                <Badge 
                  variant="secondary" 
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                >
                  {deletionRequests.filter(r => r.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="correction" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
              >
                <FileText className="h-4 w-4" />
                <span>Correção</span>
                <Badge 
                  variant="secondary" 
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                >
                  {correctionRequests.filter(r => r.status === 'pending').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {activeTab === 'access' && 'Solicitações de Acesso a Dados'}
                  {activeTab === 'deletion' && 'Solicitações de Exclusão de Dados'}
                  {activeTab === 'correction' && 'Solicitações de Correção de Dados'}
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all" className="text-gray-900 dark:text-white">Todos status</SelectItem>
                      <SelectItem value="pending" className="text-gray-900 dark:text-white">Pendentes</SelectItem>
                      <SelectItem value="approved" className="text-gray-900 dark:text-white">Aprovados</SelectItem>
                      <SelectItem value="rejected" className="text-gray-900 dark:text-white">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center w-[200px] relative">
                    <Input 
                      placeholder="Buscar pelo nome..." 
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pr-8"
                    />
                    <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-700 dark:text-gray-300">ID da Solicitação</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Paciente</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Data</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Escopo</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRequests().map((request) => (
                      <TableRow 
                        key={request.id} 
                        className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                          {request.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {request.patientName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {request.patientId}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm">{formatDate(request.requestDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {request.scope === 'full' ? 'Completo' : 
                             request.scope === 'partial' ? 'Parcial' : 
                             'Específico'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailsDialog(true);
                              }}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {request.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowResponseDialog(true);
                                }}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                              >
                                <FileCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {getRequests().length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <CheckCircle className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Não há solicitações de {
                      activeTab === 'access' ? 'acesso' : 
                      activeTab === 'deletion' ? 'exclusão' : 'correção'
                    } pendentes ou recentes.
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Tempo médio de resposta: 48 horas
          </div>
          <Button 
            variant="outline" 
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Detalhes da Solicitação</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Informações completas sobre a solicitação
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID da Solicitação</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paciente</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID do Paciente</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.patientId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data da Solicitação</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedRequest.requestDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Solicitante</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.requesterType === 'patient' ? 'Paciente' : 
                     selectedRequest.requesterType === 'legal_guardian' ? 'Responsável Legal' : 
                     'Terceiro Autorizado'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Solicitação</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.type === 'access' ? 'Acesso a Dados' : 
                     selectedRequest.type === 'deletion' ? 'Exclusão de Dados' : 
                     'Correção de Dados'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Escopo</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.scope === 'full' ? 'Completo (todos os dados)' : 
                     selectedRequest.scope === 'partial' ? 'Parcial (dados específicos)' : 
                     'Específico (dados pontuais)'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Motivo da Solicitação</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.requestReason}</p>
                </div>
                
                {selectedRequest.status === 'rejected' && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Motivo da Rejeição</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.rejectionReason}</p>
                  </div>
                )}

                {selectedRequest.status === 'approved' && selectedRequest.type === 'access' && (
                  <div className="col-span-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                    <div className="flex items-start">
                      <ArrowDownCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">Dados disponibilizados</p>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Os dados solicitados foram disponibilizados via portal seguro.
                          Expiração do acesso: 30/04/2025
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedRequest.type === 'deletion' && (
                <Alert 
                  variant="warning" 
                  className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  <AlertTitle className="text-yellow-800 dark:text-yellow-300">Importante - Retenção Legal</AlertTitle>
                  <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                    Dados médicos podem estar sujeitos a períodos obrigatórios de retenção conforme 
                    regulamentações locais (entre 10 e 20 anos). Apenas dados não sujeitos a 
                    obrigações legais podem ser excluídos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setShowDetailsDialog(false)}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de resposta (aprovar/rejeitar) */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Responder à Solicitação</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Aprovar ou rejeitar a solicitação {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paciente</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.patientName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Solicitação</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedRequest.type === 'access' ? 'Acesso a Dados' : 
                   selectedRequest.type === 'deletion' ? 'Exclusão de Dados' : 
                   'Correção de Dados'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Tabs defaultValue="approve">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <TabsTrigger 
                      value="approve" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reject" 
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-primary-400"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="approve" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="approval-note" className="text-gray-700 dark:text-gray-300">Nota de Aprovação (Opcional)</Label>
                        <Textarea 
                          id="approval-note"
                          placeholder="Adicione observações sobre a aprovação..."
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                      </div>
                      
                      {selectedRequest.type === 'access' && (
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Método de Entrega</Label>
                          <Select defaultValue="portal">
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="portal" className="text-gray-900 dark:text-white">Portal seguro</SelectItem>
                              <SelectItem value="email" className="text-gray-900 dark:text-white">E-mail criptografado</SelectItem>
                              <SelectItem value="download" className="text-gray-900 dark:text-white">Download seguro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                        onClick={handleApproveRequest}
                      >
                        Aprovar Solicitação
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reject" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rejection-reason" className="text-gray-700 dark:text-gray-300">Motivo da Rejeição</Label>
                        <Textarea 
                          id="rejection-reason"
                          placeholder="Explique o motivo da rejeição..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Forneça uma explicação clara e jurídica para a rejeição.
                        </p>
                      </div>
                      
                      <Alert 
                        variant="warning"
                        className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-300">Atenção</AlertTitle>
                        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                          A rejeição de solicitações deve ser embasada em motivos legais ou técnicos.
                          A LGPD/HIPAA garantem direitos específicos ao titular dos dados.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                        onClick={handleRejectRequest}
                        disabled={!rejectionReason}
                      >
                        Rejeitar Solicitação
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
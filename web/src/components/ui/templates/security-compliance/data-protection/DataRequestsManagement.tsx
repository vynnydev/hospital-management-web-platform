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
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Negado</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Solicitações de Dados
          </CardTitle>
          <CardDescription>
            Gerencie solicitações de acesso, exclusão e correção de dados conforme LGPD/HIPAA
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="access" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Acesso</span>
                <Badge variant="secondary">{accessRequests.filter(r => r.status === 'pending').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="deletion" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Exclusão</span>
                <Badge variant="secondary">{deletionRequests.filter(r => r.status === 'pending').length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="correction" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Correção</span>
                <Badge variant="secondary">{correctionRequests.filter(r => r.status === 'pending').length}</Badge>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">
                  {activeTab === 'access' && 'Solicitações de Acesso a Dados'}
                  {activeTab === 'deletion' && 'Solicitações de Exclusão de Dados'}
                  {activeTab === 'correction' && 'Solicitações de Correção de Dados'}
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos status</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="approved">Aprovados</SelectItem>
                      <SelectItem value="rejected">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center w-[200px] relative">
                    <Input placeholder="Buscar pelo nome..." />
                    <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID da Solicitação</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Escopo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRequests().map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="font-mono text-xs">{request.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{request.patientName}</div>
                              <div className="text-xs text-gray-500">{request.patientId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(request.requestDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
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
                  <CheckCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-gray-500">
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
          <div className="text-xs text-gray-500">
            Tempo médio de resposta: 48 horas
          </div>
          <Button variant="outline">
            Exportar Relatório
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas sobre a solicitação
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">ID da Solicitação</p>
                  <p className="text-sm">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">Paciente</p>
                  <p className="text-sm">{selectedRequest.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">ID do Paciente</p>
                  <p className="text-sm">{selectedRequest.patientId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data da Solicitação</p>
                  <p className="text-sm">{formatDate(selectedRequest.requestDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tipo de Solicitante</p>
                  <p className="text-sm">
                    {selectedRequest.requesterType === 'patient' ? 'Paciente' : 
                     selectedRequest.requesterType === 'legal_guardian' ? 'Responsável Legal' : 
                     'Terceiro Autorizado'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Tipo de Solicitação</p>
                  <p className="text-sm">
                    {selectedRequest.type === 'access' ? 'Acesso a Dados' : 
                     selectedRequest.type === 'deletion' ? 'Exclusão de Dados' : 
                     'Correção de Dados'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Escopo</p>
                  <p className="text-sm">
                    {selectedRequest.scope === 'full' ? 'Completo (todos os dados)' : 
                     selectedRequest.scope === 'partial' ? 'Parcial (dados específicos)' : 
                     'Específico (dados pontuais)'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Motivo da Solicitação</p>
                  <p className="text-sm">{selectedRequest.requestReason}</p>
                </div>
                
                {selectedRequest.status === 'rejected' && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Motivo da Rejeição</p>
                    <p className="text-sm">{selectedRequest.rejectionReason}</p>
                  </div>
                )}

                {selectedRequest.status === 'approved' && selectedRequest.type === 'access' && (
                  <div className="col-span-2 p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-start">
                      <ArrowDownCircle className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Dados disponibilizados</p>
                        <p className="text-xs text-green-700">
                          Os dados solicitados foram disponibilizados via portal seguro.
                          Expiração do acesso: 30/04/2025
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedRequest.type === 'deletion' && (
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Importante - Retenção Legal</AlertTitle>
                  <AlertDescription>
                    Dados médicos podem estar sujeitos a períodos obrigatórios de retenção conforme 
                    regulamentações locais (entre 10 e 20 anos). Apenas dados não sujeitos a 
                    obrigações legais podem ser excluídos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de resposta (aprovar/rejeitar) */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder à Solicitação</DialogTitle>
            <DialogDescription>
              Aprovar ou rejeitar a solicitação {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-medium">Paciente</p>
                <p className="text-sm">{selectedRequest.patientName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Tipo de Solicitação</p>
                <p className="text-sm">
                  {selectedRequest.type === 'access' ? 'Acesso a Dados' : 
                   selectedRequest.type === 'deletion' ? 'Exclusão de Dados' : 
                   'Correção de Dados'}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <Tabs defaultValue="approve">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="approve" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </TabsTrigger>
                    <TabsTrigger value="reject" className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="approve" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="approval-note">Nota de Aprovação (Opcional)</Label>
                        <Textarea 
                          id="approval-note"
                          placeholder="Adicione observações sobre a aprovação..."
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                        />
                      </div>
                      
                      {selectedRequest.type === 'access' && (
                        <div className="space-y-2">
                          <Label>Método de Entrega</Label>
                          <Select defaultValue="portal">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="portal">Portal seguro</SelectItem>
                              <SelectItem value="email">E-mail criptografado</SelectItem>
                              <SelectItem value="download">Download seguro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={handleApproveRequest}
                      >
                        Aprovar Solicitação
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reject" className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rejection-reason">Motivo da Rejeição</Label>
                        <Textarea 
                          id="rejection-reason"
                          placeholder="Explique o motivo da rejeição..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Forneça uma explicação clara e jurídica para a rejeição.
                        </p>
                      </div>
                      
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Atenção</AlertTitle>
                        <AlertDescription>
                          A rejeição de solicitações deve ser embasada em motivos legais ou técnicos.
                          A LGPD/HIPAA garantem direitos específicos ao titular dos dados.
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full"
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
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { BookOpen, FilePlus, CheckSquare, FileSignature, Upload, X, Check, Eye, Clock, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';

interface Protocol {
  id: string;
  name: string;
  description: string;
  department: string;
  status: 'unsigned' | 'pending' | 'signed';
  dateAdded: string;
  dateSigned?: string;
  signedBy?: string;
}

interface ClinicalProtocolsProps {
  workflowId?: string;
}

export const ClinicalProtocols: React.FC<ClinicalProtocolsProps> = ({ workflowId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estado para os protocolos
  const [protocols, setProtocols] = useState<Protocol[]>([
    {
      id: '1',
      name: 'Sepse',
      description: 'Protocolo de identificação e manejo precoce da sepse',
      department: 'Emergência',
      status: 'signed',
      dateAdded: '10/01/2025',
      dateSigned: '15/01/2025',
      signedBy: 'Dr. Carlos Silva'
    },
    {
      id: '2',
      name: 'AVC',
      description: 'Protocolo de atendimento ao AVC agudo',
      department: 'Emergência',
      status: 'pending',
      dateAdded: '05/02/2025'
    },
    {
      id: '3',
      name: 'Cirurgia Segura',
      description: 'Checklist para procedimentos cirúrgicos',
      department: 'Centro Cirúrgico',
      status: 'unsigned',
      dateAdded: '20/01/2025'
    }
  ]);

  // Simulação da integração com DocSign - em um ambiente real, isso seria uma API
  const initiateDocSignFlow = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setIsSignDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadAndSignDocument = () => {
    if (selectedProtocol) {
      // Simulação de atualização do status
      setProtocols(prev => 
        prev.map(p => 
          p.id === selectedProtocol.id 
            ? { 
                ...p, 
                status: 'signed', 
                dateSigned: new Date().toLocaleDateString(), 
                signedBy: 'Usuário Atual' 
              } 
            : p
        )
      );
      setIsSignDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const addNewProtocol = () => {
    setIsDialogOpen(true);
  };

  const submitNewProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementação simplificada - em uma aplicação real, isso enviaria dados para uma API
    const formData = new FormData(e.target as HTMLFormElement);
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      name: formData.get('protocolName') as string,
      description: formData.get('description') as string,
      department: formData.get('department') as string,
      status: 'unsigned',
      dateAdded: new Date().toLocaleDateString()
    };
    
    setProtocols([...protocols, newProtocol]);
    setIsDialogOpen(false);
  };

  // Filtragem de protocolos com base na aba selecionada
  const filteredProtocols = activeTab === 'all' 
    ? protocols 
    : protocols.filter(p => p.status === activeTab);

  // Renderização de badge com base no status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1" /> Assinado</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" /> Pendente</Badge>;
      case 'unsigned':
        return <Badge className="bg-gray-500 hover:bg-gray-600"><FileSignature className="h-3 w-3 mr-1" /> Não Assinado</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Protocolos Clínicos
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              onClick={addNewProtocol}
            >
              <FilePlus className="h-3.5 w-3.5 mr-1" />
              Adicionar
            </Button>
          </div>
          <CardDescription>
            Integre processos com protocolos médicos padronizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="unsigned">Não Assinados</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="signed">Assinados</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredProtocols.map(protocol => (
                  <div 
                    key={protocol.id}
                    className="border rounded-lg p-4 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer relative group"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-indigo-600 dark:text-indigo-400">{protocol.name}</h3>
                      {renderStatusBadge(protocol.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {protocol.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <CheckSquare className="h-3 w-3 inline mr-1" /> Associado à {protocol.department}
                    </div>
                    
                    {/* Data de adição */}
                    <div className="mt-2 text-xs text-gray-400">
                      Adicionado em: {protocol.dateAdded}
                    </div>
                    
                    {/* Data e responsável pela assinatura, se aplicável */}
                    {protocol.status === 'signed' && protocol.dateSigned && (
                      <div className="mt-1 text-xs text-green-500">
                        Assinado em: {protocol.dateSigned} por {protocol.signedBy}
                      </div>
                    )}
                    
                    {/* Ações disponíveis para cada protocolo com base em seu status */}
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-500"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {protocol.status !== 'signed' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-gray-500 hover:text-indigo-500"
                          onClick={() => initiateDocSignFlow(protocol)}
                        >
                          <FileSignature className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Total de protocolos: {protocols.length} | Assinados: {protocols.filter(p => p.status === 'signed').length}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-indigo-500 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            onClick={addNewProtocol}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Adicionar Protocolo
          </Button>
        </CardFooter>
      </Card>

      {/* Modal para adicionar novo protocolo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='bg-gray-100 dark:bg-gray-800'>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Protocolo</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para adicionar um novo protocolo clínico.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={submitNewProtocol}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="protocolName" className="text-right">
                  Nome
                </Label>
                <Input
                  id="protocolName"
                  name="protocolName"
                  placeholder="Nome do protocolo"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Descrição breve"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Departamento
                </Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Ex: Emergência, UTI"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar Protocolo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para assinar protocolo via DocSign */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assinar Protocolo via DocSign</DialogTitle>
            <DialogDescription>
              {selectedProtocol?.name}: Upload e assinatura digital do documento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Arraste um arquivo ou clique para fazer upload</p>
                <Input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('fileUpload')?.click()}
                >
                  Selecionar Arquivo
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSignature className="h-6 w-6 text-indigo-500 mr-2" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {selectedFile && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Assinatura Digital</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Ao clicar em &quot;Assinar com DocSign&quot;, você será redirecionado para o processo de assinatura digital.
                </p>
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-600 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Este protocolo seguirá para validação após a assinatura.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              disabled={!selectedFile}
              onClick={uploadAndSignDocument}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <FileSignature className="h-4 w-4 mr-2" />
              Assinar com DocSign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
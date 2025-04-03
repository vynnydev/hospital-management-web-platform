/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Switch } from '@/components/ui/organisms/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Badge } from '@/components/ui/organisms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Network, PlusCircle, Trash2, Edit, Globe, AlertCircle, Info } from 'lucide-react';
import { IAccessControlConfig } from '@/types/security-compliance-types';

interface IPRestrictionPanelProps {
  accessControlConfig: IAccessControlConfig;
  updateAccessControlConfig: (config: IAccessControlConfig) => Promise<any>;
  loading: boolean;
}

export const IPRestrictionPanel: React.FC<IPRestrictionPanelProps> = ({
  accessControlConfig,
  updateAccessControlConfig,
  loading
}) => {
  const [config, setConfig] = useState<IAccessControlConfig>(accessControlConfig);
  const [newIP, setNewIP] = useState('');
  const [editingIP, setEditingIP] = useState('');
  const [originalIP, setOriginalIP] = useState('');
  const [ipValidationError, setIpValidationError] = useState('');
  const [showAddIPDialog, setShowAddIPDialog] = useState(false);
  const [showEditIPDialog, setShowEditIPDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // IP validation
  const validateIP = (ip: string): boolean => {
    // Regular expression for IPv4 (simple validation)
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Regular expression for IPv4 CIDR notation
    const cidrRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))$/;
    
    return ipv4Regex.test(ip) || cidrRegex.test(ip);
  };

  const handleToggleIPRestriction = (enabled: boolean) => {
    setConfig({
      ...config,
      enforceIPRestriction: enabled
    });
  };

  const handleAddIP = () => {
    if (!validateIP(newIP)) {
      setIpValidationError('Formato de IP inválido. Use o formato padrão IPv4 ou notação CIDR (ex: 192.168.1.1 ou 192.168.1.0/24)');
      return;
    }
    
    const updatedIPs = [...(config.allowedIPs || [])];
    if (updatedIPs.includes(newIP)) {
      setIpValidationError('Este IP já está na lista de IPs permitidos');
      return;
    }
    
    updatedIPs.push(newIP);
    
    setConfig({
      ...config,
      allowedIPs: updatedIPs
    });
    
    setNewIP('');
    setIpValidationError('');
    setShowAddIPDialog(false);
  };

  const handleUpdateIP = () => {
    if (!validateIP(editingIP)) {
      setIpValidationError('Formato de IP inválido. Use o formato padrão IPv4 ou notação CIDR (ex: 192.168.1.1 ou 192.168.1.0/24)');
      return;
    }
    
    const updatedIPs = [...(config.allowedIPs || [])];
    const index = updatedIPs.findIndex(ip => ip === originalIP);
    
    if (index !== -1) {
      updatedIPs[index] = editingIP;
      
      setConfig({
        ...config,
        allowedIPs: updatedIPs
      });
    }
    
    setEditingIP('');
    setOriginalIP('');
    setIpValidationError('');
    setShowEditIPDialog(false);
  };

  const handleDeleteIP = (ip: string) => {
    const updatedIPs = (config.allowedIPs || []).filter(allowedIP => allowedIP !== ip);
    
    setConfig({
      ...config,
      allowedIPs: updatedIPs
    });
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      await updateAccessControlConfig(config);
      
      toast({
        title: "Restrições de IP atualizadas",
        description: "As configurações de restrição de IP foram salvas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving IP restrictions:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as restrições de IP.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Restrições de IP
            </CardTitle>
            <CardDescription>
              Configure quais endereços IP têm permissão para acessar o sistema
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {config.enforceIPRestriction ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={config.enforceIPRestriction}
              onCheckedChange={handleToggleIPRestriction}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!config.enforceIPRestriction && (
          <div className="flex items-start space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Restrições de IP desativadas</h4>
              <p className="text-sm text-yellow-700">
                Quando ativado, o acesso ao sistema será permitido apenas a partir dos endereços IP específicos definidos abaixo.
                Isso aumenta significativamente a segurança, mas requer configuração cuidadosa.
              </p>
            </div>
          </div>
        )}
        
        <div className={!config.enforceIPRestriction ? 'opacity-50 pointer-events-none' : ''}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">IPs Permitidos</h3>
            <Dialog open={showAddIPDialog} onOpenChange={setShowAddIPDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={!config.enforceIPRestriction}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Adicionar IP</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar IP Permitido</DialogTitle>
                  <DialogDescription>
                    Adicione um endereço IP que terá permissão para acessar o sistema.
                    Você pode usar notação CIDR para especificar faixas de IP (ex: 192.168.1.0/24).
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">Endereço IP</Label>
                    <Input 
                      id="ip-address"
                      placeholder="Ex: 192.168.1.1 ou 192.168.1.0/24"
                      value={newIP}
                      onChange={(e) => {
                        setNewIP(e.target.value);
                        setIpValidationError('');
                      }}
                    />
                    {ipValidationError && (
                      <p className="text-xs text-red-500">{ipValidationError}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 flex items-start gap-1 mt-2">
                    <Info className="h-4 w-4 mt-0.5" />
                    <span>
                      Para adicionar uma rede inteira, use a notação CIDR. Por exemplo, &quot;192.168.1.0/24&quot; permite todos os IPs de 192.168.1.0 a 192.168.1.255.
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => {
                    setShowAddIPDialog(false);
                    setNewIP('');
                    setIpValidationError('');
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddIP}>
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {(config.allowedIPs || []).length === 0 ? (
            <div className="border rounded-md p-6 text-center">
              <Globe className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-medium mb-1">Nenhum IP permitido configurado</h3>
              <p className="text-xs text-gray-500 mb-3">
                Adicione pelo menos um IP ou faixa de IP para restringir o acesso ao sistema.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddIPDialog(true)}
              >
                Adicionar IP
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endereço IP / Faixa</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(config.allowedIPs || []).map((ip) => (
                    <TableRow key={ip}>
                      <TableCell className="font-mono">
                        {ip}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {ip.includes('/') ? (
                          <Badge variant="outline" className="bg-blue-50">Faixa CIDR</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50">IP único</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={showEditIPDialog && originalIP === ip} onOpenChange={(open) => {
                            if (!open) {
                              setShowEditIPDialog(false);
                              setEditingIP('');
                              setOriginalIP('');
                              setIpValidationError('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setEditingIP(ip);
                                  setOriginalIP(ip);
                                  setShowEditIPDialog(true);
                                }}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar IP Permitido</DialogTitle>
                                <DialogDescription>
                                  Modifique o endereço IP ou faixa de IPs que tem permissão para acessar o sistema.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 py-2">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-ip-address">Endereço IP</Label>
                                  <Input 
                                    id="edit-ip-address"
                                    placeholder="Ex: 192.168.1.1 ou 192.168.1.0/24"
                                    value={editingIP}
                                    onChange={(e) => {
                                      setEditingIP(e.target.value);
                                      setIpValidationError('');
                                    }}
                                  />
                                  {ipValidationError && (
                                    <p className="text-xs text-red-500">{ipValidationError}</p>
                                  )}
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="ghost" onClick={() => {
                                  setShowEditIPDialog(false);
                                  setEditingIP('');
                                  setOriginalIP('');
                                  setIpValidationError('');
                                }}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleUpdateIP}>
                                  Salvar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteIP(ip)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Configurações Adicionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-md p-3 space-y-2">
                <Label htmlFor="action-on-blocked" className="flex items-center justify-between">
                  <span>Ação para IPs bloqueados</span>
                </Label>
                <Select defaultValue="block">
                  <SelectTrigger id="action-on-blocked">
                    <SelectValue placeholder="Selecionar ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Bloquear acesso</SelectItem>
                    <SelectItem value="challenge">Solicitar verificação adicional</SelectItem>
                    <SelectItem value="log">Apenas registrar (sem bloqueio)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Define como o sistema deve responder a tentativas de acesso de IPs não autorizados.
                </p>
              </div>
              
              <div className="border rounded-md p-3 space-y-2">
                <Label htmlFor="notification-level" className="flex items-center justify-between">
                  <span>Notificações de tentativas bloqueadas</span>
                </Label>
                <Select defaultValue="high">
                  <SelectTrigger id="notification-level">
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as tentativas</SelectItem>
                    <SelectItem value="high">Apenas tentativas repetidas (alto volume)</SelectItem>
                    <SelectItem value="none">Sem notificações</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Define quando os administradores devem ser notificados sobre tentativas de acesso bloqueadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          {config.enforceIPRestriction ? (
            <>
              <Info className="h-4 w-4 mr-1" />
              <span>
                {(config.allowedIPs || []).length} {(config.allowedIPs || []).length === 1 ? 'IP permitido' : 'IPs permitidos'}
              </span>
            </>
          ) : (
            <span className="text-yellow-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Restrições desativadas
            </span>
          )}
        </div>
        <Button 
          onClick={handleSaveConfig}
          disabled={loading || isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardFooter>
    </Card>
  );
};
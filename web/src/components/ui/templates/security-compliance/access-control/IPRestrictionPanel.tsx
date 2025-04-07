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
  ipRestriction: boolean;
  allowedIPs: string[] | undefined;
  onChange: (enforceIPRestriction: boolean, allowedIPs: string[]) => void;
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
    <Card className="mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Network className="h-5 w-5 text-primary dark:text-primary-400" />
              Restrições de IP
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Configure quais endereços IP têm permissão para acessar o sistema
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {config?.enforceIPRestriction ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={config?.enforceIPRestriction}
              onCheckedChange={handleToggleIPRestriction}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {config && !config.enforceIPRestriction && (
            <div className="flex items-start space-x-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Restrições de IP desativadas</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Quando ativado, o acesso ao sistema será permitido apenas a partir dos endereços IP específicos definidos abaixo.
                    Isso aumenta significativamente a segurança, mas requer configuração cuidadosa.
                </p>
                </div>
            </div>
        )}
        
        <div className={config && !config.enforceIPRestriction ? 'opacity-50 pointer-events-none' : ''}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">IPs Permitidos</h3>
            <Dialog open={showAddIPDialog} onOpenChange={setShowAddIPDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  disabled={config && !config.enforceIPRestriction}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Adicionar IP</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">Adicionar IP Permitido</DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400">
                    Adicione um endereço IP que terá permissão para acessar o sistema.
                    Você pode usar notação CIDR para especificar faixas de IP (ex: 192.168.1.0/24).
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="ip-address" className="text-gray-700 dark:text-gray-300">Endereço IP</Label>
                    <Input 
                      id="ip-address"
                      placeholder="Ex: 192.168.1.1 ou 192.168.1.0/24"
                      value={newIP}
                      onChange={(e) => {
                        setNewIP(e.target.value);
                        setIpValidationError('');
                      }}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    {ipValidationError && (
                      <p className="text-xs text-red-500 dark:text-red-400">{ipValidationError}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1 mt-2">
                    <Info className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-400" />
                    <span>
                      Para adicionar uma rede inteira, use a notação CIDR. Por exemplo, &quot;192.168.1.0/24&quot; permite todos os IPs de 192.168.1.0 a 192.168.1.255.
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowAddIPDialog(false);
                      setNewIP('');
                      setIpValidationError('');
                    }}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddIP}
                    className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                  >
                    Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {(config && config.allowedIPs || []).length === 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-6 text-center bg-white dark:bg-gray-900">
              <Globe className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white">Nenhum IP permitido configurado</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Adicione pelo menos um IP ou faixa de IP para restringir o acesso ao sistema.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddIPDialog(true)}
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Adicionar IP
              </Button>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-md">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300">Endereço IP / Faixa</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-700 dark:text-gray-300">Tipo</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(config.allowedIPs || []).map((ip) => (
                    <TableRow key={ip} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-mono text-gray-900 dark:text-white">
                        {ip}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {ip.includes('/') ? (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Faixa CIDR</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">IP único</Badge>
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
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-white">Editar IP Permitido</DialogTitle>
                                <DialogDescription className="text-gray-500 dark:text-gray-400">
                                  Modifique o endereço IP ou faixa de IPs que tem permissão para acessar o sistema.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-3 py-2">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-ip-address" className="text-gray-700 dark:text-gray-300">Endereço IP</Label>
                                  <Input 
                                    id="edit-ip-address"
                                    placeholder="Ex: 192.168.1.1 ou 192.168.1.0/24"
                                    value={editingIP}
                                    onChange={(e) => {
                                      setEditingIP(e.target.value);
                                      setIpValidationError('');
                                    }}
                                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                  />
                                  {ipValidationError && (
                                    <p className="text-xs text-red-500 dark:text-red-400">{ipValidationError}</p>
                                  )}
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="ghost" 
                                  onClick={() => {
                                    setShowEditIPDialog(false);
                                    setEditingIP('');
                                    setOriginalIP('');
                                    setIpValidationError('');
                                  }}
                                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  onClick={handleUpdateIP}
                                  className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
                                >
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
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
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
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configurações Adicionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2 bg-white dark:bg-gray-900">
                <Label htmlFor="action-on-blocked" className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                  <span>Ação para IPs bloqueados</span>
                </Label>
                <Select defaultValue="block">
                  <SelectTrigger id="action-on-blocked" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecionar ação" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="block" className="text-gray-900 dark:text-white">Bloquear acesso</SelectItem>
                    <SelectItem value="challenge" className="text-gray-900 dark:text-white">Solicitar verificação adicional</SelectItem>
                    <SelectItem value="log" className="text-gray-900 dark:text-white">Apenas registrar (sem bloqueio)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Define como o sistema deve responder a tentativas de acesso de IPs não autorizados.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2 bg-white dark:bg-gray-900">
                <Label htmlFor="notification-level" className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                  <span>Notificações de tentativas bloqueadas</span>
                </Label>
                <Select defaultValue="high">
                  <SelectTrigger id="notification-level" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="all" className="text-gray-900 dark:text-white">Todas as tentativas</SelectItem>
                    <SelectItem value="high" className="text-gray-900 dark:text-white">Apenas tentativas repetidas (alto volume)</SelectItem>
                    <SelectItem value="none" className="text-gray-900 dark:text-white">Sem notificações</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Define quando os administradores devem ser notificados sobre tentativas de acesso bloqueadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          {config && config.enforceIPRestriction ? (
            <>
              <Info className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
              <span>
                {(config && config.allowedIPs || []).length} {(config && config.allowedIPs || []).length === 1 ? 'IP permitido' : 'IPs permitidos'}
              </span>
            </>
          ) : (
            <span className="text-yellow-600 dark:text-yellow-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Restrições desativadas
            </span>
          )}
        </div>
        <Button 
          onClick={handleSaveConfig}
          disabled={loading || isSaving}
          className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
        >
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardFooter>
    </Card>
  );
};
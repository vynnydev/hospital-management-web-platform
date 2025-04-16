/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Badge } from '@/components/ui/organisms/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { useToast } from '@/components/ui/hooks/use-toast';
import { 
  MapPin, 
  Plus, 
  Globe, 
  AlertTriangle, 
  Trash2, 
  Edit2, 
  Info, 
  Locate
} from 'lucide-react';

interface ILocation {
  id: string;
  name: string;
  description?: string;
  type: 'hospital' | 'clinic' | 'custom';
  coordinates: {
    latitude: number;
    longitude: number;
    radius: number; // metros
  };
  enabled: boolean;
  default?: boolean;
  createdAt: string;
}

interface GeofencingPanelProps {
  geofencingEnabled: boolean;
  onToggleGeofencing: (enabled: boolean) => void;
  locations: ILocation[];
  onSaveLocation: (location: Omit<ILocation, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateLocation: (location: ILocation) => Promise<void>;
  onDeleteLocation: (locationId: string) => Promise<void>;
  geofencing: boolean;
  allowedLocations: { name: string; coordinates: { latitude: number; longitude: number; radius: number; }; }[] | undefined;
  onChange: (geofencing: boolean, allowedLocations: { name: string; coordinates: { latitude: number; longitude: number; radius: number; }; }[]) => void;
  onSave: (location: any) => Promise<void>;
  loading: boolean;
}

export const GeofencingPanel: React.FC<GeofencingPanelProps> = ({
  geofencingEnabled,
  onToggleGeofencing,
  locations,
  onSaveLocation,
  onUpdateLocation,
  onDeleteLocation,
  loading
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
  const [newLocation, setNewLocation] = useState<Omit<ILocation, 'id' | 'createdAt'>>({
    name: '',
    type: 'custom',
    coordinates: {
      latitude: 0,
      longitude: 0,
      radius: 100
    },
    enabled: true
  });
  const { toast } = useToast();

  const handleAddLocation = async () => {
    try {
      await onSaveLocation(newLocation);
      
      toast({
        title: "Localização adicionada",
        description: "A nova área de geofencing foi adicionada com sucesso.",
        variant: "default",
      });
      
      setShowAddDialog(false);
      resetNewLocation();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a localização.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLocation = async () => {
    if (!selectedLocation) return;
    
    try {
      await onUpdateLocation(selectedLocation);
      
      toast({
        title: "Localização atualizada",
        description: "A área de geofencing foi atualizada com sucesso.",
        variant: "default",
      });
      
      setShowEditDialog(false);
      setSelectedLocation(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a localização.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await onDeleteLocation(locationId);
      
      toast({
        title: "Localização removida",
        description: "A área de geofencing foi removida com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover a localização.",
        variant: "destructive",
      });
    }
  };

  const resetNewLocation = () => {
    setNewLocation({
      name: '',
      type: 'custom',
      coordinates: {
        latitude: 0,
        longitude: 0,
        radius: 100
      },
      enabled: true
    });
  };

  const handleEditLocation = (location: ILocation) => {
    setSelectedLocation(location);
    setShowEditDialog(true);
  };

  // Helper function to get coordinates display
  const formatCoordinates = (latitude: number, longitude: number) => {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  // Helper function to get friendly radius display
  const formatRadius = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  return (
    <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <MapPin className="h-5 w-5 text-primary dark:text-primary-400" />
              Geofencing
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Restrinja o acesso com base na localização geográfica
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {geofencingEnabled ? 'Ativado' : 'Desativado'}
            </span>
            <Switch
              checked={geofencingEnabled}
              onCheckedChange={onToggleGeofencing}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!geofencingEnabled ? (
          <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <AlertTitle className="text-blue-700 dark:text-blue-300">Geofencing desativado</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400">
              Habilite o geofencing para restringir o acesso ao sistema com base na localização geográfica do usuário.
              Isso pode aumentar significativamente a segurança, especialmente para acesso a dados sensíveis.
            </AlertDescription>
          </Alert>
        ) : locations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nenhuma localização configurada</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
              Adicione uma ou mais localizações permitidas para começar a usar o geofencing.
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Localização
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Localizações permitidas</h3>
              <Button 
                size="sm" 
                onClick={() => setShowAddDialog(true)}
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                    <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                    <TableHead className="hidden md:table-cell text-gray-700 dark:text-gray-300">Tipo</TableHead>
                    <TableHead className="hidden lg:table-cell text-gray-700 dark:text-gray-300">Coordenadas</TableHead>
                    <TableHead className="hidden sm:table-cell text-gray-700 dark:text-gray-300">Raio</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {location.name}
                        {location.default && (
                          <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">Padrão</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">
                        {location.type === 'hospital' && 'Hospital'}
                        {location.type === 'clinic' && 'Clínica'}
                        {location.type === 'custom' && 'Personalizado'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs text-gray-700 dark:text-gray-300">
                        {formatCoordinates(
                          location.coordinates.latitude,
                          location.coordinates.longitude
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-gray-700 dark:text-gray-300">
                        {formatRadius(location.coordinates.radius)}
                      </TableCell>
                      <TableCell>
                        {location.enabled ? (
                          <Badge variant="success" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditLocation(location)}
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          {!location.default && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">Importante</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                O geofencing depende da precisão do GPS do dispositivo ou do IP do usuário. 
                Fatores ambientais ou uso de VPNs podem afetar a precisão da detecção de localização.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      
      {geofencingEnabled && locations.length > 0 && (
        <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total: {locations.length} localizações configuradas
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Testar Minha Localização
          </Button>
        </CardFooter>
      )}

      {/* Add Location Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Adicionar Nova Localização</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Adicione uma nova área geográfica permitida para acesso ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-700 dark:text-gray-300">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Ex: Sede Principal"
                className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-gray-700 dark:text-gray-300">
                Tipo
              </Label>
              <Select
                value={newLocation.type}
                onValueChange={(value: 'hospital' | 'clinic' | 'custom') => 
                  setNewLocation({ ...newLocation, type: value })
                }
              >
                <SelectTrigger className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="hospital" className="text-gray-900 dark:text-white">Hospital</SelectItem>
                  <SelectItem value="clinic" className="text-gray-900 dark:text-white">Clínica</SelectItem>
                  <SelectItem value="custom" className="text-gray-900 dark:text-white">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right text-gray-700 dark:text-gray-300">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="Ex: -23.5505"
                className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                value={newLocation.coordinates.latitude || ''}
                onChange={(e) => setNewLocation({
                  ...newLocation,
                  coordinates: {
                    ...newLocation.coordinates,
                    latitude: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right text-gray-700 dark:text-gray-300">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="Ex: -46.6333"
                className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                value={newLocation.coordinates.longitude || ''}
                onChange={(e) => setNewLocation({
                  ...newLocation,
                  coordinates: {
                    ...newLocation.coordinates,
                    longitude: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="radius" className="text-right text-gray-700 dark:text-gray-300">
                Raio (metros)
              </Label>
              <Input
                id="radius"
                type="number"
                min="50"
                max="10000"
                placeholder="Ex: 500"
                className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                value={newLocation.coordinates.radius || ''}
                onChange={(e) => setNewLocation({
                  ...newLocation,
                  coordinates: {
                    ...newLocation.coordinates,
                    radius: parseInt(e.target.value) || 100
                  }
                })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location-enabled" className="text-right text-gray-700 dark:text-gray-300">
                Ativo
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="location-enabled"
                  checked={newLocation.enabled}
                  onCheckedChange={(checked) => setNewLocation({
                    ...newLocation,
                    enabled: checked
                  })}
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
                <Label htmlFor="location-enabled" className="text-gray-900 dark:text-white">
                  {newLocation.enabled ? 'Ativado' : 'Desativado'}
                </Label>
              </div>
            </div>
            
            <div className="col-span-4">
              <Alert variant="default" className="mt-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Locate className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Dica</AlertTitle>
                <AlertDescription className="text-xs text-blue-600 dark:text-blue-400">
                  Use o botão abaixo para obter as coordenadas atuais ou use um serviço de mapas para encontrar a latitude e longitude exatas da localização desejada.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  setNewLocation({
                    ...newLocation,
                    coordinates: {
                      ...newLocation.coordinates,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }
                  });
                  
                  toast({
                    title: "Localização obtida",
                    description: "Coordenadas atuais carregadas com sucesso.",
                    variant: "default",
                  });
                }, () => {
                  toast({
                    title: "Erro",
                    description: "Não foi possível obter a localização atual.",
                    variant: "destructive",
                  });
                });
              }}
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe className="h-4 w-4 mr-1" />
              Usar Localização Atual
            </Button>
            <div>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAddDialog(false);
                  resetNewLocation();
                }}
                className="mr-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddLocation}
                disabled={!newLocation.name || loading}
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
              >
                Adicionar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Editar Localização</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Atualize as informações da área geográfica selecionada.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right text-gray-700 dark:text-gray-300">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Sede Principal"
                  className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
                  value={selectedLocation.name}
                  onChange={(e) => setSelectedLocation({ 
                    ...selectedLocation, 
                    name: e.target.value 
                  })}
                  disabled={selectedLocation.default}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right text-gray-700 dark:text-gray-300">
                  Tipo
                </Label>
                <Select
                  value={selectedLocation.type}
                  onValueChange={(value: 'hospital' | 'clinic' | 'custom') => 
                    setSelectedLocation({ ...selectedLocation, type: value })
                  }
                  disabled={selectedLocation.default}
                >
                  <SelectTrigger className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="hospital" className="text-gray-900 dark:text-white">Hospital</SelectItem>
                    <SelectItem value="clinic" className="text-gray-900 dark:text-white">Clínica</SelectItem>
                    <SelectItem value="custom" className="text-gray-900 dark:text-white">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-latitude" className="text-right text-gray-700 dark:text-gray-300">
                  Latitude
                </Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="0.000001"
                  placeholder="Ex: -23.5505"
                  className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  value={selectedLocation.coordinates.latitude || ''}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    coordinates: {
                      ...selectedLocation.coordinates,
                      latitude: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-longitude" className="text-right text-gray-700 dark:text-gray-300">
                  Longitude
                </Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="0.000001"
                  placeholder="Ex: -46.6333"
                  className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  value={selectedLocation.coordinates.longitude || ''}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    coordinates: {
                      ...selectedLocation.coordinates,
                      longitude: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-radius" className="text-right text-gray-700 dark:text-gray-300">
                  Raio (metros)
                </Label>
                <Input
                  id="edit-radius"
                  type="number"
                  min="50"
                  max="10000"
                  placeholder="Ex: 500"
                  className="col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  value={selectedLocation.coordinates.radius || ''}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    coordinates: {
                      ...selectedLocation.coordinates,
                      radius: parseInt(e.target.value) || 100
                    }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location-enabled" className="text-right text-gray-700 dark:text-gray-300">
                  Ativo
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-location-enabled"
                    checked={selectedLocation.enabled}
                    onCheckedChange={(checked) => setSelectedLocation({
                      ...selectedLocation,
                      enabled: checked
                    })}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                  <Label htmlFor="edit-location-enabled" className="text-gray-900 dark:text-white">
                    {selectedLocation.enabled ? 'Ativado' : 'Desativado'}
                  </Label>
                </div>
                </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedLocation(null);
              }}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateLocation}
              disabled={!selectedLocation?.name || loading}
              className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
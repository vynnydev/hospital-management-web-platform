/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Button } from '@/components/ui/organisms/button';
import { Switch } from '@/components/ui/organisms/switch';
import { Label } from '@/components/ui/organisms/label';
import { Slider } from '@/components/ui/organisms/slider';
import { Badge } from '@/components/ui/organisms/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/organisms/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/organisms/table';
import { useToast } from '@/components/ui/hooks/use-toast';
import { Database, UserX, RefreshCw, AlertTriangle, Filter, FileCheck, InfoIcon } from 'lucide-react';

export const AnonymizationConfig: React.FC = () => {
  const [autoAnonymization, setAutoAnonymization] = useState(true);
  const [anonymizationLevel, setAnonymizationLevel] = useState(3);
  const [primaryIdentifiers, setPrimaryIdentifiers] = useState({
    name: true,
    address: true,
    phoneNumber: true,
    email: true,
    documentNumber: true,
    birthDate: false,
    photo: true
  });
  const [secondaryIdentifiers, setSecondaryIdentifiers] = useState({
    gender: false,
    ageRange: false,
    zipCode: true,
    city: false,
    profession: true,
    nationality: false,
    ethnicity: true
  });
  const [dataExportAnonymization, setDataExportAnonymization] = useState(true);
  const [researchAnonymization, setResearchAnonymization] = useState({
    enabled: true,
    method: 'k-anonymity',
    kValue: 5
  });
  const { toast } = useToast();

  const handlePrimaryIdentifierChange = (identifier: keyof typeof primaryIdentifiers, checked: boolean) => {
    setPrimaryIdentifiers({
      ...primaryIdentifiers,
      [identifier]: checked
    });
  };

  const handleSecondaryIdentifierChange = (identifier: keyof typeof secondaryIdentifiers, checked: boolean) => {
    setSecondaryIdentifiers({
      ...secondaryIdentifiers,
      [identifier]: checked
    });
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de anonimização foram atualizadas com sucesso.",
      variant: "default",
    });
  };

  // Renderiza a descrição do nível de anonimização
  const getAnonymizationLevelDescription = (level: number) => {
    switch (level) {
      case 1:
        return "Mínimo - Remoção apenas de identificadores diretos (ex: nome, CPF)";
      case 2:
        return "Básico - Remoção de identificadores diretos e alguns indiretos";
      case 3:
        return "Moderado - Mascaramento de dados sensíveis e redução de precisão";
      case 4:
        return "Alto - Generalização significativa e supressão de dados";
      case 5:
        return "Máximo - K-anonimato rigoroso com baixo risco de reidentificação";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Configurações de Anonimização
          </CardTitle>
          <CardDescription>
            Configure as regras de anonimização e pseudonimização de dados pessoais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="auto-anonymization" className="font-medium">
                Anonimização Automática
              </Label>
              <p className="text-xs text-gray-500">
                Aplica anonimização automática em relatórios e exportações de dados
              </p>
            </div>
            <Switch
              id="auto-anonymization"
              checked={autoAnonymization}
              onCheckedChange={setAutoAnonymization}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="anonymization-level" className="font-medium">
                Nível de Anonimização: {anonymizationLevel}
              </Label>
              <Badge>{anonymizationLevel === 5 ? 'Máximo' : anonymizationLevel === 1 ? 'Mínimo' : 'Moderado'}</Badge>
            </div>
            <Slider
              id="anonymization-level"
              min={1}
              max={5}
              step={1}
              value={[anonymizationLevel]}
              onValueChange={(values) => setAnonymizationLevel(values[0])}
              className="py-4"
              disabled={!autoAnonymization}
            />
            <p className="text-xs text-gray-600">
              {getAnonymizationLevelDescription(anonymizationLevel)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Identificadores Primários</h3>
              <p className="text-xs text-gray-600">
                Dados que permitem identificação direta dos indivíduos
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="name-identifier">Nome</Label>
                  <Switch
                    id="name-identifier"
                    checked={primaryIdentifiers.name}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('name', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="address-identifier">Endereço</Label>
                  <Switch
                    id="address-identifier"
                    checked={primaryIdentifiers.address}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('address', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="phone-identifier">Telefone</Label>
                  <Switch
                    id="phone-identifier"
                    checked={primaryIdentifiers.phoneNumber}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('phoneNumber', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="email-identifier">Email</Label>
                  <Switch
                    id="email-identifier"
                    checked={primaryIdentifiers.email}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('email', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="document-identifier">Documentos (CPF, RG)</Label>
                  <Switch
                    id="document-identifier"
                    checked={primaryIdentifiers.documentNumber}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('documentNumber', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="birth-identifier">Data de Nascimento</Label>
                  <Switch
                    id="birth-identifier"
                    checked={primaryIdentifiers.birthDate}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('birthDate', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="photo-identifier">Fotos e Imagens</Label>
                  <Switch
                    id="photo-identifier"
                    checked={primaryIdentifiers.photo}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('photo', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Identificadores Secundários</h3>
              <p className="text-xs text-gray-600">
                Dados que, combinados, podem levar à reidentificação
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="gender-identifier">Gênero</Label>
                  <Switch
                    id="gender-identifier"
                    checked={secondaryIdentifiers.gender}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('gender', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="age-identifier">Faixa Etária</Label>
                  <Switch
                    id="age-identifier"
                    checked={secondaryIdentifiers.ageRange}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('ageRange', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="zip-identifier">CEP</Label>
                  <Switch
                    id="zip-identifier"
                    checked={secondaryIdentifiers.zipCode}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('zipCode', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="city-identifier">Cidade</Label>
                  <Switch
                    id="city-identifier"
                    checked={secondaryIdentifiers.city}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('city', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="profession-identifier">Profissão</Label>
                  <Switch
                    id="profession-identifier"
                    checked={secondaryIdentifiers.profession}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('profession', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="nationality-identifier">Nacionalidade</Label>
                  <Switch
                    id="nationality-identifier"
                    checked={secondaryIdentifiers.nationality}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('nationality', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <Label htmlFor="ethnicity-identifier">Etnia</Label>
                  <Switch
                    id="ethnicity-identifier"
                    checked={secondaryIdentifiers.ethnicity}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('ethnicity', checked)}
                    disabled={!autoAnonymization}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Configurações de Uso Específico</h3>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="export-anonymization" className="font-medium">
                  Anonimizar Exportações de Dados
                </Label>
                <p className="text-xs text-gray-500">
                  Aplica anonimização em todas as exportações de dados realizadas no sistema
                </p>
              </div>
              <Switch
                id="export-anonymization"
                checked={dataExportAnonymization}
                onCheckedChange={setDataExportAnonymization}
                disabled={!autoAnonymization}
              />
            </div>
            
            <div className="p-3 border rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="research-anonymization" className="font-medium">
                    Dados para Pesquisa Científica
                  </Label>
                  <p className="text-xs text-gray-500">
                    Configura técnicas específicas de anonimização para uso em pesquisa
                  </p>
                </div>
                <Switch
                  id="research-anonymization"
                  checked={researchAnonymization.enabled}
                  onCheckedChange={(checked) => setResearchAnonymization({
                    ...researchAnonymization,
                    enabled: checked
                  })}
                  disabled={!autoAnonymization}
                />
              </div>
              
              {researchAnonymization.enabled && (
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="research-method">Método de Anonimização</Label>
                      <Select
                        value={researchAnonymization.method}
                        onValueChange={(value) => setResearchAnonymization({
                          ...researchAnonymization,
                          method: value as 'k-anonymity' | 'l-diversity' | 't-closeness'
                        })}
                        disabled={!autoAnonymization}
                      >
                        <SelectTrigger id="research-method">
                          <SelectValue placeholder="Selecione um método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="k-anonymity">K-Anonimato</SelectItem>
                          <SelectItem value="l-diversity">L-Diversidade</SelectItem>
                          <SelectItem value="t-closeness">T-Proximidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {researchAnonymization.method === 'k-anonymity' && (
                      <div className="space-y-2">
                        <Label htmlFor="k-value">Valor de K: {researchAnonymization.kValue}</Label>
                        <Slider
                          id="k-value"
                          min={2}
                          max={10}
                          step={1}
                          value={[researchAnonymization.kValue]}
                          onValueChange={(values) => setResearchAnonymization({
                            ...researchAnonymization,
                            kValue: values[0]
                          })}
                          disabled={!autoAnonymization}
                        />
                        <p className="text-xs text-gray-500">
                          Quanto maior o valor de K, mais forte a anonimização.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Informação</AlertTitle>
                    <AlertDescription>
                      O método de {researchAnonymization.method === 'k-anonymity' ? 'K-Anonimato' : 
                        researchAnonymization.method === 'l-diversity' ? 'L-Diversidade' : 'T-Proximidade'} 
                      garante que cada registro seja indistinguível de pelo menos 
                      {researchAnonymization.method === 'k-anonymity' ? ` ${researchAnonymization.kValue} outros registros` : ' outros registros'}.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
          
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Requisitos regulatórios</AlertTitle>
            <AlertDescription>
              Conforme a LGPD, dados anonimizados não são considerados dados pessoais, 
              desde que a anonimização seja irreversível. Mantenha documentação detalhada 
              das técnicas utilizadas.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Visualizar Exemplo</Button>
          <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exemplos de Anonimização</CardTitle>
          <CardDescription>
            Visualize como os dados são transformados pelo processo de anonimização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Dado</TableHead>
                  <TableHead>Dado Original</TableHead>
                  <TableHead>Dado Anonimizado</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Maria Silva Oliveira</TableCell>
                  <TableCell><code>PAT-48792</code></TableCell>
                  <TableCell>Pseudônimo</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>15/03/1978</TableCell>
                  <TableCell>1978</TableCell>
                  <TableCell>Generalização</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CEP</TableCell>
                  <TableCell>01452-001</TableCell>
                  <TableCell>014**-***</TableCell>
                  <TableCell>Supressão parcial</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Telefone</TableCell>
                  <TableCell>(11) 98765-4321</TableCell>
                  <TableCell>(XX) XXXXX-XXXX</TableCell>
                  <TableCell>Supressão total</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Diagnóstico</TableCell>
                  <TableCell>Hipertensão Arterial Grau 2</TableCell>
                  <TableCell>Doença cardiovascular</TableCell>
                  <TableCell>Generalização</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
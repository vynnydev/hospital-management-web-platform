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
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <UserX className="h-5 w-5 text-primary dark:text-primary-400" />
            Configurações de Anonimização
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Configure as regras de anonimização e pseudonimização de dados pessoais
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
            <div>
              <Label htmlFor="auto-anonymization" className="font-medium text-gray-900 dark:text-white">
                Anonimização Automática
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aplica anonimização automática em relatórios e exportações de dados
              </p>
            </div>
            <Switch
              id="auto-anonymization"
              checked={autoAnonymization}
              onCheckedChange={setAutoAnonymization}
              className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="anonymization-level" className="font-medium text-gray-900 dark:text-white">
                Nível de Anonimização: {anonymizationLevel}
              </Label>
              <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                {anonymizationLevel === 5 ? 'Máximo' : anonymizationLevel === 1 ? 'Mínimo' : 'Moderado'}
              </Badge>
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
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getAnonymizationLevelDescription(anonymizationLevel)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Identificadores Primários</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dados que permitem identificação direta dos indivíduos
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="name-identifier" className="text-gray-700 dark:text-gray-300">Nome</Label>
                  <Switch
                    id="name-identifier"
                    checked={primaryIdentifiers.name}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('name', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="address-identifier" className="text-gray-700 dark:text-gray-300">Endereço</Label>
                  <Switch
                    id="address-identifier"
                    checked={primaryIdentifiers.address}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('address', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="phone-identifier" className="text-gray-700 dark:text-gray-300">Telefone</Label>
                  <Switch
                    id="phone-identifier"
                    checked={primaryIdentifiers.phoneNumber}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('phoneNumber', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="email-identifier" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Switch
                    id="email-identifier"
                    checked={primaryIdentifiers.email}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('email', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="document-identifier" className="text-gray-700 dark:text-gray-300">Documentos (CPF, RG)</Label>
                  <Switch
                    id="document-identifier"
                    checked={primaryIdentifiers.documentNumber}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('documentNumber', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="birth-identifier" className="text-gray-700 dark:text-gray-300">Data de Nascimento</Label>
                  <Switch
                    id="birth-identifier"
                    checked={primaryIdentifiers.birthDate}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('birthDate', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="photo-identifier" className="text-gray-700 dark:text-gray-300">Fotos e Imagens</Label>
                  <Switch
                    id="photo-identifier"
                    checked={primaryIdentifiers.photo}
                    onCheckedChange={(checked) => handlePrimaryIdentifierChange('photo', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Identificadores Secundários</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dados que, combinados, podem levar à reidentificação
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="gender-identifier" className="text-gray-700 dark:text-gray-300">Gênero</Label>
                  <Switch
                    id="gender-identifier"
                    checked={secondaryIdentifiers.gender}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('gender', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="age-identifier" className="text-gray-700 dark:text-gray-300">Faixa Etária</Label>
                  <Switch
                    id="age-identifier"
                    checked={secondaryIdentifiers.ageRange}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('ageRange', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="zip-identifier" className="text-gray-700 dark:text-gray-300">CEP</Label>
                  <Switch
                    id="zip-identifier"
                    checked={secondaryIdentifiers.zipCode}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('zipCode', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="city-identifier" className="text-gray-700 dark:text-gray-300">Cidade</Label>
                  <Switch
                    id="city-identifier"
                    checked={secondaryIdentifiers.city}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('city', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="profession-identifier" className="text-gray-700 dark:text-gray-300">Profissão</Label>
                  <Switch
                    id="profession-identifier"
                    checked={secondaryIdentifiers.profession}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('profession', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="nationality-identifier" className="text-gray-700 dark:text-gray-300">Nacionalidade</Label>
                  <Switch
                    id="nationality-identifier"
                    checked={secondaryIdentifiers.nationality}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('nationality', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                  <Label htmlFor="ethnicity-identifier" className="text-gray-700 dark:text-gray-300">Etnia</Label>
                  <Switch
                    id="ethnicity-identifier"
                    checked={secondaryIdentifiers.ethnicity}
                    onCheckedChange={(checked) => handleSecondaryIdentifierChange('ethnicity', checked)}
                    disabled={!autoAnonymization}
                    className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Configurações de Uso Específico</h3>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
              <div>
                <Label htmlFor="export-anonymization" className="font-medium text-gray-900 dark:text-white">
                  Anonimizar Exportações de Dados
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aplica anonimização em todas as exportações de dados realizadas no sistema
                </p>
              </div>
              <Switch
                id="export-anonymization"
                checked={dataExportAnonymization}
                onCheckedChange={setDataExportAnonymization}
                disabled={!autoAnonymization}
                className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
              />
            </div>
            
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="research-anonymization" className="font-medium text-gray-900 dark:text-white">
                    Dados para Pesquisa Científica
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                  className="bg-gray-200 dark:bg-gray-700 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-400"
                />
              </div>
              
              {researchAnonymization.enabled && (
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="research-method" className="text-gray-700 dark:text-gray-300">Método de Anonimização</Label>
                      <Select
                        value={researchAnonymization.method}
                        onValueChange={(value) => setResearchAnonymization({
                          ...researchAnonymization,
                          method: value as 'k-anonymity' | 'l-diversity' | 't-closeness'
                        })}
                        disabled={!autoAnonymization}
                      >
                        <SelectTrigger id="research-method" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Selecione um método" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectItem value="k-anonymity" className="text-gray-900 dark:text-white">K-Anonimato</SelectItem>
                          <SelectItem value="l-diversity" className="text-gray-900 dark:text-white">L-Diversidade</SelectItem>
                          <SelectItem value="t-closeness" className="text-gray-900 dark:text-white">T-Proximidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {researchAnonymization.method === 'k-anonymity' && (
                      <div className="space-y-2">
                        <Label htmlFor="k-value" className="text-gray-700 dark:text-gray-300">Valor de K: {researchAnonymization.kValue}</Label>
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
                          className="bg-gray-200 dark:bg-gray-700"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Quanto maior o valor de K, mais forte a anonimização.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <InfoIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <AlertTitle className="text-blue-700 dark:text-blue-300">Informação</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-400">
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
          
          <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            <AlertTitle className="text-amber-700 dark:text-amber-300">Requisitos regulatórios</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400">
              Conforme a LGPD, dados anonimizados não são considerados dados pessoais, 
              desde que a anonimização seja irreversível. Mantenha documentação detalhada 
              das técnicas utilizadas.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Visualizar Exemplo
          </Button>
          <Button 
            onClick={handleSaveConfig}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 dark:text-white">Exemplos de Anonimização</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Visualize como os dados são transformados pelo processo de anonimização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">Tipo de Dado</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Dado Original</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Dado Anonimizado</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="text-gray-700 dark:text-gray-300">Nome</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Maria Silva Oliveira</TableCell>
                  <TableCell className="font-mono text-gray-700 dark:text-gray-300"><code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">PAT-48792</code></TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Pseudônimo</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="text-gray-700 dark:text-gray-300">Data de Nascimento</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">15/03/1978</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">1978</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Generalização</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="text-gray-700 dark:text-gray-300">CEP</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">01452-001</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">014**-***</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Supressão parcial</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="text-gray-700 dark:text-gray-300">Telefone</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">(11) 98765-4321</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">(XX) XXXXX-XXXX</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Supressão total</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="text-gray-700 dark:text-gray-300">Diagnóstico</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Hipertensão Arterial Grau 2</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Doença cardiovascular</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">Generalização</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
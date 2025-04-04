/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/organisms/input';
import { Label } from '@/components/ui/organisms/label';
import { Textarea } from '@/components/ui/organisms/textarea';
import { Badge } from '@/components/ui/organisms/badge';
import { Button } from '@/components/ui/organisms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import {
  Building,
  Search,
  UserPlus,
  X,
  Check,
  MapPin
} from 'lucide-react';
import { IPaymentCard } from '@/types/payment-types';

interface CardDepartmentInfoProps {
  formData: Partial<IPaymentCard>;
  updateFormField: (path: string, value: any) => void;
  errors: Record<string, string>;
}

// Simulação de departamentos para o exemplo
const mockDepartments = [
  { id: 'dept-001', name: 'Administração', code: 'ADM', manager: 'Carlos Mendes' },
  { id: 'dept-002', name: 'Suprimentos', code: 'SUP', manager: 'Ana Silva' },
  { id: 'dept-003', name: 'Farmácia', code: 'FAR', manager: 'Pedro Almeida' },
  { id: 'dept-004', name: 'Tecnologia', code: 'TEC', manager: 'Fernanda Costa' },
  { id: 'dept-005', name: 'Centro Cirúrgico', code: 'CIR', manager: 'João Santos' },
  { id: 'dept-006', name: 'Enfermaria', code: 'ENF', manager: 'Marta Oliveira' },
  { id: 'dept-007', name: 'Laboratório', code: 'LAB', manager: 'Ricardo Sousa' },
  { id: 'dept-008', name: 'Radiologia', code: 'RAD', manager: 'Luiza Ferreira' }
];

export const CardDepartmentInfo: React.FC<CardDepartmentInfoProps> = ({
  formData,
  updateFormField,
  errors
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState(mockDepartments);
  
  // Endereço de cobrança
  const billingAddress = formData.billingAddress || {};
  
  // Filtrar departamentos com base na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDepartments(mockDepartments);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mockDepartments.filter(dept => 
      dept.name.toLowerCase().includes(query) || 
      dept.code.toLowerCase().includes(query)
    );
    
    setFilteredDepartments(filtered);
  }, [searchQuery]);
  
  // Obter detalhes do departamento
  const selectedDepartment = formData.departmentId ? 
    mockDepartments.find(dept => dept.id === formData.departmentId) : null;
  
  // Atualizar endereço de cobrança
  const updateBillingAddress = (field: string, value: string) => {
    const updatedAddress = { ...billingAddress, [field]: value };
    updateFormField('billingAddress', updatedAddress);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Departamento Responsável
        </h3>
        
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="departmentSearch" className={`text-gray-700 dark:text-gray-300 ${errors['departmentId'] ? 'text-red-500 dark:text-red-400' : ''}`}>
              Pesquisar Departamento
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                id="departmentSearch"
                placeholder="Nome ou código do departamento"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-1">
            {filteredDepartments.map(dept => (
              <div 
                key={dept.id}
                onClick={() => {
                  updateFormField('departmentId', dept.id);
                  updateFormField('departmentName', dept.name);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.departmentId === dept.id
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">{dept.name}</span>
                  </div>
                  {formData.departmentId === dept.id && (
                    <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Código: {dept.code}</span>
                  <span className="text-gray-500 dark:text-gray-400">Gestor: {dept.manager}</span>
                </div>
              </div>
            ))}
            
            {filteredDepartments.length === 0 && (
              <div className="col-span-2 p-6 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Building className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum departamento encontrado com &quot;{searchQuery}&quot;.
                </p>
                <Button
                  variant="link"
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Adicionar Novo Departamento
                </Button>
              </div>
            )}
          </div>
          
          {errors['departmentId'] && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-1">
              {errors['departmentId']}
            </p>
          )}
          
          {selectedDepartment && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Departamento Selecionado: {selectedDepartment.name} ({selectedDepartment.code})
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-300 mt-1 text-sm">
                Gestor: {selectedDepartment.manager}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Endereço de Cobrança
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-gray-700 dark:text-gray-300">
              Logradouro
            </Label>
            <Input
              id="street"
              value={billingAddress.street || ''}
              onChange={(e) => updateBillingAddress('street', e.target.value)}
              placeholder="Av. Principal"
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-gray-700 dark:text-gray-300">
                Número
              </Label>
              <Input
                id="number"
                value={billingAddress.number || ''}
                onChange={(e) => updateBillingAddress('number', e.target.value)}
                placeholder="123"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="complement" className="text-gray-700 dark:text-gray-300">
                Complemento
              </Label>
              <Input
                id="complement"
                value={billingAddress.complement || ''}
                onChange={(e) => updateBillingAddress('complement', e.target.value)}
                placeholder="Bloco A, Sala 101"
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-gray-700 dark:text-gray-300">
              Bairro
            </Label>
            <Input
              id="neighborhood"
              value={billingAddress.neighborhood || ''}
              onChange={(e) => updateBillingAddress('neighborhood', e.target.value)}
              placeholder="Centro"
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
              Cidade
            </Label>
            <Input
              id="city"
              value={billingAddress.city || ''}
              onChange={(e) => updateBillingAddress('city', e.target.value)}
              placeholder="São Paulo"
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">
              Estado
            </Label>
            <Select
              value={billingAddress.state || ''}
              onValueChange={(value) => updateBillingAddress('state', value)}
            >
              <SelectTrigger id="state" className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="AC" className="text-gray-800 dark:text-gray-200">Acre</SelectItem>
                <SelectItem value="AL" className="text-gray-800 dark:text-gray-200">Alagoas</SelectItem>
                <SelectItem value="AP" className="text-gray-800 dark:text-gray-200">Amapá</SelectItem>
                <SelectItem value="AM" className="text-gray-800 dark:text-gray-200">Amazonas</SelectItem>
                <SelectItem value="BA" className="text-gray-800 dark:text-gray-200">Bahia</SelectItem>
                <SelectItem value="CE" className="text-gray-800 dark:text-gray-200">Ceará</SelectItem>
                <SelectItem value="DF" className="text-gray-800 dark:text-gray-200">Distrito Federal</SelectItem>
                <SelectItem value="ES" className="text-gray-800 dark:text-gray-200">Espírito Santo</SelectItem>
                <SelectItem value="GO" className="text-gray-800 dark:text-gray-200">Goiás</SelectItem>
                <SelectItem value="MA" className="text-gray-800 dark:text-gray-200">Maranhão</SelectItem>
                <SelectItem value="MT" className="text-gray-800 dark:text-gray-200">Mato Grosso</SelectItem>
                <SelectItem value="MS" className="text-gray-800 dark:text-gray-200">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG" className="text-gray-800 dark:text-gray-200">Minas Gerais</SelectItem>
                <SelectItem value="PA" className="text-gray-800 dark:text-gray-200">Pará</SelectItem>
                <SelectItem value="PB" className="text-gray-800 dark:text-gray-200">Paraíba</SelectItem>
                <SelectItem value="PR" className="text-gray-800 dark:text-gray-200">Paraná</SelectItem>
                <SelectItem value="PE" className="text-gray-800 dark:text-gray-200">Pernambuco</SelectItem>
                <SelectItem value="PI" className="text-gray-800 dark:text-gray-200">Piauí</SelectItem>
                <SelectItem value="RJ" className="text-gray-800 dark:text-gray-200">Rio de Janeiro</SelectItem>
                <SelectItem value="RN" className="text-gray-800 dark:text-gray-200">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS" className="text-gray-800 dark:text-gray-200">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO" className="text-gray-800 dark:text-gray-200">Rondônia</SelectItem>
                <SelectItem value="RR" className="text-gray-800 dark:text-gray-200">Roraima</SelectItem>
                <SelectItem value="SC" className="text-gray-800 dark:text-gray-200">Santa Catarina</SelectItem>
                <SelectItem value="SP" className="text-gray-800 dark:text-gray-200">São Paulo</SelectItem>
                <SelectItem value="SE" className="text-gray-800 dark:text-gray-200">Sergipe</SelectItem>
                <SelectItem value="TO" className="text-gray-800 dark:text-gray-200">Tocantins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300">
              CEP
            </Label>
            <Input
              id="zipCode"
              value={billingAddress.zipCode || ''}
              onChange={(e) => updateBillingAddress('zipCode', e.target.value)}
              placeholder="00000-000"
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
              País
            </Label>
            <Input
              id="country"
              value={billingAddress.country || 'Brasil'}
              onChange={(e) => updateBillingAddress('country', e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
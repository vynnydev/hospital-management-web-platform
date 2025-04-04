/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/organisms/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/organisms/tabs';
import {
  CreditCard,
  UserCheck,
  Shield,
  ShoppingBag,
  Wallet,
  Save,
  AlertTriangle
} from 'lucide-react';

import { CardBrand, CardStatus, CardType, ExpenseCategory, IPaymentCard } from '@/types/payment-types';
import { validateCardData } from '@/utils/paymentValidation';

import { CardBasicInfo } from './card-form/CardBasicInfo';
import { CardDepartmentInfo } from './card-form/CardDepartmentInfo';
import { CardSecurityConfig } from './card-form/CardSecurityConfig';
import { CardUsageConfig } from './card-form/CardUsageConfig';
import { CardLimitsConfig } from './card-form/CardLimitsConfig';

interface AddEditCardProps {
  cardData?: IPaymentCard;
  onSubmit: (data: Partial<IPaymentCard>) => Promise<void>;
}

export const defaultCardData: Partial<IPaymentCard> = {
  cardHolderName: '',
  cardType: 'corporate' as CardType,
  cardBrand: 'mastercard' as CardBrand,
  expiryDate: '',
  status: 'pending_activation' as CardStatus,
  isDefault: false,
  securitySettings: {
    requiresPin: true,
    requires2FA: true,
    allowOnlineTransactions: true,
    allowInternationalTransactions: false,
    transactionApprovalThreshold: 5000,
    allowedApprovers: [],
    maxDailyTransactionAmount: 10000,
    maxMonthlyTransactionAmount: 50000
  },
  usageRestrictions: {
    allowedCategories: ['medical_supplies' as ExpenseCategory, 'pharmaceuticals' as ExpenseCategory],
    restrictedMerchants: [],
    allowedDaysOfWeek: [1, 2, 3, 4, 5]
  },
  creditLimit: 20000,
  availableBalance: 20000,
  colorScheme: 'gradient-blue'
};

export const AddEditCard: React.FC<AddEditCardProps> = ({ cardData, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<IPaymentCard>>(defaultCardData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [validationKey, setValidationKey] = useState<string | null>(null);
  
  const isEditMode = Boolean(cardData);
  
  // Inicializar o formulário com os dados do cartão caso seja edição
  useEffect(() => {
    if (cardData) {
      setFormData(cardData);
    }
  }, [cardData]);
  
  // Atualizar estado do formulário
  const updateFormField = (path: string, value: any) => {
    setFormData(prev => {
      // Constrói um objeto aninhado a partir do caminho
      const keys = path.split('.');
      const result = { ...prev };
      
      let current: any = result;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return result;
    });
    
    // Se houver erro para o campo atualizado, limpa o erro
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };
  
  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors = validateCardData(formData);
    setErrors(newErrors);
    setValidationKey(Object.keys(newErrors)[0] || null);
    
    // Mudar para a aba que contém o primeiro erro
    if (validationKey) {
      if (validationKey.startsWith('cardHolderName') || 
          validationKey.startsWith('cardType') || 
          validationKey.startsWith('expiryDate')) {
        setActiveTab('basic');
      } else if (validationKey.startsWith('departmentId')) {
        setActiveTab('department');
      } else if (validationKey.startsWith('securitySettings')) {
        setActiveTab('security');
      } else if (validationKey.startsWith('usageRestrictions')) {
        setActiveTab('usage');
      } else if (validationKey.startsWith('creditLimit')) {
        setActiveTab('limits');
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">Erros no formulário</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            Por favor, corrija os erros antes de continuar.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="p-0 bg-transparent h-auto">
              <TabsTrigger 
                value="basic" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'basic' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Básico
              </TabsTrigger>
              
              <TabsTrigger 
                value="department" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'department' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Departamento
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'security' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              
              <TabsTrigger 
                value="usage" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'usage' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Restrições
              </TabsTrigger>
              
              <TabsTrigger 
                value="limits" 
                className={`py-3 px-4 rounded-none border-b-2 ${
                  activeTab === 'limits' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Limites
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="basic" className="mt-0">
              <CardBasicInfo 
                formData={formData} 
                updateFormField={updateFormField}
                errors={errors}
                isEditMode={isEditMode}
              />
            </TabsContent>
            
            <TabsContent value="department" className="mt-0">
              <CardDepartmentInfo 
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <CardSecurityConfig 
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="usage" className="mt-0">
              <CardUsageConfig 
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />
            </TabsContent>
            
            <TabsContent value="limits" className="mt-0">
              <CardLimitsConfig 
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving 
            ? (isEditMode ? 'Atualizando...' : 'Criando...') 
            : (isEditMode ? 'Atualizar Cartão' : 'Criar Cartão')
          }
        </Button>
      </div>
    </form>
  );
};
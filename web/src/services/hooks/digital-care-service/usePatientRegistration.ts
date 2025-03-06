import { useState } from 'react';
import { IPatientRegistration } from '@/types/patient-types';
import { usePatientManagement } from './usePatientManagement';
import { useInsuranceData } from './useInsuranceData';
import { useSUSIntegration } from './useSUSIntegration';

export const usePatientRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { addPatient } = usePatientManagement();
  const { validateInsurance } = useInsuranceData();
  const { validateSUSCard, getSUSPatientInfo } = useSUSIntegration();

  // Validar dados do paciente
  const validatePatientData = (data: Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>): boolean => {
    const errors: Record<string, string> = {};

    // Validar informações pessoais
    if (!data.personalInfo.name) {
      errors['personalInfo.name'] = 'Nome é obrigatório';
    }

    if (!data.personalInfo.birthDate) {
      errors['personalInfo.birthDate'] = 'Data de nascimento é obrigatória';
    }

    if (!data.personalInfo.cpf) {
      errors['personalInfo.cpf'] = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(data.personalInfo.cpf.replace(/[.-]/g, ''))) {
      errors['personalInfo.cpf'] = 'CPF inválido';
    }

    // Validar informações de contato
    if (!data.contactInfo.phone) {
      errors['contactInfo.phone'] = 'Telefone é obrigatório';
    }

    if (!data.contactInfo.address.street) {
      errors['contactInfo.address.street'] = 'Endereço é obrigatório';
    }

    if (!data.contactInfo.address.city) {
      errors['contactInfo.address.city'] = 'Cidade é obrigatória';
    }

    if (!data.contactInfo.address.state) {
      errors['contactInfo.address.state'] = 'Estado é obrigatório';
    }

    if (!data.contactInfo.address.zipCode) {
      errors['contactInfo.address.zipCode'] = 'CEP é obrigatório';
    }

    // Validar contato de emergência
    if (!data.contactInfo.emergencyContact.name) {
      errors['contactInfo.emergencyContact.name'] = 'Nome do contato de emergência é obrigatório';
    }

    if (!data.contactInfo.emergencyContact.phone) {
      errors['contactInfo.emergencyContact.phone'] = 'Telefone do contato de emergência é obrigatório';
    }

    // Atualizar erros de validação
    setValidationErrors(errors);

    // Retorna true se não houver erros
    return Object.keys(errors).length === 0;
  };

  // Registrar paciente
  const registerPatient = async (
    data: Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>
  ): Promise<IPatientRegistration | null> => {
    try {
      setIsSubmitting(true);

      // Validar dados do paciente
      if (!validatePatientData(data)) {
        return null;
      }

      // Validar convênio ou SUS, se aplicável
      if (data.insuranceInfo.type === 'Convênio' && data.insuranceInfo.insuranceDetails) {
        const isValid = await validateInsurance(
          data.insuranceInfo.insuranceDetails.id,
          data.personalInfo.cpf
        );

        if (!isValid) {
          setValidationErrors(prev => ({
            ...prev,
            'insuranceInfo.insuranceDetails.id': 'Convênio inválido para este paciente'
          }));
          return null;
        }
      } else if (data.insuranceInfo.type === 'SUS' && data.insuranceInfo.susInfo) {
        const isValid = await validateSUSCard(data.insuranceInfo.susInfo.cartaoSUS);

        if (!isValid) {
          setValidationErrors(prev => ({
            ...prev,
            'insuranceInfo.susInfo.cartaoSUS': 'Cartão SUS inválido'
          }));
          return null;
        }
      }

      // Registrar paciente
      const newPatient = await addPatient(data);
      return newPatient;
    } catch (error) {
      console.error('Erro ao registrar paciente:', error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preencher dados do paciente a partir do cartão SUS
  const fillPatientFromSUS = async (cardNumber: string): Promise<Partial<IPatientRegistration> | null> => {
    try {
      const susInfo = await getSUSPatientInfo(cardNumber);
      
      if (!susInfo) return null;
      
      return {
        personalInfo: {
          name: susInfo.name,
          birthDate: susInfo.birthDate,
          cpf: susInfo.cpf,
          gender: 'Outro', // O SUS não fornece gênero, então definimos um valor padrão
          nationality: 'Brasileira',
          bloodType: undefined, // O SUS não fornece tipo sanguíneo
        },
        insuranceInfo: {
          type: 'SUS',
          susInfo: {
            cartaoSUS: susInfo.cardNumber,
            dataEmissao: susInfo.issueDate,
            municipioEmissao: susInfo.municipality,
            ufEmissao: susInfo.state
          }
        }
      };
    } catch (error) {
      console.error('Erro ao buscar dados do paciente no SUS:', error);
      return null;
    }
  };

  return {
    isSubmitting,
    validationErrors,
    registerPatient,
    fillPatientFromSUS,
    validatePatientData
  };
};
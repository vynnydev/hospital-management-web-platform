import { useState } from 'react';
import { usePatientRegistration } from '@/hooks/digital-care-service/usePatientRegistration';
import PatientPersonalInfo from './PatientPersonalInfo';
import PatientContactInfo from './PatientContactInfo';
import PatientInsuranceInfo from './PatientInsuranceInfo';
import PatientMedicalInfo from './PatientMedicalInfo';
import { IPatientRegistration } from '@/types/patient-types';
import { toast } from '@/components/ui/molecules/Toast';

type RegistrationStep = 'personal' | 'contact' | 'insurance' | 'medical' | 'review';

interface PatientRegistrationContainerProps {
  hospitalId: string;  // Adicionado hospitalId como prop
  hospitalName?: string;  // Nome do hospital opcional para exibição
  onSuccess?: (patientId: string) => void;
}

export default function PatientRegistrationContainer({ 
  hospitalId, 
  hospitalName, 
  onSuccess 
}: PatientRegistrationContainerProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
  const [patientData, setPatientData] = useState<Partial<IPatientRegistration>>({
    personalInfo: {
      name: '',
      birthDate: '',
      gender: 'Outro',
      cpf: '',
      nationality: 'Brasileira',
    },
    contactInfo: {
      phone: '',
      cellphone: '',
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
    },
    medicalInfo: {
      allergies: [],
      chronicConditions: [],
      medications: [],
      previousSurgeries: [],
    },
    insuranceInfo: {
      type: 'Particular',
    },
    hospitalId: hospitalId, // Adicionando o hospitalId aos dados do paciente
  });

  const { 
    isSubmitting, 
    validationErrors, 
    registerPatient, 
    fillPatientFromSUS 
  } = usePatientRegistration();
  
  // Funções de manipulação e envio permanecem as mesmas
  const handleNext = () => {
    const steps: RegistrationStep[] = ['personal', 'contact', 'insurance', 'medical', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: RegistrationStep[] = ['personal', 'contact', 'insurance', 'medical', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handlePersonalInfoChange = (data: Partial<IPatientRegistration['personalInfo']>) => {
    setPatientData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo!,
        ...data
      }
    }));
  };

  const handleContactInfoChange = (data: Partial<IPatientRegistration['contactInfo']>) => {
    setPatientData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        ...data
      }
    }));
  };

  const handleInsuranceInfoChange = (data: Partial<IPatientRegistration['insuranceInfo']>) => {
    setPatientData(prev => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo!,
        ...data
      }
    }));
  };

  const handleMedicalInfoChange = (data: Partial<IPatientRegistration['medicalInfo']>) => {
    setPatientData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo!,
        ...data
      }
    }));
  };

  const handleFillFromSUS = async (cardNumber: string) => {
    const susData = await fillPatientFromSUS(cardNumber);
    
    if (susData) {
      setPatientData(prev => ({
        ...prev,
        ...susData,
        hospitalId: hospitalId, // Mantém o hospitalId mesmo ao preencher dados do SUS
      }));
      toast.success('Dados do SUS carregados com sucesso!');
    } else {
      toast.error('Não foi possível carregar os dados do SUS.');
    }
  };

  const handleSubmit = async () => {
    try {
      // Converte o patientData parcial para o formato completo necessário para registro
      const completeData = {
        ...patientData,
        hospitalId, // Garante que o hospitalId esteja atualizado
      } as Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>;
      
      const result = await registerPatient(completeData);
      
      if (result) {
        toast.success('Paciente registrado com sucesso!');
        
        // Chamar callback de sucesso, se fornecido
        if (onSuccess && result.id) {
          onSuccess(result.id);
        }
        
        // Limpar formulário
        setPatientData({
          personalInfo: {
            name: '',
            birthDate: '',
            gender: 'Outro',
            cpf: '',
            nationality: 'Brasileira',
          },
          contactInfo: {
            phone: '',
            cellphone: '',
            address: {
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              state: '',
              zipCode: '',
            },
            emergencyContact: {
              name: '',
              phone: '',
              relationship: '',
            },
          },
          medicalInfo: {
            allergies: [],
            chronicConditions: [],
            medications: [],
            previousSurgeries: [],
          },
          insuranceInfo: {
            type: 'Particular',
          },
          hospitalId: hospitalId, // Manter o hospitalId após limpar formulário
        });
        
        setCurrentStep('personal');
      }
    } catch (error) {
      toast.error('Erro ao registrar paciente.');
      console.error('Erro ao registrar paciente:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-8xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary-900 dark:text-primary-400">Registro de Paciente</h1>
      
      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex items-center">
          {['Dados Pessoais', 'Contato', 'Convênio', 'Saúde', 'Revisão'].map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['personal', 'contact', 'insurance', 'medical', 'review'][index] === currentStep
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`h-1 w-16 ${
                  index < ['personal', 'contact', 'insurance', 'medical', 'review'].indexOf(currentStep)
                    ? 'bg-primary-600 dark:bg-primary-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Formulário de Etapas */}
      <div className="mb-8">
        {currentStep === 'personal' && (
          <PatientPersonalInfo 
            data={patientData.personalInfo!} 
            onChange={handlePersonalInfoChange}
            errors={validationErrors}
            hospitalId={hospitalId}
            hospitalName={hospitalName}
          />
        )}
        
        {currentStep === 'contact' && (
          <PatientContactInfo 
            data={patientData.contactInfo!} 
            onChange={handleContactInfoChange}
            errors={validationErrors}
          />
        )}
        
        {currentStep === 'insurance' && (
          <PatientInsuranceInfo 
            data={patientData.insuranceInfo!}
            onChange={handleInsuranceInfoChange}
            onFillFromSUS={handleFillFromSUS}
            errors={validationErrors}
          />
        )}
        
        {currentStep === 'medical' && (
          <PatientMedicalInfo 
            data={patientData.medicalInfo!}
            onChange={handleMedicalInfoChange}
            errors={validationErrors}
          />
        )}
        
        {currentStep === 'review' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Revisão de Dados</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Dados Pessoais</h3>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Nome:</span> {patientData.personalInfo?.name}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">CPF:</span> {patientData.personalInfo?.cpf}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Data de Nascimento:</span> {patientData.personalInfo?.birthDate}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Gênero:</span> {patientData.personalInfo?.gender}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Contato</h3>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Telefone:</span> {patientData.contactInfo?.phone}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Celular:</span> {patientData.contactInfo?.cellphone}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Endereço:</span> {patientData.contactInfo?.address.street}, {patientData.contactInfo?.address.number}, {patientData.contactInfo?.address.city} - {patientData.contactInfo?.address.state}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Convênio</h3>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Tipo:</span> {patientData.insuranceInfo?.type}</p>
                {patientData.insuranceInfo?.type === 'Convênio' && patientData.insuranceInfo?.insuranceDetails && (
                  <>
                    <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Nome do Convênio:</span> {patientData.insuranceInfo.insuranceDetails.name}</p>
                    <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Número do Cartão:</span> {patientData.insuranceInfo.insuranceDetails.cardNumber}</p>
                  </>
                )}
                {patientData.insuranceInfo?.type === 'SUS' && patientData.insuranceInfo?.susInfo && (
                  <>
                    <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Cartão SUS:</span> {patientData.insuranceInfo.susInfo.cartaoSUS}</p>
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Informações Médicas</h3>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Alergias:</span> {patientData.medicalInfo?.allergies.join(', ') || 'Nenhuma'}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Condições Crônicas:</span> {patientData.medicalInfo?.chronicConditions.join(', ') || 'Nenhuma'}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Medicamentos em Uso:</span> {patientData.medicalInfo?.medications.join(', ') || 'Nenhum'}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Cirurgias Anteriores:</span> {patientData.medicalInfo?.previousSurgeries.join(', ') || 'Nenhuma'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Botões de Navegação */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 'personal'}
          className={`px-4 py-2 rounded-md ${
            currentStep === 'personal'
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Anterior
        </button>
        
        {currentStep !== 'review' ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600"
          >
            Próximo
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting
                ? 'bg-primary-400 dark:bg-primary-500 cursor-not-allowed'
                : 'bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Finalizar Registro'}
          </button>
        )}
      </div>

      {/* Card de Hospital */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Hospital de Registro</h4>
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-200">{hospitalName || 'Hospital não especificado'}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">ID: {hospitalId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
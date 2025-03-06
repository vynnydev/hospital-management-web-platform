import { useState } from 'react';
import { usePatientRegistration } from '@/services/hooks/digital-care-service/usePatientRegistration';
import PatientPersonalInfo from './PatientPersonalInfo';
import PatientContactInfo from './PatientContactInfo';
import PatientInsuranceInfo from './PatientInsuranceInfo';
import PatientMedicalInfo from './PatientMedicalInfo';
import { IPatientRegistration } from '@/types/patient-types';
import { toast } from '@/components/ui/molecules/Toast';

type RegistrationStep = 'personal' | 'contact' | 'insurance' | 'medical' | 'review';

export default function PatientRegistrationContainer() {
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
  });

  const { 
    isSubmitting, 
    validationErrors, 
    registerPatient, 
    fillPatientFromSUS 
  } = usePatientRegistration();

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
        ...susData
      }));
      toast.success('Dados do SUS carregados com sucesso!');
    } else {
      toast.error('Não foi possível carregar os dados do SUS.');
    }
  };

  const handleSubmit = async () => {
    try {
      // Converte o patientData parcial para o formato completo necessário para registro
      const completeData = patientData as Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>;
      
      const result = await registerPatient(completeData);
      
      if (result) {
        toast.success('Paciente registrado com sucesso!');
        // Limpar formulário ou redirecionar para outra página
      }
    } catch (error) {
      toast.error('Erro ao registrar paciente.');
      console.error('Erro ao registrar paciente:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary-900">Registro de Paciente</h1>
      
      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex items-center">
          {['Dados Pessoais', 'Contato', 'Convênio', 'Saúde', 'Revisão'].map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['personal', 'contact', 'insurance', 'medical', 'review'][index] === currentStep
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`h-1 w-16 ${
                  index < ['personal', 'contact', 'insurance', 'medical', 'review'].indexOf(currentStep)
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
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
            <h2 className="text-xl font-semibold mb-4">Revisão de Dados</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Dados Pessoais</h3>
                <p><span className="font-medium">Nome:</span> {patientData.personalInfo?.name}</p>
                <p><span className="font-medium">CPF:</span> {patientData.personalInfo?.cpf}</p>
                <p><span className="font-medium">Data de Nascimento:</span> {patientData.personalInfo?.birthDate}</p>
                <p><span className="font-medium">Gênero:</span> {patientData.personalInfo?.gender}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Contato</h3>
                <p><span className="font-medium">Telefone:</span> {patientData.contactInfo?.phone}</p>
                <p><span className="font-medium">Celular:</span> {patientData.contactInfo?.cellphone}</p>
                <p><span className="font-medium">Endereço:</span> {patientData.contactInfo?.address.street}, {patientData.contactInfo?.address.number}, {patientData.contactInfo?.address.city} - {patientData.contactInfo?.address.state}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Convênio</h3>
                <p><span className="font-medium">Tipo:</span> {patientData.insuranceInfo?.type}</p>
                {patientData.insuranceInfo?.type === 'Convênio' && patientData.insuranceInfo?.insuranceDetails && (
                  <>
                    <p><span className="font-medium">Nome do Convênio:</span> {patientData.insuranceInfo.insuranceDetails.name}</p>
                    <p><span className="font-medium">Número do Cartão:</span> {patientData.insuranceInfo.insuranceDetails.cardNumber}</p>
                  </>
                )}
                {patientData.insuranceInfo?.type === 'SUS' && patientData.insuranceInfo?.susInfo && (
                  <>
                    <p><span className="font-medium">Cartão SUS:</span> {patientData.insuranceInfo.susInfo.cartaoSUS}</p>
                  </>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Informações Médicas</h3>
                <p><span className="font-medium">Alergias:</span> {patientData.medicalInfo?.allergies.join(', ') || 'Nenhuma'}</p>
                <p><span className="font-medium">Condições Crônicas:</span> {patientData.medicalInfo?.chronicConditions.join(', ') || 'Nenhuma'}</p>
                <p><span className="font-medium">Medicamentos em Uso:</span> {patientData.medicalInfo?.medications.join(', ') || 'Nenhum'}</p>
                <p><span className="font-medium">Cirurgias Anteriores:</span> {patientData.medicalInfo?.previousSurgeries.join(', ') || 'Nenhuma'}</p>
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
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Anterior
        </button>
        
        {currentStep !== 'review' ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Finalizar Registro'}
          </button>
        )}
      </div>
    </div>
  );
}
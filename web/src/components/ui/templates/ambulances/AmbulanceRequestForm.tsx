/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  Phone, 
  User, 
  MapPin,  
  Ambulance, 
  X, 
  Search,
} from 'lucide-react';
import { 
  IAmbulanceRequest, 
  IAmbulance, 
  TEmergengyLevel 
} from '@/types/ambulance-types';

interface IAmbulanceRequestFormProps {
  onSubmit: (request: Omit<IAmbulanceRequest, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  onClose: () => void;
  availableAmbulances: IAmbulance[];
  isSubmitting: boolean;
}

export const AmbulanceRequestForm: React.FC<IAmbulanceRequestFormProps> = ({
  onSubmit,
  onClose,
  availableAmbulances,
  isSubmitting
}) => {
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | undefined>();
  const [patientGender, setPatientGender] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [condition, setCondition] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState<TEmergengyLevel>('medium');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const emergencyLevelOptions = [
    { value: 'low', label: 'Baixa', color: '#60A5FA' },
    { value: 'medium', label: 'Média', color: '#FBBF24' },
    { value: 'high', label: 'Alta', color: '#F59E0B' },
    { value: 'critical', label: 'Crítica', color: '#EF4444' }
  ];

  // Função para validar o formulário
  const validateForm = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!callerName.trim()) {
        errors.callerName = 'Nome do solicitante é obrigatório';
      }
      
      if (!callerPhone.trim()) {
        errors.callerPhone = 'Telefone do solicitante é obrigatório';
      } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(callerPhone)) {
        errors.callerPhone = 'Formato inválido. Use (XX) XXXXX-XXXX';
      }
      
      if (!address.trim()) {
        errors.address = 'Endereço é obrigatório';
      }
    }
    
    if (currentStep === 2) {
      if (condition.trim().length < 5) {
        errors.condition = 'Descreva a condição do paciente (min. 5 caracteres)';
      }
      
      if (symptoms.length === 0) {
        errors.symptoms = 'Informe pelo menos um sintoma';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Avança para o próximo passo ou submete o formulário
  const handleNext = () => {
    if (validateForm(step)) {
      if (step < 2) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Voltar para o passo anterior
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Adicionar sintoma à lista
  const addSymptom = () => {
    if (symptomInput.trim()) {
      if (!symptoms.includes(symptomInput)) {
        setSymptoms([...symptoms, symptomInput]);
      }
      setSymptomInput('');
    }
  };

  // Remover sintoma da lista
  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  // Submeter formulário
  const handleSubmit = async () => {
    if (!validateForm(step)) return;
    
    try {
      await onSubmit({
        callerName,
        callerPhone,
        location: {
          address,
          coordinates: { lat: -23.5629, lng: -46.6544 } // Exemplo: Av. Paulista
        },
        patientInfo: {
          name: patientName,
          age: patientAge,
          gender: patientGender,
          symptoms,
          condition,
          emergencyLevel
        },
        notes
      });
      
      // Resetar formulário após envio bem-sucedido
      onClose();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      // Se necessário, adicionar tratamento de erro aqui
    }
  };

  // Renderiza os passos do formulário
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center border-b pb-2">
              <Phone className="mr-2" size={18} />
              Dados do Chamado
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Solicitante *
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className={`w-full p-2 border rounded-md ${validationErrors.callerName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nome completo"
              />
              {validationErrors.callerName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.callerName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="text"
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className={`w-full p-2 border rounded-md ${validationErrors.callerPhone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="(XX) XXXXX-XXXX"
              />
              {validationErrors.callerPhone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.callerPhone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço da Ocorrência *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full p-2 border rounded-md pl-8 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Endereço completo"
                />
                <MapPin 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
              {validationErrors.address && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
              )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center border-b pb-2">
              <User className="mr-2" size={18} />
              Dados do Paciente
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nome do paciente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  value={patientAge || ''}
                  onChange={(e) => setPatientAge(e.target.valueAsNumber)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Idade"
                  min={0}
                  max={120}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gênero
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condição/Situação *
              </label>
              <textarea
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className={`w-full p-2 border rounded-md h-20 ${validationErrors.condition ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Descreva a condição atual do paciente"
              />
              {validationErrors.condition && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.condition}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sintomas *
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                  className={`flex-1 p-2 border rounded-l-md ${validationErrors.symptoms ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Adicionar sintoma"
                />
                <button
                  type="button"
                  onClick={addSymptom}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-r-md flex items-center"
                >
                  <Search size={16} />
                </button>
              </div>
              {validationErrors.symptoms && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.symptoms}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {symptoms.map((symptom, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    <span>{symptom}</span>
                    <button
                      type="button"
                      onClick={() => removeSymptom(index)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Urgência *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {emergencyLevelOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEmergencyLevel(option.value as TEmergengyLevel)}
                    className={`
                      p-2 rounded-md flex flex-col items-center justify-center border 
                      ${emergencyLevel === option.value ? 
                        'border-2 border-blue-500 bg-blue-50' : 
                        'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mb-1" 
                      style={{ backgroundColor: option.color }} 
                    />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-16"
                placeholder="Informações adicionais relevantes"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Ambulance className="mr-2" size={20} />
          Nova Solicitação de Ambulância
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4">
        {/* Indicador de passos */}
        <div className="flex items-center mb-6">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full 
            ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
          `}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full 
            ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
          `}>
            2
          </div>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            )}
            
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className={`
                px-4 py-2 text-sm text-white rounded-md transition flex items-center
                ${isSubmitting ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-blue-500 hover:bg-blue-600'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processando...
                </>
              ) : step < 2 ? (
                <>Próximo</>
              ) : (
                <>Enviar Solicitação</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
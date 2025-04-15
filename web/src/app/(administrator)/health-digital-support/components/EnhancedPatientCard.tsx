import { useState } from 'react';
import { IPatientRegistration } from '@/types/patient-types';
import { usePatientManagement } from '@/hooks/digital-care-service/usePatientManagement';
import Link from 'next/link';
import InsuranceCard from './InsuranceCard';
import PatientStatusBadge from './PatientStatusBadge';
import PatientCardOptions from './PatientCardOptions';
import PatientAIAnalysis from './PatientAIAnalysis';
import FaceRecognitionBadge from './FaceRecognitionBadge';
import Image from 'next/image';

interface EnhancedPatientCardProps {
  patient: IPatientRegistration;
  onSelectForAssignment?: (patientId: string, admissionId: string) => void;
}

export default function EnhancedPatientCard({ patient, onSelectForAssignment }: EnhancedPatientCardProps) {
  const { getPatientAdmissions } = usePatientManagement();
  const [expanded, setExpanded] = useState(false);
  const [showInsuranceCard, setShowInsuranceCard] = useState(false);
  
  // Buscar admissões do paciente
  const admissions = getPatientAdmissions(patient.id || '');
  const latestAdmission = admissions.length > 0 
    ? admissions.sort((a, b) => 
        new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
      )[0] 
    : null;
  
  // Calcular idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const age = patient.personalInfo.birthDate 
    ? calculateAge(patient.personalInfo.birthDate) 
    : null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div 
        className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer relative"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              {patient.personalInfo.photo ? (
                <Image 
                  src={patient.personalInfo.photo} 
                  alt={patient.personalInfo.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-xl font-medium">
                  {getInitials(patient.personalInfo.name)}
                </span>
              )}
            </div>
            
            {/* Ícone de reconhecimento facial */}
            <FaceRecognitionBadge patientId={patient.id || ''} />
          </div>
          
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{patient.personalInfo.name}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-x-2">
              <span>{patient.personalInfo.cpf}</span>
              <span>•</span>
              <span>
                {age ? `${age} anos` : 'Idade não informada'}
              </span>
              <span>•</span>
              <span>
                {patient.personalInfo.gender === 'M' ? 'Masculino' : 
                 patient.personalInfo.gender === 'F' ? 'Feminino' : 'Outro'}
              </span>
              {patient.personalInfo.bloodType && (
                <>
                  <span>•</span>
                  <span className="font-medium">{patient.personalInfo.bloodType}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-3 md:mt-0 flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            {/* Cartão de Convênio/SUS Toggle */}
            {(patient.insuranceInfo.type === 'Convênio' || patient.insuranceInfo.type === 'SUS') && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInsuranceCard(!showInsuranceCard);
                }}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {patient.insuranceInfo.type === 'Convênio' ? 'Convênio' : 'SUS'}
              </button>
            )}
            
            {latestAdmission && (
              <PatientStatusBadge 
                department={latestAdmission.departmentId || ''}
                status={latestAdmission.status}
              />
            )}
            
            <span className="text-gray-400 dark:text-gray-500">
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          </div>
          
          {/* Mostrar tempo de estadia para pacientes internados */}
          {latestAdmission && latestAdmission.status !== 'Alta' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 pr-8 pt-2">
              Internado há: {Math.ceil((new Date().getTime() - new Date(latestAdmission.admissionDate).getTime()) / (1000 * 60 * 60 * 24))} dias
            </div>
          )}
        </div>
        
        {/* Indicador para expandir */}
        <div className="absolute left-0 right-0 bottom-4 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded-t-md">
            {expanded ? "clique para recolher" : "clique para expandir"}
          </span>
        </div>
      </div>
      
      {/* Exibir cartão de convênio ou SUS */}
      {showInsuranceCard && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
          <InsuranceCard 
            patientName={patient.personalInfo.name}
            insuranceType={patient.insuranceInfo.type}
            insuranceData={
              patient.insuranceInfo.type === 'Convênio' 
                ? patient.insuranceInfo.insuranceDetails 
                : patient.insuranceInfo.type === 'SUS' 
                  ? patient.insuranceInfo.susInfo 
                  : undefined
            }
          />
        </div>
      )}
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-2 bg-gray-50 dark:bg-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informações Pessoais</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">CPF:</span> {patient.personalInfo.cpf}</li>
                <li><span className="font-medium">Data de Nascimento:</span> {new Date(patient.personalInfo.birthDate).toLocaleDateString('pt-BR')}</li>
                <li><span className="font-medium">Tipo Sanguíneo:</span> {patient.personalInfo.bloodType || 'Não informado'}</li>
                <li><span className="font-medium">Nacionalidade:</span> {patient.personalInfo.nationality}</li>
                {patient.personalInfo.maritalStatus && (
                  <li><span className="font-medium">Estado Civil:</span> {patient.personalInfo.maritalStatus}</li>
                )}
              </ul>
              
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Contato</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Telefone:</span> {patient.contactInfo.phone}</li>
                <li><span className="font-medium">Celular:</span> {patient.contactInfo.cellphone}</li>
                <li><span className="font-medium">Email:</span> {patient.contactInfo.email || 'Não informado'}</li>
                <li><span className="font-medium">Endereço:</span> {`${patient.contactInfo.address.street}, ${patient.contactInfo.address.number}, ${patient.contactInfo.address.city} - ${patient.contactInfo.address.state}`}</li>
                <li>
                  <span className="font-medium">Contato de Emergência:</span> {`${patient.contactInfo.emergencyContact.name} (${patient.contactInfo.emergencyContact.relationship}) - ${patient.contactInfo.emergencyContact.phone}`}
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Convênio</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Tipo:</span> {patient.insuranceInfo.type}</li>
                {patient.insuranceInfo.type === 'Convênio' && patient.insuranceInfo.insuranceDetails && (
                  <>
                    <li><span className="font-medium">Nome:</span> {patient.insuranceInfo.insuranceDetails.name}</li>
                    <li><span className="font-medium">Tipo de Plano:</span> {patient.insuranceInfo.insuranceDetails.planType}</li>
                    <li><span className="font-medium">Número do Cartão:</span> {patient.insuranceInfo.insuranceDetails.cardNumber}</li>
                  </>
                )}
                {patient.insuranceInfo.type === 'SUS' && patient.insuranceInfo.susInfo && (
                  <>
                    <li><span className="font-medium">Cartão SUS:</span> {patient.insuranceInfo.susInfo.cartaoSUS}</li>
                    <li><span className="font-medium">Emissão:</span> {new Date(patient.insuranceInfo.susInfo.dataEmissao).toLocaleDateString('pt-BR')}</li>
                    <li><span className="font-medium">Local de Emissão:</span> {patient.insuranceInfo.susInfo.municipioEmissao} - {patient.insuranceInfo.susInfo.ufEmissao}</li>
                  </>
                )}
              </ul>
              
              {latestAdmission && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Internação Atual</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li><span className="font-medium">Data de Admissão:</span> {new Date(latestAdmission.admissionDate).toLocaleDateString('pt-BR')}</li>
                    <li><span className="font-medium">Tipo:</span> {latestAdmission.admissionType}</li>
                    <li><span className="font-medium">Motivo:</span> {latestAdmission.entranceReason}</li>
                    <li><span className="font-medium">Diagnóstico:</span> {latestAdmission.initialDiagnosis || 'Não definido'}</li>
                    <li><span className="font-medium">Departamento:</span> {latestAdmission.departmentId || 'Não atribuído'}</li>
                    <li><span className="font-medium">Leito:</span> {latestAdmission.bedId || 'Não atribuído'}</li>
                    <li><span className="font-medium">Previsão de Alta:</span> {latestAdmission.expectedDischarge ? new Date(latestAdmission.expectedDischarge).toLocaleDateString('pt-BR') : 'Não definida'}</li>
                  </ul>
                </>
              )}
              
              {/* Exibir alertas médicos, se houver */}
              {(patient.medicalInfo?.allergies.length || patient.medicalInfo?.chronicConditions.length) > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-4 border-red-500 dark:border-red-600">
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Alertas Médicos</h4>
                  {patient.medicalInfo?.allergies.length > 0 && (
                    <p className="text-xs text-red-700 dark:text-red-300">
                      <span className="font-medium">Alergias:</span> {patient.medicalInfo.allergies.join(', ')}
                    </p>
                  )}
                  {patient.medicalInfo?.chronicConditions.length > 0 && (
                    <p className="text-xs text-red-700 dark:text-red-300">
                      <span className="font-medium">Condições Crônicas:</span> {patient.medicalInfo.chronicConditions.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Link
              href={`/pacientes/${patient.id}`}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors"
            >
              Ver Detalhes
            </Link>
            
            {latestAdmission && latestAdmission.status !== 'Alta' && (
              onSelectForAssignment ? (
                <button
                  type="button"
                  onClick={() => onSelectForAssignment(patient.id || '', latestAdmission.id)}
                  className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-md transition-colors"
                >
                  Atribuir
                </button>
              ) : (
                <Link
                  href={`/pacientes/atribuicao/${patient.id}?admissao=${latestAdmission.id}`}
                  className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-md transition-colors"
                >
                  Atribuir
                </Link>
              )
            )}
            
            {/* Opções adicionais */}
            <PatientCardOptions patientId={patient.id || ''} />
          </div>

          {/* Previsão de Inteligência Artificial */}
          <PatientAIAnalysis patientId={patient.id || ''} />
        </div>
      )}
    </div>
  );
}
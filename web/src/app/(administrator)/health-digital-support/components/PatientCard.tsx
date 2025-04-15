import { useState } from 'react';
import { IPatientRegistration } from '@/types/patient-types';
import { usePatientManagement } from '@/hooks/digital-care-service/usePatientManagement';
import Link from 'next/link';
import Image from 'next/image';

interface PatientCardProps {
  patient: IPatientRegistration;
  onSelectForAssignment?: (patientId: string, admissionId: string) => void;
}

export default function PatientCard({ patient, onSelectForAssignment }: PatientCardProps) {
  const { getPatientAdmissions } = usePatientManagement();
  const [expanded, setExpanded] = useState(false);
  
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
  
  const statusColors: Record<string, string> = {
    'Aguardando Atendimento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'Em Triagem': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'Em Atendimento': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    'Em Observação': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100',
    'Em Procedimento': 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100',
    'Em Recuperação': 'bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100',
    'Alta': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    'Transferido': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div 
        className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {patient.personalInfo.photo ? (
              <Image 
                src={patient.personalInfo.photo} 
                alt={patient.personalInfo.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-xl font-medium">
                {patient.personalInfo.name.charAt(0)}
              </span>
            )}
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
            </div>
          </div>
        </div>
        
        <div className="mt-3 md:mt-0 flex items-center space-x-2">
          {latestAdmission && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[latestAdmission.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {latestAdmission.status}
            </span>
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
      </div>
      
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
              </ul>
              
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Contato</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Telefone:</span> {patient.contactInfo.phone}</li>
                <li><span className="font-medium">Celular:</span> {patient.contactInfo.cellphone}</li>
                <li><span className="font-medium">Email:</span> {patient.contactInfo.email || 'Não informado'}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Convênio</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><span className="font-medium">Tipo:</span> {patient.insuranceInfo.type}</li>
                {patient.insuranceInfo.type === 'Convênio' && patient.insuranceInfo.insuranceDetails && (
                  <>
                    <li><span className="font-medium">Nome:</span> {patient.insuranceInfo.insuranceDetails.name}</li>
                    <li><span className="font-medium">Número do Cartão:</span> {patient.insuranceInfo.insuranceDetails.cardNumber}</li>
                  </>
                )}
                {patient.insuranceInfo.type === 'SUS' && patient.insuranceInfo.susInfo && (
                  <li><span className="font-medium">Cartão SUS:</span> {patient.insuranceInfo.susInfo.cartaoSUS}</li>
                )}
              </ul>
              
              {latestAdmission && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Internação Atual</h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li><span className="font-medium">Data de Admissão:</span> {new Date(latestAdmission.admissionDate).toLocaleDateString('pt-BR')}</li>
                    <li><span className="font-medium">Tipo:</span> {latestAdmission.admissionType}</li>
                    <li><span className="font-medium">Diagnóstico:</span> {latestAdmission.initialDiagnosis || 'Não definido'}</li>
                    <li><span className="font-medium">Previsão de Alta:</span> {latestAdmission.expectedDischarge ? new Date(latestAdmission.expectedDischarge).toLocaleDateString('pt-BR') : 'Não definida'}</li>
                  </ul>
                </>
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
          </div>
        </div>
      )}
    </div>
  );
}
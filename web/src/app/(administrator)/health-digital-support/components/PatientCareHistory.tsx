/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { ICareEvent, IPatient, IPatientCareHistory, IStatusHistory } from '@/types/hospital-network-types';
import React, { useMemo, useState } from 'react';


interface PatientCareHistoryProps {
  patient: IPatient | null;
  getPatientCareHistory: (patientId: string) => IPatientCareHistory | null;
}

type ViewMode = 'timeline' | 'status' | 'events';

export const PatientCareHistory: React.FC<PatientCareHistoryProps> = ({ 
  patient,
  getPatientCareHistory
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  
  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um paciente para visualizar o histórico</p>
      </div>
    );
  }
  
  const careHistory = getPatientCareHistory(patient.id);
  
  if (!careHistory) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Histórico de atendimento não disponível para este paciente</p>
      </div>
    );
  }
  
  // Combinar histórico de status e eventos em uma única timeline
  const timeline = [
    ...careHistory.statusHistory.map((status): [IStatusHistory | null, ICareEvent | null, Date] => [
      status,
      null,
      new Date(status.timestamp)
    ]),
    ...careHistory.events.map((event): [IStatusHistory | null, ICareEvent | null, Date] => [
      null,
      event,
      new Date(event.timestamp)
    ])
  ].sort((a, b) => b[2].getTime() - a[2].getTime()); // Ordenar do mais recente para o mais antigo
  
  // Função para formatar data e hora
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Função para traduzir tipos de evento
  const translateEventType = (type: string) => {
    const translations: Record<string, string> = {
      'admission': 'Admissão',
      'transfer': 'Transferência',
      'procedure': 'Procedimento',
      'medication': 'Medicação',
      'exam': 'Exame',
      'discharge': 'Alta',
      'consultation': 'Consulta',
      'note': 'Anotação'
    };
    
    return translations[type] || type;
  };
  
  // Função para calcular o total de dias desde a admissão
  const calculateDaysSinceAdmission = () => {
    const startDate = new Date(careHistory.startDate);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calcular estatísticas do atendimento
  const stats = useMemo(() => {
    // Contar eventos por tipo
    const eventsByType: Record<string, number> = {};
    careHistory.events.forEach(event => {
      if (!eventsByType[event.type]) {
        eventsByType[event.type] = 0;
      }
      eventsByType[event.type]++;
    });
    
    // Contar médicos e enfermeiros únicos
    const uniqueStaff = new Set<string>();
    
    // Adicionar profissionais do histórico de status
    careHistory.statusHistory.forEach(status => {
      uniqueStaff.add(status.updatedBy.id);
    });
    
    // Adicionar profissionais dos eventos
    careHistory.events.forEach(event => {
      uniqueStaff.add(event.responsibleStaff.id);
    });
    
    return {
      eventsByType,
      uniqueStaffCount: uniqueStaff.size,
      totalEvents: careHistory.events.length,
      totalStatusChanges: careHistory.statusHistory.length,
      daysSinceAdmission: calculateDaysSinceAdmission()
    };
  }, [careHistory]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold text-gray-800">
          Histórico de Atendimento
        </div>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Paciente: {patient.name}
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Informações do Atendimento</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">ID Admissão:</span> {careHistory.admissionId}</p>
            <p><span className="font-medium">Data de Início:</span> {new Date(careHistory.startDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Diagnóstico Principal:</span> {careHistory.primaryDiagnosis}</p>
            <p><span className="font-medium">Status:</span> {careHistory.status}</p>
            <p><span className="font-medium">Dias de Internação:</span> {stats.daysSinceAdmission}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Informações do Paciente</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Nome:</span> {patient.name}</p>
            <p><span className="font-medium">Idade:</span> {patient.age}</p>
            <p><span className="font-medium">Gênero:</span> {patient.gender}</p>
            <p><span className="font-medium">Tipo Sanguíneo:</span> {patient.bloodType}</p>
            {patient.contactInfo && (
              <p><span className="font-medium">Contato de Emergência:</span> {patient.contactInfo.emergency}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Métricas rápidas */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-xs text-indigo-700 uppercase font-semibold">Total de Eventos</p>
          <p className="text-2xl font-bold text-indigo-800">{stats.totalEvents}</p>
        </div>
        <div className="bg-pink-50 p-3 rounded-lg">
          <p className="text-xs text-pink-700 uppercase font-semibold">Mudanças de Status</p>
          <p className="text-2xl font-bold text-pink-800">{stats.totalStatusChanges}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-xs text-amber-700 uppercase font-semibold">Profissionais Envolvidos</p>
          <p className="text-2xl font-bold text-amber-800">{stats.uniqueStaffCount}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg">
          <p className="text-xs text-emerald-700 uppercase font-semibold">Dias de Internação</p>
          <p className="text-2xl font-bold text-emerald-800">{stats.daysSinceAdmission}</p>
        </div>
      </div>
      
      {/* Seletor de visualização */}
      <div className="mb-4 flex space-x-2 border-b border-gray-200 pb-2">
        <button
          className={`px-3 py-1 text-sm font-medium rounded-t-md ${
            viewMode === 'timeline' 
              ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('timeline')}
        >
          Timeline Completa
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-t-md ${
            viewMode === 'status' 
              ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('status')}
        >
          Histórico de Status
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-t-md ${
            viewMode === 'events' 
              ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('events')}
        >
          Eventos de Atendimento
        </button>
      </div>
      
      {/* Visualização de Timeline */}
      {viewMode === 'timeline' && (
        <>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Timeline do Atendimento</h3>
          
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((item, index) => {
                const [status, event, date] = item;
                const isStatus = !!status;
                const isEvent = !!event;
                
                return (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            isStatus ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            {isStatus ? (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {isStatus ? (
                                <>
                                  Status atualizado para <span className="font-bold">{status.status}</span> no departamento <span className="font-medium">{status.department}</span>
                                </>
                              ) : (
                                <>
                                  <span className="font-bold capitalize">{translateEventType(event?.type || '')}</span>: {event?.description}
                                </>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {isStatus ? (
                                <>
                                  Por: {status.updatedBy.name} ({status.updatedBy.role})
                                </>
                              ) : (
                                <>
                                  Por: {event?.responsibleStaff.name} ({event?.responsibleStaff.role})
                                  {event?.details && Object.keys(event.details).length > 0 && (
                                    <span className="block mt-1">
                                      {Object.entries(event.details).map(([key, value]) => (
                                        <span key={key} className="inline-block mr-2">
                                          {key}: <span className="font-medium">{value}</span>
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-gray-500">
                            <time dateTime={date.toISOString()}>
                              {formatDateTime(date.toISOString())}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      
      {/* Visualização de Status */}
      {viewMode === 'status' && (
        <>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Histórico de Status</h3>
          
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {careHistory.statusHistory.map((status, index) => (
                <li key={index}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {status.status}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {status.department}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {status.updatedBy.name} - {status.updatedBy.role}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {formatDateTime(status.timestamp)}
                        </p>
                      </div>
                      {status.specialty && (
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          {status.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {/* Visualização de Eventos */}
      {viewMode === 'events' && (
        <>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Eventos de Atendimento</h3>
          
          <div className="bg-gray-50 p-3 mb-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Eventos por Tipo</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(stats.eventsByType).map(([type, count]) => (
                <div key={type} className="bg-white p-2 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase">{translateEventType(type)}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {careHistory.events.map((event, index) => (
                <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-600 truncate">
                      {translateEventType(event.type)}: {event.description}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {event.department}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {event.responsibleStaff.name} - {event.responsibleStaff.role}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="border-t border-gray-200 pt-2">
                        <h4 className="font-medium text-xs uppercase text-gray-500 mb-1">Detalhes</h4>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="sm:col-span-1">
                              <dt className="text-xs text-gray-500">{key}:</dt>
                              <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {timeline.length === 0 && (
        <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
          <p className="text-gray-500">Nenhum evento de atendimento registrado</p>
        </div>
      )}
    </div>
  );
};
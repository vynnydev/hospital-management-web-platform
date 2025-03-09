import React from 'react';
import { IPatient, IHospital, IPatientCareHistory, IStatusHistory } from '@/types/hospital-network-types';
import { IBed } from '@/types/hospital-network-types';
import { IAmbulanceRoute } from '@/types/ambulance-types';
import { IStaffTeam } from '@/types/staff-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Badge } from '@/components/ui/organisms/badge';
import { HeartPulse, Activity, ArrowRight } from 'lucide-react';
import { PatientTransferTimeline } from '../PatientTransferTimeline';
import { RiskAnalysisPanel } from '../RiskAnalysisPanel';
import { TransferMap } from '../TransferMap';

interface PatientDetailsProps {
  selectedPatientData: {
    patientInfo: {
      patient: IPatient;
      bed: IBed;
      department: string;
      lastStatus: IStatusHistory | null;
    };
    careHistory: IPatientCareHistory | null;
    statusHistory: IStatusHistory[] | null;
    currentStatus: IStatusHistory | null;
    incomingTransfer: IAmbulanceRoute | undefined;
    outgoingTransfer: IAmbulanceRoute | undefined;
    assignedTeams: IStaffTeam[];
  } | null;
  hospitals: IHospital[];
  selectedHospitalId: string;
}

export const PatientDetailsSection: React.FC<PatientDetailsProps> = ({
  selectedPatientData,
  hospitals,
  selectedHospitalId
}) => {
  return (
    <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
          {selectedPatientData ? (
            <span className="flex items-center">
              <HeartPulse className="h-5 w-5 mr-2 text-rose-600 dark:text-rose-400" />
              Detalhes do Paciente: {selectedPatientData.patientInfo.patient.name}
            </span>
          ) : (
            <span className="flex items-center text-gray-500 dark:text-gray-400">
              <Activity className="h-5 w-5 mr-2" />
              Selecione um paciente para ver detalhes
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {selectedPatientData?.patientInfo.patient.diagnosis || 'Detalhes de atendimento e transferências'}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white dark:bg-gray-800">
        {selectedPatientData ? (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700">
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-800"
              >
                Linha do Tempo
              </TabsTrigger>
              <TabsTrigger 
                value="analysis"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white dark:data-[state=active]:bg-amber-800"
              >
                Análise de Risco
              </TabsTrigger>
              <TabsTrigger 
                value="transfer"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-800"
              >
                Transferências 
                {(selectedPatientData.incomingTransfer || selectedPatientData.outgoingTransfer) && (
                  <Badge variant="destructive" className="ml-2 bg-rose-600 dark:bg-rose-700">
                    {selectedPatientData.incomingTransfer && selectedPatientData.outgoingTransfer 
                      ? 2 
                      : 1}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-0">
              {selectedPatientData.careHistory ? (
                <PatientTransferTimeline careHistory={selectedPatientData.careHistory} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                  <Activity className="h-12 w-12 mb-4 text-gray-400 dark:text-gray-600" />
                  <p>
                    Histórico de atendimento não disponível para este paciente.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              <RiskAnalysisPanel 
                patient={selectedPatientData.patientInfo.patient}
                careHistory={selectedPatientData.careHistory}
              />
            </TabsContent>
            
            <TabsContent value="transfer" className="mt-0">
              <TransferMap 
                patient={selectedPatientData.patientInfo.patient}
                incomingTransfer={selectedPatientData.incomingTransfer}
                outgoingTransfer={selectedPatientData.outgoingTransfer}
                hospital={hospitals.find(h => h.id === selectedHospitalId)}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <ArrowRight className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p>
              Selecione um paciente da lista para visualizar detalhes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
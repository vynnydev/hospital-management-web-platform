// Atualização do BedPatientInfoCard para incluir o monitoramento térmico
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  AlertCircle, Calendar, Clock, User, Activity, 
  HeartPulse, Droplets, MapPin, Phone, 
  Construction, Brain, Timer,
  Printer,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import type { IBed, IPatient } from '@/types/hospital-network-types';
import { Button } from '@/components/ui/organisms/button';
import { handlePrint } from './PrintContent';
import { getMaintenanceRecommendations, getMaintenanceSchedule } from '@/utils/AI/getMaintenanceRecommendations';
import { ThermalMonitoringSection } from '@/components/ui/templates/ThermalMonitoringSection';
import { useThermalCameraData } from '@/hooks/thermal-cameras/useThermalCameraData';

interface PatientInfoCardProps {
  selectedBed: IBed | null;
}

export const BedPatientInfoCard: React.FC<PatientInfoCardProps> = ({ selectedBed }) => {
  const { getCameraForBed } = useThermalCameraData();
    if (!selectedBed?.patient) return null;
    const patient: IPatient = selectedBed.patient;
    const hasThermalCamera = selectedBed ? !!getCameraForBed(selectedBed.id) : false;

    const calculateInternmentDays = (admissionDate: string): number => {
      const admission = new Date(admissionDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - admission.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Função para formatar a data e hora
    const formatDateTime = (dateTimeString: string) => {
      const date = new Date(dateTimeString);
      
      // Formatando a data como YYYY-MM-DD
      const dateFormatted = date.toISOString().split('T')[0];
      
      // Formatando a hora como HH:mm
      const timeFormatted = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return { date: dateFormatted, time: timeFormatted };
    };
    
    return (
      <div className="h-full overflow-y-auto space-y-6 pr-2 pb-6">
        {/* Botão de Impressão */}
        <Button 
          onClick={handlePrint(patient)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <Printer className="h-5 w-5" />
          Imprimir Relatório
        </Button>
  
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl" />
          <Card className="bg-gray-800/90 border-0 relative space-y-6">
            <CardHeader className="pb-2 flex-col">
              <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <User className="h-6 w-6 text-blue-400" />
                {patient.name}
              </CardTitle>
              {/* Badge de dias de internação */}
              <div className="flex items-start pt-2">
                <div className="flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full px-3 py-1.5 border border-indigo-500/20">
                  <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                  <div className="flex flex-row">
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {calculateInternmentDays(patient.admissionDate)}
                      </span>
                      <span className="text-sm text-gray-400">dias internado</span>
                    </div>
                  </div>
                </div>
                {/* Badge de alerta se internação > 30 dias */}
                {calculateInternmentDays(patient.admissionDate) > 30 && (
                  <div className="animate-pulse bg-red-500/10 rounded-full px-3 py-1.5 border border-red-500/20">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-xs text-red-400">Internação prolongada</span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6 space-y-4">
              <div className="col-span-2 bg-gray-900/30 p-4 rounded-xl border border-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">Diagnóstico</span>
                </div>
                <p className="text-gray-100 font-medium">{patient.diagnosis}</p>
              </div>
  
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Data de admissão</p>
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-100">{formatDateTime(patient.admissionDate).date}</p>
                      <div className="inline-flex bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full px-2 py-0.5 border border-indigo-500/20">
                        <span className="text-sm bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-medium">
                          Desde {formatDateTime(patient.admissionDate).time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Tipo sanguíneo</p>
                    <p className="text-gray-100">{patient.bloodType}</p>
                  </div>
                </div>
              </div>
  
              <div className="space-y-20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Alta prevista</p>
                    <p className="text-gray-100">{patient.expectedDischarge}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Idade/Gênero</p>
                    <p className="text-gray-100">{patient.age} anos / {patient.gender}</p>
                  </div>
                </div>
              </div>
  
              <div className="col-span-2 bg-gray-900/30 p-4 rounded-xl border border-gradient-to-r from-blue-500/20 to-cyan-500/20 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <p className="text-gray-100 text-sm">{patient.contactInfo.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-gray-100 text-sm">Tel: {patient.contactInfo.phone}</p>
                    <p className="text-gray-100 text-sm">Emergência: {patient.contactInfo.emergency}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Componente de Monitoramento Térmico - Exibir apenas se o leito tiver uma câmera térmica */}
        {hasThermalCamera && (
          <ThermalMonitoringSection selectedBed={selectedBed} />
        )}
  
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl" />
          <Card className="bg-gray-800/90 border-0 relative space-y-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <Brain className="h-6 w-6 text-emerald-400" />
                Análise Inteligente do Leito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-gray-900/30 p-4 rounded-xl border border-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Construction className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-400">Recomendações de Manutenção</span>
                </div>
                <div className="space-y-3">
                  {getMaintenanceRecommendations(patient.diagnosis).map((rec, index) => (
                    <p key={index} className="text-gray-100 text-sm flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      {rec}
                    </p>
                  ))}
                </div>
              </div>
  
              <div className="bg-gray-900/30 p-4 rounded-xl border border-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-400">Previsão de Manutenção</span>
                </div>
                <div className="space-y-3">
                  {getMaintenanceSchedule(patient.diagnosis).map((schedule, index) => (
                    <p key={index} className="text-gray-100 text-sm flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      {schedule}
                    </p>
                  ))}
                </div>
              </div>
  
              <div className="flex justify-center pt-4">
                <QRCodeSVG
                  value={JSON.stringify({
                    bedId: selectedBed.id,
                    patientId: patient.id,
                    timestamp: new Date().toISOString()
                  })}
                  size={128}
                  level="M"
                  includeMargin={true}
                  className="bg-white p-2 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
};
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { 
  AlertCircle, Calendar, Clock, User, Activity, 
  HeartPulse, Droplets, MapPin, Phone, 
  Construction, Brain, Timer,
  Printer
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import type { IBed, IPatient } from '@/types/hospital-network-types';
import { Button } from '@/components/ui/organisms/button';

interface PatientInfoCardProps {
  selectedBed: IBed | null;
}

interface MaintenanceRecommendation {
  [key: string]: string[];
}

export const BedPatientInfoCard: React.FC<PatientInfoCardProps> = ({ selectedBed }) => {
    if (!selectedBed?.patient) return null;
  
    const patient: IPatient = selectedBed.patient;

    const qrCodeRef = useRef<HTMLDivElement>(null);
  
    const generatePrintContent = () => {
        return `
          <html>
            <head>
              <title>Relatório do Paciente - ${patient.name}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  max-width: 800px; 
                  margin: 0 auto; 
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                  border-bottom: 2px solid #e2e8f0; 
                  padding-bottom: 20px; 
                }
                .section { 
                  margin-bottom: 25px; 
                  padding: 15px; 
                  border: 1px solid #e2e8f0; 
                  border-radius: 8px; 
                }
                .title { 
                  font-size: 18px; 
                  font-weight: bold; 
                  margin-bottom: 15px; 
                  color: #2b6cb0; 
                }
                .info-item {
                  margin-bottom: 10px;
                }
                .info-label {
                  font-weight: bold;
                  color: #4a5568;
                }
                @media print {
                  .section { break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Relatório do Paciente</h1>
                <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
              </div>
    
              <div class="section">
                <div class="title">Informações do Paciente</div>
                <div class="info-item">
                  <div class="info-label">Nome:</div>
                  ${patient.name}
                </div>
                <div class="info-item">
                  <div class="info-label">Diagnóstico:</div>
                  ${patient.diagnosis}
                </div>
                <div class="info-item">
                  <div class="info-label">Data de Admissão:</div>
                  ${patient.admissionDate}
                </div>
                <div class="info-item">
                  <div class="info-label">Alta Prevista:</div>
                  ${patient.expectedDischarge}
                </div>
              </div>
    
              <div class="section">
                <div class="title">Contato</div>
                <div class="info-item">
                  <div class="info-label">Endereço:</div>
                  ${patient.contactInfo.address}
                </div>
                <div class="info-item">
                  <div class="info-label">Telefone:</div>
                  ${patient.contactInfo.phone}
                </div>
                <div class="info-item">
                  <div class="info-label">Emergência:</div>
                  ${patient.contactInfo.emergency}
                </div>
              </div>
    
              <div class="section">
                <div class="title">Análise Inteligente do Leito</div>
                <div class="info-item">
                  <div class="info-label">Recomendações de Manutenção:</div>
                  <ul>
                    ${getMaintenanceRecommendations(patient.diagnosis)
                      .map(rec => `<li>${rec}</li>`)
                      .join('')}
                  </ul>
                </div>
                <div class="info-item">
                  <div class="info-label">Previsão de Manutenção:</div>
                  <ul>
                    ${getMaintenanceSchedule(patient.diagnosis, patient.admissionDate)
                      .map(schedule => `<li>${schedule}</li>`)
                      .join('')}
                  </ul>
                </div>
              </div>
            </body>
          </html>
        `;
    };
    
    const handlePrint = () => {
        try {
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            alert('Por favor, permita popups para imprimir o relatório.');
            return;
          }
    
          printWindow.document.write(generatePrintContent());
          printWindow.document.close();
          
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        } catch (error) {
          console.error('Erro ao imprimir:', error);
          alert('Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.');
        }
    };
    
    return (
      <div className="h-full overflow-y-auto space-y-6 pr-2 pb-6">
        {/* Botão de Impressão */}
        <Button 
          onClick={handlePrint}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <Printer className="h-5 w-5" />
          Imprimir Relatório
        </Button>
  
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl" />
          <Card className="bg-gray-800/90 border-0 relative space-y-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <User className="h-6 w-6 text-blue-400" />
                {patient.name}
              </CardTitle>
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
                    <p className="text-gray-100">{patient.admissionDate}</p>
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
  
              <div className="space-y-6">
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
                  {getMaintenanceSchedule(patient.diagnosis, patient.admissionDate).map((schedule, index) => (
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

// Função auxiliar para gerar recomendações baseadas no diagnóstico
const getMaintenanceRecommendations = (diagnosis: string): string[] => {
  const recommendations: MaintenanceRecommendation = {
    'Post-cardiac surgery': [
      'Verificar regularmente a calibração dos monitores cardíacos',
      'Manter sistema de gases medicinais em condições ideais',
      'Garantir backup de energia para equipamentos vitais',
      'Verificar funcionamento do sistema de chamada de emergência'
    ],
    'Hip replacement recovery': [
      'Verificar integridade das barras de apoio do leito',
      'Garantir funcionamento suave dos controles de elevação',
      'Manter colchão em condições adequadas para prevenção de úlceras',
      'Verificar sistema de trava das rodas do leito'
    ]
  };

  return recommendations[diagnosis] || [
    'Realizar checagem padrão dos equipamentos',
    'Verificar condições gerais do leito',
    'Manter higienização conforme protocolo'
  ];
};

// Função auxiliar para gerar cronograma de manutenção
const getMaintenanceSchedule = (diagnosis: string, admissionDate: string): string[] => {
  const baseSchedule: string[] = [
    'Próxima higienização completa: Em 3 dias',
    'Verificação de equipamentos: Diariamente',
    'Manutenção preventiva: Em 7 dias'
  ];

  if (diagnosis.toLowerCase().includes('cardiac')) {
    baseSchedule.push('Calibração de monitores cardíacos: Em 48 horas');
  }

  return baseSchedule;
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPatient } from "@/types/hospital-network-types";
import { getMaintenanceRecommendations, getMaintenanceSchedule } from "@/utils/AI/getMaintenanceRecommendations";

export const generatePrintContent = (patient: IPatient) => {
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

export const handlePrint = (patient: IPatient) => (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permita popups para imprimir o relatório.');
        return;
      }
  
      printWindow.document.write(generatePrintContent(patient));
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
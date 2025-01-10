/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient } from "../../../types/types";

// Funções de Inteligencia Artificial:
export const generateEnhancedPrompt = (patient: Patient) => {
  const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
  const vitalsTrend = analyzeVitalsTrend(patient.treatment.vitals);
  const medications = patient.treatment.medications
    .map(med => `${med.name} (${med.dosage}, ${med.frequency})`)
    .join(', ');

  return `Atuando como especialista em medicina hospitalar, forneça recomendações e instruções visuais técnicas para:

DADOS DO PACIENTE:
- Nome: ${patient.personalInfo.name}
- Idade: ${patient.personalInfo.age} anos
- Status: ${patient.admission.statusHistory[0].status}
- Departamento: ${patient.admission.statusHistory[0].department}
- Condição: ${patient.admission.reason}

SINAIS VITAIS:
- FC: ${latestVitals.heartRate} bpm (${vitalsTrend.heartRate})
- Temperatura: ${latestVitals.temperature}°C (${vitalsTrend.temperature})
- SpO2: ${latestVitals.oxygenSaturation}% (${vitalsTrend.oxygenSaturation})

MEDICAÇÕES: ${medications}

FORNEÇA 3 RECOMENDAÇÕES COM IMAGENS TÉCNICAS:

[RECOMENDAÇÃO 1: PROTOCOLO DE TRATAMENTO]
- Descrição detalhada do protocolo
- Ajustes necessários nas medicações
- Procedimentos recomendados
- Metas terapêuticas específicas

[IMAGEM TÉCNICA 1]
- Fluxograma do protocolo
- Esquema de administração
- Equipamentos necessários
- Pontos de verificação
- Resolução: 2048x2048 pixels

[RECOMENDAÇÃO 2: PLANO DE MONITORAMENTO]
- Parâmetros específicos
- Frequência de verificação
- Exames necessários
- Indicadores de progresso

[IMAGEM TÉCNICA 2]
- Diagrama de monitoramento
- Posicionamento de sensores
- Gráficos de parâmetros
- Pontos críticos
- Resolução: 2048x2048 pixels

[RECOMENDAÇÃO 3: PROCEDIMENTOS DE ENFERMAGEM]
- Ações específicas necessárias
- Precauções de segurança
- Protocolos de cuidado
- Critérios de avaliação

[IMAGEM TÉCNICA 3]
- Diagrama de procedimentos
- Sequência de ações
- Materiais necessários
- Pontos de atenção
- Resolução: 2048x2048 pixels

[PADRÕES TÉCNICOS]
- Foco em procedimentos e equipamentos
- Legendas em português
- Setas indicativas
- Medidas precisas
- Sem representações humanas`;
};

const analyzeVitalsTrend = (vitals: any) => {
  if (vitals.length < 2) return { 
    heartRate: 'estável', 
    temperature: 'estável', 
    oxygenSaturation: 'estável' 
  };

  const latest = vitals[vitals.length - 1];
  const previous = vitals[vitals.length - 2];

  return {
    heartRate: getTrendDescription(latest.heartRate - previous.heartRate, 'bpm'),
    temperature: getTrendDescription(latest.temperature - previous.temperature, '°C'),
    oxygenSaturation: getTrendDescription(latest.oxygenSaturation - previous.oxygenSaturation, '%')
  };
};

const getTrendDescription = (difference: number, unit: string) => {
  if (Math.abs(difference) < 0.1) return 'estável';
  return `${difference > 0 ? 'aumento' : 'redução'} de ${Math.abs(difference).toFixed(1)}${unit}`;
};
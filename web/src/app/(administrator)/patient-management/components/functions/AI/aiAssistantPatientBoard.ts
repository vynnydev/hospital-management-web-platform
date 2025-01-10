/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient } from "../../../types/types";

export const generateEnhancedPrompt = (patient: Patient) => {
  const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
  const vitalsTrend = analyzeVitalsTrend(patient.treatment.vitals);
  const medications = patient.treatment.medications
    .map(med => `${med.name} (${med.dosage}, ${med.frequency})`)
    .join(', ');

  return `Instruções técnicas e visuais para procedimentos médicos hospitalares:

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

MEDICAÇÕES ATUAIS: ${medications}

[INSTRUÇÕES VISUAIS PASSO A PASSO]

[PROCEDIMENTO 1: ADMINISTRAÇÃO DE MEDICAMENTOS]
1. Higienização das mãos e preparação dos materiais
2. Verificação dos "5 certos" da medicação
3. Preparação da dose conforme prescrição
4. Administração seguindo protocolo específico
5. Registro e monitoramento pós-administração

[ELEMENTOS VISUAIS 1]
- Vista detalhada dos equipamentos necessários
- Sequência numerada de cada etapa
- Destaque para pontos críticos de verificação
- Indicadores de dosagem e medidas
- Resolução: 2048x2048 pixels

[PROCEDIMENTO 2: MONITORAMENTO DE SINAIS VITAIS]
1. Preparação dos equipamentos de monitoramento
2. Posicionamento correto dos sensores
3. Configuração dos parâmetros de alarme
4. Registro dos valores em intervalos definidos
5. Identificação de alterações significativas

[ELEMENTOS VISUAIS 2]
- Diagrama técnico dos equipamentos
- Marcadores de posicionamento dos sensores
- Gráficos de referência para valores normais
- Indicadores de alertas e alarmes
- Resolução: 2048x2048 pixels

[PROCEDIMENTO 3: PROTOCOLOS DE SEGURANÇA]
1. Verificação da identificação do paciente
2. Conferência da prescrição médica
3. Avaliação de contraindicações
4. Implementação de medidas preventivas
5. Documentação das ações realizadas

[ELEMENTOS VISUAIS 3]
- Fluxograma do protocolo de segurança
- Checklist visual de verificação
- Símbolos de alerta e precaução
- Indicadores de conformidade
- Resolução: 2048x2048 pixels

[PADRÕES TÉCNICOS PARA TODAS AS IMAGENS]
- Foco exclusivo em equipamentos e procedimentos
- Sem representações de pessoas
- Texto totalmente em português
- Setas e números indicando sequência
- Cores padronizadas para níveis de risco
- Legendas claras e objetivas
- Vista detalhada de instrumentos médicos
- Escala precisa de medidas e dosagens`;
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
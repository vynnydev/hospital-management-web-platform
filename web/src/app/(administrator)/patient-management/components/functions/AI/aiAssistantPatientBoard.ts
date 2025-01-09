/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient } from "../../../types/types";

// Funções de Inteligencia Artificial:
export const generateEnhancedPrompt = (patient: Patient) => {
  const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
  const vitalsTrend = analyzeVitalsTrend(patient.treatment.vitals);
  const medications = patient.treatment.medications
    .map(med => `${med.name} (${med.dosage}, ${med.frequency})`)
    .join(', ');

  return `Atuando como um especialista médico em análise clínica e cuidados hospitalares, forneça recomendações detalhadas para o seguinte caso:

DADOS DO PACIENTE:
- Nome: ${patient.personalInfo.name}
- Idade: ${patient.personalInfo.age} anos
- Tipo Sanguíneo: ${patient.personalInfo.bloodType}
- Status Atual: ${patient.admission.statusHistory[0].status}
- Departamento: ${patient.admission.statusHistory[0].department}
- Motivo da Internação: ${patient.admission.reason}

SINAIS VITAIS ATUAIS:
- Frequência Cardíaca: ${latestVitals.heartRate} bpm (Tendência: ${vitalsTrend.heartRate})
- Temperatura: ${latestVitals.temperature}°C (Tendência: ${vitalsTrend.temperature})
- Saturação de Oxigênio: ${latestVitals.oxygenSaturation}% (Tendência: ${vitalsTrend.oxygenSaturation})

MEDICAÇÕES ATUAIS:
${medications}

FATORES DE RISCO:
${patient.aiAnalysis.complications.factors.join(', ')}

Score de Risco: ${(patient.aiAnalysis.riskScore * 100).toFixed(1)}%
Tempo de Internação Previsto: ${patient.aiAnalysis.predictedLOS} dias

PROCEDIMENTOS REALIZADOS:
${patient.treatment.procedures.map(p => p.type).join(', ')}

Forneça 3 recomendações específicas, cada uma em sua própria seção:

1. PROTOCOLO DE TRATAMENTO:
Descreva o protocolo detalhado de tratamento, incluindo ajustes nas medicações, procedimentos recomendados e metas terapêuticas. Foque em aspectos técnicos e procedimentais.

2. PLANO DE MONITORAMENTO:
Especifique os parâmetros a serem monitorados, frequência de verificação dos sinais vitais, exames necessários e indicadores de progresso. Inclua critérios objetivos de avaliação.

3. CUIDADOS DE ENFERMAGEM:
Liste as ações específicas para a equipe de enfermagem, precauções necessárias e protocolos de segurança. Enfatize aspectos práticos do cuidado direto ao paciente.

Para cada recomendação, gere uma imagem profissional e técnica que demonstre:
- Procedimentos médicos específicos recomendados
- Esquemas de administração de medicamentos
- Fluxogramas de protocolos de cuidado
- Instrumentos e equipamentos necessários
- Representações de técnicas de monitoramento

IMPORTANTE: As imagens devem focar em aspectos técnicos e procedimentais, evitando o foco em pessoas. Priorize a visualização de:
- Procedimentos médicos
- Equipamentos hospitalares
- Protocolos técnicos
- Instrumentos médicos
- Fluxogramas de tratamento`;
};

const analyzeVitalsTrend = (vitals: any) => {
  if (vitals.length < 2) return { heartRate: 'estável', temperature: 'estável', oxygenSaturation: 'estável' };

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
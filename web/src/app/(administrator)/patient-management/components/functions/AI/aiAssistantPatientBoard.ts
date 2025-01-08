/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient } from "../../../types/types";

// Funções de Inteligencia Artificial:
export const generateEnhancedPrompt = (patient: Patient) => {
  const latestVitals = patient.treatment.vitals[patient.treatment.vitals.length - 1];
  const vitalsTrend = analyzeVitalsTrend(patient.treatment.vitals);
  const medications = patient.treatment.medications
    .map(med => `${med.name} (${med.dosage}, ${med.frequency})`)
    .join(', ');

  return `Atuando como um assistente médico especialista, analise o seguinte caso e forneça recomendações detalhadas:

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

Por favor, forneça:
1. Análise detalhada do quadro atual com base nos sinais vitais e tendências
2. Recomendações específicas para tratamento considerando medicações atuais e fatores de risco
3. Sugestões de monitoramento e ajustes no plano de cuidados
4. Alertas e precauções específicas para a equipe de enfermagem
5. Próximos passos recomendados para o tratamento

Para a geração da imagem, crie uma representação visual profissional do protocolo de cuidados recomendado, incluindo:
- Sequência de ações recomendadas
- Pontos de atenção principais
- Indicadores de monitoramento
- Metas de tratamento`;
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
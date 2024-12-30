import React from 'react';
import { PrintData } from '../types';

interface PrintTemplateProps {
  printData: PrintData;
  calculateTemperatureStatus: (temp: number) => string;
  calculateBloodPressureStatus: (pressure: string) => string;
  calculateHeartRateStatus: (rate: number) => string;
  calculateSaturationStatus: (saturation: number) => string;
  getStatusClass: (status: string) => string;
}

export const generatePrintTemplate = ({
  printData,
  calculateTemperatureStatus,
  calculateBloodPressureStatus,
  calculateHeartRateStatus,
  calculateSaturationStatus,
  getStatusClass,
}: PrintTemplateProps): string => {
  const { data, vitalsData, medications, processedImages } = printData;
  
  const template = `
    <html>
        <head>
        <title>Análise do Paciente - IA</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            :root {
            --bg-card: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            }

            * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            }
            
            body {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
            color: var(--text-primary);
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            }

            .header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            }

            .recommendations-section {
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            }

            .recommendation-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            }

            .recommendation-icon {
            color: #60a5fa;
            flex-shrink: 0;
            }

            .status-alerts {
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            }

            .risk-level {
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .risk-badge {
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            }

            .medication-images {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
            }

            .medication-image-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            padding: 1rem;
            }

            .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            }

            .section {
            margin-bottom: 2rem;
            }

            .vitals-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            }

            .vital-card {
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 1.5rem;
            position: relative;
            }

            .vital-label {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-bottom: 0.5rem;
            }

            .vital-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            }

            .vital-reference {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1rem;
            }

            .status-label {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            padding: 0.375rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            }

            .status-normal {
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            }

            .status-warning {
            background: rgba(234, 179, 8, 0.1);
            color: #facc15;
            }

            .status-critical {
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            }

            .medication-card {
            background: var(--bg-card);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            }

            .medication-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            }

            .medication-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            }

            .medication-dosage {
            color: var(--text-secondary);
            font-size: 0.875rem;
            }

            .medication-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            }

            .detail-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            padding: 1rem;
            }

            .detail-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
            }

            .image-content {
            width: 100%;
            height: auto;
            border-radius: 0.5rem;
            }

            .image-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            color: var(--text-secondary);
            }
    
            @media print {
            body {
                background: white;
                color: #1a1a1a;
            }

            .vital-card,
            .medication-card,
            .detail-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                break-inside: avoid;
            }

            .vital-value {
                color: #1a1a1a;
            }

            .vital-label,
            .vital-reference,
            .medication-dosage {
                color: #64748b;
            }

            .status-normal {
                background: rgba(34, 197, 94, 0.1);
                color: #16a34a;
            }

            .status-warning {
                background: rgba(234, 179, 8, 0.1);
                color: #ca8a04;
            }

            .status-critical {
                background: rgba(239, 68, 68, 0.1);
                color: #dc2626;
            }

            @page {
                margin: 2cm;
            }

            .recommendations-section,
            .status-alerts,
            .risk-level,
            .medication-image-card {
                background: white;
                border: 1px solid #e2e8f0;
                break-inside: avoid;
            }

            .recommendation-item {
                background: #f8fafc;
                break-inside: avoid;
            }
            }
        </style>
        </head>
        <body>
        <div class="header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1>Análise de Sinais Vitais</h1>
        </div>

        <!-- Seção de Recomendações -->
            <div class="recommendations-section">
            <h2 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                <span style="color: #60a5fa;">✨</span>
                Recomendações da IA
            </h2>
            ${data.raw.data.analysis.recommendations.map((rec, index) => `
                <div class="recommendation-item">
                    <span class="recommendation-icon">✨</span>
                    <div>${rec}</div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="vitals-grid">
            <div class="vital-card">
                <div class="vital-label">Temperatura</div>
                <div class="vital-value">${vitalsData.temperature || '--'}°C</div>
                <div class="vital-reference">Referência: 36.5°C - 37.5°C</div>
                ${(() => {
                const status = calculateTemperatureStatus(Number(vitalsData.temperature));
                return `<span class="status-label ${getStatusClass(status)}">${status}</span>`;
                })()}
            </div>

            <div class="vital-card">
                <div class="vital-label">Pressão Arterial</div>
                <div class="vital-value">${vitalsData.pressure || '--'}</div>
                <div class="vital-reference">Referência: 120/80 mmHg</div>
                ${(() => {
                const status = calculateBloodPressureStatus(vitalsData.pressure);
                return `<span class="status-label ${getStatusClass(status)}">${status}</span>`;
                })()}
            </div>

            <div class="vital-card">
                <div class="vital-label">Frequência Cardíaca</div>
                <div class="vital-value">${vitalsData.heartRate || '--'} bpm</div>
                <div class="vital-reference">Referência: 60-100 bpm</div>
                ${(() => {
                const status = calculateHeartRateStatus(Number(vitalsData.heartRate));
                return `<span class="status-label ${getStatusClass(status)}">${status}</span>`;
                })()}
            </div>

            <div class="vital-card">
                <div class="vital-label">Saturação</div>
                <div class="vital-value">${vitalsData.saturation || '--'}%</div>
                <div class="vital-reference">Referência: > 95%</div>
                ${(() => {
                const status = calculateSaturationStatus(Number(vitalsData.saturation));
                return `<span class="status-label ${getStatusClass(status)}">${status}</span>`;
                })()}
            </div>
            </div>
        </div>

        <!-- Status de Alertas -->
        <div class="status-alerts">
            <h3 style="margin-bottom: 1rem;">Status de Alertas:</h3>
            <div>Sem alertas registrados</div>
        </div>

        <!-- Nível de Risco -->
        <div class="risk-level">
            <h3>Nível de Risco:</h3>
            <div style="display: flex; align-items: center; gap: 1rem;">
            <span>Baixo</span>
            <span class="risk-badge">Risco: LOW</span>
            </div>
        </div>

        <!-- Seção de Medicamentos -->
        <div class="section">
            ${medications.map((medication: any) => `
            <div class="medication-card">
                <div class="medication-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="color: #60a5fa;">💊</span>
                    <div>
                    <h3 class="medication-title">${medication.name}</h3>
                    <div class="medication-dosage">${medication.dosage} - ${medication.frequency}</div>
                    </div>
                </div>
                </div>

                <div class="medication-images">
                <!-- Instruções de Uso -->
                <div class="medication-image-card">
                    <div class="image-title">
                    <span>📋</span>
                    Instruções de Uso
                    </div>
                    ${processedImages.usage ? `
                    <img src="${processedImages.usage}" alt="Instruções de uso" class="image-content">
                    ` : '<div>Instruções não disponíveis</div>'}
                </div>

                <!-- Aplicação -->
                <div class="medication-image-card">
                    <div class="image-title">
                    <span>🎯</span>
                    Aplicação
                    </div>
                    ${processedImages.application ? `
                    <img src="${processedImages.application}" alt="Aplicação" class="image-content">
                    ` : '<div>Demonstração não disponível</div>'}
                </div>
                </div>

                <!-- Precauções -->
                <div class="medication-image-card" style="margin-top: 1rem;">
                <div class="image-title">
                    <span>⚠️</span>
                    Precauções
                </div>
                ${processedImages.precaution ? `
                    <img src="${processedImages.precaution}" alt="Precauções" class="image-content">
                ` : '<div>Precauções não disponíveis</div>'}
                </div>
            </div>
            `).join('')}
        </div>
        </body>
    </html>
  `;

  return template;
};
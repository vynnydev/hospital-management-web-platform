/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

// Tipos para os relatórios
type ReportType = 'evolucao' | 'medicacao' | 'exames' | 'cirurgia' | 'completo';

interface ReportTemplate {
  title: string;
  description: string;
  fields: string[];
}

const reportTemplates: Record<ReportType, ReportTemplate> = {
  evolucao: {
    title: 'Relatório de Evolução',
    description: 'Análise detalhada da evolução do paciente',
    fields: ['status', 'sinaisVitais', 'medicacoes', 'observacoes']
  },
  medicacao: {
    title: 'Relatório de Medicações',
    description: 'Histórico e controle de medicações',
    fields: ['medicamentos', 'dosagem', 'frequencia', 'interacoes']
  },
  exames: {
    title: 'Relatório de Exames',
    description: 'Resultados e análises de exames',
    fields: ['tipoExame', 'resultado', 'dataRealizacao', 'comparativo']
  },
  cirurgia: {
    title: 'Relatório Cirúrgico',
    description: 'Detalhamento de procedimentos cirúrgicos',
    fields: ['procedimento', 'equipe', 'duracao', 'observacoes']
  },
  completo: {
    title: 'Relatório Completo',
    description: 'Análise completa do histórico do paciente',
    fields: ['dadosPessoais', 'historico', 'tratamentos', 'prognostico']
  }
};

// Componente do Modal de Relatório
interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType;
  patientData: any;
}

const ReportModal = ({ isOpen, onClose, reportType, patientData }: ReportModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string>('');

  // Função para gerar o relatório baseado no tipo e dados do paciente
  const generateReportContent = async () => {
    setIsGenerating(true);
    try {
      let reportContent = '';
      
      switch (reportType) {
        case 'evolucao':
          reportContent = `
            EVOLUÇÃO DO PACIENTE
            
            Status: ${patientData.status}
            Sinais Vitais: ${patientData.sinaisVitais}
            Medicações: ${patientData.medicacoes}
            Observações: ${patientData.observacoes}
          `;
          break;

        case 'medicacao':
          reportContent = `
            RELATÓRIO DE MEDICAÇÕES
            
            Medicamentos: ${patientData.medicamentos}
            Dosagem: ${patientData.dosagem}
            Frequência: ${patientData.frequencia}
            Interações: ${patientData.interacoes}
          `;
          break;

        // Adicione casos para outros tipos de relatório
        default:
          reportContent = 'Tipo de relatório não suportado';
      }

      setReport(reportContent);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setReport('Erro ao gerar relatório. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Chama generateReportContent quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      generateReportContent();
    }
  }, [isOpen, reportType, patientData]);

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${reportType}_${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 m-4 overflow-hidden">
        {/* Efeito de AI */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-gradient" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            {reportTemplates[reportType]?.title || 'Relatório'}
          </h2>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-white text-lg">Gerando relatório com IA...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <pre className="text-gray-200 whitespace-pre-wrap">{report}</pre>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Baixar Relatório
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
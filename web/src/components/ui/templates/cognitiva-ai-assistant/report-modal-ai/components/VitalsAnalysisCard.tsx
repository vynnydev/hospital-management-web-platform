import { AlertTriangle, BarChart3 } from "lucide-react";
import { IVitalReading, IVitalsAnalysis } from "../../../../../../types/report-medication-types";

export const VitalsAnalysisCard: React.FC<{ vitalsAnalysis: IVitalsAnalysis }> = ({ vitalsAnalysis }) => {
  // Funções auxiliares para verificação segura
  const hasAlerts = (): boolean => {
    return Array.isArray(vitalsAnalysis?.alerts) && vitalsAnalysis.alerts.length > 0;
  };

  const getVitalReadings = (): IVitalReading[] => {
    const readings = vitalsAnalysis?.lastReadings || {};
    return [
      {
        label: 'Temperatura',
        value: readings.temperature,
        reference: '36.5°C - 37.5°C'
      },
      {
        label: 'Pressão Arterial',
        value: readings.pressure,
        reference: '120/80 mmHg'
      },
      {
        label: 'Frequência Cardíaca',
        value: readings.heartRate,
        reference: '60-100 bpm'
      },
      {
        label: 'Saturação',
        value: readings.saturation,
        reference: '> 95%'
      }
    ];
  };

  const getRiskColor = (): string => {
    const riskColors = {
      low: 'bg-green-500/20 text-green-400',
      moderate: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-red-500/20 text-red-400'
    };
    return riskColors[vitalsAnalysis?.risk || 'low'];
  };

  const getRiskLabel = (): string => {
    const riskLabels = {
      low: 'Baixo',
      moderate: 'Moderado',
      high: 'Alto'
    };
    return riskLabels[vitalsAnalysis?.risk || 'low'];
  };

  // Renderização dos alertas
  const renderAlerts = () => {
    if (!hasAlerts()) {
      return <div className="text-white/60">Sem alertas registrados</div>;
    }

    return vitalsAnalysis.alerts!.map((alert, idx) => (
      <div key={idx} className="flex items-center gap-2 text-yellow-400">
        <AlertTriangle className="w-4 h-4" />
        <span>{alert}</span>
      </div>
    ));
  };

  // Renderização das leituras vitais
  const renderVitalReadings = () => {
    if (!vitalsAnalysis?.lastReadings) {
      return (
        <div className="col-span-full text-center p-8 bg-[#1e2a4a]/60 rounded-lg">
          <div className="text-white/60">
            Nenhuma leitura de sinais vitais disponível
          </div>
        </div>
      );
    }

    return getVitalReadings().map((reading, idx) => (
      <div key={idx} className="p-4 bg-[#1e2a4a]/60 rounded-lg space-y-2">
        <div className="text-white/60 text-sm">{reading.label}</div>
        <div className="text-white text-xl font-medium">
          {reading.value || <span className="text-white/40">Não disponível</span>}
        </div>
        <div className="text-white/40 text-xs">Referência: {reading.reference}</div>
      </div>
    ));
  };

  return (
    <div className="bg-[#1e2a4a]/40 rounded-xl p-6 border border-white/10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        <h4 className="text-white text-xl font-semibold">Análise de Sinais Vitais</h4>
      </div>

      {/* Grid de Leituras Vitais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {renderVitalReadings()}
      </div>

      {/* Status e Alertas */}
      <div className="space-y-6">
        {/* Alertas */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <h5 className="text-white/70 text-sm mb-3">Status de Alertas:</h5>
          <div className="text-white/80">
            {renderAlerts()}
          </div>
        </div>

        {/* Nível de Risco */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-white/60 text-sm">Nível de Risco:</div>
              <div className="text-white font-medium">
                {getRiskLabel()}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${getRiskColor()}`}>
              Risco: {vitalsAnalysis?.risk?.toUpperCase() || 'N/A'}
            </div>
          </div>
        </div>

        {/* Sumário/Análise */}
        <div className="bg-[#1e2a4a]/60 p-4 rounded-lg">
          <h5 className="text-white/70 text-sm mb-3">Análise Detalhada:</h5>
          <div className="text-white/70 whitespace-pre-line">
            {vitalsAnalysis?.summary || (
              <span className="text-white/40">
                Nenhuma análise detalhada disponível
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
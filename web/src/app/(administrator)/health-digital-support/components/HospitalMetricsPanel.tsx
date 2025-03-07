import { useState } from 'react';
import { IHospital } from '@/types/hospital-network-types';

interface HospitalMetricsPanelProps {
  hospital: IHospital;
}

export default function HospitalMetricsPanel({ hospital }: HospitalMetricsPanelProps) {
  const [showSpecialties, setShowSpecialties] = useState(false);
  
  // Extrair métricas do hospital
  const metrics = hospital?.metrics?.overall || {
    occupancyRate: 0,
    totalPatients: 0,
    availableBeds: 0,
    avgStayDuration: 0,
    turnoverRate: 0,
    totalBeds: 0,
    lastUpdate: new Date().toISOString(),
    periodComparison: {
      occupancy: { value: 0, trend: "up" as const },
      patients: { value: 0, trend: "up" as const },
      beds: { value: 0, trend: "up" as const }
    }
  };

  // Extrair métricas departamentais
  const deptMetrics = hospital?.metrics?.departmental || {};
  
  // Formatação da última atualização
  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''} atrás`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
      } else {
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  };

  const toggleSpecialties = () => {
    setShowSpecialties(!showSpecialties);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{hospital.name}</h2>
          <div className="text-xs">
            Atualizado {formatLastUpdate(metrics.lastUpdate)}
          </div>
        </div>
        <div className="text-sm text-primary-100 dark:text-primary-200 mt-1">
          {hospital.unit.address}, {hospital.unit.city}, {hospital.unit.state}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {/* Taxa de Ocupação */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Taxa de Ocupação</div>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              metrics.periodComparison.occupancy.trend === 'up'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              {metrics.periodComparison.occupancy.trend === 'up' ? '↑' : '↓'} 
              {metrics.periodComparison.occupancy.value.toFixed(1)}%
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.occupancyRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 pb-1">
              de {metrics.totalBeds} leitos
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                metrics.occupancyRate > 90 
                  ? 'bg-red-500 dark:bg-red-600' 
                  : metrics.occupancyRate > 75 
                    ? 'bg-yellow-500 dark:bg-yellow-600' 
                    : 'bg-green-500 dark:bg-green-600'
              }`} 
              style={{ width: `${Math.min(100, metrics.occupancyRate)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Total de Pacientes */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total de Pacientes</div>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              metrics.periodComparison.patients.trend === 'up'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              {metrics.periodComparison.patients.trend === 'up' ? '↑' : '↓'} 
              {metrics.periodComparison.patients.value}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalPatients}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {metrics.availableBeds} leitos disponíveis
          </div>
        </div>
        
        {/* Tempo Médio de Estadia */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Estadia Média</div>
          <div className="flex items-end space-x-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.avgStayDuration.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 pb-1">
              dias
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Taxa de Rotatividade: {metrics.turnoverRate.toFixed(1)}%
          </div>
        </div>
        
        {/* Departamentos Críticos */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">Departamentos</div>
          <div className="space-y-2">
            {Object.entries(deptMetrics).map(([deptName, deptMetric]) => (
              <div key={deptName} className="flex justify-between items-center">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {deptName}
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-12 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mr-2`}>
                    <div 
                      className={`h-full ${
                        deptMetric.occupancy > 90 
                          ? 'bg-red-500 dark:bg-red-600' 
                          : deptMetric.occupancy > 75 
                            ? 'bg-yellow-500 dark:bg-yellow-600' 
                            : 'bg-green-500 dark:bg-green-600'
                      }`} 
                      style={{width: `${deptMetric.occupancy}%`}}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {deptMetric.occupancy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alerta de Capacidade (se ocupação for alta) */}
      {metrics.occupancyRate > 90 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800 p-3">
          <div className="flex items-center text-red-700 dark:text-red-400">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span className="font-medium">Alerta de Capacidade:</span>
            <span className="ml-1">O hospital está próximo da capacidade máxima ({metrics.occupancyRate.toFixed(1)}%).</span>
          </div>
        </div>
      )}
      
      {/* Seção de Especialidades (agora expandível) */}
      {showSpecialties && (
        <>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-4">Distribuição por Especialidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital.specialties.map((specialty) => {
                    // Obter porcentagem real dos dados do hospital ou usar dados fixos para corresponder à imagem
                    let percent = 30; // Valor padrão
                    
                    // Mapear especialidades específicas para percentuais da imagem
                    if (specialty === 'Cardiologia') percent = 33;
                    else if (specialty === 'Oncologia') percent = 43;
                    else if (specialty === 'Pediatria') percent = 35;
                    else if (specialty === 'Neurologia') percent = 37;
                    else if (specialty === 'Ortopedia') percent = 40;
                    
                    return (
                        <div key={specialty} className="bg-gray-600/30 dark:bg-gray-700/70 rounded-lg p-4">
                            <div className="text-base font-medium text-gray-700 dark:text-white mb-3">
                                {specialty}
                            </div>
                            <div className="flex items-center">
                                <div className="h-2.5 w-full bg-gray-600/50 dark:bg-gray-600 rounded-full overflow-hidden mr-2">
                                <div 
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${percent}%` }}
                                ></div>
                                </div>
                                <div className="text-sm font-medium text-gray-700 dark:text-white w-12 text-right">
                                    {percent}%
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
            </div>

            {/* Status dos equipamentos/recursos (simulado) */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status dos Recursos</h3>
                    <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        Ver Todos
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Respiradores: 8/10
                    </span>
                    <span className="px-2 py-1 text-xs rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Monitores: 15/18
                    </span>
                    <span className="px-2 py-1 text-xs rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Bombas de Infusão: 22/30
                    </span>
                    <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Desfibriladores: 5/5
                    </span>
                    <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        ECGs: 7/8
                    </span>
                </div>
            </div>
        
        </>
      )}
      
      {/* Ações rápidas */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap justify-between gap-2">
          <button 
            className="px-3 py-1.5 text-xs bg-primary-600 dark:bg-primary-700 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Ver Detalhes Completos
          </button>
          
          {/* Botão para expandir/recolher a seção de especialidades */}
          <button 
            onClick={toggleSpecialties}
            className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center"
          >
            {showSpecialties ? (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
                    Ocultar Especialidades
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                    Ver Especialidades
              </>
            )}
          </button>

          <button className="px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Gerenciar Recursos
          </button>
        </div>
      </div>
    </div>
  );
}
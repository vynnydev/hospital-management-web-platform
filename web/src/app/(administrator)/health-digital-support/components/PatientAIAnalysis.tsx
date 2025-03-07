import { useState } from 'react';

interface PatientAIAnalysisProps {
  patientId: string;
}

export default function PatientAIAnalysis({ patientId }: PatientAIAnalysisProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Simulação de dados baseados no ID do paciente para demonstração
  const patientIdNumber = Math.abs(parseInt(patientId.replace(/\D/g, '') || '0') % 100);
  
  // Gerar valores baseados no ID do paciente para demonstração
  const readmissionRisk = patientIdNumber;
  const predictedLOS = (patientIdNumber % 10) + 5;
  const caseComplexity = patientIdNumber % 3; // 0 = Baixa, 1 = Média, 2 = Alta
  const complianceScore = Math.min(100, Math.max(0, 100 - patientIdNumber)); // 0-100
  const resourceConsumption = patientIdNumber % 5 + 1; // 1-5 (onde 1 é baixo, 5 é alto)
  
  // Calcular recomendações baseadas nos valores simulados
  const getRecommendations = () => {
    const recommendations = [];
    
    if (readmissionRisk > 70) {
      recommendations.push("Monitoramento remoto após alta recomendado");
    }
    
    if (caseComplexity === 2) {
      recommendations.push("Considerar consulta multidisciplinar");
    }
    
    if (complianceScore < 50) {
      recommendations.push("Intensificar orientações sobre adesão ao tratamento");
    }
    
    if (resourceConsumption >= 4) {
      recommendations.push("Avaliar possibilidade de transferência para menor complexidade");
    }
    
    if (predictedLOS > 10) {
      recommendations.push("Iniciar planejamento de alta antecipadamente");
    }
    
    // Garantir que sempre haja pelo menos uma recomendação
    if (recommendations.length === 0) {
      recommendations.push("Seguir protocolo padrão para o caso");
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          Análise Preditiva (IA)
        </h4>
        <div className="flex items-center">
          <div className="text-xs text-purple-600 dark:text-purple-400 mr-2">
            Atualizado 10 min atrás
          </div>
          <svg 
            className={`w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <div className={`space-y-2 ${showDetails ? '' : 'hidden'}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Risco de Readmissão em 30 dias:</span>
          <div className="flex items-center">
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mr-2">
              <div 
                className={`h-full ${
                  readmissionRisk > 70 
                    ? 'bg-red-500 dark:bg-red-600' 
                    : readmissionRisk > 40 
                      ? 'bg-yellow-500 dark:bg-yellow-600' 
                      : 'bg-green-500 dark:bg-green-600'
                }`} 
                style={{width: `${readmissionRisk}%`}}
              />
            </div>
            <span className={`font-medium ${
              readmissionRisk > 70 
                ? 'text-red-600 dark:text-red-400' 
                : readmissionRisk > 40 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-green-600 dark:text-green-400'
            }`}>
              {readmissionRisk}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Tempo de Internação Previsto:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {predictedLOS} dias
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Complexidade do Caso:</span>
          <span className={`font-medium ${
            caseComplexity === 2 
              ? 'text-red-600 dark:text-red-400' 
              : caseComplexity === 1 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-green-600 dark:text-green-400'
          }`}>
            {caseComplexity === 2 
              ? 'Alta' 
              : caseComplexity === 1 
                ? 'Média' 
                : 'Baixa'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Adesão ao Tratamento:</span>
          <div className="flex items-center">
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mr-2">
              <div 
                className={`h-full ${
                  complianceScore < 30 
                    ? 'bg-red-500 dark:bg-red-600' 
                    : complianceScore < 70 
                      ? 'bg-yellow-500 dark:bg-yellow-600' 
                      : 'bg-green-500 dark:bg-green-600'
                }`} 
                style={{width: `${complianceScore}%`}}
              />
            </div>
            <span className={`font-medium ${
              complianceScore < 30 
                ? 'text-red-600 dark:text-red-400' 
                : complianceScore < 70 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-green-600 dark:text-green-400'
            }`}>
              {complianceScore}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Consumo de Recursos:</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                className={`w-4 h-4 ${
                  i < resourceConsumption
                    ? 'text-purple-500 dark:text-purple-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Recomendações da IA:</span>
          <ul className="mt-1 text-xs text-purple-700 dark:text-purple-300 space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-3 h-3 mt-0.5 mr-1 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {!showDetails && (
        <div className="flex text-xs text-gray-600 dark:text-gray-400 mt-1">
          <div className="flex items-center mr-4">
            <div className={`h-2 w-2 rounded-full mr-1 ${
              readmissionRisk > 70 
                ? 'bg-red-500' 
                : readmissionRisk > 40 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}></div>
            <span>Readmissão: {readmissionRisk}%</span>
          </div>
          <div className="flex items-center mr-4">
            <div className={`h-2 w-2 rounded-full mr-1 ${
              caseComplexity === 2 
                ? 'bg-red-500' 
                : caseComplexity === 1 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}></div>
            <span>Complexidade: {caseComplexity === 2 ? 'Alta' : caseComplexity === 1 ? 'Média' : 'Baixa'}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">LOS:</span>
            <span className="font-medium">{predictedLOS}d</span>
          </div>
        </div>
      )}
    </div>
  );
}
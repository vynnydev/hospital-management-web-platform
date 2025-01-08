import { 
    X, 
    Accessibility,
    Volume2,
    Eye,
} from 'lucide-react';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { FontSize, GeneratedData, Patient, VitalSign } from '../types/types';
import { AIPatientAssistant } from './AIPatientAssistant';

interface PatientCardModal {
    selectedPatient: Patient | null
    setSelectedPatient: (patient: Patient | null) => void;  // Alterado para aceitar null
    generateData: (patient: Patient) => Promise<void>;      // Alterado para Promise<void>
    isHighContrast: boolean,
    setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>>,
    setShowAudioControls: React.Dispatch<React.SetStateAction<boolean>>,
    showAudioControls: boolean,
    setFontSize: (size: FontSize) => void;
    fontSize: FontSize,
    aiQuery: string,
    setAiQuery: React.Dispatch<React.SetStateAction<string>>,
    generatedData: GeneratedData,
    setCurrentUtterance: React.Dispatch<React.SetStateAction<SpeechSynthesisUtterance | null>>,
    setSynthesis: React.Dispatch<React.SetStateAction<SpeechSynthesis | null>>,
    synthesis: SpeechSynthesis | null,
}

export const PatientCardModal: React.FC<PatientCardModal> = ({
    selectedPatient,
    setSelectedPatient,
    isHighContrast,
    setIsHighContrast,
    setShowAudioControls,
    showAudioControls,
    fontSize,
    setFontSize,
    aiQuery,
    setAiQuery,
    generatedData,
    setCurrentUtterance,
    setSynthesis,
    synthesis
}) => {
    const getContrastClass = (baseClass: string) => {
        if (!isHighContrast) return baseClass;
        return `${baseClass} contrast-high brightness-110`;
    };

    const generateProgressData = (vitals: VitalSign[]) => {
        return vitals.map(vital => ({
            date: new Date(vital.timestamp).toLocaleDateString(),
            progress: vital.oxygenSaturation,
            temperature: vital.temperature,
            heartRate: vital.heartRate
        }));
    };
    
    return (
        <div>
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={getContrastClass("bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto")}>
                        {/* Barra de Acessibilidade */}
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 flex justify-end gap-2">
                            <button
                                onClick={() => setIsHighContrast(!isHighContrast)}
                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                aria-label="Alternar alto contraste"
                                title="Alto Contraste (Alt + C)"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowAudioControls(!showAudioControls)}
                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                aria-label="Controles de áudio"
                                title="Narração (Alt + A)"
                            >
                                <Volume2 className="w-5 h-5" />
                            </button>
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value as FontSize)}
                                className="p-2 rounded bg-transparent"
                                aria-label="Tamanho da fonte"
                            >
                                <option value="normal">Fonte: Normal</option>
                                <option value="large">Fonte: Grande</option>
                                <option value="extra-large">Fonte: Extra Grande</option>
                            </select>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 relative">
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="absolute right-4 top-4 text-white hover:text-red-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-white">
                                {selectedPatient.personalInfo.name}
                            </h2>
                            <div className="text-blue-100 space-y-1">
                                <p>{selectedPatient.admission.reason}</p>
                                <p className="text-sm">
                                {selectedPatient.personalInfo.age} anos • {selectedPatient.personalInfo.bloodType}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Accessibility className="w-5 h-5 text-white" />
                                <Volume2 className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Seção de Recomendações da IA com Controles de Acessibilidade */}
                        <AIPatientAssistant 
                            fontSize={fontSize}
                            showAudioControls={showAudioControls}
                            generatedData={generatedData}
                            isHighContrast={isHighContrast}
                            setCurrentUtterance={setCurrentUtterance}
                            setSynthesis={setSynthesis}
                            setShowAudioControls={setShowAudioControls}
                            synthesis={synthesis}
                        />

                        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Sinais Vitais
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={generateProgressData(selectedPatient.treatment.vitals)}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                        <Line 
                                            type="monotone" 
                                            dataKey="heartRate" 
                                            stroke="#ef4444" 
                                            name="Freq. Cardíaca"
                                            strokeWidth={2}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="temperature" 
                                            stroke="#f97316" 
                                            name="Temperatura"
                                            strokeWidth={2}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="progress" 
                                            stroke="#0ea5e9" 
                                            name="Saturação"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Análise de Risco
                            </h4>
                            <div className="space-y-2">
                                <p className="text-gray-600 dark:text-gray-300">
                                Score de Risco: {selectedPatient.aiAnalysis.riskScore * 100}%
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                Permanência Prevista: {selectedPatient.aiAnalysis.predictedLOS} dias
                                </p>
                                <div className="text-gray-600 dark:text-gray-300">
                                <p className="font-semibold">Fatores de Risco:</p>
                                <ul className="list-disc list-inside">
                                    {selectedPatient.aiAnalysis.complications.factors.map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                    ))}
                                </ul>
                                </div>
                            </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Recomendações
                            </h4>
                            <ul className="space-y-2">
                                {selectedPatient.aiAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="text-gray-600 dark:text-gray-300">
                                    • {rec}
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Pergunte à IA sobre os cuidados do paciente..."
                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                                    border border-gray-200 dark:border-gray-600
                                    text-gray-800 dark:text-white
                                    focus:ring-2 focus:ring-blue-500 transition-all"
                            rows={3}
                            />
                            
                            <button className="w-full py-3 px-4 rounded-lg
                                            bg-gradient-to-r from-bg-gradient-to-r from-blue-500 to-teal-500
                                            text-white font-semibold
                                            hover:opacity-90 transition-opacity
                                            focus:ring-2 focus:ring-blue-500">
                            Gerar Diagrama de Protocolo de Cuidados
                            </button>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Medicações Atuais
                                </h4>
                                <div className="space-y-2">
                                {selectedPatient.treatment.medications.map((med, index) => (
                                    <div 
                                    key={index}
                                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                    >
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {med.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {med.dosage} • {med.frequency}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Início: {new Date(med.startDate).toLocaleDateString()} • 
                                        Duração: {med.duration}
                                    </p>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Procedimentos Realizados
                                </h4>
                                <div className="space-y-2">
                                {selectedPatient.treatment.procedures.map((proc, index) => (
                                    <div 
                                    key={index}
                                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                    >
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {proc.type}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {proc.notes}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Data: {new Date(proc.date).toLocaleDateString()}
                                    </p>
                                    </div>
                                ))}
                                </div>
                            </div>
                            </div>

                            <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                Histórico de Status
                                </h4>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                Previsão de Alta: {selectedPatient.admission.predictedDischarge}
                                </div>
                            </div>
                            <div className="space-y-2">
                                {selectedPatient.admission.statusHistory
                                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                    .map((status, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 
                                                    dark:bg-gray-700 rounded-lg"
                                        >
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                            {status.status}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {status.department}
                                            </p>
                                        </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(status.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                ))}
                            </div>
                            </div>

                            <div className="mt-6">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                Informações do Leito
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Número do Leito</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.admission.bed.number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Ala</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.admission.bed.wing}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.admission.bed.type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID do Leito</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {selectedPatient.admission.bed.id}
                                    </p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Activity, Calendar, Heart, Hospital } from 'lucide-react';

// Reutilizando a interface do documento original
export interface IQRViewPatientData {
    patient: {
        id: string;
        name: string;
        admissionDate: string;
        diagnosis: string;
        status: {
            current: string;
            department: string;
            specialties: string;
        };
        medications: Array<{
            nome: string;
            description: string;
        }>;
        lastProcedure: {
            procedureType: string;
            description: string;
        } | null;
    };
}

export default function QRCodeView() {
    const [patientData, setPatientData] = useState<IQRViewPatientData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            try {
                const decodedData = JSON.parse(atob(data));
                setPatientData(decodedData);
            } catch (error) {
                console.error('Erro ao decodificar dados:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    // Tela de carregamento
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-500">Carregando dados...</p>
                </div>
            </div>
        );
    }

    // Tela de dados não encontrados
    if (!patientData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-500">Dados não encontrados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-lg text-white mb-6">
                <h1 className="text-2xl font-bold mb-2">{patientData.patient.name}</h1>
                <p className="text-lg opacity-90">{patientData.patient.diagnosis}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        ID: {patientData.patient.id}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {patientData.patient.admissionDate}
                    </span>
                </div>
            </div>

            {/* Status Atual */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Status Atual
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{patientData.patient.status.current}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Departamento</p>
                        <p className="font-medium">{patientData.patient.status.department}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Especialidade</p>
                        <p className="font-medium">{patientData.patient.status.specialties}</p>
                    </div>
                </div>
            </div>

            {/* Medicações */}
            {patientData.patient.medications && patientData.patient.medications.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Medicações Atuais
                    </h2>
                    <div className="space-y-3">
                        {patientData.patient.medications.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{med.nome}</p>
                                <p className="text-sm text-gray-600 mt-1">{med.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Último Procedimento */}
            {patientData.patient.lastProcedure && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Hospital className="w-5 h-5 text-green-500" />
                        Último Procedimento
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium">{patientData.patient.lastProcedure.procedureType}</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {patientData.patient.lastProcedure.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
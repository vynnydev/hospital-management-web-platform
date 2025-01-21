/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Hospital, NetworkInfo, Patient, HospitalMetrics } from '../types/types';
import { DepartmentAreaCards } from './DepartmentAreaCards';
import { PatientTaskManagement } from './PatientTaskManagement';
import { PatientReportCard } from './PatientReportCard';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

export const PatientManagementComponent: React.FC = () => {
    // Estados para a nova estrutura
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [metrics, setMetrics] = useState<HospitalMetrics>({
        capacity: {
            total: {
                maxBeds: 0,
                maxOccupancy: 0
            },
            departmental: {}
        },
        overall: {
            occupancyRate: 0,
            totalPatients: 0,
            availableBeds: 0,
            avgStayDuration: 0,
            turnoverRate: 0,
            totalBeds: 0,
            lastUpdate: new Date().toISOString(),
            periodComparison: {
                occupancy: { value: 0, trend: 'up' },
                patients: { value: 0, trend: 'up' },
                beds: { value: 0, trend: 'up' }
            }
        },
        departmental: {}
    });
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [isOpen, setIsOpen] = useState(false);

    // Efeito para carregar dados da API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fazendo uma única chamada para obter todos os dados
                const response = await axios.get('http://localhost:3001/');
                const data = response.data;

                setNetworkInfo(data.networkInfo);
                setHospitals(data.hospitals);

                // Seleciona o primeiro hospital por padrão ou mantém a seleção atual
                const defaultHospital = data.hospitals[0];
                setSelectedHospital(defaultHospital);
                
                if (defaultHospital) {
                    setMetrics(defaultHospital.metrics);
                }

            } catch (err: any) {
                const errorMessage = err.response?.status === 404
                    ? 'Dados não encontrados no servidor'
                    : err.response?.status === 500
                    ? 'Erro interno do servidor'
                    : `Erro ao carregar os dados: ${err.message}`;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Efeito para atualizar métricas quando o hospital selecionado muda
    useEffect(() => {
        if (selectedHospital) {
            setMetrics(selectedHospital.metrics);
        }
    }, [selectedHospital]);

    // Filtrar pacientes com base no departamento selecionado
    const filteredPatients = selectedArea === ''
        ? (selectedHospital?.patients || [])
        : (selectedHospital?.patients || []).filter(patient => {
            const currentDepartment = patient.admission.bed.type.trim().toLowerCase();
            const hasHistoryInDepartment = patient.admission.statusHistory.some(
                history => history.department.trim().toLowerCase() === selectedArea.trim().toLowerCase()
            );
            return currentDepartment === selectedArea.trim().toLowerCase() || hasHistoryInDepartment;
        });

    // Construir o objeto de departamentos
    const departments = Object.keys(metrics.departmental || {}).reduce(
        (acc, department) => {
            const departmentKey = department as keyof typeof metrics.departmental;
            acc[department.toLowerCase()] = metrics.departmental[departmentKey]?.validStatuses?.map(status => status.toLowerCase()) ?? [];
            return acc;
        },
        {} as Record<string, string[]>
    );

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleRetry = () => {
        setError(null);
        window.location.reload();
    };

    // Handler para mudança de hospital
    const handleHospitalChange = (hospitalId: string) => {
        const hospital = hospitals.find(h => h.id === hospitalId);
        if (hospital) {
            setSelectedHospital(hospital);
            setSelectedArea('');
            setSelectedPatient(null);
        }
    };

    console.log("Patients:", filteredPatients)

    return (
        <div className='min-h-screen p-4 transition-all duration-500'>
            {/* Seletor de Hospital */}
            {!loading && !error && (
                <div className="mb-4">
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedHospital?.id || ''}
                        onChange={(e) => handleHospitalChange(e.target.value)}
                    >
                        {hospitals.map(hospital => (
                            <option key={hospital.id} value={hospital.id}>
                                {hospital.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-8">
                <div className="col-span-3">
                    <DepartmentAreaCards
                        departments={Object.entries(metrics.departmental || {}).map(([area, data]) => ({
                            area,
                            count: data.patients,
                            capacity: data.beds,
                        }))}
                        onClick={setSelectedArea}
                        selectedArea={selectedArea}
                        loading={loading}
                        error={error}
                        onRetry={handleRetry}
                    />
                </div>

                <div className="col-span-2">
                    <PatientTaskManagement
                        patients={filteredPatients}
                        selectedArea={selectedArea}
                        onSelect={setSelectedPatient}
                        departments={departments}
                        data={metrics}
                        onClose={handleClose}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        loading={loading}
                        error={error}
                        onRetry={handleRetry}
                    />
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Carregando dados...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
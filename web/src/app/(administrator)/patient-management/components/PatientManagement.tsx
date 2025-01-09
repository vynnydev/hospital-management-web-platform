/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Metrics, Patient } from '../types/types';
import { DepartmentAreaCards } from './DepartmentAreaCards';
import { PatientTaskManagement } from './PatientTaskManagement';
import { PatientReportCard } from './PatientReportCard';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

export const PatientManagementComponent: React.FC = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedArea, setSelectedArea] = useState<string>('todos');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [metricsRes, patientsRes] = await Promise.all([
                    axios.get('http://localhost:3001/metrics'),
                    axios.get('http://localhost:3001/patients')
                ]);
                setMetrics(metricsRes.data);
                setPatients(patientsRes.data);
            } catch (err) {
                setError(`Erro ao carregar os dados: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!metrics) {
        return <p>Carregando dados de métricas...</p>;
    }

    // Filtrar pacientes com base no departamento selecionado
    const filteredPatients = selectedArea === 'todos'
    ? patients
    : patients.filter(patient => {
        // console.log("Area Selecionada:", selectedArea)
        const currentDepartment = patient.admission.bed.type.trim().toLowerCase();
        // console.log("Departamento atual:", currentDepartment)
        const hasHistoryInDepartment = patient.admission.statusHistory.some(
            history => history.department.trim().toLowerCase() === selectedArea.trim().toLowerCase()
        );
        // console.log("History departament:", hasHistoryInDepartment)
        return currentDepartment === selectedArea.trim().toLowerCase() || hasHistoryInDepartment;
    });

    // console.log("Pacientes filtrados:", filteredPatients);

    // Construir o objeto de departamentos
    const departments = Object.keys(metrics.departmental).reduce(
        (acc, department) => {
            const departmentKey = department as keyof typeof metrics.departmental;
            acc[department.toLowerCase()] = metrics.departmental[departmentKey]?.validStatuses?.map(status => status.toLowerCase()) ?? [];
            return acc;
        },
        {} as Record<string, string[]>
    );
    // console.log("Construção do objeto de departamento:", departments)

    departments.todos = Object.keys(departments).flatMap(dept => departments[dept]);
    console.log(departments)

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className='min-h-screen p-4 transition-all duration-500'>
            {loading && <p>Carregando dados...</p>}
            {error && <p className='text-red-500'>{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-3">
                        <DepartmentAreaCards
                            departments={[
                                { area: 'todos', count: patients.length, capacity: metrics.capacity.total.maxBeds || 0 },
                                ...Object.entries(metrics.departmental).map(([area, data]) => ({
                                    area,
                                    count: data.patients,
                                    capacity: data.beds,
                                })),
                            ]}
                            onClick={(area) => setSelectedArea(area)} // Atualiza o estado
                            selectedArea={selectedArea}
                        />
                    </div>

                    <div className="col-span-2">
                        <PatientTaskManagement
                            patients={filteredPatients} // Pacientes filtrados
                            selectedArea={selectedArea} // Departamento selecionado
                            onSelect={setSelectedPatient} // Função para selecionar paciente
                            departments={departments} // Passa os departamentos corrigidos
                            data={metrics}
                            onClose={handleClose}
                            fontSize={fontSize}
                            setFontSize={setFontSize}
                        />
                    </div>

                    {/* <div>
                        <PatientReportCard patient={selectedPatient} />
                    </div> */}
                </div>
            )}
        </div>
    );
};


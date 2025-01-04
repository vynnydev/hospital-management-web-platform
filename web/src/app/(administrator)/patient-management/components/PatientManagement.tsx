import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Metrics, Patient } from '../types/types';
import { PatientAreaCard } from './PatientAreaCard';
import { PatientTable } from './PatientTable';
import { PatientReportCard } from './PatientReportCard';

export const PatientManagementComponent: React.FC = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedArea, setSelectedArea] = useState<string>('todos');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const filteredPatients = selectedArea === 'todos'
        ? patients
        : patients.filter(patient => patient.admission.bed.type.toLowerCase() === selectedArea.toLowerCase());

    return (
        <div className='min-h-screen p-4 transition-all duration-500'>
            {loading && <p>Carregando dados...</p>}
            {error && <p className='text-red-500'>{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 flex gap-4">
                        <PatientAreaCard
                            area="todos"
                            count={patients.length}
                            capacity={metrics?.capacity.total.maxBeds || 0}
                            onClick={() => setSelectedArea('todos')}
                            selected={selectedArea === 'todos'}
                        />
                        {metrics && Object.entries(metrics.departmental).map(([area, data]) => (
                            <PatientAreaCard
                                key={area}
                                area={area}
                                count={data.patients}
                                capacity={data.maxBeds}
                                onClick={() => setSelectedArea(area)}
                                selected={selectedArea === area}
                            />
                        ))}
                    </div>

                    <div className="col-span-2">
                        <PatientTable patients={filteredPatients} onSelect={setSelectedPatient} />
                    </div>

                    <div>
                        <PatientReportCard patient={selectedPatient} />
                    </div>
                </div>
            )}
        </div>
    );
};
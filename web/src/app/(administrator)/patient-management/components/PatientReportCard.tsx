import React from 'react';
import { motion } from 'framer-motion';
import { IPatient } from '@/types/hospital-network-types';

export const PatientReportCard: React.FC<{ patient: IPatient | null }> = ({ patient }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 border rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-lg">
            {patient ? (
                <>
                    <h2 className="text-xl font-bold">Relatório de {patient.personalInfo.name}</h2>
                    <p className="mt-2">Idade: {patient.personalInfo.age}</p>
                    <p className="mt-2">Leito: {patient.admission.bed.type}</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Diagnóstico detalhado gerado por IA estará disponível aqui.
                    </p>
                </>
            ) : (
                <p className="text-gray-600 dark:text-gray-300">Nenhum paciente selecionado</p>
            )}
        </motion.div>
    );
};
import React, { useState } from 'react';
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, X } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { generateQRCodeUrl } from '@/utils/generateQRCodeUrl';
import { QRCodeComponent } from '@/components/ui/templates/QRCodeComponent';
import type { IPatient } from '@/types/hospital-network-types';
import { getLatestStatus } from '@/utils/patientDataUtils';
import { PatientFlowDiagram } from '../workflow/PatientFlowDiagram';

interface PatientHeaderProps {
  patient: IPatient;
  onClose: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const qrCodeUrl = generateQRCodeUrl(patient);

    const handleCloseModal = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    if (!patient) return null;

    const latestStatus = getLatestStatus(patient);

    return (
        <>
            <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 p-8 rounded-xl relative overflow-hidden shadow-lg"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full transition-all"
                >
                    <X className="w-6 h-6" />
                </Button>

                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-4 pt-8">
                        <div className='flex flex-row space-x-4'>
                            <div className="flex-shrink-0 -mt-1">
                                {patient.photo && (patient.photo.startsWith('http') || patient.photo.startsWith('/')) ? (
                                    <Image
                                        src={patient.photo}
                                        alt={`Foto de ${patient.name}`}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                        height={48}
                                        width={48}
                                        priority
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-blue-500 flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <motion.h2 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="text-3xl font-bold text-white"
                            >
                                {patient.name}
                            </motion.h2>
                        </div>
                    
                        <div className="text-blue-50 space-y-2 px-16">
                            <p className="text-lg font-medium">{patient.diagnosis}</p>
                            <p className="text-sm bg-white/10 px-3 py-1 rounded-full inline-block">
                                Admissão: {new Date(patient.admissionDate).toLocaleDateString()}
                            </p>
                        </div>
                    
                        {/* Status badges */}
                        <div className="flex gap-2 px-16">
                            <span className="px-4 py-1.5 bg-blue-500/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                {latestStatus?.status || 'Status não disponível'}
                            </span>
                            <span className="px-4 py-1.5 bg-cyan-500/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                {latestStatus?.department || 'Departamento não disponível'}
                            </span>
                            <span className="px-4 py-1.5 bg-cyan-500/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                {patient?.id || 'ID não disponível'}
                            </span>
                        </div>

                        <div className="pt-4 px-16">
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => setIsModalOpen(true)}
                                className="w-fit bg-white/10 text-white hover:bg-white/20 gap-2"
                            >
                                <Activity className="w-4 h-4" />
                                Fluxo de Internação
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 pt-8">
                        <div className="p-2 bg-white rounded-xl shadow-lg transform transition-transform hover:scale-105">
                            <QRCodeComponent value={qrCodeUrl} />
                        </div>
                        <span className="text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full">
                            Escaneie para visualizar detalhes
                        </span>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold dark:text-white">
                                    Fluxo de Internação - {patient.name}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsModalOpen(false)}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                <PatientFlowDiagram patientId={patient.id} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
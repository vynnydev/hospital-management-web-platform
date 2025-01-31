import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { generateQRCodeUrl } from '@/utils/generateQRCodeUrl';
import { QRCodeComponent } from '@/components/ui/templates/QRCodeComponent';
import type { IPatient } from '@/types/hospital-network-types';
import { getLatestStatus } from '@/utils/patientDataUtils';

interface PatientHeaderProps {
  patient: IPatient;
  onClose: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient, onClose }) => {
    const qrCodeUrl = generateQRCodeUrl(patient);

    if (!patient) return null;

    const latestStatus = getLatestStatus(patient);

    return (
        <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 p-8 rounded-xl relative overflow-hidden shadow-lg"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
            {/* Close button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full transition-all"
            >
                <X className="w-6 h-6" />
            </Button>

            {/* Content container */}
            <div className="flex justify-between items-start relative z-10">
                {/* Patient info */}
                <div className="space-y-4 pt-8">
                    <motion.h2 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-3xl font-bold text-white"
                    >
                        {patient.name}
                    </motion.h2>
                
                    {/* Clinical info */}
                    <div className="text-blue-50 space-y-2">
                        <p className="text-lg font-medium">{patient.diagnosis}</p>
                        <p className="text-sm bg-white/10 px-3 py-1 rounded-full inline-block">
                        Admissão: {new Date(patient.admissionDate).toLocaleDateString()}
                        </p>
                    </div>
                
                    {/* Status badges */}
                    <div className="flex gap-2 mt-2">
                        <span className="px-4 py-1.5 bg-blue-500/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {latestStatus?.status || 'Status não disponível'}
                        </span>
                        <span className="px-4 py-1.5 bg-cyan-500/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {latestStatus?.department || 'Departamento não disponível'}
                        </span>
                    </div>
                </div>

                {/* QR Code section */}
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
    );
};
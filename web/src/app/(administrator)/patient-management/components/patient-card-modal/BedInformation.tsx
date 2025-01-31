import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import type { IPatient } from '@/types/hospital-network-types';

interface BedInformationProps {
  patient: IPatient;
}

export const BedInformation: React.FC<BedInformationProps> = ({ patient }) => {
  const admissionEvent = patient.careHistory?.events.find(e => e.type === 'admission');

  const qrCodeData = {
    admissionEvent: admissionEvent || {},
    patientId: patient.id
  };

  return (
    <div className="pt-8">
      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
        Informações do Leito
      </h4>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Departamento
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {admissionEvent?.department || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Destino
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {admissionEvent?.details?.toDepartment || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Responsável
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {admissionEvent?.responsibleStaff.name || 'N/A'}
            </p>
          </div>
        </div>
        <QRCodeCanvas 
          value={JSON.stringify(qrCodeData)} 
          size={80} 
        />
      </div>
    </div>
  );
};
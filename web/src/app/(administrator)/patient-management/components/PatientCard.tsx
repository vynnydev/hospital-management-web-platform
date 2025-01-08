import Image from 'next/image'
import { Patient } from '../types/types';

interface PatientCardProps {
  patient: Patient;
  status: string
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
    patient,
    status
}) => { 
    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                    <Image
                        src="/images/default-avatar.png"
                        alt={patient.personalInfo.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                    />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800 dark:text-white">
                        {patient.personalInfo.name}
                    </p>
                <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm">
                    {status}
                    </span>
                    <span
                    className={`px-2 py-1 rounded-full text-sm ${
                        patient.aiAnalysis.riskScore > 0.7
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        : patient.aiAnalysis.riskScore > 0.4
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    }`}
                    >
                    Risco: {(patient.aiAnalysis.riskScore * 100).toFixed(0)}%
                    </span>
                </div>
                </div>
            </div>
        </div>
    )
}
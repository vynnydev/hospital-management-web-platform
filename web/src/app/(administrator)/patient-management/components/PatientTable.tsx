import Image from 'next/image';
import { Patient } from '../types/types';
import { FaRegFileAlt, FaQrcode } from 'react-icons/fa';

const departmentColors: Record<string, string> = {
    todos: 'bg-gray-300 dark:bg-gray-600',
    uti: 'bg-red-400 dark:bg-red-900',
    enfermaria: 'bg-blue-400 dark:bg-blue-900',
    pediatria: 'bg-green-400 dark:bg-green-900',
    cardiologia: 'bg-purple-400 dark:bg-purple-900',
    oncologia: 'bg-yellow-100 dark:bg-yellow-900',
    neurologia: 'bg-blue-100 dark:bg-blue-900',
};

export const PatientTable: React.FC<{ patients: Patient[]; onSelect: (patient: Patient) => void }> = ({ patients, onSelect }) => {
    console.log(patients)
    return (
        <div className="overflow-hidden rounded-xl shadow-lg">
            <table className="table-auto w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-900">
                        <th className="p-4 text-left">Foto</th>
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">Idade</th>
                        <th className="p-4 text-left">Departamento</th>
                        <th className="p-4 text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                    <tr
                        key={patient.id}
                        onClick={() => onSelect(patient)}
                        className={`cursor-pointer transition-colors ${
                            patient.admission.bed.type && departmentColors[patient.admission.bed.type.toLowerCase()]
                                ? departmentColors[patient.admission.bed.type.toLowerCase()]
                                : departmentColors.default
                        }`}
                        >
                            <td className="p-2">
                                <Image
                                    src={patient.personalInfo.photo?.startsWith('http') ? patient.personalInfo.photo : '/default-avatar.png'}
                                    alt=''
                                    width={50}
                                    height={50}
                                    className="rounded-full border border-gray-300"
                                />
                            </td>
                            <td className="p-4 font-medium">{patient.personalInfo.name}</td>
                            <td className="p-4">{patient.personalInfo.age}</td>
                            <td className="p-4 font-semibold">{patient.admission.bed.type}</td>
                            <td className="p-4 flex gap-4">
                                <button title="Relatórios">
                                    <FaRegFileAlt className="text-blue-500 hover:text-blue-700" />
                                </button>
                                <button title="QR Code">
                                    <FaQrcode className="text-green-500 hover:text-green-700" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

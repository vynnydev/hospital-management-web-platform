import React from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaHeart, FaChild, FaUserNurse, FaProcedures } from 'react-icons/fa';

const departmentColors: Record<string, string> = {
    todos: 'bg-gray-200 dark:bg-gray-700',
    uti: 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    enfermaria: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    pediatria: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    cardiologia: 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

const departmentStatusBarColors: Record<string, string> = {
    todos: 'bg-gray-300 dark:bg-gray-400',
    uti: 'bg-red-400 dark:bg-red-600',
    enfermaria: 'bg-blue-400 dark:bg-blue-600',
    pediatria: 'bg-green-400 dark:bg-green-600',
    cardiologia: 'bg-purple-400 dark:bg-purple-600'
};

const departmentIcons: Record<string, JSX.Element> = {
    todos: <FaHospital />,
    uti: <FaHeart />,
    enfermaria: <FaUserNurse />,
    pediatria: <FaChild />,
    cardiologia: <FaProcedures />
};

export const PatientAreaCard: React.FC<{ 
    area: string; 
    count: number; 
    capacity: number; 
    onClick: () => void; 
    selected: boolean; 
}> = ({ area, count, capacity, onClick, selected }) => {
    const progressPercentage = (count / capacity) * 100;

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 shadow-lg flex flex-col justify-between ${selected ? `${departmentColors[area].replace('200', '400')}` : departmentColors[area]}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="p-2 rounded-md bg-white shadow-md flex items-center justify-center">
                    {departmentIcons[area]}
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{area}</h3>
            </div>
            <div className="mt-2">
                <p className="font-semibold text-gray-600 dark:text-gray-300">{count}/{capacity} pacientes</p>
            </div>
            <div className="w-full mt-4 bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className={`${departmentStatusBarColors[area]} h-full transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </motion.div>
    );
};
import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { FaHeart, FaChild, FaUserNurse, FaProcedures, FaHospital } from 'react-icons/fa';
import { AlertCircle } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const departmentColors: Record<string, string> = {
    uti: 'from-red-400 via-red-600 to-red-800',
    enfermaria: 'from-blue-400 via-blue-600 to-blue-800',
    pediatria: 'from-green-400 via-green-600 to-green-800',
    cardiologia: 'from-purple-400 via-purple-600 to-purple-800',
    placeholder: 'from-gray-400 via-gray-600 to-gray-800'
};

const departmentIcons: Record<string, JSX.Element> = {
    uti: <FaHeart size={24} />,
    enfermaria: <FaUserNurse size={24} />,
    pediatria: <FaChild size={24} />,
    cardiologia: <FaProcedures size={24} />,
    placeholder: <FaHospital size={24} />
};

interface IDepartmentAreaCardsProps {
    departments: { area: string; count: number; capacity: number }[];
    onClick: (area: string) => void;
    selectedArea: string;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

const EmptyCard: React.FC = () => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative p-6 rounded-2xl cursor-default transition-all duration-300 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-[200px] h-[220px] border border-gray-200 dark:border-gray-700"
    >
        <div className="p-8 flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <div className="relative p-6 rounded-2xl cursor-default transition-all duration-300 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-[200px] h-[220px] border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full shadow-inner">
                        <svg 
                            className="w-10 h-10 text-gray-400 dark:text-gray-500"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M8 9l4-4 4 4m0 6l-4 4-4-4" 
                            />
                        </svg>
                    </div>
                    <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                    <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
        </div>
    </motion.div>
);

const ErrorCard: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative p-4 rounded-2xl cursor-pointer transition-transform duration-300 shadow-lg bg-gradient-to-br from-red-400 via-red-600 to-red-800 w-[150px] h-[220px]"
        onClick={onRetry}
    >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent blur-lg opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-3 bg-black/40 rounded-full shadow-md">
                <AlertCircle size={24} className="text-white/80" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-white">
                    {message}
                </p>
                {onRetry && (
                    <button 
                        className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs text-white transition-colors"
                        onClick={onRetry}
                    >
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

const LoadingCard: React.FC = () => (
    <motion.div
        className="relative p-4 rounded-2xl cursor-default transition-transform duration-300 shadow-lg bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 w-[150px] h-[220px]"
    >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent blur-lg opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-300/30 rounded-full"></div>
                <div className="mt-4 h-4 w-20 bg-gray-300/30 rounded"></div>
                <div className="mt-2 h-3 w-16 bg-gray-300/30 rounded"></div>
                <div className="mt-4 h-2 w-full bg-gray-300/30 rounded-full"></div>
            </div>
        </div>
    </motion.div>
);

export const DepartmentAreaCards: React.FC<IDepartmentAreaCardsProps> = ({ 
    departments, 
    onClick, 
    selectedArea,
    loading,
    error,
    onRetry 
}) => {
    const uniqueDepartments = Array.from(
        new Map(departments.map((dept) => [dept.area, dept])).values()
    );

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    if (loading) {
        return (
            <Slider {...settings} className="mt-6 gap-x-4">
                {[1, 2, 3, 4, 5].map((index) => (
                    <LoadingCard key={`loading-${index}`} />
                ))}
            </Slider>
        );
    }

    if (error) {
        return (
            <Slider {...settings} className="mt-6 gap-x-4">
                <ErrorCard message="Erro ao carregar departamentos" onRetry={onRetry} />
                {[1, 2, 3, 4].map((index) => (
                    <div key={`space-${index}`} className="w-[150px] h-[220px]" />
                ))}
            </Slider>
        );
    }

    if (uniqueDepartments.length === 0) {
        return (
            <Slider {...settings} className="mt-6 gap-x-4">
                <EmptyCard />
                {[1, 2, 3, 4].map((index) => (
                    <div key={`space-${index}`} className="w-[150px] h-[220px]" />
                ))}
            </Slider>
        );
    }

    return (
        <Slider {...settings} className="mt-6 gap-x-4">
            {uniqueDepartments.map(({ area, count, capacity }) => {
                const progressPercentage = (count / capacity) * 100;
                const isSelected = selectedArea === area;

                return (
                    <motion.div
                        key={area}
                        whileHover={{ scale: 1.05 }}
                        className={`relative p-4 rounded-2xl cursor-pointer transition-transform duration-300 shadow-lg bg-gradient-to-br ${departmentColors[area]} w-[150px] h-[220px] ${
                            isSelected ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                        }`}
                        onClick={() => onClick(area)}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent blur-lg opacity-50 pointer-events-none"></div>
                        <div className="relative z-10 flex justify-between items-center mb-4">
                            <div className="p-2 bg-black/40 rounded-full shadow-md flex items-center justify-center">
                                {departmentIcons[area]}
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                                {area}
                            </h3>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-white mb-2">
                                {count}/{capacity} pacientes
                            </p>
                            <div className="w-full mt-2 bg-white/30 rounded-full h-2">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </Slider>
    );
};